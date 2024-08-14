const axios = require('axios');
const { log } = require('console');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config()


const app_id = process.env.app_id;
const port = 80;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/weather', async (req, res) => {
    const { city } = req.body
        //Call an API (e.g., OpenWeatherMap) using axios
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
            res.status(500).send('Error fetching weather data. Check your city name and please try again later.');
        });
})

app.get("/", (req, res)=>{
    res.render("city", res)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
