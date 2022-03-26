/* eslint-disable no-use-before-define */
import AWS from 'aws-sdk';
import 'dotenv/config';
import config from '../../config.json';

const SNSConfig = {
  apiVersion: '2012-11-05',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
};

AWS.config.update({ ...SNSConfig });

const sns = new AWS.SNS();

function publish(message: any) {
  const publishParams = {
    TopicArn: config.TopicArn,
    Message: message,
  };

  sns.publish(publishParams, (err, data) => {
    console.log(data);
  });
}

async function run() {
  publish(`message: ${'i'}`);
}

run().catch(console.error);
