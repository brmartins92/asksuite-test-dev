const RunGetAllRoomService = require('../services/RunGetAllRoom');
const BrowserService = require('../services/BrowserService');
const Date = require('../utils/functions/date');

const getRooms = async (req, res) => {
  const { checkin, checkout } = req.body;
  const date = new Date();
  
  if ( !date.isValidateFormatISO8601(checkin,checkout)  ) {
    return res.status(400).json({msg: "Date Format is invalid,  formato válido -> 'YYYY-MM-DD' "});
  }

  if (!date.checkoutIsGresterCheckin(checkin,checkout)) {
    console.log("checkout menor que o checking");
    return res.status(400).json({msg: "Checkin is necessary to be greater than checkout "});
  }

  const dateCheckin = date.dateISO8601ToBrasil(checkin);
  const datecheckout = date.dateISO8601ToBrasil(checkout);

  try {
    const runGetAllRoomService =  new RunGetAllRoomService(dateCheckin,datecheckout, BrowserService);
    const room = await runGetAllRoomService.searchRooms();  
    return res.status(201).json(room); 
  } catch (error) {
    return res.status(error.status).json({msg: error.message});
  }
}

module.exports = {
  getRooms,
};
