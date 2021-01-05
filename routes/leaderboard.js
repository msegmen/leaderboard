var express = require('express');
var UserModel = require('../models/userModel');
var router = express.Router();

router.param('country_iso_code', function(req, res, next, country) {
    req.country = country;

    return next();
});

router.get('/:country_iso_code', (req, res, next) => {
    UserModel.find({country: req.country}, 'rank points display_name country').sort({'points' : -1}).exec(function(err, docs) {
        if (err) {
            res.send(err);
        } else {
            res.send(docs);
        }
    });
});

router.get('/', (req, res, next) => {
    UserModel.find({}, 'rank points display_name country').sort({'points' : -1}).exec(function(err, docs) {
        if (err) {
            res.send(err);
        } else {
            res.send(docs);
        }
    });
});

module.exports = router;