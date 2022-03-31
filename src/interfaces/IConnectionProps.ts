import { SNS, SQS } from 'aws-sdk';
import { IAwsConfig } from './IAwsConfig';

export interface IConnectionProps {
  channel: any;
  awsConfig: IAwsConfig;
  sns: SNS;
  sqs: SQS;
}
