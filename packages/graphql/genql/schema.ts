// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    String: string,
    Boolean: boolean,
}

export interface Mongo {
    url: Scalars['String']
    __typename: 'Mongo'
}

export interface Query {
    mongo: Mongo
    __typename: 'Query'
}

export interface MongoGenqlSelection{
    url?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    mongo?: MongoGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const Mongo_possibleTypes: string[] = ['Mongo']
    export const isMongo = (obj?: { __typename?: any } | null): obj is Mongo => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMongo"')
      return Mongo_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    