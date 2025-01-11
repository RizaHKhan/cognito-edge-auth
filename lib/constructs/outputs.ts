import { CfnOutput } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  api: LambdaRestApi;
  distribution: Distribution;
}

export default ({
  scope,
  userPool,
  userPoolClient,
  api,
  distribution,
}: Props) => {
  new CfnOutput(scope, "UserPoolId", {
    value: userPool.userPoolId,
  });

  new CfnOutput(scope, "UserPoolClientId", {
    value: userPoolClient.userPoolClientId,
  });

  new CfnOutput(scope, "ApiEndpoint", {
    value: api.url,
  });

  new CfnOutput(scope, "ApiDeploymentStage", {
    value: api.deploymentStage.stageName,
  });

  new CfnOutput(scope, "DistributionDomainName", {
    value: distribution.domainName,
  });
};
