import { builder } from '../builder.js';
import {
  ProfilePersistent,
  ProfileRepository,
  ProfileService,
} from '../../../../core/src/profile.js';
import { mongoDb } from '../../../../utils/src/mongodb.js';

const profileService =   new ProfileService(new ProfileRepository(mongoDb));


const ProfileType = builder
  .objectRef<ProfilePersistent>('Profile')
  .implement({
    fields: (t) => ({
      userID: t.exposeID('userID'),
      dob: t.exposeString('name'),
      name: t.exposeString('gender'),
    }),
  });

builder.queryFields((t) => ({
  swipeContents: t.field({
    type: ProfileType,
    args: {
      userID: t.arg.string({ required: true }),
    },
    async resolve(_, args, context) {
      console.log(context);
      const { userID } = args;
      const result = await profileService.getItem(userID);
      if(!result) {
        throw new Error('No profile')
      }
      return {...result.getPersistent()};
    },
  }),
}));

builder.mutationFields((t) => ({
  swipeContents: t.field({
    type: ProfileType,
    args: {
      userID: t.arg.string({ required: true }),
    },
    async resolve(_, args, context) {
      console.log(context);
      const { userID } = args;
      const result = await profileService.getItem(userID);
      if(!result) {
        throw new Error('No profile')
      }
      return {...result.getPersistent()};
    },
  }),
}));
