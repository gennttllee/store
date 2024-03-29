import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        size: { type: String},
        price: { type: Number, required: true }
    }],
    shippingAddress: {
        full: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid :{type : Boolean, default : false},
    isDelivered : {type : Boolean,  default : false},
    paidAt : {type : Date},
    deliveredAt : {type : Date},
}, {
    timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;