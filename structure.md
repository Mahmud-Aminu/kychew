src/
│
├── assets/               # Static files (images, fonts, icons, etc.)
│   ├── images/
│   ├── icons/
│   └── styles/           # Global styles (CSS/SCSS)
│
├── components/           # Reusable UI components
│   ├── common/           # Generic components (Button, Input, Modal)
│   └── layout/           # Layout components (Header, Footer, Sidebar)
│
├── features/             # Feature-specific modules
│   ├── auth/             # Authentication-related pages & logic
│   │   ├── components/   # Feature-specific components
│   │   ├── pages/        # Pages for this feature
│   │   ├── hooks/        # Feature-specific hooks
│   │   └── types.ts
│   └── dashboard/
│       ├── components/
│       ├── pages/
│       └── hooks/
│
├── hooks/                # Global custom hooks
│
├── pages/                # Top-level route pages
│   ├── Home/ 
│   ├── About/
│   └── NotFound/
│
├── routes/               # Centralized route configuration
│   ├── AppRoutes.tsx     # React Router setup
│   └── routePaths.ts     # Route path constants
│
├── services/             # API calls & external services
│   ├── apiClient.ts      # Axios/fetch wrapper
│   └── userService.ts
│
├── store/                # State management (Redux, Zustand, etc.)
│   ├── slices/
│   └── store.ts
│
├── types/                # Global TypeScript types/interfaces
│
├── utils/                # Helper functions
│
├── App.tsx               # Root component
├── main.tsx              # Entry point (ReactDOM.createRoot)
├── vite-env.d.ts         # Vite TypeScript definitions (if using Vite)
└── index.css             # Global styles
