import { SNS, SQS } from 'aws-sdk';
import { IConnectionProps } from 'interfaces/IConnectionProps';
import { IAwsConfig } from '../interfaces/IAwsConfig';

export default class Connection {
  channel: string | undefined;

  awsConfig: IAwsConfig;

  sns: SNS;

  sqs: SQS;

  constructor({ channel, awsConfig, sns, sqs }: IConnectionProps) {
    this.channel = channel;
    this.awsConfig = awsConfig;
    this.sns = sns;
    this.sqs = sqs;
  }
}
