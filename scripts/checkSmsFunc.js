import { BrevoClient } from '@getbrevo/brevo';
const client = new BrevoClient({ apiKey: 'dummy' });
if (client.transactionalSms) {
    console.log('SMS Proto keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(client.transactionalSms)));
}
