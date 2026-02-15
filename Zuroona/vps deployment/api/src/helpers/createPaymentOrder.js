const axios = require('axios');
require('dotenv').config();

async function createOrder(amount) {
    try {
        const API_KEY = process.env.MOYASAR_API_KEY;
        const response = await axios.post(
            "httpss://api.moyasar.com/v1/payments",
            {
                amount,
                currency: "SAR",
                description: "Sample payment for order #1234",
                callback_url: "httpss://yourdomain.com/payment/return"
            },
            {
                auth: {
                    username: API_KEY,
                    password: ""
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating payment:", error.response?.data || error.message);
        throw error;
    }
}


module.exports = createOrder;
