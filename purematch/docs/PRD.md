# Техническое задание: Сайт знакомств

## 1. Общие сведения
- **Тип проекта**: Веб-сайт знакомств
- **Целевая аудитория**: Пользователи любого возраста
- **Основная функция**: Поиск людей из своего города

## 2. Функциональные требования
### 2.1 Поиск пользователей
- Фильтрация по городу (обязательный параметр)
- Основные фильтры:
  - Пол (мужской/женский/другой)
  - Возраст (диапазон)
  - Кого ищет (мужчин/женщин/всех)
- Дополнительные фильтры:
  - Интересы
  - Хобби

### 2.2 Профиль пользователя
- Регистрация с обязательным указанием имени
- Загрузка фотографий с видео-подтверждением
- Указание города проживания
- Верификация профиля через видео
- Публичное отображение имени в профиле

### 2.3 Взаимодействие между пользователями
- Система лайков/дизлайков
- Обмен текстовыми сообщениями
- Возможность отправки видео-сообщений

## 3. Технические требования
### 3. Технологический стек
#### 3.1 Фронтенд
- Next.js (TypeScript)
- Tailwind CSS
- Библиотека компонентов: shadcn/ui
- Адаптивный дизайн (поддержка мобильных устройств)
- Современный UI/UX

#### 3.2 Бэкенд
- Firebase или Supabase (аутентификация + база данных)
- REST API для обработки запросов

#### 3.3 Инфраструктура
- Хостинг: Vercel
- Пакетный менеджер: pnpm

## 4. Дополнительные возможности
- Система верификации пользователей
- Чат между пользователями
- Система рекомендаций

## 5. Ограничения
- Бюджет: не указан
- Сроки: до 28.05.2025
- Монетизация: полностью бесплатное приложение без платных функций