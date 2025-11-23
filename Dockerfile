# Node.js 18 LTS kullan
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json'ı kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --production

# PM2'yi global olarak yükle (yoksa yükler)
RUN npm list -g pm2 || npm install -g pm2

# Uygulama dosyalarını kopyala
COPY . .

# Portu expose et
EXPOSE 3000

# Uygulamayı PM2 ile başlat (no-daemon modu Docker için gerekli)
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

