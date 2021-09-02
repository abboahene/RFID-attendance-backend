const express = require('express')
const router = express.Router()
const Club = require('../models/club')
const Event = require('../models/event')
const Attender = require('../models/attender')

router.get('/clubs', (req, res) => {
    Club.find({}, (err, clubs) => {
        if(err) return res.status(404).send('data not found')
        res.json(clubs)
    })
})

router.get('/clubs/:club_id', (req, res) => {
    Club.findById({ _id: req.params.club_id}, (err, club) => {
        if(err) return res.status(404).send('data not found')
        res.json(club)
    })
})

router.post('/club', (req, res) => {
    if(!req.body){
        console.log(req.body)
        return res.status(400).send('request body is missing')
    }
    let club = new Club(req.body)
    club.save().then( doc => {
        if(!doc || doc.length === 0) return res.status(500).send('sorry, could not be saved')
        res.json(doc)
    })
})

router.post('/clubs/update/:club_name', (req, res) => {
    Club.findOneAndUpdate({ name: req.params.club_name}, req.body, (err, club) => {
        if(err) return res.status(400).send('data not found')
        Event.updateMany({club_name: req.params.club_name}, {club_name: req.body.name}, {upsert: false}, (err, done1) => {
            if(err) return res.status(400).send('data not found')
            Attender.updateMany({club_name: req.params.club_name}, {club_name: req.body.name}, {upsert: false}, (err, done2) => {
                if(err) return res.status(400).send('data not found')
                
                res.json(done2)
            })
        })
    })
})

router.post('/clubs/delete/:club_name', (req, res) => {
    Club.findOneAndDelete({ name: req.params.club_name}, (err, club) => {
        if(err) return res.status(400).send('data not found')
        res.json(club)
    })
})

module.exports = router