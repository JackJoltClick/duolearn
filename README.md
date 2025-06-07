# JOLTCLICK - React Native Expo App Skeleton (SDK 53)

A complete, production-ready React Native Expo app skeleton designed for rapid business idea prototyping. Built with **Expo SDK 53**, React 19, and React Native 0.79.3. This template includes authentication, user profiles, navigation, and mobile best practices.

## 🚀 Features

### ✅ Complete Authentication System
- **Email/Password Authentication** with Supabase
- **User Registration** with mandatory email verification
- **Email Verification Flow** with resend functionality
- **Deep Link Handling** for email verification callbacks
- **Unverified Account Detection** in login with resend option
- **Password Reset** functionality
- **Secure Session Management** with auto-refresh
- **Auth Guards** for protected routes

### ✅ Navigation & UI
- **4-Tab Bottom Navigation** (Home, Explore, Activity, Profile)
- **Safe Area Support** for all iPhone models including X+
- **Cross-Platform Compatibility** (iOS, Android, Web)
- **Proper Tab Bar Styling** following platform conventions
- **FontAwesome Icons** with focused/unfocused states

### ✅ User Profile System
- **Profile Creation & Editing**
- **Avatar Upload** with image picker
- **Profile Picture Storage** via Supabase Storage
- **Real-time Profile Updates**

### ✅ State Management
- **Zustand** for client-side state management
- **React Query** for server state and caching
- **TypeScript** throughout for type safety

### ✅ Database & Backend
- **Supabase Integration** with PostgreSQL
- **Row Level Security (RLS)** policies
- **User Activity Tracking**
- **Real-time Updates**

### ✅ Mobile Best Practices
- **Haptic Feedback** for interactions
- **Keyboard Avoidance** handling
- **Loading States** and error boundaries
- **Input Validation** with React Hook Form + Yup
- **Responsive Design** for all screen sizes

### ✅ Production Features
- **Error Boundaries** with fallback UI
- **Crash Reporting** ready
- **Environment Variables** management
- **TypeScript Types** for all APIs
- **Security Best Practices**

## 📋 Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)  
- Android Studio/Emulator (for Android development)
- Supabase Account

## 🔥 Tech Stack

- **Expo SDK 53** - Latest Expo framework
- **React 19** - Latest React with improved performance
- **React Native 0.79.3** - Latest RN with new architecture support
- **TypeScript** - Full type safety
- **Supabase** - Backend as a Service
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **React Hook Form + Yup** - Form handling and validation

## 🛠 Setup Instructions

### 1. Clone and Install

```bash
# Clone this skeleton
git clone <your-repo-url>
cd JOLTCLICK

# Install dependencies
npm install
```

### 2. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your Project URL and API Key

2. **Set up Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run the SQL from `supabase-setup.sql`

3. **Configure Storage (Optional)**
   - Go to Storage in Supabase Dashboard
   - Create a bucket named `avatars`
   - Set it to public access

### 3. Environment Variables

1. **Copy Environment Template**
   ```bash
   cp .env.example .env
   ```

2. **Update Environment Variables**
   ```bash
   # .env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_APP_NAME=JOLTCLICK
   EXPO_PUBLIC_APP_VERSION=1.0.0
   ```

### 4. Run the App

```bash
# Start the development server
npm start

# Run on specific platforms
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web Browser
```

## 📱 App Structure

```
JOLTCLICK/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── explore.tsx    # Explore screen
│   │   ├── activity.tsx   # Activity screen
│   │   └── profile.tsx    # Profile screen
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   ├── register.tsx   # Register screen
│   │   └── reset-password.tsx
│   ├── profile/           # Profile management
│   │   └── edit.tsx       # Edit profile screen
│   ├── _layout.tsx        # Root layout with providers
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable components
│   ├── auth/              # Auth-related components
│   │   └── AuthGuard.tsx  # Route protection
│   ├── ui/                # UI components
│   │   ├── Button.tsx     # Custom button
│   │   ├── Input.tsx      # Custom input
│   │   └── Loading.tsx    # Loading components
│   └── ErrorBoundary.tsx  # Error boundary
├── lib/                   # Core library code
│   ├── supabase/          # Supabase configuration
│   ├── stores/            # Zustand stores
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   ├── validations/       # Form validation schemas
│   └── utils/             # Utility functions
├── assets/                # Static assets
└── constants/             # App constants
```

## 📧 Email Verification System

The app includes a complete email verification flow:

### Registration Flow:
1. User registers → Email verification screen appears
2. User receives verification email from Supabase
3. User clicks email link → App opens automatically
4. User is verified and signed in → Welcome screen

### Login Flow:
- Unverified users get helpful error with resend option
- Automatic detection of verification status
- One-click resend verification email

### Deep Link Support:
- Email verification links open the app directly
- Works on iOS, Android, and web
- Secure token validation
- Automatic sign-in after verification

### Setup Required:
1. Enable email confirmation in Supabase dashboard
2. Configure redirect URLs: `joltclick://auth/verify-email`
3. Customize email templates in Supabase
4. See `EMAIL_VERIFICATION_SETUP.md` for detailed instructions

## 🎨 Customization

### Changing App Name
1. Update `app.json` - change `name` and `displayName`
2. Update `EXPO_PUBLIC_APP_NAME` in `.env`
3. Update references in code and README

### Styling
- Colors are defined in `constants/Colors.ts`
- Component styles use inline StyleSheet for better performance
- Follow iOS HIG and Material Design guidelines

### Adding New Features
1. Create new screens in appropriate `app/` subdirectory
2. Add navigation if needed
3. Update types in `lib/types/`
4. Add validation schemas in `lib/validations/`
5. Update database schema if needed

## 🔐 Security Best Practices

### Already Implemented
- ✅ Row Level Security (RLS) in database
- ✅ Secure token storage (SecureStore/localStorage)
- ✅ Input validation and sanitization
- ✅ Auth guards for protected routes
- ✅ HTTPS-only communication

### Additional Recommendations
- Enable Supabase email confirmation in production
- Set up proper CORS policies
- Implement rate limiting for auth endpoints
- Add request logging and monitoring
- Use proper secrets management for environment variables

## 📈 Performance Optimizations

### Already Implemented
- ✅ React Query for efficient data fetching and caching
- ✅ Image optimization with Expo Image
- ✅ Lazy loading where appropriate
- ✅ Optimized bundle size

### Additional Recommendations
- Implement code splitting for larger features
- Add image compression for uploads
- Use React.memo for expensive components
- Implement virtualization for long lists

## 🧪 Testing

```bash
# Run tests (when added)
npm test

# Type checking
npx tsc --noEmit

# Linting
npx eslint .
```

## 🚀 Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for Production**
   ```bash
   eas build --platform all
   ```

4. **Submit to App Stores**
   ```bash
   eas submit --platform all
   ```

### Web Deployment

```bash
# Build for web
npx expo export -p web

# Deploy to static hosting (Netlify, Vercel, etc.)
```

## 🔧 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**iOS Simulator not opening:**
```bash
npx expo run:ios --device
```

**Android build failures:**
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

**Supabase connection issues:**
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure RLS policies are configured

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or need help:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed description
4. Join our community discussions

---

**Built with ❤️ for rapid prototyping and business idea validation.**