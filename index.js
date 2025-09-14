const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');

app.use(express.json());

app.get('/liverates/:key', async(req,res)=>{
    if(req.params.key==='f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp' && 1===2 ){
        try{
            const response = await axios.get('https://api.eforexindia.com/Currency/json/Oh7JFPOzosq6VM8IYguWw1fCfVWVPuUCEtCC0mQfLXwf0GuhJ6/');
            res.json(response.data);
        }catch(err){
            console.error('Error fetching external api '+err.message);
            res.status(500).json({Result:"failed",error:'Failed to provided rates'});
        }
    }else{
        res.status(404).json({error:'Not Found 404'});
    }
});

app.get('/liverates/:key/:isd', async(req,res)=>{
    if(req.params.key==='f2PqY7RjVh6mKZ4N8cQd9LXwB0t5G3sMaJ1rUyHozlSnWbEkxIp'){
        try{
            const response = await axios.get('https://api.eforexindia.com/Currency/json/Oh7JFPOzosq6VM8IYguWw1fCfVWVPuUCEtCC0mQfLXwf0GuhJ6/'+req.params.isd.toUpperCase()+'/');
            //console.log(response);
            //res.json(response.data);
            if (typeof response.data === "undefined") {
                res.status(500).json({Result:"failed",error:'failed to provided rates'});
            }else{
                let response1 = {};
                if(response.data.message==='ok'){
                    response1 = {
                        "Result":response.data.Result,
                        "message":response.data.message,
                        "CurrencyCode":response.data.detail[0].CurrencyCode,
                        "INRBuy":response.data.detail[0].INRBuy,
                        "INRSell":response.data.detail[0].INRSell
                    }
                }else{
                    response1 = {
                        "Result":response.data.Result,
                        "message":response.data.message,
                        "CurrencyCode":req.params.isd,
                    }
                }
                
                res.json(response1); 
            }
            
            
        }catch(err){
            console.log('Error while fetching live rates'+err.message);
            res.status(500).json({Result:"failed",error:'failed to provided rates'});
        }
    }else{
        res.status(404).json({error:'Not Found 404'});
    }
});

app.use((req, res) => {
    res.status(404).send("404 - Not Found - ...-..");
  });

app.listen(port,()=>{
    console.log('rates app listing on '+port);
})