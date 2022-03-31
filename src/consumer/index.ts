import { SQS } from 'aws-sdk';
import { IConnectionProps } from 'interfaces/IConnectionProps';

interface ConsumerProps {
  QueueUrl: string;
  sqs: SQS;
}

let messages = [] as any;

function getMessages(sqs: any, QueueUrl: any) {
  sqs.receiveMessage(
    { QueueUrl, MaxNumberOfMessages: 10 },
    (error: any, data: any) => {
      if (error) {
        throw error;
      }

      messages = data?.Messages;
    },
  );
}

async function consumer(props: IConnectionProps): Promise<any> {
  getMessages(props.sqs, props.channel?.QueueUrl);

  return messages;
}

export default consumer;
