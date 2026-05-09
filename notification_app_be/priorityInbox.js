/**
 * Priority Inbox Module
 *
 * Implements a weighted priority algorithm to rank notifications.
 * Uses a max-heap (priority queue) for efficient top-N extraction.
 *
 * Priority = typeWeight × 10_000_000 + recencyScore
 *   - typeWeight: Placement=3, Result=2, Event=1
 *   - recencyScore: higher for newer notifications (based on inverse age)
 *
 * The heap maintains O(n log N) insertion/extraction, making it
 * efficient when new notifications stream in over time.
 */

// ─── Weight Map ─────────────────────────────────────────────────────────
const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

// ─── Max-Heap Implementation ────────────────────────────────────────────

class MaxHeap {
    constructor() {
        this.heap = [];
    }

    /** Returns the number of items in the heap */
    size() {
        return this.heap.length;
    }

    /** Inserts an item with a given priority score */
    insert(item, score) {
        this.heap.push({ item, score });
        this._bubbleUp(this.heap.length - 1);
    }

    /** Extracts the item with the highest priority score */
    extractMax() {
        if (this.heap.length === 0) return null;
        const max = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._sinkDown(0);
        }
        return max;
    }

    _bubbleUp(idx) {
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (this.heap[parentIdx].score >= this.heap[idx].score) break;
            [this.heap[parentIdx], this.heap[idx]] = [this.heap[idx], this.heap[parentIdx]];
            idx = parentIdx;
        }
    }

    _sinkDown(idx) {
        const length = this.heap.length;
        while (true) {
            let largest = idx;
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;

            if (left < length && this.heap[left].score > this.heap[largest].score) {
                largest = left;
            }
            if (right < length && this.heap[right].score > this.heap[largest].score) {
                largest = right;
            }
            if (largest === idx) break;
            [this.heap[largest], this.heap[idx]] = [this.heap[idx], this.heap[largest]];
            idx = largest;
        }
    }
}

// ─── Scoring ────────────────────────────────────────────────────────────

/**
 * Computes a composite priority score for a notification.
 *
 * @param {object} notification - { ID, Type, Message, Timestamp }
 * @param {Date}   [now]        - Reference time (defaults to current time)
 * @returns {number} Composite score (higher = more important)
 */
function computeScore(notification, now = new Date()) {
    const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
    const timestamp = new Date(notification.Timestamp);
    const ageMs = Math.max(now.getTime() - timestamp.getTime(), 0);

    // recencyScore: large for recent items, decays with age.
    // Adding 1 to avoid division by zero; using seconds for readability.
    const ageSec = ageMs / 1000;
    const recencyScore = 1_000_000 / (1 + ageSec);

    return typeWeight * 10_000_000 + recencyScore;
}

// ─── Top-N Extraction ───────────────────────────────────────────────────

/**
 * Returns the top N notifications sorted by priority (highest first).
 *
 * @param {Array}  notifications - Array of notification objects
 * @param {number} [n=10]       - Number of top notifications to return
 * @returns {Array} Top N notifications with their scores
 */
function getTopNNotifications(notifications, n = 10) {
    if (!Array.isArray(notifications) || notifications.length === 0) {
        return [];
    }

    const now = new Date();
    const heap = new MaxHeap();

    // Insert all notifications into the heap
    for (const notif of notifications) {
        const score = computeScore(notif, now);
        heap.insert(notif, score);
    }

    // Extract top N
    const topN = [];
    const count = Math.min(n, heap.size());
    for (let i = 0; i < count; i++) {
        const extracted = heap.extractMax();
        if (extracted) {
            topN.push({
                rank: i + 1,
                score: extracted.score.toFixed(2),
                ...extracted.item,
            });
        }
    }

    return topN;
}

/**
 * Maintains a running top-N set efficiently by only re-scoring
 * new incoming notifications and merging with the existing top-N.
 *
 * @param {Array}  existingTopN      - Current top-N results
 * @param {Array}  newNotifications  - Newly arrived notifications
 * @param {number} [n=10]           - Desired top-N count
 * @returns {Array} Updated top-N notifications
 */
function mergeNewNotifications(existingTopN, newNotifications, n = 10) {
    const combined = [
        ...existingTopN.map((item) => {
            const { rank, score, ...notif } = item;
            return notif;
        }),
        ...newNotifications,
    ];
    return getTopNNotifications(combined, n);
}

module.exports = {
    getTopNNotifications,
    mergeNewNotifications,
    computeScore,
    MaxHeap,
    TYPE_WEIGHTS,
};
