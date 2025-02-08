export const productTypeArr = ["Physical Product", "Digital Product"];

export const productCategories = [
  "Electronics",
  "Clothing",
  "Books",
  "Furniture",
  "Toys",
  "Groceries",
  "School Supplies",
  "Body Care Products",
  "Fashion",
  "Phone Accessories",
];

export const subCategories: { [key: string]: string[] } = {
  "School Supplies": [
    "Writing Instruments",
    "Paper Products",
    "Organizational Supplies",
    "Art and Craft Supplies",
    "Technology and Gadgets",
    "Classroom Essentials",
  ],
  "Body Care Products": [
    "Skincare",
    "Hair Care",
    "Oral Care",
    "Bath and Shower",
    "Deodorants and Antiperspirants",
    "Fragrances",
    "Shaving and Hair Removal",
    "Hand and Foot Care",
  ],
  Fashion: [
    "Clothing",
    "Footwear",
    "Accessories",
    "Undergarments",
    "Seasonal Wear",
    "Fashion Jewelry",
  ],
  "Phone Accessories": [
    "Protective Gear",
    "Charging Solutions",
    "Audio Accessories",
    "Mounts and Holders",
    "Connectivity",
    "Storage and Memory",
    "Photography Enhancements",
    "Wearables",
  ],
  Electronics: [
    "Mobile Phones",
    "Computers",
    "Tablets",
    "Televisions",
    "Cameras",
    "Audio Devices",
    "Wearable Technology",
    "Gaming Consoles",
  ],
  Clothing: [
    "Men's Clothing",
    "Women's Clothing",
    "Kid's Clothing",
    "Activewear",
    "Outerwear",
    "Sleepwear",
    "Formalwear",
  ],
  Books: [
    "Fiction",
    "Non-Fiction",
    "Educational",
    "Children's Books",
    "Comics",
    "Biographies",
    "Self-Help",
  ],
  Furniture: [
    "Living Room",
    "Bedroom",
    "Office",
    "Outdoor",
    "Storage",
    "Decor",
    "Lighting",
  ],
  Toys: [
    "Action Figures",
    "Puzzles",
    "Educational Toys",
    "Dolls",
    "Building Sets",
    "Outdoor Toys",
    "Video Games",
  ],
  Groceries: [
    "Fruits and Vegetables",
    "Dairy Products",
    "Beverages",
    "Snacks",
    "Bakery",
    "Frozen Foods",
    "Meat and Seafood",
  ],
};

export const bookCategories = [
  {
    category: "Fiction",
    subCategories: [
      "Fantasy",
      "Science Fiction",
      "Mystery",
      "Thriller",
      "Romance",
      "Historical Fiction",
      "Horror",
      "Literary Fiction",
    ],
  },
  {
    category: "Non-Fiction",
    subCategories: [
      "Biography",
      "Memoir",
      "Self-Help",
      "Cookbooks",
      "True Crime",
      "History",
      "Science",
      "Philosophy",
    ],
  },
  {
    category: "Children's Books",
    subCategories: [
      "Picture Books",
      "Early Readers",
      "Chapter Books",
      "Middle Grade",
      "Young Adult",
    ],
  },
  {
    category: "Education & Reference",
    subCategories: [
      "Textbooks",
      "Dictionaries",
      "Study Guides",
      "Language Learning",
      "Test Preparation",
    ],
  },
  {
    category: "Business & Economics",
    subCategories: [
      "Entrepreneurship",
      "Finance",
      "Marketing",
      "Leadership",
      "Economics",
      "Investing",
    ],
  },
  {
    category: "Health & Fitness",
    subCategories: [
      "Nutrition",
      "Exercise",
      "Mental Health",
      "Wellness",
      "Diets",
      "Yoga",
    ],
  },
  {
    category: "Technology & Engineering",
    subCategories: [
      "Programming",
      "Artificial Intelligence",
      "Networking",
      "Software Development",
      "Electrical Engineering",
      "Mechanical Engineering",
    ],
  },
  {
    category: "Art & Photography",
    subCategories: [
      "Art History",
      "Drawing",
      "Painting",
      "Photography",
      "Graphic Design",
    ],
  },
  {
    category: "Religion & Spirituality",
    subCategories: [
      "Christianity",
      "Islam",
      "Judaism",
      "Buddhism",
      "Spiritual Growth",
      "Mythology",
    ],
  },
  {
    category: "Comics & Graphic Novels",
    subCategories: [
      "Superheroes",
      "Manga",
      "Fantasy",
      "Science Fiction",
      "Horror",
      "Humor",
    ],
  },
  {
    category: "Travel",
    subCategories: [
      "Adventure Travel",
      "Cultural Travel",
      "Travel Guides",
      "Maps",
      "Nature Travel",
    ],
  },
  {
    category: "Poetry",
    subCategories: [
      "Contemporary Poetry",
      "Classical Poetry",
      "Narrative Poetry",
      "Haiku",
      "Anthologies",
    ],
  },
];

export const possibleSizes = [
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "One Size",
];

export const calculateCommission = (amount: number) => {
  const feePercentage = 8.25 / 100;
  const flatFee = 200;
  const feeCap = 3000;

  // If the amount is less than 2500, NGN 200 flat fee is waived
  const transactionFee =
    amount >= 2500 ? amount * feePercentage + flatFee : amount * feePercentage;
  // The maximum transaction fee is capped at NGN 3000

  const commission = Math.min(transactionFee, feeCap);
  const settleAmount = amount - commission;

  return {
    commission,
    settleAmount,
  };
};

export let security = [
  {
    title: "Available Payout",
    desc: "Total available balance for payout",
    content: "0",
  },
  {
    title: "Funds withheld",
    desc: "Funds held for processing or disputes",
    content: "0",
  },
  {
    title: "Payout History",
    desc: "Your all time earnings on Udua",
    link: "/",
  },
];

// Define the interface for the size data
interface SizeData {
  size: string;
  us: number;
  uk: number;
  eur: number;
  china: string;
  chest: string;
  waist: string;
  hips: string;
  legLength: string;
  neck: string;
  sleeveLength: string;
}

// Array of size data with TypeScript type annotation
export const sizes: SizeData[] = [
  {
    size: "XXS",
    us: 30,
    uk: 30,
    eur: 40,
    china: "-",
    chest: "76 - 81.5",
    waist: "66",
    hips: "-",
    legLength: "-",
    neck: "33 - 34",
    sleeveLength: "77 - 79",
  },
  {
    size: "XS",
    us: 32,
    uk: 32,
    eur: 42,
    china: "160",
    chest: "84 - 86",
    waist: "68 - 71",
    hips: "< 88",
    legLength: "< 82.5",
    neck: "33 - 34",
    sleeveLength: "80 - 81",
  },
  {
    size: "S",
    us: 34,
    uk: 34,
    eur: 44,
    china: "165 / 89 - 90",
    chest: "89 - 94",
    waist: "73 - 79",
    hips: "88 - 96",
    legLength: "82.5",
    neck: "36 - 37",
    sleeveLength: "82 - 84",
  },
  {
    size: "M",
    us: 38,
    uk: 38,
    eur: 48,
    china: "170 / 96 - 98",
    chest: "96 - 102",
    waist: "81 - 86",
    hips: "96 - 104",
    legLength: "83",
    neck: "38 - 39",
    sleeveLength: "85 - 86",
  },
  {
    size: "L",
    us: 42,
    uk: 42,
    eur: 52,
    china: "175 / 108 - 110",
    chest: "107 - 112",
    waist: "91 - 97",
    hips: "104 - 112",
    legLength: "83.5",
    neck: "40 - 42",
    sleeveLength: "87 - 89",
  },
  {
    size: "XL",
    us: 46,
    uk: 46,
    eur: 56,
    china: "180 / 118 - 122",
    chest: "116 - 122",
    waist: "101 - 107",
    hips: "112 - 120",
    legLength: "84",
    neck: "43 - 45",
    sleeveLength: "90 - 91",
  },
  {
    size: "XXL",
    us: 48,
    uk: 48,
    eur: 58,
    china: "185 / 126 - 130",
    chest: "127 - 132",
    waist: "111 - 117",
    hips: "120 - 128",
    legLength: "84.5",
    neck: "46 - 47",
    sleeveLength: "91 - 93",
  },
  {
    size: "XXXL",
    us: 50,
    uk: 50,
    eur: 60,
    china: "-",
    chest: "137 - 140",
    waist: "127 - 132",
    hips: "128 - 136",
    legLength: "85",
    neck: "48 - 49",
    sleeveLength: "93 - 94",
  },
];

// Define TypeScript interface
interface ShoeSize {
  eur: number;
  usType: string;
  us: number;
  uk: number;
  china: number;
  footLength: number;
  footLengthRange: string;
}

// Shoe size data
export const shoeSizes: ShoeSize[] = [
  // From first image
  {
    eur: 39,
    usType: "Adult Men",
    us: 6,
    uk: 5,
    china: 38,
    footLength: 24.1,
    footLengthRange: "23.9 - 24.3",
  },
  {
    eur: 39.5,
    usType: "Adult Men",
    us: 6.5,
    uk: 5.5,
    china: 39,
    footLength: 24.4,
    footLengthRange: "24.2 - 24.6",
  },
  {
    eur: 40,
    usType: "Adult Men",
    us: 7,
    uk: 6,
    china: 40,
    footLength: 24.8,
    footLengthRange: "24.6 - 25.0",
  },
  {
    eur: 40.5,
    usType: "Adult Men",
    us: 7.5,
    uk: 6.5,
    china: 40.5,
    footLength: 25.1,
    footLengthRange: "24.9 - 25.3",
  },
  {
    eur: 41,
    usType: "Adult Men",
    us: 8,
    uk: 7,
    china: 41,
    footLength: 25.4,
    footLengthRange: "25.2 - 25.6",
  },
  {
    eur: 41.5,
    usType: "Adult Men",
    us: 8.5,
    uk: 7.5,
    china: 41.5,
    footLength: 25.7,
    footLengthRange: "25.5 - 25.9",
  },
  {
    eur: 42,
    usType: "Adult Men",
    us: 9,
    uk: 8,
    china: 42,
    footLength: 26.0,
    footLengthRange: "25.8 - 26.2",
  },
  {
    eur: 42.5,
    usType: "Adult Men",
    us: 9.5,
    uk: 8.5,
    china: 42.5,
    footLength: 26.3,
    footLengthRange: "26.1 - 26.5",
  },
  {
    eur: 43,
    usType: "Adult Men",
    us: 10,
    uk: 9,
    china: 43,
    footLength: 26.7,
    footLengthRange: "26.5 - 26.9",
  },
  {
    eur: 43.5,
    usType: "Adult Men",
    us: 10.5,
    uk: 9.5,
    china: 43.5,
    footLength: 27.0,
    footLengthRange: "26.8 - 27.2",
  },

  // From second and third images
  {
    eur: 44,
    usType: "Adult Men",
    us: 11,
    uk: 10,
    china: 44,
    footLength: 27.3,
    footLengthRange: "27.1 - 27.5",
  },
  {
    eur: 44.5,
    usType: "Adult Men",
    us: 11.5,
    uk: 10.5,
    china: 44.5,
    footLength: 27.6,
    footLengthRange: "27.4 - 27.8",
  },
  {
    eur: 45,
    usType: "Adult Men",
    us: 12,
    uk: 11,
    china: 45,
    footLength: 28.0,
    footLengthRange: "27.8 - 28.2",
  },
  {
    eur: 45.5,
    usType: "Adult Men",
    us: 12.5,
    uk: 11.5,
    china: 45.5,
    footLength: 28.3,
    footLengthRange: "28.1 - 28.5",
  },
  {
    eur: 46,
    usType: "Adult Men",
    us: 13,
    uk: 12,
    china: 46,
    footLength: 28.6,
    footLengthRange: "28.4 - 28.8",
  },
  {
    eur: 46.5,
    usType: "Adult Men",
    us: 13.5,
    uk: 12.5,
    china: 46.5,
    footLength: 29.0,
    footLengthRange: "28.8 - 29.2",
  },
  {
    eur: 47,
    usType: "Adult Men",
    us: 14,
    uk: 13,
    china: 47,
    footLength: 29.4,
    footLengthRange: "29.2 - 29.6",
  },
  {
    eur: 47.5,
    usType: "Adult Men",
    us: 14.5,
    uk: 13.5,
    china: 47.5,
    footLength: 29.8,
    footLengthRange: "29.6 - 30.0",
  },
  {
    eur: 48,
    usType: "Adult Men",
    us: 15,
    uk: 14,
    china: 48,
    footLength: 30.2,
    footLengthRange: "30.0 - 30.4",
  },
];
