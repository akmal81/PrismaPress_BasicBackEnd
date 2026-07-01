<!-- Video 1 -->

## 🚀 Planning Subscription Feature For Premium Content And Defining Subscription Model

1. Create Subscription model
```prisma
model Subscription {
    id String @id @default(uuid())
    userId String @unique
    user User @relation(fields: [userId], references: [id], onDelete: Cascade )
    
    currentPeriodEnd DateTime
    status SubscriptionStatus @default(ACTIVE)

    // stripe related ids

    // stripe customer id
    // stripe Subscription id

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

<!-- Video 2 -->

## 🚀 Exploring Stripe Documentation And Creating A Test Product In Stripe

### https://docs.stripe.com/get-started/use-cases/saas-subscriptions

1. Create a test product and price
## https://dashboard.stripe.com/acct_1QfBb5DghvR2KupR/test/products?active=true

2. Setup the strip
## https://docs.stripe.com/checkout/quickstart

    a. Install stripe
    ```bash
    npm install --save stripe
    ```
    B. Get strip product id and secret Id from
        Secret key From Developers => API key
        Product Id From Dashboard => Project details

        Keep it in the .env file
        and configur in config => index.ts



    C. create strip.ts in lib
     /lib
        |--strip.ts

    ```ts
    import Stripe from "stripe";

    const stripe = new Stripe(config.stripe_secret_key)

    export default stripe 
    ```

    d. Create Subscription module
    /Module
    |--Subscription
        |--subscription.route.ts
        |--subscription.controller.ts
        |--subscription.service.ts
        |--subscription.interface.ts

        -- subscription.route.ts

        ```ts
    const router = Router();
    router.post(
    "/checkout", 
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    subscriptionController.createCheckoutSession)

    export const subscriptionRoutes = router;
        ```

       
        --subscription.controller.ts

```ts
const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const result = await subscriptionServices.createCheckoutSession(userId as string)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Checkout compeleted successfully",
            data: result
        })
    }
)
```

        --subscription.service.ts



        ```ts
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
        
        ```

    E. add route to app.ts
    app.ts => 

    app.use("api/subscription", SubscriptionRoutes)


    <!-- video 5 -->
## 🚀 Understanding How Stripe Webhook Works And Installing Stripe CLI In Local Machine
https://docs.stripe.com/webhooks


1. Webbook is a strip server trigger base on a action like success paymant, fail, cancel 
2. Send a API request to Our own server to store subscription data
3. Redirect to the given url
4. Local listener when work localy
5. use remote listener when after deploy

## Local machine webhood installation
    1. npm i -g @stripe/cli
    2. stripe login
    3.Creating route

   # a. app.ts
    
    in the top of the app.use(express.json())

```ts
    app.post('api/subscription/webhook', express.raw({type: 'application/json'}), ()=>{}),

    app.use(express.json())
```  

    b. package.json
```json
    "stripe:webhook": "stripe listen --forward-to localhost:5000/api/subcription/webhook"
```

    c. run 
    ```bash
    npm run stripe:webhook
    ```
    a secret key will be given then keep and configur the key in env

    d. crate the webhook function in the app.ts 
```ts

    const endpointSecret = config.stripe_webhook_secret;


app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }), (request, response) => {


    let event = request.body;
    console.log(request.body);
    console.log(request.headers);
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature']!;
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err: any) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400).json(
                {
                    message: err.message
                }
            );
        }
    }

    console.log(event, "event after try block");
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();

}),


    ```
```bash
    stripe trigger payment_intent.succeeded
```