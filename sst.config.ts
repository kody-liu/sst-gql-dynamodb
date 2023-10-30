import { SSTConfig } from "sst";
import { Api } from "./stacks/Api";
import { Web } from "./stacks/Web";
import { Database } from "./stacks/Database";
import { Secrets } from "./stacks/Secrets";

export default {
  config(_input) {
    return {
      name: "sst-gql-dynamodb",
      region: "ap-northeast-1",
    };
  },
  stacks(app) {
    app
      .stack(Secrets)
      .stack(Database)
      .stack(Api)
      .stack(Web);
  }
} satisfies SSTConfig;
