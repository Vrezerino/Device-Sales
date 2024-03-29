/*
  This file holds database and storage variables that depend on
  the existence and values of environment variables.
*/

// Nullcheck environment variables
if (!process.env.MONGODB_URI || !process.env.MONGODB_URI_DEV || !process.env.MONGODB_URI_TEST) {
    throw new Error('One or more database URI environment variables are missing!');
};

if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_BUCKET_NAME_DEV || !process.env.AWS_BUCKET_NAME_TEST) {
    throw new Error('One or more Amazon S3 bucket names are missing!')
};

if (!process.env.AWS_BUCKET_URL || !process.env.AWS_BUCKET_URL_DEV || !process.env.AWS_BUCKET_URL_TEST) {
    throw new Error('One or more Amazon S3 bucket URLs are missing!')
};

export const imgDirDevices = '/img/devices/';
export const imgDirCustomers = '/img/customers/';

let MONGO_URI: string;
let MONGODB_NAME: string;
let AWS_NAME: string;
let AWS_URL: string;

// Assign database and storage variables conditionally
switch (process.env.NODE_ENV) {
    case 'production':
        MONGO_URI = process.env.MONGODB_URI;
        MONGODB_NAME = 'device-sales';
        AWS_NAME = process.env.AWS_BUCKET_NAME;
        AWS_URL = process.env.AWS_BUCKET_URL;
        break;
    case 'development':
        MONGO_URI = process.env.MONGODB_URI_DEV;
        MONGODB_NAME = 'device-sales-dev';
        AWS_NAME = process.env.AWS_BUCKET_NAME_DEV;
        AWS_URL = process.env.AWS_BUCKET_URL_DEV;
        break;
    case 'test':
        MONGO_URI = process.env.MONGODB_URI_TEST;
        MONGODB_NAME = 'device-sales-test';
        AWS_NAME = process.env.AWS_BUCKET_NAME_TEST;
        AWS_URL = process.env.AWS_BUCKET_URL_TEST;
        break;
    default:
        throw new Error('Invalid NODE_ENV!');
};

export { MONGO_URI, MONGODB_NAME, AWS_NAME, AWS_URL };