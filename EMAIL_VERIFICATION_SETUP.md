# Email Verification Setup Guide

This guide will walk you through setting up email verification for the JOLTCLICK app using Supabase.

## 1. Supabase Email Configuration

### Enable Email Confirmation

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll down to **Email Auth**
4. Enable **"Enable email confirmations"**
5. Set **"Confirm email"** to **Required**

### Configure Redirect URLs

Add these redirect URLs in your Supabase Auth settings:

**For Development:**
```
# Mobile app schemes
joltclick://auth/verify-email
joltclick://auth/verification-success

# Web development
http://localhost:8081/auth/verify-email
http://localhost:8081/auth/verification-success
```

**For Production:**
```
# Your production domain
https://yourdomain.com/auth/verify-email
https://yourdomain.com/auth/verification-success

# Mobile app schemes
joltclick://auth/verify-email
joltclick://auth/verification-success
```

### Email Templates

Navigate to **Authentication** → **Email Templates** and customize:

**Confirm signup template:**
```html
<h2>Welcome to JOLTCLICK!</h2>
<p>Please confirm your email address by clicking the button below:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
<p>If the button doesn't work, copy and paste this link:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Thanks,<br>The JOLTCLICK Team</p>
```

## 2. Environment Variables

Ensure your `.env` file includes:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. App Configuration

The app is already configured with the following features:

### URL Scheme
- **Scheme**: `joltclick://`
- **Configured in**: `app.json`

### Deep Link Handling
- **File**: `app/_layout.tsx`
- **Handles**: Email verification links automatically
- **Routes**: `/auth/verify-email` with token parameters

## 4. Email Verification Flow

### User Journey:
1. **Registration**: User fills out registration form
2. **Email Sent**: Supabase sends verification email
3. **Verification Screen**: User sees "Check your email" screen
4. **Email Click**: User clicks verification link in email
5. **Deep Link**: App opens verification handler
6. **Success**: User is automatically signed in

### Technical Flow:
1. `RegisterScreen` → calls `register()` → redirects to `EmailVerificationScreen`
2. `EmailVerificationScreen` → shows instructions and resend option
3. Email link → opens `verify-email` route → calls `handleEmailVerificationCallback()`
4. Success → redirects to `verification-success` → then to main app

## 5. Testing Email Verification

### Test in Development:

1. **Start the app**:
   ```bash
   npx expo start
   ```

2. **Register a new account** with a real email address
3. **Check your email** for the verification link
4. **Click the link** - it should open the app and verify automatically

### Test Deep Links:

**iOS Simulator**:
```bash
xcrun simctl openurl booted "joltclick://auth/verify-email?token=test&type=signup"
```

**Android Emulator**:
```bash
adb shell am start -W -a android.intent.action.VIEW -d "joltclick://auth/verify-email?token=test&type=signup"
```

## 6. Production Deployment

### Mobile App Stores:

1. **Update app.json** with production bundle identifiers
2. **Configure URL schemes** in store listings
3. **Test deep links** on physical devices
4. **Update Supabase redirect URLs** to production domains

### Web Deployment:

1. **Update redirect URLs** in Supabase to production domain
2. **Configure HTTPS** for security
3. **Test email verification** on production

## 7. Troubleshooting

### Common Issues:

**Email not received:**
- Check spam folder
- Verify email is correct
- Check Supabase email quota
- Ensure SMTP is configured

**Deep links not working:**
- Verify URL scheme in app.json
- Check Supabase redirect URLs
- Test with manual deep link commands
- Ensure app is properly installed

**Verification fails:**
- Check token expiry (default 1 hour)
- Verify Supabase configuration
- Check network connectivity
- Look at Supabase logs

**Session not persisting:**
- Check Supabase auth settings
- Verify token storage (SecureStore)
- Ensure RLS policies are correct

### Debug Steps:

1. **Check Supabase logs** in dashboard
2. **Enable debug mode** in development
3. **Test with curl** for API verification
4. **Check device logs** for errors

## 8. Security Considerations

### Best Practices:

- ✅ **HTTPS only** in production
- ✅ **Token expiry** set appropriately (1 hour)
- ✅ **Rate limiting** on resend requests
- ✅ **Secure storage** for auth tokens
- ✅ **URL validation** for deep links

### Additional Security:

- **Email rate limiting**: Prevent spam
- **Token validation**: Verify token format
- **Session management**: Proper logout handling
- **Error handling**: Don't leak sensitive info

## 9. Customization Options

### Email Styling:
- Customize email templates in Supabase
- Add company branding
- Include social links
- Add custom CSS

### Verification Flow:
- Custom verification screens
- Additional user onboarding
- Welcome bonuses
- Profile completion prompts

### Deep Link Handling:
- Custom URL schemes
- Universal links (iOS)
- App links (Android)
- Fallback web pages

This email verification system provides a production-ready, secure, and user-friendly experience for account verification in your JOLTCLICK app.