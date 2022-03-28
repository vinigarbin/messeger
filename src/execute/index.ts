import Messeger from '../connection';

interface AWSConfig {
  apiVersion: string | undefined;
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
}

export interface ExecuteProps {
  topicName: string;
  awsConfig: AWSConfig;
  cb: CallableFunction;
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

async function execute({
  topicName,
  awsConfig,
  cb,
}: ExecuteProps): Promise<void> {
  const { configAws, messeger } = await config(topicName, awsConfig);

  messeger.consume(configAws).then((messages: any) => {
    cb(messages);
  });
  setTimeout(() => execute({ topicName, awsConfig, cb }), 10000);
}

export default execute;
