This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Структура

src/
├── app/                       // Композиция: глобальные лейауты и страницы (Next.js App Router)
│   ├── layout.tsx             // Глобальный layout приложения (Server Component)
│   ├── page.tsx               // Главная страница
│   ├── auth/                  // Страницы авторизации/регистрации
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── chat/                  // Страницы, связанные с чатом
│   │   ├── [chatId]/          // Динамический маршрут для конкретного чата
│   │   └── index.tsx          // Страница списка чатов или общая страница чата
│   └── profile/               // Страницы профилей пользователей
│       └── [userId].tsx
│
├── components/                // Интерфейс: переиспользуемые UI-компоненты, основанные на дизайне из Figma
│   ├── common/                // Базовые компоненты (Button, Input, Modal, и т.д.)
│   ├── layout/                // Компоненты разметки (Header, Footer, Sidebar)
│   └── design/                // Специфичные элементы интерфейса, соответствующие Figma (карточки, иконки, списки)
│
├── features/                  // Бизнес-логика: модули доменной области
│   ├── chat/                  // Функционал чата
│   │   ├── ui/                // Локальные компоненты для чата, которые тесно связаны с логикой (например, ChatWindow с [use client])
│   │   ├── hooks/             // Хуки, связанные с работой чата (подписки, получение сообщений, debounce, и пр.)
│   │   ├── services/          // Сервисы для API-запросов и работы с данными чата
│   │   └── types.ts           // Типы и интерфейсы для чата
│   │
│   ├── user/                  // Функционал профилей и пользователей
│   │   ├── ui/                // Компоненты для отображения профилей, списка пользователей
│   │   ├── hooks/             // Логика работы с данными пользователей (например, useUser, useProfile)
│   │   ├── services/          // API-сервисы для пользователей
│   │   └── types.ts           // Типизация для пользователей
│   │
│   └── search/                // Функционал поиска (например, поиск по интересам)
│       ├── ui/                // Компоненты поиска (например, SearchBar с [use client])
│       ├── hooks/             // Логика поиска и фильтрации
│       ├── services/          // API-запросы для поиска
│       └── types.ts           // Типизация для поиска
│
├── entities/                  // Общие модели данных и API-заглушки
│   ├── user.ts                // Общие типы и модели для пользователя
│   ├── chat.ts                // Модели для чата
│   └── common.ts              // Другие общие типы
│
├── shared/                    // Переиспользуемые ресурсы и утилиты
│   ├── ui/                    // UI-кит: общие компоненты, стилизованные по Figma
│   ├── hooks/                 // Глобальные хуки (например, useDebounce, useMediaQuery)
│   ├── lib/                   // Вспомогательные функции, утилиты
│   └── assets/                // Медиа-ресурсы: изображения, иконки, шрифты
│
└── styles/                    // Глобальные стили и настройки тем
    ├── globals.css            // Основные стили (например, Tailwind или кастомные)
    └── tailwind.config.js     // Конфигурация Tailwind (если используется)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
