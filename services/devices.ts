'use server';

import { Device } from '@/app/lib/definitions';
import { getMongoDb as db } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

import { validateDevice } from '@/app/lib/validations';
import { extractErrorMessage } from '@/app/lib/utils';

import s3 from '../aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AWS_NAME, AWS_URL, imgDirDevices } from '@/app/lib/env';

import { store } from '@/redux/store';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addDevice, editDevice, removeDevice } from '@/redux/features/deviceSlice';

export const fetchDevices = async () => {
  try {
    // Return devices sorted by their names, descending
    const devices = await (await db()).collection('devices').find({}).sort({ deviceName: -1 }).toArray();
    return JSON.parse(JSON.stringify(devices));
  } catch (e) {
    return { error: extractErrorMessage(e) };
  }
};

export const getDeviceById = async (id: string) => {
  try {
    const _id = new ObjectId(id);
    const device = await (await db()).collection('devices').findOne({ _id });
    return JSON.parse(JSON.stringify(device));
  } catch (e) {
    return { error: extractErrorMessage(e) };
  }
};

export const postDevice = async (formData: FormData) => {
  // Helper boolean variable to be used for page redirection upon successful database insertion
  let success = false;

  // Device with no image file and with image url instead, for db and redux state
  let newDevice;
  try {
    const device: Device = validateDevice(formData);
    // File upload is optional so file could be null
    const file = device.image || null;

    /**
     * Create filename from device name, replacing possible spaces with underscores,
     * add period, add file extension. If no file was uploaded, filename refers
     * to a fallback/generic device image in the storage.
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

      const upload = new Upload({
        client: s3,
        params
      });

      upload.on('httpUploadProgress', (_progress) => {
        //
      });

      await upload.done();
    }

    /**
     * Insert device then into the database.
     * Devices do not get inserted into db with the file blob.
     * They'll contain a URL to the file instead and the file
     * itself is uploaded on Amazon storage.
     */
    newDevice = { ...device, imageUrl: `${AWS_URL}${imgDirDevices}${filename}` };
    delete newDevice.image;
    const result = await (await db()).collection('devices').insertOne(newDevice);

    // Ensure insertion was successful, throw error otherwise
    success = result.acknowledged && result.insertedId !== null;
    if (!success) throw new Error('Database error: insertion failed!')

  } catch (e) {
    return { error: extractErrorMessage(e) };
  }

  /**
   * Finally, dispatch device to store and redirect to device list page.
   * redirect() can't be used inside a try/catch block.
   */
  if (success && newDevice) {
    store.dispatch(addDevice(newDevice));
    revalidatePath('/dashboard/devices');
    redirect('/dashboard/devices');
  }
};

export const updateDevice = async (id: string, formData: FormData) => {
  // Helper boolean variable to be used for page redirection upon successful db object modification
  let success = false;
  let device: Device;

  try {
    device = validateDevice(formData);
    // File upload is optional so file could be null
    const file = device.image || null;

    /**
     * Create filename from device name, replacing possible spaces with underscores,
     * add period, add file extension. If no file was uploaded, filename refers
     * to a fallback/generic device image in the storage.
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

      const upload = new Upload({
        client: s3,
        params
      });

      upload.on('httpUploadProgress', (_progress) => {
        //
      });

      await upload.done();
    }

    const _id = new ObjectId(id);

    // Update the invoice in the database
    const result = await (await db()).collection('devices').updateOne({ _id }, {
      $set: {
        deviceName: device.deviceName,
        deviceManufacturer: device.deviceManufacturer,
        deviceDescription: device.deviceDescription,
        amount: device.amount,
        imageUrl: `${AWS_URL}${imgDirDevices}${filename}`
      }
    });

    // Ensure that modification was successful, throw error otherwise
    success = result.acknowledged && result.matchedCount === 1 && result.modifiedCount === 1;
    if (!success) throw new Error('Database error! Does the device exist?');

  } catch (e) {
    return { error: extractErrorMessage(e) };
  }

  // Finally, dispatch edited device to store
  if (success && device) {
    store.dispatch(editDevice(device));
    revalidatePath('/dashboard/devices');
    redirect('/dashboard/devices');
  }
};

export const deleteDevice = async (id: string) => {
  // Helper boolean variable to be used for page redirection upon successful db object deletion
  let success = false;

  try {
    const _id = new ObjectId(id);

    // Get device image filename for image deletion
    const device = await (await db()).collection('devices').findOne({ _id });

    // Remove image only if it's not the fallback/default image
    if (device?.imageUrl.substring(65) !== '___blankDevice.jpg') {
      const params = {
        Bucket: AWS_NAME,
        /**
         * The domain part is not needed when deleting file from S3 storage, only
         * directory/filename: img/devices/filename.jpeg
         */
        Key: device?.imageUrl?.substring(53)
      };

      // Remove image from Amazon storage
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
    }

    // Delete from db, ensure deletion was successful, throw error otherwise
    const result = await (await db()).collection('devices').deleteOne({ _id });
    success = result.acknowledged && result.deletedCount === 1;
    if (!success) throw new Error('Database error! Does the device exist?');

  } catch (e) {
    return { error: extractErrorMessage(e) };
  }

  // Dispatch device deletion to store and redirect to device list page
  if (success) {
    store.dispatch(removeDevice(id));
    revalidatePath('/dashboard/devices');
    redirect('/dashboard/devices');
  }
};