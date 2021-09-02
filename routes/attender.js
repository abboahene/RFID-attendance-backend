const express = require('express')
const router = express.Router()
const Attender = require('../models/attender')
const Event = require('../models/event')
const fs = require('fs')
const path = require('path')
// const xl = require('excel4node')

router.get('/attenders/:event_title', (req, res) => {
    Attender.find({event_title: req.params.event_title})
    .exec( (err,attenders) => {
        if (err) {
            return res.status(400).send('data not found')
        }
        res.json(attenders)
    })
})

router.get('/attenders/graphdata/:club_name', (req, res) => {
    let graphData = {
        event_names: [],
        eventAttendersCount: [],
        averageAttendance: 0.0
    }
    Event.find({ club_name: req.params.club_name}).sort({ createdAt: -1}).exec((err, events) => {
        Attender.find({ club_name: req.params.club_name }).exec( (err,attenders) => {
            if (err) 
            return res.status(400).send('data not found')
            
            events.forEach( event => {
                graphData.event_names.push(event.name)
                let eventAttenders = attenders.filter( attender => attender.event_name === event.name) || []
                graphData.eventAttendersCount.push(eventAttenders.length)
            })
            const reducer = (accumulator, currentValue) => accumulator + currentValue
            graphData.averageAttendance = graphData.eventAttendersCount.reduce(reducer,0.0) / events.length    
            
            res.json(graphData)
        })
    })
})

router.get('/attenders/:club_name/:event_title/all', (req, res) => {
    Attender.find({ club_name: req.params.club_name, event_name: req.params.event_title })
    .exec( (err,attenders) => {
        if (err) return res.status(400).send('data not found')
        
        ///build csv
        let csv = 'no data'
        if(attenders.length > 0){
            csv = `***Attendance Sheet for ${attenders[0].event_name}\n**Organized by ${attenders[0].club_name}\n*Date: ${new Date(attenders[0].createdAt).toDateString()}\nIndex NO., Name, Time                , Rfid                , MS, EOS, Total\n`

            attenders.forEach((attender, index) => {
                csv += `${attender.member_indexNo}, ${attender.member_name}, ${new Date(attender.createdAt).toLocaleString().split(',')[1]}, @${attender.member_rfid},0,0,=E${index+5}+F${index+5}\n`
            })
        }
        fs.writeFile('csv.csv', csv, (err) =>{
            if(err) console.log(err)
            console.log('file written')
        })
        res.json(attenders)
    })
})

router.get('/attenders/lastest/event', (req, res) => {
    
    Event.findOne().sort({createdAt: -1}).exec( (err, event) => {
        if (err) return res.status(400).send('data not found')
        
        Attender.find({event_name: event.name}).exec( (err,attenders) => {
            if (err) return res.status(400).send('data not found')
            
            Event.find().sort({createdAt: -1}).exec((err, events) => {
                let clubs = []
                events.forEach( event => {
                    clubs.push(event.club_name)
                })
                clubs = [...new Set(clubs)] //get unique clubs
                
                ///build csv
                let csv = 'no data'
                if(attenders.length > 0){
                    csv = `***Attendance Sheet for ${attenders[0].event_name}\n**Organized by ${attenders[0].club_name}\n*Date: ${new Date(attenders[0].createdAt).toDateString()}\nIndex NO., Name, Time                , Rfid                , MS, EOS, Total\n`
        
                    attenders.forEach((attender, index) => {
                        csv += `${attender.member_indexNo}, ${attender.member_name}, ${new Date(attender.createdAt).toLocaleString().split(',')[1]}, @${attender.member_rfid},0,0,=E${index+5}+F${index+5}\n`
                    })
                }
                fs.writeFile('csv.csv', csv, (err) =>{
                    if(err) console.log(err)
                    console.log('file written')
                })
                
                res.json({attenders: attenders, events: events, clubs: clubs})
                
            })
        })
    })
})

router.post('/attenders/downloadcsv.csv', (req, res) => {
    console.log('here')
    res.sendFile('csv.csv', { root: path.join(__dirname, '../') })

})

router.get('/attender/:event_id/:member_id',  (req, res) =>{
    Attender.find({ event_id: req.params.event_id, member_id: req.params.member_id })
    .exec( (err,attender) => {
        if(err) return res.status(400).send('data not found')

        res.json(attender)
    })
})

router.post('/attender', (req, res) => {
    if(!req.body){
        return res.status(400).send('request body is missing')
    }
    let attender = new Attender(req.body)
    attender.save().then( doc => {
        if(!doc || doc.length === 0) return res.status(500).send('sorry, could not be saved')
        res.json(doc)
    })
})

router.post('/attender/:attender_id', (req, res) => {
    Attender.findByIdAndDelete({ _id: req.params.club_id}, (err, attender) => {
        if(err) return res.status(400).send('data not found')
        res.json(attender)
    })
})

module.exports = router