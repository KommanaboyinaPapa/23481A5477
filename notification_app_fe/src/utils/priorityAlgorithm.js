/**
 * Priority Algorithm Utility
 * Client-side implementation of the weighted priority inbox algorithm
 */

const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

/**
 * Computes a composite priority score for a notification.
 * @param {object} notification - { ID, Type, Message, Timestamp }
 * @param {Date} [now] - Reference time
 * @returns {number}
 */
export function computeScore(notification, now = new Date()) {
    const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
    const timestamp = new Date(notification.Timestamp);
    const ageMs = Math.max(now.getTime() - timestamp.getTime(), 0);
    const ageSec = ageMs / 1000;
    const recencyScore = 1_000_000 / (1 + ageSec);
    return typeWeight * 10_000_000 + recencyScore;
}

/**
 * Returns the top-N notifications sorted by priority score.
 * @param {Array} notifications
 * @param {number} [n=10]
 * @returns {Array} Notifications with added `score` and `rank` fields
 */
export function getTopNNotifications(notifications, n = 10) {
    if (!Array.isArray(notifications) || notifications.length === 0) return [];

    const now = new Date();
    const scored = notifications.map((notif) => ({
        ...notif,
        score: computeScore(notif, now),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, n).map((notif, idx) => ({
        ...notif,
        rank: idx + 1,
    }));
}

export { TYPE_WEIGHTS };
