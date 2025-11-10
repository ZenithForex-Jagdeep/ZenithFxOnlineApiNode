const FormData = require('form-data');
const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const Common = require('./Common.js');
const { is } = require('express/lib/request');

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

app.post('/calculatecharges/:key', async (req, res) => {
    //validate authorisation
    let isok = true;
    let responseObj = {};
    let errMsg = '';
    let respCode = 200;
    //validtae USER KEY
    if (req.params.key !== 'f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp') {
        isok = false;
        respCode = 401;
        console.log("401 - Unauthorized access");
    }
    const reqObj = req?.body;
    //validate request 
    if (isok && reqObj?.request_type !== 'Charges') {
        isok = false;
        respCode = 404;
        errMsg = "Method Not Found";
        console.log("404 Method Not Found");
    } else if (isok && reqObj?.request_type === 'Charges') {
        reqObj.request_type = "ChargesByStateCode";
    }
    //validate request fields
    if (isok) {
        let i = 0;
        let msg = [];
        msg[i++] = 'Request Object ERROR';
        !reqObj?.remitter_pan && (msg[i++] = "Remmiter PAN can not be EMPTY.");
        reqObj?.remitter_pan && !Common.validatePan(reqObj?.remitter_pan) && (msg[i++] = "Remmiter PAN is not valid.");
        reqObj?.isd.length !== 3 && (msg[i++] = "ISD not is valid.");
        parseInt(reqObj?.quantity) <= 0 && (msg[i++] = "quantity should be greater then 0.");
        reqObj?.sale_rate <= 0 && (msg[i++] = "sale_rate should be greater then 0.");
        !(reqObj?.educationloan_yn === 'N' || reqObj?.educationloan_yn === 'Y') && (msg[i++] = "educationloan_yn Either Y or N.");
        !reqObj?.branch && (msg[i++] = "branch can not be Empty.");
        !reqObj?.remitter_state && (msg[i++] = "remitter_state can not be Empty.");
        if (i > 1) {
            isok = false;
            errMsg = msg.join(' /n ');
            respCode = 400;
            console.log('Error while fetching live rates' + errMsg);
            // return res.status(400).json({ Result: "failed", error: msg });
        }
    }
    try {
        //create response formate
        if (isok) {
            const obj = {
                requesttype: reqObj.request_type,
                quantity: reqObj.quantity,
                salerate: reqObj.sale_rate,
                isd: reqObj.isd,
                remitterpan: reqObj.remitter_pan,
                purpose: reqObj.purpose,
                educationloanYN: reqObj.educationloan_yn,
                branchCode: reqObj.branch,
                remitterState: reqObj.remitter_state
            }
            const formData = new FormData();
            formData.append('request', JSON.stringify(obj));
            //basic logic
            const response = await axios.post('http://localhost:1002/api/api_zeneremit_a.php', formData, {
                headers: { Authkey: 'A9X2L7QJ4M8ZD5T1WB3N6CY0EFVGHR' },
            });
            console.log(response.data);
            const returnObj = response.data;
            if (returnObj.MSGCODE === 1) {
                respCode = 200;
                responseObj.this_forex = returnObj.thisForex;
                responseObj.earlier_forex = returnObj.earlierForex;
                responseObj.GST = returnObj.GST;
                responseObj.TCS = returnObj.TCS;
                responseObj.bank_charges = returnObj.bankCharges;
                responseObj.IGST = returnObj.IGST;
                responseObj.UGST = returnObj.UGST;
                responseObj.CGST = returnObj.CGST;
                responseObj.SGST = returnObj.SGST;
            } else {
                respCode = 400;
                errMsg = returnObj.MSGTEXT;
            }
            // res.status(200).json(respObj);
        }
        return res.status(respCode).json({ response_code: respCode, ...responseObj, Error: errMsg });
    } catch (err) {
        console.log('Error while fetching live rates' + err);
        res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
    }
});

app.post('/panvalidation/:key', async (req, res) => {
    //validate authorisation
    let isok = true;
    let responseObj = {};
    let errMsg = '';
    let respCode = 200;
    if (req.params.key !== 'f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp') {
        isok = false;
        respCode = 401;
        console.log("401 - Unauthorized access");
        errMsg = 'Unauthorized access';
        // return res.status(401).json({ error: 'Unauthorized access' });
    }
    try {
        const reqObj = req.body;
        console.log(reqObj);
        if (isok) {
            let i = 0;
            let msg = [];
            // msg[i++] = 'Request Object ERROR';
            !reqObj?.pan && (msg[i++] = "PAN can not be EMPTY.");
            reqObj?.pan && !Common.validatePan(reqObj?.pan) && (msg[i++] = "PAN is not valid.");
            !reqObj?.name && (msg[i++] = "Remmiter Name can not be Empty.");
            !Common.validateDate(reqObj?.dob) && (msg[i++] = "Date Formate should be in DD/MM/YYYY formate.");
            //validate request 
            if (i > 0) {
                isok = false;
                errMsg = msg.join(' /n ');
                respCode = 400;
                console.log('Error while fetching live rates' + msg);
                // return res.status(400).json({ Result: "failed", error: msg.join(' /n ') });
            }
        }
        if (isok) {
            const obj = {
                requesttype: "validatePan",
                pan: reqObj.pan,
                name: reqObj.name,
                fatherName: reqObj.father_name,
                dob: reqObj.dob
            }
            const formData = new FormData();
            formData.append('request', JSON.stringify(obj));
            //basic logic
            const response = await axios.post('http://localhost:1002/api/api_zeneremit_a.php', formData, {
                headers: {
                    Authkey: 'A9X2L7QJ4M8ZD5T1WB3N6CY0EFVGHR',
                },
            });
            console.log(response.data);
            let resObj = response.data;
            if (resObj?.MSGCODE == 1) {
                respCode = 200;
                responseObj = { ...resObj?.response };
            } else {
                respCode = 400;
                errMsg = resObj?.MSGTEXT;
            }
        }
        return res.status(respCode).json({ response_code: respCode, ...responseObj, Error: errMsg });
    } catch (err) {
        console.log('Error while fetching live rates' + err.message.json());
        return res.status(500).json({ response_code: 500, error: 'failed to provided rates' });
    }
});

app.post('/forexrate/:key/', async (req, res) => {
    let isok = true;
    let responseObj = {};
    let errMsg = '';
    let respCode = 200;
    //validate authorisation
    if (isok && req.params.key !== 'Oh7JFPOzosq6VM8IYguWw1fCfVWVPuUCEtCC0mQfLXwf0GuhJ6') {
        console.log("401 - Unauthorized access");
        isok = false;
        respCode = 401;
        errMsg = 'Unauthorized access';
        // return res.status(401).json({ error: 'Unauthorized access' });
    }
    //validate request
    if (isok) {
        const reqObj = req.body;
        console.log(reqObj);
        if (reqObj?.isd.length !== 3) {
            isok = false;
            respCode = 400;
            errMsg = "ISD not is valid.";
            console.log('EInvalid ISD' + reqObj?.isd);
            // return res.status(400).json({ Result: "failed", error: "ISD not is valid." });
        }
    }
    try {
        if (isok) {
            const response = await axios.get('https://api.eforexindia.com/Currency/json/Oh7JFPOzosq6VM8IYguWw1fCfVWVPuUCEtCC0mQfLXwf0GuhJ6/' + reqObj.isd.toUpperCase() + '/');
            if (typeof response?.data === "undefined") {
                isok=false;
                respCode=500;
                errMsg='failed to provided rates';
                console.log("failed to provided rates 01");
                // res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
            } else {
                if (response?.data?.message === 'ok') {
                    responseObj = {
                        "Result": response.data.Result,
                        "message": response.data.message,
                        "CurrencyCode": response.data.detail[0].CurrencyCode,
                        "INRBuy": response.data.detail[0].INRBuy,
                        "INRSell": response.data.detail[0].INRSell,
                        "USDBuy": response.data.detail[0].USDBuy,
                        "USDSell": response.data.detail[0].USDSell
                    }
                } else {
                    responseObj = {
                        "Result": response.data.Result,
                        "message": response.data.message,
                        "CurrencyCode": req.params.isd,
                    }
                }
                console.log(responseObj);
            }
        }
        return res.status(respCode).json({ response_code: respCode, ...responseObj, Error: errMsg });
    } catch (err) {
        console.log('Error while fetching live rates' + err?.message);
        res.status(500).json({ Result: "failed", error: 'failed to provided rates' });
    }

});

app.use((req, res) => {
    console.log("404 - Not Found 01");
    res.status(404).send("404 - Not Found");
});

app.listen(port, () => {
    console.log('rates app listing on ' + port);
})