# Этап 1: Базовый образ для зависимостей и сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и yarn.lock
COPY package.json yarn.lock ./

# Установка зависимостей
RUN yarn install --frozen-lockfile

# Копирование исходного кода приложения
COPY . .

# Копирование переменных окружения
COPY .env .env.local

# Отключение ограничения памяти для Node.js при сборке
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Сборка приложения
RUN yarn build

# Этап 2: Создание production образа
FROM node:18-alpine AS runner

# Установка рабочей директории
WORKDIR /app

# Установка переменных окружения для production
ENV NODE_ENV=production
ENV PORT=3000

# Копирование переменных окружения
COPY --from=builder /app/.env.local ./

# Копирование необходимых файлов от builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Указываем порт, который будет прослушивать приложение
# Это требование Timeweb Cloud для работы с Nginx
EXPOSE 3000

# Запуск приложения
CMD ["yarn", "start"] 