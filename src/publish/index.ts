/* eslint-disable no-use-before-define */
import { config as ConfigAws, SNS } from 'aws-sdk';

function publish(sns: any, TopicArn: any, message: any) {
  return new Promise((resolve, reject) => {
    const publishParams = {
      TopicArn,
      Message: message,
    };

    try {
      const published = sns.publish(publishParams).promise();

      published
        .then((data: any) => {
          resolve({ messageId: data.MessageId });
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

async function producer(
  config: any,
  TopicArn: any,
  message: any,
): Promise<any> {
  ConfigAws.update({ ...config });
  const sns = new SNS();
  return publish(sns, TopicArn, message);
}

export default producer;
