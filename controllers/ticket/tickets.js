const wrap = require("../../middleware/wrap");
const ticketList = require('../../model/ticket.json');
const { drawDate } = require("../../utils/drawDate");

const tickets = wrap((req, res, next) => {
  if(!req.session.user) {
      res.status(200).json({
          signIn: false,
          user: {},
      })
    return;
  }
  let ticketArr = [];
  ticketList.tickets.forEach(tic => {
    const draw = drawDate(tic.type);
    ticketArr.push({
      ...tic,
      drawDate: `${draw} 11:59 pm`,
      purchaseBefore: `${draw} 10:00 pm`,
    })
  })
  res.status(200).json({
    data: ticketArr,
    alert: {
      text:'List of ticket',
      type: 'success'
    }
  })
})

exports.tickets = tickets;