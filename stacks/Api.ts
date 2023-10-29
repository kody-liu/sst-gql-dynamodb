import { use, StackContext, Api as ApiGateway } from "sst/constructs";
import { Database } from "./Database.js";
import { Secrets } from "./Secrets.js";

export function Api({ stack }: StackContext) {
  const api = new ApiGateway(stack, "api", {
    defaults: {
      function: {
        bind: [use(Database), ...use(Secrets)],
      },
    },
    routes: {
      "POST /graphql": {
        type: "graphql",
        function: {
          handler: "packages/functions/src/graphql/graphql.handler",
        },
        pothos: {
          schema: "packages/functions/src/graphql/schema.ts",
          output: "packages/graphql/schema.graphql",
          commands: [
            "cd packages/graphql && npx @genql/cli --output ./genql --schema ./schema.graphql --esm",
          ],
        },
      },
    },
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
