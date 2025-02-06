/* Third Party Libraries */
const moment = require('moment');
/* Third Party Libraries */

/* Local Files */
/* Local Files */

/* Controllers */
/* End Controllers */

class DateTimeValidationHelper {

    constructor() {
        this.dateFilterCheck = this.dateFilterCheck.bind(this)
    }


    validateDateAndTime(format = 'YYYY-MM-DD HH:mm') {
        return async (value) => {
            return moment(value, format, true).isValid() && moment(value, format, true) > moment();
        }
    }

    validateTimeFormat(format = 'HH:mm') {
        return async value => {
            return moment(value, format, true).isValid();
        }
    }

    validateDate(value) {
        return moment(value, 'YYYY-MM-DD', true).isValid();
    }

    greaterThenTodayCheck(value) {
        return moment(value, 'YYYY-MM-DD', true) > moment();
    }

    dateFilterCheck(fromDate, toDate) {
        if (!this.validateDate(fromDate) || !this.validateDate(toDate)) {
            throw new Error('invalid_date_format');
        }

        if (this.greaterThenTodayCheck(fromDate) || this.greaterThenTodayCheck(toDate)) {
            throw new Error('date_must_not_be_greater_than_today');
        }

        if (moment(fromDate, 'YYYY-MM-DD', true) > moment(toDate, 'YYYY-MM-DD', true)) {
            throw new Error('from_date_must_be_smaller_than_to');
        }

        return true;
    }


}

module.exports = new DateTimeValidationHelper();