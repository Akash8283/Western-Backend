const orders = require('../models/orderModel');

exports.placeOrder = async (req, res) => {
    const { userId, products, totalAmount, shippingAddress, sessionId } = req.body;
    try {
        // Idempotency check: Don't create if this sessionId already exists
        if (sessionId) {
            const existingOrder = await orders.findOne({ sessionId });
            if (existingOrder) {
                return res.status(200).json(existingOrder);
            }
        }

        const newOrder = new orders({
            userId,
            products,
            totalAmount,
            shippingAddress,
            sessionId,
            status: 'Authorized'
        });
        await newOrder.save();
        res.status(200).json(newOrder);
    } catch (err) {
        console.error("Place Order Error:", err);
        res.status(500).json({ error: "Failed to place order" });
    }
};

exports.getUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const userOrders = await orders.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(userOrders);
    } catch (err) {
        console.error("Get User Orders Error:", err);
        res.status(500).json({ error: "Failed to fetch user orders" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const allOrders = await orders.find().sort({ createdAt: -1 });
        res.status(200).json(allOrders);
    } catch (err) {
        console.error("Get All Orders Error:", err);
        res.status(500).json({ error: "Failed to fetch all orders" });
    }
};
