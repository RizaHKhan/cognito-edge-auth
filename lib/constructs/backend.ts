import {
  LambdaIntegration,
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
}: Props): { api: RestApi } => {
  const helloWorldFunction = new NodejsFunction(scope, "hello", {
    runtime: Runtime.NODEJS_22_X,
  });

  const api = new RestApi(scope, `${name}AG`, {
    deployOptions: {
      stageName: "dev",
    },
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "GET", "POST"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
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
