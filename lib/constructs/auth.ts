import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
}

export default function ({ scope, name }: Props): {
  authorizer: CognitoUserPoolsAuthorizer;
} {
  const userPool = new UserPool(scope, `${name}UserPool`, {
    userPoolName: `${name}UserPool`,
    selfSignUpEnabled: true,
    signInAliases: { email: true },
    autoVerify: { email: true },
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
  });

  const userPoolClient = new UserPoolClient(scope, `${name}UserPoolClient`, {
    userPool,
    generateSecret: false,
  });

  new CfnOutput(scope, "UserPoolId", {
    value: userPool.userPoolId,
  });

  new CfnOutput(scope, "UserPoolClientId", {
    value: userPoolClient.userPoolClientId,
  });

  return { authorizer };
}
