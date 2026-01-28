# Mobile App - Transaction Rules Implementation Guide

## Overview
This document outlines the implementation plan for adding Transaction Rules management to the DollarDollar mobile app (React Native/Expo).

## What's Already Complete (Backend & Web UI)

### ✅ Backend API (100% Complete)
All endpoints are ready and tested:

- `GET /api/v1/transaction-rules` - List all rules
- `POST /api/v1/transaction-rules` - Create new rule
- `GET /api/v1/transaction-rules/:id` - Get specific rule
- `PUT /api/v1/transaction-rules/:id` - Update rule
- `DELETE /api/v1/transaction-rules/:id` - Delete rule
- `POST /api/v1/transaction-rules/bulk-apply` - Apply rules to existing transactions
- `POST /api/v1/transaction-rules/test` - Test a rule
- `POST /api/v1/transaction-rules/suggest` - Get rule suggestion from transaction edit
- `GET /api/v1/transaction-rules/stats` - Get rule statistics

### ✅ Web UI (100% Complete)
Located in: `dollardollar-web/src/components/TransactionRules.tsx`

Features implemented:
- Full CRUD for rules
- Statistics dashboard showing total rules, active rules, and total matches
- Bulk apply to all existing transactions
- Advanced matching criteria (amount ranges, transaction type filters)
- Toast notifications for rule suggestions when editing transactions
- System/default rules display
- Beautiful dark gradient UI matching the app's style

### ✅ Features Already Working
- **Auto-categorization**: New transactions are automatically categorized based on active rules
- **Rule Engine**: Priority-based matching system
- **Default Rules**: 100+ pre-configured rules loaded on user registration
- **Default Categories**: 18 main categories with 100+ subcategories
- **Smart Suggestions**: When a user manually changes a transaction's category, the system suggests creating a rule

## What Needs to Be Implemented (Mobile App)

### 1. API Service Layer
**File**: `dollardollar-mobile/services/api/transactionRules.ts` (new file)

```typescript
import { api } from './api';

export interface TransactionRule {
  id: number;
  name: string;
  pattern: string;
  pattern_field: string;
  is_regex: boolean;
  case_sensitive: boolean;
  amount_min?: number;
  amount_max?: number;
  transaction_type_filter?: 'expense' | 'income' | 'transfer';
  auto_category_id?: number;
  auto_category?: string;
  auto_account_id?: number;
  auto_account?: string;
  auto_transaction_type?: 'expense' | 'income' | 'transfer';
  auto_tags?: string[];
  auto_notes?: string;
  priority: number;
  active: boolean;
  match_count: number;
  last_matched?: string;
  created_at: string;
  updated_at: string;
  is_system?: boolean;
}

export const transactionRulesApi = {
  getAll: async () => { /* ... */ },
  get: async (id: number) => { /* ... */ },
  create: async (data: CreateRuleData) => { /* ... */ },
  update: async (id: number, data: Partial<CreateRuleData>) => { /* ... */ },
  delete: async (id: number) => { /* ... */ },
  bulkApply: async (ruleIds?: number[]) => { /* ... */ },
  test: async (ruleData: any, testTransaction: any) => { /* ... */ },
  getSuggestion: async (transactionId: number, newCategoryId: number) => { /* ... */ },
  getStats: async () => { /* ... */ },
};
```

### 2. Settings Page - Add Rules Tab
**File**: `dollardollar-mobile/app/(tabs)/settings.tsx`

Add a new tab/section for "Transaction Rules" in the settings screen.

UI Layout:
```
┌─────────────────────────────────┐
│ Settings                        │
├─────────────────────────────────┤
│ • Profile                       │
│ • Preferences                   │
│ • Transaction Rules        ← NEW│
│ • Security                      │
│ • About                         │
└─────────────────────────────────┘
```

When user taps "Transaction Rules", navigate to:

### 3. Rules List Screen
**File**: `dollardollar-mobile/app/rules/index.tsx` (new file)

Features to implement:

#### A. Header Section
- Title: "Transaction Rules" with ⚡ icon
- Subtitle: "Automatically categorize and organize transactions"
- "Add Rule" button (top right)
- "Apply to All Transactions" button (important!)

#### B. Stats Dashboard (3 cards)
```
┌──────────┬──────────┬──────────┐
│ Total    │ Active   │ Matches  │
│ Rules    │ Rules    │ Total    │
│   150    │   142    │  1,234   │
└──────────┴──────────┴──────────┘
```

#### C. Rules List
Each rule card should display:
- Rule name
- Active/Inactive badge
- Pattern (with regex/case sensitivity indicators)
- Auto-actions (category, account, type)
- Match count and last matched date
- Priority
- "Default Rule" badge for system rules
- Toggle active/inactive button
- Edit button
- Delete button

Styling: Use dark gradient cards matching the existing app style

#### D. Empty State
When no rules exist:
```
⚡ (large icon)
No rules yet
Create your first rule to automatically
organize transactions
```

### 4. Add/Edit Rule Screen
**File**: `dollardollar-mobile/app/rules/[id].tsx` (new file)

Form sections:

#### A. Basic Information
- Rule name (required)
- Pattern to match (required)
- Match field dropdown (description/amount)
- Use Regular Expression (toggle)
- Case Sensitive (toggle)

#### B. Advanced Matching
- Minimum amount (optional number input)
- Maximum amount (optional number input)
- Transaction type filter (dropdown: All/Expense/Income/Transfer)

#### C. Actions to Apply
- Auto-assign category (dropdown)
- Auto-assign account (dropdown)
- Auto-assign type (dropdown: Expense/Income/Transfer)
- Priority (number input, default: 50)
- Rule is active (toggle, default: true)

#### D. Buttons
- Cancel (bottom left)
- Save/Create (bottom right, green gradient)

### 5. Transaction Edit Screen Updates
**File**: `dollardollar-mobile/app/(tabs)/transactions.tsx`

When a user edits a transaction and changes the category:

1. After successful update, call `transactionRulesApi.getSuggestion(transactionId, newCategoryId)`
2. If a suggestion is returned, show a toast notification:
   ```
   📋 Rule Suggestion
   Create a rule to auto-categorize similar
   transactions?
   [Dismiss] [Create Rule]
   ```
3. If user taps "Create Rule", navigate to the add rule screen with pre-filled data

### 6. Toast Notification System
Check if the mobile app already has a toast system (similar to web's ToastContext).

If not, implement or integrate one:
- React Native Toast Message (popular library)
- Or custom toast component

### 7. Bulk Apply Confirmation Modal
When user taps "Apply to All Transactions":

```
⚠️ Apply Rules to Existing Transactions?

This will apply all active rules to your
existing transactions. This may update
categories for many transactions.

This action cannot be undone.

[Cancel]  [Apply Rules]
```

After applying:
```
✅ Success!
Applied rules to 234 of 1,000 transactions

[OK]
```

## Implementation Steps

### Phase 1: API Integration (30 minutes)
1. Create `dollardollar-mobile/services/api/transactionRules.ts`
2. Copy types and API functions from web version
3. Test all endpoints

### Phase 2: Rules List Screen (1-2 hours)
1. Create `dollardollar-mobile/app/rules/index.tsx`
2. Implement stats dashboard
3. Implement rules list with cards
4. Add empty state
5. Wire up navigation from settings

### Phase 3: Add/Edit Rule Screen (1-2 hours)
1. Create `dollardollar-mobile/app/rules/[id].tsx`
2. Implement all form sections
3. Add validation
4. Wire up create/update API calls

### Phase 4: Transaction Edit Integration (30 minutes)
1. Update transaction edit to call suggestion API
2. Implement toast notification for suggestions
3. Add navigation to create rule from suggestion

### Phase 5: Polish & Testing (30 minutes)
1. Add loading states
2. Add error handling
3. Test all flows
4. Match styling to existing app

## Design Notes

### Colors & Styling
Match the existing dark gradient theme:
- Background: `linear-gradient(to bottom, #0f172a, #1e293b)`
- Card background: `rgba(17, 24, 39, 0.6)` with backdrop blur
- Primary green: `#15803d` to `#166534` gradient
- Warning/Apply yellow: `#fbbf24` to `#f59e0b` gradient
- Success green: `#86efac`
- Error red: `#ef4444`
- Text primary: `white`
- Text secondary: `#94a3b8`

### Icons
Use consistent icons (Expo icons or similar):
- ⚡ Zap - Rules
- ➕ Plus - Add
- ✏️ Edit - Edit
- 🗑️ Trash - Delete
- 🔄 Refresh - Apply
- 📊 BarChart - Stats
- ✅ Check - Success
- ❌ X - Error

### Mobile-Specific Considerations
1. **Touch Targets**: Ensure buttons are at least 44x44 points
2. **Swipe Actions**: Consider adding swipe-to-delete on rule list items
3. **Pull to Refresh**: Add on rules list screen
4. **Keyboard Handling**: Ensure form scrolls when keyboard appears
5. **Loading States**: Show skeletons while loading
6. **Offline Support**: Cache rules list for offline viewing

## Testing Checklist

- [ ] View all rules
- [ ] Create new rule with basic matching
- [ ] Create rule with advanced matching (amount range, type filter)
- [ ] Edit existing rule
- [ ] Delete rule
- [ ] Toggle rule active/inactive
- [ ] Apply all rules to existing transactions
- [ ] Edit transaction category and see suggestion toast
- [ ] Create rule from suggestion
- [ ] View stats dashboard
- [ ] Test with 0 rules (empty state)
- [ ] Test with system/default rules
- [ ] Test form validation
- [ ] Test error states
- [ ] Test loading states

## API Reference Quick Guide

### Creating a Rule
```typescript
await transactionRulesApi.create({
  name: 'Netflix Auto-Categorize',
  pattern: 'netflix',
  pattern_field: 'description',
  is_regex: false,
  case_sensitive: false,
  amount_min: undefined,
  amount_max: undefined,
  transaction_type_filter: undefined,
  auto_category_id: 123,
  auto_account_id: undefined,
  auto_transaction_type: undefined,
  priority: 50,
  active: true
});
```

### Getting Rule Suggestion
```typescript
const suggestion = await transactionRulesApi.getSuggestion(
  transactionId,
  newCategoryId
);

if (suggestion.success && suggestion.suggestion) {
  // Show toast with suggestion
  // suggestion.suggestion contains pre-filled rule data
}
```

### Bulk Apply
```typescript
const result = await transactionRulesApi.bulkApply();
// result: { success: true, transactions_processed: 1000, transactions_updated: 234 }
```

## Reference Implementation

The complete web implementation is in:
- `dollardollar-web/src/components/TransactionRules.tsx`
- `dollardollar-web/src/services/api/transactionRules.ts`
- `dollardollar-web/src/components/forms/EditTransactionModal.tsx` (for suggestion toast)

You can reference these files for exact API calls, data structures, and UI patterns.

## Questions?

If you encounter any issues:
1. Check the backend API directly using the Swagger docs at `/api/v1/docs`
2. Reference the web implementation
3. Check the backend rule engine at `dollardollar/src/utils/rule_engine.py`
4. Check default rules at `dollardollar/src/data/default_rules.py`

---

**Ready to implement!** All backend infrastructure is complete. The mobile app just needs the UI screens and API integration.
