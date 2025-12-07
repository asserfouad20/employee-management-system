const express = require('express');
const session = require('express-session');
const app = express();

// Allow server to read POST form data
app.use(express.urlencoded({ extended: true }));

/*
===========================================================
= SESSION SETUP — "THE MALL PASS SYSTEM"
===========================================================
When a user logs in, the server gives them a "mall pass card".
This card is stored in a cookie (browser).
The server also keeps a file in the "security office" (session store)
that contains the user's details.
*/
app.use(
    session({
        secret: 'supersecretkey', // Like the ink used on the mall pass card
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 } // 1 hour pass validity
    })
);


/*
===========================================================
= AUTH MIDDLEWARE — "MALL SECURITY GUARD"
===========================================================
Before entering any protected shop (like /cart or /checkout),
the guard checks:
1) Do you have a mall pass card? (session cookie)
2) Does the card match a valid session file?
If yes → enter.
If no → go back to login.
*/
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.send("❌ You must log in first. Go back to /login");
    }
    next(); // Guard lets you enter the shop
}


/*
===========================================================
= LOGIN PAGE (Just a simple form)
===========================================================
User types their username + password.
*/
app.get('/login', (req, res) => {
    res.send(`
        <form action="/login" method="POST">
            <h2>Login to E-Commerce</h2>
            <input name="username" placeholder="Username" required /><br>
            <input name="password" placeholder="Password" type="password" required /><br>
            <button type="submit">Login</button>
        </form>
    `);
});


/*
===========================================================
= LOGIN HANDLER — "SECURITY CHECKS ID"
===========================================================
If login is correct:
- The server creates a session file in the "security office"
- The browser receives a session ID (mall pass)

For simplicity:
username: asser
password: 1234
*/
app.post('/login', (req, res) => {
    const { username, password } = req.body; // req.body -> Object that contains all the data sent to the server

    // Simple fake authentication
    if (username === 'asser' && password === '1234') {

        // Create the user's "session file" in the security office
        req.session.user = {
            username: username,
            cart: []
        };

        return res.send(`🎉 Welcome ${username}! <br> Go to /products`);
    }

    res.send("❌ Wrong username or password. Try again.");
});


/*
===========================================================
= PRODUCTS PAGE — PUBLIC SHOP
===========================================================
Everyone can enter. No guard needed.
*/
app.get('/products', (req, res) => {
    res.send(`
        <h1>Products</h1>
        <a href="/add-to-cart/laptop">Add Laptop to Cart</a><br>
        <a href="/add-to-cart/phone">Add Phone to Cart</a><br><br>

        <a href="/cart">Go to Cart</a>
    `);
});


/*
===========================================================
= ADD TO CART — PROTECTED SHOP
===========================================================
Only logged-in users can add items to their cart.
The guard (requireLogin) checks for a valid session.
*/
app.get('/add-to-cart/:item', requireLogin, (req, res) => {
    req.session.user.cart.push(req.params.item); // req.params.item -> If someone visited /add-to-cart/:iphones then req.params.item will be "iphones"
    res.send(`🛒 Added ${req.params.item} to cart!<br><br><a href="/cart">View Cart</a>`);
});


/*
===========================================================
= CART — PROTECTED ROUTE
===========================================================
Only logged-in users with session can see their cart.
*/
app.get('/cart', requireLogin, (req, res) => {
    res.send(`
        <h1>Your Cart:</h1>
        <p>${req.session.user.cart.join(', ') || "Cart is empty"}</p>
        <br>
        <a href="/logout">Logout</a>
    `);
});


/*
===========================================================
= LOGOUT — "RETURNING THE MALL PASS"
===========================================================
Destroy session file + remove cookie.
User is fully logged out.
*/
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid'); // Remove mall pass card
        res.send("👋 You are logged out. See you again! <br>Go to /login");
    });
});


/*
===========================================================
= START THE SERVER — "OPEN THE SHOPPING MALL"
===========================================================
*/
app.listen(3000, () => {
    console.log("🟢 Server running on http://localhost:3000");
});
