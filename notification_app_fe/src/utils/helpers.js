/**
 * Helper Utilities
 */

import { VIEWED_STORAGE_KEY } from './constants';

/**
 * Formats a timestamp string into a human-readable relative time.
 * @param {string} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) return date.toLocaleDateString();
    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
}

/**
 * Formats a timestamp into a full date-time string.
 * @param {string} timestamp
 * @returns {string}
 */
export function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Gets the set of viewed notification IDs from localStorage.
 * @returns {Set<string>}
 */
export function getViewedIds() {
    try {
        const stored = localStorage.getItem(VIEWED_STORAGE_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
        return new Set();
    }
}

/**
 * Marks a notification ID as viewed.
 * @param {string} id
 */
export function markAsViewed(id) {
    const viewed = getViewedIds();
    viewed.add(id);
    localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify([...viewed]));
}

/**
 * Marks multiple notification IDs as viewed.
 * @param {string[]} ids
 */
export function markAllAsViewed(ids) {
    const viewed = getViewedIds();
    ids.forEach((id) => viewed.add(id));
    localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify([...viewed]));
}

/**
 * Checks if a notification has been viewed.
 * @param {string} id
 * @returns {boolean}
 */
export function isViewed(id) {
    return getViewedIds().has(id);
}
