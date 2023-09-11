import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
  aws_iam as iam,
} from "aws-cdk-lib";
import * as path from "path";

interface LambdaStackProps extends cdk.StackProps {
  secretsmanagerArn: string;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, `LambdaRole`, {
      roleName: `example-secretsmanager-lambda-role`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        {
          managedPolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    });

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [props.secretsmanagerArn],
      })
    );

    new lambda_nodejs.NodejsFunction(this, "Function", {
      functionName: "example-function",
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "lambda-handler.ts"),
      handler: "handler",
      role: lambdaRole,
      timeout: cdk.Duration.seconds(10),
      environment: {
        PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: "true",
      },
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "SecretsManagerLambdaExtention",
          "arn:aws:lambda:ap-northeast-2:738900069198:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4"
        ),
      ],
    });
  }
}
