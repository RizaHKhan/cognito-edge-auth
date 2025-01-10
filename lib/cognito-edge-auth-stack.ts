import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import frontend from "./constructs/frontend";
import backend from "./constructs/backend";
import auth from "./constructs/auth";

export class CognitoEdgeAuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    auth({ scope: this, name: "Auth" });
    const { distribution } = frontend({ scope: this, name: "Frontend" });
    backend({
      scope: this,
      name: "Backend",
      distribution,
    });
  }
}
