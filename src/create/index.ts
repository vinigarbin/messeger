import { SNS, SQS } from 'aws-sdk';
import { createTopic, snsSubscribe } from './sns';
import { createQueue, getQueueAttr, setQueueAttr } from './sqs';

async function createOrFindChannel(
  topicName: string,
  sns: SNS,
  sqs: SQS,
): Promise<any> {
  const { TopicArn } = await createTopic(sns, topicName);
  const { QueueUrl: deadLetterQueueUrl } = await createQueue(sqs, topicName);
  const { QueueArn: deadLetterQueueArn } = await getQueueAttr(
    sqs,
    deadLetterQueueUrl,
  );
  const { QueueUrl } = await createQueue(sqs, topicName, deadLetterQueueArn);
  const { QueueArn } = await getQueueAttr(sqs, QueueUrl);
  await setQueueAttr(sqs, TopicArn, QueueArn, QueueUrl);
  await snsSubscribe(sns, TopicArn, QueueArn);

  return { TopicArn, QueueUrl, QueueArn };
}

export default createOrFindChannel;
