import mongoose from "mongoose";

const deliverySchema = mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true  },
    lastName: { type: String, required: true  },
    address: { type: String , required: true },
    phone: { type: String, required: true },

});

const Delivery_model = mongoose.model("Deliveries", deliverySchema);

export default Delivery_model;
