const express = require('express')
const request = require('request')
const path = require('path')
require ('dotenv').config()

const app = express()
const baseGoogleUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='
const endGoogleUrl = `&inputtype=textquery&fields=geometry&key=${process.env.GOOGLE_KEY}`
const baseSongkickMetroUrl = `https://api.songkick.com/api/3.0/search/locations.json?location=geo:`
const endSongkickMetroUrl = `&apikey=${process.env.SONGKICK_KEY}`
const baseSongkickEventsUrl = `https://api.songkick.com/api/3.0/metro_areas/`


const createSearchParameter = (input) => {
    return input.split(' ').join('+')
}

const combineAllUrls = (q) => {
    return baseGoogleUrl + createSearchParameter(q) + endGoogleUrl
}

app.use(express.static(path.join(__dirname, 'build')))

app.get('/searchAddress', (req, res) => {
    
    request({url: combineAllUrls(req.query.q), json: true}, (err, response) => {

        if (response.body.status == "OK") {
            res.send(response.body.candidates[0].geometry.location)
        } else {
            console.log(response.body)
            res.send({error: 'Sorry, that isnt a valid location.'})
        }
    })
})

const songkickMetroUrl = (location) => {
    return baseSongkickMetroUrl + location + endSongkickMetroUrl
}

const songkickEventUrl = (metro, time) => {
    return baseSongkickEventsUrl + metro + '/calendar.json?min_date=' + time + endSongkickMetroUrl
}

app.get(`/getMetroAndEvents`, (req, res) => {
    request({url: songkickMetroUrl(req.query.location), json: true}, (err, response) => {
        const metroId = response.body.resultsPage.results.location[0].metroArea.id
        request({url: songkickEventUrl(metroId, req.query.date), json: true}, (err, response) => { 
            if (response.body.resultsPage.totalEntries === 0) {
                res.send({error: 'No results match that location.'})
            } else {
                res.send(JSON.stringify(response.body.resultsPage.results.event))
            }
        }) 
    })
})


app.listen(process.env.PORT || 3001, () => console.log('listening on ' + (process.env.PORT || '3001')))