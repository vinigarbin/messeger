import { config as ConfigAws } from 'aws-sdk';
import consumer from 'consumer';
import { createChannel } from 'create';
import producer from 'publish';

interface MessegerProps {
  apiVersion: string | undefined;
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
}

export default class Messeger {
  private apiVersion: string | undefined;

  private accessKeyId: string | undefined;

  private secretAccessKey: string | undefined;

  private region: string | undefined;

  private topicArn: string | undefined;

  private queueUrl: string | undefined;

  private queueArn: string | undefined;

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

    ConfigAws.update({ ...SNSConfig });
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

  async produce(configAws: any, message: any): Promise<any> {
    return producer(configAws, this.topicArn, message);
  }
}
