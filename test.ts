import Messeger from './src/execute';

const env = {
  apiVersion: 'your_api_version',
  accessKeyId: 'access_key_Id',
  secretAccessKey: 'secret_access_key',
  region: 'your_region',
};

async function handleCallback(
  messages: any,
  { connection, deleteMessage }: any,
) {
  messages.forEach(async (message: any) => {
    deleteMessage(connection, message.receiptHandle);
  });
  console.log(messages);
}

async function run() {
  const messeger = new Messeger('queue-1', {
    apiVersion: env.apiVersion,
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
    region: env.region,
  });

  await messeger.createOrConnect();
  messeger.subscribe(handleCallback);

  await messeger.publish('teste');
}

run();
