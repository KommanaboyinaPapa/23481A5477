const path = require('path');
const { fetchNotifications } = require('./notificationService');
const { getTopNNotifications } = require('./priorityInbox');
const { Log } = require(path.resolve(__dirname, '..', 'logging_middleware'));

const DEFAULT_TOP_N = 10;

async function main() {
    const n = parseInt(process.argv[2], 10) || DEFAULT_TOP_N;

    console.log('═══════════════════════════════════════════════════════');
    console.log(`   Campus Notifications — Priority Inbox (Top ${n})`);
    console.log('═══════════════════════════════════════════════════════\n');

    try {
        await Log('frontend', 'info', 'api', `Priority inbox: fetching notifications to compute top ${n}`);

        console.log('Fetching notifications from API...\n');
        const notifications = await fetchNotifications();

        if (!notifications || notifications.length === 0) {
            console.log('No notifications found.');
            await Log('frontend', 'warn', 'api', 'No notifications returned from API');
            return;
        }

        console.log(`Received ${notifications.length} notifications.\n`);
        await Log('frontend', 'info', 'api', `Received ${notifications.length} notifications from API`);

        const topN = getTopNNotifications(notifications, n);
        await Log('frontend', 'info', 'api', `Computed top ${topN.length} priority notifications successfully`);

        console.log(`Top ${topN.length} Priority Notifications:\n`);
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
        console.log('\nPriority inbox computed successfully.');

    } catch (error) {
        console.error('Error:', error.message);
        try {
            await Log('frontend', 'error', 'api', `Priority inbox failed: ${error.message}`);
        } catch (_) { }
        process.exit(1);
    }
}

main();
