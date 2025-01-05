import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  Distribution,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import {
  S3StaticWebsiteOrigin,
} from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path = require("path");

export class CognitoEdgeAuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const frontend = new Bucket(this, "Frontend", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    const distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(frontend),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    new BucketDeployment(this, "Deployment", {
      destinationBucket: frontend,
      sources: [Source.asset(path.resolve(__dirname, "../frontend/dist"))],
      distribution: distribution,
      distributionPaths: ["/*"],
    });
  }
}
