var express = require('express');
var router = express.Router();
var task1Controller = require("../controllers/task1Controller");
var task2Controller = require("../controllers/task2Controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/upload_csv',task1Controller.upload_csv);
router.get('/searchPolicy',task1Controller.searchPolicy);
router.get('/getPoliciesByEachUser',task1Controller.policyByEachUser);
router.post('/postMessage',task2Controller.post_message);


module.exports = router;
