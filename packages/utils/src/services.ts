import {
  ObjectId,
  Db,
  Filter,
  WithId,
  MatchKeysAndValues,
  OptionalUnlessRequiredId,
  FindCursor,
  BSON,
  Collection,
} from 'mongodb';

export type { Db, WithId } from 'mongodb';
export { ObjectId } from 'mongodb';

import type { QueryOptions, RemoveResult } from './types.js';

export enum ItemType {
  ANSWER = 'ANSWER',
  ANSWER_SWIPE_STATE = 'ANSWER_SWIPE_STATE',
  MATCH = 'MATCH',
  PROFILE = 'PROFILE',
  PROFILE_SWIPE_STATE = 'PROFILE_SWIPE_STATE',
  QUESTION = 'QUESTION',
  QUESTION_CONTENT = 'QUESTION_CONTENT',
  QUESTION_GROUP = 'QUESTION_GROUP',
  SWIPE_STATE = 'SWIPE_STATE',
}

abstract class BaseDTO<Persistent extends unknown> {
  abstract readonly id: string;

  abstract readonly type: ItemType;

  protected _persistent: Persistent;

  constructor(persistent: Persistent) {
    this._persistent = persistent;
  }

  getPersistent(): Readonly<Persistent> {
    return this._persistent;
  }
}

export abstract class MongoDbDTO<
  Persistent extends WithId<unknown> = WithId<unknown>,
> extends BaseDTO<Persistent> {
  readonly id: string;

  constructor(input: Persistent) {
    super(input);
    this.id = input._id.toHexString();
  }
}

export abstract class DynamoDbDTO<
  Persistent extends unknown = unknown,
> extends BaseDTO<Persistent> {
  /**
   * For generate id use
   */
  static compositeKeys(...keys: string[]) {
    return keys.join('#');
  }
}

export abstract class BaseDomainItem<
  DTO extends MongoDbDTO | DynamoDbDTO = MongoDbDTO | DynamoDbDTO,
> {
  abstract readonly type: ItemType;

  abstract getDto(): Readonly<DTO>;

  abstract clone(): BaseDomainItem<DTO>; // TODO: clone return sub-class's new instance
}

export abstract class BaseService<TItem extends BaseDomainItem> {
  /** Save domain item */
  abstract saveItem(item: TItem): Promise<TItem>;

  /** Update item by raw data */
  abstract updateItem(...args: unknown[]): Promise<TItem>;

  abstract createItem(...args: unknown[]): Promise<TItem>;

  abstract getItem(...args: unknown[]): Promise<TItem | undefined>;

  abstract getItems(
    paginationInput: QueryOptions,
    ...args: unknown[]
  ): Promise<{ items: TItem[]; cursor: string | null }>;

  abstract removeItem(...args: unknown[]): Promise<RemoveResult>;
}

/**
 * MongoDB Repository
 */
export abstract class MongoDBRepository<
  R extends BSON.Document = BSON.Document,
> {
  readonly type: ItemType;

  db: Db;

  collection: Collection<R>;

  constructor(type: ItemType, db: Db) {
    this.db = db;
    this.type = type;
    this.collection = this.db.collection<R>(this.type);
  }

  getCollection() {
    return this.db.collection<R>(this.type);
  }

  /**
   * Create Index for collection.
   * Should follow ESR rule create index.
   *
   * compound index: https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
   *
   * ESR rule: https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-rule/#std-label-esr-indexing-rule
   */
  abstract createIndexes(): Promise<void>;

  clearCollection() {
    this.getCollection().deleteMany();
  }

  /**
   * Get object by ID
   *
   * @param {string} id Object ID
   */
  getById(id: string | ObjectId) {
    // @ts-ignore
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  /**
   * Get object by ID
   *
   * @param {string} id Object ID
   */
  remove(id: string | ObjectId) {
    // @ts-ignore
    return this.collection.deleteOne({ _id: new ObjectId(id) });
  }

  /**
   * Create object
   *
   * @param {OptionalUnlessRequiredId<R>} t Object body
   */
  async create(t: OptionalUnlessRequiredId<R>) {
    const result = await this.collection.insertOne(t);
    return {
      ...t,
      _id: result.insertedId,
    };
  }

  /**
   * Create object
   *
   * @param {string} id Object ID
   * @param {MatchKeysAndValues<R>} setObj Object body
   * @param {MatchKeysAndValues<R>} unsetObj Object body
   */
  async updateById(
    id: string,
    setObj?: MatchKeysAndValues<R>,
    unsetObj?: MatchKeysAndValues<R>,
  ): Promise<WithId<R> | undefined> {
    if (!setObj && !unsetObj) return;
    const result = await this.collection.findOneAndUpdate(
      // @ts-ignore
      { _id: new ObjectId(id) },
      {
        $set: setObj,
        $unset: unsetObj,
      },
      { returnDocument: 'after' },
    );
    return result ?? undefined;
  }

  /**
   * Create object
   *
   * @param {string} id Object ID
   * @param {MatchKeysAndValues<R>} setObj Object body
   * @param {MatchKeysAndValues<R>} unsetObj Object body
   */
  async upsertById(
    id: string,
    setObj?: MatchKeysAndValues<R>,
    unsetObj?: MatchKeysAndValues<R>,
  ): Promise<WithId<R>> {
    if (!setObj && !unsetObj) throw Error('No setObj or unsetObj');
    const result = await this.collection.findOneAndUpdate(
      // @ts-ignore
      { _id: new ObjectId(id) },
      {
        $set: setObj,
        $unset: unsetObj,
      },
      { returnDocument: 'after', upsert: true },
    );
    return result;
  }

  /**
   * Get item count
   *
   * @param {Filter<WithId<R>>} filter
   * @return {Promise<number>} Total count
   */
  async count(filter: Filter<WithId<R>>): Promise<number> {
    const totalCount = await this.collection.countDocuments(filter);
    return totalCount;
  }

  static applyQueryOptions(
    cursor: FindCursor,
    { skipNumber, limit = 100 }: QueryOptions = {},
  ) {
    let newCursor = cursor.limit(limit);
    if (skipNumber) {
      newCursor = newCursor.skip(skipNumber);
    }
    return newCursor;
  }
}
