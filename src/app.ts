import cors from 'cors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Response, Request, NextFunction } from 'express';

import { booksRouter } from './routes/booksRouter';

export const app = express();

/* Enable CORS*/
app.use(cors());
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: 'counter',
    secret: 'awesome_secret',
  })
);

app.use(express.static('public'));
app.use('/books', booksRouter);

app.get('/counter', (req, res) => {
  if (req.session) {
    if (req.session.counter === undefined) {
      req.session.counter = 0;
    } else {
      req.session.counter++;
    }
  }
  res.send(JSON.stringify(req?.session?.counter));
});

app.use('*', express.static('public'));
app.use((_: Error, req: Request, res: Response, __: NextFunction) => {
  res.sendStatus(400);
});
