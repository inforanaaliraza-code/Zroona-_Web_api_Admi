# User Stories: Tool_21 - Loyalty Points نقاط الولاء

## Overview

**Loyalty Points System Purpose**: Reward customers for their engagement and purchases on the platform, encouraging repeat business and building long-term customer relationships. Points create a gamified experience that increases customer lifetime value and platform stickiness.

**Key Capabilities**:
- Earn points for purchases and activities
- Redeem points for discounts
- View points balance and transaction history
- Points expiration management
- Bonus points for special actions
- Tier-based earning rates (integration with Tool_22)
- Points transfer/gifting (future)

**Business Value**:
- Increase customer retention
- Boost order frequency
- Improve customer lifetime value
- Reduce price sensitivity
- Encourage platform engagement
- Competitive differentiation

**Core Mechanics**:
- **Base Rate**: 1 point per 10 SAR spent
- **Redemption Rate**: 100 points = 10 SAR discount
- **Expiration**: Points expire after 12 months
- **Minimum Redemption**: 100 points (10 SAR)
- **Maximum Redemption**: 50% of order value

---

## Feature Stories - Customer
*We are not building this section yet but you should be able to understand the workflow and the overall functionalities of the application*

### Story 1.1: Earn Points on Purchases
**As a** Customer  
**I want to** automatically earn points on every purchase  
**So that** I'm rewarded for my spending

**Acceptance Criteria**:
- [ ] Points earned automatically on order completion
- [ ] Order status must be "Delivered" to earn points
- [ ] Points calculated based on order total (after discounts)
- [ ] Base rate: 1 point per 10 SAR spent
- [ ] Points rounded down (149 SAR = 14 points)
- [ ] Shipping costs excluded from calculation
- [ ] Points credited within 24 hours of delivery
- [ ] Email/push notification sent when points credited
- [ ] Points visible in customer dashboard
- [ ] Cannot earn points on refunded orders
- [ ] If order refunded, points are deducted

**Points Calculation Example**:
```
Order Details:
- Subtotal: 500 SAR
- Discount (code): -50 SAR
- Shipping: Free
- Total: 450 SAR

Points Earned: 450 / 10 = 45 points

Notification:
"🎉 Congratulations! You earned 45 points from your recent order.
Your balance is now 245 points."
```

---

### Story 1.2: Earn Bonus Points for Reviews
**As a** Customer  
**I want to** earn bonus points for writing reviews  
**So that** I'm incentivized to share feedback

**Acceptance Criteria**:
- [ ] Earn bonus points for approved reviews
- [ ] Points awarded only after review approval
- [ ] Bonus structure:
  - [ ] 5-star review with photo: 50 points
  - [ ] 5-star review without photo: 30 points
  - [ ] 4-star review with photo: 30 points
  - [ ] 4-star review without photo: 20 points
  - [ ] 3-star or below: 10 points (for honest feedback)
- [ ] One-time bonus per order review
- [ ] Cannot earn points for edited reviews
- [ ] Cannot earn points for fake/spam reviews
- [ ] Notification sent when bonus points credited

---

### Story 1.3: Earn Points for Referrals
**As a** Customer  
**I want to** earn points when I refer friends  
**So that** I'm rewarded for bringing new customers

**Acceptance Criteria**:
- [ ] Earn 100 points when referred friend completes first order
- [ ] Friend must use referral code/link
- [ ] Friend's first order must be delivered (not cancelled)
- [ ] Friend's order minimum: 200 SAR
- [ ] Points credited after friend's first delivery
- [ ] No limit on number of referrals
- [ ] Cannot refer yourself (same email/phone/address)
- [ ] Notification sent when referral points credited
- [ ] Can track referral status in dashboard

**Referral Flow**:
```
1. Customer A gets unique referral code: "FATIMA100"
2. Customer A shares code with Friend B
3. Friend B signs up with code "FATIMA100"
4. Friend B places first order (250 SAR)
5. Order delivered successfully
6. Customer A earns 100 points
7. Friend B earns welcome bonus (50 points)
```

---

### Story 1.4: View Points Balance
**As a** Customer  
**I want to** see my current points balance  
**So that** I know how many points I have

**Acceptance Criteria**:
- [ ] Points balance visible in account dashboard
- [ ] Balance shows in header/profile menu
- [ ] Real-time balance updates
- [ ] Shows total available points
- [ ] Shows pending points (orders not delivered yet)
- [ ] Shows expiring points (within 30 days)
- [ ] Quick link to points history
- [ ] Quick link to redemption options

---

### Story 1.5: View Points Transaction History
**As a** Customer  
**I want to** see all my points transactions  
**So that** I can track how I earned and spent points

**Acceptance Criteria**:
- [ ] Transaction history accessible from dashboard
- [ ] Shows all transactions (earned + redeemed + expired)
- [ ] Each transaction shows:
  - [ ] Date and time
  - [ ] Transaction type (earned/redeemed/expired/adjusted)
  - [ ] Points amount (+/-)
  - [ ] Description
  - [ ] Reference (order number, review, etc.)
  - [ ] Balance after transaction
- [ ] Can filter by:
  - [ ] Type (all, earned, redeemed, expired)
  - [ ] Date range
- [ ] Pagination: 20 transactions per page
- [ ] Can export to PDF/CSV
- [ ] Shows running balance

---

### Story 2.1: Redeem Points at Checkout
**As a** Customer  
**I want to** use my points to get discounts  
**So that** I can save money on purchases

**Acceptance Criteria**:
- [ ] Can redeem points in cart or checkout page
- [ ] Redemption rate: 100 points = 10 SAR
- [ ] Minimum redemption: 100 points (10 SAR)
- [ ] Maximum redemption: 50% of order value
- [ ] Can only redeem in increments of 100 points
- [ ] Points deducted immediately upon redemption
- [ ] If order cancelled, points refunded automatically
- [ ] Cannot combine with some discount codes (exclusive codes)
- [ ] Can combine with campaign discounts (stackable)
- [ ] Clear UI showing points value
- [ ] Can adjust/remove redemption before checkout

---

### Story 2.2: View Redemption Options
**As a** Customer  
**I want to** see what I can get with my points  
**So that** I understand the value of my points

**Acceptance Criteria**:
- [ ] Redemption calculator in points dashboard
- [ ] Shows conversion rate clearly
- [ ] Shows savings for different point amounts
- [ ] Examples of what points can buy
- [ ] Highlights next redemption milestone
- [ ] Interactive slider to calculate value

---

### Story 2.3: Partial Redemption in Cart
**As a** Customer  
**I want to** use only some of my points  
**So that** I can save points for larger purchases

**Acceptance Criteria**:
- [ ] Can select specific number of points to redeem
- [ ] Dropdown shows common amounts (100, 200, 500, 1000)
- [ ] Can enter custom amount (must be multiple of 100)
- [ ] Shows real-time calculation of discount
- [ ] Shows remaining balance after redemption
- [ ] Can change amount before confirming
- [ ] Can remove points redemption entirely
- [ ] Redemption preserved during session

---

### Story 3.1: Points Expiration Notifications
**As a** Customer  
**I want to** be notified when my points are about to expire  
**So that** I don't lose them

**Acceptance Criteria**:
- [ ] Points expire 12 months after earning
- [ ] Email notification 30 days before expiration
- [ ] Email notification 7 days before expiration
- [ ] Push notification 3 days before expiration
- [ ] Dashboard shows expiring points prominently
- [ ] Can see expiration date for each point batch
- [ ] Points expire in FIFO order (first earned, first expired)
- [ ] Expired points removed automatically
- [ ] Transaction logged when points expire

---

### Story 3.2: Points Milestone Achievements
**As a** Customer  
**I want to** get recognition when I reach point milestones  
**So that** I feel rewarded and motivated

**Acceptance Criteria**:
- [ ] Milestones defined at: 500, 1000, 2500, 5000, 10000 points
- [ ] Badge unlocked at each milestone
- [ ] Congratulations notification sent
- [ ] Bonus points awarded at select milestones:
  - [ ] 1,000 points: +50 bonus
  - [ ] 5,000 points: +100 bonus
  - [ ] 10,000 points: +200 bonus
- [ ] Badges displayed on profile
- [ ] Progress bar to next milestone

---

## Feature Stories - Platform Admin

### Story 4.1: Configure Points Earning Rules
**As a** Brand/branch Admin  
**I want to** configure how customers earn points  
**So that** I can optimize engagement and costs

**Acceptance Criteria**:
- [ ] Can set base earning rate (points per SAR)
- [ ] Can set bonus points for specific actions:
  - [ ] Review submission
  - [ ] Referral completion
  - [ ] First purchase
  - [ ] Birthday month
  - [ ] Special events
- [ ] Can enable/disable specific earning rules
- [ ] Changes apply to new transactions only
- [ ] Can set minimum order for earning points
- [ ] Can exclude certain products/categories (future)
- [ ] All changes logged in audit trail

---

### Story 4.2: Configure Points Redemption Rules
**As a** Brand/branch Admin  
**I want to** configure redemption rules  
**So that** I can control discount costs

**Acceptance Criteria**:
- [ ] Can set redemption rate (points to SAR)
- [ ] Can set minimum redemption points
- [ ] Can set maximum redemption percentage per order
- [ ] Can set redemption increment (e.g., multiples of 100)
- [ ] Can enable/disable redemption entirely
- [ ] Can set blackout dates (no redemption)
- [ ] Changes apply immediately
- [ ] All changes logged

---

### Story 4.3: Set Points Expiration Policy
**As a** Brand/branch Admin  
**I want to** configure when points expire  
**So that** I can manage liability and encourage activity

**Acceptance Criteria**:
- [ ] Can set expiration period (months)
- [ ] Default: 12 months from earning date
- [ ] Can set different expiration for bonus points
- [ ] Can enable/disable expiration entirely
- [ ] Can configure notification timing (30, 7, 3 days before)
- [ ] Can manually extend expiration for specific users
- [ ] Automated job runs daily to expire points
- [ ] All expirations logged

---

### Story 4.4: View Loyalty Program Analytics
**As a** Brand/branch Admin  
**I want to** see analytics for the loyalty program  
**So that** I can measure its effectiveness

**Acceptance Criteria**:
- [ ] Dashboard shows key metrics:
  - [ ] Total points issued (all-time, this month)
  - [ ] Total points redeemed
  - [ ] Total points expired
  - [ ] Active points balance (liability)
  - [ ] Redemption rate (redeemed / issued)
  - [ ] Average points per customer
  - [ ] Top point earners
  - [ ] Points breakage rate (expired / issued)
  - [ ] Cost of points program
  - [ ] ROI calculation
- [ ] Can filter by date range
- [ ] Visual charts and graphs
- [ ] Can export reports
- [ ] Trend analysis

---

### Story 4.5: Manual Points Adjustment
**As a** Brand/branch Admin  
**I want to** manually adjust customer points  
**So that** I can handle special cases and corrections

**Acceptance Criteria**:
- [ ] Can add or subtract points for any customer
- [ ] Must provide reason for adjustment
- [ ] Adjustment categories:
  - [ ] Compensation for issue
  - [ ] Error correction
  - [ ] Promotional bonus
  - [ ] Fraud reversal
  - [ ] Other (text required)
- [ ] Confirmation required for adjustments
- [ ] Customer notified of adjustment
- [ ] All adjustments logged with admin ID
- [ ] Adjustment appears in customer's transaction history
- [ ] Can bulk adjust for multiple users (CSV upload)

---

### Story 4.6: View Points Impact on Orders
**As a** Brand/branch Admin  
**I want to** see how loyalty points affect my revenue  
**So that** I understand my earnings

**Acceptance Criteria**:
- [ ] Can see orders where points were redeemed
- [ ] Shows original amount and discount from points
- [ ] Shows tailor commission (calculated on final amount)
- [ ] Can filter orders by points usage
- [ ] Dashboard shows total points impact
- [ ] Clear explanation of commission calculation

---

## Technical Stories

### Tech Story 1: Points Database Schema
**As a** Backend Developer  
**I want to** implement the loyalty points database schema  
**So that** we can track points accurately

**Acceptance Criteria**:
- [ ] Create `loyalty_points` table for balances
- [ ] Create `points_transactions` table for history
- [ ] Create `points_rules` table for configuration
- [ ] Create `points_expiration` table for tracking expiry
- [ ] Add indexes on frequently queried fields
- [ ] Implement constraints (balance can't be negative)
- [ ] Add triggers for balance updates
- [ ] Write migration scripts
- [ ] Seed with test data

**Database Schema**:
```sql
-- User Points Balance
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  total_earned INT DEFAULT 0,
  total_redeemed INT DEFAULT 0,
  total_expired INT DEFAULT 0,
  current_balance INT DEFAULT 0 CHECK (current_balance >= 0),
  pending_points INT DEFAULT 0, -- From undelivered orders
  last_transaction_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Points Transactions
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  transaction_type ENUM('earn', 'redeem', 'expire', 'adjust'),
  points INT NOT NULL,
  balance_after INT NOT NULL,
  source_type ENUM('purchase', 'review', 'referral', 'bonus', 'adjustment', 'expiration'),
  reference_id UUID, -- Order ID, Review ID, etc.
  description TEXT,
  order_amount DECIMAL(10,2), -- For earning from purchases
  expires_at TIMESTAMP, -- For earned points
  created_at TIMESTAMP DEFAULT NOW()
);

-- Points Configuration Rules
CREATE TABLE points_rules (
  id UUID PRIMARY KEY,
  rule_type VARCHAR(50) UNIQUE NOT NULL,
  rule_name VARCHAR(255),
  points_value INT,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB, -- Additional configuration
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Points Expiration Tracking
CREATE TABLE points_expiration (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  transaction_id UUID REFERENCES points_transactions(id),
  points INT,
  earned_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_expired BOOLEAN DEFAULT FALSE,
  expired_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_points_user ON loyalty_points(user_id);
CREATE INDEX idx_transactions_user ON points_transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_type ON points_transactions(transaction_type);
CREATE INDEX idx_expiration_user ON points_expiration(user_id, expires_at);
CREATE INDEX idx_expiration_pending ON points_expiration(expires_at) 
  WHERE is_expired = FALSE;

-- Trigger to update balance
CREATE OR REPLACE FUNCTION update_points_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE loyalty_points
  SET 
    total_earned = CASE 
      WHEN NEW.transaction_type = 'earn' 
      THEN total_earned + NEW.points 
      ELSE total_earned 
    END,
    total_redeemed = CASE 
      WHEN NEW.transaction_type = 'redeem' 
      THEN total_redeemed + ABS(NEW.points) 
      ELSE total_redeemed 
    END,
    total_expired = CASE 
      WHEN NEW.transaction_type = 'expire' 
      THEN total_expired + ABS(NEW.points) 
      ELSE total_expired 
    END,
    current_balance = NEW.balance_after,
    last_transaction_at = NEW.created_at,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER points_balance_update
AFTER INSERT ON points_transactions
FOR EACH ROW
EXECUTE FUNCTION update_points_balance();
```

**Story Points**: 5  
**Priority**: Must Have  
**Dependencies**: None

---

### Tech Story 2: Points Earning Engine
**As a** Backend Developer  
**I want to** implement automatic points earning on purchases  
**So that** customers are rewarded correctly

**Acceptance Criteria**:
- [ ] API endpoint for points calculation
- [ ] Automatic points credit on order delivery
- [ ] Handle refunds (deduct points)
- [ ] Track pending points for undelivered orders
- [ ] Points expiration tracking on earning
- [ ] Atomic transactions for points operations
- [ ] Event-driven architecture (order.delivered event)
- [ ] Write comprehensive tests

---

### Tech Story 3: Points Redemption Engine
**As a** Backend Developer  
**I want to** implement points redemption at checkout  
**So that** customers can use their points

**Acceptance Criteria**:
- [ ] API endpoint for redemption validation
- [ ] API endpoint for applying points to order
- [ ] Enforce redemption rules (min, max, increments)
- [ ] Handle refunds (credit points back)
- [ ] Use FIFO for points consumption (oldest first)
- [ ] Atomic transactions
- [ ] Write comprehensive tests

---

### Tech Story 4: Points Expiration Job
**As a** Backend Developer  
**I want to** implement automated points expiration  
**So that** points expire according to policy

**Acceptance Criteria**:
- [ ] Daily cron job to check expiring points
- [ ] Expire points based on configuration
- [ ] Send notifications before expiration
- [ ] Create expiration transactions
- [ ] Update balances atomically
- [ ] Log all expirations
- [ ] Handle edge cases (user deleted, etc.)
- [ ] Monitor job performance

---

### Tech Story 5: Points Analytics & Reporting
**As a** Backend Developer  
**I want to** implement analytics for loyalty program  
**So that** admins can track performance

**Acceptance Criteria**:
- [ ] Daily aggregation of points metrics
- [ ] API endpoints for analytics retrieval
- [ ] Metrics tracked:
  - [ ] Total points issued
  - [ ] Total points redeemed
  - [ ] Total points expired
  - [ ] Active points balance (liability)
  - [ ] Redemption rate
  - [ ] Breakage rate
  - [ ] Average points per user
  - [ ] Top earners/redeemers
- [ ] Trend analysis
- [ ] Export functionality
- [ ] Caching for performance

**Analytics Schema**:
```sql
CREATE TABLE points_analytics (
  id UUID PRIMARY KEY,
  date DATE UNIQUE,
  points_issued INT DEFAULT 0,
  points_redeemed INT DEFAULT 0,
  points_expired INT DEFAULT 0,
  active_balance INT,
  unique_earners INT,
  unique_redeemers INT,
  avg_points_per_user DECIMAL(10,2),
  redemption_rate DECIMAL(5,2), -- redeemed / issued
  breakage_rate DECIMAL(5,2), -- expired / issued
  total_liability DECIMAL(10,2), -- active balance in SAR
  created_at TIMESTAMP DEFAULT NOW()
);

---

## Edge Cases & Special Considerations

### Concurrent Redemption
```
Scenario: User has 500 points
         Tries to redeem 300 points in two tabs simultaneously

Solution:
- Database row locking (SELECT FOR UPDATE)
- Atomic transaction
- Second request fails with "Insufficient balance"
```

### Order Refund After Points Spent
```
Scenario: Customer earns 50 points, redeems them, 
         then returns original order

Solution:
1. Deduct original 50 earned points
2. If balance goes negative, set to 0
3. Record adjustment transaction
4. Notify customer of deduction
```

### Points Expiring Mid-Checkout
```
Scenario: Customer selects 500 points to redeem
         Points expire while filling checkout form

Solution:
- Revalidate points at final checkout
- Show warning if points reduced
- Allow customer to adjust redemption
- Don't block checkout
```

### Fraud Prevention
```
Detection:
- Multiple accounts from same device/IP
- Unusual earning patterns
- Rapid earn-redeem cycles
- Reviewing non-purchased orders

Prevention:
- Link accounts by device fingerprint
- Require delivery before crediting
- Manual review for suspicious patterns
- Limit redemption for new accounts
```