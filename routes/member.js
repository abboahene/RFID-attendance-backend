const express = require('express')
const router = express.Router()
const Member = require('../models/member')

router.get('/members/:member_id', (req, res) => {
    Member.findById({ _id: req.params.member_id}, (err, member) => {
        if(err) return res.status(404).send('data not found')
        res.json(member)
    })
})

router.post('/member', (req, res) => {
    if(!req.body){
        return res.status(400).send('request body is missing')
    }
    let member = new Member(req.body)
    member.save().then( doc => {
        if(!doc || doc.length === 0) return res.status(500).send('sorry, could not be saved')
        res.json(doc)
    })
})

router.post('/members/update/:member_id', (req, res) => {
    Member.findByIdAndUpdate({ _id: req.params.event_id}, req.body, (err, member) => {
        if(err) return res.status(400).send('data not found')
        res.json(member)
    })
})

router.post('/members/delete/:member_id', (req, res) => {
    Member.findByIdAndDelete({ _id: req.params.event_id}, (err, member) => {
        if(err) return res.status(400).send('data not found')
        res.json(member)
    })
})

module.exports = router