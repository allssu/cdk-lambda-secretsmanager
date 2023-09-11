import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_secretsmanager as secretsmanager } from "aws-cdk-lib";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

export class SecretsmanagerStack extends cdk.Stack {
  public readonly secret: ISecret;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.secret = new secretsmanager.Secret(this, "Secret", {
      secretName: "example-secret",
      secretObjectValue: {
        username: cdk.SecretValue.unsafePlainText("example-username"),
        password: cdk.SecretValue.unsafePlainText("example-password"),
      },
    });
  }
}
