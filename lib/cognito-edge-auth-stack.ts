import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import frontend from "./constructs/frontend";
import backend from "./constructs/backend";
import auth from "./constructs/auth";
import outputs from "./constructs/outputs";
import distribution from "./constructs/distribution";
import lambda from "./constructs/lambda/lambda";

export class CognitoEdgeAuthStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const name = "Scrapper";

    const { userPool, userPoolClient, authorizerOptions } = auth({
      scope: this,
      name: "Auth",
    });

    const { bucket } = frontend({ scope: this, name: "Frontend" });

    const { api } = backend({
      scope: this,
      name: "Backend",
    });

    lambda({
      scope: this,
      name: "Lambda",
      api,
      authorizerOptions,
    });

    const { cfDistro } = distribution({
      scope: this,
      name,
      bucket,
    });

    outputs({ scope: this, userPool, userPoolClient, cfDistro });
  }
}
