import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

async function createPrice() {
  try {
    // Check if STRIPE_PRICE_ID is a product ID
    const currentId = process.env.STRIPE_PRICE_ID;
    
    if (currentId.startsWith('prod_')) {
      console.log("Detected product ID. Creating a $29 price for this product...");
      
      const price = await stripe.prices.create({
        product: currentId,
        unit_amount: 2900, // $29.00
        currency: 'usd',
        nickname: 'Email Compliance Kit - One-time',
      });
      
      console.log("\n✅ Price created successfully!");
      console.log("Price ID:", price.id);
      console.log("Amount: $" + (price.unit_amount / 100));
      console.log("\nPlease update STRIPE_PRICE_ID to:", price.id);
      
    } else if (currentId.startsWith('price_')) {
      console.log("✅ Already have a valid price ID:", currentId);
      
      const price = await stripe.prices.retrieve(currentId);
      console.log("Amount: $" + (price.unit_amount / 100));
      
    } else {
      console.log("❌ Invalid ID format. Expected prod_* or price_*");
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

createPrice();
