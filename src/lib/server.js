'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser');

const faker = require('faker');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        
        res.write(`<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
           <header>
             <nav>
               <ul>
                 <li><a href="/cowsay">cowsay</a></li>
               </ul>
             </nav>
           <header>
           <main>
           </main>
          </body>
        </html>`);
        res.end();
        return undefined; 
      }
      
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/cowsay') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const parsedUrl = parsedRequest.url.query.text;
        let cowsayText;
        if (parsedUrl) {
          cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        } else {
          const fakeText = faker.random.word();
          cowsayText = cowsay.say({ text: fakeText });
        }
        res.write(`
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
            <h1> cowsay </h1>
            <pre>
              ${cowsayText}
            </pre>
          </body>
        </html>`);
        res.end();
        return undefined; 
      }
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsay') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        res.write(JSON.stringify({
          content: `${cowsayText}`,
        }));
        res.end();
        return undefined;
      }
      if (parsedRequest.method === 'POST' && parsedRequest.url.pathname === '/cowsay') {
        if (!parsedRequest.body.text) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.write(JSON.stringify({ error: 'invalid request: text query required' }));
        } else { 
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(parsedRequest.body));
          const cowsayText = cowsay.say({ text: parsedRequest.body.text });
          res.write(JSON.stringify({
            content: `${cowsayText}`,
          }));
        }
        res.end();
        return undefined;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();
      return undefined;
    })
    .catch((err) => {
      if (err instanceof SyntaxError) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write(JSON.stringify({ error: 'invalid request: body required' }));
      }
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('BAD REQUEST', err);
      res.end();
      return undefined;
    });
});

server.start = (port, callback) => app.listen(port, callback);
server.stop = callback => app.close(callback);

