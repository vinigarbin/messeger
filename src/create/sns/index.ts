interface listTopics {
  TopicArn: string;
}

async function findTopic(sns: any, topicName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Finding a topic with name ${topicName}`);
      const findTopics = sns.listTopics().promise();

      findTopics
        .then((data: any) => {
          const topicArn = data?.Topics.find(({ TopicArn }: listTopics) => {
            if (TopicArn.includes(topicName)) {
              console.log(`Finded a topic with name: ${topicName}`);

              return TopicArn;
            }

            return null;
          });

          if (!topicArn) {
            console.log(`Topic ${topicName} not found`);
            resolve({ TopicArn: null });
          }

          resolve(topicArn);
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

async function createTopic(sns: any, topicName: string): Promise<any> {
  const { TopicArn } = await findTopic(sns, topicName);

  if (TopicArn) {
    return Promise.resolve({ TopicArn });
  }

  return new Promise((resolve, reject) => {
    try {
      console.log(`Creating a topic with name ${topicName}`);
      const create = sns
        .createTopic({
          Name: topicName,
        })
        .promise();

      create
        .then((data: any) => {
          console.log(`${topicName} created successfully`);
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

async function snsSubscribe(
  sns: any,
  TopicArn: string,
  QueueArn: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Subscribe a topic on Queue`);
      const subscribe = sns
        .subscribe({
          TopicArn,
          Protocol: 'sqs',
          Endpoint: QueueArn,
        })
        .promise();

      subscribe
        .then((data: any) => {
          console.log(`Subscribe in ${TopicArn} is successfully`);
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

export { createTopic, findTopic, snsSubscribe };
