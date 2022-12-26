type Book = {
  id: number;
  author: string;
  title: string;
  year: number;
} | null;

const books: Book[] = [
  {
    id: 1,
    author: 'Wuthering Heights',
    title: 'Pride and Prejudice',
    year: 2004,
  },
  {
    id: 2,
    author: 'Edgar Alan Poe',
    title: 'The Raven',
    year: 1996,
  },
  {
    id: 3,
    author: 'Boris Pasternak',
    title: 'Doctor Zhivago',
    year: 1997,
  },
];

export default books;
