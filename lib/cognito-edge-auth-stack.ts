import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import frontend from "./constructs/frontend";
import backend from "./constructs/backend";

export class CognitoEdgeAuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    frontend({ scope: this, name: "Frontend" });
    backend({
      scope: this,
      name: "Backend",
    });
  }
}
