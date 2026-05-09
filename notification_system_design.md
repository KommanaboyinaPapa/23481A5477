# Notification System Design

## Stage 1

### Problem Statement

Users of the campus notification platform lose track of important notifications due to high volume. We need a **Priority Inbox** that surfaces the top **N** most critical unread notifications (where N is user-configurable: 10, 15, 20, etc.) based on a combination of **type weight** and **recency**.

---

### Approach

#### 1. Weighted Priority Scoring

Each notification is assigned a **composite score** that combines two factors:

| Factor | Description | Implementation |
|--------|------------|---------------|
| **Type Weight** | Placement notifications are most critical, followed by Results, then Events | `Placement = 3`, `Result = 2`, `Event = 1` |
| **Recency** | Newer notifications should rank higher among the same type | Inverse of age: `1,000,000 / (1 + ageSec)` |

**Composite Score Formula:**

```
score = typeWeight × 10,000,000 + recencyScore
```

The large multiplier on `typeWeight` ensures that type always dominates over recency, while recency serves as the tie-breaker within the same type.

#### 2. Data Structure — Max-Heap (Priority Queue)

We use a **binary max-heap** to maintain and extract the top-N notifications efficiently.

**Why a heap?**

| Operation | Array Sort | Max-Heap |
|-----------|-----------|----------|
| Build from N items | O(n log n) | O(n) |
| Extract top-K | O(k) after sort | O(k log n) |
| Insert 1 new item | O(n log n) re-sort | O(log n) |
| **Total for streaming** | **O(n log n)** per batch | **O(log n)** per insert |

For a streaming scenario where new notifications arrive continuously, the heap lets us **insert in O(log n)** and **extract-max in O(log n)** without re-sorting the entire list.

#### 3. Algorithm Steps

```
1. Fetch all notifications from GET /evaluation-service/notifications
2. For each notification:
   a. Compute composite score = typeWeight × 10,000,000 + recencyScore
   b. Insert into a max-heap
3. Extract top-N from the heap
4. Return ranked list
```

#### 4. Handling Streaming Updates

When new notifications arrive, we **do not recompute from scratch**:

```
1. Merge new notifications into the existing heap
2. Re-extract top-N from the merged heap
```

This is implemented in the `mergeNewNotifications()` function, which combines the existing top-N with new arrivals and re-ranks.

---

### Code Structure

```
notification_app_be/
├── index.js               # Entry point — fetches, ranks, displays
├── priorityInbox.js       # Max-heap, scoring, top-N extraction
├── notificationService.js # API client for notifications endpoint
└── package.json
```

---

### Example Output

```
🏫 Campus Notifications — Priority Inbox (Top 10)

Rank  Type        Score             Timestamp               Message
#1    Placement   30000999.85       2026-04-22 17:51:18     CSX Corporation hiring
#2    Result      20000998.32       2026-04-22 17:51:30     mid-sem
#3    Event       10000997.10       2026-04-22 17:50:00     Tech Fest Registration
...
```

---

### Complexity Analysis

| Metric | Value |
|--------|-------|
| **Time** — build heap from n notifications | O(n) |
| **Time** — extract top-k | O(k log n) |
| **Time** — insert new notification | O(log n) |
| **Space** | O(n) for the heap |
| **Overall for top-10 from 1000** | ~O(1000 + 10 × 10) ≈ O(n) |

---

### Trade-offs & Design Decisions

1. **Type weight dominance**: By using a 10M multiplier, Placement always outranks Result regardless of recency. This is intentional — a placement notification from last week is still more important than an event from 5 minutes ago.

2. **Recency decay**: The formula `1M / (1 + ageSec)` provides a smooth decay curve. A notification from 1 second ago scores ~999,999 while one from 1 hour ago scores ~277.

3. **No database required**: All computation is done in-memory from the API response, as per the constraints.

4. **Configurable N**: The user can pass any value of N via command-line argument (`node index.js 15`).
