import {
  LambdaIntegration,
  LambdaRestApi,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface Props {
  scope: Construct;
  name: string;
  authorizerOptions: MethodOptions;
}

export default ({
  scope,
  name,
  authorizerOptions,
}: Props): { api: LambdaRestApi } => {
  const helloWorldFunction = new NodejsFunction(scope, `${name}HelloFunction`, {
    runtime: Runtime.NODEJS_22_X,
    handler: "handler",
    entry: join(__dirname, "..", "..", "lambda", "hello.ts"),
  });

  const api = new RestApi(scope, `${name}AG`, {
    deployOptions: {
      stageName: "dev",
    },
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"], // Use specific origin if needed (e.g., "http://localhost:8080").
      allowMethods: ["OPTIONS", "GET"], // Include all allowed methods.
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin", // Explicitly allow this header.
      ],
    },
  });

  const helloResource = api.root.addResource("hello");
  helloResource.addMethod(
    "GET",
    new LambdaIntegration(helloWorldFunction),
    authorizerOptions,
  );

  return { api };
};
