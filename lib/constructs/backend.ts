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
  });

  const helloResource = api.root.addResource("hello");
  helloResource.addMethod(
    "GET",
    new LambdaIntegration(helloWorldFunction),
    authorizerOptions,
  );

  helloResource.addMethod("OPTIONS", new LambdaIntegration(helloWorldFunction));

  return { api };
};
