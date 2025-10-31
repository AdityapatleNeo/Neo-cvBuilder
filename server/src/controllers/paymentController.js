
const Razorpay = require("razorpay")
  const crypto = require('crypto')
const dotenv = require('dotenv')


dotenv.config();

const razorpay = new Razorpay({
  key_id: 'rzp_test_RM8kd9Lzbkj1hG' ||process.env.RAZORPAY_KEY_ID,
  key_secret: 'yS31fdU3ma118S9d5sCTmoSV' || process.env.RAZORPAY_KEY_SECRET,
});
const axios =  require("axios");

exports.createOrder = async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const options = {
      amount: 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const response = await axios.post(
      "https://api.razorpay.com/v1/orders",
      options,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ message: "Failed to create order" });
  }
};



// exports.createOrder = async (req, res) => {
//   try {
//     const options = {
//       amount: 100, 
//       currency: "INR",
//       receipt: `rcreceipt#${Date.now()}`,
//     };
//     console.log(({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// }))

//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create order" });
//   }
// };

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
