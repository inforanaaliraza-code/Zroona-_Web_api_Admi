# Google Maps Setup – Zuroona (Local + Live)

Yeh guide **Google Maps API key** lene, **Google Cloud Console** mein sahi settings, aur **website (local + live)** par kaam karwane ke liye hai. Koi step skip mat karo.

---

## 1. Google Cloud Console – API Key lena

### 1.1 Account / Project open karo

1. Browser mein jao: **https://console.cloud.google.com/**
2. Google account se login karo (wohi account use karo jismein billing ya project manage karna hai).
3. **Top-left** par project dropdown (e.g. "My First Project") par click karo.
4. **"New Project"** se naya project banao (e.g. name: `Zuroona`) ya existing project select karo.
5. Project select karke **"Open"** / **"Select"** karo.

### 1.2 Billing enable karo (zaroori)

- Google Maps APIs **free tier** dete hain, lekin **billing account link** hona zaroori hai.
1. Left menu: **Billing** → **Link a billing account**.
2. Agar pehle se billing account hai to use karo, warna **Create account** se naya banao (card details daalne pad sakte hain).
3. Is project ko us billing account se link karo.

### 1.3 APIs enable karo

Project select rehna chahiye. Phir ye APIs enable karo:

1. Left menu: **APIs & Services** → **Library** (ya direct: https://console.cloud.google.com/apis/library ).
2. Search karke **ye 3 APIs** enable karo (har ek par click → **Enable**):
   - **Maps JavaScript API** – map render, markers, `@react-google-maps/api`.
   - **Places API** – address autocomplete (create event, join event, location forms).
   - **Geocoding API** – address ↔ lat/lng (optional lekin recommended).

### 1.4 API Key banana

1. Left menu: **APIs & Services** → **Credentials** (ya: https://console.cloud.google.com/apis/credentials ).
2. **+ Create Credentials** → **API key**.
3. Key create ho jayegi; copy karke safe jagah save karo (abhi isi key ko project mein use karenge).

---

## 2. API Key Restrictions (Security – zaroor karo)

Key ko **restrict** karo taake sirf tumhari website (local + live) use kare.

1. **Credentials** page par apni **API key** par click karo (edit).
2. **Application restrictions**:
   - **"HTTP referrers (websites)"** select karo.
   - **"Add an item"** se ye **referrers** add karo (exact format):

| Referrer | Kab use hoga |
|----------|----------------|
| `http://localhost:3000/*` | Local dev (Next.js default port) |
| `http://localhost:*/*` | Agar aap alag port use karte ho (e.g. 3001) |
| `https://zuroona.sa/*` | Live website |
| `https://www.zuroona.sa/*` | Live www |
| `https://*.zuroona.sa/*` | Subdomains agar future mein use karo |

- **Note:** `api.zuroona.sa` par frontend map nahi chalta; map sirf **zuroona.sa** (website) par chalta hai. API domain ko referrer mein add karne ki zaroorat nahi agar wahan map load nahi ho raha.

3. **API restrictions**:
   - **"Restrict key"** select karo.
   - Sirf ye APIs select karo:
     - **Maps JavaScript API**
     - **Places API**
     - **Geocoding API**
4. **Save** karo.

---

## 3. Project mein kahan kya lagana hai

### 3.1 Local (development)

- File: **`web/.env.local`**
- Isme ye variable hona chahiye (value apni actual API key):

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_GOOGLE_MAPS_API_KEY
```

- **Important:** `NEXT_PUBLIC_` prefix zaroori hai taake Next.js isko browser (client) tak expose kare; bina iske map load nahi hoga.
- `.env.local` ko **git mein commit mat karo** (already `.gitignore` mein hona chahiye).

### 3.2 Live / Production (zuroona.sa)

- Jahan bhi production deploy karte ho (e.g. **Vercel**, **Netlify**, **Docker env**, server env):
  - Wahan **Environment Variables** section mein same variable add karo:
  - **Name:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - **Value:** wahi API key jo Google Cloud se banayi thi.
- Deploy ke baad **rebuild** zaroor karo taake nayi env value bundle mein aa jaye (Next.js build time par `NEXT_PUBLIC_*` inject hota hai).

### 3.3 Website par kahan use ho raha hai (code reference)

| Location | Use |
|----------|-----|
| `src/app/(organizer)/create-event/page.js` | Create event – map, marker, Places autocomplete |
| `src/components/Modal/AddEditJoinEventModal.jsx` | Join event – map, Places autocomplete |
| `src/components/InterviewQ/GroupLocationForm.jsx` | Interview Q – address autocomplete |
| `src/components/EditProfile/InterviewQ.jsx` | Edit profile – address autocomplete |
| `src/components/EditProfile/GroupLocationForm.jsx` | Edit profile – group location |
| `src/components/Details/LocationMap.jsx` | Event detail – embed map (iframe, no API key in URL) |

In sab jagah **sirf** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` read hoti hai; kahi aur alag variable add karne ki zaroorat nahi.

---

## 4. Local check

1. `web/.env.local` mein `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set karo.
2. Dev server: `npm run dev` (default: http://localhost:3000 ).
3. Ye pages khol ke map/autocomplete check karo:
   - Create event (organizer) – map + address search.
   - Join event modal – map + address.
   - Event detail – location map (iframe).
4. Browser console mein agar **"This page can't load Google Maps correctly"** ya **referrer restriction** error aaye to **Credentials** → API key → HTTP referrers mein `http://localhost:3000/*` aur `http://localhost:*/*` add karke save karo.

---

## 5. Live domain check (zuroona.sa)

1. Production env mein `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set karo (section 3.2).
2. Redeploy karo (rebuild zaroori hai).
3. https://zuroona.sa (aur https://www.zuroona.sa agar use ho) open karke wahi pages test karo (create event, join event, event detail).
4. Agar map load nahi hota:
   - **HTTP referrers** mein `https://zuroona.sa/*` aur `https://www.zuroona.sa/*` add karo.
   - **API restrictions** mein Maps JavaScript, Places, Geocoding enable honi chahiye.
   - Browser console (F12) mein error message dekh kar referrer / API name fix karo.

---

## 6. Checklist – koi minor missing na rahe

- [ ] Google Cloud project select / create.
- [ ] Billing account project se linked.
- [ ] **Maps JavaScript API**, **Places API**, **Geocoding API** enable.
- [ ] API key create ki aur copy ki.
- [ ] API key par **HTTP referrers** set: `localhost` + `https://zuroona.sa/*`, `https://www.zuroona.sa/*`.
- [ ] API key par **API restrictions** set: sirf Maps JavaScript, Places, Geocoding.
- [ ] `web/.env.local` mein `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...` (local).
- [ ] Production env (Vercel/Netlify/server) mein `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set.
- [ ] Production deploy ke baad rebuild kiya.
- [ ] Local (localhost) par map + autocomplete test.
- [ ] Live (zuroona.sa) par map + autocomplete test.

---

## 7. Links (official)

- Google Cloud Console: https://console.cloud.google.com/
- APIs Library: https://console.cloud.google.com/apis/library
- Credentials: https://console.cloud.google.com/apis/credentials
- Maps JavaScript API doc: https://developers.google.com/maps/documentation/javascript
- Billing: https://console.cloud.google.com/billing

---

**Note:** `api.zuroona.sa` backend API ke liye hai; Google Maps sirf **frontend (web app)** par use hota hai, isliye key ko sirf **zuroona.sa** (aur localhost) referrers se restrict karna kaafi hai.
