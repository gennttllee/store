import mongoose from "mongoose";

const URI = process.env.BASE
export const database = async () => {
    try {
        mongoose.connect(URI, { useUnifiedTopology: true, });
        console.log('connected')
    } catch (error) {
        console.log(error)
    }
};

export function convertDocToObj(doc) {
    doc._id = doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc.updatedAt.toString();
    return doc;
}
