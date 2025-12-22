# API Endpoints - Quick Reference

**Base URL:** `http://localhost:3434/api/`  
**Auth Header:** `Authorization: Bearer <token>`  
**Lang Header:** `lang: en` or `lang: ar`

---

## 👤 GUEST (User) Endpoints

### Authentication
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/register` | ❌ | `email, password, first_name, last_name, phone_number, country_code` | `{token, user}` |
| POST | `/login` | ❌ | `email, password` | `{token, user}` |
| POST | `/login/phone/send-otp` | ❌ | `phone_number, country_code` | `{message, phone_number}` |
| POST | `/login/phone/verify-otp` | ❌ | `phone_number, country_code, otp` | `{token, user}` |
| GET | `/verify-email?token=xxx` | ❌ | `token` (query) | `{user}` |
| POST | `/forgot-password` | ❌ | `email` | `{message}` |
| POST | `/reset-password` | ❌ | `token, password` | `{message}` |

### Profile
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/profile/detail` | ✅ | - | `{user, token}` |
| PUT | `/profile/update` | ✅ | `first_name, last_name, profile_image, etc.` | `{user, token}` |
| POST | `/profile/logout` | ✅ | - | `{message}` |
| DELETE | `/profile/delete` | ✅ | - | `{message}` |
| PATCH | `/language` | ✅ | `language` | `{message}` |

### Events
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/event/list` | ❌ | `page, limit, location, minPrice, maxPrice, minRating, startDate, endDate` | `{events, pagination}` |
| GET | `/event/detail?event_id=xxx` | ⚠️ | `event_id` (query) | `{event}` |
| POST | `/event/book` | ✅ | `event_id, no_of_attendees` | `{booking, payment_url}` |
| POST | `/event/cancel` | ✅ | `book_id` | `{message}` |
| GET | `/event/booked/list` | ✅ | `page, limit` | `{bookings}` |
| GET | `/event/booked/detail?book_id=xxx` | ✅ | `book_id` (query) | `{booking}` |

### Reviews
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/event/review/add` | ✅ | `event_id, rating, comment` | `{review}` |
| GET | `/event/review/list?event_id=xxx` | ✅ | `event_id` (query) | `{reviews}` |

### Payments
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/verifyPayment` | ✅ | `order_id, payment_id, signature` | `{verified}` |
| GET | `/payment?id=xxx` | ✅ | `id` (query) | `{payment}` |
| POST | `/payment/update` | ✅ | `booking_id, payment_id` | `{payment_status}` |

### Refunds
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/refund/request` | ✅ | `book_id, refund_reason` | `{refund_request}` |
| GET | `/refund/list` | ✅ | `page, limit` | `{refunds}` |
| GET | `/refund/detail?refund_id=xxx` | ✅ | `refund_id` (query) | `{refund}` |

### Messaging
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/conversations` | ✅ | `page, limit` | `{conversations}` |
| GET | `/messages?conversation_id=xxx` | ✅ | `conversation_id, page, limit` | `{messages}` |
| POST | `/message/send` | ✅ | `conversation_id, message` | `{message}` |
| POST | `/message/send-with-attachment` | ✅ | `conversation_id, message, file` | `{message}` |
| GET | `/conversation/get-or-create?user_id=xxx` | ✅ | `user_id` (query) | `{conversation}` |
| GET | `/group-chat?event_id=xxx` | ✅ | `event_id` (query) | `{conversation, messages}` |

### Notifications
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/notification/list` | ✅ | `page, limit` | `{notifications}` |
| GET | `/unreadNotificationCount` | ✅ | - | `{unreadCount}` |

### Career
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/career/apply` | ❌ | `first_name, last_name, email, position, cover_letter, resume_url` | `{application_id}` |
| GET | `/career/positions` | ❌ | - | `{positions}` |

### Other
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/uploadFile` | ✅ | `file` (form-data) | `{file_url}` |
| PUT | `/deviceToken` | ✅ | `fcm_token` | `{message}` |

---

## 🏠 HOST (Organizer) Endpoints

### Authentication
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/organizer/register` | ❌ | `email, password, first_name, last_name, phone_number, country_code, gender, dob, city` | `{message}` |
| POST | `/organizer/login` | ❌ | `email, password` | `{token, user}` |
| GET | `/organizer/verify-email?token=xxx` | ❌ | `token` (query) | `{user}` |
| POST | `/organizer/forgot-password` | ❌ | `email` | `{message}` |
| POST | `/organizer/reset-password` | ❌ | `token, password` | `{message}` |
| PUT | `/organizer/registration/update` | ❌ | `organizer_id, step, data` | `{user}` |

### Profile
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| PUT | `/organizer/profile/update` | ✅ | `first_name, last_name, bio, profile_image, etc.` | `{user, token}` |

### Events
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| POST | `/organizer/event/add` | ✅ | `event_name, event_description, event_date, event_price, event_address, etc.` | `{event}` |
| PUT | `/organizer/event/update` | ✅ | `event_id, event_data` | `{event}` |
| GET | `/organizer/event/detail?event_id=xxx` | ✅ | `event_id` (query) | `{event}` |
| DELETE | `/organizer/event/delete?event_id=xxx` | ✅ | `event_id` (query) | `{message}` |
| GET | `/organizer/event/list` | ✅ | `page, limit, search, status` | `{events}` |
| POST | `/organizer/event/cancel` | ✅ | `event_id` | `{message}` |
| GET | `/organizer/event/analytics` | ✅ | - | `{analytics}` |

### Bookings
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/organizer/event/booking/list` | ✅ | `page, limit, event_id` | `{bookings}` |
| GET | `/organizer/event/booking/detail?book_id=xxx` | ✅ | `book_id` (query) | `{booking}` |
| PATCH | `/organizer/event/booking/update-status` | ✅ | `book_id, status` | `{message}` |

### Earnings & Withdrawals
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/organizer/earning` | ✅ | `page, limit` | `{earnings, total}` |
| POST | `/organizer/withdrawal` | ✅ | `amount, bank_details` | `{withdrawal_request}` |
| GET | `/organizer/withdrawalList` | ✅ | `page, limit` | `{withdrawals}` |

### Reviews
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/organizer/event/review/list?event_id=xxx` | ✅ | `event_id` (query) | `{reviews}` |

### Categories
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/organizer/category/list` | ❌ | - | `{categories}` |
| GET | `/organizer/event/category/list` | ❌ | - | `{categories}` |

### Messaging (Same as Guest)
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| GET | `/organizer/conversations` | ✅ | `page, limit` | `{conversations}` |
| GET | `/organizer/messages?conversation_id=xxx` | ✅ | `conversation_id, page, limit` | `{messages}` |
| POST | `/organizer/message/send` | ✅ | `conversation_id, message` | `{message}` |
| POST | `/organizer/message/send-with-attachment` | ✅ | `conversation_id, message, file` | `{message}` |
| GET | `/organizer/group-chat?event_id=xxx` | ✅ | `event_id` (query) | `{conversation, messages}` |

### Other
| Method | Endpoint | Auth | Params | Response |
|--------|----------|------|--------|----------|
| PUT | `/organizer/deviceToken` | ✅ | `fcm_token` | `{message}` |
| PATCH | `/organizer/paymentStatus` | ✅ | `booking_id, payment_id` | `{message}` |

---

## Response Format

### Success
```json
{
  "status": 1,
  "message": "Success message",
  "data": { ... },
  "total_count": 0
}
```

### Error
```json
{
  "status": 0,
  "message": "Error message",
  "data": {},
  "total_count": 0
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Notes

- ✅ = Auth Required (Bearer token)
- ❌ = No Auth Required
- ⚠️ = Optional Auth
- All dates in ISO format
- Phone: Saudi Arabia only (+966)
- OTP: Use `123456` for testing (dummy OTP)



