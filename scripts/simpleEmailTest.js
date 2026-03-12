import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.BREVO_API_KEY;
console.log('API Key length:', apiKey ? apiKey.length : 0);
if (apiKey && apiKey.length === 0) {
    console.log('WARNING: API Key is empty!');
}

const client = new BrevoClient({ apiKey: apiKey });

async function run() {
    try {
        console.log('Attempting to send email...');
        const res = await client.transactionalEmails.sendTransacEmail({
            sender: { name: 'Nexus Enliven', email: "ankushnimcet2023@gmail.com" },
            to: [{ email: 'uditjain2622004@gmail.com' }],
            subject: 'Test Email',
            htmlContent: '<p>Test</p>'
        });
        console.log('EMAIL_SUCCESS');
    } catch (err) {
        console.log('EMAIL_ERROR: ' + err.message);
        if (err.response) {
            console.log('ERROR_BODY: ' + JSON.stringify(err.response.body));
        }
    }
}

run();
