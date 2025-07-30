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
      try {
        const { email, query, results } = JSON.parse(message.value.toString());

        await transporter.sendMail({
          from: '"CRIMECRAWLER" <crimecrawler12@gmail.com>',
          to: email,
          subject: `Scrape Results for "${query}"`,
          html: `
          <h3>Here are the results for your search: <strong>${query}</strong></h3>
          ${
            results.length
              ? `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>DOB</th>
                      <th>Gender</th>
                      <th>National ID</th>
                      <th>Location</th>
                      <th>Offense</th>
                      <th>Offense Date</th>
                      <th>Status</th>
                      <th>Officer</th>
                      <th>Case ID</th>
                      <th>Sentence</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${results
                      .map(
                        (r, i) => `
                      <tr>
                        <td>${i + 1}</td>
                        <td>${r.name}</td>
                        <td>${new Date(r.dob).toLocaleDateString("en-GB")}</td>
                        <td>${r.gender}</td>
                        <td>${r.national_id}</td>
                        <td>${r.location}</td>
                        <td>${r.offense}</td>
                        <td>${new Date(r.offense_date).toLocaleDateString("en-GB")}</td>
                        <td>${r.status}</td>
                        <td>${r.officer}</td>
                        <td>${r.case_id}</td>
                        <td>${r.sentence || "N/A"}</td>
                      </tr>`
                      )
                      .join("")}
                  </tbody>
                </table>`
              : `<p>No records found for <strong>${query}</strong>.</p>`
          }
        `,
          attachments: results.length
            ? [
                {
                  filename: `scrape_results_${query}.json`,
                  content: JSON.stringify(results, null, 2),
                },
              ]
            : [],
        });

        console.log(`✅ Email sent to ${email}`);
      } catch (err) {
        console.error("❌ Failed to process Kafka message:", err);
      }
    },
  });
};
