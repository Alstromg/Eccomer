const { default: mongoose } = require("mongoose");
const ticketCollection = 'Tickets'
const ticketSchema = new mongoose.Schema({
    code : {type: String, unique:true},
    purchase_datetime: { type: Date, default: Date.now },
    amount: Number,
    purchaser: String 
})


mongoose.set("strictQuery", false)
const TicketModel = mongoose.model(ticketCollection, ticketSchema)

module.exports = TicketModel;