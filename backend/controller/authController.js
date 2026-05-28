
const { json } = require('body-parser');
const Customer = require('../models/customer');




exports.hello = async (req, res) => {
    try {
        const isUserMatched = await Customer.findOne({ Email: req.user._json.email })

        if (!isUserMatched) {
            res.json({
                code: 400,
                msg: "the user is not found"
            })
        }

        res.redirect('https://live-project-gold.vercel.app/Dashboard')

    } catch (err) {
        console.log('something went wrong...')
    }
}

