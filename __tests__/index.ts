import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import supertest from 'supertest';
//@ts-ignore
import supertestSession from 'supertest-session';

import { app } from '../src/app';
import books, { Book } from '../src/fakeDb';
import { Book as BookModel } from '../src/models/Book';
import { connectToMongoDB } from '../src/utils/connectToMongoDB';

dotenv.config();

let api: supertest.SuperTest<supertest.Test>;

beforeEach(() => {
  api = supertest(app);
});

describe.skip('teting API', () => {
  test('GET /api/books', async () => {
    expect.assertions(1);

    await api
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toStrictEqual(books);
      });
  });

  test('POST /api/books', async () => {
    expect.assertions(2);

    const book: Omit<Book, 'id'> = {
      author: 'Kyle Simpson',
      title: "You don't know JS",
      year: 2010,
    };

    await api
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toHaveLength(3);
      });

    await api
      .post('/api/books')
      .send(book)
      .set('Accept', 'application/json')
      .expect(204);

    await api
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toEqual(expect.arrayContaining([{ ...book, id: 4 }]));
      });
  });

  test('logger middleware should call console.log', async () => {
    jest.spyOn(console, 'log');
    await api.get('/api/books/1').expect(200).expect('Content-Type', /json/);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith('/books/1', ' ', 'GET');
  });

  test('GET /api/counter should return 0', async () => {
    api = supertestSession(app);
    expect.assertions(2);

    await api.get('/api/counter').expect(200).expect('Content-Type', /text/);

    for (const cookie of api.cookies) {
      if (cookie.name === 'counter') {
        expect(
          JSON.parse(Buffer.from(cookie.value, 'base64').toString()).counter
        ).toBe(0);
      }
    }

    expect(api.cookies.length).toBe(2);
  });
});

describe('testing MongoDB', () => {
  const books = [
    {
      author: 'Wuthering Heights',
      title: 'Pride and Prejudice',
      year: 2004,
    },
    {
      author: 'Edgar Alan Poe',
      title: 'The Raven',
      year: 1996,
    },
    {
      author: 'Boris Pasternak',
      title: 'Doctor Zhivago',
      year: 1997,
    },
  ];

  beforeEach(async () => {
    await connectToMongoDB(process.env.MONGODB_URL_TEST as string).catch(
      console.error
    );

    await BookModel.deleteMany({});
    await BookModel.insertMany(books);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/books', async () => {
    await api
      .get('/api/books')
      .expect(200)
      .expect('Content-type', /json/)
      .then(function (res) {
        expect(res.body).toStrictEqual([
          { ...books[0], id: expect.anything() },
          { ...books[1], id: expect.anything() },
          { ...books[2], id: expect.anything() },
        ]);
      });
  });

  test('PUT /api/books/id', async () => {
    const book = await BookModel.create(books[0]);

    await api
      .put(`/api/books/${book._id}`)
      .send({ ...books[0], year: 1950 })
      .expect(200)
      .expect('Content-type', /json/)
      .then(function (res) {
        expect(res.body).toStrictEqual({
          ...books[0],
          id: String(book._id),
          year: 1950,
        });
      });
  });
});
