const Message = require('../models/message.model.js');

// saveMessageToDb
exports.saveMessageToDb = (reqData) => {
    // Message.remove().then(data => {
    //     //success
    // }).catch(err => {
    //     //error
    // });

    let { from, username, text, createdAt } = reqData;

    // Create a Message
    const message = new Message({
        from, username, text, createdAt
    });

    // Save Message in the database
    return message.save()
        .then(data => {
            return data;
        }).catch(err => {
            //error
        });
};

// likeDislikeMsg
exports.likeDislikeMsg = (reqData) => {
    let { from, messageId } = reqData;

    return Message.find({
        _id: messageId
    }).then(data => {
        //success
        if (data && data[0] && data[0].likesFrom) {
            if (data[0].likesFrom.indexOf(from) == -1) {
                data[0].likesFrom.push(from);
            } else {
                data[0].likesFrom.splice(data[0].likesFrom.indexOf(from), 1);
            }

            // Save Message in the database
            return Message.findByIdAndUpdate(messageId, {
                likesFrom: data[0].likesFrom
            })
                .then(dataUpdated => {
                    //success
                    return data[0];
                }).catch(err => {
                    //error
                });
        }
    }).catch(err => {
        //error
    });
};

// getPreviousMsgs
exports.getPreviousMsgs = (req, res) => {
    // Save User in the database
    Message.find()
        .then(data => {
            res.status(200).send({
                status: "success",
                code: 200,
                data: data
            });
        }).catch(err => {
            let errorMsg = err.message || "Some error occurred while creating the User.";

            res.status(500).send({
                status: "failure",
                code: 500,
                data: {
                    errorMsg: errorMsg
                }
            });
        });

};
