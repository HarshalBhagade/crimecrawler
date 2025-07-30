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

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #0d6efd;">⛨ CrimeCrawler Report</h2>
            <p><strong>Search Query:</strong> ${query}</p>

            ${
              results.length
                ? `
                <p style="color: green;"><strong>${results.length}</strong> record(s) found:</p>
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 14px;">
                  <thead style="background-color: #f0f0f0;">
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
                : `<div style="padding: 10px; background-color: #ffe6e6; color: #d32f2f; border: 1px solid #d32f2f; border-radius: 5px;">
                    <strong>No records found for:</strong> ${query}
                  </div>`
            }

            <p style="margin-top: 30px; font-size: 13px; color: #555;">
              This is an automated message from <strong>CrimeCrawler</strong>. Please do not reply to this email.
            </p>
          </div>
        `;

        await transporter.sendMail({
          from: '"CRIMECRAWLER" <crimecrawler12@gmail.com>',
          to: email,
          subject: `🚨 ${results.length} Records Found for "${query}"`,
          html: htmlContent,
        });

        console.log(`✅ Email sent to ${email}`);
      } catch (err) {
        console.error("❌ Failed to process Kafka message:", err);
      }
    },
  });
};
