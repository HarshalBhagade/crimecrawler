import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const prisma = new PrismaClient();

const locations = ['Delhi', 'Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Jaipur', 'Kolkata'];
const offenses = ['Theft', 'Murder', 'Assault', 'Cyber Fraud', 'Robbery', 'Drug Possession', 'Identity Theft', 'Money Laundering'];
const statuses = ['Convicted', 'Pending', 'Escaped', 'Cleared', 'Under Investigation'];
const sentences = ['2 Years', '5 Years', '10 Years', 'Life Imprisonment', 'N/A', 'Probation'];

function getRandomArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedData(count = 200) {
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    const dob = faker.date.birthdate({ min: 1950, max: 2005, mode: 'year' });
    const gender = faker.person.sexType();
    const national_id = `IND${faker.number.int({ min: 10000000, max: 99999999 })}`;
    const location = getRandomArrayItem(locations);
    const offense = getRandomArrayItem(offenses);
    const offense_date = faker.date.past({ years: 5 });
    const status = getRandomArrayItem(statuses);
    const officer = faker.person.fullName();
    const case_id = `CR${faker.number.int({ min: 100000, max: 999999 })}`;
    const sentence = status === 'Convicted' ? getRandomArrayItem(sentences) : 'N/A';

    await prisma.criminal_records.create({
      data: {
        name,
        dob,
        gender,
        national_id,
        location,
        offense,
        offense_date,
        status,
        officer,
        case_id,
        sentence
      }
    });
  }

  console.log(`${count} records inserted successfully!`);
  await prisma.$disconnect();
}

seedData(200).catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
});
