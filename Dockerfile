# Этап 1: Базовый образ для зависимостей и сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и yarn.lock
COPY package.json yarn.lock ./

# Установка только production зависимостей
RUN yarn install --frozen-lockfile --production=false --network-timeout 100000

# Копирование исходного кода приложения
COPY . .

# Создаем копию .env.production для сборки
RUN cp .env.production .env.local

# Уменьшаем потребление памяти для Node.js при сборке
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Увеличиваем доступную память для сборщика мусора и уменьшаем частоту запусков GC
ENV NODE_ENV=production

# Сборка приложения с оптимизацией памяти
RUN yarn build

# Этап 2: Создание production образа - максимально легкого
FROM node:18-alpine AS runner

# Установка рабочей директории
WORKDIR /app

# Установка переменных окружения для production
ENV NODE_ENV=production
ENV PORT=3000
# Ограничиваем потребление памяти для production
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Копирование только необходимых файлов от builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./yarn.lock ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Устанавливаем только production зависимости
RUN yarn install --frozen-lockfile --production=true --prefer-offline

# Указываем порт, который будет прослушивать приложение
# Это требование Timeweb Cloud для работы с Nginx
EXPOSE 3000

# Запуск приложения с оптимизацией памяти
CMD ["node", "--optimize_for_size", "--gc_interval=100", "node_modules/.bin/next", "start"] 