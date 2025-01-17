import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path = require("path");

interface Props {
  scope: Construct;
  name: string;
  bucket: Bucket;
}

export default ({ scope, name, bucket }: Props): { cfDistro: Distribution } => {
  const cfDistro = new Distribution(scope, `${name}Distribution`, {
    defaultBehavior: {
      origin: new S3StaticWebsiteOrigin(bucket),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
  });

  new BucketDeployment(scope, `${name}Deployment`, {
    destinationBucket: bucket,
    sources: [Source.asset(path.resolve(__dirname, "../../frontend/dist"))],
    distribution: cfDistro,
    distributionPaths: ["/*"],
  });

  return { cfDistro };
};
