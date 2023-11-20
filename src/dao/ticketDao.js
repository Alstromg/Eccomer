
const TicketModel = require("./models/ticketModel");

const createTicket = async (amount, purchaserEmail) => {
  const ticketCode = generateUniqueTicketCode();
  const newTicket = new TicketModel({
    code: ticketCode,
    purchase_datatime: new Date(),
    amount: amount, 
    purchaser: purchaserEmail,
  });

  await newTicket.save();

  return newTicket;
};

const generateUniqueTicketCode = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

module.exports = { createTicket };
