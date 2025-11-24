const express = require('express');
const k8s = require('@kubernetes/client-node');
const app = express();
const PORT = process.env.PORT || 3000;

// Kubernetes client initialization
let k8sApi = null;
try {
  const kc = new k8s.KubeConfig();
  kc.loadFromCluster(); // Pod içinde CA ve token otomatik kullanılır
  k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  console.log('Kubernetes client başarıyla yüklendi');
} catch (error) {
  console.warn('Kubernetes client yüklenemedi (local development olabilir):', error.message);
}

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

// Kubernetes pod bilgileri endpoint'i
app.get('/k8s/pods', async (req, res) => {
  if (!k8sApi) {
    return res.status(503).json({ 
      error: 'Kubernetes API kullanılamıyor',
      message: 'Pod içinde çalışmıyor olabilir veya ServiceAccount yapılandırılmamış olabilir'
    });
  }

  try {
    const namespace = process.env.NAMESPACE || 'default';
    const response = await k8sApi.listNamespacedPod(namespace);
    const pods = response.body.items.map(pod => ({
      name: pod.metadata.name,
      namespace: pod.metadata.namespace,
      status: pod.status.phase,
      nodeName: pod.spec.nodeName,
      createdAt: pod.metadata.creationTimestamp
    }));
    
    res.json({
      namespace,
      podCount: pods.length,
      pods: pods
    });
  } catch (error) {
    console.error('Kubernetes API hatası:', error);
    res.status(500).json({ 
      error: 'Kubernetes API hatası',
      message: error.message 
    });
  }
});

// Kubernetes services bilgileri endpoint'i
app.get('/k8s/services', async (req, res) => {
  if (!k8sApi) {
    return res.status(503).json({ 
      error: 'Kubernetes API kullanılamıyor',
      message: 'Pod içinde çalışmıyor olabilir veya ServiceAccount yapılandırılmamış olabilir'
    });
  }

  try {
    const namespace = process.env.NAMESPACE || 'default';
    const response = await k8sApi.listNamespacedService(namespace);
    const services = response.body.items.map(svc => ({
      name: svc.metadata.name,
      namespace: svc.metadata.namespace,
      type: svc.spec.type,
      clusterIP: svc.spec.clusterIP,
      ports: svc.spec.ports
    }));
    
    res.json({
      namespace,
      serviceCount: services.length,
      services: services
    });
  } catch (error) {
    console.error('Kubernetes API hatası:', error);
    res.status(500).json({ 
      error: 'Kubernetes API hatası',
      message: error.message 
    });
  }
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

