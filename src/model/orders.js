import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendors" },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Foods" },
    items:  [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Foods",
            },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    paidAmout: { type: Number, required: true },
    orderDate: { type: Date, required: true },  
    status: { type: String, required: true },
    remarks: { type: String, required: true },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
});


const Order = mongoose.model("Order", orderSchema);

export default Order;

// Path: src\model\orders.js
// Compare this snippet from src\model\users.js:
// import mongoose from "mongoose";
