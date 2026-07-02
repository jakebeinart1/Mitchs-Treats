// Helper to generate quantity options from min to max
function generateQuantityOptions(min, max) {
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(i);
  }
  return options;
}

// Product catalog for Mitch's Treats - Challah & Babka (year-round)
const PRODUCTS = [
  {
    id: 'challah-buns',
    name: 'Challah Buns',
    price: 2.00,
    images: ['images/challah pics/image5.jpeg'],
    description: 'Soft, golden challah buns with your choice of topping. $2 each, minimum 6. All parve. About 50g each. Can order assorted — minimum 6 total.',
    hasFlavorOptions: true,
    flavors: ['Plain', 'Everything (ET)', 'Sesame', 'Assorted'],
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 48),
    hasFillingSelection: true,
    fillingTrigger: 'Assorted',
    fillingOptions: ['Plain', 'Everything (ET)', 'Sesame'],
    fillingSelectionTitle: 'Which toppings would you like in your mix?',
    fillingMax: null
  },
  {
    id: 'filled-challah-buns',
    name: 'Filled Challah Buns',
    price: 2.50,
    images: [
      'images/challah pics/image3.jpeg',
      'images/challah pics/image4.jpeg',
      'images/challah pics/image0.jpeg',
      'images/challah pics/image1.jpeg',
      'images/challah pics/image2.jpeg'
    ],
    description: 'Challah buns filled with your choice of filling. $2.50 each, minimum 6. Can order assorted — minimum 6 total.',
    hasFlavorOptions: true,
    flavors: [
      'Cream Cheese & Green Olives (dairy)',
      'Boursin (dairy)',
      'Nutella (dairy, contains nuts)',
      'Pizza (dairy)',
      'Pesto (contains nuts)',
      'Chocolate Milk (parve)',
      'Assorted'
    ],
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 48),
    hasFillingSelection: true,
    fillingTrigger: 'Assorted',
    fillingOptions: [
      'Cream Cheese & Green Olives (dairy)',
      'Boursin (dairy)',
      'Nutella (dairy, contains nuts)',
      'Pizza (dairy)',
      'Pesto (contains nuts)',
      'Chocolate Milk (parve)'
    ],
    fillingSelectionTitle: 'Which fillings would you like in your mix?',
    fillingMax: null
  },
  {
    id: 'challah-bites',
    name: 'Challah Bites',
    price: 12.00,
    images: [
      'images/challah pics/image6.jpeg',
      'images/challah pics/image7.jpeg'
    ],
    description: 'Bite-sized challah rolls — perfect for snacking or serving at a gathering. $12 per dozen. Parve.',
    hasFlavorOptions: false,
    defaultFlavor: 'Parve',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  },
  {
    id: 'challah-bites-filled',
    name: 'Challah Bites with Filling',
    price: 18.00,
    images: [
      'images/challah pics/image6.jpeg',
      'images/challah pics/image7.jpeg'
    ],
    description: 'Bite-sized challah rolls filled with your choice of filling. $18 per dozen. Can order assorted fillings — minimum 1 dozen.',
    hasFlavorOptions: true,
    flavors: [
      'Cream Cheese & Green Olives (dairy)',
      'Boursin (dairy)',
      'Nutella (dairy, contains nuts)',
      'Pizza (dairy)',
      'Pesto (contains nuts)',
      'Chocolate Milk (parve)',
      'Assorted'
    ],
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true,
    hasFillingSelection: true,
    fillingTrigger: 'Assorted',
    fillingOptions: [
      'Cream Cheese & Green Olives (dairy)',
      'Boursin (dairy)',
      'Nutella (dairy, contains nuts)',
      'Pizza (dairy)',
      'Pesto (contains nuts)',
      'Chocolate Milk (parve)'
    ],
    fillingSelectionTitle: 'Which fillings would you like in your mix?',
    fillingMax: null
  },
  {
    id: 'chocolate-babka',
    name: 'Chocolate Babka',
    price: 15.00,
    images: ['images/challah pics/bobka.jpeg'],
    description: 'Rich, swirled chocolate babka baked fresh to order. Available as a full loaf or half loaf.',
    hasFlavorOptions: true,
    flavors: [
      'Full Loaf - $15',
      'Half Loaf - $8'
    ],
    flavorPrices: {
      'Full Loaf - $15': 15,
      'Half Loaf - $8': 8
    },
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true
  }
];

// Holiday context
const HOLIDAY = 'Challah & Babka';

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, HOLIDAY };
}
