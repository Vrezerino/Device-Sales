const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const devices = [
  {
    deviceName: 'Pluribus',
    deviceManufacturer: 'BBN',
    deviceNumber: '785697845067',
    amount: 5,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/BBN_Pluribus_at_Wharton_School%2C_by_Tony_Patti%2C_April_1979.jpg',
    deviceDescription: 'The Pluribus multiprocessor was an early multi-processor computer designed by BBN for use as a packet switch in the ARPANET. Its design later influenced the BBN Butterfly computer. The Pluribus had its beginnings in 1972 when the need for a second-generation interface message processor (IMP) became apparent. At that time, the BBN had already installed IMPs at more than thirty-five ARPANET sites. These IMPs were Honeywell 316 and 516 minicomputers. The network was growing rapidly in several dimensions: number of nodes, hosts, and terminals; volume of traffic; and geographic coverage (including plans, now realized, for satellite extensions to Europe and Hawaii).'
  }
];

const customers = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    department: 'Accounting'
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
    department: 'Accounting'
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Hector Simpson',
    email: 'hector@simpson.com',
    image_url: '/customers/hector-simpson.png',
    department: 'Accounting'
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Steven Tey',
    email: 'steven@tey.com',
    image_url: '/customers/steven-tey.png',
    department: 'Accounting'
  }
];

const invoices = [
  {
    customer_id: customers[0].id,
    amountInCents: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[2].id,
    amountInCents: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[3].id,
    amountInCents: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[1].id,
    amountInCents: 44800,
    status: 'paid',
    date: '2023-09-10',
  }
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

module.exports = {
  users,
  customers,
  invoices,
  revenue,
  devices
};
