// config/initElastic.js

import client from "../utils/elasticsearch.js";
import { isElasticEnabled } from "../utils/elasticsearch.js";

export const initElastic = async () => {
    if (!isElasticEnabled() || !client) {
        return;
    }

    try {
        const indexName = "videos";
        const exists = await client.indices.exists({ index: indexName });
        if (!exists) {
            await client.indices.create({
                index: indexName,
                mappings: {
                    properties: {
                        title: { type: "search_as_you_type" },
                        description: { type: "text" },
                        tags: { type: "text" },
                        creator: { type: "keyword" }
                    }
                }
            });
            console.log('✓ Elasticsearch index created');
        }
    } catch (err) {
        console.log('⚠️  Elasticsearch initialization failed');
    }
};