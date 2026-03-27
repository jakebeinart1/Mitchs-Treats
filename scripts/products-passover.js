// Helper to generate quantity options from min to max
function generateQuantityOptions(min, max) {
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(i);
  }
  return options;
}

// Product catalog for Mitch's Treats - Passover 2026
const PRODUCTS = [
  {
    id: 'chocolate-chip-cookies',
    name: 'Chocolate Chip Cookies (dozen)',
    price: 15.00,
    images: ['images/Passover/Chcooclate Chips cookies.jpg'],
    description: 'Delicious kosher-style-for-Passover chocolate chip cookies. $15 per dozen. Available in parve or dairy.',
    hasFlavorOptions: true,
    flavors: ['Parve', 'Dairy'],
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 5),
    isKit: true
  },
  {
    id: 'lemon-bars',
    name: 'Lemon Bars',
    price: 1.00,
    images: ['images/Passover/Lemon Bars.jpg'],
    description: 'Tangy and sweet lemon bars, perfect for Passover. Parve.',
    hasFlavorOptions: false,
    defaultFlavor: 'Parve',
    minQuantity: 10,
    quantityOptions: generateQuantityOptions(10, 50)
  },
  {
    id: 'pecan-bars',
    name: 'Pecan Bars',
    price: 1.50,
    images: ['images/Passover/Pecan Bars.jpg'],
    description: 'Rich pecan bars made kosher-style for Passover. Parve. Contains nuts.',
    hasFlavorOptions: false,
    defaultFlavor: 'Parve',
    minQuantity: 10,
    quantityOptions: generateQuantityOptions(10, 50)
  },
  {
    id: 'almond-cookies',
    name: 'Almond Cookies',
    price: 1.00,
    images: [],
    description: 'Traditional almond cookies in a variety of flavors. Contains nuts.',
    hasFlavorOptions: true,
    flavors: [
      'Dates (Parve)',
      'Nutella (Dairy)',
      'Dulce (Dairy)',
      'Milk Chocolate (Dairy)',
      'Milk Chocolate (Parve)'
    ],
    minQuantity: 10,
    quantityOptions: generateQuantityOptions(10, 50)
  },
  {
    id: 'coconut-balls',
    name: 'Chocolate Covered Coconut Balls',
    price: 1.50,
    images: ['images/Passover/Chocolate covered coconut balls.jpg'],
    description: 'Chocolate covered coconut balls, a Passover favorite. Dairy.',
    hasFlavorOptions: false,
    defaultFlavor: 'Dairy',
    minQuantity: 10,
    quantityOptions: generateQuantityOptions(10, 50)
  },
  {
    id: 'cookie-box',
    name: 'Cookie Box',
    price: 32.00,
    images: ['images/Passover/Cookie Box.jpg'],
    description: 'Assorted cookie box with pecan bars, lemon bars, almond cookies, and chocolate chip cookies (8 of each).',
    hasFlavorOptions: false,
    defaultFlavor: 'Assorted Box',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  },
  {
    id: 'macaroons',
    name: 'Macaroons',
    price: 2.50,
    images: ['images/Passover/Macaroons.jpeg', 'images/Passover/Macaroons 2.jpeg'],
    description: 'Delicate macaroons with your choice of filling. Regular: $2.50 each (min 6). Mini: $1.00 each (min 10). Contains nuts.',
    hasFlavorOptions: true,
    flavors: [
      'Regular - Vanilla Buttercream - $2.50',
      'Regular - Dulce Buttercream - $2.50',
      'Mini - Vanilla Buttercream - $1.00',
      'Mini - Dulce Buttercream - $1.00'
    ],
    flavorPrices: {
      'Regular - Vanilla Buttercream - $2.50': 2.50,
      'Regular - Dulce Buttercream - $2.50': 2.50,
      'Mini - Vanilla Buttercream - $1.00': 1.00,
      'Mini - Dulce Buttercream - $1.00': 1.00
    },
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(1, 50)
  },
  {
    id: 'coconut-meringue',
    name: 'Coconut Meringue',
    price: 3.50,
    images: ['images/Passover/Meringue.jpeg'],
    description: 'Light and airy coconut meringues. Regular: $3.50 each. Mini: $1.50 each.',
    hasFlavorOptions: true,
    flavors: [
      'Regular - $3.50',
      'Mini - $1.50'
    ],
    flavorPrices: {
      'Regular - $3.50': 3.50,
      'Mini - $1.50': 1.50
    },
    minQuantity: 5,
    quantityOptions: generateQuantityOptions(1, 50)
  },
  {
    id: 'meringue',
    name: 'Meringue',
    price: 2.50,
    images: ['images/Passover/Coconut Meringue.jpeg', 'images/Passover/Coconut Meringue 2.jpeg'],
    description: 'Classic meringues with sprinkles. Regular: $2.50 each. Mini: $1.25 each.',
    hasFlavorOptions: true,
    flavors: [
      'Regular - $2.50',
      'Mini - $1.25'
    ],
    flavorPrices: {
      'Regular - $2.50': 2.50,
      'Mini - $1.25': 1.25
    },
    minQuantity: 5,
    quantityOptions: generateQuantityOptions(1, 50)
  },
  {
    id: 'log-cake',
    name: 'Log Cake',
    price: 10.00,
    images: ['images/Passover/Vanilla Log Cake.jpg'],
    description: 'Beautiful log cake available in vanilla or chocolate, 5" or 10", dairy or parve.',
    hasFlavorOptions: true,
    flavors: [
      'Vanilla 5" Dairy - $10',
      'Vanilla 5" Parve - $15',
      'Vanilla 10" Dairy - $20',
      'Vanilla 10" Parve - $30',
      'Chocolate 5" Dairy - $10',
      'Chocolate 5" Parve - $15',
      'Chocolate 10" Dairy - $20',
      'Chocolate 10" Parve - $30'
    ],
    flavorPrices: {
      'Vanilla 5" Dairy - $10': 10,
      'Vanilla 5" Parve - $15': 15,
      'Vanilla 10" Dairy - $20': 20,
      'Vanilla 10" Parve - $30': 30,
      'Chocolate 5" Dairy - $10': 10,
      'Chocolate 5" Parve - $15': 15,
      'Chocolate 10" Dairy - $20': 20,
      'Chocolate 10" Parve - $30': 30
    },
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  },
  {
    id: 'tres-leches',
    name: 'Tres Leches Cake (8x8)',
    price: 30.00,
    images: ['images/Passover/Tres Leches.jpg'],
    description: 'Rich tres leches cake in an 8x8 tray. Available dairy or parve.',
    hasFlavorOptions: true,
    flavors: ['Dairy - $30', 'Parve - $40'],
    flavorPrices: {
      'Dairy - $30': 30,
      'Parve - $40': 40
    },
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  },
  {
    id: 'krembo-cake',
    name: 'Krembo Cake (8x8)',
    price: 30.00,
    images: ['images/Passover/Krembo Cake.jpg'],
    description: 'Delicious krembo-inspired cake in an 8x8 tray. Available dairy or parve.',
    hasFlavorOptions: true,
    flavors: ['Dairy - $30', 'Parve - $40'],
    flavorPrices: {
      'Dairy - $30': 30,
      'Parve - $40': 40
    },
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake (8x8)',
    price: 30.00,
    images: ['images/Passover/Raspberry Cheese Cake.jpg'],
    description: 'Creamy cheesecake in an 8x8 tray. Dairy.',
    hasFlavorOptions: true,
    flavors: ['Raspberry', 'Dulce'],
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  },
  {
    id: 'brownie',
    name: 'Brownie (8x8)',
    price: 25.00,
    images: ['images/Passover/Brownie 8x8.jpg'],
    description: 'Fudgy brownie in an 8x8 tray. Available dairy or parve.',
    hasFlavorOptions: true,
    flavors: ['Dairy - $25', 'Parve - $35'],
    flavorPrices: {
      'Dairy - $25': 25,
      'Parve - $35': 35
    },
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  }
];

// Holiday context
const HOLIDAY = 'Passover';

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, HOLIDAY };
}
