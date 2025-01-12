import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface Props {
  scope: Construct;
  name: string;
}

export default ({ scope, name }: Props): { api: RestApi } => {
  const api = new RestApi(scope, `${name}AG`, {
    deployOptions: {
      stageName: "dev",
    },
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowMethods: ["OPTIONS", "GET", "POST"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
      ],
    },
  });

  return { api };
};
