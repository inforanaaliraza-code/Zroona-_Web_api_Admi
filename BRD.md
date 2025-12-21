Business Requirements Document (BRD)
Zuroona Platform
1. Overview

Zuroona is an existing mobile application and web-based booking platform designed to connect hosts and guests through a secure, user-friendly experience. This BRD defines the enhancement, integration, refinement, and rebranding requirements for the current Zuroona system.

The solution consists of:

Mobile Apps: Flutter-based iOS & Android applications

Website: Responsive web platform using Next.js / JavaScript

Backend: RESTful APIs built with Node.js and MySQL

Admin Panel: Web-based system for managing users, bookings, content, and refunds

Key priorities include:

Modern, responsive UI/UX

Bilingual support (English & Arabic with RTL)

Strong security practices (SQL Injection, XSS, CSRF protection)

Third-party integrations (OneSignal, msegat, Supabase, jsmail, maysir, payment gateways)

Refund and rating workflows

Long-term support with a 2-year SLA

Important Note: This BRD does not cover full development from scratch. All requirements are intended to enhance and build upon the existing Zuroona platform already delivered, in alignment with the approved proposal.

2. Objectives

Deliver a secure and stable mobile app (iOS & Android) and responsive website

Provide a centralized admin portal for operational control

Enable multilingual UI (English & Arabic with RTL support)

Integrate payments, notifications, SMS, and email services

Strengthen system security against common vulnerabilities

Provide post-launch support under a 2-year SLA

3. Scope
3.1 In-Scope

Flutter mobile apps (iOS & Android)

Responsive website and landing pages (Next.js / JS / Bootstrap)

Web-based Admin Panel

Node.js REST APIs with MySQL database

Third-party integrations:

OneSignal (Push Notifications)

msegat (SMS)

jsmail (Email)

Supabase (optional usage)

maysir (as required)

Payment gateways

Host & Guest rating and review system

Refund workflow and admin refund management

Localization (English & Arabic – RTL supported)

Basic analytics, logging, and monitoring

2-year SLA and support

3.2 Out-of-Scope (Unless Explicitly Requested)

New or complex third-party integrations beyond those listed

Advanced marketing automation systems

Custom BI dashboards beyond basic reporting

Costs of third-party paid services (client responsibility)

Scope Clarification: All items listed above represent enhancements, upgrades, integrations, or refinements to the existing Zuroona system, ensuring alignment with the approved proposal and avoiding duplicate development.

4. Customer / User-Side Functional Requirements (App)
4.1 User Registration & Authentication

Users can register using email or phone number

Verification via SMS or email

Secure login and password recovery

Profile management with personal details and photos

User Types:

Guest: Immediate access after registration

Host: Subject to admin verification and approval

Host profiles appear in the admin panel for review

Admin can approve or reject hosts

Approved hosts receive activation notifications

4.2 Search & Discovery

Guests can search for hosts/services using filters:

Location

Date & time

Price

Ratings

Listings display images, availability, and service details

4.3 Booking System

Guests select host, date, and time

Pricing and terms review before confirmation

Booking statuses include:

Pending

Confirmed

Cancelled

Completed

Refunded

Automated notifications for all booking updates

4.4 Payments & Refunds

Integrated payment gateways (credit/debit & local options)

Secure transaction handling

Refund requests submitted by users

Refunds reviewed and processed by admins

Real-time refund status updates to users

4.5 Ratings & Reviews

Post-booking ratings for both hosts and guests

Star-based rating system with optional comments

Ratings influence host visibility and trust

4.6 Notifications

Push notifications via OneSignal

SMS notifications via msegat

Email notifications via jsmail

Covers bookings, payments, cancellations, reminders, and promotions

4.7 User Dashboard

Guest Dashboard:

Booking history

Payment records

Ratings & reviews

Profile settings

Host Dashboard:

Listing management

Availability control

Earnings overview

4.8 Daftara Invoice Integration

Automated invoice/receipt generation after successful booking

Invoices delivered to users digitally

4.9 In-App Messaging

Automatic group chat creation after event approval

All approved and paying guests are added

Hosts and guests can send messages, images, and files

Chat remains active during the event period

Group automatically closes after event completion

5. Non-Functional Requirements

Security: HTTPS, encryption at rest and in transit, protection against SQLi, XSS, CSRF

Performance: Page loads and booking flows within 2–3 seconds

Scalability: APIs and infrastructure support growth

Availability: Backup and disaster recovery strategies

Localization: Full English & Arabic (RTL)

Accessibility: Basic WCAG compliance

Monitoring: Centralized logging, uptime monitoring, and error tracking

6. Website Flow (Web)

The website functions as both a marketing platform and a booking portal.

Key sections include:

Homepage with brand highlights and quick booking

Search and filter services

Booking confirmation and payments

User dashboard (profile, bookings, payments)

Ratings and reviews

News, offers, and promotions

Careers page with email-based job applications

Contact and legal pages (Terms & Conditions, Privacy Policy)

7. Admin Panel Functional Requirements (Web)
7.1 User Management

View, search, filter users and hosts

Edit user details

Suspend or deactivate accounts

7.2 Booking & Event Management

Monitor all bookings and statuses

Review and approve/reject host-submitted events

Re-approval required if approved events are edited

Maintain quality and compliance standards

7.3 Refund Management

Review refund requests

Approve or reject refunds

Trigger refunds via payment gateway

7.4 Content Management

Manage website menus, headers, footers, and branding

Update promotional content

Manage careers, terms & conditions, and static pages

7.5 Reports & Analytics

Overview dashboards for:

Bookings

Payments

Refunds

Ratings

Insight into platform performance

7.6 Notification Management

Configure push, SMS, and email templates

Manage campaigns and automated triggers

8. Zuroona User Journeys
8.1 User Journey (App)

User registers and verifies account

Logs in and accesses dashboard

Searches and filters services

Selects host, date, and time

Completes payment

Receives confirmation via app, SMS, and email

Attends/completes booking

Submits rating and review

Requests refund if applicable

Receives reminders and promotions

8.2 Admin Journey (Web)

Admin logs in securely

Reviews user and host registrations

Manages bookings and events

Processes refund requests

Updates content and promotions

Sends notifications and campaigns

Reviews reports and analytics

Ensures system security and compliance

End of Document