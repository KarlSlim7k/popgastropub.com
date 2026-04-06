FROM node:22-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://pop-perote.com/api

CMD ["npm", "start"]
