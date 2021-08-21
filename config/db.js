var config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    poolSize: 15
}
var dbUrl = "mongodb://localhost:27017/insuredmine"

module.exports = {
    config,
    dbUrl
}