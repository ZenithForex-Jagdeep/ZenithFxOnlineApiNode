const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');

app.use(express.json());

app.get('/liverates/:key', async (req, res) => {
    if (req.params.key === 'f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp' && 1 === 2) {
        try {
            const response = await axios.get('https://api.eforexindia.com/Currency/json/Oh7JFPOzosq6VM8IYguWw1fCfVWVPuUCEtCC0mQfLXwf0GuhJ6/');
            res.json(response.data);
        } catch (err) {
            console.error('Error fetching external api ' + err.message);
            res.status(500).json({ Result: "failed", error: 'Failed to provided rates' });
        }
    } else {
        res.status(404).json({ error: 'Not Found 404' });
    }
});

app.get('/liverates/:key/:isd', async (req, res) => {
    if (req.params.key === 'f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp') {
        try {
            const response = await axios.get('https://api.eforexindia.com/Currency/json/Oh7JFPOzosq6VM8IYguWw1fCfVWVPuUCEtCC0mQfLXwf0GuhJ6/' + req.params.isd.toUpperCase() + '/');
            //console.log(response);
            //res.json(response.data);
            if (typeof response.data === "undefined") {
                console.log("failed to provided rates 01");
                res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
            } else {
                let response1 = {};
                if (response.data.message === 'ok') {
                    response1 = {
                        "Result": response.data.Result,
                        "message": response.data.message,
                        "CurrencyCode": response.data.detail[0].CurrencyCode,
                        "INRBuy": response.data.detail[0].INRBuy,
                        "INRSell": response.data.detail[0].INRSell,
                        "USDBuy": response.data.detail[0].USDBuy,
                        "USDSell": response.data.detail[0].USDSell
                    }
                } else {
                    response1 = {
                        "Result": response.data.Result,
                        "message": response.data.message,
                        "CurrencyCode": req.params.isd,
                    }
                }
                console.log(response1);
                res.json(response1);
            }


        } catch (err) {
            console.log('Error while fetching live rates' + err.message);
            res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
        }
    } else {
        console.log("404 - Not Found 02");
        res.status(404).json({ error: 'Not Found 404' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ msg: 'Everything OK' });
});

app.get('/calculatecharges/:key', async (req, res) => {
    //validate authorisation
    if (req.params.key !== 'f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp') {
        console.log("401 - ");
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    try {
        //validate request mathode
        const reqObj = req.body;
        console.log(reqObj);
        if (resObj.requesttype === 'Charges') {
            //basic logic


            res.status(200).json({
                MSGCODE: 1,
                thisForex: 67780,
                earlierForex: 0,
                GST: 122,
                TCS: 0,
                bankCharges: 0,
                GSTB1: 122,
                GSTB2: 0
            });
        } else {
            console.log("404 Method Not Found");
            throw new Error({code : 404, err:"Method Not Found"});
        }
    } catch (err) {
        console.log('Error while fetching live rates' + err);
        res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
    }
});

app.get('/panvalidation/:key', async (req, res) => {
    // res.status(200).json({ msg: 'Everything OK' });
    if (req.params.key === 'f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp') {
        try {
            //validate request
            const reqObj = req.body;
            console.log(reqObj);
            res.status(200).json({
                response_Code: 1,
                outputData: [
                    {
                        pan: "AABCB6210B",
                        pan_status: "E",
                        name: "Y",
                        fathername: "",
                        dob: "Y",
                        seeding_status: "NA"
                    }
                ]
            });
        } catch (err) {
            console.log('Error while fetching live rates' + err.message);
            res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
        }
    } else {
        console.log("404 - Not Found 02");
        res.status(404).json({ error: 'Not Found 404' });
    }
});

app.get('/forexrate/:key/',async (req, res) => {
    // res.status(200).json({ msg: 'Everything OK' });
    if (req.params.key === 'f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp') {
        try {
            //validate request
            const reqObj = req.body;
            console.log(reqObj);
            const response = await axios.get('https://api.eforexindia.com/Currency/json/Oh7JFPOzosq6VM8IYguWw1fCfVWVPuUCEtCC0mQfLXwf0GuhJ6/' + reqObj.ISD.toUpperCase() + '/');
            if (typeof response.data === "undefined") {
                console.log("failed to provided rates 01");
                res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
            } else {
                let response1 = {};
                if (response.data.message === 'ok') {
                    response1 = {
                        "Result": response.data.Result,
                        "message": response.data.message,
                        "CurrencyCode": response.data.detail[0].CurrencyCode,
                        "INRBuy": response.data.detail[0].INRBuy,
                        "INRSell": response.data.detail[0].INRSell,
                        "USDBuy": response.data.detail[0].USDBuy,
                        "USDSell": response.data.detail[0].USDSell
                    }
                } else {
                    response1 = {
                        "Result": response.data.Result,
                        "message": response.data.message,
                        "CurrencyCode": req.params.isd,
                    }
                }
                console.log(response1);
                res.json(response1);
            }
        } catch (err) {
            console.log('Error while fetching live rates' + err.message);
            res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
        }
    } else {
        console.log("404 - Not Found 02");
        res.status(404).json({ error: 'Not Found 404' });
    }
});

app.use((req, res) => {
    console.log("404 - Not Found 01");
    res.status(404).send("404 - Not Found");
});

app.listen(port, () => {
    console.log('rates app listing on ' + port);
})