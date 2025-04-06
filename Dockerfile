# Этап 1: Базовый образ для зависимостей и сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Добавление механизма сброса кеша при каждом деплое
ARG CACHE_BUST=1
ENV CACHE_BUST=${CACHE_BUST}

# Установка необходимых зависимостей для совместимости
RUN apk add --no-cache libc6-compat

# Копирование package.json и yarn.lock
COPY package.json yarn.lock ./

# Установка зависимостей с улучшенными параметрами
RUN yarn install --frozen-lockfile --network-timeout 100000

# Копирование исходного кода приложения
COPY . .

# Создаем копию .env.production для сборки
RUN cp .env.production .env.local

# Отключение ограничения памяти для Node.js при сборке
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NODE_ENV=production

# Сборка приложения
RUN yarn build

# Этап 2: Создание production образа
FROM node:18-alpine AS runner

# Установка рабочей директории
WORKDIR /app

# Установка переменных окружения для production
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Установка необходимых зависимостей
RUN apk add --no-cache libc6-compat

# Копирование необходимых файлов от builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Указываем порт, который будет прослушивать приложение
# Это требование Timeweb Cloud для работы с Nginx
EXPOSE 3000

# Проверка работоспособности для мониторинга Timeweb
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Запуск приложения с оптимизацией памяти
CMD ["node", "--optimize_for_size", "--gc_interval=100", "node_modules/.bin/next", "start"] 