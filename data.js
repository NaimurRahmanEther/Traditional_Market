export const districtsSeed = [
  {
    id: "rangpur",
    name: "Rangpur",
    division: "Rangpur",
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=600&q=80",
    description: "Famous for Shataranji weaving and traditional textiles",
    productCount: 124
  },
  {
    id: "jamalpur",
    name: "Jamalpur",
    division: "Mymensingh",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    description: "Known for Nakshi Kantha and embroidery work",
    productCount: 98
  },
  {
    id: "tangail",
    name: "Tangail",
    division: "Dhaka",
    image: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=600&q=80",
    description: "Home of the famous Tangail Saree",
    productCount: 156
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    division: "Rajshahi",
    image: "/images/districts/rajshahi.jpg",
    description: "Renowned for silk products and pottery",
    productCount: 134
  },
  {
    id: "chapainawabganj",
    name: "Chapainawabganj",
    division: "Rajshahi",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c0651?w=600&q=80",
    description: "Famous for mango wood crafts and traditional art",
    productCount: 87
  },
  {
    id: "sylhet",
    name: "Sylhet",
    division: "Sylhet",
    image: "/images/districts/sylhet.jpg",
    description: "Known for cane and bamboo crafts",
    productCount: 112
  },
  {
    id: "coxs-bazar",
    name: "Cox's Bazar",
    division: "Chattogram",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    description: "Famous for seashell crafts and coastal art",
    productCount: 76
  },
  {
    id: "khulna",
    name: "Khulna",
    division: "Khulna",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80",
    description: "Known for Sundarbans-inspired crafts",
    productCount: 93
  },
  {
    id: "dhaka",
    name: "Dhaka",
    division: "Dhaka",
    image: "/images/districts/dhaka.jpg",
    description: "Home of legendary Jamdani weaving",
    productCount: 203
  },
  {
    id: "comilla",
    name: "Comilla",
    division: "Chattogram",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    description: "Famous for Khadi and traditional textiles",
    productCount: 145
  },
  {
    id: "mymensingh",
    name: "Mymensingh",
    division: "Mymensingh",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&q=80",
    description: "Known for folk art and pottery",
    productCount: 89
  },
  {
    id: "bogra",
    name: "Bogra",
    division: "Rajshahi",
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=600&q=80",
    description: "Famous for terracotta and clay crafts",
    productCount: 67
  }
];

export const categoriesSeed = [
  {
    id: "jamdani",
    name: "Jamdani",
    image: "/images/products/jamdani-saree.jpg",
    description: "Exquisite hand-woven muslin fabric with intricate patterns",
    productCount: 89
  },
  {
    id: "nakshi-kantha",
    name: "Nakshi Kantha",
    image: "/images/products/nakshi-kantha.jpg",
    description: "Traditional embroidered quilts telling stories through thread",
    productCount: 156
  },
  {
    id: "bamboo-crafts",
    name: "Bamboo Crafts",
    image: "/images/products/bamboo-basket.jpg",
    description: "Sustainable handcrafted items from natural bamboo",
    productCount: 112
  },
  {
    id: "clay-pottery",
    name: "Clay Pottery",
    image: "/images/products/terracotta-pottery.jpg",
    description: "Traditional terracotta and ceramic artistry",
    productCount: 78
  },
  {
    id: "cane-furniture",
    name: "Cane Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    description: "Elegant and durable handwoven cane pieces",
    productCount: 45
  },
  {
    id: "handwoven-textiles",
    name: "Handwoven Textiles",
    image: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=600&q=80",
    description: "Beautiful fabrics crafted on traditional looms",
    productCount: 234
  }
];

export const productsSeed = [
  {
    id: "jamdani-saree-001",
    name: "Traditional Jamdani Saree - Midnight Blue",
    price: 15000,
    originalPrice: 18000,
    image: "/images/products/jamdani-saree.jpg",
    images: [
      "/images/products/jamdani-saree.jpg",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80"
    ],
    district: "Dhaka",
    districtId: "dhaka",
    category: "Jamdani",
    categoryId: "jamdani",
    rating: 4.9,
    reviewCount: 128,
    description: "An exquisite hand-woven Jamdani saree featuring intricate geometric patterns on a midnight blue base. Each saree takes 3 to 6 months to complete by master weavers.",
    artisanId: "artisan-001",
    inStock: true,
    craftProcess: "Jamdani weaving creates patterns by hand during the weaving process using a supplementary weft technique.",
    culturalSignificance: "Jamdani is recognized as an important heritage craft of Bengal and is traditionally worn during festivals and weddings."
  },
  {
    id: "nakshi-kantha-002",
    name: "Floral Nakshi Kantha Bedspread",
    price: 8500,
    image: "/images/products/nakshi-kantha.jpg",
    images: [
      "/images/products/nakshi-kantha.jpg",
      "https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600&q=80"
    ],
    district: "Jamalpur",
    districtId: "jamalpur",
    category: "Nakshi Kantha",
    categoryId: "nakshi-kantha",
    rating: 4.8,
    reviewCount: 89,
    description: "A handmade Nakshi Kantha bedspread featuring floral motifs and detailed stitching passed down through generations.",
    artisanId: "artisan-002",
    inStock: true,
    craftProcess: "Nakshi Kantha uses layers of fabric stitched together with decorative running stitches.",
    culturalSignificance: "Nakshi Kantha grew from domestic reuse and became one of Bengal's best-known folk art traditions."
  },
  {
    id: "bamboo-basket-003",
    name: "Handwoven Bamboo Storage Basket Set",
    price: 2500,
    originalPrice: 3000,
    image: "/images/products/bamboo-basket.jpg",
    images: [
      "/images/products/bamboo-basket.jpg",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80"
    ],
    district: "Sylhet",
    districtId: "sylhet",
    category: "Bamboo Crafts",
    categoryId: "bamboo-crafts",
    rating: 4.7,
    reviewCount: 156,
    description: "A set of three handwoven bamboo baskets for storage and home decoration.",
    artisanId: "artisan-003",
    inStock: true,
    craftProcess: "Bamboo is split, treated, and woven by hand using traditional techniques.",
    culturalSignificance: "Bamboo weaving has long been part of everyday life across Bangladesh."
  },
  {
    id: "terracotta-vase-004",
    name: "Terracotta Decorative Vase",
    price: 1800,
    image: "/images/products/terracotta-pottery.jpg",
    images: [
      "/images/products/terracotta-pottery.jpg",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80"
    ],
    district: "Rajshahi",
    districtId: "rajshahi",
    category: "Clay Pottery",
    categoryId: "clay-pottery",
    rating: 4.6,
    reviewCount: 67,
    description: "A terracotta vase featuring traditional Bengali motifs and kiln-fired finishing.",
    artisanId: "artisan-004",
    inStock: true,
    craftProcess: "Clay is shaped by hand, decorated, and fired in a traditional kiln.",
    culturalSignificance: "Terracotta work has been part of Bengali homes, temples, and festivals for centuries."
  },
  {
    id: "silk-scarf-005",
    name: "Rajshahi Silk Scarf - Golden Paisley",
    price: 4500,
    image: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=600&q=80",
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&q=80"
    ],
    district: "Rajshahi",
    districtId: "rajshahi",
    category: "Handwoven Textiles",
    categoryId: "handwoven-textiles",
    rating: 4.8,
    reviewCount: 92,
    description: "A pure silk scarf from Rajshahi featuring elegant paisley patterns in golden tones.",
    artisanId: "artisan-005",
    inStock: true,
    craftProcess: "Pure silk threads are hand-dyed and woven on traditional looms.",
    culturalSignificance: "Rajshahi is widely known as the silk city of Bangladesh."
  },
  {
    id: "tangail-saree-006",
    name: "Tangail Cotton Saree - Ruby Red",
    price: 6500,
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80"
    ],
    district: "Tangail",
    districtId: "tangail",
    category: "Handwoven Textiles",
    categoryId: "handwoven-textiles",
    rating: 4.7,
    reviewCount: 143,
    description: "A vibrant ruby red Tangail cotton saree with classic border designs.",
    artisanId: "artisan-006",
    inStock: true,
    craftProcess: "Tangail sarees are woven using extra warp techniques that build distinctive patterns.",
    culturalSignificance: "Tangail sarees are deeply connected to Bengali identity and celebrations."
  },
  {
    id: "cane-chair-007",
    name: "Traditional Cane Peacock Chair",
    price: 12000,
    originalPrice: 14000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80"
    ],
    district: "Sylhet",
    districtId: "sylhet",
    category: "Cane Furniture",
    categoryId: "cane-furniture",
    rating: 4.9,
    reviewCount: 34,
    description: "An iconic peacock chair handwoven from natural cane for statement interiors.",
    artisanId: "artisan-003",
    inStock: true,
    craftProcess: "Cane is soaked, bent, and woven by hand into decorative furniture.",
    culturalSignificance: "Cane furniture is a long-standing example of sustainable Bengali craftsmanship."
  },
  {
    id: "nakshi-kantha-wall-008",
    name: "Nakshi Kantha Wall Hanging - Village Scene",
    price: 5500,
    image: "https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
    ],
    district: "Rangpur",
    districtId: "rangpur",
    category: "Nakshi Kantha",
    categoryId: "nakshi-kantha",
    rating: 4.8,
    reviewCount: 78,
    description: "A wall hanging that depicts a village scene through hand embroidery.",
    artisanId: "artisan-007",
    inStock: true,
    craftProcess: "Multiple layers of fabric are stitched into a pictorial narrative.",
    culturalSignificance: "Nakshi Kantha often preserves stories of village life, memory, and folklore."
  }
];

export const artisansSeed = [
  {
    id: "artisan-001",
    name: "Fatima Begum",
    image: "/images/artisans/fatima-begum.jpg",
    district: "Dhaka",
    districtId: "dhaka",
    specialty: "Jamdani Weaving",
    bio: "Master weaver with 30 years of experience in traditional Jamdani craft.",
    story: "Fatima learned Jamdani weaving from her grandmother and now leads a cooperative of women weavers in Sonargaon.",
    yearsOfExperience: 30,
    productCount: 45
  },
  {
    id: "artisan-002",
    name: "Rashida Khatun",
    image: "/images/artisans/rashida-khatun.jpg",
    district: "Jamalpur",
    districtId: "jamalpur",
    specialty: "Nakshi Kantha Embroidery",
    bio: "Award-winning Nakshi Kantha artist keeping alive the storytelling tradition.",
    story: "Rashida teaches younger women in her village while creating embroidered works rooted in memory and mythology.",
    yearsOfExperience: 25,
    productCount: 67
  },
  {
    id: "artisan-003",
    name: "Abdul Karim",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    district: "Sylhet",
    districtId: "sylhet",
    specialty: "Bamboo and Cane Crafts",
    bio: "Third-generation bamboo craftsman creating sustainable art.",
    story: "Abdul blends practical household design with traditional bamboo and cane techniques.",
    yearsOfExperience: 35,
    productCount: 89
  },
  {
    id: "artisan-004",
    name: "Kamal Uddin",
    image: "/images/artisans/kamal-uddin.jpg",
    district: "Rajshahi",
    districtId: "rajshahi",
    specialty: "Terracotta Pottery",
    bio: "Contemporary potter honoring ancient Bengali clay traditions.",
    story: "Kamal shapes traditional motifs into new decorative forms while staying close to village pottery methods.",
    yearsOfExperience: 18,
    productCount: 56
  },
  {
    id: "artisan-005",
    name: "Mohammad Hasan",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    district: "Rajshahi",
    districtId: "rajshahi",
    specialty: "Silk Weaving",
    bio: "Master silk weaver preserving Rajshahi's textile heritage.",
    story: "Mohammad carries forward a family tradition of silk weaving that spans generations.",
    yearsOfExperience: 40,
    productCount: 78
  },
  {
    id: "artisan-006",
    name: "Salma Begum",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
    district: "Tangail",
    districtId: "tangail",
    specialty: "Tangail Saree Weaving",
    bio: "Expert weaver specializing in traditional Tangail sarees.",
    story: "Salma works on her family handloom and is known for refined festival-ready sarees.",
    yearsOfExperience: 22,
    productCount: 123
  },
  {
    id: "artisan-007",
    name: "Amina Khatun",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80",
    district: "Rangpur",
    districtId: "rangpur",
    specialty: "Nakshi Kantha and Shataranji",
    bio: "Versatile textile artist working in multiple traditional mediums.",
    story: "Amina combines embroidery and weaving practices while leading a women's cooperative in northern Bangladesh.",
    yearsOfExperience: 28,
    productCount: 91
  }
];

export const testimonials = [
  {
    id: "testimonial-001",
    name: "Sarah Mitchell",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "The Jamdani saree I purchased is breathtaking. The craftsmanship is exquisite and the story behind it makes it even more special."
  },
  {
    id: "testimonial-002",
    name: "James Chen",
    location: "Toronto, Canada",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "The bamboo baskets exceeded all expectations. Beautiful, functional, and clearly made with care."
  },
  {
    id: "testimonial-003",
    name: "Priya Sharma",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    rating: 5,
    text: "The Nakshi Kantha bedspread feels like a work of art. Every stitch shows the hand of the maker."
  },
  {
    id: "testimonial-004",
    name: "Ahmed Rahman",
    location: "Dubai, UAE",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    rating: 5,
    text: "This project connects me to Bangladeshi heritage while supporting artisans back home."
  }
];

export const productReviewsSeed = [
  {
    id: "review-001",
    productId: "jamdani-saree-001",
    userId: "seed-reviewer-001",
    name: "Sarah Mitchell",
    location: "New York, USA",
    title: "Elegant and beautifully woven",
    comment:
      "The Jamdani saree looks even better in person and the weave feels very detailed and refined.",
    rating: 5,
    verifiedPurchase: true,
    createdAt: "2026-01-10T09:30:00.000Z"
  },
  {
    id: "review-002",
    productId: "jamdani-saree-001",
    userId: "seed-reviewer-002",
    name: "Maliha Islam",
    location: "Dhaka, Bangladesh",
    title: "A special gift piece",
    comment:
      "I bought this as a family gift and everyone loved the color, texture, and presentation.",
    rating: 4,
    verifiedPurchase: true,
    createdAt: "2026-01-18T16:10:00.000Z"
  },
  {
    id: "review-003",
    productId: "nakshi-kantha-002",
    userId: "seed-reviewer-003",
    name: "Priya Sharma",
    location: "London, UK",
    title: "Beautiful embroidery work",
    comment:
      "Every stitch feels thoughtful and handmade, and the fabric quality is excellent.",
    rating: 5,
    verifiedPurchase: true,
    createdAt: "2026-02-02T11:20:00.000Z"
  },
  {
    id: "review-004",
    productId: "bamboo-basket-003",
    userId: "seed-reviewer-004",
    name: "James Chen",
    location: "Toronto, Canada",
    title: "Useful and well finished",
    comment:
      "The basket set is sturdy, practical, and still feels decorative enough for the living room.",
    rating: 5,
    verifiedPurchase: true,
    createdAt: "2026-02-16T08:05:00.000Z"
  },
  {
    id: "review-005",
    productId: "terracotta-vase-004",
    userId: "seed-reviewer-005",
    name: "Nusrat Jahan",
    location: "Chattogram, Bangladesh",
    title: "Warm handmade character",
    comment:
      "The terracotta finish gives the vase a very natural look and it works nicely with dried flowers.",
    rating: 4,
    verifiedPurchase: false,
    createdAt: "2026-02-24T14:45:00.000Z"
  },
  {
    id: "review-006",
    productId: "silk-scarf-005",
    userId: "seed-reviewer-006",
    name: "Layla Hassan",
    location: "Dubai, UAE",
    title: "Soft fabric and rich color",
    comment:
      "The silk is soft, lightweight, and the golden paisley work stands out without feeling heavy.",
    rating: 4,
    verifiedPurchase: true,
    createdAt: "2026-03-01T10:15:00.000Z"
  },
  {
    id: "review-007",
    productId: "tangail-saree-006",
    userId: "seed-reviewer-007",
    name: "Farzana Rahman",
    location: "Rajshahi, Bangladesh",
    title: "Comfortable for regular wear",
    comment:
      "This saree is light, breathable, and easy to wear for events as well as everyday family gatherings.",
    rating: 5,
    verifiedPurchase: true,
    createdAt: "2026-03-09T12:40:00.000Z"
  },
  {
    id: "review-008",
    productId: "cane-chair-007",
    userId: "seed-reviewer-008",
    name: "Ahmed Rahman",
    location: "Dubai, UAE",
    title: "Strong statement piece",
    comment:
      "The chair has a bold traditional look and feels solid enough to use daily in a reading corner.",
    rating: 4,
    verifiedPurchase: true,
    createdAt: "2026-03-14T18:25:00.000Z"
  },
  {
    id: "review-009",
    productId: "nakshi-kantha-wall-008",
    userId: "seed-reviewer-009",
    name: "Sadia Noor",
    location: "Sylhet, Bangladesh",
    title: "Looks like framed storytelling",
    comment:
      "The village scene brings a lot of personality to the wall and the stitching detail is impressive.",
    rating: 5,
    verifiedPurchase: false,
    createdAt: "2026-03-20T07:55:00.000Z"
  }
];

export const aboutValues = [
  {
    title: "Supporting Artisans",
    description: "We focus on fair opportunities for craftspeople and their families."
  },
  {
    title: "Preserving Heritage",
    description: "We help keep traditional Bangladeshi craft knowledge visible and valued."
  },
  {
    title: "Community Impact",
    description: "Each purchase supports rural livelihoods and cultural continuity."
  },
  {
    title: "Sustainability",
    description: "Many traditional craft forms rely on natural materials and long-lasting techniques."
  }
];

export const aboutStats = [
  { value: "500+", label: "Artisan families supported" },
  { value: "64", label: "Districts represented" },
  { value: "15,000+", label: "Products delivered" },
  { value: "98%", label: "Customer satisfaction" }
];

export const teamMembers = [
  {
    name: "Ayesha Rahman",
    role: "Founder and CEO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    bio: "Passionate about preserving Bangladeshi heritage and empowering rural artisans."
  },
  {
    name: "Karim Ahmed",
    role: "Head of Artisan Relations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Works directly with artisan communities across the country."
  },
  {
    name: "Fatima Begum",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
    bio: "Curates collections and supports product development with makers."
  }
];

export const siteContent = {
  brand: {
    name: "Bangladesh Heritage Crafts",
    tagline: "Traditional craft stories, artisan communities, and handmade products from across Bangladesh."
  },
  footer: {
    description:
      "Explore products, makers, districts, account tools, and admin management from one place."
  },
  home: {
    heroEyebrow: "64 districts, countless stories",
    heroTitle: "Discover the heritage of Bangladesh through handmade crafts.",
    heroIntro:
      "Explore authentic products, artisan stories, district traditions, and curated craft collections from across Bangladesh.",
    searchLabel: "Search products, districts, or craft types",
    searchPlaceholder: "Search the catalog",
    searchButton: "Search Products",
    browseButton: "Browse Districts",
    panelEyebrow: "Heritage collection",
    panelTitle: "Explore products, stories, and craft traditions in one place",
    panelText:
      "Browse the public catalog, follow artisan stories, and move through the customer and admin flows from the same site.",
    districtsEyebrow: "Craft regions",
    districtsTitle: "Featured districts",
    districtsIntro:
      "Discover the regions and traditions behind some of Bangladesh's best-known handmade products.",
    productsEyebrow: "Shop now",
    productsTitle: "Featured products",
    productsIntro:
      "Handpicked items from the catalog, highlighting weaving, pottery, embroidery, and bamboo work.",
    categoriesEyebrow: "Craft types",
    categoriesTitle: "Shop by category",
    categoriesIntro:
      "Jump into the catalog by weaving, pottery, bamboo work, embroidery, and more.",
    artisansEyebrow: "The makers",
    artisansTitle: "Meet featured artisans",
    artisansIntro:
      "Traditional craft becomes meaningful because of the hands and stories behind each piece.",
    testimonialsEyebrow: "What customers say",
    testimonialsTitle: "Stories from buyers around the world",
    testimonialsIntro:
      "Customer feedback highlights the value of authentic handmade work and the people behind it."
  },
  about: {
    heroEyebrow: "Our story",
    heroTitle: "Connecting heritage to the world.",
    heroIntro:
      "Bangladesh Heritage Crafts began as a showcase for traditional makers, cultural storytelling, and fair opportunities for artisan communities.",
    panelText:
      "The site focuses on preserving craft traditions while making it easier to explore artisans, places, and products together.",
    valuesEyebrow: "Values",
    valuesTitle: "What guides the project",
    teamEyebrow: "Team",
    teamTitle: "People behind the platform"
  },
  auth: {
    loginEyebrow: "Sign in",
    loginTitle: "Welcome back",
    loginIntro:
      "Use a customer account or a prepared admin account to continue into the store.",
    registerEyebrow: "Create account",
    registerTitle: "Join the craft community",
    registerIntro:
      "Create a customer account in this browser so you can save a session and place orders.",
    demoTitle: "Demo credentials",
    demoCustomer: "Customer: user@example.com / demo123",
    demoAdmin: "Admin: admin@example.com / demo123"
  }
};
