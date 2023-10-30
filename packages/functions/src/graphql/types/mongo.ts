import { builder } from "../builder";

type Mongo = {
  url: string
}
const MongoType = builder
  .objectRef<Mongo>("Mongo")
  .implement({
    fields: (t) => ({
      url: t.exposeString("url"),
    }),
  });

builder.queryFields((t) => ({
  mongo: t.field({
    type: MongoType,
    resolve: async (_, args) => {
      return { url: 'mongomongo!' };
    },
  }),
}));
