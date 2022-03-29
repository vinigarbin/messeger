import isJsonString from '../utils/IsJsonString';
import Messeger from '../connection';

interface AWSConfig {
  apiVersion: string | undefined;
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
}

export interface SubscribeProps {
  topicName: string;
  awsConfig: AWSConfig;
  cb: CallableFunction;
}
export interface PublishProps {
  topicName: string;
  awsConfig: AWSConfig;
  message: any;
}

async function config(topicName: string, aswConfig: AWSConfig): Promise<any> {
  const messeger = new Messeger(aswConfig);

  const { QueueArn, QueueUrl, TopicArn } = await messeger.create(
    messeger,
    topicName,
  );

  return {
    configAws: messeger.configChannel(QueueArn, QueueUrl, TopicArn),
    messeger,
  };
}

async function subscribe({
  topicName,
  awsConfig,
  cb,
}: SubscribeProps): Promise<void> {
  const { configAws, messeger } = await config(topicName, awsConfig);

  messeger.consume(configAws).then((messages: any) => {
    if (Array.isArray(messages)) {
      const formattedMessages = messages.map(data => {
        const { Body, ReceiptHandle } = data;
        const json = JSON.parse(Body);
        let message = json.Message;

        if (isJsonString(message)) {
          message = JSON.parse(json.Message);
        }

        return {
          messageId: json.MessageId,
          timestamp: json.Timestamp,
          message,
          receiptHandle: ReceiptHandle,
        };
      });
      cb(formattedMessages);
    }
  });
  setTimeout(() => subscribe({ topicName, awsConfig, cb }), 10000);
}

async function publish({
  topicName,
  awsConfig,
  message,
}: PublishProps): Promise<any> {
  const { configAws, messeger } = await config(topicName, awsConfig);
  return messeger.produce(configAws, message);
}

// async function deleteMessageFromQueue({
//   awsConfig,
//   receiptHandle,
// }: PublishProps): Promise<any> {
//   const { configAws, messeger } = await config(topicName, awsConfig);
//   return messeger.produce(configAws, message);
// }

export { subscribe, publish };
