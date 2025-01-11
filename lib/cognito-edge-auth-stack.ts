import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import frontend from "./constructs/frontend";
import backend from "./constructs/backend";
import auth from "./constructs/auth";
import outputs from "./constructs/outputs";
import distribution from "./constructs/distribution";

export class CognitoEdgeAuthStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const name = "Khanr";
    const { env } = props;

    const { userPool, userPoolClient, authorizerOptions } = auth({
      scope: this,
      name: "Auth",
    });

    const { bucket } = frontend({ scope: this, name: "Frontend" });

    const { api } = backend({
      scope: this,
      name: "Backend",
      authorizerOptions,
    });

    const { cfDistro } = distribution({
      scope: this,
      name,
      region: env?.region ?? "us-east-1",
      bucket,
      api,
    });

    outputs({ scope: this, userPool, userPoolClient, cfDistro });
  }
}
