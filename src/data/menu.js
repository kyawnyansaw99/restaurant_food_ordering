import { Salad, Soup, CookingPot, Wheat, Flame, CakeSlice, CupSoda } from 'lucide-react';

export const RESTAURANT = {
  name: 'Saffron & Spoon',
  tagline: 'Asian street food, cooked to order',
  currency: 'THB',
  deliveryFee: 39,
  freeDeliveryOver: 500,
  vatRate: 0.07, // Thai VAT — menu prices already include it
  prepMinutes: 25,
};

export const CATEGORIES = [
  { id: 'starters', name: 'Starters', emoji: '🥟', icon: Salad },
  { id: 'soups', name: 'Soups', emoji: '🥣', icon: Soup },
  { id: 'noodles', name: 'Noodles', emoji: '🍜', icon: CookingPot },
  { id: 'rice', name: 'Rice & Curry', emoji: '🍛', icon: Wheat },
  { id: 'wok', name: 'Wok & Grill', emoji: '🔥', icon: Flame },
  { id: 'desserts', name: 'Desserts', emoji: '🍨', icon: CakeSlice },
  { id: 'drinks', name: 'Drinks', emoji: '🧋', icon: CupSoda },
];

// ---- Reusable option groups (prices in THB) -------------------------------
const spice = {
  id: 'spice', name: 'Spice level', type: 'single', required: true,
  choices: [
    { id: 'mild', name: 'Mild', price: 0 },
    { id: 'medium', name: 'Medium', price: 0 },
    { id: 'hot', name: 'Hot', price: 0 },
    { id: 'thai-hot', name: 'Thai hot 🔥', price: 0 },
  ],
};

const protein = {
  id: 'protein', name: 'Protein', type: 'single', required: true,
  choices: [
    { id: 'chicken', name: 'Chicken', price: 0 },
    { id: 'beef', name: 'Beef', price: 30 },
    { id: 'shrimp', name: 'Shrimp', price: 50 },
    { id: 'tofu', name: 'Tofu', price: 0 },
  ],
};

const extras = {
  id: 'extras', name: 'Add-ons', type: 'multi', required: false,
  choices: [
    { id: 'egg', name: 'Fried egg', price: 15 },
    { id: 'veg', name: 'Extra vegetables', price: 20 },
    { id: 'rice', name: 'Extra jasmine rice', price: 20 },
  ],
};

const noodleExtras = {
  id: 'extras', name: 'Add-ons', type: 'multi', required: false,
  choices: [
    { id: 'egg', name: 'Soft-boiled egg', price: 15 },
    { id: 'veg', name: 'Extra vegetables', price: 20 },
    { id: 'noodles', name: 'Extra noodles', price: 30 },
  ],
};

const riceSide = {
  id: 'rice', name: 'Rice', type: 'single', required: true,
  choices: [
    { id: 'jasmine', name: 'Jasmine rice', price: 0 },
    { id: 'brown', name: 'Brown rice', price: 10 },
    { id: 'coconut', name: 'Coconut rice', price: 20 },
  ],
};

const portion = {
  id: 'portion', name: 'Portion', type: 'single', required: true,
  choices: [
    { id: 'regular', name: 'Regular', price: 0 },
    { id: 'sharing', name: 'Sharing size', price: 90 },
  ],
};

const drinkSize = {
  id: 'size', name: 'Size', type: 'single', required: true,
  choices: [
    { id: 'regular', name: 'Regular', price: 0 },
    { id: 'large', name: 'Large', price: 15 },
  ],
};

const sweetness = {
  id: 'sweet', name: 'Sweetness', type: 'single', required: true,
  choices: [
    { id: '100', name: 'Normal sweet', price: 0 },
    { id: '50', name: 'Half sweet', price: 0 },
    { id: '0', name: 'No sugar', price: 0 },
  ],
};

// ---- Menu (prices in THB, VAT included) -----------------------------------
const item = (id, category, name, description, price, emoji, tags = [], options = []) => ({
  id, category, name, description, price, emoji, tags, options,
  image: `images/${id}.jpg`,
  available: true,
});

export const SEED_MENU = [
  // Starters
  item('s1', 'starters', 'Pork & Shrimp Wontons', 'Silky handmade steamed wontons with a soy-vinegar dipping sauce.', 129, '🥟', ['popular']),
  item('s2', 'starters', 'Crispy Egg Rolls', 'Golden rolls stuffed with cabbage, carrot and pork. Sweet chili dip.', 99, '🌯'),
  item('s3', 'starters', 'Thai Chicken Cakes', 'Lemongrass and lime-leaf chicken patties with sweet chilli sauce.', 119, '🍘'),
  item('s4', 'starters', 'Salt & Pepper Squid', 'Light, crisp squid tossed with garlic, chili and spring onion.', 159, '🦑', ['popular']),
  item('s5', 'starters', 'BBQ Pork Buns', 'Fluffy steamed buns filled with sticky char siu pork. Three pieces.', 99, '🥯'),
  item('s6', 'starters', 'Smashed Sesame Cucumber', 'Cold smashed cucumber with garlic, sesame and rice vinegar.', 79, '🥒', ['vegetarian']),
  item('s7', 'starters', 'Bang Bang Prawn Salad', 'Prawns, crunchy slaw and a creamy peanut-chili dressing.', 169, '🦐', ['spicy']),
  item('s8', 'starters', 'Veggie Tempura', 'Tender broccoli in airy tempura batter with nuoc cham dip.', 119, '🥦', ['vegetarian']),

  // Soups
  item('so1', 'soups', 'Tom Yum Goong', 'Hot and sour prawn soup with lemongrass, galangal and lime leaf.', 189, '🍤', ['popular', 'spicy'], [spice, portion]),
  item('so2', 'soups', 'Tom Kha Gai', 'Creamy coconut chicken soup with galangal and mushrooms.', 169, '🥥', [], [spice, portion]),
  item('so3', 'soups', 'Beef Pho', 'Slow-simmered 12-hour beef broth, rice noodles, herbs and lime.', 179, '🍲', ['popular'], [noodleExtras]),
  item('so4', 'soups', 'Hot & Sour Soup', 'Tofu, bamboo shoots and mushrooms in a peppery, tangy broth.', 119, '🌶️', ['spicy'], [portion]),
  item('so5', 'soups', 'Egg Drop Soup', 'Comforting chicken broth with silky ribbons of egg.', 99, '🥚', [], [portion]),
  item('so6', 'soups', 'Thai Pumpkin Soup', 'Roasted pumpkin, coconut milk and red curry paste.', 119, '🎃', ['vegetarian'], [portion]),

  // Noodles
  item('n1', 'noodles', 'Pad Thai', 'Wok-fried rice noodles, tamarind, peanuts, bean sprouts and lime.', 159, '🍝', ['popular'], [protein, spice, extras]),
  item('n2', 'noodles', 'Drunken Noodles', 'Wide rice noodles with holy basil, chili and garlic — pad kee mao.', 159, '🍜', ['spicy'], [protein, spice, extras]),
  item('n3', 'noodles', 'Pad See Ew', 'Charred wide noodles, Chinese broccoli, egg and sweet soy.', 149, '🥢', [], [protein, extras]),
  item('n4', 'noodles', 'King Prawn Laksa', 'Rich coconut curry broth with prawns, tofu puffs and noodles.', 199, '🍤', ['spicy', 'popular'], [spice, noodleExtras]),
  item('n5', 'noodles', 'Yaki Udon', 'Thick udon stir-fried with vegetables and savory sauce.', 169, '🍜', [], [protein, noodleExtras]),
  item('n6', 'noodles', 'Singapore Noodles', 'Thin curried rice noodles with shrimp, egg and peppers.', 169, '🍤', ['spicy'], [spice, noodleExtras]),
  item('n7', 'noodles', 'Beef Lo Mein', 'Soft egg noodles tossed with tender beef and vegetables.', 179, '🥩', [], [noodleExtras]),
  item('n8', 'noodles', 'Shoyu Ramen', 'Soy-chicken broth, springy noodles and a marinated soft egg.', 189, '🍥', ['popular'], [noodleExtras]),
  item('n9', 'noodles', 'Mee Goreng Mamak', 'Malaysian street-style spicy fried yellow noodles.', 149, '🌶️', ['spicy'], [protein, spice]),

  // Rice & Curry
  item('r1', 'rice', 'Thai Green Curry', 'Fragrant green curry with Thai eggplant and basil.', 179, '🍛', ['popular', 'spicy'], [protein, spice, riceSide]),
  item('r2', 'rice', 'Massaman Beef Curry', 'Slow-braised beef, potatoes and peanuts in a mild, rich curry.', 229, '🥘', [], [riceSide]),
  item('r3', 'rice', 'Panang Chicken Curry', 'Thick, nutty red curry with kaffir lime leaves.', 179, '🍛', ['spicy'], [spice, riceSide]),
  item('r4', 'rice', 'Beef Rendang', 'Malaysian dry curry, slow-cooked until tender and caramelized.', 249, '🥩', ['popular'], [riceSide]),
  item('r5', 'rice', 'Nasi Lemak', 'Coconut rice, sambal, fried anchovies, peanuts, egg and cucumber.', 159, '🍚', ['popular', 'spicy']),
  item('r6', 'rice', 'Chicken Katsu Curry', 'Crispy panko chicken with Japanese curry sauce and rice.', 199, '🍛', [], [extras]),
  item('r7', 'rice', 'Katsudon', 'Pork cutlet simmered with egg and onion over rice.', 189, '🍱'),
  item('r8', 'rice', 'Basil Chicken Rice', 'Holy basil chicken stir-fry, jasmine rice, crispy fried egg.', 129, '🌿', ['spicy', 'popular'], [spice, extras]),
  item('r9', 'rice', 'Teriyaki Salmon Bowl', 'Honey-teriyaki glazed salmon, greens and sesame rice.', 279, '🍣', [], [riceSide, extras]),
  item('r10', 'rice', 'Prawn Fried Rice', 'Thai-style fried rice with prawns, peas, egg and lime.', 159, '🍤', [], [extras]),

  // Wok & Grill
  item('w1', 'wok', 'Kung Pao Chicken', 'Chicken, peanuts and dried chilies in a tangy Sichuan sauce.', 179, '🌶️', ['spicy'], [spice, riceSide]),
  item('w2', 'wok', "General Tso's Chicken", 'Crispy chicken in a sweet, garlicky, slightly spicy glaze.', 179, '🍗', ['popular'], [riceSide]),
  item('w3', 'wok', 'Beef & Broccoli', 'Tender beef and broccoli in a glossy oyster sauce.', 199, '🥦', [], [riceSide]),
  item('w4', 'wok', 'Mapo Tofu', 'Soft tofu in a numbing, spicy Sichuan bean sauce.', 159, '🌶️', ['spicy'], [spice, riceSide]),
  item('w5', 'wok', 'Sichuan Eggplant', 'Silky eggplant in a sweet, sour and spicy garlic sauce.', 139, '🍆', ['vegetarian', 'spicy'], [riceSide]),
  item('w6', 'wok', 'Chicken Karaage', 'Japanese fried chicken thigh with lemon and kewpie mayo.', 149, '🍗', ['popular']),
  item('w7', 'wok', 'Ayam Percik', 'Malaysian grilled chicken basted in spiced coconut sauce.', 219, '🔥', [], [riceSide]),
  item('w8', 'wok', 'Red Curry Chicken Skewers', 'Charcoal-grilled skewers with peanut sauce and cucumber relish.', 149, '🍢', ['spicy']),
  item('w9', 'wok', 'Lemongrass Grilled Pork', 'Vietnamese grilled pork with vermicelli, herbs and nuoc cham.', 179, '🥢'),
  item('w10', 'wok', 'Tofu & Cashew Stir-fry', 'Crispy tofu, greens and toasted cashews in soy-ginger sauce.', 149, '🥜', ['vegetarian'], [riceSide]),

  // Desserts
  item('d1', 'desserts', 'Mango Custard', 'Layers of mango purée and silky vanilla custard.', 99, '🥭', ['popular', 'vegetarian']),
  item('d2', 'desserts', 'Apam Balik', 'Crispy Malaysian peanut pancake with sweet corn and sugar.', 79, '🥞', ['vegetarian']),
  item('d3', 'desserts', 'Seri Muka', 'Two-layer kuih: sticky coconut rice under pandan custard.', 69, '🍰', ['vegetarian']),
  item('d4', 'desserts', 'Tapioca & Banana Pudding', 'Warm Lao coconut tapioca pudding with ripe bananas.', 79, '🍌', ['vegetarian']),
  item('d5', 'desserts', 'Pandan Waffles', 'Cambodian coconut waffles, crisp outside and chewy inside.', 89, '🧇', ['vegetarian']),

  // Drinks
  item('k1', 'drinks', 'Thai Iced Tea', 'Strong spiced black tea with condensed milk, over ice.', 65, '🧋', ['popular'], [drinkSize, sweetness]),
  item('k2', 'drinks', 'Thai Iced Coffee', 'Dark-roast coffee with sweetened milk, over ice.', 65, '☕', [], [drinkSize, sweetness]),
  item('k3', 'drinks', 'Mango Lassi', 'Chilled yogurt blended with ripe mango.', 85, '🥭', ['popular', 'vegetarian'], [drinkSize]),
  item('k4', 'drinks', 'Fresh Limeade', 'Freshly squeezed lime, a little sugar, sparkling water.', 55, '🍋', ['vegetarian'], [drinkSize, sweetness]),
  item('k5', 'drinks', 'Strawberry Lemonade', 'House lemonade with crushed strawberries.', 75, '🍓', ['vegetarian'], [drinkSize]),
  item('k6', 'drinks', 'Masala Chai', 'Hot black tea brewed with milk, ginger and warm spices.', 65, '🫖', ['vegetarian'], [sweetness]),
  item('k7', 'drinks', 'Mango Smoothie', 'Thick, creamy mango smoothie.', 95, '🥤', ['vegetarian'], [drinkSize]),
  item('k8', 'drinks', 'Kiwi Papaya Smoothie', 'Kiwi, papaya and banana blended with ice.', 95, '🥝', ['vegetarian'], [drinkSize]),
];

export const ORDER_STATUSES = [
  { id: 'placed', label: 'Order placed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'on_the_way', label: 'On the way' },
  { id: 'delivered', label: 'Delivered' },
];
