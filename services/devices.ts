'use server';

import { Device } from '@/app/lib/definitions';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import s3 from '../aws.config';
import { AWS_NAME, AWS_URL, imgDirDevices } from '@/app/lib/env';

export const fetchDevices = async () => {
  try {

    // Return devices sorted by their names, descending
    const devices = await (await db()).collection('devices').find({}).sort({ deviceName: -1 }).toArray();
    return JSON.parse(JSON.stringify(devices));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch devices!');
  }
};

export async function getDeviceById(id: string) {
  try {
    const _id = new ObjectId(id);
    const device = await (await db()).collection('devices').findOne({ _id });
    return JSON.parse(JSON.stringify(device));
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch device!');
  }
};

export const postDevice = async (device: Device) => {
  try {
    // File upload is optional so file could be null
    const file = device.image || null;

    /*
      Create filename from device name, replacing possible spaces with underscores,
      add period, add file extension. If no file was uploaded, filename refers
      to a fallback/generic device image in the storage.
    */
    const filename = file
      ? `${device.deviceName.replaceAll(' ', '_')}.${file.type.split('/')[1]}`
      : '___blankDevice.jpg';

    // If user submitted a file...
    if (file) {
      // create a byte array from it
      const buffer = Buffer.from(await file?.arrayBuffer());

      // and upload the image file to Amazon S3 storage
      const params = {
        Bucket: AWS_NAME,
        // Key needs to be dir/subdir/filename, so remove forward slash from start
        Key: `${imgDirDevices.substring(1)}${filename}`,
        Body: buffer,
      };

      await s3.upload(params, (err: any) => {
        if (err) {
          throw new Error(err);
        } else {
          console.log('Image uploaded to S3 bucket.');
        }
      }).promise();
    }

    /*
      Insert device then into the database.
      Devices do not get inserted into db with the file blob.
      They'll contain a URL to the file instead and the file
      itself is uploaded on Amazon storage.
    */
    const newDevice = { ...device, imageUrl: `${AWS_URL}${imgDirDevices}${filename}` };
    delete newDevice.image;

    // If insertion was successful, return newDevice to be saved in app state
    const result = await (await db()).collection('devices').insertOne(newDevice);
    if (result.acknowledged) return newDevice;
  } catch (e) {
    throw new Error('Failed to insert new device!', { cause: e });
  }
};

export async function updateDevice(id: string, device: Device) {
  try {
    // File upload is optional so file could be null
    const file = device.image || null;

    /*
      Create filename from device name, replacing possible spaces with underscores,
      add period, add file extension. If no file was uploaded, filename refers
      to a fallback/generic device image in the storage.
    */
    const filename = file
      ? `${device.deviceName.replaceAll(' ', '_')}.${file.type.split('/')[1]}`
      : '___blankDevice.jpg';

    // If user submitted a file...
    if (file) {
      // create a byte array from it
      const buffer = Buffer.from(await file?.arrayBuffer());

      // and upload the image file to Amazon S3 storage
      const params = {
        Bucket: AWS_NAME,
        // Key needs to be dir/subdir/filename, so remove forward slash from start
        Key: `${imgDirDevices.substring(1)}${filename}`,
        Body: buffer,
      };

      await s3.upload(params, (err: any) => {
        if (err) {
          throw new Error(err);
        } else {
          console.log('Image uploaded to S3 bucket.');
        }
      }).promise();
    }

    // Modify device object in the database
    const _id = new ObjectId(id);

    const result = await (await db()).collection('devices').updateOne({ _id }, {
      $set: {
        deviceName: device.deviceName,
        deviceManufacturer: device.deviceManufacturer,
        deviceDescription: device.deviceDescription,
        amount: device.amount,
        imageUrl: `${AWS_URL}${imgDirDevices}${filename}`
      }
    });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to update device!');
  }
};

export async function deleteDevice(id: string) {
  try {
    const _id = new ObjectId(id);

    // Get device image filename for image deletion
    const device = await (await db()).collection('devices').findOne({ _id });

    const params = {
      Bucket: AWS_NAME,
      Key: device?.imageUrl
    };

    // Remove image from Amazon storage
    await s3.deleteObject(params, (err: any, data: any) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log('Image was deleted from S3 bucket.');
      }
    }).promise();

    // Remove device from database
    const result = await (await db()).collection('devices').deleteOne({ _id });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete device!');
  }
};