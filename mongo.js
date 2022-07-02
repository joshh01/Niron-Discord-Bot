const mongoose = require('mongoose');
require('dotenv').config();
const mongoDBURL = process.env.MONGODB_SRV;

module.exports = async () => {
    await mongoose.connect(mongoDBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
    });
    return mongoose;
}