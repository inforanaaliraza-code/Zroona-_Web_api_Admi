# Google Maps API Setup Guide - Step by Step (Urdu Roman)

## Google Cloud Console mein API Key banane ke Steps:

### Step 1: Google Cloud Console kholo
1. Browser mein jao: https://console.cloud.google.com/
2. Google account se login karo

### Step 2: Project banao ya select karo
1. Top bar mein **Project dropdown** par click karo
2. **"New Project"** click karo
3. Project name do (jaise: "Zuroona Maps")
4. **"Create"** button click karo
5. Project select karo

### Step 3: Billing Enable karo (Important!)
1. Left sidebar mein **"Billing"** click karo
2. **"Link a billing account"** click karo
3. Credit card details add karo
4. **Note:** Google Maps free tier mein $200/month credit deta hai

### Step 4: APIs Enable karo
1. Left sidebar mein **"APIs & Services"** → **"Library"** click karo
2. Search box mein neeche diye gaye APIs search karo aur **Enable** karo:

   **a) Maps JavaScript API**
   - Search: "Maps JavaScript API"
   - Click karo
   - **"Enable"** button click karo

   **b) Places API**
   - Search: "Places API"
   - Click karo
   - **"Enable"** button click karo

   **c) Geocoding API**
   - Search: "Geocoding API"
   - Click karo
   - **"Enable"** button click karo

### Step 5: API Key banao
1. Left sidebar mein **"APIs & Services"** → **"Credentials"** click karo
2. Top mein **"+ CREATE CREDENTIALS"** button click karo
3. **"API key"** select karo
4. API key ban jayegi (copy kar lo)

### Step 6: API Key Restrictions set karo (Security ke liye)
1. Bani hui API key par click karo
2. **"Application restrictions"** section mein:
   - **"HTTP referrers (web sites)"** select karo
   - **"Add an item"** click karo
   - Add karo:
     ```
     localhost:3000/*
     yourdomain.com/*
        *.yourdomain.com/*
        ```
    3. **"API restrictions"** section mein:
    - **"Restrict key"** select karo
    - Select karo:
        - ✅ Maps JavaScript API
        - ✅ Places API
        - ✅ Geocoding API
    4. **"Save"** button click karo

### Step 7: Code mein API Key add karo

**Option 1: Environment Variable (Recommended - Behtar tareeqa)**
1. `web/.env.local` file banao:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

2. Code mein use karo:
   ```javascript
   const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
   ```

**Option 2: Direct (Jaldi lekin kam secure)**
- File: `web/src/components/Modal/AddEditJoinEventModal.jsx`
- Line 42 mein replace karo:
  ```javascript
  const GOOGLE_MAPS_API_KEY = "YOUR_NEW_API_KEY_HERE";
  ```

## Required APIs List (Zaroori APIs):
✅ **Maps JavaScript API** - Map display ke liye
✅ **Places API** - Address autocomplete ke liye  
✅ **Geocoding API** - Address ko coordinates mein convert karne ke liye

## Quick Checklist (Jaldi checklist):
- [ ] Google Cloud Console mein project bana
- [ ] Billing enable kiya
- [ ] 3 APIs enable ki (Maps JavaScript, Places, Geocoding)
- [ ] API key banai
- [ ] API key restrictions set ki
- [ ] Code mein API key add ki

## Important Notes (Zaroori notes):
⚠️ **API Key ko public repository mein commit mat karo**
⚠️ **Restrictions zaroor set karo security ke liye**
⚠️ **Billing limit set karo** (Settings → Billing → Budget alerts)

## Testing (Test karna):
1. Local server restart karo
2. Event create page kholo
3. Location section mein map load hona chahiye
4. Address search kaam karna chahiye
5. Map par click karke location select kar sakte hain

## Features jo kaam karenge:
✅ **Address Search** - Autocomplete se address search
✅ **Manual Location** - Map par click karke location select
✅ **Auto Location** - "Get Current Location" button se apni location
✅ **Draggable Marker** - Marker ko drag karke exact location set karo

## Agar Error aaye to:
1. Browser console check karo (F12)
2. API key sahi hai ya nahi verify karo
3. APIs enable hain ya nahi check karo
4. Billing account linked hai ya nahi verify karo
5. Restrictions sahi set hain ya nahi check karo

## Common Errors aur Solutions:

**Error: "This page didn't load Google Maps correctly"**
- Solution: API key check karo, Maps JavaScript API enable hai ya nahi

**Error: "Places API not enabled"**
- Solution: Places API enable karo Google Cloud Console mein

**Error: "Billing not enabled"**
- Solution: Billing account link karo

**Error: "API key restrictions"**
- Solution: HTTP referrers mein apni domain add karo
