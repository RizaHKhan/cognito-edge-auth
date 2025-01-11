import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import frontend from "./constructs/frontend";
import backend from "./constructs/backend";
import auth from "./constructs/auth";
import outputs from "./constructs/outputs";

export class CognitoEdgeAuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { userPool, userPoolClient, authorizerOptions } = auth({
      scope: this,
      name: "Auth",
    });

    const { distribution } = frontend({ scope: this, name: "Frontend" });

    const { api } = backend({
      scope: this,
      name: "Backend",
      authorizerOptions,
    });

    outputs({ scope: this, userPool, userPoolClient, api, distribution });
  }
}
