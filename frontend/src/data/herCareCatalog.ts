export type MarketplaceCategory = 
  | 'all'
  | 'period_essentials'
  | 'comfort_cravings'
  | 'gifts_feel_good'
  | 'self_care';

export interface RetailerOption {
  name: 'Blinkit' | 'Zepto' | 'Amazon' | 'Flipkart';
  badge: string;
  deliveryTime: string;
  color: string;
  url: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: 'period_essentials' | 'comfort_cravings' | 'gifts_feel_good' | 'self_care';
  brand: string;
  price: number;
  mrp: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  quickDeliverable: boolean;
  description: string;
  cycleBenefit: string;
  specs: string[];
  searchQuery: string;
  tags: string[];
  retailers: RetailerOption[];
}

export const MARKETPLACE_CATEGORIES = [
  { id: 'all' as MarketplaceCategory, label: 'All Products', icon: 'ShoppingBag', count: 24 },
  { id: 'period_essentials' as MarketplaceCategory, label: 'Period Essentials', icon: 'ShieldCheck', count: 7, desc: 'Pads, cups, pantyliners & disposal bags' },
  { id: 'comfort_cravings' as MarketplaceCategory, label: 'Comfort & Cravings', icon: 'Coffee', count: 6, desc: 'Chocolates, teas, hot bags & cramp relief' },
  { id: 'gifts_feel_good' as MarketplaceCategory, label: 'Gifts & Feel-Good', icon: 'Gift', count: 5, desc: 'Teddy bears, fresh flowers & pamper kits' },
  { id: 'self_care' as MarketplaceCategory, label: 'Self-Care', icon: 'Heart', count: 6, desc: 'Pimple patches, sheet masks & intimate hygiene' },
];

function makeRetailers(query: string, quick: boolean = true): RetailerOption[] {
  const enc = encodeURIComponent(query);
  const list: RetailerOption[] = [];
  if (quick) {
    list.push({
      name: 'Blinkit',
      badge: '10-15 Min',
      deliveryTime: '10-15 mins instant delivery',
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      url: `https://blinkit.com/s/?q=${enc}`
    });
    list.push({
      name: 'Zepto',
      badge: '10 Min',
      deliveryTime: '10 mins superfast delivery',
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      url: `https://www.zeptonow.com/search?query=${enc}`
    });
  }
  list.push({
    name: 'Amazon',
    badge: 'Next Day',
    deliveryTime: 'Prime 1-2 day delivery',
    color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    url: `https://www.amazon.in/s?k=${enc}`
  });
  list.push({
    name: 'Flipkart',
    badge: 'Minutes',
    deliveryTime: 'Flipkart Minutes / 1-day delivery',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    url: `https://www.flipkart.com/search?q=${enc}`
  });
  return list;
}

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  // 1. Period Essentials
  {
    id: 'pe-whisper-xl',
    name: 'Whisper Ultra Clean Sanitary Pads XL+ Wings (Pack of 30)',
    category: 'period_essentials',
    brand: 'Whisper',
    price: 389,
    mrp: 460,
    rating: 4.8,
    reviewsCount: 3820,
    image: '/products/whisper_pads.jpg',
    badge: 'Bestseller',
    quickDeliverable: true,
    description: 'Nearly 40% longer for leak-lock protection with herbal oil blend that locks odour and provides all-day dryness.',
    cycleBenefit: 'Ideal for days 1-3 when menstrual flow is heaviest; wings prevent side staining during sleep and active hours.',
    specs: ['30 Pads', 'XL Plus (317mm)', 'Wings with Herbal Oil', '100% Leak-Lock Core'],
    searchQuery: 'Whisper Ultra Clean XL pads 30',
    tags: ['pads', 'sanitary napkin', 'heavy flow', 'leak proof'],
    retailers: makeRetailers('Whisper Ultra Clean XL pads 30')
  },
  {
    id: 'pe-nua-pads',
    name: 'Nua Ultra-Safe Cottony Sanitary Pads with Disposal Covers (12 Pads)',
    category: 'period_essentials',
    brand: 'Nua',
    price: 299,
    mrp: 349,
    rating: 4.9,
    reviewsCount: 1940,
    image: '/products/nua_pads.jpg',
    badge: 'Toxin-Free',
    quickDeliverable: true,
    description: 'Made with a super-soft cottony top sheet, zero artificial fragrances, and each pad comes with a hygienic sealable disposal paper pouch.',
    cycleBenefit: 'Prevents skin chafing and contact dermatitis common with synthetic top-sheet pads in tropical humidity.',
    specs: ['12 Pads', 'Mixed Sizes (Heavy + Medium)', 'Individual Paper Disposal Covers', 'Dermatologically Tested'],
    searchQuery: 'Nua sanitary pads cotton',
    tags: ['pads', 'cotton', 'rash free', 'disposal pouch'],
    retailers: makeRetailers('Nua sanitary pads cotton')
  },
  {
    id: 'pe-sirona-cup',
    name: 'Sirona Reusable Menstrual Cup with Sterilizer Pouch (Medium)',
    category: 'period_essentials',
    brand: 'Sirona',
    price: 299,
    mrp: 499,
    rating: 4.7,
    reviewsCount: 5120,
    image: '/products/menstrual_cup.jpg',
    badge: 'Eco Favorite',
    quickDeliverable: true,
    description: '100% medical-grade silicone offering up to 8-10 hours of leak-proof freedom. Eco-friendly and reusable for up to 5 years.',
    cycleBenefit: 'Maintains vaginal pH by collecting rather than absorbing fluid, preventing dryness and vaginal irritation.',
    specs: ['100% Medical Grade Silicone', 'Medium Size (for regular to heavy flow)', 'Up to 10 hours protection', 'BPA & Latex Free'],
    searchQuery: 'Sirona menstrual cup medium',
    tags: ['menstrual cup', 'reusable', 'silicone', 'eco friendly'],
    retailers: makeRetailers('Sirona menstrual cup medium')
  },
  {
    id: 'pe-carmesi-pantyliners',
    name: 'Carmesi 100% Organic Cotton Daily Pantyliners (30 Pcs)',
    category: 'period_essentials',
    brand: 'Carmesi',
    price: 189,
    mrp: 225,
    rating: 4.7,
    reviewsCount: 1420,
    image: '/products/carmesi_pantyliners.jpg',
    badge: 'Organic',
    quickDeliverable: true,
    description: 'Ultra-thin organic cotton pantyliners designed for light spotting, ovulation discharge, and daily fresh confidence.',
    cycleBenefit: 'Perfect for the pre-period spotting window and mid-cycle fertile cervical discharge without trapping heat.',
    specs: ['30 Liners', '100% Pure Organic Cotton', 'Ultra Thin (0.8mm)', 'Chlorine & Dioxin Free'],
    searchQuery: 'Carmesi organic pantyliners 30',
    tags: ['pantyliners', 'spotting', 'discharge', 'organic'],
    retailers: makeRetailers('Carmesi organic pantyliners 30')
  },
  {
    id: 'pe-stayfree-secure',
    name: 'Stayfree Secure Cottony Soft Wings XL (Pack of 28)',
    category: 'period_essentials',
    brand: 'Stayfree',
    price: 195,
    mrp: 235,
    rating: 4.6,
    reviewsCount: 4200,
    image: '/products/stayfree_pads.jpg',
    badge: 'Value Pack',
    quickDeliverable: true,
    description: 'Cottony soft cover with deep absorption channels and odor neutralizer for comfortable, reliable everyday period defense.',
    cycleBenefit: 'Gentle on skin during long work or study days, providing dependable leak prevention on moderate flow days.',
    specs: ['28 Pads', 'XL Wings', 'Deep Channel Absorption', 'Odor Control System'],
    searchQuery: 'Stayfree secure cottony soft XL 28',
    tags: ['pads', 'stayfree', 'affordable', 'wings'],
    retailers: makeRetailers('Stayfree secure cottony soft XL 28')
  },
  {
    id: 'pe-peesafe-disposal',
    name: 'PeeSafe Oxo-Biodegradable Sanitary Disposal Bags (30 Bags)',
    category: 'period_essentials',
    brand: 'PeeSafe',
    price: 165,
    mrp: 199,
    rating: 4.8,
    reviewsCount: 2310,
    image: '/products/disposal_bags.jpg',
    badge: 'Discreet',
    quickDeliverable: true,
    description: 'Tear-resistant, tamper-proof and opaque biodegradable bags with self-sealing adhesive for hygienic, odor-free disposal.',
    cycleBenefit: 'Ensures dignified, sanitary disposal when away from home at college, office or public restrooms.',
    specs: ['30 Bags', 'Oxo-Biodegradable', 'Odor-Lock Self Seal', 'Discreet Opaque Pink Print'],
    searchQuery: 'PeeSafe sanitary disposal bags 30',
    tags: ['disposal bags', 'hygiene', 'biodegradable', 'travel'],
    retailers: makeRetailers('PeeSafe sanitary disposal bags 30')
  },
  {
    id: 'pe-period-panty',
    name: 'Healthfab GoPadFree Breathable Heavy Flow Period Panty',
    category: 'period_essentials',
    brand: 'Healthfab',
    price: 599,
    mrp: 799,
    rating: 4.7,
    reviewsCount: 890,
    image: '/products/period_panty.jpg',
    badge: 'Washable',
    quickDeliverable: false,
    description: '4-layer anti-microbial leak-proof absorption gusset equivalent to 2-3 pads. Washable, reusable and zero pad-bunching.',
    cycleBenefit: 'Eliminates nighttime sleep anxiety and pad shifting for teens and restless sleepers.',
    specs: ['1 Reusable Panty', 'Cotton Spandex Blend', 'Holds up to 25ml', 'Washable 50+ times'],
    searchQuery: 'GoPadFree period panty heavy flow',
    tags: ['period panty', 'reusable', 'washable', 'sleep comfort'],
    retailers: makeRetailers('GoPadFree period panty heavy flow', false)
  },

  // 2. Comfort & Cravings
  {
    id: 'cc-amul-dark-choc',
    name: 'Amul 70% Dark Chocolate Bar (150g Rich Cocoa)',
    category: 'comfort_cravings',
    brand: 'Amul',
    price: 115,
    mrp: 125,
    rating: 4.9,
    reviewsCount: 8400,
    image: '/products/amul_dark_chocolate.jpg',
    badge: 'Mood Lifter',
    quickDeliverable: true,
    description: 'Rich bittersweet chocolate made from finest cocoa beans. Naturally high in magnesium, flavonoids, and endorphin triggers.',
    cycleBenefit: 'Magnesium helps relax uterine smooth muscles to ease cramps, while stimulating serotonin during PMS low-energy dips.',
    specs: ['150g Net Weight', '70% Dark Cocoa', 'Vegetarian', 'Zero Vegetable Fat Added'],
    searchQuery: 'Amul 70 dark chocolate 150g',
    tags: ['chocolate', 'dark chocolate', 'cravings', 'magnesium', 'pms'],
    retailers: makeRetailers('Amul 70 dark chocolate 150g')
  },
  {
    id: 'cc-electric-belt',
    name: 'Sirona Cordless Rechargeable Heating Belt for Cramps',
    category: 'comfort_cravings',
    brand: 'Sirona',
    price: 1499,
    mrp: 2499,
    rating: 4.8,
    reviewsCount: 1650,
    image: '/products/heating_belt.jpg',
    badge: 'Pain Relief',
    quickDeliverable: false,
    description: '3 adjustable heating levels (45°C - 65°C) with 4 gentle vibration massage modes. Fits discreetly under your clothes while working.',
    cycleBenefit: 'Targeted thermotherapy dilates pelvic blood vessels, rapidly reducing uterine ischemic contraction pain.',
    specs: ['Rechargeable 1800mAh Battery', '3 Heat Levels + 4 Massage Modes', 'Adjustable Elastic Strap', 'Ultra Slim 150g'],
    searchQuery: 'Sirona cordless heating belt cramps',
    tags: ['heating belt', 'cramps', 'pain relief', 'hot pack', 'rechargeable'],
    retailers: makeRetailers('Sirona cordless heating belt cramps', false)
  },
  {
    id: 'cc-rubber-hotbag',
    name: 'Classic Soft Velvet Covered Hot Water Rubber Bag (2 Litres)',
    category: 'comfort_cravings',
    brand: 'CarePlus',
    price: 329,
    mrp: 499,
    rating: 4.7,
    reviewsCount: 2900,
    image: '/products/hot_water_bag.jpg',
    badge: 'Cozy Classic',
    quickDeliverable: true,
    description: 'Durable vulcanized rubber bottle with a plush, washable soft faux-fur velvet cover that retains soothing heat for up to 4 hours.',
    cycleBenefit: 'Gentle tactile warmth against lower abdomen or lower back soothes aching sacral nerves and induces peaceful sleep.',
    specs: ['2.0 Litres Capacity', 'Removable Velvet Cover', 'Leak-proof Brass Stopper', 'Non-toxic Rubber'],
    searchQuery: 'Hot water bottle with velvet cover',
    tags: ['hot water bag', 'cramps', 'warmth', 'period pain'],
    retailers: makeRetailers('Hot water bottle with velvet cover')
  },
  {
    id: 'cc-chamomile-tea',
    name: 'Vahdam Pure Chamomile Herbal Tea Bags (25 Pyramid Bags)',
    category: 'comfort_cravings',
    brand: 'Vahdam India',
    price: 349,
    mrp: 399,
    rating: 4.8,
    reviewsCount: 3100,
    image: '/products/chamomile_tea.jpg',
    badge: 'Caffeine-Free',
    quickDeliverable: true,
    description: '100% whole chamomile flower tea. Naturally caffeine-free with glycine-producing compounds that relax cramping muscles and nerves.',
    cycleBenefit: 'Lowers anxiety and calms dysmenorrhea cramps before bedtime without interrupting nocturnal sleep quality.',
    specs: ['25 Pyramid Tea Bags', '100% Whole Flowers', '100% Caffeine Free', 'Climate Neutral Certified'],
    searchQuery: 'Vahdam chamomile tea bags 25',
    tags: ['chamomile tea', 'herbal tea', 'cramp relief', 'sleep', 'relax'],
    retailers: makeRetailers('Vahdam chamomile tea bags 25')
  },
  {
    id: 'cc-cramp-rollon',
    name: 'Sirona Herbal Period Pain Relief Roll-On with Eucalyptus & Menthol',
    category: 'comfort_cravings',
    brand: 'Sirona',
    price: 249,
    mrp: 299,
    rating: 4.6,
    reviewsCount: 1880,
    image: '/products/cramp_rollon.jpg',
    badge: 'Quick Relief',
    quickDeliverable: true,
    description: '100% herbal formulation with satva pudina and oil of wintergreen. Easy ball roll-on application directly onto the lower belly.',
    cycleBenefit: 'Non-staining topical counter-irritant that interrupts pain signaling along pelvic neural pathways within 5 minutes.',
    specs: ['10ml Roll-On', 'Eucalyptus & Menthol', 'No Harsh Chemicals', 'Stain-Free Clear Liquid'],
    searchQuery: 'Sirona cramp relief roll on 10ml',
    tags: ['cramp roll on', 'pain relief', 'herbal', 'instant'],
    retailers: makeRetailers('Sirona cramp relief roll on 10ml')
  },
  {
    id: 'cc-roasted-makhana',
    name: 'True Elements Peri Peri Roasted Foxnut Makhana (120g)',
    category: 'comfort_cravings',
    brand: 'True Elements',
    price: 185,
    mrp: 220,
    rating: 4.7,
    reviewsCount: 960,
    image: '/products/roasted_makhana.jpg',
    badge: 'Guilt-Free',
    quickDeliverable: true,
    description: 'Crunchy, slow-roasted lotus seed makhana tossed in zesty peri-peri spices. High in fiber, low in glycemic index, and sodium-balanced.',
    cycleBenefit: 'Satisfies salty savory crunch cravings without causing excessive sodium-related menstrual water retention or bloating.',
    specs: ['120g Pouch', 'Non-Fried', 'High Protein & Fiber', 'Zero Palm Oil'],
    searchQuery: 'True Elements roasted makhana peri peri',
    tags: ['makhana', 'snacks', 'healthy', 'bloating free', 'cravings'],
    retailers: makeRetailers('True Elements roasted makhana peri peri')
  },

  // 3. Gifts & Feel-Good Products
  {
    id: 'gf-teddy-bear',
    name: 'Fluffy Rose-Pink Comfort Huggable Teddy Bear Plush (30cm)',
    category: 'gifts_feel_good',
    brand: 'SweetCuddle',
    price: 399,
    mrp: 599,
    rating: 4.9,
    reviewsCount: 750,
    image: '/products/pink_teddy_bear.jpg',
    badge: 'Comfort Hug',
    quickDeliverable: true,
    description: 'Ultra-soft velvety pink teddy bear stuffed with premium hypoallergenic microfiber. Perfectly sized to cuddle in bed while resting.',
    cycleBenefit: 'Provides emotional comfort, comforting companionship, and physical prop support for tummy resting during period days.',
    specs: ['30cm Height', 'Super-Soft Plush', 'Hypoallergenic Washable', 'Rose Pink Accent'],
    searchQuery: 'soft pink teddy bear plush 30cm',
    tags: ['teddy bear', 'plushie', 'comfort', 'gift', 'hugs'],
    retailers: makeRetailers('soft pink teddy bear plush 30cm')
  },
  {
    id: 'gf-fresh-flowers',
    name: 'Fresh Pink Roses & Gypsophila Mini Cheer Bouquet',
    category: 'gifts_feel_good',
    brand: 'FreshBlooms',
    price: 499,
    mrp: 650,
    rating: 4.8,
    reviewsCount: 1100,
    image: '/products/fresh_roses_bouquet.jpg',
    badge: 'Fresh Today',
    quickDeliverable: true,
    description: 'Hand-tied bouquet featuring fresh blushing pink roses and delicate baby’s breath wrapped in eco-friendly kraft paper with silk ribbon.',
    cycleBenefit: 'Fresh floral biophilic visuals instantly reduce cortisol levels and brighten up your recovery bedside table.',
    specs: ['8 Fresh Pink Roses', 'Gypsophila Stems', 'Eco Kraft Wrap', 'Includes Flower Food Pouch'],
    searchQuery: 'fresh pink roses bouquet online delivery',
    tags: ['flowers', 'roses', 'bouquet', 'gift', 'cheer'],
    retailers: makeRetailers('fresh pink roses bouquet online delivery')
  },
  {
    id: 'gf-pamper-kit',
    name: 'HER LIFE "Hug in a Box" Self-Care & Period Comfort Hamper',
    category: 'gifts_feel_good',
    brand: 'HerLife Curated',
    price: 899,
    mrp: 1299,
    rating: 5.0,
    reviewsCount: 640,
    image: '/products/pamper_kit.jpg',
    badge: 'Curated Hamper',
    quickDeliverable: false,
    description: 'A thoughtfully assembled gift box containing gourmet dark chocolates, chamomile tea, soothing sheet mask, fuzzy bed socks, and a personalized message card.',
    cycleBenefit: 'The ultimate heartfelt comfort package for yourself or a friend dealing with tough cramps and low energy.',
    specs: ['Curated 5-Piece Comfort Set', 'Pink Keepsake Gift Box', 'Silk Ribbon Finish', 'Personalized Note Included'],
    searchQuery: 'period self care gift hamper box',
    tags: ['gift box', 'hamper', 'self care kit', 'pamper', 'period gift'],
    retailers: makeRetailers('period self care gift hamper box', false)
  },
  {
    id: 'gf-scented-candle',
    name: 'French Lavender & Creamy Vanilla Calming Soy Candle (200g)',
    category: 'gifts_feel_good',
    brand: 'Soulflower',
    price: 349,
    mrp: 450,
    rating: 4.7,
    reviewsCount: 880,
    image: '/products/scented_candle.jpg',
    badge: 'Aromatherapy',
    quickDeliverable: true,
    description: '100% pure soy wax with therapeutic French lavender and warm Madagascar vanilla essential oils. 35+ hours of clean smokeless burn.',
    cycleBenefit: 'Lavender aromatherapy triggers parasympathetic relaxation, lowering heart rate and helping alleviate menstrual tension.',
    specs: ['200g Glass Jar', '100% Natural Soy Wax', 'Lead-Free Cotton Wick', '35 Hours Burn Time'],
    searchQuery: 'Soulflower lavender vanilla scented soy candle',
    tags: ['candle', 'lavender', 'aromatherapy', 'relaxation', 'calm'],
    retailers: makeRetailers('Soulflower lavender vanilla scented soy candle')
  },
  {
    id: 'gf-fuzzy-socks',
    name: 'Ultra-Soft Coral Fleece Fuzzy Warm Sleeping Bed Socks (2 Pairs)',
    category: 'gifts_feel_good',
    brand: 'WarmComfort',
    price: 249,
    mrp: 399,
    rating: 4.8,
    reviewsCount: 520,
    image: '/products/fuzzy_socks.jpg',
    badge: 'Cozy Warmth',
    quickDeliverable: true,
    description: 'Cloud-soft coral fleece socks with gentle elastic cuffs that keep your feet comfortably warm without pinching your ankles.',
    cycleBenefit: 'Keeping extremities warm enhances peripheral vasodilation, aiding deep rest and preventing chills during heavy bleeding.',
    specs: ['Pack of 2 (Pink & Lavender)', 'Ultra-Soft Microfiber', 'Non-Constricting Elastic', 'One Size Fits Most'],
    searchQuery: 'fuzzy bed socks women pink warm',
    tags: ['socks', 'warmth', 'fuzzy socks', 'bed socks', 'cozy'],
    retailers: makeRetailers('fuzzy bed socks women pink warm')
  },

  // 4. Self-Care
  {
    id: 'sc-acne-patches',
    name: 'Urban Yog Hydrocolloid Acne Pimple Patches (72 Dots)',
    category: 'self_care',
    brand: 'Urban Yog',
    price: 249,
    mrp: 299,
    rating: 4.8,
    reviewsCount: 3400,
    image: '/products/pimple_patches.jpg',
    badge: 'Blemish Cure',
    quickDeliverable: true,
    description: 'Medical hydrocolloid dots infused with salicylic acid and tea tree oil. Absorbs pus and sebum overnight while preventing finger picking.',
    cycleBenefit: 'Fast, invisible treatment for progesterone-triggered hormonal jawline and chin flare-ups during the luteal phase.',
    specs: ['72 Patches (8mm & 12mm)', 'Medical Grade Hydrocolloid', 'Salicylic Acid Infused', 'Ultra-Thin Invisible Under Makeup'],
    searchQuery: 'Urban Yog pimple patches hydrocolloid 72',
    tags: ['acne patches', 'pimple patch', 'skincare', 'hormonal acne', 'pms skin'],
    retailers: makeRetailers('Urban Yog pimple patches hydrocolloid 72')
  },
  {
    id: 'sc-sheet-mask',
    name: 'The Face Shop Real Nature Aloe Soothing Face Sheet Mask (Pack of 3)',
    category: 'self_care',
    brand: 'The Face Shop',
    price: 279,
    mrp: 300,
    rating: 4.7,
    reviewsCount: 2200,
    image: '/products/aloe_sheet_mask.jpg',
    badge: 'Hydration Boost',
    quickDeliverable: true,
    description: 'Natural aloe vera leaf extract serum drenched into a soft cotton sheet. Cools inflamed skin and restores moisture barrier.',
    cycleBenefit: 'Soothes hormonal redness and sensitivity when estrogen drops right before menstruation.',
    specs: ['3 Sheet Masks', 'Pure Aloe Vera Extract', 'Dermatologically Tested', 'No Added Parabens'],
    searchQuery: 'The Face Shop real nature aloe sheet mask',
    tags: ['sheet mask', 'skincare', 'aloe vera', 'soothing', 'glow'],
    retailers: makeRetailers('The Face Shop real nature aloe sheet mask')
  },
  {
    id: 'sc-intimate-wash',
    name: 'Sanfe pH 3.5 Natural Intimate Foaming Wash with Tea Tree & Chamomile',
    category: 'self_care',
    brand: 'Sanfe',
    price: 249,
    mrp: 299,
    rating: 4.7,
    reviewsCount: 1780,
    image: '/products/sanfe_intimate_wash.jpg',
    badge: 'pH Balanced',
    quickDeliverable: true,
    description: 'Mild foaming cleanser formulated at an optimal vulvar pH of 3.5. Contains natural tea tree essential oil to combat odor without stripping flora.',
    cycleBenefit: 'Safe for external vulvar cleansing during menstruation without upsetting sensitive protective lactobacilli flora.',
    specs: ['100ml Pump Bottle', 'pH 3.5 Balanced', 'Tea Tree & Chamomile', 'Sulfate & Paraben Free'],
    searchQuery: 'Sanfe intimate wash pH 3.5 100ml',
    tags: ['intimate wash', 'hygiene', 'ph balanced', 'gentle'],
    retailers: makeRetailers('Sanfe intimate wash pH 3.5 100ml')
  },
  {
    id: 'sc-intimate-wipes',
    name: 'Carmesi 100% Natural Biodegradable Intimate Wipes (30 Wipes)',
    category: 'self_care',
    brand: 'Carmesi',
    price: 159,
    mrp: 199,
    rating: 4.8,
    reviewsCount: 1620,
    image: '/products/carmesi_wipes.jpg',
    badge: 'Pocket Fresh',
    quickDeliverable: true,
    description: 'Made from natural plant fibers soaked in aloe vera and cucumber extract. Hypoallergenic, alcohol-free and fully biodegradable.',
    cycleBenefit: 'Fast, refreshing clean-up when changing pads or cups while traveling or outside home.',
    specs: ['30 Wipes Resealable Pack', '100% Plant Fiber', 'Alcohol & Paraben Free', 'pH Balanced'],
    searchQuery: 'Carmesi intimate wipes biodegradable 30',
    tags: ['wipes', 'hygiene', 'travel', 'freshness', 'biodegradable'],
    retailers: makeRetailers('Carmesi intimate wipes biodegradable 30')
  },
  {
    id: 'sc-magnesium-soak',
    name: 'Pure Magnesium & Himalayan Pink Salt Calming Foot & Bath Soak (400g)',
    category: 'self_care',
    brand: 'AncientLiving',
    price: 320,
    mrp: 450,
    rating: 4.8,
    reviewsCount: 710,
    image: '/products/magnesium_soak.jpg',
    badge: 'Muscle Ease',
    quickDeliverable: true,
    description: 'USP-grade Epsom magnesium sulfate crystals blended with mineral-rich Himalayan pink salt and lavender essential oil.',
    cycleBenefit: 'A warm 15-minute foot soak allows transdermal magnesium absorption that relieves leg aches and lowers lower-back cramping.',
    specs: ['400g Resealable Jar', 'USP Grade Magnesium Sulfate', 'Natural Himalayan Pink Salt', 'Lavender Essential Oil'],
    searchQuery: 'Epsom magnesium salt bath soak lavender',
    tags: ['bath soak', 'magnesium', 'foot soak', 'muscle ache', 'relaxation'],
    retailers: makeRetailers('Epsom magnesium salt bath soak lavender')
  },
  {
    id: 'sc-green-tea-toner',
    name: 'Plum Green Tea Alcohol-Free Clarifying Face Mist & Toner (200ml)',
    category: 'self_care',
    brand: 'Plum Goodness',
    price: 335,
    mrp: 395,
    rating: 4.6,
    reviewsCount: 3950,
    image: '/products/plum_toner.webp',
    badge: 'Vegan Beauty',
    quickDeliverable: true,
    description: 'Alcohol-free clarifying toner with green tea extracts and glycolic acid that tones open pores and stops breakout-causing bacteria.',
    cycleBenefit: 'Controls excessive sebum production caused by pre-menstrual androgen surges.',
    specs: ['200ml Spray Bottle', '100% Vegan & Cruelty Free', 'Green Tea + Glycolic Acid', 'Non-comedogenic'],
    searchQuery: 'Plum green tea toner alcohol free 200ml',
    tags: ['toner', 'skincare', 'green tea', 'pore control', 'vegan'],
    retailers: makeRetailers('Plum green tea toner alcohol free 200ml')
  }
];

export interface CareKitItem {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  image: string;
  retailerQuery: string;
}

export const CARE_KIT_OPTIONS = {
  essentials: [
    { id: 'pe-whisper-xl', name: 'Whisper Ultra Clean XL (30 Pads)', price: 389, image: '/products/whisper_pads.jpg', retailerQuery: 'Whisper Ultra Clean XL pads 30' },
    { id: 'pe-nua-pads', name: 'Nua Organic Cotton Pads (12 Pads)', price: 299, image: '/products/nua_pads.jpg', retailerQuery: 'Nua sanitary pads cotton' },
    { id: 'pe-sirona-cup', name: 'Sirona Reusable Menstrual Cup', price: 299, image: '/products/menstrual_cup.jpg', retailerQuery: 'Sirona menstrual cup medium' }
  ],
  cravings: [
    { id: 'cc-amul-dark-choc', name: 'Amul 70% Dark Chocolate Bar', price: 115, image: '/products/amul_dark_chocolate.jpg', retailerQuery: 'Amul 70 dark chocolate 150g' },
    { id: 'cc-chamomile-tea', name: 'Vahdam Pure Chamomile Herbal Tea', price: 349, image: '/products/chamomile_tea.jpg', retailerQuery: 'Vahdam chamomile tea bags 25' },
    { id: 'cc-roasted-makhana', name: 'True Elements Roasted Makhana', price: 185, image: '/products/roasted_makhana.jpg', retailerQuery: 'True Elements roasted makhana peri peri' }
  ],
  comfort: [
    { id: 'cc-rubber-hotbag', name: 'Classic Velvet Hot Water Bag', price: 329, image: '/products/hot_water_bag.jpg', retailerQuery: 'Hot water bottle with velvet cover' },
    { id: 'cc-cramp-rollon', name: 'Sirona Herbal Cramp Relief Roll-On', price: 249, image: '/products/cramp_rollon.jpg', retailerQuery: 'Sirona cramp relief roll on 10ml' },
    { id: 'gf-fuzzy-socks', name: 'Ultra-Soft Fuzzy Bed Socks', price: 249, image: '/products/fuzzy_socks.jpg', retailerQuery: 'fuzzy bed socks women pink warm' }
  ],
  feelGood: [
    { id: 'gf-teddy-bear', name: 'Fluffy Rose-Pink Comfort Teddy', price: 399, image: '/products/pink_teddy_bear.jpg', retailerQuery: 'soft pink teddy bear plush 30cm' },
    { id: 'sc-acne-patches', name: 'Urban Yog Acne Pimple Patches', price: 249, image: '/products/pimple_patches.jpg', retailerQuery: 'Urban Yog pimple patches hydrocolloid 72' },
    { id: 'gf-scented-candle', name: 'Lavender Vanilla Calming Soy Candle', price: 349, image: '/products/scented_candle.jpg', retailerQuery: 'Soulflower lavender vanilla scented soy candle' }
  ]
};
