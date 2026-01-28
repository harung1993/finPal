# Backend Configuration Guide

## Overview

The DollarDollar mobile app now supports **configurable backend URLs**, allowing you to:
- Connect to your self-hosted DollarDollar backend
- Switch between development and production servers
- Test against localhost during development
- Use custom domain names

## Features

✅ **Welcome Screen** - First-time configuration on app launch
✅ **Default Backend** - One-click setup with default server
✅ **Custom Backend** - Enter any backend URL
✅ **Connection Test** - Test backend connectivity before saving
✅ **Settings Management** - View and change backend from Settings
✅ **Persistent Storage** - Configuration saved securely
✅ **Dynamic API** - All API calls use configured backend

## First-Time Setup

### Flow on First Launch

```
App Launch
    ↓
Welcome Screen
    ↓
┌─────────────────────────────┐
│ Choose Backend:             │
│                             │
│ [Use Default Backend]       │
│ [Use Custom Backend URL]    │
└─────────────────────────────┘
    ↓
Login/Register Screen
```

### Using Default Backend

1. Launch app for first time
2. Welcome screen appears
3. Tap **"Use Default Backend"**
4. Automatically configured with:
   - Development: `http://localhost:5006`
   - Production: `https://api.dollardollar.app`
5. Redirected to Login screen

### Using Custom Backend

1. Launch app for first time
2. Welcome screen appears
3. Tap **"Use Custom Backend URL"**
4. Enter your backend URL (e.g., `http://192.168.1.100:5006`)
5. Optional: Tap **"Test Connection"** to verify
6. Tap **"Continue"**
7. Redirected to Login screen

## Backend URL Examples

### Development (Local)
```
http://localhost:5006
http://127.0.0.1:5006
http://192.168.1.100:5006  (for physical devices on same network)
http://10.0.2.2:5006       (Android emulator accessing host machine)
```

### Production (Hosted)
```
https://api.yourdomain.com
https://dollardollar.example.com
https://api.dollardollar.app
```

### Important Notes
- Include the protocol (`http://` or `https://`)
- Do NOT include `/api/v1` - this is added automatically
- Remove trailing slashes
- Use IP address for local network access from physical devices

## Changing Backend After Setup

### From Settings Screen

1. Open app
2. Navigate to **Settings** tab
3. Scroll to **Backend Server** section
4. View current backend URL
5. Tap **"Change Backend"**
6. Confirm the change (logs you out and clears data)
7. Redirected to Welcome screen
8. Configure new backend

### What Happens When Changing Backend

```
Change Backend
    ↓
Confirmation Dialog
    ↓
User Confirms
    ↓
┌─────────────────────────────┐
│ 1. Logout current session   │
│ 2. Clear auth tokens        │
│ 3. Clear backend config     │
│ 4. Redirect to Welcome      │
└─────────────────────────────┘
    ↓
Configure New Backend
```

## Testing Backend Connection

The Welcome screen includes a **"Test Connection"** button:

1. Enter backend URL
2. Tap **"Test Connection"**
3. App attempts to reach `{url}/api/v1/health`
4. Shows success or error message

**Success Response:**
```
✅ Connection successful! Backend is reachable.
```

**Error Response:**
```
❌ Could not connect to backend. Please check the URL and try again.
```

## Technical Implementation

### Architecture

```
┌──────────────────────────────────────────┐
│           User Interface                  │
│  - Welcome Screen                        │
│  - Settings Screen                       │
└──────────────────┬───────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────┐
│         Config Store (Zustand)           │
│  - backendUrl: string | null             │
│  - isConfigured: boolean                 │
│  - setBackendUrl()                       │
│  - clearConfig()                         │
│  - getApiBaseUrl()                       │
└──────────────────┬───────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────┐
│      Persistent Storage (AsyncStorage)   │
│  - Survives app restarts                 │
│  - Cleared on app uninstall             │
└──────────────────┬───────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────┐
│          API Service (Axios)             │
│  - Dynamic baseURL from config           │
│  - All requests use configured URL       │
└──────────────────────────────────────────┘
```

### Files Modified/Created

#### Created Files
- ✅ `src/store/configStore.ts` - Configuration state management
- ✅ `app/welcome.tsx` - Welcome/landing screen

#### Modified Files
- ✅ `src/services/api.ts` - Dynamic backend URL
- ✅ `app/index.tsx` - Check configuration on launch
- ✅ `app/(tabs)/settings.tsx` - Backend management UI

### Config Store API

```typescript
import { useConfigStore } from '@store/configStore';

// Get configuration state
const { backendUrl, isConfigured } = useConfigStore();

// Set backend URL
const { setBackendUrl } = useConfigStore();
setBackendUrl('https://api.example.com');

// Clear configuration
const { clearConfig } = useConfigStore();
clearConfig();

// Get API base URL (with fallback)
const { getApiBaseUrl } = useConfigStore();
const url = getApiBaseUrl(); // Returns configured URL or default
```

### Dynamic API Requests

All API requests now use the configured backend URL:

```typescript
// Before (hardcoded)
const API_BASE_URL = 'http://localhost:5006/api/v1';

// After (dynamic)
const getApiBaseUrl = () => {
  const configuredUrl = useConfigStore.getState().getApiBaseUrl();
  return `${configuredUrl}/api/v1`;
};

// Applied on every request
api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});
```

## Security Considerations

### What's Stored
- Backend URL (non-sensitive)
- Configuration flag (boolean)

### What's NOT Stored in Config
- User credentials (stored separately in AuthStore)
- API tokens (stored separately in AuthStore)
- Biometric credentials (stored in SecureStore)

### HTTPS Recommendations
- **Development**: HTTP is acceptable for localhost
- **Production**: ALWAYS use HTTPS
- **Self-Hosted**: Obtain SSL certificate (Let's Encrypt is free)

### Network Security
When using custom backends:
- Ensure backend has CORS configured for mobile app
- Use VPN for sensitive environments
- Avoid public WiFi for production access

## Troubleshooting

### "Could not connect to backend"

**Possible Causes:**
1. Backend server is not running
2. Wrong URL or port number
3. Firewall blocking connection
4. Network connectivity issues

**Solutions:**
1. Verify backend is running: `curl http://localhost:5006/api/v1/health`
2. Check URL format (include protocol, no trailing slash)
3. For physical devices: use computer's IP, not localhost
4. Check firewall allows incoming connections on backend port

### "Invalid URL" Error

**Cause:** URL doesn't match expected format

**Solutions:**
- Include protocol: `https://` or `http://`
- Remove trailing slash: ~~`http://example.com/`~~
- Don't include path: ~~`http://example.com/api/v1`~~
- ✅ Correct: `http://example.com`

### Backend Changes Not Taking Effect

**Solution:**
1. Completely close and reopen the app
2. If still not working:
   - Go to Settings → Change Backend
   - Clear configuration
   - Reconfigure from Welcome screen

### Connection Works But Login Fails

**Possible Causes:**
1. Backend API endpoints different than expected
2. Authentication credentials invalid
3. Backend database not initialized

**Solutions:**
1. Test backend with curl:
   ```bash
   curl -X POST http://localhost:5006/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```
2. Check backend logs for errors
3. Verify user exists in backend database

## Development Workflow

### Testing Against Localhost

**iOS Simulator:**
```
Backend URL: http://localhost:5006
```

**Android Emulator:**
```
Backend URL: http://10.0.2.2:5006
```
(Android emulator uses special IP to access host machine)

**Physical Device (Same WiFi):**
```
1. Find computer's IP address:
   - Mac: System Preferences → Network
   - Windows: ipconfig
   - Linux: ifconfig or ip addr

2. Use that IP:
   Backend URL: http://192.168.1.100:5006
```

### Switching Between Environments

**Quick Switch:**
1. Settings → Backend Server → Change Backend
2. Enter new URL
3. Login with credentials for that environment

**Environment Presets (Future Enhancement):**
Could add saved presets:
- Development
- Staging
- Production
- Custom

## API Endpoints Expected

The app expects these endpoints on the backend:

### Health Check
```
GET /api/v1/health
Response: 200 OK
```

### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

### Other Endpoints
All other endpoints follow the pattern: `/api/v1/{resource}`

## Future Enhancements

### Potential Features
1. **Multiple Profiles** - Save multiple backend configurations
2. **Environment Presets** - Quick switch between dev/staging/prod
3. **Backend Validation** - Check API version compatibility
4. **Offline Mode** - Queue requests when backend unavailable
5. **Auto-Discovery** - Scan network for DollarDollar backends
6. **QR Code Setup** - Scan QR code to configure backend
7. **Backend Status** - Show connection status in Settings

### Implementation Ideas

**Environment Presets:**
```typescript
const presets = {
  development: 'http://localhost:5006',
  staging: 'https://staging-api.example.com',
  production: 'https://api.example.com',
};
```

**QR Code Configuration:**
```
Scan QR code containing:
{
  "backendUrl": "https://api.example.com",
  "name": "Production Server"
}
```

## FAQ

### Q: Can I use the app without configuring a backend?
**A:** No, the app requires a backend server to function. You must configure one on first launch.

### Q: Is my backend URL secure?
**A:** The URL itself is not sensitive. However, use HTTPS for production to encrypt all communication.

### Q: Can I switch backends without losing data?
**A:** No. Data is stored on the backend server. Switching backends logs you out and you'll need to login to the new backend.

### Q: What if I forget my backend URL?
**A:** The current URL is shown in Settings → Backend Server section.

### Q: Can multiple apps share the same backend?
**A:** Yes! You can have the web app and mobile app connected to the same backend, syncing data across platforms.

### Q: Does the backend URL sync across devices?
**A:** No. Each device stores its own backend configuration. You need to configure each device separately.

## Support

### Backend Not Starting
Check the backend server documentation:
- `START_APP.md` in the main project folder
- Ensure all backend dependencies installed
- Check backend logs for errors

### Mobile App Issues
1. Clear app data and reconfigure
2. Check console logs in dev mode
3. Verify network connectivity
4. Test backend with curl/Postman first

---

**Last Updated**: December 27, 2024
**Feature**: Configurable Backend URL
**Status**: ✅ Fully Implemented
