const axios = require('axios');

async function testAuth() {
    try {
        console.log('Testing auth API...');
        const response = await axios.post(
            'http://4.224.186.213/evaluation-service/auth',
            {
                email: 'papakommanaboyina@gmail.com',
                name: 'KOMMANABOYINA PAPA',
                rollNo: '23481A5477',
                accessCode: 'eJdCuC',
                clientID: '65847399-a7e6-4c3a-a3dc-5ed632166272',
                clientSecret: 'nzZbKhscDTnAffPU',
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 15000,
            }
        );
        console.log('STATUS:', response.status);
        console.log('HEADERS:', JSON.stringify(response.headers, null, 2));
        console.log('DATA:', JSON.stringify(response.data, null, 2));
        console.log('DATA TYPE:', typeof response.data);
        console.log('DATA KEYS:', Object.keys(response.data || {}));
    } catch (error) {
        console.log('ERROR STATUS:', error.response ? error.response.status : 'N/A');
        console.log('ERROR DATA:', error.response ? JSON.stringify(error.response.data, null, 2) : 'N/A');
        console.log('ERROR MSG:', error.message);
    }
}

testAuth();
