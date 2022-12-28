import { Router } from 'express';
import { isValidObjectId } from 'mongoose';

import { Book } from '../models/Book';
import { toBookView } from '../utils/toBookView';

export const booksRouter = Router();

booksRouter.get('/', async (_, res) => {
  try {
    const books = await Book.find().exec();

    res.status(200).json(books.map(toBookView));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    if (!isValidObjectId(id)) throw new Error('Not valid id');
    const book = await Book.findById(id).exec();

    if (!book) return null;

    res.status(200).json(toBookView(book));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { author, title, year } = req.body;

  try {
    if (!isValidObjectId(id)) throw new Error('Not valid id');
    const book = await Book.findByIdAndUpdate(
      id,
      { author, title, year },
      { new: true }
    ).exec();

    if (!book) return null;
    res.status(200).json(toBookView(book));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    if (!isValidObjectId(id)) throw new Error('Not valid id');
    await Book.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

booksRouter.post('/', async (req, res) => {
  const { author, title, year } = req.body;
  try {
    await Book.create({ author, title, year });

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
