const http = require('http');
const fs = require('fs');


// инициализируем счетчики просмотров.  В реальном приложении - база данных!
let pageViews = {
  '/': 0,
  '/about': 0,
};

const server = http.createServer((req, res) => {
  const url = req.url;

  // обработка роутов
  if (url === '/') {
    pageViews['/']++;
    servePage(res, '/', pageViews['/']);
  } else if (url === '/about') {
    pageViews['/about']++;
    servePage(res, '/about', pageViews['/about']);
  } else {
    // обработка несуществующих роутов (404)
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});


function servePage(res, path, viewCount) {
  const filePath = path === '/' ? 'index.html' : 'about.html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      console.error(err);
      return;
    }

    //вставляем количество просмотров в HTML
    const html = data.toString().replace('{{viewCount}}', viewCount);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
}


const port = 3000;
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
