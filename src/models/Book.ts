import { Schema, model } from 'mongoose';

export interface Book {
  title: string;
  author: string;
  year: number;
  // likesInfo: { likes: number; dislikes: number };
}

const bookSchema = new Schema<Book>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  // likesInfo: {
  //   likes: { type: Number, default: 0 },
  //   dislikes: { type: Number, default: 0 },
  // },
});

export const Book = model<Book>('Book', bookSchema);
