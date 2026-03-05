const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    sessionId: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orders = mongoose.model('orders', orderSchema);

module.exports = orders;
