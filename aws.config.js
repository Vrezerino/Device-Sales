import { config, S3 } from 'aws-sdk';

config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new S3({ s3ForcePathStyle: true });
export default s3;