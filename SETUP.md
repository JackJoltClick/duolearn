# JOLTCLICK Setup Guide

This guide will walk you through setting up JOLTCLICK from scratch to a fully working app.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Expo CLI** installed (`npm install -g @expo/cli`)
- [ ] **Supabase Account** ([Sign up](https://supabase.com))
- [ ] **Development Environment**:
  - [ ] **iOS**: Xcode (Mac only) or iOS Simulator
  - [ ] **Android**: Android Studio with emulator
  - [ ] **Web**: Modern browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start (5 minutes)

### Step 1: Get the Code
```bash
# Clone or download this skeleton
cd your-project-directory
npm install
```

### Step 2: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: Your app name (e.g., "MyApp")
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to initialize (1-2 minutes)

### Step 3: Configure Database
1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the SQL
6. Verify tables were created in **Table Editor**

### Step 4: Get API Keys
1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your keys:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 5: Start the App
```bash
npm start
```

Choose your platform:
- **i** for iOS Simulator
- **a** for Android Emulator  
- **w** for Web Browser

## 📱 Platform-Specific Setup

### iOS Setup (Mac Required)

1. **Install Xcode** from the Mac App Store
2. **Install iOS Simulator** (included with Xcode)
3. **Accept Xcode License**:
   ```bash
   sudo xcodebuild -license accept
   ```
4. **Run iOS**:
   ```bash
   npm run ios
   ```

### Android Setup

1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)
2. **Set up Android SDK**:
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install Android SDK Platform 33+
   - Install Android SDK Build-Tools
3. **Create Virtual Device**:
   - Open AVD Manager in Android Studio
   - Create a new virtual device (recommended: Pixel 6)
4. **Set Environment Variables** (add to your shell profile):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
5. **Run Android**:
   ```bash
   npm run android
   ```

### Web Setup

Web requires no additional setup - just run:
```bash
npm run web
```

## 🔧 Advanced Configuration

### Enable Profile Pictures

1. **Create Storage Bucket** in Supabase:
   - Go to **Storage** in Supabase Dashboard
   - Click "New bucket"
   - Name: `avatars`
   - Set to **Public bucket**
   - Click "Create bucket"

2. **Set Storage Policies**:
   ```sql
   -- Allow authenticated users to upload avatars
   CREATE POLICY "Avatar uploads are allowed for authenticated users" ON storage.objects
   FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'avatars');

   -- Allow users to update their own avatars
   CREATE POLICY "Users can update their own avatars" ON storage.objects
   FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

   -- Allow public access to view avatars
   CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
   FOR SELECT USING (bucket_id = 'avatars');
   ```

### Email Configuration

1. **Configure SMTP** (Optional but recommended for production):
   - Go to **Settings** → **Auth** in Supabase
   - Enable "Enable email confirmations"
   - Add your SMTP settings

2. **Customize Email Templates**:
   - Go to **Auth** → **Templates**
   - Customize confirmation and reset emails

### Push Notifications (Optional)

1. **Install Expo Notifications**:
   ```bash
   npx expo install expo-notifications
   ```

2. **Configure in app.json**:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "expo-notifications",
           {
             "icon": "./assets/notification-icon.png",
             "color": "#ffffff"
           }
         ]
       ]
     }
   }
   ```

## 🛠 Development Workflow

### Adding New Screens

1. **Create screen file** in appropriate directory:
   ```bash
   # Example: Add settings screen
   touch app/settings.tsx
   ```

2. **Add navigation** (if needed):
   ```typescript
   // In your layout file
   <Stack.Screen name="settings" options={{ title: "Settings" }} />
   ```

3. **Update types** if needed in `lib/types/`

### Database Changes

1. **Always backup first**:
   ```bash
   # In Supabase Dashboard: Settings → Database → Backups
   ```

2. **Run migrations** in SQL Editor:
   ```sql
   -- Example: Add new column
   ALTER TABLE profiles ADD COLUMN new_field TEXT;
   ```

3. **Update TypeScript types** in `lib/supabase/database.types.ts`

### Adding Dependencies

```bash
# For Expo-compatible packages
npx expo install package-name

# For regular npm packages
npm install package-name
```

## 🔍 Debugging

### Common Issues

**"Metro bundler failed to start"**
```bash
npx expo start --clear
rm -rf node_modules
npm install
```

**"Module not found"**
```bash
npx expo start --clear
```

**Supabase connection fails**
1. Check `.env` file exists and has correct values
2. Verify Supabase project is running
3. Check network connection

**TypeScript errors**
```bash
npx tsc --noEmit
```

### Debug Tools

1. **React Native Debugger** (recommended):
   ```bash
   brew install --cask react-native-debugger
   ```

2. **Expo Dev Tools**:
   - Press `m` in terminal to open
   - Or go to `http://localhost:19002`

3. **Flipper** (advanced):
   - Download from [fbflipper.com](https://fbflipper.com)
   - Great for debugging React Native apps

## 📦 Building for Production

### EAS Build (Recommended)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login and configure**:
   ```bash
   eas login
   eas build:configure
   ```

3. **Build**:
   ```bash
   # Build for all platforms
   eas build --platform all

   # Build for specific platform
   eas build --platform ios
   eas build --platform android
   ```

### Local Builds

**iOS** (Mac only):
```bash
npx expo run:ios --configuration Release
```

**Android**:
```bash
npx expo run:android --variant release
```

## 🌐 Deployment

### App Stores

1. **iOS App Store**:
   ```bash
   eas submit --platform ios
   ```

2. **Google Play Store**:
   ```bash
   eas submit --platform android
   ```

### Web Deployment

1. **Build for web**:
   ```bash
   npx expo export:web
   ```

2. **Deploy to hosting**:
   - **Vercel**: `vercel --prod`
   - **Netlify**: `netlify deploy --prod --dir web-build`
   - **Firebase**: `firebase deploy`

## 🔐 Security Checklist

Before going to production:

- [ ] **Environment Variables**: All secrets in environment variables
- [ ] **RLS Policies**: Row Level Security enabled and tested
- [ ] **HTTPS Only**: Force HTTPS in production
- [ ] **Input Validation**: All user inputs validated
- [ ] **Rate Limiting**: Implement rate limiting for auth endpoints
- [ ] **Error Handling**: Proper error boundaries and logging
- [ ] **Dependencies**: All dependencies up to date and secure

## 📊 Monitoring

Set up monitoring for production:

1. **Sentry** for error tracking:
   ```bash
   npx expo install @sentry/react-native
   ```

2. **Analytics** (choose one):
   - Google Analytics
   - Mixpanel
   - Amplitude

3. **Performance Monitoring**:
   - React Native Performance
   - Flipper Performance

## 🆘 Getting Help

If you're stuck:

1. **Check the logs** in your terminal or Expo Dev Tools
2. **Search issues** in this repository
3. **Check Expo Forums** for platform-specific issues
4. **Supabase Community** for database-related questions
5. **Create an issue** with:
   - Your environment details
   - Steps to reproduce
   - Error messages and logs

---

**You're all set! 🎉 Start building your amazing app with JOLTCLICK!**