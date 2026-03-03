# PortGO Authentication, Dashboard, Store, Ranking, Calendar, Questionnaire & Settings

A modern, responsive web app built with React, TypeScript, and Vite. The project includes a complete authentication flow (login, registration, and password recovery), a Home learning dashboard with study modules and daily challenges, a Store page for XP boosts and streak protection items, a Ranking page with a professional leaderboard experience, a Calendar page for monthly study planning, a full Questionnaire flow (grade selection, difficulty selection, quiz and review rounds), and a Settings page for profile and academic information management.

## 📸 Screenshots

### Home Page
![Home Page](README-images/home-page.png)

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

- 🔐 **Complete Authentication Flow**
  - User login
  - User registration
  - Password recovery

- 🏠 **Learning Dashboard (Home)**
  - Study modules overview
  - Current streak highlight
  - Daily challenges with progress bars and XP badges

- 🛍️ **Store Page**
  - XP potion cards (1.5x, 2x, 2.5x, and 3x)
  - Streak Freeze (Gelinho da Ofensiva) item to protect the streak for one missed day
  - Purchase-focused layout with item highlights, price tags, and quick info panel

- 🏆 **Ranking Page**
  - Professional Top 15 leaderboard table
  - Highlighted row for the logged-in user with current position
  - Ranking summary panel with weekly awards and progression tips

- 📅 **Calendar Page**
  - Monthly grid calendar view
  - Event-day indicators for quick visualization
  - Compact monthly event list with date and time

- ⚙️ **Settings Page**
  - User profile form with personal and academic fields
  - Locked name and surname fields
  - Shift selector (morning, afternoon, full-time)
  - State and city selectors integrated with IBGE API
  - City selector enabled only after selecting a valid state

- 🧠 **Questionnaire Flow**
  - Activity-based entry from Home modules (Grammar and Reading)
  - Grade selection with recommended badge
  - Difficulty selection (easy, medium, hard)
  - Lesson XP reward by selected difficulty
  - 10 questions per lesson
  - Immediate feedback for correct/incorrect answers
  - Mandatory review rounds for wrong answers until all are correct
  - Help tools available once per lesson:
    - DICA
    - REMOVER 2 ALTERNATIVAS
    - PULAR QUESTÃO
  - Consecutive correct-answer streak tracking
  
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
│   ├── App.tsx                      # Main app component with routing
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles
│   ├── components/                  # Shared components
│   │   ├── BrowserHeader.tsx
│   │   ├── DarkModeToggle.tsx
│   │   ├── EmailInput.tsx
│   │   ├── NameInput.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── LeftPanel.tsx
│   │   └── index.ts
│   └── pages/                       # Page components
│       ├── Login/
│       │   ├── index.tsx
│       │   └── components/
│       │       ├── LoginContainer.tsx
│       │       ├── LoginForm.tsx
│       │       └── LoginLeftPanel.tsx
│       ├── Register/
│       │   ├── index.tsx
│       │   └── components/
│       │       ├── RegisterContainer.tsx
│       │       ├── RegisterForm.tsx
│       │       └── RegisterLeftPanel.tsx
│       └── ForgotPassword/
│           ├── index.tsx
│           └── components/
│               ├── ForgotPasswordContainer.tsx
│               ├── ForgotPasswordForm.tsx
│               └── ForgotPasswordLeftPanel.tsx
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

- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery page
- `/` - Home dashboard page
- `/store` - Store page
- `/ranking` - Ranking page
- `/calendar` - Calendar page
- `/questionnaire` - Questionnaire page
- `/settings` - Settings page

### Components

#### Shared Components

- **EmailInput** - Reusable email input with validation
- **PasswordInput** - Password input with show/hide toggle
- **NameInput** - Name input component
- **DarkModeToggle** - Theme switcher component
- **BrowserHeader** - Mock browser chrome header
- **LeftPanel** - Decorative panel for authentication pages

#### Page Components

Pages follow modular structures depending on the section:
- **Authentication pages** (`/login`, `/register`, `/forgot-password`)
  - **Container** - Layout wrapper
  - **Form** - Form logic and submission
  - **LeftPanel** - Decorative panel for auth branding
- **App pages** (`/`, `/store`, `/ranking`, `/calendar`, `/questionnaire`, `/settings`)
  - **Container** - Browser-frame wrapper
  - **LeftSidebar** - Navigation and profile actions
  - **MainContent** - Core page content
  - **RightPanel** - Contextual summary cards and quick info

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
