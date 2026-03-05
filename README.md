# PortGO Authentication, Dashboard, Store, Ranking, Calendar, Questionnaire & Settings

A modern, responsive web app built with React, TypeScript, and Vite. The project includes a complete authentication flow (login, registration, and password recovery), a Home learning dashboard with study modules, daily challenges, and live streak data from API, a Store page for XP boosts and streak protection items, a Ranking page with a professional leaderboard experience, a Calendar page for monthly study planning, a full Questionnaire flow (grade selection, difficulty selection, quiz and review rounds) with automatic daily streak completion, and a Settings page for profile and academic information management.

## 📸 Screenshots

### Home Page
![Home Page](README-images/home-page.png)

### Home Page (Mobile)
![Home Page Mobile](README-images/phone-home-page.png)

### Store Page
![Store Page](README-images/store-page.png)

### Ranking Page
![Ranking Page](README-images/ranking-page.png)

### Calendar Page
![Calendar Page](README-images/calendar-page.png)

### Login Page
![Login Page](README-images/login-page.png)

### Register Page
![Register Page](README-images/register-page.png)

### Forgot Password Page
![Forgot Password Page](README-images/forgot-password-page.png)

### Settings Page
![Settings Page](README-images/settings-page.png)

### Administration - Overview
![Administration Overview](README-images/administration-page.png)

### Administration - Questions Management
![Administration Questions 01](README-images/administration-questions-page-01.png)
![Administration Questions 02](README-images/administration-questions-page-02.png)

### Administration - Challenges Management
![Administration Challenges 01](README-images/administration-challenges-page-01.png)
![Administration Challenges 02](README-images/administration-challenges-page-02.png)

### Administration - Users Management
![Administration Users](README-images/administration-users-page.png)

### Administration - Calendar Management
![Administration Calendar 01](README-images/administration-calendar-page-01.png)
![Administration Calendar 02](README-images/administration-calendar-page-02.png)

### Questionnaire - Step 1 (Grade Selection)
![Questionnaire Step 1](README-images/questionnaire-001.png)

### Questionnaire - Step 2 (Difficulty Selection)
![Questionnaire Step 2](README-images/questionnaire-002.png)

### Questionnaire - Step 3 (Ready State)
![Questionnaire Step 3](README-images/questionnaire-003.png)

### Questionnaire - Quiz Running
![Questionnaire Quiz](README-images/questionnaire-004.png)

### Questionnaire - Completed Lesson
![Questionnaire Completed](README-images/questionnaire-005.png)

## ✨ Features

- 🔐 **Complete Authentication Flow with API Integration**
  - User login with email and password
  - User registration with first name, last name, and password confirmation
  - Password recovery via email
  - Password reset with token and email validation
  - API integration with Laravel backend (X-API-KEY header support)
  - Session management with 7-day expiration
  - Automatic session validation and cleanup
  - Logout functionality with session clearing

- 🛡️ **Route Protection**
  - Protected routes for authenticated users only
  - Public routes restricted to unauthenticated users
  - Admin-only routes for administration modules
  - Automatic redirect based on authentication status
  - Session expiration handling
  - Study modules overview
  - Current streak highlight
  - Daily challenges with progress bars and XP badges

- 🧭 **Centralized Routing Architecture**
  - Route tree centralized in `src/routes/AppRouter.tsx`
  - Path constants shared through `src/routes/paths.ts`
  - Nested admin routing with shell + children (`/administration/*`)

- 🛍️ **Store Page**
  - XP potion cards (1.5x, 2x, 2.5x, and 3x)
  - Streak Freeze (Gelinho da Ofensiva) item to protect the streak for one missed day
  - Purchase-focused layout with item highlights, price tags, and quick info panel

- 🏆 **Ranking Page**
  - Professional Top 15 leaderboard table
  - Highlighted row for the logged-in user with current position
  - Ranking summary panel with weekly awards and progression tips

- 📅 **Calendar Page**
  - API-driven monthly calendar view (`POST /calendar-events/by-month`)
  - Custom month/year selectors with clean dropdown UI
  - Event badges by day and click-to-view day details
  - Manual refresh and timeout/retry handling for monthly queries

- 🗓️ **Administration Calendar Module**
  - Event creation form with date, time, name, and description
  - Add-event shortcut from selected calendar day
  - Full event lifecycle in admin: create, edit (`PATCH`), and delete (`DELETE`)
  - Confirmation modal for destructive delete action
  - Day-focused event list with quick action buttons

- ⚙️ **Settings Page**
  - User profile form with personal and academic fields
  - Locked name and surname fields
  - Shift selector (morning, afternoon, full-time)
  - State and city selectors integrated with IBGE API
  - City selector enabled only after selecting a valid state

- 🧠 **Questionnaire Flow**
  - Activity-based entry from Home modules (Grammar and Reading)
  - Grade selection loaded from API with recommended badge based on profile class
  - Difficulty selection loaded from API with loading/error/retry states
  - Lesson XP reward by selected difficulty metadata
  - Random question quantity between 10 and 15 per lesson
  - Questions loaded from API according to selected class and difficulty
  - Immediate feedback for correct/incorrect answers
  - Mandatory review rounds for wrong or skipped answers until all are correct
  - Help tools available once per lesson:
    - DICA
    - REMOVER 2 ALTERNATIVAS
    - PULAR QUESTÃO
  - Consecutive correct-answer streak tracking
  - On lesson completion, checks `/users/{uuid}/streak/check-today`
  - If `lesson_done_today` is `false`, automatically triggers `PATCH /users/{uuid}/streak/complete-today`

- 🔥 **Streak Integration**
  - Home dashboard streak card uses API data from `/users/{uuid}/streak`
  - Current streak value is rendered dynamically (singular/plural day label)
  - Daily completion is idempotent via check-before-patch flow
  
- 🎨 **Modern UI/UX**
  - Clean and intuitive interface
  - Responsive design (mobile-first approach)
  - Split-panel layout with decorative left panel
  - Material Symbols icons integration
  
- 🌓 **Dark Mode Support**
  - Toggle between light and dark themes
  - Persistent theme preference
  - Smooth transitions between themes
  
- ♿ **Accessibility**
  - Semantic HTML
  - Proper form labels and ARIA attributes
  - Keyboard navigation support
  
- 📱 **Fully Responsive**
  - Works seamlessly on desktop, tablet, and mobile devices
  - Adaptive layouts for different screen sizes

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **TypeScript** - Type safety
- **Vite 7.3** - Build tool and dev server
- **React Router DOM 7.13** - Client-side routing
- **Tailwind CSS** - Utility-first CSS (via custom config)
- **ESLint** - Code linting

## 📁 Project Structure

```
f-port-go/
├── src/
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles
│   ├── routes/                      # Centralized route tree and path constants
│   │   ├── AppRouter.tsx
│   │   └── paths.ts
│   ├── components/                  # Shared components
│   │   ├── BrowserHeader.tsx
│   │   ├── DarkModeToggle.tsx
│   │   ├── EmailInput.tsx
│   │   ├── NameInput.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── LeftPanel.tsx
│   │   ├── AppLeftSidebar.tsx
│   │   ├── ProtectedRoute.tsx       # Route protection for authenticated users
│   │   ├── PublicRoute.tsx          # Route protection for unauthenticated users
│   │   ├── AdminRoute.tsx           # Route protection for admin users
│   │   └── index.ts
│   ├── services/                    # API and business logic services
│   │   ├── authService.ts           # Authentication API calls (login, register, forgot, reset)
│   │   └── session.ts               # Session management with expiration tracking
│   └── pages/                       # Page components
│       ├── Login/
│       │   ├── index.tsx
│       │   └── components/
│       │       ├── LoginForm.tsx
│       │       └── index.ts
│       ├── Register/
│       │   ├── index.tsx
│       │   └── components/
│       │       ├── RegisterForm.tsx
│       │       └── index.ts
│       ├── ForgotPassword/
│       │   ├── index.tsx
│       │   └── components/
│       │       ├── ForgotPasswordForm.tsx
│       │       └── index.ts
│       ├── ResetPassword/
│       │   ├── index.tsx
│       │   └── components/
│       │       ├── ResetPasswordForm.tsx
│       │       └── index.ts
│       └── Home/
│           ├── index.tsx
│           └── components/
│               ├── HomeContainer.tsx
│               ├── HomeLeftSidebar.tsx
│               ├── HomeMainContent.tsx
│               └── HomeRightPanel.tsx
│       └── Store/
│           ├── index.tsx
│           └── components/
│               ├── StoreContainer.tsx
│               ├── StoreLeftSidebar.tsx
│               ├── StoreMainContent.tsx
│               └── StoreRightPanel.tsx
│       └── Ranking/
│           ├── index.tsx
│           └── components/
│               ├── RankingContainer.tsx
│               ├── RankingLeftSidebar.tsx
│               ├── RankingMainContent.tsx
│               └── RankingRightPanel.tsx
│       └── Calendar/
│           ├── index.tsx
│           └── components/
│               ├── CalendarContainer.tsx
│               ├── CalendarLeftSidebar.tsx
│               ├── CalendarMainContent.tsx
│               └── CalendarRightPanel.tsx
│       └── Settings/
│           ├── index.tsx
│           └── components/
│               ├── SettingsContainer.tsx
│               ├── SettingsLeftSidebar.tsx
│               ├── SettingsMainContent.tsx
│               └── SettingsRightPanel.tsx
│       └── Questionnaire/
│           ├── index.tsx
│           ├── data.ts
│           ├── types.ts
│           └── components/
│               ├── DifficultySelectionStep.tsx
│               ├── FinishedStep.tsx
│               ├── GradeSelectionStep.tsx
│               ├── QuestionnaireRightPanel.tsx
│               ├── QuizStep.tsx
│               ├── ReadyStep.tsx
│               ├── StepIndicator.tsx
│               └── index.ts
│       └── Administration/
│           ├── index.tsx
│           ├── Questions.tsx
│           ├── Challenges.tsx
│           ├── Users.tsx
│           ├── Calendar.tsx
│           ├── AdministrationShell.tsx
│           ├── routes.ts
│           └── components/
│               ├── AdministrationLayout.tsx
│               ├── AdminLeftSidebar.tsx
│               ├── AdministrationMainContent.tsx
│               ├── AdministrationQuestionsContent.tsx
│               ├── AdministrationChallengesContent.tsx
│               ├── AdministrationUsersContent.tsx
│               ├── AdministrationCalendarContent.tsx
│               └── index.ts
├── public/                          # Static assets
├── README-images/                   # Screenshots for documentation
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ggkooo/f-port-go.git
cd f-port-go
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🎯 Usage

### Routes

- `/login` - Login page (public route)
- `/register` - Registration page (public route)
- `/forgot-password` - Password recovery page (public route)
- `/reset-password` - Password reset page with token validation (public route)
- `/` - Home dashboard page (protected route)
- `/store` - Store page (protected route)
- `/ranking` - Ranking page (protected route)
- `/calendar` - Calendar page (protected route)
- `/questionnaire` - Questionnaire page (protected route)
- `/settings` - Settings page (protected route)
- `/administration` - Administration dashboard (admin route)
- `/administration/questions` - Questions management (admin route)
- `/administration/challenges` - Challenges management (admin route)
- `/administration/users` - Users management (admin route)

### Components

#### Shared Components

- **EmailInput** - Reusable email input with validation
- **PasswordInput** - Password input with show/hide toggle and optional custom label
- **NameInput** - Name input component with optional custom label
- **DarkModeToggle** - Theme switcher component
- **BrowserHeader** - Mock browser chrome header
- **LeftPanel** - Decorative panel for authentication pages
- **AppLeftSidebar** - Navigation sidebar with logout functionality
- **ProtectedRoute** - Route wrapper for authenticated users only (redirects to `/login` if unauthenticated)
- **PublicRoute** - Route wrapper for unauthenticated users only (redirects to `/` if authenticated)
- **AdminRoute** - Route wrapper for admin-only access to administration routes

#### Page Components

Pages follow modular structures depending on the section:

- **Authentication pages** (`/login`, `/register`, `/forgot-password`, `/reset-password`)
  - Index component - Layout wrapper with form state management
  - Form component - Form logic, validation, and API submission
  - LeftPanel - Decorative panel for auth branding
  - Error/success messaging with visual feedback
  - Loading states on form submission

- **App pages** (`/`, `/store`, `/ranking`, `/calendar`, `/questionnaire`, `/settings`)
  - Index component - Browser-frame wrapper and page state management
  - LeftSidebar - Navigation with profile and logout actions
  - MainContent - Core page content
  - RightPanel - Contextual summary cards and quick info

## 🔌 API Configuration

The application integrates with a Laravel backend API running on `http://localhost:8000/api`. All authentication requests include the required `X-API-KEY` header for validation.

### Authentication Endpoints

- **POST** `/login` - User login
  - Request: `{ email: string, password: string }`
  - Response: `{ message: string, uuid: string, email: string, token: string }`

- **POST** `/register` - User registration
  - Request: `{ first_name: string, last_name: string, email: string, password: string, password_confirmation: string }`
  - Response: `{ message: string }`

- **POST** `/forgot-password` - Request password reset token
  - Request: `{ email: string }`
  - Response: `{ message: string }`

- **POST** `/reset-password` - Reset password with token
  - Request: `{ token: string, email: string, password: string }`
  - Response: `{ message: string }`

### Catalog & Questionnaire Endpoints

- **GET** `/classes` - List available school classes
  - Response: `{ classes: [{ id: number, name: string }] }`

- **GET** `/difficulties` - List available difficulty levels
  - Response: `{ difficulties: [{ id: number, name: string }] }`

- **GET** `/questions` - Retrieve lesson questions by class and difficulty
  - Query params: `class_id`, `difficulty_id`, `quantity`
  - Response: `{ questions: [{ id, statement, alternative_a, alternative_b, alternative_c, alternative_d, correct_alternative, tip, difficulty_id, class_id }] }`

### Streak Endpoints

- **GET** `/users/{uuid}/streak` - Load user streak summary for Home dashboard
  - Response: `{ user_uuid, current_streak, best_streak, last_lesson_date, lesson_done_today }`

- **GET** `/users/{uuid}/streak/check-today` - Check if current day was already counted
  - Response: `{ user_uuid, date, lesson_done_today, last_lesson_date }`

- **PATCH** `/users/{uuid}/streak/complete-today` - Mark today as completed in streak
  - Request body: none
  - Used only when `lesson_done_today` is `false`

### Session Management

Sessions are stored in `sessionStorage` with automatic expiration after 7 days. The session includes:
- `uuid` - User unique identifier
- `email` - User email address
- `token` - Authentication token for API requests

Session validation occurs on every app initialization and when accessing protected routes.

### Services

Services handle API communication and business logic:

- **apiClient.ts** - Shared API client utilities
  - Centralized JSON requests and standardized error extraction
  - Base URL and API key configuration

- **authService.ts** - Authentication API service
  - `login(payload)` - Authenticate user and return session data
  - `register(payload)` - Create new user account
  - `forgotPassword(payload)` - Request password reset token
  - `resetPassword(payload)` - Reset password with token

- **profileService.ts** - User profile service
  - `getProfile(uuid, token)` - Load profile data
  - `updateProfile(token, payload)` - Persist profile updates

- **catalogService.ts** - Catalog service
  - `getClasses()` - Load classes for Settings and Questionnaire
  - `getShifts()` - Load shifts for Settings
  - `getDifficulties()` - Load difficulties for Questionnaire

- **questionService.ts** - Questionnaire questions service
  - `getQuestions({ class_id, difficulty_id, quantity })` - Load lesson questions
  - Supports correct answer mapping via `correct_alternative`

- **session.ts** - Session management service
  - `saveSession(session)` - Store user session with 7-day expiration
  - `getSession()` - Retrieve valid session or null if expired
  - `isSessionValid()` - Check if user has active session
  - `clearSession()` - Remove session data (logout)
  - `getSessionToken()` - Get authentication token from session
  - Automatic expiration validation and cleanup

- **streakService.ts** - Streak service
  - `getUserStreak(uuid, token)` - Load Home streak card data
  - `checkTodayStreak(uuid, token)` - Check if the current day is already completed
  - `completeTodayStreak(uuid, token)` - Complete current day streak without payload
  - `syncTodayStreakCompletion(uuid, token)` - Idempotent check-then-complete orchestration

## 🎨 Styling

The application uses Tailwind CSS for styling with a custom dark mode implementation. The color scheme includes:

- **Primary**: Blue tones (#D4EAFC, #C2E2FF)
- **Accent**: Emerald for highlights
- **Neutral**: Comprehensive grayscale palette
- **Dark mode**: Full support with neutral-900 backgrounds

## 🔧 Configuration

### TypeScript

The project uses strict TypeScript configuration split into:
- `tsconfig.app.json` - Application code
- `tsconfig.node.json` - Build tooling

### Vite

Minimal Vite configuration with React plugin enabled. See [vite.config.ts](vite.config.ts) for details.

### ESLint

Modern flat config format with React-specific rules. See [eslint.config.js](eslint.config.js) for the complete setup.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- Material Symbols for icons
- React community for excellent tooling
- Vite team for the blazing-fast build tool

---

Built with ❤️ using React, TypeScript, and Vite
