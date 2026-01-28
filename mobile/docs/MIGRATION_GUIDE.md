# Liquid Glass Design System Migration Guide
## FinPal Mobile App

**Date**: January 12, 2026
**Design System**: iOS 26 Liquid Glass with Amber Accent

---

## What Changed

The mobile app has been updated from a **dark theme with green accents** to a modern **iOS Liquid Glass design with amber/orange accents**. This brings:

- ✨ Light, airy aesthetic with translucent glass effects
- 🎨 Amber primary color instead of green
- 🌓 Full light/dark mode support
- 📱 More rounded corners (20px for cards)
- 💪 Bolder typography with heavy font weights
- 🌟 Lighter, more subtle shadows

---

## Updated Theme Files

### ✅ Colors (`src/theme/colors.ts`)
- **New Function**: `getColors(isDark)` - Returns theme-aware color palette
- **Primary Color**: Changed from green (#10b981) to amber (#fbbf24)
- **Glass Effects**: New translucent backgrounds with blur support
- **Background Gradients**: Light amber gradients for both light and dark modes
- **Icon Gradients**: Pre-defined gradient patterns for icons

**Migration**:
```typescript
// OLD
import { colors } from '@theme';
const bgColor = colors.primary.green;

// NEW - for components that need theme awareness
import { getColors } from '@theme';
const colors = getColors(isDark);
const bgColor = colors.primary;
```

### ✅ Typography (`src/theme/typography.ts`)
- **New Weights**: Added `heavy` (800) and `black` (900) for bold headers
- **Letter Spacing**: Added tight (-0.5) for large headers
- **New Styles**: `pageTitle`, `sectionHeader`, `groupTitle`, `settingName`, `badge`

**Migration**:
```typescript
// Use heavy weights for important headers
<Text style={{ fontWeight: typography.weights.black }}>Page Title</Text>

// Use letter spacing for premium look
<Text style={{
  fontSize: 28,
  fontWeight: '900',
  letterSpacing: typography.letterSpacing.tight
}}>
  Header
</Text>
```

### ✅ Shadows (`src/theme/shadows.ts`)
- **Lighter Shadows**: Reduced opacity for glass aesthetic
- **New Presets**: `small`, `medium`, `large`, `primary` (with amber glow)
- **Blur Intensity**: Added `blurIntensity` constants (light, medium, strong)

### ✅ Spacing (`src/theme/spacing.ts`)
- **Border Radius**: Updated values to be more rounded
  - `sm`: 12px (was 4px)
  - `md`: 16px (was 8px)
  - `lg`: 20px (was 16px) - **PRIMARY for cards**
  - `xl`: 24px (was 20px)

---

## New Components

### 🆕 GlassCard
Modern card component with true glassmorphism effect.

**Features**:
- iOS: Uses `BlurView` for authentic glass effect
- Android: Semi-transparent background (BlurView doesn't work well)
- Customizable blur intensity
- Built-in shadow support

**Usage**:
```typescript
import { GlassCard } from '@components';

<GlassCard
  isDark={isDark}
  intensity="medium"
  padding={20}
  shadowStyle="medium"
>
  <Text>Content</Text>
</GlassCard>
```

### 🆕 GlassButton
Button component following Liquid Glass design.

**Features**:
- Multiple variants: `primary`, `secondary`, `outline`, `glass`
- Three sizes: `small`, `medium`, `large`
- Loading state support
- Theme-aware colors

**Usage**:
```typescript
import { GlassButton } from '@components';

<GlassButton
  title="Continue"
  onPress={handlePress}
  variant="primary"
  size="medium"
  isDark={isDark}
/>
```

---

## Updated Components

### ✏️ Card Component
**What Changed**:
- Now uses `getColors(isDark)` for theme support
- Border radius increased to 20px (`spacing.radius.lg`)
- Uses `BlurView` on iOS for glass variant
- Added `isDark` prop

**Migration**:
```typescript
// OLD
<Card variant="glass" padding="base">
  <Text>Content</Text>
</Card>

// NEW - add isDark prop for theme support
<Card variant="glass" padding="base" isDark={isDark}>
  <Text>Content</Text>
</Card>
```

### ✏️ Button Component
**What Changed**:
- Now uses `getColors(isDark)` for theme support
- Primary color changed from green to amber
- Border radius updated to 16px for buttons
- Added `isDark` prop
- Removed hardcoded color references

**Migration**:
```typescript
// OLD
<Button title="Submit" onPress={handleSubmit} variant="primary" />

// NEW - add isDark prop
<Button title="Submit" onPress={handleSubmit} variant="primary" isDark={isDark} />
```

---

## How to Update Your Screens

### Step 1: Add Dark Mode State Management

Add to every screen that uses themed components:

```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors } from '@theme';

const [isDark, setIsDark] = useState(false);
const colors = getColors(isDark);

// Load dark mode preference
useEffect(() => {
  const loadDarkMode = async () => {
    const darkMode = await AsyncStorage.getItem('darkMode');
    setIsDark(darkMode === 'true');
  };
  loadDarkMode();
}, []);

// Optional: Listen for dark mode changes
useEffect(() => {
  const interval = setInterval(async () => {
    const darkMode = await AsyncStorage.getItem('darkMode');
    setIsDark(darkMode === 'true');
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

### Step 2: Update Background Gradients

Replace solid backgrounds with gradients:

```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native';

<SafeAreaView style={{ flex: 1, backgroundColor: colors.background.light[0] }}>
  <LinearGradient colors={colors.background.light} style={{ flex: 1 }}>
    {/* Screen content */}
  </LinearGradient>
</SafeAreaView>
```

### Step 3: Update Component Props

Add `isDark` prop to all Card and Button components:

```typescript
// Cards
<Card isDark={isDark} variant="glass">
  {/* content */}
</Card>

// Or use new GlassCard
<GlassCard isDark={isDark} padding={20}>
  {/* content */}
</GlassCard>

// Buttons
<Button isDark={isDark} variant="primary" title="Click me" onPress={handlePress} />
```

### Step 4: Update Text Colors

Replace hardcoded text colors with theme colors:

```typescript
// OLD
<Text style={{ color: '#ffffff' }}>Title</Text>

// NEW
<Text style={{ color: colors.text.primary }}>Title</Text>
```

### Step 5: Update Typography

Use new bold font weights for headers:

```typescript
// Page titles
<Text style={{
  fontSize: 28,
  fontWeight: '900',
  letterSpacing: -0.5,
  color: colors.primary,
}}>
  Dashboard
</Text>

// Section headers
<Text style={{
  fontSize: 18,
  fontWeight: '900',
  letterSpacing: -0.5,
  color: colors.text.primary,
}}>
  Recent Transactions
</Text>

// Group titles (all caps)
<Text style={{
  fontSize: 12,
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: colors.text.secondary,
}}>
  ACCOUNT SETTINGS
</Text>
```

---

## Common Patterns

### Settings Screen Item Pattern

```typescript
<TouchableOpacity
  style={styles.settingItem}
  onPress={onPress}
  activeOpacity={0.7}
>
  <View style={styles.settingLeft}>
    {/* Icon with gradient background */}
    <View style={styles.settingIcon}>
      <LinearGradient
        colors={iconGradients.blue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.settingIconGradient}
      >
        <Text style={styles.settingIconEmoji}>👤</Text>
      </LinearGradient>
    </View>

    {/* Title and description */}
    <View style={styles.settingText}>
      <Text style={[styles.settingName, { color: colors.text.primary }]}>
        Profile
      </Text>
      <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
        Edit your information
      </Text>
    </View>
  </View>

  {/* Chevron */}
  <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconEmoji: {
    fontSize: 20,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '400',
  },
});
```

### Badge Pattern

```typescript
<View style={[styles.badge, { backgroundColor: colors.primary }]}>
  <Text style={styles.badgeText}>PRO</Text>
</View>

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1f2937',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
```

---

## Testing Checklist

- [ ] All screens load without errors
- [ ] Cards use rounded corners (20px)
- [ ] Primary buttons are amber colored
- [ ] Text is readable in both light and dark mode
- [ ] Glass effects appear on iOS (blur visible)
- [ ] Android fallback works (semi-transparent backgrounds)
- [ ] Typography uses bold weights (900) for headers
- [ ] Colors update when dark mode is toggled
- [ ] Gradients display correctly as backgrounds
- [ ] Shadows are subtle and appropriate

---

## Next Steps

1. **Update Screen Components**: Go through each screen and apply the migration steps
2. **Test Dark Mode**: Toggle dark mode and verify all colors update correctly
3. **Test on Both Platforms**: Ensure iOS shows blur effects and Android shows fallbacks
4. **Update Navigation**: Apply glass effects to tab bar and navigation headers
5. **Review Typography**: Ensure headers use bold weights (900) consistently

---

## Need Help?

Refer to:
- `DESIGN_SYSTEM.md` - Complete design system specification
- `src/theme/colors.ts` - Color system and getColors function
- `src/components/GlassCard.tsx` - Glass card implementation example
- `src/components/GlassButton.tsx` - Glass button implementation example

---

**Note**: The existing `Card` and `Button` components have been updated to be backward compatible. They will work with the new design system when you add the `isDark` prop. For new screens, prefer using the new `GlassCard` and `GlassButton` components.
