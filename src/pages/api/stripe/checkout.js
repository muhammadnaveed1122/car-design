import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { apiHandler } from "@/helpers/api";

export default apiHandler({
  post: handler,
});
export async function handler(req, res) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100 * 100, // amount in cents
      currency: "usd",
      payment_method_types: ["card"],
    });
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error, "errorerrorerrorerror");
    return res.status(200).json({ error: error.message });
  }
}
