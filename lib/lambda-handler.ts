export const handler = async (event: null): Promise<any> => {
  try {
    const url = `http://localhost:2773/secretsmanager/get?secretId=example-secret`;
    const res: any = await fetch(url, {
      headers: {
        "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN!,
      },
    });

    const obj = await res.json();

    const { username, password } = JSON.parse(obj["SecretString"]);

    console.info(`username : ${username}`);
    console.info(`password : ${password}`);

    return {
      statusCode: 200,
      secret: { username, password },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
    };
  }
};
