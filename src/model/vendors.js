import mongoose from "mongoose";

const vendorSchema = mongoose.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password:{ type: String, minLength: 8, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String },
   foodType: { type: String, required: true },
   serviceAvailable: { type: String, required: true },
   foods: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
    },
],

});

const Vendor_model = mongoose.model("Vendors", vendorSchema);
