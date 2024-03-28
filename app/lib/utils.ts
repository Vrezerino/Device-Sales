import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

// A function utilizing this array will get the order number from each month's index in the array
export const monthOrder = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const MAX_FILE_SIZE = 1000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const validateEmail = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validateDevice = (formData: FormData) => {
  const deviceName = formData.get('deviceName');
  if (!deviceName || typeof deviceName !== 'string' || deviceName.toString().length < 5) {
    throw new Error('Device name must be over 5 characters.')
  }

  if (deviceName.toString().length > 50) {
    throw new Error('Device name must be under 50 characters.')
  }

  const deviceNumber = formData.get('deviceNumber'); // Serial number, so a string
  if (!deviceNumber || typeof deviceNumber !== 'string' || deviceNumber.toString().length < 1) {
    throw new Error('Device number is required.')
  }

  if (deviceNumber.toString().length > 50) {
    throw new Error('Device number must be under 50 characters.')
  }

  const deviceManufacturer = formData.get('deviceManufacturer');
  if (!deviceManufacturer || typeof deviceManufacturer !== 'string' || deviceManufacturer.toString().length < 1) {
    throw new Error('Device manufacturer is required.')
  }

  if (deviceManufacturer.toString().length > 50) {
    throw new Error('Device manufacturer name must be under 50 characters.')
  }

  const deviceDescription = formData.get('deviceDescription');
  if (!deviceDescription || typeof deviceDescription !== 'string' || deviceDescription.toString().length < 1) {
    throw new Error('Device description is required.')
  }

  if (deviceDescription.toString().length > 1000) {
    throw new Error('Device description must be under 1000 characters.')
  }

  const amount = Number(formData.get('amount'));
  if (!amount || typeof amount !== 'number' || Number(amount) < 0) {
    throw new Error('Device amount is required and must be over 0.')
  }

  // Assign file to a key so we can unset it if needed
  const obj = { file: formData.get('image') };
  console.log(obj);

  // If file was uploaded at all, check its validity
  if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size > 0) {
    if (!ACCEPTED_IMAGE_TYPES.includes(obj.file.type)) throw new Error('File is not of accepted type! JPG/PNG/WEBP only.');
    if (obj.file.size >= MAX_FILE_SIZE) throw new Error('Image must be under 1MB in size!');

    // It is optional to upload an image file; unset the file key if file not uploaded
  } else if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size === 0) {
    obj.file = null;
  } else {
    obj.file = null;
    throw new Error('Wrong type of file!');
  }

  return { deviceName, deviceNumber, deviceManufacturer, deviceDescription, amount, image: obj.file };
};

export const validateCustomer = (formData: FormData) => {
  const name = formData.get('name');
  if (!name || typeof name !== 'string' || name.toString().length < 5) {
    throw new Error('Customer name must be over 5 characters.')
  }

  if (name.toString().length > 50) {
    throw new Error('Customer name must be under 50 characters.')
  }

  const email = formData.get('email');
  if (!email || typeof email !== 'string' || email.toString().length < 1) {
    throw new Error('Email address is required.')
  }

  if (!validateEmail(email)) throw new Error('Invalid email address.')

  const company = formData.get('company');
  if (!company || typeof company !== 'string' || company.toString().length < 1) {
    throw new Error('Customer company is required.')
  }

  if (company.toString().length > 50) {
    throw new Error('Customer name must be under 50 characters.')
  }

  // Assign file to a key so we can unset it if needed
  const obj = { file: formData.get('image') };

  // If file was uploaded at all, check its validity
  if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size > 0) {
    if (!ACCEPTED_IMAGE_TYPES.includes(obj.file.type)) throw new Error('File is not of accepted type! JPG/PNG/WEBP only.');
    if (obj.file.size >= MAX_FILE_SIZE) throw new Error('Image must be under 1MB in size!');

    // It is optional to upload an image file; unset the file key if file not uploaded
  } else if (obj.file instanceof File && obj.file !== null && obj.file !== undefined && obj.file.size === 0) {
    obj.file = null;
  } else {
    obj.file = null;
    throw new Error('Wrong type of file!');
  }

  return { name, email, company, image: obj.file };
};