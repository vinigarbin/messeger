import { config as ConfigAws, SQS } from 'aws-sdk';

let messages = [] as any;

function getMessages(sqs: any, QueueUrl: any) {
  sqs.receiveMessage(
    { QueueUrl, MaxNumberOfMessages: 10 },
    (error: any, data: any) => {
      messages = data?.Messages;
    },
  );
}

async function consumer(config: any, QueueUrl: any): Promise<any> {
  ConfigAws.update({ ...config });
  const sqs = new SQS();
  getMessages(sqs, QueueUrl);
  return messages;
}

export default consumer;
