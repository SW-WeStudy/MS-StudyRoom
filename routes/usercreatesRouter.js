const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');

const Usercreates = require('../models/usercreates');
const usercreatesRouter = express.Router();

usercreatesRouter.use(bodyParser.json());

usercreatesRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Usercreates.findOne({ user: req.body.user})
    .populate('studyrooms')
    .then((usercreates) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(usercreates);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.cors, (req, res, next) => {
    Usercreates.findOneAndDelete({user: req.body.user})
    .then((usercreates) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(usercreates);
    },(err) => next(err))
    .catch((err) => next(err));
})

module.exports = usercreatesRouter;

//Si borro usercreates, debo borrar las salas de estudio
// Si borro sala de estudio, debo borrar la id en usercreates