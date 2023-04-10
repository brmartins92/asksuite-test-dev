const moment = require('moment');

class Date {

  dateISO8601ToBrasil = (date) => {
    const parts = date.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  }

  isValidateFormatISO8601(checkin, checkout) {
    const dateFormat = 'YYYY-MM-DD';
    const isValidCheckin = moment(checkin, dateFormat, true).isValid();
    const isValidCheckout = moment(checkout, dateFormat, true).isValid();

    if ( (!isValidCheckin) || (!isValidCheckout)) {
      return false;
    }

    if (parseInt(checkin.replace(/-/g, '')) > parseInt(checkout.replace(/-/g, ''))) {
      return "The checkout date needs to be greater than the check-in date.";
    }
    
    return true;
  }

  checkoutIsGresterCheckin (checkin, checkout) {
    if (parseInt(checkin.replace(/-/g, '')) < parseInt(checkout.replace(/-/g, ''))) {
      return true;
    }
      return false;
  }
}

module.exports = Date;