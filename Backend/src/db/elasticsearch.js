import { Client } from "@elastic/elasticsearch";

const initElastic = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

export default initElastic;