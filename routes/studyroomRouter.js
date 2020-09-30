const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const calendarcalls = require('../calendarcalls');
const StudyRooms = require('../models/studyrooms');
const cors = require('./cors');
const studyroomRouter = express.Router();

studyroomRouter.use(bodyParser.json());

//  ------------------------- /studyrooms/  ------------------------------ //

studyroomRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    StudyRooms.find({})
    .then((studyrooms) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(studyrooms);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.cors, (req,res,next) => {
    calendarcalls.insertRoom_in_calendar(req.body)
    .then((response) => {
        req.body.url = response.data.hangoutLink
        req.body.calendarEventId = response.data.id
        StudyRooms.create(req.body)
        .then((studyroom) => {
            console.log('room Created');
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(studyroom);
        },(err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})

// Only admin

.delete(cors.cors, (req, res, next) => {
    StudyRooms.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
})

//  ------------------------- /studyrooms/{studyroomId} endpoint ------------------------------ //

studyroomRouter.route('/:studyroomId')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(studyroom);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.cors, (req, res, next) => {
    StudyRooms.findByIdAndUpdate(req.params.studyroomId, {$set: req.body}, {new: true})
    .then((studyroom) => {
        req.body.calendarEventId = studyroom.calendarEventId
        calendarcalls.updateRoom_in_calendar(req.body)
        .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(studyroom);
        }, (err) => next(err))
        .catch((err) => next(err));    
    }, (err) => next(err))
    .catch((err) => next(err));    
})

// Only StudyRoom Owner

.delete(cors.cors, (req, res, next) => {
    StudyRooms.findByIdAndDelete(req.params.studyroomId)
    .then((studyroom) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(studyroom);
    },(err) => next(err))
    .catch((err) => next(err));
})


//  ------------------------- /studyrooms/{studyroomId}/resources endpoint ------------------------------ //

studyroomRouter.route('/:studyroomId/resources')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(studyroom.resources);
        }else{
            err = new Error('Study Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }
    })
})

.post(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null){
            req.body.author = 'heregoesauthor';
            req.body.authorImage = 'heregoesimage';
            studyroom.resources.push(req.body);
            studyroom.save()
            .then((studyroom) => {
                StudyRooms.findById(studyroom._id)
                .then((studyroom) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(studyroom);
                })
            }, (err) => next(err))  
        }else{
            err = new Error('Study Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

// Only StudyRoom Owner

.delete(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null){
            for( var i = studyroom.resources.length - 1; i >= 0; i--){
                studyroom.resources.id(studyroom.resources[i]._id).remove();
            }
            studyroom.save()
            .then((studyroom) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(studyroom);
            },(err) => next(err)); 
        }else{
            err = new Error('Study Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
});

//  ------------------ /studyrooms/{studyroomId}/resources/{resourceId} endpoint ------------------------ //

studyroomRouter.route('/:studyroomId/resources/:resourceId')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null && studyroom.resources.id(req.params.resourceId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(studyroom.resources.id(req.params.resourceId));
        }else if (studyroom == null){
            err = new Error('Study Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }else{
            err = new Error('Resource ' + req.params.resourceId + ' not found');
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null && studyroom.resources.id(req.params.resourceId) != null){
            if(req.body.resource){
                studyroom.resources.id(req.params.resourceId).resource = req.body.resource;
            }
            if(req.body.description){
                studyroom.resources.id(req.params.resourceId).description = req.body.description;
            }
            studyroom.save()
            .then((studyroom) => {
                StudyRooms.findById(studyroom._id)
                .then((studyroom) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(studyroom);
                })
            },(err) => next(err));
        }else if(studyroom == null){
            err = new Error('Study Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }else{
            err = new Error('Resource ' + req.params.resourceId + ' not found');
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})

// Only the resource owner
.delete(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null && studyroom.resources.id(req.params.resourceId) != null){
            studyroom.resources.id(req.params.resourceId).remove();
            studyroom.save()
            .then((studyroom) => {
                StudyRooms.findById(studyroom._id)
                .then((studyroom) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(studyroom);
                })
            },(err) => next(err)); 
        }else if (studyroom == null){
            err = new Error('Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }else{
            err = new Error('Comment ' + req.params.resourceId + ' not found');
            err.status = 404;
            return next(err);
        }    
    },(err) => next(err))
    .catch((err) => next(err));
}) 
//  ------------------ /studyrooms/{studyroomId}/students endpoint ------------------------ //

studyroomRouter.route('/:studyroomId/students')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(studyroom.students);
        }else{
            err = new Error('Study Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }
    })
})

.post(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null){
            req.body.calendarEventId = studyroom.calendarEventId
            calendarcalls.addAttende_in_calendar(req.body)
            .then((response) => {
                studyroom.students.push(req.body);
                studyroom.save()
                .then((studyroom) => {
                    StudyRooms.findById(studyroom._id)
                    .then((studyroom) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(studyroom);
                    })
                }, (err) => next(err))  
            })
        }else{
            err = new Error('Study Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.cors, (req, res, next) => {
    StudyRooms.findById(req.params.studyroomId)
    .then((studyroom) => {
        if(studyroom != null && studyroom.students.id(req.body._id) != null){
            studyroom.students.id(req.body._id).remove();
            studyroom.save()
            .then((studyroom) => {
                StudyRooms.findById(studyroom._id)
                .then((studyroom) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(studyroom);
                })
            },(err) => next(err)); 
        }else if (studyroom == null){
            err = new Error('Room ' + req.params.studyroomId + ' not found');
            err.status = 404;
            return next(err);
        }else{
            err = new Error('Comment ' + req.body._id + ' not found');
            err.status = 404;
            return next(err);
        }    
    },(err) => next(err))
    .catch((err) => next(err));

})

// need to implement delete user from students array - 
// if author exists in students
// remove
module.exports = studyroomRouter;