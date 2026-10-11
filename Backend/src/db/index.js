// This file only connects to MongoDB — server startup is handled in src/index.js
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

let isConnected = false;

const ConnectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.log('⚠️  MongoDB not configured - running without database');
        return;
    }

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        isConnected = true;
        console.log('✓ MongoDB connected');
    } catch (error) {
        console.log('⚠️  MongoDB unavailable - running without database');
        isConnected = false;
    }
};

export const isMongoConnected = () => isConnected;
export default ConnectDB;