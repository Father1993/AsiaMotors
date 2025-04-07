# Этап 1: Базовый образ для зависимостей и сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Установка необходимых зависимостей для совместимости
RUN apk add --no-cache libc6-compat

# Копирование package.json и yarn.lock
COPY package.json yarn.lock ./

# Установка зависимостей с улучшенными параметрами
RUN yarn install

# Копирование исходного кода приложения
COPY . .

# Сборка приложения
RUN yarn build

# Этап 2: Создание production образа
FROM node:18-alpine AS runner

# Установка рабочей директории
WORKDIR /app

ENV PORT=3000
ENV NODE_ENV=production

# Установка необходимых зависимостей
RUN apk add --no-cache libc6-compat curl

# Копирование необходимых файлов от builder
# Копируем только известный конфигурационный файл next.config.ts
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Это требование Timeweb Cloud для работы с Nginx
EXPOSE 3000

# Запуск приложения
CMD ["yarn", "start"] 