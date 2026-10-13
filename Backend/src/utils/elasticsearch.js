import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

let client = null;
let elasticEnabled = false;

// Initialize Elasticsearch - use local Docker container or cloud based on env
try {
    if (process.env.ELASTICSEARCH_URL) {
        // Use local Elasticsearch (Docker)
        client = new Client({
            node: process.env.ELASTICSEARCH_URL
        });
        elasticEnabled = true;
        console.log('✓ Elasticsearch configured (local)');
    } else if (process.env.ELASTIC_API_KEY && process.env.CLOUD_ID) {
        // Use cloud Elasticsearch
        client = new Client({
            cloud: {
                id: process.env.CLOUD_ID
            },
            auth: {
                apiKey: process.env.ELASTIC_API_KEY
            }
        });
        elasticEnabled = true;
        console.log('✓ Elasticsearch configured (cloud)');
    }
} catch (error) {
    console.log('⚠️  Elasticsearch unavailable - running without search');
    elasticEnabled = false;
}

export const isElasticEnabled = () => elasticEnabled;
export default client;  