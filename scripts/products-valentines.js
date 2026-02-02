// Helper to generate quantity options from min to max
function generateQuantityOptions(min, max) {
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(i);
  }
  return options;
}

// Product catalog for Mitch's Treats - Valentines 2025
const PRODUCTS = [
  {
    id: 'cake-pop',
    name: 'Cake Pop',
    price: 3.00,
    images: [
      'images/Valentines/cake pops.png',
      'images/Valentines/donut-cake-pop.jpeg',
      'images/Valentines/heart-cake-pop.jpeg'
    ],
    description: 'Delicious decorated cake pops - choose from classic, donut, or heart shapes (minimum order of 6, mix and match!)',
    hasFlavorOptions: true,
    flavors: ['Classic', 'Donut', 'Heart'],
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 36)
  },
  {
    id: 'ice-cream-cake-pop',
    name: 'Ice Cream Cake Pop',
    price: 3.75,
    images: ['images/Valentines/ice-cream-cake-pop.jpeg'],
    description: 'Adorable cake pop shaped like an ice cream cone with sprinkles (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Vanilla',
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 36)
  },
  {
    id: 'chocolate-marshmallow-rose',
    name: 'Chocolate Covered Marshmallow Rose',
    price: 1.75,
    images: ['images/Valentines/chocolate-marshmallow-rose.jpeg'],
    description: 'Beautiful chocolate covered marshmallow roses (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Chocolate',
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 36)
  },
  {
    id: 'chocolate-covered-oreo',
    name: 'Chocolate Covered Double Stuffed Oreo',
    price: 3.00,
    images: ['images/Valentines/chocolate-covered-oreo.jpeg'],
    description: 'White chocolate covered double stuffed Oreos with Valentine\'s decorations (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'White Chocolate',
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 36)
  },
  {
    id: 'raspberry-cinnabon',
    name: 'Raspberry Cinnabon',
    price: 8.00,
    images: ['images/Valentines/raspberry-cinnabon.jpeg'],
    description: 'Delicious raspberry cinnamon roll with cream cheese frosting - $8 each or $28 for 4',
    hasFlavorOptions: false,
    defaultFlavor: 'Raspberry',
    minQuantity: 1,
    quantityOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    hasBundlePricing: true,
    bundleSize: 4,
    bundlePrice: 28.00
  },
  {
    id: 'chocolate-pretzels',
    name: 'Chocolate Covered Pretzels',
    price: 2.00,
    images: ['images/Valentines/chocolate covered pretzels.png'],
    description: 'Chocolate covered pretzels with festive decorations (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Chocolate',
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 36)
  },
  {
    id: 'candy-skewers',
    name: 'Candy Skewers',
    price: 2.75,
    images: ['images/Valentines/Candy Skewer.jpg'],
    description: 'Colorful candy skewers (minimum order of 4)',
    hasFlavorOptions: false,
    defaultFlavor: 'Assorted',
    minQuantity: 4,
    quantityOptions: generateQuantityOptions(4, 36)
  },
  {
    id: 'triple-layer-brownie',
    name: 'Triple-Layer Brownie (4")',
    price: 8.00,
    images: [
      'images/Valentines/Triple Layer Brownie Heart.jpg',
      'images/Valentines/Triple Layer Brownie Square.jpg'
    ],
    description: 'An indulgent, layered dessert bar featuring a base of chocolate chip cookie dough, a middle layer of whole Oreo cookies, and a top layer of rich, fudgy brownie batter - choose heart or square shape',
    hasFlavorOptions: true,
    flavors: ['Heart Shape', 'Square Shape'],
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10)
  },
  {
    id: 'decorated-cookies',
    name: 'Decorated Cookies',
    price: 3.00,
    images: [
      'images/Valentines/Decorated cookies 1.jpg',
      'images/Valentines/Decorated cookies 3.jpg',
      'images/Valentines/Decorated cookies 4.jpg',
      'images/Valentines/Decorated cookies 5.jpg',
      'images/Valentines/Decorated cookies 6.jpg',
      'images/Valentines/Decorated cookies group.jpg'
    ],
    description: 'Custom decorated Valentine\'s cookies (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Sugar Cookie',
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 36)
  },
  {
    id: 'shortcake-cookies',
    name: 'Chocolate Dip Shortcake Cookies',
    price: 1.50,
    images: ['images/Valentines/Heart shortbread cookie deeped in chocolate 1.jpg'],
    description: 'Buttery shortcake cookies dipped in chocolate (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Chocolate Dipped',
    minQuantity: 6,
    quantityOptions: generateQuantityOptions(6, 36)
  },
  {
    id: 'small-rugalach',
    name: 'Small Rugalach',
    price: 1.00,
    images: ['images/Valentines/ugalach.jpg'],
    description: 'Traditional mini rugalach pastries (minimum order of 10)',
    hasFlavorOptions: false,
    defaultFlavor: 'Assorted',
    minQuantity: 10,
    quantityOptions: generateQuantityOptions(10, 50)
  },
  {
    id: 'coco-bomb',
    name: 'Heart Milk Chocolate Coco Bomb',
    price: 4.00,
    images: ['images/Valentines/Heart Chocolate coco bomb.jpg'],
    description: 'Heart-shaped hot chocolate bomb filled with marshmallows',
    hasFlavorOptions: false,
    defaultFlavor: 'Milk Chocolate',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 20)
  },
  {
    id: 'mini-cookie-cake-candy',
    name: 'Mini 3 Layered Cookie Cake (with candy)',
    price: 20.00,
    images: ['images/Valentines/Mini cookie Cake 3 layers 2.1.jpg'],
    description: 'Three-layer cookie cake decorated with candy',
    hasFlavorOptions: false,
    defaultFlavor: 'With Candy',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 5),
    isKit: true
  },
  {
    id: 'mini-cookie-cake-plain',
    name: 'Mini 3 Layered Cookie Cake (no candy)',
    price: 15.00,
    images: ['images/Valentines/Mini Cookie Cake 3 layers 1.jpg'],
    description: 'Three-layer cookie cake without candy decorations',
    hasFlavorOptions: false,
    defaultFlavor: 'No Candy',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 5),
    isKit: true
  },
  {
    id: 'mini-cake',
    name: 'Mini Cake (5")',
    price: 16.00,
    images: [
      'images/Valentines/Mini Cake 1.1.jpg',
      'images/Valentines/Mini Cake 3.1.jpg',
      'images/Valentines/Mini Cake 4.2.jpg',
      'images/Valentines/Mini Cake 5.3.jpg',
      'images/Valentines/Mini Cake 6.1.jpg',
      'images/Valentines/Mini Cake a4.1.jpg'
    ],
    description: '5-inch mini cake - choose your design',
    hasFlavorOptions: false,
    defaultFlavor: 'Custom Design',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 5),
    isKit: true,
    hasDesignDescription: true
  },
  {
    id: 'cookie-gift-box',
    name: 'Cookie Gift Box',
    price: 30.00,
    images: [
      'images/Valentines/Cookie Box 1.jpg',
      'images/Valentines/Cookie box 2.jpg',
      'images/Valentines/Cookie Box 3.jpg',
      'images/Valentines/Cookie Box.jpg',
      'images/Valentines/Valentine Box 2.jpg',
      'images/Valentines/Valentine Box 3.jpg'
    ],
    description: 'Beautiful gift box - pick exactly 4 cookie types from our selection',
    hasFlavorOptions: false,
    defaultFlavor: 'Custom Selection',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true,
    hasCookieSelection: true,
    cookieOptions: [
      'Chocolate chip',
      'Heart Lintzer',
      'Sugar cookies',
      'Mini rugalach',
      'Cookies with dates',
      'Alfajores',
      'Blossom (peanut butter)',
      'Snickerdoodle',
      'Pop tart bars',
      'White chocolate chips strawberry cookies'
    ]
  },
  {
    id: 'cookie-decorating-kit',
    name: 'Cookie Decorating Kit',
    price: 25.00,
    images: ['images/Valentines/Decorated cookies Kit 2.jpg'],
    description: 'Fun decorating kit with cookies, icing, and sprinkles',
    hasFlavorOptions: false,
    defaultFlavor: 'Complete Kit',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 5),
    isKit: true
  }
];

// Holiday context
const HOLIDAY = 'Valentines';

// Pickup time slots for Valentines
const PICKUP_TIME_SLOTS = [
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM'
];

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, HOLIDAY, PICKUP_TIME_SLOTS };
}
