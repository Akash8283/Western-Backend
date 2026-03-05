exports.createCheckoutSession = async (req, res) => {
    const { products } = req.body;

    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const lineItems = products.map((product) => {
            const imageData = product.image || product.img;
            // Stripe has a 2048 char limit on images. Base64 strings will blow this up.
            // Only include images if they are reasonably short URLs.
            const validImages = imageData && imageData.length < 2000 ? [imageData] : [];

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: validImages,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: product.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/checkout`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error("Stripe Session Error:", err);
        res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
};
