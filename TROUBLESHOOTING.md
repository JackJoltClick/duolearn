# Troubleshooting Guide

## Common Issues and Solutions

### 1. Color-Convert Module Resolution Error

**Error**: `Unable to resolve "./route" from "node_modules/color-convert/index.js"`

This is a known issue with Expo SDK 53 and certain dependency combinations.

**Solution**: The project includes a custom `metro.config.js` that resolves this issue. If you encounter this error:

1. Ensure the `metro.config.js` file exists in your project root
2. Clear Metro cache: `npx expo start --clear`
3. If the issue persists, try:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   watchman watch-del-all
   npx expo start --clear
   ```

### 2. Watchman Recrawl Warnings

**Error**: `Recrawled this watch 7 times, most recently because: MustScanSubDirs UserDropped`

**Solution**:
```bash
watchman watch-del-all
# Or for this specific project:
watchman watch-del '/path/to/your/project'
watchman watch-project '/path/to/your/project'
```

### 3. TypeScript Compilation Errors

If you encounter TypeScript errors after SDK upgrade:

1. Check that all types are properly imported
2. Run `npx tsc --noEmit` to check for type errors
3. Some form resolvers may need `as any` type assertions for compatibility

### 4. Supabase Connection Issues

**Error**: Cannot connect to Supabase

**Solutions**:
1. Verify your `.env` file has the correct values
2. Check that your Supabase project is active
3. Ensure RLS policies are properly configured
4. Test the connection in Supabase dashboard

### 5. Bundle Size Warnings

The app includes many dependencies which may cause large bundle warnings.

**Solutions**:
- Use `npx expo install --fix` to ensure compatible versions
- Consider code splitting for production apps
- Remove unused dependencies

### 6. iOS/Android Build Issues

**Common solutions**:
- Clean build cache: `expo run:ios --clear` or `expo run:android --clear`
- Ensure Xcode is up to date (for iOS)
- Check Android SDK versions match requirements
- Verify app.json configuration

### 7. Navigation Type Errors

**Error**: Router path type errors

**Solution**: Some navigation paths may need type assertions:
```typescript
router.replace(path as any);
```

### 8. Development Server Port Conflicts

**Error**: Port already in use

**Solutions**:
- Use a different port: `npx expo start --port 8082`
- Kill existing processes: `pkill -f expo`
- Check what's using the port: `lsof -i :8081`

## Getting Help

If you encounter issues not covered here:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Search [Expo forums](https://forums.expo.dev/)
3. Check [GitHub issues](https://github.com/expo/expo/issues)
4. Ensure you're using the latest Expo CLI: `npm install -g @expo/cli@latest`

## SDK 53 Specific Notes

- This project uses Expo SDK 53 with React 19 and React Native 0.79.3
- Some dependencies may have breaking changes from previous SDK versions
- The new architecture is supported but not required
- Web bundling includes static rendering by default

## Performance Tips

1. Use `npx expo start --no-dev` for production-like testing
2. Enable Hermes for better performance (enabled by default)
3. Use React DevTools for debugging
4. Monitor bundle size with `npx expo export --platform web`