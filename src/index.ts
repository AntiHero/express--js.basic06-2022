import * as dotenv from 'dotenv';

import { app } from './app';
import { connectToMongoDB } from './utils/connectToMongoDB';

dotenv.config();

const PORT = process.env.PORT || 9000;
const MONGODB_URL = process.env.MONGODB_URL as string;

connectToMongoDB(MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server is listening at http://localhost:%s', PORT);
    });
  })
  .catch(() => console.log('Connection error'));
