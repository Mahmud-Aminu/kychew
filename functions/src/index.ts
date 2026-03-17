const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });

const OPAY_SECRET_KEY = process.env.VITE_OPAY_SECRET_KEY;
const OPAY_MERCHANT_ID = process.env.VITE_OPAY_MERCHANT_ID;

exports.createOpayCheckout = functions.https.onRequest((req: any, res: any) => {
    cors(req, res, async () => {
        try {
            const response = await fetch(
                "https://testapi.opaycheckout.com/api/v1/international/cashier/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${OPAY_SECRET_KEY}`,
                        "MerchantId": OPAY_MERCHANT_ID,
                    },
                    body: JSON.stringify(req.body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("OPay Error:", data);
                return res.status(400).json(data);
            }

            res.json(data);
        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
});