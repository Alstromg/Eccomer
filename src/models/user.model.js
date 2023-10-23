const mongoose = require('mongoose')

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: String,
    role: { type: String, default: 'user' }
})

mongoose.set("strictQuery", false)
const UserModel = mongoose.model(userCollection, userSchema)

module.exports = UserModel;