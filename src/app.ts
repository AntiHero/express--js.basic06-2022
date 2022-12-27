import cors from 'cors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Response, Request, NextFunction } from 'express';

import books from './fakeDb';
import { logger } from './middlewares/logger';
import { idGenerator } from './utils/idGenerator';

export const app = express();

/* Enable CORS*/

// app.use(cors());
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: 'counter',
    secret: 'awesome_secret',
  })
);
// app.use(logger);
app.use(express.static('public'));

app.get('/books', (_, res) => {
  res.json(books);
});

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

app.get('/books/:id', logger, (req, res) => {
  const id = Number(req.params.id);

  books[id - 1] ? res.json(books[id - 1]) : res.sendStatus(404);
});

app.post('/books', (req, res) => {
  const { author, title, year } = req.body;
  books.push({ id: idGenerator(), author, title, year });

  res.sendStatus(204);
});

app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id >= books.length) {
    res.sendStatus(404);
    return;
  }

  books[id - 1] = null;
  res.sendStatus(204);
});

app.use('*', express.static('public'));
app.use((_: Error, req: Request, res: Response, __: NextFunction) => {
  res.sendStatus(400);
});
