import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
  userPool: UserPool;
  userPoolClient: UserPoolClient
}

export default ({ scope, name, userPool }: Props): void => {
  const helloWorldFunction = new NodejsFunction(scope, `${name}HelloFunction`, {
    runtime: Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
    code: Code.fromAsset("lambda"),
    handler: "hello.handler",
  });

  const api = new LambdaRestApi(scope, `${name}AG`, {
    handler: helloWorldFunction,
    proxy: false,
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
  });

  const authorizer = new CognitoUserPoolsAuthorizer(scope, `${name}Authorizer`, {
    cognitoUserPools: [userPool],
  });

  const helloResource = api.root.addResource("hello");
  helloResource.addMethod("GET", new LambdaIntegration(helloWorldFunction), {
    authorizer,
    authorizationType: AuthorizationType.COGNITO,
    methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Origin": true,
        },
      },
    ],
  });
};
