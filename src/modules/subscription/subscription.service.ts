import config from "../../config";
import { prisma } from "../../lib/prisma"
import stripe from "../../lib/stripe";

const createCheckoutSession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            const user = await tx.user.findUniqueOrThrow({
                where: {
                    id: userId
                },
                include: {
                    subscription: true
                }
            });

            // old subscriber  // check the subscriber already exists
            let stripCustomerId = user.subscription?.stripeCustomerId;

            // new new subscriber
            if (!stripCustomerId) {
                // crate customer using stripe 
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: user.name,
                    metadata: { userId: user.id }
                })
                stripCustomerId = customer.id
            }

            const session = await stripe.checkout.sessions.create({

                line_items: [
                    {
                        price: config.stripe_price_id,
                        quantity: 1
                    }
                ],

                mode: "subscription",
                customer: stripCustomerId,
                payment_method_types: ["card"],
                success_url: `${config.app_url}/premium?success=ture`,
                cancel_url: `${config.app_url}/payment?success=false`,
                metadata: { userId: user.id }
            })

            return session.url

        });

    return {
        paymentUrl: transactionResult
    }
}

export const subscriptionServices = {
    createCheckoutSession
} 