const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
})

mongoose.set("strictQuery", false)
const UserModel = mongoose.model(userCollection, userSchema)

module.exports = UserModel;