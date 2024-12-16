export const productTypeArr = [
  "Physical Product",
  "Digital Product",
];

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
      "Literary Fiction"
    ]
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
      "Philosophy"
    ]
  },
  {
    category: "Children's Books",
    subCategories: [
      "Picture Books",
      "Early Readers",
      "Chapter Books",
      "Middle Grade",
      "Young Adult"
    ]
  },
  {
    category: "Education & Reference",
    subCategories: [
      "Textbooks",
      "Dictionaries",
      "Study Guides",
      "Language Learning",
      "Test Preparation"
    ]
  },
  {
    category: "Business & Economics",
    subCategories: [
      "Entrepreneurship",
      "Finance",
      "Marketing",
      "Leadership",
      "Economics",
      "Investing"
    ]
  },
  {
    category: "Health & Fitness",
    subCategories: [
      "Nutrition",
      "Exercise",
      "Mental Health",
      "Wellness",
      "Diets",
      "Yoga"
    ]
  },
  {
    category: "Technology & Engineering",
    subCategories: [
      "Programming",
      "Artificial Intelligence",
      "Networking",
      "Software Development",
      "Electrical Engineering",
      "Mechanical Engineering"
    ]
  },
  {
    category: "Art & Photography",
    subCategories: [
      "Art History",
      "Drawing",
      "Painting",
      "Photography",
      "Graphic Design"
    ]
  },
  {
    category: "Religion & Spirituality",
    subCategories: [
      "Christianity",
      "Islam",
      "Judaism",
      "Buddhism",
      "Spiritual Growth",
      "Mythology"
    ]
  },
  {
    category: "Comics & Graphic Novels",
    subCategories: [
      "Superheroes",
      "Manga",
      "Fantasy",
      "Science Fiction",
      "Horror",
      "Humor"
    ]
  },
  {
    category: "Travel",
    subCategories: [
      "Adventure Travel",
      "Cultural Travel",
      "Travel Guides",
      "Maps",
      "Nature Travel"
    ]
  },
  {
    category: "Poetry",
    subCategories: [
      "Contemporary Poetry",
      "Classical Poetry",
      "Narrative Poetry",
      "Haiku",
      "Anthologies"
    ]
  }
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
    settleAmount
  }
}

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