import { RemovalPolicy } from "aws-cdk-lib";
import {
  Bucket,
  BlockPublicAccess,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
}

export default ({ scope, name }: Props): { bucket: Bucket } => {
  const bucket = new Bucket(scope, `${name}Bucket`, {
    websiteIndexDocument: "index.html",
    publicReadAccess: true,
    removalPolicy: RemovalPolicy.DESTROY,
    blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
    accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  });

  return { bucket };
};
