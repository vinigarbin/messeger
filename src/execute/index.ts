import AWS from 'aws-sdk';
import Connection from 'connection';
import consumer from 'consumer';
import createOrFindChannel from 'create';
import { IConnectionProps } from 'interfaces/IConnectionProps';
import producer from 'producer';
import deleteMessage from 'delete';
import isJsonString from '../utils/IsJsonString';
import { IAwsConfig } from '../interfaces/IAwsConfig';

export interface SubscribeProps {
  topicName: string;
  awsConfig: IAwsConfig;
  cb: CallableFunction;
}
export interface PublishProps {
  topicName: string;
  awsConfig: IAwsConfig;
  message: any;
}

export default class Messeger {
  private topicName: string;

  private awsConfig: IAwsConfig;

  connection: IConnectionProps;

  constructor(topicName: string, awsConfig: IAwsConfig) {
    this.topicName = topicName;
    this.awsConfig = awsConfig;
  }

  async createOrConnect(): Promise<void> {
    AWS.config.update({
      ...this.awsConfig,
    });

    const sns = new AWS.SNS();
    const sqs = new AWS.SQS();

    const channel = await createOrFindChannel(this.topicName, sns, sqs);

    this.connection = new Connection({
      awsConfig: this.awsConfig,
      channel,
      sqs,
      sns,
    });
  }

  async subscribe(callback: CallableFunction, interval = 10000): Promise<any> {
    consumer({ ...this.connection }).then((messages: any) => {
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
        callback(formattedMessages, {
          connection: this.connection,
          deleteMessage,
        });
      }
    });
    setTimeout(() => this.subscribe(callback), interval);
  }

  async publish(message: string): Promise<void> {
    return producer({ ...this.connection }, message);
  }

  // async deleteMessage(
  //   connection: IConnectionProps,
  //   ReceiptHandle?: string,
  // ): Promise<void> {
  //   if (ReceiptHandle) return deleteMessage({ connection }, ReceiptHandle);

  //   return console.log('ReceiptHandle must be informed');
  // }
}

// async function deleteMessageFromQueue({
//   awsConfig,
//   receiptHandle,
// }: PublishProps): Promise<any> {
//   const { configAws, messeger } = await config(topicName, awsConfig);
//   return messeger.produce(configAws, message);
// }

// export { subscribe, publish, create };
