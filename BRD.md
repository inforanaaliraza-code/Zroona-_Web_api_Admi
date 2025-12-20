BRD FOR ZUROONA PLATFORM
BRD – Zuroona App
1. Overview:
Zuroona is a responsive mobile app + website project intended to deliver a secure, user-friendly
booking platform (hosts & guests). The solution includes a modern branded UI/UX (mobile apps
built with Flutter, web with JS/Next.js), a RESTful Node.js backend and MySQL database, and an
admin panel to manage bookings, refunds, content and integrations. Key priorities from the
proposal: responsive design, bilingual support (English/Arabic), security (SQL injection, XSS,
CSRF mitigation), third-party integrations (OneSignal, msegat, Supabase, jsmail, maysir), refund
workflow, rating system (hosts & guests), and a 2-year SLA.
Note: This BRD has been prepared to guide enhancements, integration of third-party services,
refinements, and brand identity improvements for the existing Zuroona platform. It does not cover
full development from scratch. All requirements described here are intended to build upon and
enhance the system that you have already provided as part of your project.
2. Objectives:
● Deliver a secure, stable mobile app (iOS & Android) and responsive website for guests and
hosts.
● Provide an admin portal integrated with mobile/web to manage bookings, refunds, users,
and content.
● Implement multilingual UI (English & Arabic) with RTL support.
● Integrate payment gateway(s), push notifications, SMS and email services.
● Harden the system against common web vulnerabilities (SQLi, XSS, CSRF).
● Provide support & SLA (2 years as proposed).
BRD – Zuroona App
3. Scope:
3.1 In-Scope
● Mobile app (Flutter) for iOS and Android (App Store & Play Store deployment).
● Responsive website and landing page (Next.js / Bootstrap / JS).
● Web-based Admin Panel (Laravel/Node admin or implemented as web portal).
● Backend APIs (Node.js) and MySQL database.
● Third-party integrations: OneSignal (push), msegat (SMS), jsmail (email), Supabase
(optional), maysir (as required), payment gateway(s).
● Rating system for hosts and guests.
● Refund process flow & admin refund management.
● Localization: English & Arabic (RTL).
● Basic analytics, logging and monitoring.
● 2-year SLA and support.
3.2 Out-of-Scope (unless explicitly requested)
● New complex third-party integrations not listed in the proposal.
● Large-scale marketing systems beyond basic promo code support.
● Extensive custom BI dashboards — only basic reporting included.
● Any costs for third-party paid services (these are client responsibilities as listed).
Important Clarification: The scope of this BRD is focused on upgrading, enhancing, integrations
third party services, and rebranding the existing Zuroona application and website. All modules and
functionalities listed are either improvements or extensions to the current system, based on the
project details you have already provided. This ensures alignment with our submitted proposal and
avoids duplication of work from scratch.
4. Customer/User Side Functional Requirements(App):
User Registration and Authentication
Users can register with their email or phone number, verify via SMS or email, and securely
log in. A password recovery option is provided, and profiles can be customized with personal
details and photos. This ensures that each guest or host can maintain a trusted identity on the
platform.
There are two types of users, one for guest and other for host. Guests can register and
gain immediate access to the platform without additional approval steps. Host accounts, however,
follow a verification workflow. After registration, host profiles appear in the admin dashboard for
review, where administrators can approve or reject based on the responses provided during
registration. Only after approval can a host log in and access the platform. If approved, hosts
receive a notification confirming their activation.
Search and Discovery
Guests can search for hosts, services, or listings using filters such as location, date, price,
and rating. Results display high-quality images, service details, and availability, helping users find
BRD – Zuroona App
suitable hosts quickly and efficiently.
Booking System
The booking process allows guests to select a host, choose a date and time, review pricing
and terms, and confirm reservations. The system supports various booking statuses, including
pending, confirmed, cancelled, completed, and refunded. Notifications keep both hosts and guests
informed throughout the process.
Payments and Refunds
Payments are processed through integrated gateways, supporting credit/debit cards and
localized options. Refunds can be requested by users, reviewed by administrators, and processed
securely. Guests receive real-time updates on the status of their refund requests.
Ratings and Reviews
After a booking, guests and hosts can rate each other using a star system and optional
comments. Ratings affect host visibility and provide transparency to future customers.
Notifications
Users receive push notifications via OneSignal, SMS via msegat, and emails via jsmail.
Notifications cover booking confirmations, payment receipts, cancellations, reminders, and
promotional offers, ensuring users stay informed at all times.
User Dashboard
Guests have a dashboard showing booking history, payment records, ratings, and profile
settings. Hosts can manage their listings, availability, and earnings through their own view. This
dashboard ensures that all relevant details are available in one place.
Daftara Invoice
User will get automated receipts after the booking an event by the daftara.
In-App Messaging
This feature enables users to communicate directly within the app. Once an event is
approved by the admin, a group chat is automatically created for that specific event. Each guest
approved by the host is then automatically added to the group.
Participants can chat freely during the event period, and after the event ends, the group will
automatically close after a set time, preventing further messages from being sent.
Once an event is created, a group chat is automatically initiated. All paying guests should
be added to this group, and both the host and guests should be able to send messages, images,
and files.
BRD – Zuroona App
There will be two tables for extracting and displaying host and guest details such as
names, contact numbers, emails, and other relevant information in the admin panel.
Non-Functional Requirements
● Security: Protect against SQL injection, XSS, and CSRF; enforce HTTPS across all
channels; encrypt sensitive data at rest and in transit.
● Performance: Pages and booking flows must load within 2–3 seconds under normal
conditions.
● Scalability: APIs and infrastructure must support scaling with increased users and data.
● Availability: High availability with backup and disaster recovery strategies.
● Localization: Full English and Arabic support, including RTL layout for Arabic.
● Accessibility: Conform to basic WCAG accessibility standards to support all users.
● Monitoring: Centralized logging and monitoring for uptime, errors, and usage analytics.
5. Website Flow (Web).
The website will serve as both a promotional landing page and a functional booking portal. The
homepage will feature the company brand, service highlights, and app download links. Navigation
menus provide access to booking, host profiles, careers, contact, and terms & conditions. Users
can register, log in, and access their dashboards through the website. Key options include:
● Homepage with highlights and quick booking.
● Search and filter services.
● Booking confirmation and payment gateway integration.
● User dashboard (profile, bookings, payments).
● Ratings and reviews section.
● News, offers, and promotional updates.
● Careers page with job listings and email-based applications.
BRD – Zuroona App
6. Admin Side(Web) Functional Requirements
User Management
Admins can view, search, and filter users and hosts, edit their details, and suspend or
deactivate accounts when necessary. This ensures compliance and trust within the
platform.
Booking Management
Admins monitor all bookings, update statuses, and intervene where required. They can
also process cancellations and oversee refund requests, maintaining a smooth booking
lifecycle.
Any event submitted by a host appears in the admin panel for review. Administrators can
approve or reject events, with the ability to specify the reason for rejection. Approved
events are published on the platform. If a host edits an already approved event, the event
is temporarily removed from the platform and returned to the admin queue for review. Once
re-approved, the event is republished. This ensures all events maintain compliance and
quality standards before being visible to users.
Refund Management
The admin portal includes dedicated tools to review refund requests, approve or reject
them, and trigger refunds through the integrated payment gateway.
Content Management
Admins can edit website content, including menus, headers, footers, branding, and
promotional sections. Careers and terms & conditions sections can also be updated from
the portal.
Reports and Analytics
Admins have access to reporting dashboards summarizing bookings, payments, refunds,
and ratings. These insights help track platform performance and user activity.
Notification Management
Administrators can configure push notifications, SMS, and email campaigns, managing
templates and triggers for communication with users.
7. Zuroona Journeys.
Zuroona project has an admin panel in the web form to manage and control the overall
BRD – Zuroona App
website for customers. On the website, it has 2 roles..
1. Administration (Web)
2. User / Customer (App)
Their respective journeys are given below.
7.1. USER JOURNEY (APP)
o User registers with email or phone and verifies account.
o Logs in and accesses personalized dashboard.
o Searches for services or hosts with filters.
o Selects a host, date, and time; proceeds to booking.
o Makes a payment through integrated gateway.
o Receives confirmation via app, SMS, and email.
o Completes the booking and provides a rating/review.
o Can request a refund if applicable and track status.
o Receives promotional notifications and reminders.
7.2. ADMIN JOURNEY (WEB for App):
The admin will be responsible for setting up the system and then he will be responsible
for managing the whole system.
○ Admin logs in via secure portal.
○ Reviews new user registrations and updates roles if necessary.
○ Monitors bookings in real-time and manages statuses.
○ Processes refund requests and executes approved refunds.
○ Updates website content and promotional banners.
○ Sends notifications or campaigns to selected user groups.
○ Reviews reports on revenue, booking trends, and ratings.
○ Ensures system security and compliance via audits.