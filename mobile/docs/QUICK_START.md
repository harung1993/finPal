# DollarDollar Mobile - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd dollardollar-mobile
npm install
```

### Step 2: Start the App
```bash
npm start
```

This will open the Expo development tools. You can then:
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Step 3: Test Biometric Authentication

#### On iOS Simulator
1. Run `npm run ios`
2. Go to Hardware > Face ID > Enrolled
3. Login with test credentials
4. Enable Face ID when prompted
5. Restart app
6. Use Hardware > Face ID > Matching Face to authenticate

#### On Android Emulator
1. Run `npm run android`
2. Open Settings > Security > Fingerprint
3. Add a test fingerprint
4. Login and enable fingerprint authentication
5. Restart and test fingerprint login

#### On Physical Device
1. Install Expo Go from App Store/Play Store
2. Scan QR code from `npm start`
3. Login with your credentials
4. Enable biometric authentication
5. Kill and restart app to test biometric login

## 🔐 Biometric Features

### What's Been Implemented

✅ **Secure Biometric Storage** - Credentials stored in hardware-backed secure storage
✅ **Auto-Login** - Automatic biometric prompt on app launch
✅ **Enable During Login** - Checkbox to enable biometric on first login
✅ **Settings Toggle** - Enable/disable from Settings screen
✅ **Graceful Fallback** - Regular login always available
✅ **Device Detection** - Automatically detects Face ID vs Touch ID

### How to Enable Biometric Login

**Method 1: During Login**
1. Enter your email and password
2. Check "Enable [Face ID/Touch ID] for future logins"
3. Click "Sign In"
4. Authenticate with biometrics when prompted
5. Done! Next time you'll auto-login with biometrics

**Method 2: From Settings (if already logged in)**
1. Go to Settings tab
2. Navigate to Security section
3. Toggle "Biometric Login" switch
4. Note: This will prompt you to re-login to save credentials

### How to Disable Biometric Login

1. Go to Settings tab
2. Navigate to Security section
3. Toggle "Biometric Login" switch off
4. Confirm in the alert dialog
5. Your stored credentials will be securely removed

## 📱 App Structure

### Main Screens
- **Dashboard** - Net worth, accounts overview, recent transactions
- **Transactions** - View and manage all transactions
- **Budgets** - Track spending against budgets
- **Settings** - App preferences and biometric settings

### Navigation
Bottom tab bar with 4 main sections:
- 🏠 Home (Dashboard)
- 💳 Transactions
- 📊 Budgets
- ⚙️ Settings

## 🔧 Common Issues & Solutions

### "Biometric authentication not available"
- **Cause**: Device doesn't have biometric hardware or it's not enrolled
- **Solution**: Set up Face ID/Touch ID in device Settings

### "Network request failed"
- **Cause**: Can't connect to backend API
- **Solution**:
  - Ensure backend server is running
  - Check API URL in code matches your backend
  - Use your computer's local IP (not localhost) for physical devices

### App won't start
```bash
# Clear Expo cache
expo start -c

# Or reinstall dependencies
rm -rf node_modules
npm install
expo start
```

### Biometric prompt doesn't appear
- Make sure you've enabled biometric during login
- Check that biometric is enabled in Settings
- Verify device has biometric enrolled in system settings

## 🧪 Testing Flow

1. ✅ Fresh install and registration
2. ✅ Login with email/password
3. ✅ Enable biometric during login
4. ✅ Close and reopen app
5. ✅ Verify auto-biometric prompt appears
6. ✅ Successful biometric authentication logs you in
7. ✅ Navigate to Settings
8. ✅ Verify biometric toggle is ON
9. ✅ Toggle biometric OFF
10. ✅ Close and reopen app
11. ✅ Verify manual login required

## 📚 Key Files

```
app/(auth)/login.tsx          # Login screen with biometric option
app/(tabs)/settings.tsx       # Settings with biometric toggle
src/hooks/useBiometric.ts     # Biometric authentication hook
src/store/authStore.ts        # Authentication state management
```

## 🎨 Design System

The app uses a consistent design system:
- **Colors**: Defined in `src/theme/colors.ts`
- **Typography**: Defined in `src/theme/typography.ts`
- **Spacing**: Defined in `src/theme/spacing.ts`
- **Components**: Reusable UI in `src/components/`

## 💡 Development Tips

### Hot Reload
Expo supports hot reload - just save your files and see changes instantly!

### Debugging
- Shake device (or Cmd+D on iOS simulator) to open dev menu
- Enable "Debug Remote JS" to use Chrome DevTools
- Use `console.log()` statements - they appear in the terminal

### Theme Customization
Edit `src/theme/colors.ts` to change the app's color scheme.

## 📖 Next Steps

- Read [MOBILE_APP_SETUP.md](./MOBILE_APP_SETUP.md) for detailed documentation
- Check the [mockups/](./mockups/) folder for design references
- Explore the codebase starting from `app/(tabs)/dashboard.tsx`

## 🆘 Need Help?

1. Check [MOBILE_APP_SETUP.md](./MOBILE_APP_SETUP.md) for detailed docs
2. Review Expo documentation: https://docs.expo.dev
3. Check the console for error messages
4. Ensure backend API is running and accessible

---

**Happy coding! 🎉**
