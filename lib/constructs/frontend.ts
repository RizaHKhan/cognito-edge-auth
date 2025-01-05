import { RemovalPolicy } from "aws-cdk-lib";
import { Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  Bucket,
  BlockPublicAccess,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path = require("path");

interface Props {
  scope: Construct;
  name: string;
}

export default ({ scope, name }: Props): void => {
  const frontend = new Bucket(scope, `${name}Bucket`, {
    websiteIndexDocument: "index.html",
    publicReadAccess: true,
    removalPolicy: RemovalPolicy.DESTROY,
    blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
    accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  });

  const distribution = new Distribution(scope, `${name}Distribution`, {
    defaultBehavior: {
      origin: new S3StaticWebsiteOrigin(frontend),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
  });

  new BucketDeployment(scope, `${name}Deployment`, {
    destinationBucket: frontend,
    sources: [Source.asset(path.resolve(__dirname, "../../frontend/dist"))],
    distribution: distribution,
    distributionPaths: ["/*"],
  });
};
