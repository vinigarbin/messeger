async function findQueue(sqs: any, queueName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Finding a queue with name ${queueName}`);
      const findQueues = sqs.listQueues().promise();

      findQueues
        .then((data: any) => {
          const queueUrl = data?.QueueUrls.find((url: string) => {
            if (url.includes(queueName)) {
              console.log(`Finded a queue with name: ${queueName}`);

              return url;
            }

            return null;
          });

          if (!queueUrl) {
            console.log(`Queue ${queueName} not found`);
          }

          resolve(queueUrl);
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
  const QueueUrl = await findQueue(sqs, queueName);

  if (QueueUrl) {
    return Promise.resolve({ QueueUrl });
  }

  return new Promise((resolve, reject) => {
    try {
      console.log(`Creating a queue with name ${queueName}`);
      const create = sqs
        .createQueue({
          QueueName: queueName,
        })
        .promise();

      create
        .then((data: any) => {
          console.log(`${queueName} created successfully`);
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

async function setQueueAttr(
  sqs: any,
  TopicArn: string,
  QueueArn: string,
  QueueUrl: string,
): Promise<void> {
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

  return new Promise((resolve, reject) => {
    try {
      const setQueueAttributes = sqs
        .setQueueAttributes({
          QueueUrl,
          Attributes: {
            Policy: JSON.stringify(attributes),
          },
        })
        .promise();

      setQueueAttributes
        .then((data: any) => {
          console.log(`Set Policy ${QueueUrl} is successfully`);
          resolve(data);
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

export { createQueue, getQueueAttr, setQueueAttr };
