require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-providers');

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}

const config = {
    region: 'ap-south-1',
    credentials,
}

const s3 = new S3Client(config);

module.exports = s3;