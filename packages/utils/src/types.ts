export type { ProfileDTO } from '../../core/src/profile.js';

import {
  LanguageCode,
  CountryCode,
  supportedLocales,
  userGenders,
  matchStatuses,
} from './constants.js';

export type RemoveResult = { success: boolean };

export type QueryOptions = {
  limit?: number;
  skipNumber?: number; // For mongodb pagination use
  cursor?: string; // For dynamodb pagination use
  order?: 'asc' | 'desc';
};

export type InsertItemResult<T> = { item: T; nextItemId?: string };

export type SelectItem<TValue extends string = string> = {
  text: string;
  value: TValue;
  selectItems?: SelectItem;
};

export type SelectItemMetadata<TValue extends string = string> = {
  [value in TValue]: SelectItem<TValue>;
};

export type LocaleCode = `${LanguageCode}_${CountryCode}`;

export type SurportedLocale = (typeof supportedLocales)[number];

export type UserGender = (typeof userGenders)[number];

export type MatchStatus = (typeof matchStatuses)[number];

export type ZeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Utils

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type PartialNull<T> = { [P in keyof T]?: T[P] | null };

// Test
export type Expect<T extends true> = T;
export type ExpectTrue<T extends true> = T;
export type ExpectFalse<T extends false> = T;
export type IsTrue<T extends true> = T;
export type IsFalse<T extends false> = T;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type NotAny<T> = true extends IsAny<T> ? false : true;

export type Debug<T> = { [K in keyof T]: T[K] };
export type MergeInsertions<T> = T extends object
  ? { [K in keyof T]: MergeInsertions<T[K]> }
  : T;

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>;

export type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE
  ? true
  : false;
export type ExpectValidArgs<
  FUNC extends (...args: any[]) => any,
  ARGS extends any[],
> = ARGS extends Parameters<FUNC> ? true : false;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
