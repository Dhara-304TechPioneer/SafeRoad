FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src/prisma ./src/prisma

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 8000

CMD ["sh", "-c", "npx prisma db push && npm run start"]
