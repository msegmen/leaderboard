var express = require('express');
const UserModel = require('../models/userModel');
const mongoose = require('mongoose');
var router = express.Router();

router.post('/submit', (req, res, next) => {
    const id = req.body.id;
    const score = req.body.score;

    console.log("id: " + id + " score: " + score);

    UserModel.findOne(
        { '_id' : mongoose.Types.ObjectId(id)},
    ).then((doc) => {
        if (doc.points == score) {
            res.send({
                "score_worth": score,
                "user_id": doc.id,
                "timestamp": new Date().getTime()
            });
        } else {
            UserModel.find({'_id' : { $ne: mongoose.Types.ObjectId(id) }, 'points': { $gte: score } }, function(err, docs) {
                console.log(docs);
                var newRank;

                newRank = docs.length + 1;

                const greater = score > doc.points ? score : doc.points;
                const less = score < doc.points ? score : doc.points;
                const diff = score > doc.points ? 1 : -1;
                
                UserModel.bulkWrite(
                    [
                        {
                            updateMany: {
                                filter: { '_id' : {$ne: mongoose.Types.ObjectId(id)}, $and: [ { 'points' : {$gte: less} }, { 'points' : {$lte: greater} } ]},
                                update: { $inc: { 'rank' : diff } }
                            }
                        },
                        {
                            updateOne: {
                                filter: { _id: mongoose.Types.ObjectId(id)},
                                update: { $set: { 'rank' : newRank, 'points' : score }}
                            }
                        }
                    ], function(err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            res.send({
                                "score_worth": score,
                                "user_id": doc.id,
                                "timestamp": new Date().getTime()
                            });
                        }
                    }
                );
            });
            
        }
    });
});

module.exports = router;