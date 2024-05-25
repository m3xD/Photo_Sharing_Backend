const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const auth = require('../middleware/middle')
const {response} = require("express");


router.get("/photosOfUser/:id", auth, async (request, response) => {
    try {
        const list = await Photo.find({user_id: request.params.id});


        const modifiedList = await Promise.all(
            list.map(async (photo) => {
                const commentsWithUsers = await Promise.all(
                    photo.comments.map(async (comment) => {
                        const user = await User.findOne({_id: comment.user_id});
                        return {
                            _id: comment._id,
                            comment: comment.comment,
                            date_time: comment.date_time,
                            user: {
                                _id: user._id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                            },
                        };
                    })
                );


                return {
                    _id: photo._id,
                    file_name: photo.file_name,
                    date_time: photo.date_time,
                    user_id: photo.user_id,
                    comments: commentsWithUsers,
                };
            })
        );

        console.log(modifiedList);
        response.send(modifiedList);
    } catch (error) {
        console.log(error);
        response.status(400).send({error});
    }
});

router.post('/commentsOfPhoto/:photo_id', auth, async (req, res) => {
    try {
        const photo = await Photo.findOne({_id: req.params.photo_id});
        if (!photo) {
            res.status(404).send({error: 'Photo not found'});
        } else {
            const cmt = {
                user_id: req.body.id,
                comment: req.body.comment,
                date_time: new Date().toDateString()
            };

            if (!photo.comments) photo.comments = [cmt];
            else photo.comments.push(cmt);
            console.log(photo.comments);
            photo.save();
            res.status(200).send();
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({error});
    }


})


module.exports = router;
