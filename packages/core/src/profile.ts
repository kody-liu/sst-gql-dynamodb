import {
  BaseDomainItem,
  BaseService,
  Db,
  ItemType,
  MongoDBRepository,
  MongoDbDTO,
  ObjectId,
} from '../../utils/src/services.js';
import type {
  QueryOptions,
  UserGender,
} from '../../utils/src/types.js';
import { ageRangeToDobRange, dobToAge } from '../../utils/src/date.js';

export type ProfilePersistent = {
  _id: ObjectId;
  userID: string;
  name: string;
  dob: Date;
  gender: UserGender;
  matchGender: UserGender;
  matchAgeFrom: number;
  matchAgeTo: number;
};

export class ProfileRepository extends MongoDBRepository<ProfilePersistent> {
  constructor(db: Db) {
    super(ItemType.PROFILE, db);
  }

  createIndexes = async (): Promise<void> => {
    // For match user
    await this.collection.createIndex({
      gender: 1,
      matchGender: 1,
      matchAgeFrom: 1,
      matchAgeTo: -1,
      dob: 1,
    });
    // For get by userID
    await this.collection.createIndex({
      userID: 1,
    });
  };

  findMatch = (
    {
      gender,
      matchGender,
      dob,
      matchAgeFrom,
      matchAgeTo,
    }: Pick<
      ProfilePersistent,
      'gender' | 'matchGender' | 'dob' | 'matchAgeFrom' | 'matchAgeTo'
    >,
    { skipNumber, limit = 100 }: QueryOptions = {},
  ) => {
    const dobRange = ageRangeToDobRange(matchAgeFrom, matchAgeTo);
    const age = dobToAge(dob);
    let cursor = this.collection.find({
      gender: matchGender,
      matchGender: gender,
      matchAgeFrom: { $lte: age },
      matchAgeTo: { $gte: age },
      dob: { $gte: dobRange[0], $lte: dobRange[1] },
    });
    cursor = MongoDBRepository.applyQueryOptions(cursor, { skipNumber, limit });
    return cursor;
  };

  getByUserID = (userID: string) => {
    return this.collection.findOne({ userID });
  };

  upsertByUserID = async (userID: string, input: ProfilePersistent) => {
    const result = await this.collection.findOneAndUpdate({ userID }, input, {
      returnDocument: 'after',
      upsert: true,
    });
    return result!;
  };

  removeByUserID = async (userID: string) =>
    this.collection.deleteMany({ userID });
}

export class ProfileDTO extends MongoDbDTO<ProfilePersistent> {
  type = ItemType.PROFILE;
}

export class Profile extends ProfileDTO implements BaseDomainItem<ProfileDTO> {
  setName = (name: string) => {
    this._persistent.name = name;
  };

  getDto = (): ProfileDTO => new ProfileDTO(this._persistent);

  clone = () => new Profile(this._persistent);
}

export class ProfileService implements BaseService<Profile> {
  #repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.#repository = repository;
  }

  saveItem = (item: Profile): Promise<Profile> => {
    const { userID, name } = item.getPersistent();
    return this.updateItem(userID, name);
  };

  updateItem = async (userID: string, name: string) => {
    const profile = await this.getItem(userID);
    if (!profile) throw Error('Not found');
    profile.setName(name);
    return this.saveItem(profile);
  };

  createItem = async (input: Omit<ProfilePersistent, '_id'>) => {
    const result = await this.#repository.create({
      ...input,
      _id: new ObjectId(),
    });
    return new Profile(result);
  };

  getItem = async (userID: string) => {
    const result = await this.#repository.getByUserID(userID);
    return result ? new Profile(result) : undefined;
  };

  getItems = async (): Promise<{
    items: Profile[];
    cursor: string | null;
  }> => {
    throw Error('Unimplement');
  };

  removeItem = async (userID: string) => {
    await this.#repository.removeByUserID(userID);
    return { success: true };
  };
}
