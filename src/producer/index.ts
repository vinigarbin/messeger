import { IConnectionProps } from 'interfaces/IConnectionProps';

function publish(sns: any, TopicArn: any, message: any) {
  return new Promise((resolve, reject) => {
    const publishParams = {
      TopicArn,
      Message: message,
      MessageAttributes: {
        Payload: { DataType: 'String', StringValue: 'Test' },
      },
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

async function producer(props: IConnectionProps, message: any): Promise<any> {
  return publish(props.sns, props.channel?.TopicArn, message);
}

export default producer;
