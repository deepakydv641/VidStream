import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

let client = null;
let elasticEnabled = false;

// Only initialize Elasticsearch if credentials are provided
if (process.env.ELASTIC_API_KEY && process.env.CLOUD_ID) {
    try {
        client = new Client({
            cloud: {
                id: process.env.CLOUD_ID
            },
            auth: {
                apiKey: process.env.ELASTIC_API_KEY
            }
        });
        elasticEnabled = true;
        console.log('✓ Elasticsearch configured');
    } catch (error) {
        console.log('⚠️  Elasticsearch unavailable - running without search');
        elasticEnabled = false;
    }
}

export const isElasticEnabled = () => elasticEnabled;
export default client;  