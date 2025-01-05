import { LambdaIntegration, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime, Code, Function } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
}

export default ({ scope, name }: Props): void => {
  const helloWorldFunction = new Function(scope, `${name}HelloFunction`, {
    runtime: Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
    code: Code.fromAsset("lambda"), // Points to the lambda directory
    handler: "hello.handler", // Points to the 'hello' file in the lambda directory
  });

  const api = new LambdaRestApi(scope, `${name}AG`, {
    handler: helloWorldFunction,
    proxy: false,
  });

  const helloResource = api.root.addResource("hello");
  helloResource.addMethod("GET", new LambdaIntegration(helloWorldFunction));
};
