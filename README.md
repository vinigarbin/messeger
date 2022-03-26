O metodo execute, cria os topicos e se conecta entre o SNS E SQS, assim mantendo a conexão e consumindo as mensagens recebidas.

execute(
  'teste2',
  {
    apiVersion: '2012-11-05',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
  },
  (message: any) => {
    console.log(message);
  },
).catch(console.error);
