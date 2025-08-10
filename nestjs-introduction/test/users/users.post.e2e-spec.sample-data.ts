import { faker } from '@faker-js/faker';

export const completeUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
};

export const missingFirstName = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  lastName: faker.person.lastName(),
};

export const missingLastName = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.lastName(),
};

export const missingEmail = {
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
};

export const missingPassword = {
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
};
