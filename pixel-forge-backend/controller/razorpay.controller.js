const Razorpay = require('razorpay');
const crypto = require('crypto');

// Create a Razorpay instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function to capture payment
exports.capturePayment = async (req, res) => {
    try {
        const { email, amount } = req.body;

        // Ensure email and amount are provided
        if (!email || !amount) {
            return res.status(400).json({ message: "Email and amount are required." });
        }

        // Create order options
        const options = {
            amount: parseInt(amount) * 100, // amount in the smallest currency unit (paise for INR)
            currency: "INR",
            receipt: email, // Can be any unique value to track the payment
        };

        // Create a Razorpay order
        const order = await instance.orders.create(options);

        // Log the created order response from Razorpay
        console.log(order);

        // Return the order response to the client
        return res.status(200).json(order);

    } catch (error) {
        console.error("Error in creating order:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
