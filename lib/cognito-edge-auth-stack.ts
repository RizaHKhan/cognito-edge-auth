import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import frontend from "./constructs/frontend";

export class CognitoEdgeAuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    frontend({ scope: this, name: "Frontend" });
  }
}
