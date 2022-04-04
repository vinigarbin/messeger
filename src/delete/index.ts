import { IConnectionProps } from 'interfaces/IConnectionProps';

function deleteMessageCallback(err: any, data: any) {
  if (err) {
    throw err;
  }

  console.log(
    `The message "${data.ResponseMetadata.RequestId}" has been deleted `,
  );
}

function deleteMessage(
  { sqs, channel }: IConnectionProps,
  ReceiptHandle?: string,
): void {
  if (ReceiptHandle) {
    sqs.deleteMessage(
      {
        QueueUrl: channel.QueueUrl,
        ReceiptHandle,
      },
      deleteMessageCallback,
    );
  } else {
    console.log('ReceiptHandle must be informed');
  }
}

export default deleteMessage;
