import AwsConfig from '../connection/aws-config';

function createTeste() {
  const awsCOnfig = {
    apiVersion: '2012-11-05',
    accessKeyId: 'AKIAXKRVBKSQYPMW76MX',
    secretAccessKey: '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',
    region: 'us-east-1',
  };

  const awsConfig = new AwsConfig(awsCOnfig);
  console.log(awsConfig.get());
}

createTeste();
