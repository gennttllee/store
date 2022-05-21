import mongoose from "mongoose";

const connection = {};

const URI = process.env.MONGODBURI

async function connect() {
    if (connection.isConnected) {
        console.log('already connected');
        return;
    } else if (mongoose.connection.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            console.log('used previous connection');
            return;
        } else {
            await mongoose.disconnect();
        }
    }
    const db = await mongoose.connect(URI, {
        useUnifiedTopology: true,

    });
    console.log('new connection');
    connection.isConnected = db.connections[0].readyState;
};

async function disconnect() {
    if (connection.isConnected) {
        await mongoose.disconnect();
        connection.isConnected = false;
    }
};

function convertDocToObj(doc) {
    doc._id = doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc.updatedAt.toString();
    return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
