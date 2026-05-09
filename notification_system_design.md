# Notification System Design

## Stage 1

### The Problem

So the main issue we're dealing with here is that students on the campus notification platform are getting flooded with notifications — placements, results, events — and the important stuff just gets buried. The product manager wants us to build a Priority Inbox that shows the top N most important unread notifications first, where N can be chosen by the user (like top 10, 15, 20 etc).

### How I Approached It

The first thing I had to figure out was — how do you decide which notification is "more important" than another? There are two things that matter here:

1. **What type of notification is it?** A placement notification is obviously more urgent than a random event update. So I gave each type a weight:
   - Placement = 3 (highest priority)
   - Result = 2
   - Event = 1

2. **How recent is it?** Between two placement notifications, the newer one should show up first. So I calculate a recency score based on how old the notification is — newer ones get a higher score.

I combine these two into a single score using this formula:

```
score = typeWeight × 10,000,000 + recencyScore
```

The big multiplier on the type weight makes sure that a placement notification will always rank above a result or event, no matter how old it is. The recency score just acts as a tiebreaker within the same type.

For the recency part, I used `1,000,000 / (1 + age_in_seconds)` — this gives a high number for fresh notifications and it decays smoothly as the notification gets older.

### Why I Used a Max-Heap

For actually pulling out the top N notifications, I went with a max-heap (priority queue). The reason is efficiency — if we just sorted the whole array every time, that's O(n log n) each time. But with a heap, inserting a new notification is O(log n) and extracting the max is also O(log n). This matters because the problem says new notifications will keep coming in, so we need to handle updates efficiently without re-sorting everything from scratch.

Here's a quick comparison:

| What we're doing | Sorting everything | Using a heap |
|---|---|---|
| Process all notifications | O(n log n) | O(n) to build |
| Get top 10 | O(1) after sort | O(10 × log n) |
| Add 1 new notification | O(n log n) again | O(log n) |

So for streaming updates, the heap is clearly better.

### How It Works Step by Step

1. Fetch all notifications from the API (`GET /evaluation-service/notifications`)
2. For each notification, calculate its priority score
3. Insert everything into a max-heap
4. Extract the top N items from the heap
5. Display them ranked

When new notifications come in later, I don't rebuild the heap from scratch. I just merge the new ones into the existing top-N using the `mergeNewNotifications()` function, which combines old results with new data and re-extracts the top N. Much faster than starting over.

### The Code Structure

```
notification_app_be/
├── index.js               — entry point, fetches and displays top N
├── priorityInbox.js       — the heap, scoring logic, and top-N extraction
├── notificationService.js — calls the notifications API
└── package.json
```

You can run it with `node index.js` for top 10, or `node index.js 15` for top 15, etc.

### Sample Output

```
Campus Notifications — Priority Inbox (Top 10)

Rank  Type        Score             Timestamp               Message
#1    Placement   30000999.85       2026-04-22 17:51:18     CSX Corporation hiring
#2    Result      20000998.32       2026-04-22 17:51:30     mid-sem
#3    Event       10000997.10       2026-04-22 17:50:00     Tech Fest Registration
```

Placement always comes first because of the weight, and within placement notifications, the most recent one ranks higher.

### Tradeoffs I Considered

- I intentionally made type weight dominate over recency. A week-old placement notification is still more important than an event from 5 minutes ago. If the PM wanted a different balance, we could reduce the multiplier.
- No database is used — everything is computed in-memory from the API response, which is fine for this stage.
- The recency decay is smooth, not stepped. A notification from 1 second ago and one from 2 seconds ago will have very slightly different scores, which gives us a clean ordering without ties.
