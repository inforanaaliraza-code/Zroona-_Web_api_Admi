# Reviews System Flow Analysis

## Overview
System mein 2 types ke reviews hain:
1. **Event Reviews** - User events ko review karta hai
2. **Host Reviews** - User/Host ek doosre ko review karte hain

---

## 1. EVENT REVIEWS TAB

### Endpoint:
```
    GET /user/event/review/my-reviews
```

### Purpose:
User ne jo **events ko reviews diye hain**, wo dikhata hai.

### API Controller:
- File: `api/src/controllers/userController.js`
- Function: `myEventReviews` (line 3220)
- Database: `reviews` collection
- Returns: User ke event reviews with event details aur organizer info

### Kab Review Diya Jata Hai:
1. **Location**: Event detail page (`/events/[id]`)
2. **Component**: `ReviewSection.jsx` mein "Add Review" button
3. **Modal**: `AddReviewModal.jsx` open hota hai
4. **When**: User event attend karne ke baad review de sakta hai

### Review Submit Endpoint:
```
POST /user/event/review/add
```
**Payload:**
```json
{
  "event_id": "event_id_here",
  "rating": 1-5,
  "description": "review text"
}
```

### Data Structure:
- Collection: `reviews`
- Fields: `user_id`, `event_id`, `rating`, `description`, `createdAt`

---

## 2. HOST REVIEWS TAB

### Endpoint:
```
GET /user-reviews/my-reviews
```

### Purpose:
User ne jo **hosts/organizers ko reviews diye hain** (ya hosts ne users ko), wo dikhata hai.

### API Controller:
- File: `api/src/controllers/userReviewController.js`
- Function: `getMyReviews` (line 293)
- Database: `user_reviews` collection
- Returns: Reviews where current user is the reviewer

### Kab Review Diya Jata Hai:

#### Scenario 1: User Host Ko Review Karta Hai
- **Location**: Host profile page ya booking detail page
- **When**: Booking complete hone ke baad

#### Scenario 2: Host User Ko Review Karta Hai
- **Location**: Organizer's booking management page
- **Component**: `AttendeeReviewModal.jsx`
- **When**: Host attendee ko review de sakta hai
- **Endpoint**: `POST /user-reviews`
- **Payload:**
```json
{
  "reviewed_id": "user_id",
  "reviewed_type": "User",
  "rating": 1-5,
  "description": "review text"
}
```

### Review Submit Endpoint:
```
POST /user-reviews
```
**Payload:**
```json
{
  "reviewed_id": "user_or_organizer_id",
  "reviewed_type": "User" | "Organizer",
  "rating": 1-5,
  "description": "review text"
}
```

### Data Structure:
- Collection: `user_reviews`
- Fields: 
  - `reviewer_id` - Jo review de raha hai
  - `reviewer_type` - "User" ya "Organizer"
  - `reviewed_id` - Jisko review diya ja raha hai
  - `reviewed_type` - "User" ya "Organizer"
  - `rating`, `description`, `createdAt`

---

## Key Differences:

| Feature | Event Reviews | Host Reviews |
|---------|--------------|--------------|
| **Collection** | `reviews` | `user_reviews` |
| **What** | Events ko reviews | Users/Hosts ko reviews |
| **Endpoint** | `/user/event/review/my-reviews` | `/user-reviews/my-reviews` |
| **Submit** | `/user/event/review/add` | `/user-reviews` |
| **Where Given** | Event detail page | Host profile / Booking pages |

---

## Current Status Check:

### Event Reviews:
✅ Endpoint exists: `myEventReviews` in userController
✅ Frontend calls: `/user/event/review/my-reviews`
✅ Submit endpoint: `/user/event/review/add`
✅ Modal exists: `AddReviewModal.jsx`

### Host Reviews:
✅ Endpoint exists: `getMyReviews` in userReviewController
✅ Frontend calls: `/user-reviews/my-reviews`
✅ Submit endpoint: `/user-reviews`
✅ Modal exists: `AttendeeReviewModal.jsx` (for hosts reviewing users)

---

## Potential Issues:

1. **Host Reviews Tab** mein sirf reviews dikh rahe hain jo **current user ne diye hain**
   - Agar user ko host ne review diya hai, wo is tab mein nahi dikhega
   - Wo tab mein dikhega jahan user ki profile show hoti hai

2. **Data Structure Mismatch:**
   - Event reviews: `reviews` collection use karta hai
   - Host reviews: `user_reviews` collection use karta hai
   - Dono alag collections hain, isliye alag endpoints hain

3. **Review Submission:**
   - Event reviews: Direct event_id ke saath
   - Host reviews: reviewed_id + reviewed_type ke saath

---

## Recommendations:

1. ✅ Both endpoints working hain
2. ✅ Data properly fetch ho raha hai
3. ⚠️ Frontend mein check karo ke data properly display ho raha hai
4. ⚠️ Host reviews tab mein clarify karo ke ye sirf "Reviews I Gave" hain, not "Reviews I Received"
