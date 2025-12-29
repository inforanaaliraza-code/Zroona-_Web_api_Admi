    Email and Push – App Notifications
Zuroona
Last Updated: 10/11/2025 11:15 AM
1) Playbook — how to make notifications feel premium (not basic)
•	Personalization beyond the name: reference the exact date/time (“Tue, 12 Nov, 7:30 PM (Riyadh)”), ticket count, map district (“Diriyah”), and host vibe (“Homemade Najdi dinner by Maha”).
•	Urgency + clarity: show a clear hold window (“Held for 30 min”), a countdown (“12 min left”), or capacity (“2 seats left”).
•	Social proof: “⭐️ 4.9 from 86 guests” or “Booked 3× today”.
•	Friction-killers: put Apple Pay / Google Pay as 1-tap buttons in push/email.
•	Actionable buttons: Accept/Decline; Pay Now; Open Map; Message Host; Add to Calendar.
•	Bilingual done right: send the user’s preferred language; if unknown, EN→AR stacked (short).
•	Quiet-hours smart: push only if within 10:00–22:00 KSA; else email now, schedule push for morning.
•	Failover: if push isn’t delivered in 2 minutes → send email.
________________________________________
2) OneSignal setup (quick cheatsheet)
•	Data Tags (per user):
lang, role (“host”/“guest”), city, last_booking_at, superhost, n_bookings, avg_rating, wallet_balance, kyc_status.
•	Data Tags (per event payload):
experience_id, experience_title, host_id, host_first_name, tickets_count, start_at_iso, venue_area, hold_expires_at, price_total, currency, rating_avg, rating_count.
•	Templates & localization: store EN/AR templates with variables; call the right template by user lang.
•	Journeys:
o	Booking Journey: Request → Host reminder (12h) → Auto-expire (24h).
o	Accept→Pay Journey: Accept → Pay-now push → Pay-now reminder (15 min) → Hold expired.
o	Post-Event Journey: Receipt → Review prompt (T+6h) → Reminder (T+72h).
•	Throttles & caps: max 2 pushes/day/user; suppress marketing if transactional sent in last 30 min.
•	Outcomes: track clicked_pay_now, viewed_request, review_submitted, withdrawal_started.
________________________________________
3) Upgraded bilingual copy (Pro)
Short, friendly, with A/B variants. Replace {{ }} with your values; keep the deep links.
A) Guest — Request Sent (A/B)
EN A (friendly):
Subject: Request sent for “{{experience_title}}” 🎟️
Preview: We pinged {{host_first_name}} — you’ll get an answer soon.
Body:
Hi {{guest_first_name}}, your request for {{tickets_count}} ticket(s) on {{start_at}} is in.
Host {{host_first_name}} has a ⭐️ {{rating_avg}} ({{rating_count}}) — nice pick.
Heads-up: not confirmed until you pay.
CTA: View request → {{booking_url}}
EN B (urgency):
Subject: You’re in line for “{{experience_title}}” — {{tickets_count}} ticket(s)
Preview: We’ll let you know as soon as the host replies.
Body: Same as A, but add: “This date is popular today.”
AR A:
العنوان: تم إرسال طلبك لـ «{{experience_title}}» 🎟️
المعاينة: بلغنا {{host_first_name}}—بتوصلك الإجابة قريب.
النص:
مرحباً {{guest_first_name}}, تم إرسال طلب {{tickets_count}} تذكرة بتاريخ {{start_at}}.
المضيف {{host_first_name}} تقييمه ⭐️ {{rating_avg}} ({{rating_count}}). اختيار موفّق.
تنبيه: التأكيد بعد الدفع.
زر: عرض الطلب → {{booking_url}}
Push (EN/AR):
EN: Request sent. We’ll notify you when {{host_first_name}} replies.
AR: تم الإرسال. بنعلمك أول ما يرد {{host_first_name}}.
________________________________________
B) Host — New Request (with action buttons)
EN:
Subject: New request: {{guest_first_name}} → “{{experience_title}}” ({{tickets_count}})
Preview: {{start_at}} · Diriyah area
Body:
{{host_first_name}}, {{guest_first_name}} wants {{tickets_count}} ticket(s) for {{start_at}}.
Fast replies = more bookings.
Buttons: Accept → {{accept_url}} | Decline → {{decline_url}} | Message → {{chat_url}}
AR:
العنوان: طلب جديد: {{guest_first_name}} على «{{experience_title}}» ({{tickets_count}})
المعاينة: {{start_at}} · منطقة الدرعية
النص:
{{host_first_name}}، {{guest_first_name}} طلب {{tickets_count}} تذكرة بتاريخ {{start_at}}.
الرد السريع = حجوزات أكثر.
الأزرار: قبول → {{accept_url}} | رفض → {{decline_url}} | مراسلة → {{chat_url}}
Push:
EN: New request ({{tickets_count}}) for “{{experience_title}}”. Accept/Decline.
AR: طلب جديد ({{tickets_count}}) لـ «{{experience_title}}». قبول/رفض.
________________________________________
C) Guest — Accepted → Pay Now (scarcity & speed) (A/B)
EN A (scarcity):
Subject: Accepted! Hold {{tickets_count}} seat(s) for “{{experience_title}}”
Preview: Complete payment in {{hold_minutes}} min to lock your spot.
Body:
Yes, {{guest_first_name}} — {{host_first_name}} approved your request.
Hold: {{hold_minutes}} min · Total: {{total_amount}} {{currency}}
Pay with Apple Pay / Google Pay / card.
CTA: Pay now → {{pay_url}}
Line: Only {{remaining_seats}} seats left for this date.
EN B (speed):
Subject: You’re approved — 1-tap to confirm
Preview: Apple Pay / Google Pay available.
AR A:
العنوان: تمت الموافقة! احجز {{tickets_count}} مقعد خلال {{hold_minutes}} دقيقة
المعاينة: أكمل الدفع لتأكيد مكانك.
النص:
تمام يا {{guest_first_name}}—{{host_first_name}} وافق على طلبك.
مهلة الحجز: {{hold_minutes}} دقيقة · الإجمالي: {{total_amount}} {{currency}}
تقدر تدفع Apple Pay / Google Pay أو بطاقة.
زر: ادفع الآن → {{pay_url}}
سطر: باقي {{remaining_seats}} مقعد/مقاعد في هذا اليوم.
Push (EN/AR):
EN: Accepted! {{hold_minutes}}-min hold. Pay now to confirm.
AR: تمت الموافقة! مهلة {{hold_minutes}} دقيقة. ادفع الآن للتأكيد.
________________________________________
D) Guest — Payment Failed (gentle but urgent)
EN:
Subject: Payment hiccup — one more tap to confirm
Preview: Apple Pay / Google Pay / card
Body:
We couldn’t process your payment for “{{experience_title}}” (Order {{order_id}}).
Try again now — seats move fast.
CTA: Retry payment → {{pay_url}}
AR:
العنوان: مشكلة بسيطة في الدفع — جرّب مرة ثانية
المعاينة: Apple Pay / Google Pay / بطاقة
النص:
ما اكتمل الدفع لـ «{{experience_title}}» (طلب {{order_id}}).
أعد المحاولة الآن—المقاعد تنفد بسرعة.
زر: إعادة المحاولة → {{pay_url}}
Push:
EN: Payment failed. Tap to retry and keep your spot.
AR: فشل الدفع. اضغط لإعادة المحاولة وتثبيت مكانك.
________________________________________
E) Guest — Booking Confirmed (upsell to calendar + share)
EN:
Subject: You’re booked! “{{experience_title}}” on {{start_at}}
Preview: Your tickets are ready. Add to calendar.
Body:
Done! {{tickets_count}} ticket(s) confirmed.
Order {{order_id}} · Total: {{total_amount}} {{currency}}
Buttons: View booking → {{booking_url}} | Add to calendar (.ics) → {{calendar_url}} | Share with friends → {{share_url}}
AR:
العنوان: تم تأكيد حجزك! «{{experience_title}}» بتاريخ {{start_at}}
المعاينة: تذاكرك جاهزة—أضفها للتقويم.
النص:
تمام! تم تأكيد {{tickets_count}} تذكرة.
طلب {{order_id}} · الإجمالي: {{total_amount}} {{currency}}
أزرار: عرض الحجز → {{booking_url}} | إضافة للتقويم (.ics) → {{calendar_url}} | شارك الأصدقاء → {{share_url}}
Push:
EN: You’re in 🎉 See tickets & details.
AR: تم الحجز 🎉 شوف التذاكر والتفاصيل.
________________________________________
F) Host — Response Reminder (adds “boost tips”)
EN:
Subject: Quick nudge: reply to {{guest_first_name}}
Preview: Fast replies increase your ranking.
Body:
{{host_first_name}}, {{guest_first_name}} is waiting for {{experience_title}} ({{start_at}}).
Boost tip: accept within 1h to improve visibility.
Buttons: Accept → {{accept_url}} | Decline → {{decline_url}}
AR:
العنوان: تذكير سريع: ردّ على {{guest_first_name}}
المعاينة: الردود السريعة ترفع ترتيبك.
النص:
{{host_first_name}}، {{guest_first_name}} ينتظر على «{{experience_title}}» ({{start_at}}).
نصيحة: القبول خلال ساعة يرفع ظهور إعلانك.
أزرار: قبول → {{accept_url}} | رفض → {{decline_url}}
Push:
EN: Reply needed for “{{experience_title}}”.
AR: مطلوب رد لتجربة «{{experience_title}}».
________________________________________
G) Hold Expired (re-request shortcut)
EN:
Subject: Your hold expired — 2 taps to re-request
Preview: This date is popular.
Body:
Your hold for “{{experience_title}}” has expired.
Tap below to send a fresh request — we’ll prioritize notifications.
CTA: Request again → {{experience_url}}
AR:
العنوان: انتهت المهلة — اطلب من جديد بخطوتين
المعاينة: التاريخ هذا مطلوب.
النص:
انتهت مهلة حجز «{{experience_title}}».
ارسل طلب جديد من الرابط—بننبهك أول ما يرد المضيف.
زر: أعد الطلب → {{experience_url}}
Push:
EN: Hold expired. Request again now.
AR: انتهت المهلة. أعد الطلب الآن.
________________________________________
H) Reviews (make it fun + photo ask)
EN (Guest prompt):
Subject: How was it? 30-sec review for {{host_first_name}}
Preview: Stars + a quick note (photos welcome).
Body:
Hope you had a great time at “{{experience_title}}” 🎉
Rate {{host_first_name}} (⭐️ in 2 taps) and add a photo if you like.
CTA: Leave a review → {{review_url}}
AR:
العنوان: كيف كانت؟ تقييم سريع خلال 30 ثانية
المعاينة: نجوم + ملاحظة قصيرة (الصور مرحّب بها).
النص:
عساك استمتعت في «{{experience_title}}» 🎉
قيّم {{host_first_name}} (⭐️ بخطوتين) وأضف صورة لو حاب.
زر: اكتب تقييمك → {{review_url}}
Push:
EN: Got 30 sec? Rate your host ⭐️
AR: عندك 30 ثانية؟ قيّم المضيف ⭐️
________________________________________
I) Wallet — Withdrawal Approved (adds certainty)
EN:
Subject: Withdrawal approved — {{amount}} {{currency}} on the way
Preview: Expect within 5 business days (ref {{payout_ref}}).
Body:
We approved your withdrawal to {{bank_short}}.
Amount: {{amount}} {{currency}} · Ref: {{payout_ref}}
Banks usually post within 5 business days.
CTA: Track payout → {{wallet_url}}
AR:
العنوان: تم اعتماد السحب — {{amount}} {{currency}} في الطريق
المعاينة: خلال 5 أيام عمل (مرجع {{payout_ref}}).
النص:
تم اعتماد سحبك إلى {{bank_short}}.
المبلغ: {{amount}} {{currency}} · المرجع: {{payout_ref}}
تظهر عادة خلال 5 أيام عمل.
زر: تتبع التحويل → {{wallet_url}}
Push:
EN: Withdrawal approved. Funds on the way.
AR: تم اعتماد السحب. المبلغ في الطريق.
________________________________________


📨 New EMAIL-ONLY Notifications (copy–paste)

1) First Warning – Account at Risk of Suspension (Guest & Host)
English
Subject: Important: Warning regarding your Zuroona account
Hi {{first_name}},
We noticed activity on your Zuroona account that does not align with our Terms & Conditions and platform policies. This is a first warning that your account may be suspended if this continues.
Please review our guidelines carefully and adjust your use of the platform to remain compliant. If you believe this is a mistake, you can contact us at {{support_email}}.
Thank you for helping us keep Zuroona safe and trusted for guests and hosts.
Zuroona Team
العربية
العنوان: تنبيه هام: إنذار بخصوص حسابك في زورونا
مرحباً {{first_name}}،
لاحظنا وجود استخدام لحسابك في زورونا لا يتوافق مع الشروط والأحكام وسياسات المنصة. هذا يعتبر الإنذار الأول بأن حسابك قد يتعرض لـ إيقاف مؤقت في حال استمرار هذه المخالفات.
نرجو منك مراجعة الإرشادات والسياسات بعناية، والالتزام بها لضمان استمرار استخدامك للمنصة. في حال اعتقادك بوجود خطأ، يمكنك التواصل معنا عبر {{support_email}}.
شكراً لتعاونك في جعل زورونا منصة آمنة وموثوقة للضيوف والمضيفين.
فريق زورونا
________________________________________
2) Account Suspended Until Further Notice
English
Subject: Your Zuroona account has been suspended
Hi {{first_name}},
Your Zuroona account has been suspended until further notice due to activity that does not comply with our Terms & Conditions and platform policies.
During this suspension, you will not be able to access certain features of the platform, including {{blocked_features_description}}.
If you would like to understand more about this decision or submit an appeal, please contact us at {{support_email}} with your registered email and any relevant details.
Zuroona Team
العربية
العنوان: تم إيقاف حسابك في زورونا
مرحباً {{first_name}}،
نود إبلاغك بأنه تم إيقاف حسابك في زورونا حتى إشعار آخر بسبب استخدام لا يتوافق مع الشروط والأحكام وسياسات المنصة.
خلال فترة الإيقاف، لن تتمكن من استخدام بعض خصائص المنصة، بما في ذلك: {{blocked_features_description}}.
في حال رغبتك في معرفة المزيد عن سبب هذا القرار أو التقدّم بطلب مراجعة، نرجو التواصل معنا على {{support_email}} مع ذكر بريدك الإلكتروني المسجّل وأي تفاصيل ذات صلة.
فريق زورونا
________________________________________
3) Account Deleted (Permanent)
English
Subject: Your Zuroona account has been deleted
Hi {{first_name}},
This is to confirm that your Zuroona account has been permanently deleted and is no longer active.
You will no longer be able to log in or use the services associated with this account. Certain information may be retained as required by law and our data retention policies.
If you believe this action was taken in error, please reach out to us within {{appeal_window_days}} days at {{support_email}}.
Zuroona Team
العربية
العنوان: تم حذف حسابك في زورونا بشكل نهائي
مرحباً {{first_name}}،
نفيدك بأنه تم حذف حسابك في زورونا بشكل نهائي ولم يعد نشطاً على المنصة.
لن تتمكن بعد الآن من تسجيل الدخول أو استخدام الخدمات المرتبطة بهذا الحساب. قد نحتفظ ببعض المعلومات وفقاً للأنظمة المعمول بها وسياسة الاحتفاظ بالبيانات لدينا.
إذا كنت تعتقد أن هذا الإجراء تم عن طريق الخطأ، فيمكنك التواصل معنا خلال {{appeal_window_days}} يوماً على {{support_email}}.
فريق زورونا
________________________________________
4) Host Application Rejected (Sign-Up as Host)
English
Subject: Update on your host application with Zuroona
Hi {{first_name}},
Thank you for your interest in becoming a host on Zuroona and for submitting your application.
After reviewing your submission, we’re unable to approve your host application at this time. This decision may be related to eligibility criteria, documentation, safety requirements, or alignment with our content and experience guidelines.
You’re welcome to review our hosting guidelines here: {{guidelines_url}}, and you may re-apply in the future if your situation changes or you can provide additional information.
We truly appreciate your interest in contributing to the Zuroona community.
Zuroona Team
العربية
العنوان: تحديث بخصوص طلبك للتسجيل كمضيف في زورونا
مرحباً {{first_name}}،
نشكرك على اهتمامك بالتسجيل كمضيف في زورونا وعلى تقديم طلبك.
بعد مراجعة البيانات والمستندات التي أرسلتها، نود إبلاغك بأننا لا نستطيع الموافقة على طلبك للتسجيل كمضيف في الوقت الحالي. قد يعود هذا القرار لمتطلبات الأهلية أو المستندات أو معايير السلامة أو توافق نوع التجارب مع إرشادات المنصة.
يمكنك الاطلاع على إرشادات وشروط الاستضافة من خلال الرابط التالي: {{guidelines_url}}، كما يمكنك إعادة التقديم مستقبلاً إذا طرأ تغيير على وضعك أو تمكنت من تقديم معلومات إضافية.
نقدّر اهتمامك ورغبتك في الانضمام لمجتمع زورونا.
فريق زورونا
________________________________________
5) Host Experience Not Published (Due to Terms/Policies)
English
Subject: Your Zuroona experience is not published yet
Hi {{host_first_name}},
Thank you for submitting your experience “{{experience_title}}” on Zuroona.
After review, we’re unable to publish this experience for now because it does not fully meet our Terms & Conditions and/or content and safety guidelines.
Please review the feedback below and update your experience:
– {{review_feedback}}
Once you’ve made the changes, you can resubmit the experience for review. If you have any questions, contact us at {{support_email}}.
Zuroona Team
العربية
العنوان: تجربتك في زورونا غير منشورة حالياً
مرحباً {{host_first_name}}،
نشكرك على إرسال تجربتك «{{experience_title}}» في زورونا.
بعد المراجعة، نود إبلاغك بأننا لا نستطيع نشر هذه التجربة في الوقت الحالي لأنها لا تتوافق بشكل كامل مع الشروط والأحكام و/أو إرشادات المحتوى والسلامة في المنصة.
نرجو منك مراجعة الملاحظات التالية وتحديث التجربة:
– {{review_feedback}}
بعد إجراء التعديلات، يمكنك إعادة إرسال التجربة للمراجعة. في حال وجود أي استفسار، نرجو التواصل معنا على {{support_email}}.
فريق زورونا
________________________________________
6) Wallet Withdrawal – Request Submitted (Host)
English
Subject: We received your withdrawal request
Hi {{host_first_name}},
We’ve received your withdrawal request from your Zuroona wallet.
Amount: {{amount}} {{currency}}
Requested on: {{requested_at}}
Our team will now review and process your request. You’ll receive another notification once it has been approved and sent to your bank.
You can track the status from your wallet page here: {{wallet_url}}.
Zuroona Team
العربية
العنوان: تم استلام طلب السحب من محفظتك
مرحباً {{host_first_name}}،
نفيدك بأنه تم استلام طلب السحب من محفظة زورونا الخاصة بك.
المبلغ: {{amount}} {{currency}}
تاريخ الطلب: {{requested_at}}
سيقوم فريقنا بمراجعة الطلب ومعالجته، وسيصلك إشعار آخر عند اعتماد السحب وإرساله إلى حسابك البنكي.
يمكنك متابعة حالة الطلب من صفحة المحفظة عبر الرابط: {{wallet_url}}.
فريق زورونا
________________________________________
🔔 New PUSH Notifications Only (or new text)
These are new push texts (you can map them to your push table).
________________________________________
7) Push – Experience Not Published (Host)
EN (Push)
Your experience “{{experience_title}}” isn’t published yet. Please review the feedback and update to meet our guidelines.
AR (Push)
تجربتك «{{experience_title}}» غير منشورة حالياً. راجع الملاحظات وعدّلها لتتوافق مع إرشادات المنصة.
________________________________________
8) Push – Wallet Withdrawal Request Submitted (Host)
EN (Push)
Withdrawal request received: {{amount}} {{currency}} from your Zuroona wallet. We’ll notify you once it’s approved.
AR (Push)
تم استلام طلب سحب بقيمة {{amount}} {{currency}} من محفظتك في زورونا. بنعلمك أول ما يتم اعتماده.
________________________________________
9) Push – Wallet Withdrawal Approved (Host)
EN (Push)
Withdrawal approved: {{amount}} {{currency}} is on the way. Check your wallet for details.
AR (Push)
تم اعتماد السحب: {{amount}} {{currency}} في الطريق إلى حسابك. تفقد المحفظة للتفاصيل.
________________________________________
You can now safely copy–paste all of the above as “new items” and keep everything from your document as-is.
If you want, next step I can organize these into a table structure (Name – Type – Channel – Trigger – EN – AR) exactly like a product spec.

