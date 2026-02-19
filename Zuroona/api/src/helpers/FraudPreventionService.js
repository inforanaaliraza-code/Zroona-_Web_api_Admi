const FraudPreventionService = {
    validateAmount(amount, expectedAmount) {
        return amount === expectedAmount;
    },

    checkSuspiciousIp(userIp) {
        const suspiciousIps = ['192.168.1.100', '10.0.0.1'];
        return suspiciousIps.includes(userIp);
    },

    checkFailedAttempts(_userId) {
        const failedAttempts = this.getFailedAttempts(_userId);
        return failedAttempts > 3;
    },

    getFailedAttempts(_userId) {
        return Math.floor(Math.random() * 5);
    },

    performFraudChecks(paymentDetails, expectedAmount) {
        if (!this.validateAmount(paymentDetails.amount, expectedAmount)) {
            console.log('Fraud: Amount mismatch');
            return false;
        }

        if (this.checkSuspiciousIp(paymentDetails.userIp)) {
            console.log('Fraud: Suspicious IP detected');
            return false;
        }

        if (this.checkFailedAttempts(paymentDetails.userId)) {
            console.log('Fraud: Too many failed attempts');
            return false;
        }

        return true;
    }
}

module.exports = FraudPreventionService