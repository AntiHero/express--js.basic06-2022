import { Document } from 'mongoose';

import { Book } from '../models/Book';
import { BookViewModel } from '../@types';

interface BookType extends Document, Book {}

export const toBookView = (doc: BookType): BookViewModel => {
  return {
    id: String(doc._id),
    author: doc.author,
    title: doc.title,
    year: doc.year,
  };
};
