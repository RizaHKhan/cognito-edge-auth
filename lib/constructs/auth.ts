import { RemovalPolicy } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  MethodOptions,
} from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
}

export default function ({ scope, name }: Props): {
  authorizerOptions: MethodOptions;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
} {
  const userPool = new UserPool(scope, `${name}UserPool`, {
    userPoolName: `${name}UserPool`,
    selfSignUpEnabled: true,
    signInAliases: { email: true },
    autoVerify: { email: true },
    removalPolicy: RemovalPolicy.DESTROY,
    standardAttributes: {
      email: {
        required: true,
        mutable: true,
      },
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true,
      requireSymbols: true,
    },
  });

  const authorizer = new CognitoUserPoolsAuthorizer(scope, "ApiAuthorizer", {
    cognitoUserPools: [userPool],
    identitySource: "method.request.header.Authorization", // if not using this the default is "method.request.header.Authorizer"
  });

  const authorizerOptions: MethodOptions = {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: authorizer,
  };

  const userPoolClient = new UserPoolClient(scope, `${name}UserPoolClient`, {
    userPool,
    generateSecret: false,
  });

  return { userPool, userPoolClient, authorizerOptions };
}
