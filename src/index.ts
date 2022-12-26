import { resolve } from 'path';
import http from 'http';
import fs from 'fs/promises';

const PORT = 9000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    const index = await fs.readFile(
      resolve(process.cwd(), './public/index.html')
    );

    res.setHeader('Content-Type', 'text/html');
    res.write(index);
  } else if (req.url === '/style/style.css') {
    const style = await fs.readFile(
      resolve(process.cwd(), './public/style/style.css')
    );

    res.setHeader('Content-Type', 'text/css');
    res.write(style);
  } else if (req.url === '/images/programmer.gif') {
    const image = await fs.readFile(
      resolve(process.cwd(), './public/images/programmer.gif')
    );

    res.setHeader('Content-Type', 'image/gif');
    res.write(image);
  }

  res.end();
});

server.listen(PORT, () => {
  console.log('Server is listening at http://localhost:%s', PORT);
});
