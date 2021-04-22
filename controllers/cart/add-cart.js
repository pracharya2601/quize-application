const wrap = require("../../middleware/wrap");
const decodedToken = require("../../utils/decodedToken");
const ticketList = require('../../model/ticket.json');
const { drawDate } = require("../../utils/drawDate");


const addCart = wrap(async(req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = decodedToken(token);
    const userId = decoded.uid;

    const itemType = req.query.type;
    const {ticket, id} = req.body;

    let date = new Date().toISOString()
    let customID = date.replace(/[.,:-]/g,"")
    const newId = `${customID}-${userId}`
    
    const item = itemType === 'ticket' ? 
        ticketList.tickets.filter(x => x.id === id)[0] : undefined;
    
        //need to work on this for other items

    if(!req.session.carts) {
        req.session.carts = []
    }

    let carts = req.session.carts;
    const singleItem = {...item, id: newId, date, ticket: ticket, drawDate: `${drawDate(item.type)} 11:59 pm`};
    carts.push(singleItem);
    req.session.carts = carts;
    const pointneeded = carts.reduce((prevPoint, item) => prevPoint + (item.point), 0)
    res.status(200).json({
        total: pointneeded,
        count: carts.length,
        data: singleItem,
        alert: {
            text: 'Added successfully',
            type: 'success'
        }
    })
})

exports.addCart = addCart;