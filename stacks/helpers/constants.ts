export enum SeedStage {
  stage = 'stage',
  prod = 'prod',
}

export const seedStages: string[] = [SeedStage.stage, SeedStage.prod];

export const FIREBASE_PROJECT_ID_MAP: Record<SeedStage, string> = {
  [SeedStage.prod]: 'quizzy-match',
  [SeedStage.stage]: 'quizzy-match',
};

export const MONGO_DB_USERNAME_MAP: Record<SeedStage, string> = {
  [SeedStage.prod]: '',
  [SeedStage.stage]: 'quizzy-match-stage-user',
};

export const MONGO_DB_HOSTNAME_MAP: Record<SeedStage, string> = {
  [SeedStage.prod]: '',
  [SeedStage.stage]:
    'quizzymatchstageapsoutheast1serverlessinstance-pe-1.ydyamac.mongodb.net',
};
