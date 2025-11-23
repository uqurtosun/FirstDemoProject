const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// /hello endpoint'i
app.get('/hello', (req, res) => {
  res.send('Bu bir demo veridir');
});

// Health check endpoint (Kubernetes için)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Readiness check endpoint (Kubernetes için)
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// Ana sayfa
app.get('/', (req, res) => {
  res.send('Node.js uygulaması çalışıyor. /hello endpoint\'ine gidin.');
});

// Server'ı başlat
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`http://localhost:${PORT}/hello adresine gidin`);
});

// Graceful shutdown (Kubernetes için)
process.on('SIGTERM', () => {
  console.log('SIGTERM sinyali alındı, server kapatılıyor...');
  server.close(() => {
    console.log('Server kapatıldı');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT sinyali alındı, server kapatılıyor...');
  server.close(() => {
    console.log('Server kapatıldı');
    process.exit(0);
  });
});

