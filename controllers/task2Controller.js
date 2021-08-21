const Temp_Message_Model = require("../models/temp_message");
const Message_Model = require("../models/message");
const moment = require('moment');
const schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();
rule.second = new schedule.Range(0, 59, 59);

const post_message = async (req, res) => {
    const message_obj = new Temp_Message_Model({
        message: req.body.message,
        day: req.body.day,
        time: req.body.time
    });
    message_obj.save().then(result => {
        res.status(200).send({ success: true, message: "Message posted successfully", data: result })
    }).catch(err => {
        res.status(400).send({ success: false, message: "Error while posting message", data: err })
    })
}

var scheduler = schedule.scheduleJob(rule, async function () {
    let currentDateTime = new Date(moment(new Date()).subtract(1, "minutes"));
    let currentSystemDateTime = new Date()
    var utc = currentSystemDateTime.toJSON().slice(0, 10).replace(/-/g, '/');
    var currentTime = currentSystemDateTime.toLocaleTimeString()
    console.log("Scheduler called :");
    console.log("utc :", utc, "time :", currentTime);
    console.log("current DateTime :", currentSystemDateTime);

    Temp_Message_Model.find({ day: utc }).then(async (messages) => {
        console.log("messages :", messages);
        if (messages && messages.length > 0) {
            messages.forEach(async (element) => {
                console.log("currentTime >= messages.time :", currentTime, ">=", element.time);
                if (currentTime >= element.time) {
                    console.log("Matching time");
                    const obj = new Message_Model({
                        message: element.message,
                        day: element.day,
                        time: element.time
                    });
                    // let deletedTempRec = Temp_Message_Model.findByIdAndDelete(element.id)
                    var query = Temp_Message_Model.remove({ _id: element.id });
                    let deletedTempRec = query.exec();
                    console.log("deletedTempRec :", deletedTempRec);
                    let insertToNewDb = await obj.save();
                    console.log("insertToNewDb :", insertToNewDb);
                } else {
                    console.log("Not Matching time");
                }
            });
        }
        else {
            console.log("Day Not Matching time");
        }
    }).catch(err => {
        console.log("Bad request :", err);
    })
});

module.exports = {
    post_message
}