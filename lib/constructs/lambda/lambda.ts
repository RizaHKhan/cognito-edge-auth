import {
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
  authorizerOptions: MethodOptions;
  api: RestApi;
}

export default ({ scope, name, authorizerOptions, api }: Props): void => {
  const hello = new NodejsFunction(scope, "hello", {
    runtime: Runtime.NODEJS_22_X,
  });

  const helloResource = api.root.addResource("hello");
  helloResource.addMethod(
    "GET",
    new LambdaIntegration(hello),
    authorizerOptions,
  );
};
