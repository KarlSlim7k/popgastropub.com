FROM node:22-alpine

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://api.popgastropub.com

RUN npm run build

EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0"]
