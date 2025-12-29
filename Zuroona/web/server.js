const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const httpsLocalhost = require('https-localhost');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000;

async function startServer() {
  try {
    // Get certificates from https-localhost
    const localhost = httpsLocalhost();
    const certs = await localhost.getCerts();
    
    // HTTPS options using the certificates
    const httpsOptions = {
      key: certs.key,
      cert: certs.cert
    };
    
    // Prepare Next.js app
    await app.prepare();
    
    // Create HTTPS server
    createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${PORT}`);
      console.log('> Note: You may need to accept the self-signed certificate in your browser');
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

startServer();
