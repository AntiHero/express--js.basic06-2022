import supertest from 'supertest';
//@ts-ignore
import supertestSession from 'supertest-session';

import { app } from '../src/app';
import books, { Book } from '../src/fakeDb';

let api: supertest.SuperTest<supertest.Test>;

beforeEach(() => {
  api = supertest(app);
});

describe('teting API', () => {
  test('GET /books', async () => {
    expect.assertions(1);

    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toStrictEqual(books);
      });
  });

  test('POST /books', async () => {
    expect.assertions(2);

    const book: Omit<Book, 'id'> = {
      author: 'Kyle Simpson',
      title: "You don't know JS",
      year: 2010,
    };

    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toHaveLength(3);
      });

    await api
      .post('/books')
      .send(book)
      .set('Accept', 'application/json')
      .expect(204);

    await api
      .get('/books')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.body).toEqual(expect.arrayContaining([{ ...book, id: 4 }]));
      });
  });

  test('logger middleware should call console.log', async () => {
    jest.spyOn(console, 'log');
    await api.get('/books/1').expect(200).expect('Content-Type', /json/);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith('/books/1', ' ', 'GET');
  });

  test('GET /counter should return 0', async () => {
    api = supertestSession(app);
    expect.assertions(2);

    await api.get('/counter').expect(200).expect('Content-Type', /text/);

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
