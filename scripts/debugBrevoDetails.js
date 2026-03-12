import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

async function testEmail() {
    console.log('--- Testing Email ---');
    console.log('Sender:', process.env.BREVO_SENDER_EMAIL);
    try {
        // Try creating the transactional email object
        const transEmailApi = client.transactionalEmails;
        console.log('transactionalEmails found:', !!transEmailApi);

        const res = await transEmailApi.sendTransacEmail({
            sender: { name: 'Nexus Test', email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: 'uditjain2622@gmail.com' }], // Assuming this might be the user's email based on corpus name
            subject: 'Test Email from Antigravity',
            htmlContent: '<h1>Test</h1><p>If you see this, email is working.</p>'
        });
        console.log('Email Success:', res);
    } catch (err) {
        console.log('Email Failed Error:', err);
        if (err.response && err.response.body) {
            console.log('Error Body:', JSON.stringify(err.response.body, null, 2));
        }
    }
}

async function testSms() {
    console.log('\n--- Testing SMS ---');
    try {
        console.log('Checking client properties for SMS...');
        const keys = Object.getOwnPropertyNames(client);
        console.log('Direct keys:', keys);
        
        // Let's check the prototype of the client itself
        let proto = Object.getPrototypeOf(client);
        console.log('Proto keys:', Object.getOwnPropertyNames(proto));

        // In 4.x it might be transactionalSms or sms
        console.log('transactionalSMS:', !!client.transactionalSMS);
        console.log('transactionalSms:', !!client.transactionalSms);
        
    } catch (err) {
        console.log('SMS Test Failed:', err);
    }
}

testEmail().then(testSms);
