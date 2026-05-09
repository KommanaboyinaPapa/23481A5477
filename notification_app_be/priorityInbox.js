const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

class MaxHeap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    insert(item, score) {
        this.heap.push({ item, score });
        this._bubbleUp(this.heap.length - 1);
    }

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

function computeScore(notification, now = new Date()) {
    const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
    const timestamp = new Date(notification.Timestamp);
    const ageMs = Math.max(now.getTime() - timestamp.getTime(), 0);
    const ageSec = ageMs / 1000;
    const recencyScore = 1_000_000 / (1 + ageSec);
    return typeWeight * 10_000_000 + recencyScore;
}

function getTopNNotifications(notifications, n = 10) {
    if (!Array.isArray(notifications) || notifications.length === 0) {
        return [];
    }

    const now = new Date();
    const heap = new MaxHeap();

    for (const notif of notifications) {
        const score = computeScore(notif, now);
        heap.insert(notif, score);
    }

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
