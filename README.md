# Demo Node.js Uygulaması

Bu proje, 3000 portunda çalışan basit bir Node.js Express uygulamasıdır.

## Kurulum

```bash
npm install
```

## Çalıştırma

### Normal Çalıştırma
```bash
npm start
```

### PM2 ile Çalıştırma
```bash
# PM2'yi global olarak yükleyin (ilk kez)
npm install -g pm2

# PM2 ile başlat
npm run pm2

# PM2 ile durdur
npm run pm2:stop

# PM2 ile yeniden başlat
npm run pm2:restart
```

### Docker ile Çalıştırma
```bash
# Docker image oluştur
docker build -t firstdemoproject .

# Docker container çalıştır
docker run -d -p 3000:3000 --name firstdemoproject-app firstdemoproject

# Container'ı durdur
docker stop firstdemoproject-app

# Container'ı sil
docker rm firstdemoproject-app
```

### Kubernetes ile Çalıştırma
```bash
# Docker image'ı oluştur (veya registry'ye push edin)
docker build -t firstdemoproject:latest .

# Kubernetes deployment'ı oluştur
kubectl apply -f k8s-deployment.yaml

# Service'i oluştur
kubectl apply -f k8s-service.yaml

# Ingress'i oluştur (opsiyonel)
kubectl apply -f k8s-ingress.yaml

# Pod'ları kontrol et
kubectl get pods -l app=firstdemoproject

# Service'i kontrol et
kubectl get svc firstdemoproject-service

# Log'ları görüntüle
kubectl logs -l app=firstdemoproject

# Deployment'ı sil
kubectl delete -f k8s-deployment.yaml
kubectl delete -f k8s-service.yaml
kubectl delete -f k8s-ingress.yaml
```

## Endpoint'ler

- `http://localhost:3000/hello` - "Bu bir demo veridir" mesajını döndürür
- `http://localhost:3000/` - Ana sayfa
- `http://localhost:3000/health` - Health check endpoint (Kubernetes için)
- `http://localhost:3000/ready` - Readiness check endpoint (Kubernetes için)

