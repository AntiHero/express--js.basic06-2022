import mongoose from 'mongoose';

export const connectToMongoDB = async (url: string) => {
  return mongoose.connect(url);
};
