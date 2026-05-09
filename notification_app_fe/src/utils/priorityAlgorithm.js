const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

export function computeScore(notification, now = new Date()) {
    const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
    const timestamp = new Date(notification.Timestamp);
    const ageMs = Math.max(now.getTime() - timestamp.getTime(), 0);
    const ageSec = ageMs / 1000;
    const recencyScore = 1_000_000 / (1 + ageSec);
    return typeWeight * 10_000_000 + recencyScore;
}

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
