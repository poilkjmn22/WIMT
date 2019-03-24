var express = require('express')
const path = require('path')
var app = express()

const WIMTBLL = require('./server/BLL/WIMTBLL.js')
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname));

app.get('/getActivityList', (req, res) => {
    WIMTBLL.getActivityList(results => {
        res.json(results)
    })
    // res.json(require('./json/WIMTList.json'))
})
app.get('/getActivityClassList', (req, res) => {
    WIMTBLL.getActivityClassList(results => {
        res.json(results)
    })
    // res.json(require('./json/WIMTList.json'))
})

app.put('/addActivityRound', (req, res) => {
    WIMTBLL.addActivityRound(req.body, (results) => {
      res.json(results)
    })
})

app.put('/deleteActivity', (req, res) => {
    WIMTBLL.deleteActivity(req.body, (results) => {
      res.json(results)
    })
})

app.put('/restoreActivity', (req, res) => {
    WIMTBLL.restoreActivity(req.body, (results) => {
      res.json(results)
    })
})

app.get('/getActivityRound', (req, res) => {
    WIMTBLL.getActivityRound(req.query, results => {
        res.json(results)
    })
})

app.put('/updateActivityRound', (req, res) => {
    WIMTBLL.updateActivityRound(req.body, (results) => {
      res.json(results)
    })
})
app.listen(8091)
