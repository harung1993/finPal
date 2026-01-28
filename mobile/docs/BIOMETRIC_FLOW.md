# Biometric Authentication Flow

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APP LAUNCH                                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ Check Authentication    │
                    │ Status                  │
                    └─────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
        ┌──────────────────────┐    ┌──────────────────────┐
        │ User NOT Logged In   │    │ User Logged In       │
        └──────────────────────┘    └──────────────────────┘
                    │                           │
                    ▼                           ▼
        ┌──────────────────────┐    ┌──────────────────────┐
        │ Show Login Screen    │    │ Go to Dashboard      │
        └──────────────────────┘    └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ Check if Biometric   │
        │ is Enabled           │
        └──────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌──────────────┐        ┌──────────────────┐
│ Biometric    │        │ Biometric NOT    │
│ ENABLED      │        │ Enabled          │
└──────────────┘        └──────────────────┘
        │                        │
        ▼                        ▼
┌──────────────────────┐  ┌──────────────────────┐
│ Auto-show Biometric  │  │ Show Email/Password  │
│ Prompt               │  │ Fields               │
└──────────────────────┘  └──────────────────────┘
        │                        │
        ▼                        ▼
┌──────────────────────┐  ┌──────────────────────┐
│ User Authenticates   │  │ User Enters          │
│ with Face/Touch ID   │  │ Credentials          │
└──────────────────────┘  └──────────────────────┘
        │                        │
        │                        ▼
        │              ┌──────────────────────┐
        │              │ Checkbox: Enable     │
        │              │ Biometric?           │
        │              └──────────────────────┘
        │                        │
        │              ┌─────────┴──────────┐
        │              │                    │
        │              ▼                    ▼
        │      ┌─────────────┐      ┌─────────────┐
        │      │ Checked     │      │ Not Checked │
        │      └─────────────┘      └─────────────┘
        │              │                    │
        │              ▼                    │
        │      ┌─────────────────┐          │
        │      │ Login Successful│          │
        │      │ + Show Biometric│          │
        │      │ Prompt          │          │
        │      └─────────────────┘          │
        │              │                    │
        │              ▼                    │
        │      ┌─────────────────┐          │
        │      │ User Authenticates         │
        │      │ with Biometrics │          │
        │      └─────────────────┘          │
        │              │                    │
        │              ▼                    │
        │      ┌─────────────────┐          │
        │      │ Save Credentials│          │
        │      │ to SecureStore  │          │
        │      └─────────────────┘          │
        │              │                    │
        │              │                    │
        └──────────────┴────────────────────┘
                       │
                       ▼
           ┌──────────────────────┐
           │ Login API Call       │
           │ with Credentials     │
           └──────────────────────┘
                       │
                       ▼
           ┌──────────────────────┐
           │ Receive JWT Tokens   │
           │ Store in AuthStore   │
           └──────────────────────┘
                       │
                       ▼
           ┌──────────────────────┐
           │ Navigate to          │
           │ Dashboard            │
           └──────────────────────┘
```

## Key Components

### 1. useBiometric Hook
Located: `src/hooks/useBiometric.ts`

```typescript
const {
  // State
  isBiometricSupported,  // boolean: Device has hardware
  isBiometricEnabled,    // boolean: User enabled it
  biometricType,         // string: "Face ID" | "Touch ID" | "Biometric"

  // Actions
  authenticate,          // () => Promise<boolean>
  enableBiometric,       // (credentials) => Promise<boolean>
  disableBiometric,      // () => Promise<void>
  authenticateWithBiometric  // () => Promise<credentials | null>
} = useBiometric();
```

### 2. Login Screen Flow
Located: `app/(auth)/login.tsx`

```typescript
// On component mount
useEffect(() => {
  if (isBiometricEnabled) {
    handleBiometricLogin(); // Auto-trigger biometric
  }
}, [isBiometricEnabled]);

// Biometric login handler
const handleBiometricLogin = async () => {
  const credentials = await authenticateWithBiometric();
  if (credentials) {
    login(credentials); // Call API with stored credentials
  }
};

// Regular login handler
const handleLogin = async () => {
  if (saveBiometric && isBiometricSupported) {
    await enableBiometric({ email, password }); // Save for future
  }
  login({ email, password }); // Call API
};
```

### 3. Settings Screen Management
Located: `app/(tabs)/settings.tsx`

```typescript
const handleToggleBiometric = async () => {
  if (isBiometricEnabled) {
    // Disable flow
    await disableBiometric();
    // Credentials removed from SecureStore
  } else {
    // Enable flow
    // Redirect to login to capture credentials
  }
};
```

## Data Flow

### Enabling Biometric

```
User Enters Credentials
        │
        ▼
User Checks "Enable Biometric"
        │
        ▼
User Submits Login
        │
        ▼
App Triggers Biometric Prompt
        │
        ▼
User Authenticates (Face/Touch ID)
        │
        ▼
┌────────────────────────────────────┐
│ SecureStore.setItemAsync(          │
│   'biometric_credentials',         │
│   JSON.stringify({                 │
│     email: 'user@example.com',     │
│     password: 'encrypted'          │
│   })                               │
│ )                                  │
└────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│ SecureStore.setItemAsync(          │
│   'biometric_enabled',             │
│   'true'                           │
│ )                                  │
└────────────────────────────────────┘
        │
        ▼
Login API Call Proceeds
```

### Using Biometric Login

```
App Launches
        │
        ▼
Check if Biometric Enabled
        │
        ▼
┌────────────────────────────────────┐
│ enabled = SecureStore.getItemAsync(│
│   'biometric_enabled'              │
│ )                                  │
└────────────────────────────────────┘
        │
        ▼
If enabled === 'true'
        │
        ▼
Show Biometric Prompt
        │
        ▼
User Authenticates
        │
        ▼
┌────────────────────────────────────┐
│ credentials = SecureStore.getItem( │
│   'biometric_credentials'          │
│ )                                  │
└────────────────────────────────────┘
        │
        ▼
Parse Credentials
        │
        ▼
Call Login API
        │
        ▼
Navigate to Dashboard
```

### Disabling Biometric

```
User Toggles Switch in Settings
        │
        ▼
Confirmation Dialog
        │
        ▼
User Confirms
        │
        ▼
┌────────────────────────────────────┐
│ SecureStore.deleteItemAsync(       │
│   'biometric_credentials'          │
│ )                                  │
└────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│ SecureStore.deleteItemAsync(       │
│   'biometric_enabled'              │
│ )                                  │
└────────────────────────────────────┘
        │
        ▼
Show Success Message
        │
        ▼
Next Login Requires Manual Entry
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│ Layer 4: Backend JWT Authentication                 │
│ - All API calls require valid JWT token            │
│ - Token stored in AuthStore (separate from bio)    │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│ Layer 3: Biometric Authentication                   │
│ - Face ID / Touch ID / Fingerprint                 │
│ - Device-level security (can't be spoofed)         │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│ Layer 2: Encrypted Storage (SecureStore)           │
│ - Hardware-backed encryption                       │
│ - Not accessible by other apps                     │
│ - Removed on app uninstall                         │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│ Layer 1: Device Lock Screen                        │
│ - User must unlock device first                    │
│ - Protects against physical access                 │
└─────────────────────────────────────────────────────┘
```

## Error Handling

### Biometric Authentication Fails

```
Biometric Prompt Shown
        │
        ▼
User Fails Authentication
        │
        ▼
┌────────────────────────────┐
│ Return null/false          │
└────────────────────────────┘
        │
        ▼
┌────────────────────────────┐
│ Show Manual Login Screen   │
│ User can enter password    │
└────────────────────────────┘
```

### Device Doesn't Support Biometric

```
Check Device Capabilities
        │
        ▼
┌────────────────────────────┐
│ isBiometricSupported       │
│ = false                    │
└────────────────────────────┘
        │
        ▼
┌────────────────────────────┐
│ Don't show biometric UI    │
│ Only show manual login     │
└────────────────────────────┘
```

### SecureStore Access Fails

```
Try to read from SecureStore
        │
        ▼
┌────────────────────────────┐
│ Error thrown               │
└────────────────────────────┘
        │
        ▼
┌────────────────────────────┐
│ Catch in try/catch         │
│ Log error                  │
└────────────────────────────┘
        │
        ▼
┌────────────────────────────┐
│ Fall back to manual login  │
│ Don't show biometric option│
└────────────────────────────┘
```

## User Experience States

### State 1: First Time User
```
1. Open app
2. See login screen
3. Enter email/password
4. See "Enable Face ID" checkbox (if supported)
5. Check box
6. Tap "Sign In"
7. Face ID prompt appears
8. Authenticate with Face ID
9. See "Face ID enabled" success message
10. Redirected to dashboard
```

### State 2: Returning User with Biometric
```
1. Open app
2. Face ID prompt appears immediately
3. Authenticate with Face ID
4. Automatically logged in
5. Redirected to dashboard
```

### State 3: User Disables Biometric
```
1. Open app
2. Navigate to Settings
3. Scroll to Security section
4. Toggle "Biometric Login" off
5. Confirm in dialog
6. See success message
7. Next time app opens: manual login required
```

### State 4: Biometric Failure
```
1. Open app
2. Face ID prompt appears
3. User cancels or fails authentication
4. See manual login screen
5. Can enter email/password
6. Can try Face ID again by tapping biometric button
```

## Testing Scenarios

### Happy Path
- ✅ Enable biometric during first login
- ✅ Close and reopen app
- ✅ Biometric prompt appears
- ✅ Successful authentication
- ✅ Logged in automatically

### Edge Cases
- ✅ Cancel biometric prompt → shows manual login
- ✅ Fail biometric 3 times → falls back to manual login
- ✅ Enable then immediately disable → credentials removed
- ✅ Logout → credentials removed
- ✅ Uninstall app → all data removed

### Error Cases
- ✅ Device without biometric → no option shown
- ✅ Biometric not enrolled → error message
- ✅ Network failure during login → appropriate error
- ✅ Invalid stored credentials → fall back to manual login

## Implementation Checklist

### Core Functionality
- [x] Install expo-local-authentication
- [x] Create useBiometric hook
- [x] Add biometric detection
- [x] Implement secure storage
- [x] Add enable/disable functions
- [x] Integrate with login screen
- [x] Add to settings screen
- [x] Implement auto-login

### User Interface
- [x] Checkbox on login screen
- [x] Biometric button on login
- [x] Toggle in settings
- [x] Loading states
- [x] Success/error messages
- [x] Confirmation dialogs

### Security
- [x] Use SecureStore for credentials
- [x] Clear credentials on logout
- [x] Clear credentials on disable
- [x] No credentials in logs
- [x] Fallback to manual login
- [x] Error handling

### Documentation
- [x] Code comments
- [x] Type definitions
- [x] Setup guide
- [x] Quick start guide
- [x] Flow documentation
- [x] Testing instructions

---

**Status**: ✅ Complete and Ready for Testing
