import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 8, required: true },
    // orders: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Orders",
    //   },
    // ],
    // cart: [
    //   {
    //     food: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Food",
    //     },

    //     quantity: { type: Number, required: true },
    //   },
    // ],
  },
//   { timestamps: true }
);

const Customer_model = mongoose.model("Customers", customerSchema);

export default Customer_model;