// Product catalog for Mitch's Treats
const PRODUCTS = [
  {
    id: 'sofganiyot-4',
    name: 'Sofganiyot - Strawberry Jam',
    price: 4.00,
    images: ['images/Sofganiyot - Strawberry Jam/Sufganiyot Strawberry.jpg'],
    description: 'Traditional jelly donuts with strawberry jam filling',
    hasFlavorOptions: false,
    defaultFlavor: 'Strawberry Jam',
    minQuantity: 1,
    quantityOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 24, 36, 48]
  },
  {
    id: 'sofganiyot-4.5',
    name: 'Sofganiyot - Premium Fillings',
    price: 4.50,
    images: [
      'images/Sofganiyot - Premium Fillings/Sofganiya 1.jpg',
      'images/Sofganiyot - Premium Fillings/1.jpg',
      'images/Sofganiyot - Premium Fillings/3.jpg'
    ],
    description: 'Donuts with premium fillings',
    hasFlavorOptions: true,
    flavors: ['Nutella', 'Dulce de Leche', 'Vanilla Custard', 'Biscoff', 'Marshmallows'],
    minQuantity: 1,
    quantityOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 24, 36, 48]
  },
  {
    id: 'cake-pops',
    name: 'Cake Pops',
    price: 3.00,
    images: ['images/Cake Pops/cakepop.jpg'],
    description: 'Vanilla cake pops (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Vanilla',
    minQuantity: 6,
    quantityOptions: [6, 12, 18, 24, 36, 48]
  },
  {
    id: 'pretzels',
    name: 'Chocolate Covered Pretzels',
    price: 2.00,
    images: ['images/Chocolate Covered Pretzels/pretzels.jpg'],
    description: 'Chocolate covered pretzels (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Chocolate',
    minQuantity: 6,
    quantityOptions: [6, 12, 18, 24, 36, 48, 60]
  },
  {
    id: 'decorated-cookies',
    name: 'Decorated Cookies',
    price: 3.00,
    images: ['images/Decorated Cookies/Decorated cookies.jpg'],
    description: 'Custom decorated cookies (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Sugar Cookie',
    minQuantity: 6,
    quantityOptions: [6, 12, 18, 24, 36, 48]
  },
  {
    id: 'plain-cookies',
    name: 'Plain Hanukkah Cookies',
    price: 1.25,
    images: ['images/Plain Hanukkah Cookies/Cookies undecorated.jpg'],
    description: 'Plain Hanukkah cookies (minimum order of 6)',
    hasFlavorOptions: false,
    defaultFlavor: 'Plain',
    minQuantity: 6,
    quantityOptions: [6, 12, 18, 24, 36, 48]
  },
  {
    id: 'cookie-kit',
    name: 'Cookie Decorating Kit',
    price: 25.00,
    images: ['images/Cookie Decorating Kit/Cookie kit.jpg'],
    description: 'Includes 12 cookies, 2 color icings, and 3 kinds of sprinkles',
    hasFlavorOptions: false,
    defaultFlavor: 'Complete Kit',
    minQuantity: 1,
    quantityOptions: [1, 2, 3, 4, 5],
    isKit: true
  }
];

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}
