import {
  Cors,
  LambdaIntegration,
  LambdaRestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
  distribution: Distribution;
}

export default ({ scope, name, distribution }: Props): void => {
  const helloWorldFunction = new NodejsFunction(scope, `${name}HelloFunction`, {
    runtime: Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
    code: Code.fromAsset("lambda"),
    handler: "hello.handler",
  });

  const api = new LambdaRestApi(scope, `${name}AG`, {
    handler: helloWorldFunction,
    proxy: false,
    defaultCorsPreflightOptions: {
      allowOrigins: [distribution.domainName],
      allowMethods: Cors.ALL_METHODS,
    },
  });

  const helloResource = api.root.addResource("hello");
  helloResource.addMethod("GET", new LambdaIntegration(helloWorldFunction));
};
