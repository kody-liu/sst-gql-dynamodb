import moment from 'moment-timezone';

export { moment };

export const dobToAge = (dob: Date, currentDate?: Date): number =>
  moment(currentDate).diff(moment(dob), 'years');

export const ageToDob = (age: number, currentDate?: Date): Date =>
  moment(currentDate).subtract(age, 'years').toDate();

export const ageRangeToDobRange = (
  ageFrom: number,
  ageTo: number,
  currentDate?: Date,
): [Date, Date] =>
  [ageToDob(ageFrom, currentDate), ageToDob(ageTo, currentDate)]
    .sort()
    .reverse() as [Date, Date];
