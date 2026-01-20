// Helper to generate quantity options from min to max
function generateQuantityOptions(min, max) {
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(i);
  }
  return options;
}

// Product catalog for Mitch's Treats - Purim 2025
const PRODUCTS = [
  {
    id: 'hamantaschen',
    name: 'Hamantaschen',
    price: 1.00,
    images: [
      'images/Purim/Hamantachen 1.jpg',
      'images/Purim/Hamantachen 3.jpg',
      'images/Purim/Hamantachen.jpg',
      'images/Purim/Apricot Hamantachen.jpg',
      'images/Purim/Chocolate Hamantachen.jpg',
      'images/Purim/Raspberry Hamantachen.jpg'
    ],
    description: 'Traditional triangle-shaped Purim cookies with delicious fillings (minimum order of 15)',
    hasFlavorOptions: true,
    flavors: [
      'Poppyseed',
      'Apricot',
      'Raspberry',
      'Chocolate',
      'Nutella',
      'Peanut Butter',
      'Pistachio',
      'Dates',
      'Assorted - Pick up to 4 fillings'
    ],
    minQuantity: 15,
    quantityOptions: generateQuantityOptions(15, 100),
    hasFillingSelection: true,
    fillingOptions: [
      'Poppyseed',
      'Apricot',
      'Raspberry',
      'Chocolate',
      'Nutella',
      'Peanut Butter',
      'Pistachio',
      'Dates'
    ],
    fillingTrigger: 'Assorted - Pick up to 4 fillings'
  },
  {
    id: 'hamantaschen-box',
    name: 'Hamantaschen Box',
    price: 23.00,
    images: [
      'images/Purim/Hamantachen Box 1.jpg',
      'images/Purim/Hamantachen Box 2.jpg'
    ],
    description: 'Beautiful gift box containing 25 hamantaschen - pick up to 4 fillings',
    hasFlavorOptions: false,
    defaultFlavor: 'Custom Selection (25 pieces)',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 10),
    isKit: true,
    hasFillingSelection: true,
    fillingOptions: [
      'Poppyseed',
      'Apricot',
      'Raspberry',
      'Chocolate',
      'Nutella',
      'Peanut Butter',
      'Pistachio',
      'Dates'
    ],
    fillingTrigger: null
  },
  {
    id: 'mishloach-manot',
    name: 'Mishloach Manot',
    price: 40.00,
    images: [
      'images/Purim/Mishlocj Manot 1.jpg',
      'images/Purim/Mishlocj Manot 2.jpg',
      'images/Purim/Mishlocj Manot 3.jpg'
    ],
    description: 'Complete Purim gift basket with hamantaschen, treats, and traditional goodies',
    hasFlavorOptions: false,
    defaultFlavor: 'Complete Gift',
    minQuantity: 1,
    quantityOptions: generateQuantityOptions(1, 20),
    isKit: true
  }
];

// Holiday context
const HOLIDAY = 'Purim';

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, HOLIDAY };
}
