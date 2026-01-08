# Event Creation Integration Test

Yeh script backend aur frontend ke beech event creation ki integration ko test karti hai.

## Prerequisites

1. **Backend API running**: `http://localhost:3434`
2. **Valid Organizer Token**: Organizer login karke token lein
3. **Event Category**: Database mein kam se kam ek event category honi chahiye

## Setup

1. Test script ko configure karein:

```javascript
// test-event-creation.js file mein yeh values set karein:
const TEST_CONFIG = {
    ORGANIZER_TOKEN: 'your-organizer-token-here', // Browser cookies se ya login response se
    EVENT_CATEGORY_ID: '', // Optional - agar empty hai to pehli available category use hogi
};
```

## Organizer Token Kaise Lein

### Method 1: Browser Developer Tools
1. Browser mein organizer account se login karein
2. Developer Tools open karein (F12)
3. Application/Storage tab mein jayein
4. Cookies mein `Zuroona` cookie ka value copy karein

### Method 2: Login API Response
1. Organizer login API call karein
2. Response mein token copy karein

## Test Script Run Karein

```bash
# API folder mein jayein
cd api

# Dependencies install karein (agar nahi hain)
npm install axios

# Test script run karein
node ../test-event-creation.js
```

## Tests Kya Karti Hain

### Test 1: Event Categories Fetch
- Event categories ko fetch karti hai
- Verify karti hai ke categories available hain

### Test 2: Join Event Creation (event_type: 1)
- Frontend se bheje gaye payload structure ko simulate karti hai
- `AddEditJoinEventModal.jsx` ke payload structure ko match karti hai
- Event create karke verify karti hai

### Test 3: Welcome Event Creation (event_type: 2)
- Frontend se bheje gaye payload structure ko simulate karti hai
- `AddEditWelcomeEventModal.jsx` ke payload structure ko match karti hai
- Event create karke verify karti hai

### Test 4: Event Verification
- Created events ko verify karti hai
- Event details check karti hai

### Test 5: Validation Tests
- Missing required fields ke liye validation test
- Invalid data ke liye validation test
- Error handling verify karti hai

## Expected Results

Agar sab kuch theek hai, to aapko yeh dikhega:

```
✓ Join Event created successfully!
✓ Welcome Event created successfully!
✓ All validation tests passed
✓ Event creation is working smoothly! 🎉
```

## Common Issues

### Issue: "ORGANIZER_TOKEN is not set"
**Solution**: Test script mein `TEST_CONFIG.ORGANIZER_TOKEN` set karein

### Issue: "No event categories found"
**Solution**: Database mein event categories add karein ya admin panel se category create karein

### Issue: "Event creation failed"
**Solution**: 
- Token valid hai ya nahi check karein
- Backend API running hai ya nahi check karein
- Console logs check karein for detailed error

### Issue: "Invalid event category"
**Solution**: Valid category ID use karein

## Payload Structure Comparison

### Frontend (AddEditJoinEventModal.jsx)
```javascript
{
    event_date: "2024-12-31",
    event_start_time: "10:00",
    event_end_time: "14:00",
    event_name: "Event Name",
    event_images: ["url1", "url2"],
    event_description: "Description",
    event_address: "Address",
    event_type: 1, // Join Event
    event_for: 3, // All genders
    event_category: "category-id-string", // Single string
    no_of_attendees: 20,
    event_price: 50.00,
    dos_instruction: "Dos",
    do_not_instruction: "Don'ts",
    latitude: 24.7136,
    longitude: 46.6753,
    area_name: "Area Name"
}
```

### Frontend (AddEditWelcomeEventModal.jsx)
```javascript
{
    // Same as above but:
    event_type: 2, // Welcome Event
    event_category: ["category-id"], // Array format
}
```

### Backend Expectations
- `event_category`: String ya Array dono accept karta hai
- `event_images`: Array, min 1, max 5 images
- `event_date`: Date format (YYYY-MM-DD ya ISO string)
- `latitude`/`longitude`: Optional, but agar hain to dono required

## Integration Status

✅ **Fixed Issues:**
- Validation max images: 6 se 5 par fix kiya (model aur frontend ke saath match)
- Backend accepts both string and array for event_category
- Frontend payload structure backend ke saath compatible hai

✅ **Verified:**
- Join Event creation (event_type: 1)
- Welcome Event creation (event_type: 2)
- Validation errors properly handled
- Event verification working

## Next Steps

1. Test script run karein
2. Agar koi error aaye to fix karein
3. Real events create karke manually test karein
4. Production deploy se pehle final verification karein

