import { SQS, SNS, config as ConfigAws } from 'aws-sdk';

async function createTopic(sns: any, topicName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const create = sns
        .createTopic({
          Name: topicName,
        })
        .promise();

      create
        .then((data: any) => {
          resolve({ TopicArn: data.TopicArn });
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

async function createQueue(sqs: any, queueName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const create = sqs
        .createQueue({
          QueueName: queueName,
        })
        .promise();

      create
        .then((data: any) => {
          resolve({ QueueUrl: data.QueueUrl });
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

async function getQueueAttr(sqs: any, queueUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const getQueue = sqs
        .getQueueAttributes({
          QueueUrl: queueUrl,
          AttributeNames: ['QueueArn'],
        })
        .promise();

      getQueue
        .then((data: any) => {
          resolve({ QueueArn: data?.Attributes?.QueueArn });
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

function snsSubscribe(sns: any, TopicArn: string, QueueArn: string): void {
  sns.subscribe(
    {
      TopicArn,
      Protocol: 'sqs',
      Endpoint: QueueArn,
    },
    (err: any, result: any) => {
      if (err !== null) {
        console.log(err);
      }
      console.log(result);
    },
  );
}

function setQueueAttr(
  sqs: any,
  TopicArn: string,
  QueueArn: string,
  QueueUrl: string,
): void {
  const attributes = {
    Version: '2008-10-17',
    Id: `${QueueArn}/SQSDefaultPolicy`,
    Statement: [
      {
        Sid: `Sid${new Date().getTime()}`,
        Effect: 'Allow',
        Principal: {
          AWS: '*',
        },
        Action: 'SQS:SendMessage',
        Resource: QueueArn,
        Condition: {
          ArnEquals: {
            'aws:SourceArn': TopicArn,
          },
        },
      },
    ],
  };

  sqs.setQueueAttributes(
    {
      QueueUrl,
      Attributes: {
        Policy: JSON.stringify(attributes),
      },
    },
    (err: any, result: any) => {
      if (err !== null) {
        console.log(err);
      }
      console.log(result);
    },
  );
}

async function createChannel(config: any, name: string): Promise<any> {
  ConfigAws.update({ ...config });

  const sns = new SNS();
  const sqs = new SQS();

  const { TopicArn } = await createTopic(sns, name);
  const { QueueUrl } = await createQueue(sqs, name);
  const { QueueArn } = await getQueueAttr(sqs, QueueUrl);

  snsSubscribe(sns, TopicArn, QueueArn);
  setQueueAttr(sqs, TopicArn, QueueArn, QueueUrl);

  return { TopicArn, QueueUrl, QueueArn };
}

export { createChannel, createTopic, createQueue };
