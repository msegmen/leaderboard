var express = require('express');
var router = express.Router();
var UserModel = require('../models/userModel');

router.param('guid', function(req, res, next, guid) {
    req.userId = guid;

    return next();
});

router.get('/profile/:guid', (req, res, next) => {
    UserModel.findById(req.userId).then((user) => {
            res.send({"user_id" : user.id, "display_name": user.display_name, "points": user.points, "rank": user.rank});
        }
    );
});

router.post('/create', (req, res, next) => {
   
    UserModel.aggregate([{
            "$sort": { 
                "points": 1
            }
        },
        {
            "$group": {
                "_id": 'false',
                "users": {
                    "$push": {
                        "_id": "$_id",
                        "points": "$points"
                    }
                }
            }
        },
        {
            "$unwind": {
                "path": "$users",
                "includeArrayIndex": "rank"
            }
        }
    ]).then((docs) => {
        var inst = new UserModel({display_name: req.body.display_name, points: 0, rank: docs.length + 1, country: req.body.country});
        inst.save();
        res.send({"user_id" : inst.id, "display_name": inst.display_name, "points": inst.points, "rank": inst.rank});
    });

});

module.exports = router;