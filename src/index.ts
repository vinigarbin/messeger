import Messeger from 'connection';
import 'dotenv/config';

interface AWSConfig {
  apiVersion: string | undefined;
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
}

async function config(topicName: string, aswConfig: AWSConfig): Promise<any> {
  const messeger = new Messeger(aswConfig);

  messeger.config();
  const { QueueArn, QueueUrl, topicArn } = await messeger.create(
    messeger,
    topicName,
  );

  messeger.configChannel(QueueArn, QueueUrl, topicArn);

  return {
    configAws: messeger.configChannel(QueueArn, QueueUrl, topicArn),
    messeger,
  };
}

async function execute(
  topicName: string,
  awsConfig: AWSConfig,
  cb: CallableFunction,
): Promise<void> {
  const { configAws, messeger } = await config(topicName, awsConfig);

  messeger.consume(configAws).then((messages: any) => {
    cb(messages);
  });
  setTimeout(() => execute(topicName, awsConfig, cb), 10000);
}

export default execute;

// execute(
//   'teste2',
//   {
//     apiVersion: '2012-11-05',
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'us-east-1',
//   },
//   (message: any) => {
//     console.log(message);
//   },
// ).catch(console.error);
