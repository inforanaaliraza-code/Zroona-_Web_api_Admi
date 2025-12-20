async function createOrder(amount) {
    try {
        const response = await axios.post(
            "https://api.moyasar.com/v1/payments",
            {
                amount,
                currency: "SAR",
                description: "Sample payment for order #1234",
                callback_url: "https://yourdomain.com/payment/return"
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