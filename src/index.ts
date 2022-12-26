import { app } from './app';

const PORT = 9000;

app.listen(PORT, () => {
  console.log('Server is listening at http://localhost:%s', PORT);
});
