/* Third Party Libraries */

/* Third Party Libraries */

/* Local Files */
const { verificationIdTypes } = require('../../helpers/constants')
/* Local Files */

class DocumentValidationHelper {
    isValidDocumentNumber(type, number) {
        const verificationRegex = {
            [verificationIdTypes.AADHAAR]: /^\d{12}$/,
            [verificationIdTypes.PAN]: /^[A-Z]{5}\d{4}[A-Z]$/,
            [verificationIdTypes.DL]: /.*/, // Accepts any string, since DL format varies by state
            [verificationIdTypes.VOTER_ID]: /.*/, // Accepts any string, since Voter ID format varies by state
            [verificationIdTypes.UDYAM]: /.*/,
            [verificationIdTypes.GSTIN]: /.*/,
            [verificationIdTypes.CIN]: /.*/,
            [verificationIdTypes.PANCARD]: /.*/
        };

        const regex = verificationRegex[type];
        return regex ? regex.test(number) : false;
    }
}

module.exports = new DocumentValidationHelper();