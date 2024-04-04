require('dotenv').config();

import { Revenue, InvoicesTable as InvoicesTableType, ErrorWithStatusCode } from './definitions';

/**
 * Return US dollar amount from a sum of cents as a formatted string.
 * @param amount 
 * @returns string
 */
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

/**
 * An array that holds month names of the year and their order in the form of array indices (indexes)
 */
export const monthNames = [
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

/**
 * @param {InvoicesTableType[]} invoices An array of invoices
 * @returns An array of month objects that holds revenue from the last 12 months
 */
export const calculateRevenue = (invoices: InvoicesTableType[]) => {

  /**
   * getMonth() returns an index of the month of a given date, which is
   * convenient, because we have a monthNames list in the file and can use
   * it with getMonth().
   */
  const date = new Date();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  let revenue: Revenue[] = [];

  /**
   * Let's fill the revenue list with 12 objects that each hold a month name,
   * that month's revenue, and the year.
   */
  for (let a = 11, b = 0; a >= 0; a--, b++) {
    /**
     * Index of the month at each step. If current month is April (index no. 3) and we're looking 
     * six months back, we get the right index (9) with ((3 - 6) + 12) % 12, because that modular
     * operation always returns a positive remainder. We'll use this number to get the correct month
     * name from month name list later.
    */
    let monthIndex = ((currentMonth - b) + 12) % 12;

    /**
     * Twelth (index no. 11) element in the revenue list will hold an object that holds current month,
     * year and revenue, eleventh (index 10) element will hold last month's revenue, and so on.
     */
    revenue[a] = {

      // Get month name with month index
      month: monthNames[monthIndex],

      /**
       * If current month's number is more than or equal to the amount of months we're looking 
       * into the past (let b), year is current year. Otherwise year is past year, i.e. one less than
       * the current year.
       */
      year: currentMonth >= b ? currentYear : currentYear - 1,
      revenue: 0
    }

    invoices.forEach(
      (inv) => {
        const invoiceDate = new Date(inv.date);
        const invoiceMonth = invoiceDate.getMonth();
        const amount = inv.amountInCents / 100;
        const status = inv.status;

        if (invoiceMonth === monthIndex && status === 'paid') {
          revenue[a].revenue += amount;
        }
      }
    );
  }

  return revenue;
}

/**
 * Check the shape of any error object and return error object with error message and
 * given HTTP status code.
 * @param {unknown} errorObject 
 * @returns error object with message and HTTP status code
 */
export const errorWithStatusCode = (errorObject: unknown, code: number): ErrorWithStatusCode => {
  let error: string;
  let statusCode: number;

  if (errorObject instanceof Error) {
    error = errorObject.message;
  } else if (errorObject && typeof errorObject === 'object' && 'message' in errorObject) {
    error = String(errorObject.message);
  } else if (typeof errorObject === 'string') {
    error = errorObject;
  } else {
    error = 'Something went wrong!'
  }

  /**
   * If error is already ErrorWithStatusCode, for example if you're throwing an error with 404
   * and you're returning it while catching it, statusCode is error's statusCode,
   * otherwise if for example error is an instance of Error that lacks status code property,
   * statusCode is code parameter's provided argument.
   */
  if (isErrorWithStatusCodeType(errorObject)) {
    statusCode = errorObject.statusCode;
  } else {
    statusCode = code;
  }

  return { error, statusCode };
}

export const isErrorWithStatusCodeType = (x: any): x is ErrorWithStatusCode => {
  return x.code !== undefined;
}