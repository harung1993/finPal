# 🧪 Testing Checklist - Liquid Glass Design System

Use this checklist to verify the implementation is working correctly across all screens.

---

## 🚀 Quick Start

```bash
cd finpal-mobile
npm start
```

---

## ✅ DARK MODE TESTING

### Test Dark Mode Toggle
- [ ] Open **Settings** screen
- [ ] Find dark mode toggle at top of Preferences section
- [ ] Toggle ON - screen should switch to dark theme immediately
- [ ] Toggle OFF - screen should switch to light theme immediately
- [ ] Preference should persist after app restart

### Test Cross-Screen Sync
- [ ] Enable dark mode in Settings
- [ ] Navigate to Dashboard - should be in dark mode
- [ ] Navigate to Transactions - should be in dark mode
- [ ] Navigate back to Settings
- [ ] Disable dark mode
- [ ] Navigate to other screens - all should be in light mode

---

## 🎨 VISUAL DESIGN TESTING

### Test Each Screen - Light Mode

#### Settings Screen
- [ ] Gradient background (cream/amber tones)
- [ ] Title "Settings" is amber colored with 900 font weight
- [ ] Section titles are UPPERCASE (PREFERENCES, ACCOUNT, etc.)
- [ ] Glass cards have subtle blur effect (iOS) or semi-transparent (Android)
- [ ] Icons have gradient backgrounds (purple, blue, green, amber)
- [ ] Dark mode toggle shows sun icon ☀️
- [ ] All setting items have chevrons (›)
- [ ] Dividers between setting items visible

#### Dashboard Screen
- [ ] Title "Dashboard" is amber with 900 weight
- [ ] Gradient background visible
- [ ] Summary cards at top (Total Balance, Income, Expenses, Transactions)
- [ ] "BUDGET PROGRESS" section uses GlassCard
- [ ] "RECENT TRANSACTIONS" section title is uppercase
- [ ] "SPENDING BY CATEGORY" with amber progress bars
- [ ] Empty states use GlassCard if no data

#### Login/Register Screens
- [ ] Centered layout with max-width
- [ ] 💰 emoji logo at top
- [ ] "FinPal" title in amber with 900 weight
- [ ] Glass form card with input fields
- [ ] Primary button is amber colored
- [ ] "Sign Up"/"Sign In" links are amber
- [ ] Biometric button (if enabled) has amber icon

#### Transactions Screen
- [ ] "TRANSACTIONS" title uppercase
- [ ] "+ Add" button is amber
- [ ] Filter buttons (All, Income, Expenses) use GlassButton
- [ ] Category filter chips use GlassButton
- [ ] Transaction list items have glass backgrounds
- [ ] Search bar has glass background

#### Budgets Screen
- [ ] "BUDGETS" title uppercase
- [ ] Summary card shows "TOTAL BUDGET" in uppercase
- [ ] Each budget card uses GlassCard
- [ ] Progress bars are amber colored
- [ ] Period badges (monthly/weekly) have amber background
- [ ] Delete buttons use GlassButton

#### Accounts Screen
- [ ] "ACCOUNTS" title uppercase
- [ ] Account cards use GlassCard
- [ ] Account balances clearly visible
- [ ] "+Add Account" button is amber

#### Investments Screen
- [ ] Glass cards for investment items
- [ ] Amber accents on gains/positive values
- [ ] Portfolio summary visible

#### Groups Screen
- [ ] Group cards use GlassCard
- [ ] Group icons/avatars visible
- [ ] Member counts displayed

#### Categories Screen
- [ ] Category cards with emoji icons
- [ ] Glass card backgrounds
- [ ] Amber edit/delete actions

#### Recurring Screen
- [ ] Recurring transaction cards
- [ ] Frequency badges visible
- [ ] Glass card backgrounds

### Test Each Screen - Dark Mode
Repeat all above checks with dark mode enabled. Verify:
- [ ] Background gradients are darker
- [ ] Text is lighter and readable
- [ ] Glass effects adapt to dark theme
- [ ] Primary amber color still visible
- [ ] No white backgrounds visible
- [ ] Icons and emojis still visible

---

## 🔤 TYPOGRAPHY TESTING

For each screen, verify:
- [ ] Page titles are 32px with 900 font weight
- [ ] Page titles have tight letter spacing (-0.5)
- [ ] Section titles are 12px, bold, UPPERCASE
- [ ] Section titles have wide letter spacing (0.5)
- [ ] Body text is 16px with 500 weight
- [ ] All text is readable in both modes

---

## 📐 LAYOUT TESTING

### Border Radius
- [ ] Cards have 20px border radius (rounded corners)
- [ ] Buttons have 16px border radius
- [ ] Input fields have 16px border radius

### Shadows
- [ ] Cards have subtle shadows (not too dark)
- [ ] Shadows are lighter than before (0.08 opacity)
- [ ] Primary buttons have amber-tinted shadow

### Spacing
- [ ] Consistent padding inside cards (20px)
- [ ] Proper gaps between list items
- [ ] Safe area insets respected (no content under notch)

---

## ✨ GLASS EFFECTS TESTING

### iOS Testing (if available)
- [ ] Cards have visible blur effect
- [ ] Can see content behind cards slightly
- [ ] Blur intensity is appropriate (not too strong)
- [ ] Tab bar has glass effect

### Android Testing
- [ ] Cards have semi-transparent background
- [ ] Fallback looks good without blur
- [ ] Performance is smooth

---

## 🎯 COMPONENT TESTING

### GlassCard Component
- [ ] Used throughout all screens
- [ ] Accepts `isDark` prop correctly
- [ ] Padding prop works (16, 20, 24, etc.)
- [ ] Border radius is 20px
- [ ] Shadows visible

### GlassButton Component
- [ ] Primary variant is amber
- [ ] Outline variant has amber border
- [ ] Glass variant has transparent background
- [ ] Disabled state visible
- [ ] Loading state works
- [ ] Press animations smooth

### Input Component
- [ ] Glass background on focus
- [ ] Border changes on focus (amber)
- [ ] Placeholder text visible
- [ ] Works in both modes

---

## 🐛 COMMON ISSUES TO CHECK

### Text Visibility
- [ ] No white text on light backgrounds
- [ ] No dark text on dark backgrounds
- [ ] All labels are readable
- [ ] Icons/emojis not too large or small

### Color Consistency
- [ ] No green colors remaining (should be amber)
- [ ] Primary color is #fbbf24 (amber)
- [ ] All accents use amber
- [ ] Progress bars are amber

### Layout Issues
- [ ] No content cutoff at edges
- [ ] ScrollViews scroll properly
- [ ] No overlapping elements
- [ ] Modal/overlay positioning correct

### Performance
- [ ] Smooth scrolling
- [ ] No lag when switching modes
- [ ] Animations are fluid
- [ ] No memory leaks

---

## 📱 DEVICE TESTING

### iPhone (iOS)
- [ ] iPhone 14/15 (6.1")
- [ ] iPhone 14/15 Plus (6.7")
- [ ] iPhone SE (4.7")
- [ ] iPad (if supported)

### Android
- [ ] Pixel 7/8
- [ ] Samsung Galaxy
- [ ] Different screen sizes
- [ ] Different Android versions

---

## ✅ FINAL CHECKS

### Code Quality
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No warnings in build
- [ ] Imports resolve correctly

### Functionality
- [ ] All buttons work
- [ ] All navigation works
- [ ] Forms submit correctly
- [ ] Data loads properly

### Documentation
- [ ] README updated
- [ ] Design system docs complete
- [ ] Migration guide available
- [ ] Screenshots updated

---

## 🎊 SIGN OFF

Once all checks pass:
- [ ] Light mode fully tested
- [ ] Dark mode fully tested
- [ ] All 11 screens verified
- [ ] iOS tested (if available)
- [ ] Android tested
- [ ] No critical bugs
- [ ] Ready for production!

---

## 📝 Notes

Use this section to document any issues found during testing:

```
Issue:
Screen:
Severity:
Status:

Issue:
Screen:
Severity:
Status:
```

---

**Testing completed by**: ___________________
**Date**: ___________________
**Status**: ✅ APPROVED / ⚠️ NEEDS FIXES
