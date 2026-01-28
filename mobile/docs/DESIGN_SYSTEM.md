# PantryPal Mobile Design System
## iOS 26 Liquid Glass Design Specification

Version: 1.0
Last Updated: 2026-01-11
Framework: React Native with Expo SDK 54

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Navigation](#navigation)
7. [Shadows & Blur Effects](#shadows--blur-effects)
8. [Animations](#animations)
9. [Platform-Specific Guidelines](#platform-specific-guidelines)
10. [Implementation Examples](#implementation-examples)

---

## Design Philosophy

### Core Principles

**Liquid Glass Aesthetic**
- Translucent surfaces with blur effects (iOS BlurView)
- Layered depth with subtle shadows
- Smooth, rounded corners throughout
- Light, airy feeling with gradient backgrounds

**Visual Hierarchy**
- Bold typography for headers (weight: 900)
- Clear information architecture with grouped sections
- Emoji icons for visual recognition
- Consistent use of primary color (amber/orange) for accents

**Modern iOS Design**
- System fonts (San Francisco on iOS, Roboto on Android)
- Native-feeling interactions
- Smooth animations and transitions
- Pull-to-refresh patterns

---

## Color System

### Implementation Location
```
mobile/src/constants/colors.js
```

### Light Mode Palette

#### Primary Colors
```javascript
primary: '#fbbf24'        // Amber - Main accent color
primaryDark: '#f97316'    // Orange - Hover/pressed states
primaryLight: '#fde68a'   // Light amber - Backgrounds
```

#### Glass Effects
```javascript
glass: {
  background: 'rgba(255, 255, 255, 0.5)',      // Main glass background
  backgroundLight: 'rgba(255, 255, 255, 0.4)', // Lighter variant
  backgroundDark: 'rgba(255, 255, 255, 0.6)',  // Darker variant
  border: 'rgba(255, 255, 255, 0.3)',          // Glass borders
  shadow: 'rgba(0, 0, 0, 0.1)',                // Glass shadows
}
```

#### Background Gradients
```javascript
background: {
  light: ['#fef3c7', '#fffbeb', '#fef9c3'],  // Main app gradient
  amber: ['#fef3c7', '#fbbf24'],             // Amber accent gradient
  purple: ['#faf5ff', '#e9d5ff'],            // Purple accent gradient
}
```

#### Semantic Colors
```javascript
success: '#34c759'  // Green - Success states
warning: '#ff9500'  // Orange - Warning states
error: '#ff3b30'    // Red - Error states
info: '#007aff'     // Blue - Info states
```

#### Text Colors
```javascript
text: {
  primary: '#1f2937',    // Dark gray - Main text
  secondary: '#6b7280',  // Medium gray - Secondary text
  tertiary: '#9ca3af',   // Light gray - Tertiary text
  white: '#ffffff',      // White - On dark backgrounds
  onGlass: '#1f2937',    // Readable on glass backgrounds
}
```

### Dark Mode Palette

#### Primary Colors
```javascript
primary: '#d97706'        // Muted amber
primaryDark: '#b45309'    // Darker amber
primaryLight: '#f59e0b'   // Brighter amber
```

#### Glass Effects
```javascript
glass: {
  background: 'rgba(30, 30, 30, 0.7)',
  backgroundLight: 'rgba(40, 40, 40, 0.6)',
  backgroundDark: 'rgba(20, 20, 20, 0.8)',
  border: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.3)',
}
```

#### Background Gradients
```javascript
background: {
  light: ['#1a1a1a', '#2d2d2d', '#1f1f1f'],  // Dark gradient
  amber: ['#2d2416', '#3d3016'],             // Dark amber
  purple: ['#1f1a24', '#2d2436'],            // Dark purple
}
```

#### Text Colors
```javascript
text: {
  primary: '#f9fafb',    // Light text
  secondary: '#d1d5db',  // Medium light
  tertiary: '#9ca3af',   // Muted light
  white: '#ffffff',
  onGlass: '#f9fafb',
}
```

### Usage Guidelines

1. **Always use `getColors(isDark)` function** to get theme-aware colors
2. **Primary color** for CTAs, badges, and important UI elements
3. **Glass backgrounds** for all cards and elevated surfaces
4. **Semantic colors** for status indicators and alerts
5. **Text hierarchy** using primary/secondary/tertiary text colors

---

## Typography

### Implementation Location
```
mobile/src/constants/typography.js
```

### Font Weights
```javascript
weights: {
  regular: '400',   // Body text
  medium: '500',    // Emphasis
  semibold: '600',  // Subheadings
  bold: '700',      // Headings
  heavy: '800',     // Strong emphasis
  black: '900',     // Hero text, page titles
}
```

### Font Sizes
```javascript
sizes: {
  xs: 11,      // Small labels, captions
  sm: 13,      // Secondary text
  base: 16,    // Body text
  lg: 18,      // Large body, subheadings
  xl: 22,      // Section headers
  '2xl': 28,   // Page headers
  '3xl': 32,   // Large headers
  '4xl': 40,   // Hero text
}
```

### Letter Spacing
```javascript
letterSpacing: {
  tight: -0.5,   // Large headers (makes them feel more premium)
  normal: 0,     // Body text
  wide: 0.5,     // Small caps, labels
}
```

### Line Heights
```javascript
lineHeights: {
  tight: 1.2,     // Headers
  normal: 1.5,    // Body text
  relaxed: 1.75,  // Long-form content
}
```

### Typography Usage Patterns

#### Page Titles
```javascript
{
  fontSize: 28,
  fontWeight: '900',
  letterSpacing: -0.5,
  color: colors.primary,
}
```

#### Section Headers
```javascript
{
  fontSize: 18,
  fontWeight: '900',
  letterSpacing: -0.5,
  color: colors.text.primary,
}
```

#### Group Titles (All Caps)
```javascript
{
  fontSize: 12,
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: colors.text.secondary,
}
```

#### Body Text
```javascript
{
  fontSize: 16,
  fontWeight: '500',
  lineHeight: 1.5,
  color: colors.text.primary,
}
```

#### Secondary Text
```javascript
{
  fontSize: 13,
  fontWeight: '600',
  color: colors.text.secondary,
}
```

---

## Spacing & Layout

### Base Spacing Scale
```javascript
spacing: {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
}
```

### Container Padding
- **Screen horizontal padding**: 20px
- **Screen vertical padding**: 16px
- **Content sections**: 24px bottom margin
- **Card padding**: 16px default, 20px for important cards

### Safe Areas
Always wrap screens in `SafeAreaView`:
```javascript
<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
  <LinearGradient colors={colors.background.light} style={styles.container}>
    {/* Content */}
  </LinearGradient>
</SafeAreaView>
```

### Border Radius Scale
```javascript
borderRadius: {
  sm: 12,      // Small elements
  md: 16,      // Buttons, inputs
  lg: 20,      // Cards (PRIMARY)
  xl: 24,      // Large cards
  full: 9999,  // Pills, circular elements
}
```

**Standard card radius**: 20px

### Layout Patterns

#### Header Layout
```javascript
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: 12,
  paddingBottom: 12,
}
```

#### Content Container
```javascript
content: {
  padding: 20,
  paddingBottom: 40,  // Extra bottom padding for tab bar
}
```

#### Settings Group
```javascript
settingsGroup: {
  marginBottom: 24,
}
```

---

## Components

### GlassCard Component

**Location**: `mobile/src/components/GlassCard.js`

**Purpose**: Primary container component with glassmorphism effect

#### Props
```javascript
{
  children: ReactNode,
  style: ViewStyle,
  intensity: number = 30,           // Blur intensity (iOS only)
  borderColor: string,              // Optional border color
  padding: number = 16,             // Internal padding
  shadowStyle: object = shadows.medium,
  isDark: boolean = false,          // Theme mode
}
```

#### Default Styling
- **Border radius**: 20px
- **Border width**: 1px
- **iOS**: Uses `BlurView` with intensity 30
- **Android**: Semi-transparent background (BlurView doesn't work well)
- **Shadow**: Medium shadow by default

#### Usage Example
```javascript
<GlassCard style={styles.card} padding={20} isDark={isDark}>
  <Text>Content goes here</Text>
</GlassCard>
```

### GlassButton Component

**Location**: `mobile/src/components/GlassButton.js`

**Purpose**: Primary button with glass effect

#### Common Button Styles
```javascript
// Primary Action Button
{
  backgroundColor: colors.primary,
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
}

// Text Style
{
  fontSize: 16,
  fontWeight: '700',
  color: '#ffffff',
}
```

### Setting Item Pattern

Used extensively in Settings screen and detail screens:

```javascript
<TouchableOpacity
  style={styles.settingItem}
  onPress={onPress}
  activeOpacity={0.7}
>
  <View style={styles.settingLeft}>
    {/* Icon with gradient background */}
    <View style={styles.settingIcon}>
      <LinearGradient
        colors={iconBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.settingIconGradient}
      >
        <Text style={styles.settingIconEmoji}>{icon}</Text>
      </LinearGradient>
    </View>

    {/* Title and description */}
    <View style={styles.settingText}>
      <Text style={[styles.settingName, { color: colors.text.primary }]}>
        {title}
      </Text>
      <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
        {description}
      </Text>
    </View>
  </View>

  {/* Chevron */}
  <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
</TouchableOpacity>
```

#### Setting Item Styles
```javascript
settingItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 16,
}

settingLeft: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
}

settingIcon: {
  width: 42,
  height: 42,
  borderRadius: 12,
  overflow: 'hidden',
}

settingIconGradient: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
}

settingIconEmoji: {
  fontSize: 20,
}

settingName: {
  fontSize: 16,
  fontWeight: '700',
}

settingDescription: {
  fontSize: 13,
  fontWeight: '600',
  marginTop: 2,
}

chevron: {
  fontSize: 24,
  fontWeight: '400',
}
```

### Icon Gradient Patterns

Common gradient backgrounds for icons:

```javascript
// Blue gradient (Profile, Security)
['rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.2)']

// Purple gradient (Admin, Settings)
['rgba(168, 85, 247, 0.2)', 'rgba(192, 132, 252, 0.2)']

// Green gradient (Success, Active)
['rgba(52, 199, 89, 0.2)', 'rgba(134, 239, 172, 0.2)']

// Orange gradient (Analytics, Stats)
['rgba(249, 115, 22, 0.2)', 'rgba(251, 191, 36, 0.2)']

// Red gradient (Danger, Delete)
['rgba(239, 68, 68, 0.2)', 'rgba(252, 165, 165, 0.2)']

// Gray gradient (Neutral)
['rgba(107, 114, 128, 0.2)', 'rgba(156, 163, 175, 0.2)']
```

### Divider Between List Items
```javascript
settingDivider: {
  height: 1,
  backgroundColor: colors.border.light,
  marginHorizontal: 16,
}
```

### Badge Component Pattern
```javascript
// Role Badge (Admin, Pro, etc.)
<View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
  <Text style={styles.roleBadgeText}>Admin</Text>
</View>

// Styles
roleBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
}

roleBadgeText: {
  fontSize: 11,
  fontWeight: '800',
  color: '#1f2937',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
}
```

---

## Navigation

### Bottom Tab Navigator

**Location**: `mobile/src/navigation/MainTabs.js`

#### Tab Bar Configuration
```javascript
screenOptions={{
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: Platform.OS === 'ios' ? 88 : 64,
    backgroundColor: 'transparent',
  },
  tabBarBackground: () =>
    Platform.OS === 'ios' ? (
      <BlurView
        intensity={40}
        tint={isDark ? 'dark' : 'light'}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.glass.background,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
    ) : (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.glass.background,
          borderTopWidth: 1,
          borderTopColor: colors.glass.border,
        }}
      />
    ),
  tabBarShowLabel: true,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.text.secondary,
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  tabBarIconStyle: {
    marginTop: Platform.OS === 'ios' ? 4 : 8,
  },
}}
```

#### Tab Structure
1. **Pantry** (HomeTab) - 🏠
2. **Shopping** (ShoppingListTab) - 🛒
3. **Insights** (InsightsTab) - 📊
4. **Recipes** (RecipesTab) - 🍳 (Coming Soon)
5. **Settings** (SettingsTab) - ⚙️

#### Tab Icon Pattern
```javascript
<Tab.Screen
  name="HomeTab"
  component={HomeScreen}
  options={{
    tabBarLabel: 'Pantry',
    tabBarIcon: ({ focused, color }) => (
      <Text style={{ fontSize: 24 }}>🏠</Text>
    ),
  }}
/>
```

**Note**: Using emoji icons (24px size) instead of icon libraries for consistent cross-platform appearance

### Header Pattern

Standard header for detail screens:

```javascript
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Text style={[styles.backText, { color: colors.text.primary }]}>
      ← Back
    </Text>
  </TouchableOpacity>
  <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
    Screen Title
  </Text>
  <View style={{ width: 60 }} /> {/* Spacer for centering */}
</View>

// Styles
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: 12,
  paddingBottom: 12,
}

backText: {
  fontSize: 16,
  fontWeight: '600',
  width: 60,
}

headerTitle: {
  fontSize: 18,
  fontWeight: '900',
  letterSpacing: -0.5,
}
```

---

## Shadows & Blur Effects

### Implementation Location
```
mobile/src/constants/shadows.js
```

### Shadow Presets
```javascript
shadows: {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,  // Android
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  primary: {
    shadowColor: '#fbbf24',  // Amber shadow for emphasis
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
}
```

### Blur Intensities
```javascript
blurIntensity: {
  light: 20,    // Subtle blur
  medium: 30,   // Standard (most common)
  strong: 40,   // Heavy blur (tab bar)
}
```

### Usage Guidelines
- **Cards**: Use `shadows.card` or `shadows.medium`
- **Floating elements**: Use `shadows.large`
- **Primary CTAs**: Use `shadows.primary` for emphasis
- **Tab bar**: Use `intensity={40}` with BlurView

---

## Animations

### Layout Animations

Enable on Android:
```javascript
import { LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
```

Use for collapsible sections:
```javascript
const toggleSection = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  // Update state
};
```

### Spring Animations

Common spring configuration:
```javascript
Animated.spring(animatedValue, {
  toValue: 1,
  useNativeDriver: true,
  tension: 50,
  friction: 7,
}).start();
```

### Staggered Animations

For sequential animations:
```javascript
Animated.stagger(50, [
  Animated.spring(button1Slide, config),
  Animated.spring(button2Slide, config),
]).start();
```

### Rotation Animation

For FAB menu toggle:
```javascript
const rotation = fabRotation.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '45deg'],
});

<Animated.View style={{ transform: [{ rotate: rotation }] }}>
  {/* Rotating element */}
</Animated.View>
```

### Touch Feedback

Always use `activeOpacity` for touchable elements:
```javascript
<TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
  {/* Content */}
</TouchableOpacity>
```

---

## Platform-Specific Guidelines

### iOS-Specific

#### BlurView
```javascript
import { BlurView } from 'expo-blur';

<BlurView
  intensity={40}
  tint={isDark ? 'dark' : 'light'}
  style={styles.blurContainer}
>
  {/* Content */}
</BlurView>
```

#### Safe Area Handling
```javascript
import { SafeAreaView } from 'react-native';

<SafeAreaView style={styles.safeArea}>
  {/* Content */}
</SafeAreaView>
```

#### Tab Bar Height
- iOS: 88px (accounts for home indicator)

### Android-Specific

#### No Blur Support
Replace BlurView with semi-transparent background:
```javascript
if (Platform.OS === 'android') {
  return (
    <View style={[styles.container, {
      backgroundColor: colors.glass.backgroundDark,
    }]}>
      {/* Content */}
    </View>
  );
}
```

#### Elevation for Depth
Use `elevation` property instead of shadow properties:
```javascript
{
  elevation: 4,  // Creates shadow on Android
}
```

#### Tab Bar Height
- Android: 64px

---

## Implementation Examples

### Full Screen Template

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors, typography } from '../constants';
import GlassCard from '../components/GlassCard';

export default function TemplateScreen({ navigation }) {
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, { color: colors.text.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Screen Title
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              SECTION TITLE
            </Text>
            <GlassCard style={styles.card} padding={20} isDark={isDark}>
              <Text style={[styles.bodyText, { color: colors.text.primary }]}>
                Content goes here
              </Text>
            </GlassCard>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: typography.weights.semibold,
    width: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: typography.weights.black,
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    marginBottom: 0,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    lineHeight: 24,
  },
});
```

### Settings Screen Pattern

```javascript
// Group of settings items
<View style={styles.settingsGroup}>
  <Text style={[styles.groupTitle, { color: colors.text.secondary }]}>
    ACCOUNT
  </Text>
  <GlassCard style={styles.settingsList} padding={0} isDark={isDark}>
    {/* Setting Item 1 */}
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => navigation.navigate('ProfileDetail')}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <LinearGradient
            colors={['rgba(168, 85, 247, 0.2)', 'rgba(192, 132, 252, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.settingIconGradient}
          >
            <Text style={styles.settingIconEmoji}>👤</Text>
          </LinearGradient>
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingName, { color: colors.text.primary }]}>
            My Profile
          </Text>
          <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
            Edit your information
          </Text>
        </View>
      </View>
      <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
    </TouchableOpacity>

    {/* Divider */}
    <View style={[styles.settingDivider, { backgroundColor: colors.border.light }]} />

    {/* Setting Item 2 */}
    {/* ... */}
  </GlassCard>
</View>
```

### List Item with Status Badge

```javascript
// Item with expiry status
const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return null;
  const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { text: 'Expired', color: colors.error };
  } else if (days === 0) {
    return { text: 'Today', color: colors.error };
  } else if (days <= 3) {
    return { text: `${days}d`, color: colors.warning };
  } else if (days <= 7) {
    return { text: `${days}d`, color: colors.info };
  }
  return { text: `${days}d`, color: colors.text.tertiary };
};

// Usage in component
const status = getExpiryStatus(item.expiry_date);
{status && (
  <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
    <Text style={[styles.statusText, { color: status.color }]}>
      {status.text}
    </Text>
  </View>
)}

// Styles
statusBadge: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
}

statusText: {
  fontSize: 11,
  fontWeight: '800',
}
```

### Icon with Large Gradient Background

```javascript
// Feature showcase or detail screen icon
<View style={styles.iconContainer}>
  <LinearGradient
    colors={['rgba(59, 130, 246, 0.3)', 'rgba(96, 165, 250, 0.3)']}
    style={styles.iconGradient}
  >
    <Text style={styles.iconEmoji}>🔔</Text>
  </LinearGradient>
</View>

// Styles
iconContainer: {
  alignItems: 'center',
  marginBottom: 24,
}

iconGradient: {
  width: 80,
  height: 80,
  borderRadius: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
}

iconEmoji: {
  fontSize: 40,
}
```

---

## Dark Mode Implementation

### State Management
```javascript
const [isDark, setIsDark] = useState(false);
const colors = getColors(isDark);

// Load preference
useEffect(() => {
  const loadDarkMode = async () => {
    const darkMode = await AsyncStorage.getItem('darkMode');
    setIsDark(darkMode === 'true');
  };
  loadDarkMode();
}, []);

// Toggle function
const toggleDarkMode = async () => {
  const newValue = !isDark;
  setIsDark(newValue);
  await AsyncStorage.setItem('darkMode', newValue.toString());
};
```

### Polling Pattern (For Cross-Screen Sync)
```javascript
// Listen for dark mode changes
const interval = setInterval(async () => {
  const darkMode = await AsyncStorage.getItem('darkMode');
  setIsDark(darkMode === 'true');
}, 1000);

return () => clearInterval(interval);
```

**Note**: This ensures dark mode changes propagate across all tabs immediately.

---

## Accessibility Considerations

### Minimum Touch Targets
- Buttons: 44x44px minimum
- Icon buttons: 42x42px minimum
- List items: 56px minimum height

### Text Contrast
- Primary text on light backgrounds: WCAG AA compliant
- Use `colors.text.primary` for main content
- Use `colors.text.secondary` for supplementary content

### Semantic Elements
- Use `accessibilityLabel` for icon-only buttons
- Use `accessibilityRole` for interactive elements
- Provide `accessibilityHint` for complex interactions

---

## Performance Optimizations

### FlatList / SectionList
```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
/>
```

### useCallback for Functions
```javascript
const loadItems = useCallback(async () => {
  // Load logic
}, [dependencies]);
```

### Memoization
```javascript
const memoizedValue = useMemo(() =>
  computeExpensiveValue(data),
  [data]
);
```

---

## Dependencies

### Required Packages
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17",
  "@react-navigation/bottom-tabs": "^6.6.1",
  "@react-native-async-storage/async-storage": "2.2.0",
  "expo": "~54.0.30",
  "expo-blur": "~15.0.8",
  "expo-linear-gradient": "~15.0.2",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

---

## File Structure

```
mobile/
├── src/
│   ├── constants/
│   │   ├── index.js              # Export all constants
│   │   ├── colors.js             # Color system
│   │   ├── typography.js         # Typography system
│   │   └── shadows.js            # Shadow & blur presets
│   ├── components/
│   │   ├── GlassCard.js          # Main card component
│   │   └── GlassButton.js        # Button component
│   ├── navigation/
│   │   └── MainTabs.js           # Bottom tab navigator
│   └── screens/
│       ├── HomeScreen.js         # Main pantry screen
│       ├── SettingsScreen.js     # Settings hub
│       └── [DetailScreens].js    # Various detail screens
└── App.js                        # Root component
```

---

## Version History

**v1.0** (2026-01-11)
- Initial design system documentation
- iOS 26 Liquid Glass aesthetic
- Complete color, typography, and component specifications
- Navigation patterns and implementation examples

---

## Notes for Implementation in Other Pal Apps

### Quick Start Checklist

1. **Copy Constants Folder**
   - Copy entire `mobile/src/constants/` directory
   - Adjust primary color palette to match your app theme

2. **Copy Core Components**
   - `GlassCard.js` - Essential for the liquid glass look
   - `GlassButton.js` - Primary button component

3. **Setup Navigation**
   - Use bottom tab navigator pattern from `MainTabs.js`
   - Apply same blur effect to tab bar

4. **Apply Typography System**
   - Use consistent font weights (especially '900' for headers)
   - Apply letter spacing to large headers (-0.5)
   - Use uppercase with letter spacing for section titles

5. **Implement Dark Mode**
   - Use `getColors(isDark)` function throughout
   - Store preference in AsyncStorage
   - Implement polling for cross-screen sync

6. **Settings Screen Pattern**
   - Use grouped sections with uppercase labels
   - Icon + gradient background pattern
   - Consistent spacing and dividers

7. **Standardize Spacing**
   - Screen padding: 20px horizontal
   - Card padding: 16px-20px
   - Section margins: 24px bottom
   - Border radius: 20px for cards

### Color Customization

To customize for your app, change the primary color palette in `colors.js`:

```javascript
// Example: Change to blue theme
primary: '#3b82f6',        // Blue
primaryDark: '#2563eb',    // Darker blue
primaryLight: '#93c5fd',   // Lighter blue
```

The rest of the design system will adapt automatically.

---

**End of Design System Specification**
