import express from 'express';

export const logger = (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) => {
  console.log(req.url, ' ', req.method);
  console.log('-------------------');
  next();
};