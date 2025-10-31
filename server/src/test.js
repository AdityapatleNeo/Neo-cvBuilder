const Razorpay = require("razorpay");
require("dotenv").config();

const key_id = 'rzp_test_RM8kd9Lzbkj1hG'
const key_secret = 'S31fdU3ma118S9d5sCTmoSV'

console.log("Using credentials:", { key_id, key_secret_hidden: !!key_secret });

const razorpay = new Razorpay({ key_id, key_secret });

razorpay.orders
  .create({ amount: 100, currency: "INR", receipt: "test" })
  .then((order) => console.log(" Success:", order.id))
  .catch((err) => console.error("Failed:", err.response?.data || err));