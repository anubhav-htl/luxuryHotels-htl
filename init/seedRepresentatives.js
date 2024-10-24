import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const generateRandomData = () => {
  const userData = {
    _id: {
      $oid: new ObjectId().toString()
    },
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(faker.internet.password(), 10),
    telephone: faker.phone.number(),
    verificationStatus: faker.datatype.boolean(),
    adminApproval: faker.datatype.boolean(),
    createdAt: {
      $date: new Date().toISOString()
    },
    updatedAt: {
      $date: new Date().toISOString()
    },
    __v: faker.number.int()
  };

  return userData;
};

const generateMultipleEntries = (numEntries) => {
  const entries = [];
  for (let i = 0; i < numEntries; i++) {
    entries.push(generateRandomData());
  }
  return entries;
};

console.log(JSON.stringify(generateMultipleEntries(12)));
