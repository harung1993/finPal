# DollarDollar Mobile App Setup

## Overview

The DollarDollar mobile app is built with React Native and Expo, featuring biometric authentication for secure and convenient access.

## Features Implemented

### 1. Biometric Authentication ✅
- **Face ID / Touch ID Support**: Automatically detects available biometric hardware
- **Secure Credential Storage**: Uses Expo SecureStore for encrypted credential storage
- **Login Integration**: Option to enable biometric login during regular login
- **Settings Toggle**: Enable/disable biometric authentication from Settings screen
- **Auto-login**: Automatically prompts for biometric authentication on app launch if enabled

### 2. Core Screens
- **Dashboard**: Overview of finances with net worth, accounts, budgets, and recent transactions
- **Budgets**: Budget tracking with progress bars and period selection
- **Transactions**: Transaction management and history
- **Accounts**: Account management
- **Settings**: User preferences and biometric authentication settings

### 3. Navigation
- Bottom tab navigation with 4 main tabs:
  - Home (Dashboard)
  - Transactions
  - Budgets
  - Settings

## Biometric Authentication Flow

### First Time Setup
1. User logs in with email/password
2. If biometric hardware is available, option to enable appears
3. Check "Enable [Face ID/Touch ID] for future logins"
4. Complete login - credentials are securely stored
5. Next app launch will prompt for biometric authentication

### Subsequent Logins
1. App launches
2. Biometric prompt appears automatically
3. Successful authentication logs user in with stored credentials
4. User can still login manually if biometric fails

### Managing Biometric Settings
1. Navigate to Settings screen
2. Find "Biometric Login" under Security section
3. Toggle switch to enable/disable
4. If disabling, confirmation prompt appears
5. Stored credentials are removed when disabled

## Installation & Setup

### Prerequisites
```bash
# Ensure you have Node.js and npm installed
node --version
npm --version

# Install Expo CLI globally
npm install -g expo-cli
```

### Install Dependencies
```bash
cd dollardollar-mobile
npm install
```

### Run the App

#### iOS Simulator (Mac only)
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Expo Go (Physical Device)
```bash
npm start
# Scan QR code with Expo Go app
```

## Testing Biometric Authentication

### iOS Simulator
1. Start the iOS simulator
2. Enable Face ID: Hardware > Face ID > Enrolled
3. Trigger Face ID: Hardware > Face ID > Matching Face

### Android Emulator
1. Start Android emulator
2. Settings > Security > Fingerprint
3. Add a fingerprint using the emulator's extended controls
4. Use the emulator's fingerprint sensor simulation

### Physical Device
- Face ID: Requires iPhone X or newer with Face ID hardware
- Touch ID: Requires device with Touch ID sensor
- Android: Requires device with fingerprint sensor

## File Structure

```
dollardollar-mobile/
├── app/                          # Expo Router screens
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx           # Login with biometric support
│   │   └── register.tsx        # Registration screen
│   └── (tabs)/                 # Main app tabs
│       ├── dashboard.tsx       # Dashboard screen
│       ├── budgets.tsx         # Budget tracking
│       ├── transactions.tsx    # Transactions list
│       ├── settings.tsx        # Settings with biometric toggle
│       └── _layout.tsx         # Tab navigation config
├── src/
│   ├── components/             # Reusable UI components
│   ├── hooks/
│   │   ├── useAuth.ts         # Authentication hooks
│   │   └── useBiometric.ts    # Biometric authentication hook ✨
│   ├── services/              # API services
│   ├── store/                 # Zustand state management
│   │   └── authStore.ts       # Auth state with tokens
│   └── theme/                 # Design system (colors, typography, spacing)
├── mockups/                   # Design mockups
│   ├── mobile-dashboard.tsx
│   ├── mobile-budget.tsx
│   ├── mobile-add-transaction.tsx
│   └── mobile-settings.tsx
└── package.json
```

## Key Components

### useBiometric Hook
Location: `src/hooks/useBiometric.ts`

```typescript
const {
  isBiometricSupported,     // Boolean: Device has biometric hardware
  isBiometricEnabled,       // Boolean: User has enabled biometric login
  biometricType,            // String: "Face ID", "Touch ID", or "Biometric"
  authenticate,             // Function: Trigger biometric prompt
  enableBiometric,          // Function: Enable and save credentials
  disableBiometric,         // Function: Disable and clear credentials
  authenticateWithBiometric // Function: Authenticate and retrieve credentials
} = useBiometric();
```

### Login Screen Features
Location: `app/(auth)/login.tsx`

- Email/password input fields
- Checkbox to enable biometric on successful login
- Biometric login button (shown if already enabled)
- Auto-authentication on mount if biometric is enabled
- Error handling and user feedback

### Settings Screen Features
Location: `app/(tabs)/settings.tsx`

- Biometric toggle switch (only shown if device supports it)
- Shows biometric type (Face ID/Touch ID)
- Confirmation dialogs for enable/disable
- Integrated with other security settings

## Environment Configuration

The app connects to the backend API. Update the API URL in your environment:

```typescript
// src/services/api.ts or similar
const API_URL = 'http://localhost:5000/api/v1'; // Update as needed
```

## Security Considerations

1. **Credential Storage**: Uses Expo SecureStore with hardware-backed encryption
2. **Biometric Fallback**: Users can always login with password if biometric fails
3. **Credential Clearing**: Logging out or disabling biometric removes stored credentials
4. **Token Management**: JWT tokens are managed separately from biometric credentials
5. **No Password Transmission**: Biometric only retrieves stored credentials, no new auth flow

## Troubleshooting

### Biometric Not Working
- Ensure device has biometric hardware enrolled
- Check app permissions for biometric access
- Verify SecureStore is properly configured

### Login Issues
- Check network connection to backend
- Verify API URL is correct
- Check backend server is running
- Review console logs for detailed errors

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
expo start -c
```

## Next Steps

### Recommended Enhancements
1. **Enhanced UI**: Match mockup designs more closely
2. **Offline Support**: Cache data for offline viewing
3. **Push Notifications**: Budget alerts and transaction notifications
4. **Data Sync**: Real-time sync with backend
5. **Charts & Analytics**: Visual spending insights
6. **Dark Mode**: Full dark theme implementation
7. **Localization**: Multi-language support

### Testing Checklist
- [ ] Login with email/password
- [ ] Enable biometric from login screen
- [ ] Verify biometric auto-login on next launch
- [ ] Test biometric failure scenarios
- [ ] Disable biometric from Settings
- [ ] Verify credentials cleared after disable
- [ ] Test on multiple devices
- [ ] Test with Face ID and Touch ID
- [ ] Verify secure credential storage

## Resources

- [Expo Local Authentication Docs](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
- [Expo SecureStore Docs](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Expo documentation
3. Check console logs for error messages
4. Verify backend API is accessible

---

**Built with ❤️ using Expo and React Native**
