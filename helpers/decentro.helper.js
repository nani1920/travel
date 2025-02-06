/* Third Party Libraries */
require('dotenv').config();
const axios = require('axios')
const env = process.env
/* Third Party Libraries */

/* Local Files */
const { generateRandomString } = require('../helpers/helpers')
/* Local Files */

/* Controllers */
/* End Controllers */
class DecentroHelper {
    constructor() {
        this.baseUrl = 'https://in.staging.decentro.tech' // STAGING

        this.urls = {
            sendAadhaarOtp: `${this.baseUrl}/v2/kyc/aadhaar/otp`,
            verifyAadhaarOtp: `${this.baseUrl}/v2/kyc/aadhaar/otp/validate`,
            verifyDocument: `${this.baseUrl}/kyc/public_registry/validate`,
            verifyUpiId: `${this.baseUrl}/v2/payments/vpa/validate`,
            verifyIfsc: `${this.baseUrl}/search/ifsc`
        };

        this.headers = {
            'client_id': env.DECENTRO_CLIENT_ID,
            'client_secret': env.DECENTRO_CLIENT_SECRET,
            'module_secret': env.DECENTRO_MODULE_SECRET,
            'Content-Type': 'application/json'
        };
    }

    sendAadhaarOtp(data) {
        return axios({
            method: 'post',
            url: this.urls.sendAadhaarOtp,
            data,
            headers: this.headers
        }).then((response) => response)
    }

    verifyAadhaarOtp(decentroTxnId, otp) {
        const data = {
            "reference_id": generateRandomString(),
            "consent": true,
            "purpose": "For Aadhaar Verification",
            "initiation_transaction_id": decentroTxnId,
            "otp": otp
        }
        return axios({
            method: 'post',
            url: this.urls.verifyAadhaarOtp,
            data,
            headers: this.headers
        }).then((response) => response);
    }

    verifyDocument(docNumber, type, dob = null) {
        const data = {
            "reference_id": generateRandomString(),
            "document_type": type,
            "id_number": docNumber,
            "consent": "Y",
            "consent_purpose": "For bank account purpose only",
        }
        if(dob){
            data["dob"] = dob
        }
        return axios({
            method: 'post',
            url: this.urls.verifyDocument,
            data,
            headers: this.headers
        }).then((response) => response)
    }

    validateUpiId(upiId) {
        const data = {
            "reference_id": generateRandomString(),
            "upi_id": upiId
        }
        return axios({
            method: 'post',
            url: this.urls.verifyUpiId,
            data,
            headers: this.headers
        }).then((response) => response)
    }

    validateIfsc(ifsc) {
        return axios({
            method: 'get',
            url: `${this.urls.verifyIfsc}/${ifsc}?token=${env.DECENTRO_IFSC_TOKEN}`,
            headers: this.headers
        }).then((response) => response)
    }
}

module.exports = new DecentroHelper();
