const express = require("express");
const cors = require("cors")
const stripe = require("stripe")("sk_test_51QSd2dFs25x7V0wa4CCSoVcSfZ6aP5nxGxVaMBcESN0rYWgBb5qLof8cNIC1RII6qKHdXjF2oEk8roM3kMiVBvMK00SXVgj69d")

const app = express();

app.use(express.json());
app.use(cors()); 

//checkout api for payment 
app.post("/api/create-checkout-session", async(req, res)=> {
    const {products} = req.body;
    console.log(products);
    

    const lineItems = products.map((product) => ({
        price_data: {
            currency : "pkr",
            product_data: {
                name: product.dish
            },
            unit_amount: product.price * 100,
        },
        quantity: product.qnty
    }))
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel" ,
    });
    res.json({id:session.id})
})


app.listen(7000, ()=> {
    console.log("Server is running on port 7000");
    
})
