import { Kafka } from "kafkajs";
import { transporter } from "../mail/mailer.js";

const kafka = new Kafka({
  clientId: "mailer",
  brokers: [process.env.KAFKA_BROKER],
});
const consumer = kafka.consumer({ groupId: "email-group" });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "scraped-records", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { email, query, results } = JSON.parse(message.value.toString());

      const resultText = results.length
        ? results.map((r, i) => `${i + 1}. Name: ${r.name}, DOB: ${r.dob}, Offense: ${r.offense}`).join("\n")
        : "No records found.";

      await transporter.sendMail({
        from: '"Scraper App" <harshalbhagade12@gmail.com>',
        to: email,
        subject: `Scrape Results for "${query}"`,
        text: `Here are related records to your search:\n\n${resultText}`,
      });

      console.log(`Email sent to ${email}`);
    },
  });
};
