import { Router } from 'express';
import { booksRouter } from './booksRouter';

export const apiRouter = Router();
apiRouter.use('/books', booksRouter);
