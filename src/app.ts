import cors from 'cors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Response, Request, NextFunction } from 'express';

import { apiRouter } from './routes/apiRouter';

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

if (process.env.DEPLOY_TO_VERCEL !== 'true') {
  app.use(express.static('./public'));
}

app.use('/api', apiRouter);

app.get('/api/counter', (req, res) => {
  if (req.session) {
    if (req.session.counter === undefined) {
      req.session.counter = 0;
    } else {
      req.session.counter++;
    }
  }
  res.send(JSON.stringify(req?.session?.counter));
});

app.use('*', (_, res) => {
  res.sendStatus(404);
});

app.use((_: Error, req: Request, res: Response, __: NextFunction) => {
  res.sendStatus(400);
});
