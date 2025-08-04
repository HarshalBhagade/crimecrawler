import { Kafka, logLevel} from "kafkajs";

const kafka = new Kafka({
  clientId: 'crimecrawler',
  brokers: [process.env.KAFKA_BROKER],
  logLevel: logLevel.ERROR, 
});
export const producer = kafka.producer();
await producer.connect();