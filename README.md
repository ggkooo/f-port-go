# PortGO Authentication & Learning Dashboard

A modern, responsive web app built with React, TypeScript, and Vite. The project now includes both a complete authentication flow (login, registration, and password recovery) and a Home learning dashboard with study modules, streak tracking, and daily challenges.

## 📸 Screenshots

### Home Page
![Home Page](README-images/home-page.png)

### Login Page
![Login Page](README-images/login-page.png)

### Register Page
![Register Page](README-images/register-page.png)

### Forgot Password Page
![Forgot Password Page](README-images/forgot-password-page.png)

## ✨ Features

- 🔐 **Complete Authentication Flow**
  - User login
  - User registration
  - Password recovery

- 🏠 **Learning Dashboard (Home)**
  - Study modules overview
  - Current streak highlight
  - Daily challenges with progress bars and XP badges
  
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

### Components

#### Shared Components

- **EmailInput** - Reusable email input with validation
- **PasswordInput** - Password input with show/hide toggle
- **NameInput** - Name input component
- **DarkModeToggle** - Theme switcher component
- **BrowserHeader** - Mock browser chrome header
- **LeftPanel** - Decorative panel for authentication pages

#### Page Components

Each page follows a modular structure:
- **Container** - Layout wrapper
- **Form** - Form logic and submission
- **LeftPanel** - Custom decorative panel for the page

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
