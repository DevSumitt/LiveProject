const mongoose = require('mongoose');
const myDB = async () => {
   mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log('Database Connected !!'))
   .catch((err) => console.log(err))

}

module.exports = myDB;