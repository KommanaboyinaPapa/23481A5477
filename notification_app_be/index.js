/**
 * Stage 1 — Priority Inbox Entry Point
 *
 * Fetches notifications from the API, computes the top-N by priority,
 * and prints the results as a formatted table.
 *
 * Usage: node index.js [N]
 *   N = number of top notifications to display (default: 10)
 */

const path = require('path');
const { fetchNotifications } = require('./notificationService');
const { getTopNNotifications } = require('./priorityInbox');
const { Log } = require(path.resolve(__dirname, '..', 'logging_middleware'));

const DEFAULT_TOP_N = 10;

async function main() {
    const n = parseInt(process.argv[2], 10) || DEFAULT_TOP_N;

    console.log('═══════════════════════════════════════════════════════');
    console.log(`   🏫 Campus Notifications — Priority Inbox (Top ${n})`);
    console.log('═══════════════════════════════════════════════════════\n');

    try {
        // Log the start of the operation
        await Log('frontend', 'info', 'api', `Priority inbox: fetching notifications to compute top ${n}`);

        // Step 1: Fetch all notifications
        console.log('📡 Fetching notifications from API...\n');
        const notifications = await fetchNotifications();

        if (!notifications || notifications.length === 0) {
            console.log('⚠️  No notifications found.');
            await Log('frontend', 'warn', 'api', 'No notifications returned from API');
            return;
        }

        console.log(`📬 Received ${notifications.length} notifications.\n`);
        await Log('frontend', 'info', 'api', `Received ${notifications.length} notifications from API`);

        // Step 2: Compute top-N
        const topN = getTopNNotifications(notifications, n);
        await Log('frontend', 'info', 'api', `Computed top ${topN.length} priority notifications successfully`);

        // Step 3: Display results
        console.log(`🏆 Top ${topN.length} Priority Notifications:\n`);
        console.log('─────────────────────────────────────────────────────');
        console.log(
            'Rank'.padEnd(6) +
            'Type'.padEnd(12) +
            'Score'.padEnd(18) +
            'Timestamp'.padEnd(24) +
            'Message'
        );
        console.log('─────────────────────────────────────────────────────');

        for (const notif of topN) {
            console.log(
                `#${notif.rank}`.padEnd(6) +
                (notif.Type || 'N/A').padEnd(12) +
                String(notif.score).padEnd(18) +
                (notif.Timestamp || 'N/A').padEnd(24) +
                (notif.Message || 'N/A')
            );
        }

        console.log('─────────────────────────────────────────────────────');
        console.log('\n✅ Priority inbox computed successfully.');

        // Step 4: Demonstrate efficient merge with hypothetical new notifications
        console.log('\n📌 Note: For streaming scenarios, use mergeNewNotifications()');
        console.log('   to efficiently update the top-N heap without re-sorting all data.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        try {
            await Log('frontend', 'error', 'api', `Priority inbox failed: ${error.message}`);
        } catch (_) {
            // Silently ignore logging failures to avoid masking the real error
        }
        process.exit(1);
    }
}

main();
