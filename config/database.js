const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect('mongodb+srv://hanzala:hanzala2000@cluster1.lxwqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    mongoose.connection.on("connected", () => {
        console.log("Database Connected");
    })
    mongoose.connection.on("error", () => {
        console.log("Database Not Connected");
    })

}
module.exports = connectDatabase
