import AWS from 'aws-sdk';
import consumer from 'consumer';
import { createChannel } from 'create';

interface MessegerProps {
  apiVersion: string | undefined;
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
}

export default class Messeger {
  private apiVersion;

  private accessKeyId;

  private secretAccessKey;

  private region;

  private topicArn: any;

  private queueUrl: any;

  private queueArn: any;

  constructor({
    apiVersion,
    accessKeyId,
    secretAccessKey,
    region,
  }: MessegerProps) {
    this.apiVersion = apiVersion;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
  }

  config(): void {
    const SNSConfig = {
      apiVersion: this.apiVersion,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region,
    };

    AWS.config.update({ ...SNSConfig });
  }

  configChannel(QueueArn: any, QueueUrl: any, topicArn: any): void {
    this.queueArn = QueueArn;
    this.queueUrl = QueueUrl;
    this.topicArn = topicArn;
  }

  async create(configAws: any, topicName: string): Promise<any> {
    return createChannel(configAws, topicName);
  }

  async consume(configAws: any): Promise<any> {
    return consumer(configAws, this.queueUrl);
  }
}
