# 🚀 Admin Panel Translation Setup

## ⚠️ IMPORTANT: Install Required Packages

Before running the Admin panel, you must install the new i18n packages.

### Installation Steps:

```bash
cd Admin
npm install
```

This will install:
- `i18next` - Core internationalization library
- `i18next-browser-languagedetector` - Automatic language detection
- `react-i18next` - React bindings for i18next

### What's New:

✅ **Complete Bilingual Support**
- English (Default)
- Arabic (with RTL support)

✅ **Language Switcher**
- Located in the header (next to notifications)
- Click to switch between English and Arabic
- Saves preference to localStorage

✅ **All Screens Translated**
- Dashboard
- Events Management
- Organizers Management
- Users Management
- Wallet
- Withdrawal Requests
- CMS
- Settings
- Authentication

### Usage:

```jsx
// In any component
import { useTranslation } from "react-i18next";

function MyComponent() {
    const { t, i18n } = useTranslation();
    
    return (
        <div>
            <h1>{t("events.manageEvents")}</h1>
            <p>{t("events.eventDetails")}</p>
        </div>
    );
}
```

### Translation Files:

- **English:** `Admin/src/i18n/locales/en/translation.json`
- **Arabic:** `Admin/src/i18n/locales/ar/translation.json`

### Testing:

1. Start the admin panel: `npm run dev`
2. Click the globe icon in the header
3. Select Arabic (العربية) or English
4. Verify all text changes to the selected language

---

**Status:** ✅ Ready to use after `npm install`

