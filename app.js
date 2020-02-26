const express = require('express')
const request = require('request')

const app = express()
const baseGoogleUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='
const endGoogleUrl = '&inputtype=textquery&fields=geometry&key=AIzaSyB8KZZQcWwvgVaErPux7jjl1RnsVs8EuTg'



// let checkUserAddress = () => {

//     fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressParameter}&key=AIzaSyB8KZZQcWwvgVaErPux7jjl1RnsVs8EuTg`)
// }
const createSearchParameter = (input) => {
    return input.split(' ').join('+')
}


const combineAllUrls = (q) => {
    return baseGoogleUrl + q + endGoogleUrl
}


app.get('/searchAddress', (req, res) => {
    console.log(createSearchParameter(req.query.q))
    console.log(combineAllUrls(req.query.q))
})



app.listen(3001, () => console.log('listening on 3001'))