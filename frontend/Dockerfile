FROM node:22-alpine

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://popgastropub.com/api

CMD ["npm", "start"]
