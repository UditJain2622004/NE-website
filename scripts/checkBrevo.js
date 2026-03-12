import { BrevoClient } from '@getbrevo/brevo';
const client = new BrevoClient({ apiKey: 'dummy' });
console.log('Transactional SMS instance:', client.transactionalSms);
console.log('SMS functions:', client.transactionalSms ? Object.getOwnPropertyNames(Object.getPrototypeOf(client.transactionalSms)) : 'none');
