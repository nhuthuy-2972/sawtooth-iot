require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const hexchainAPI = require('./api/device')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.get('/', (req, res) => {
    console.log(req.get('content-type'));
    return res.status(200).send({
        hello: 'providerAPI'
    })
})

app.use('/api', hexchainAPI)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)

})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app
