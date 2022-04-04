## Create a new instance of Messeger

```
Props Messeger: ('topicName', {
    apiVersion: 'your_api_version',
    accessKeyId: 'access_key_Id',
    secretAccessKey: 'secret_access_key',
    region: 'your_region',
})
```

## Example:
```
async function run() {
  const messeger = new Messeger('queue-1', {
    apiVersion: 'your_api_version',
    accessKeyId: 'access_key_Id',
    secretAccessKey: 'secret_access_key'',
    region: 'your_region',
  });
```

## Create or connect to a SNS topic and SQS queue
```
  await messeger.createOrConnect();
```

## Subscribe and consume your notifications
  this function return a callback with messages from SNS
```
  messeger.subscribe(handleCallback);
```

## Send messages to SNS

 Message format: JSON or String
```
  await messeger.publish('your message');
}
```

## Callback subscribed

The callback receive a Array of messages from SQS
The messages return a receiptHandle where is used to delete a received message
The object returned with connection and deleteMessage
Prop: connection is your data of connection
Prop: deleteMessage is a function to delete message received
  ```
async function handleCallback(
  messages: any,
  { connection, deleteMessage }: any,
) {
  messages.forEach(async (message: any) => {
    deleteMessage(connection, message.receiptHandle);
  });
  console.log(messages);
}
```
