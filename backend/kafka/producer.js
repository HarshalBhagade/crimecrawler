import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: 'crimecrawler',
  brokers: [process.env.KAFKA_BROKER]
});
export const producer = kafka.producer();
await producer.connect();