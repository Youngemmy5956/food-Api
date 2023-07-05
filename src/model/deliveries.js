import mongoose from "mongoose";

const deliverySchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },

});

const Delivery_model = mongoose.model("Deliveries", deliverySchema);
