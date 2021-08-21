const csvtojson = require("csvtojson");
const AgentModel = require("../models/agent");
const UserModel = require("../models/users");
const UsersAccountModel = require("../models/usersAccount")
const LOBModel = require("../models/LOB");
const CarrierModel = require("../models/carrier");
const PolicyModel = require("../models/policy");
const ObjectID = require("mongodb").ObjectID;

// CSV file name
const fileName = "data-sheet.csv";
var agentArrayToInsert = [];
var userArrayToInsert = [];
var usersAccountArrayToInsert = [];
var LOBArrayToInsert = [];
var carrierArrayToInsert = [];
var policyArrayToInsert = [];

const upload_csv = async (req, res) => {
    csvtojson().fromFile(fileName).then(source => {
        // console.log("source :", source);
        // Fetching the all data from each row
        for (var i = 0; i < source.length; i++) {
            //Enable this to insert all the records
            // for (var i = 0; i = 5; i++) {

            //You can comment this if you want to insert all the records
            if (i == 10) {   //Will insert only 10 records
                break
            }
            var agentObj = {
                agentName: source[i]["agent"]
            };
            agentArrayToInsert.push(agentObj);
            var userObj = {
                firstName: source[i]["firstname"],
                dob: source[i]["dob"],
                address: source[i]["address"],
                phoneNumber: source[i]["phone"],
                state: source[i]["state"],
                zipCode: source[i]["zip"],
                email: source[i]["email"],
                gender: source[i]["gender"],
                userType: source[i]["userType"]
            };
            userArrayToInsert.push(userObj);
            var usersAccountObj = {
                account_name: source[i]["account_name"]
            };
            usersAccountArrayToInsert.push(usersAccountObj);
            var LOBObj = {
                category_name: source[i]["category_name"]
            };
            LOBArrayToInsert.push(LOBObj);
            var carrierObj = {
                company_name: source[i]["company_name"]
            };
            carrierArrayToInsert.push(carrierObj);

            var policyObj = {
                policy_number: source[i]["policy_number"],
                policy_start_date: source[i]["policy_start_date"],
                policy_end_date: source[i]["policy_end_date"],
                policy_category: "",
                collection_id: "",
                company_collection_id: "",
                user_id: ""
            };
            policyArrayToInsert.push(policyObj);

        }
        console.log("agentArrayToInsert :", agentArrayToInsert);

        Promise.all([
            AgentModel.insertMany(agentArrayToInsert),
            UserModel.insertMany(userArrayToInsert),
            UsersAccountModel.insertMany(usersAccountArrayToInsert),
            LOBModel.insertMany(LOBArrayToInsert),
            CarrierModel.insertMany(carrierArrayToInsert),
        ]).then(results => {
            //results return an array
            const [agents, users, usersAccount, LOB, carrier] = results;
            let count = 0
            policyArrayToInsert.map(policy => {
                policy.user_id = users[count].id
                policy.policy_category = LOB[count].id
                policy.company_collection_id = carrier[count].id
                count++
            })

            console.log("policyArrayToInsert :", policyArrayToInsert);
            PolicyModel.insertMany(policyArrayToInsert).then(policy => {
                let data = {
                    agent: agents,
                    users: users,
                    usersAccount: usersAccount,
                    LOB: LOB,
                    carrier: carrier,
                    policy: policy
                }
                res.status(200).send({ success: true, message: "File uploaded and records inserted successfully", data: data })
            }).catch(err => {
                res.status(400).send({ success: false, message: "Error while uploading file/inseting records", data: err })
            })
            // console.log("agents", agents);
            // console.log("users", users);
        }).catch(err => {
            console.error("Something went wrong", err);
            res.status(400).send({ success: false, message: "Something went wrong", data: err })
        })
    });
}

const searchPolicy = async (req, res) => {
    let userName = req.query.userName;
    let regex = new RegExp(userName, 'i');
    UserModel.aggregate([
        { $match: { firstName: regex } }
    ]).then(data => {
        console.log("data :", data);
        PolicyModel.find({ user_id: data[0]._id })
            .then(ploicyInfo => {
                res.status(200).send({ success: true, message: "Policy info found successfully", data: ploicyInfo })
            }).catch(err => {
                res.status(400).send({ success: false, message: "Error while fetching policy info", data: err })
            })
    }).catch(err => {
        res.status(400).send({ success: false, message: "Error while searching policy info", data: err })
    })
    // UserModel.find({ $text: { $search: userName } }).then(user => {
    //     console.log("user :", user);
    // })
}

const policyByEachUser = async (req, res) => {
    UserModel.find().then(users => {
        if (users) {
            var final = []
            let count = 0
            users.map(async (user) => {
                PolicyModel.find({ user_id: user.id }).then(policy => {
                    console.log("policy :",policy);
                    let obj = {
                        user : user,
                        policies : policy
                    }
                    final.push(obj)
                    count++
                    if(users.length == count){
                        res.status(200).send({ success: true, message: "Aggregated policies by each user", data: final })
                    }
                })
            })
        }
        else {
            res.status(400).send({ success: false, message: "No data found", data: users })
        }
    }).catch(err => {
        res.status(400).send({ success: false, message: "Error while fetching users", data: err })
    })
}

module.exports = {
    upload_csv,
    searchPolicy,
    policyByEachUser
}



