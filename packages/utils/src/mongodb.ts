import { Config } from 'sst/node/config';
import { MongoClient } from 'mongodb';

// @ts-ignore
export const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${Config.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOSTNAME}/?retryWrites=true&w=majority`;
export const mongoDbClient = new MongoClient(uri, {
  heartbeatFrequencyMS: 3000,
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
});

export const mongoDb = mongoDbClient.db('qm');

export const replaceDeleteFieldWithMongoDBObjs = (
  obj: Record<string, unknown>,
) => {
  const setObj = { ...obj };
  let unsetObj = {};
  Object.keys(obj).forEach((key) => {
    if ([null, ''].includes(obj[key] as string | null)) {
      unsetObj = {
        ...unsetObj,
        [key]: '',
      };
      delete setObj[key];
    }
  });
  return { setObj, unsetObj };
};
