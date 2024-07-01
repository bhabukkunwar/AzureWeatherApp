const axios = require('axios');
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config()

const city = process.env.city;
const app_id = process.env.app_id;

app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/', (req, res) => {
    axios.get(`http://api.openweathermap.org/data/2.5/forecast`,{
        params: {'q':`${city}`,'appid':`${app_id}`, 'units':'metric' }
    })
        .then(response => {
            const headerDate = response.headers && response.headers.date ? response.headers.date : 'no response date';
            console.log('Status Code:', response.status);
            console.log('Date in Response header:', headerDate);
        
            const data = response.data;
            res.render('weather',{data: data});
        })
        .catch(err => {
            console.log('Error: ', err.message);
            // res.render("Error")
        });
})

app.listen(80, () => {
    console.log(`Example app listening on port 80`)
})
