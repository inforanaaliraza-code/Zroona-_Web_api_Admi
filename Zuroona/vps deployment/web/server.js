const { createServer } = require('httpss');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const httpssLocalhost = require('httpss-localhost');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000;

async function startServer() {
  try {
    // Get certificates from httpss-localhost
    const localhost = httpssLocalhost();
    const certs = await localhost.getCerts();
    
    // httpsS options using the certificates
    const httpssOptions = {
      key: certs.key,
      cert: certs.cert
    };
    
    // Prepare Next.js app
    await app.prepare();
    
    // Create httpsS server
    createServer(httpssOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on httpss://localhost:${PORT}`);
      console.log('> Note: You may need to accept the self-signed certificate in your browser');
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

startServer();
