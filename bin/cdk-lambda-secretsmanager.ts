#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SecretsmanagerStack } from "../lib/secretsmanager-stack";
import { LambdaStack } from "../lib/lambda-stack";

const app = new cdk.App();

const secretsmanager = new SecretsmanagerStack(
  app,
  "ExampleSecretsmanagerStack"
);

new LambdaStack(app, "ExampleLambdaStack", {
  secretsmanagerArn: secretsmanager.secret.secretArn,
});
