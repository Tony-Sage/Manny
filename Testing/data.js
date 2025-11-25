// storeData — 20 items (categories constrained to the five primary categories)
export const storeData = [
  {
    id: 1,
    name: "Ceramic Brake Pad Set",
    slug: "ceramic-brake-pad-set",
    description: "High-friction ceramic pads — quiet, long life, low dust.",
    image: "../images/brake pads.jpg",
    category: " Engine Parts",
    tracks: ["featured", "chassis", "brakes"],
    tags: ["ceramic", "quiet", "dust-free"],
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
      { brand: "Honda", model: "Civic", years: [2014,2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2010, price: 9500, availability: "In stock" },
      { brand: "Toyota", model: "Corolla", year: 2011, price: 10000, availability: "In stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 12000, availability: "Low stock" },
      { brand: "Honda", model: "Civic", year: 2015, price: 11500, availability: "Low stock" }
    ]
  },

  {
    id: 2,
    name: "High-Flow Oil Filter",
    slug: "high-flow-oil-filter",
    description: "Premium oil filter for extended service intervals.",
    image: "../images/oil-filter.jpg",
    category: "Engine Accessories",
    tracks: ["featured", "engine", "filters"],
    tags: ["filter", "maintenance", "engine-care"],
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2012,2013,2014] },
      { brand: "Nissan", model: "Altima", years: [2014,2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 1800, availability: "In stock" },
      { brand: "Nissan", model: "Altima", year: 2014, price: 2000, availability: "In stock" }
    ]
  },

  {
    id: 3,
    name: "Halogen Headlight Bulb (H4)",
    slug: "halogen-headlight-h4",
    description: "Standard H4 halogen bulb with long life coating.",
    image: "https://via.placeholder.com/400x300?text=Headlight+H4",
    category: "Electrical Accessories",
    tracks: ["lighting", "featured", "electrical"],
    tags: ["lighting", "halogen", "bulb"],
    compatibilities: [
      { brand: "Toyota", model: "Avanza", years: [2010,2011] },
      { brand: "Honda", model: "Civic", years: [2014,2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Avanza", year: 2010, price: 1200, availability: "Low stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 1400, availability: "In stock" }
    ]
  },

  {
    id: 4,
    name: "Panel Air Filter",
    slug: "panel-air-filter",
    description: "High-capacity air filter for improved engine breathing.",
    image: "../images/shaft heads.jpg",
    category: "Engine Accessories",
    tracks: ["new-arrivals", "filters", "engine"],
    tags: ["filter", "air", "performance"],
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2011,2012,2013] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2012, price: 2200, availability: "In stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 2400, availability: "In stock" }
    ]
  },

  {
    id: 5,
    name: "Reinforced Radiator Hose",
    slug: "reinforced-radiator-hose",
    description: "Durable rubber hose, reinforced for high-heat systems.",
    image: "https://via.placeholder.com/400x300?text=Radiator+Hose",
    category: "Engine Accessories",
    tracks: ["engine", "chassis"],
    tags: ["hose", "cooling", "durable"],
    compatibilities: [
      { brand: "Nissan", model: "Altima", years: [2014,2015] },
      { brand: "Toyota", model: "Camry", years: [2013,2014] }
    ],
    variants: [
      { brand: "Nissan", model: "Altima", year: 2014, price: 3400, availability: "In stock" },
      { brand: "Toyota", model: "Camry", year: 2013, price: 3600, availability: "Low stock" }
    ]
  },

  {
    id: 6,
    name: "High-Durability Timing Belt",
    slug: "timing-belt-high",
    description: "Reinforced timing belt with heat-stable compound.",
    image: "https://via.placeholder.com/400x300?text=Timing+Belt",
    category: "Engine Accessories",
    tracks: ["engine", "featured"],
    tags: ["belt", "timing", "maintenance"],
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2010, price: 6200, availability: "Low stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 6500, availability: "In stock" }
    ]
  },

  {
    id: 7,
    name: "Spark Plug (Platinum)",
    slug: "spark-plug-platinum",
    description: "Platinum spark plug for efficient ignition and fuel savings.",
    image: "../images/spark-plug.jpg",
    category: "Engine Accessories",
    tracks: ["new-arrivals", "engine"],
    tags: ["spark", "ignition", "platinum"],
    compatibilities: [
      { brand: "Honda", model: "Civic", years: [2014,2015] },
      { brand: "Toyota", model: "Yaris", years: [2016,2017] }
    ],
    variants: [
      { brand: "Honda", model: "Civic", year: 2015, price: 900, availability: "In stock" },
      { brand: "Toyota", model: "Yaris", year: 2016, price: 850, availability: "In stock" }
    ]
  },

  {
    id: 8,
    name: "Headlamp Assembly (LH)",
    slug: "headlamp-assembly-lh",
    description: "Full headlamp assembly — left-hand side, includes housing and lens.",
    image: "../images/headlamp.jpg",
    category: "Body Parts",
    tracks: ["featured", "lighting", "body"],
    tags: ["assembly", "headlamp", "body"],
    compatibilities: [
      { brand: "Nissan", model: "Sentra", years: [2015,2016] },
      { brand: "Toyota", model: "Corolla", years: [2017] }
    ],
    variants: [
      { brand: "Nissan", model: "Sentra", year: 2015, price: 12500, availability: "Low stock" },
      { brand: "Toyota", model: "Corolla", year: 2017, price: 13800, availability: "In stock" }
    ]
  },

  {
    id: 9,
    name: "Front Bumper Cover",
    slug: "front-bumper-cover",
    description: "OEM-fit front bumper cover — primered and ready for paint.",
    image: "../images/bumper.jpg",
    category: "Body Parts",
    tracks: ["body", "featured"],
    tags: ["bumper", "body", "paintable"],
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2013,2014] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 22000, availability: "In stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 21000, availability: "Low stock" }
    ]
  },

  {
    id: 10,
    name: "LED Interior Dome Light",
    slug: "led-interior-dome-light",
    description: "Energy-efficient LED dome light with soft-white output.",
    image: "https://via.placeholder.com/400x300?text=LED+Dome+Light",
    category: "Interior Decorations",
    tracks: ["lighting", "interior", "new-arrivals"],
    tags: ["LED", "interior", "lighting"],
    compatibilities: [
      { brand: "Toyota", model: "Yaris", years: [2016,2017] },
      { brand: "Honda", model: "Fit", years: [2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Yaris", year: 2016, price: 1800, availability: "In stock" },
      { brand: "Honda", model: "Fit", year: 2015, price: 1750, availability: "In stock" }
    ]
  },

  {
    id: 11,
    name: "Door Sill Protector (Stainless)",
    slug: "door-sill-protector-stainless",
    description: "Stainless door sill protector — prevents scuffs and scratches.",
    image: "../images/door-sill.jpg",
    category: "Interior Decorations",
    tracks: ["interior", "featured"],
    tags: ["sill", "stainless", "trim"],
    compatibilities: [
      { brand: "Nissan", model: "Altima", years: [2014,2015] },
      { brand: "Toyota", model: "Camry", years: [2013] }
    ],
    variants: [
      { brand: "Nissan", model: "Altima", year: 2014, price: 5200, availability: "In stock" },
      { brand: "Toyota", model: "Camry", year: 2013, price: 5000, availability: "Low stock" }
    ]
  },

  {
    id: 12,
    name: "Floor Mat Set (All-Weather)",
    slug: "floor-mat-all-weather",
    description: "All-weather floor mat set — easy to clean, anti-slip backing.",
    image: "../images/floor-mats.jpg",
    category: "Interior Decorations",
    tracks: ["interior", "others", "featured"],
    tags: ["mat", "all-weather", "easy-clean"],
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
      { brand: "Honda", model: "Civic", years: [2014,2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2011, price: 4500, availability: "In stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 4800, availability: "In stock" }
    ]
  },

  {
    id: 13,
    name: "Side Mirror (Electric)",
    slug: "side-mirror-electric",
    description: "Power-adjustable side mirror with heating option.",
    image: "../images/side-mirror.jpg",
    category: "Body Parts",
    tracks: ["body", "electrical"],
    tags: ["mirror", "electric", "heating"],
    compatibilities: [
      { brand: "Nissan", model: "Sentra", years: [2015,2016] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    variants: [
      { brand: "Nissan", model: "Sentra", year: 2015, price: 7200, availability: "Low stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 6800, availability: "In stock" }
    ]
  },

  {
    id: 14,
    name: "Shock Absorber (Front)",
    slug: "shock-absorber-front",
    description: "Gas-filled front shock absorber for smooth ride control.",
    image: "../images/shock.jpg",
    category: "Chassis Accessories",
    tracks: ["chassis", "featured"],
    tags: ["shock", "ride", "gas-filled"],
    compatibilities: [
      { brand: "Toyota", model: "Rav4", years: [2015,2016] },
      { brand: "Honda", model: "CR-V", years: [2014,2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Rav4", year: 2015, price: 9500, availability: "In stock" },
      { brand: "Honda", model: "CR-V", year: 2014, price: 9800, availability: "Low stock" }
    ]
  },

  {
    id: 15,
    name: "Brake Disc (Ventilated)",
    slug: "brake-disc-ventilated",
    description: "Ventilated front brake disc for improved cooling.",
    image: "../images/brake-disc.jpg",
    category: "Chassis Accessories",
    tracks: ["chassis", "brakes"],
    tags: ["disc", "ventilated", "brakes"],
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2013,2014] },
      { brand: "Nissan", model: "Altima", years: [2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 7800, availability: "In stock" },
      { brand: "Nissan", model: "Altima", year: 2015, price: 8200, availability: "Low stock" }
    ]
  },

  {
    id: 16,
    name: "90A Alternator",
    slug: "90a-alternator",
    description: "90-amp alternator — reliable charging for accessory-heavy cars.",
    image: "../images/alternator.jpg",
    category: "Electrical Accessories",
    tracks: ["electrical", "featured"],
    tags: ["alternator", "charging", "electrical"],
    compatibilities: [
      { brand: "Honda", model: "Civic", years: [2014,2015] },
      { brand: "Toyota", model: "Corolla", years: [2012,2013] }
    ],
    variants: [
      { brand: "Honda", model: "Civic", year: 2014, price: 15200, availability: "In stock" },
      { brand: "Toyota", model: "Corolla", year: 2012, price: 14800, availability: "Low stock" }
    ]
  },

  {
    id: 17,
    name: "Universal Roof Rack",
    slug: "universal-roof-rack",
    description: "Adjustable roof rack for crossbars and rooftop cargo.",
    image: "../images/roof-rack.jpg",
    category: "Chassis Accessories",
    tracks: ["others", "chassis"],
    tags: ["rack", "cargo", "universal"],
    compatibilities: [
      { brand: "Toyota", model: "Rav4", years: [2015,2016] },
      { brand: "Nissan", model: "X-Trail", years: [2014,2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Rav4", year: 2015, price: 22000, availability: "In stock" },
      { brand: "Nissan", model: "X-Trail", year: 2014, price: 21000, availability: "Low stock" }
    ]
  },

  {
    id: 18,
    name: "Waterproof Seat Covers (Front Pair)",
    slug: "seat-covers-front-pair",
    description: "Splash-resistant seat covers — neoprene blend with reinforced seams.",
    image: "../images/seat-covers.jpg",
    category: "Interior Decorations",
    tracks: ["interior", "others"],
    tags: ["seat", "waterproof", "comfort"],
    compatibilities: [
      { brand: "Toyota", model: "Yaris", years: [2016,2017] },
      { brand: "Honda", model: "Fit", years: [2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Yaris", year: 2016, price: 5200, availability: "In stock" },
      { brand: "Honda", model: "Fit", year: 2015, price: 5000, availability: "In stock" }
    ]
  },

  {
    id: 19,
    name: "USB Phone Charger (Dual Port)",
    slug: "usb-phone-charger-dual",
    description: "Dual-port USB charger — fast charge and overcurrent protection.",
    image: "https://via.placeholder.com/400x300?text=USB+Charger",
    category: "Electrical Accessories",
    tracks: ["electrical", "others"],
    tags: ["usb", "charger", "accessory"],
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
      { brand: "Nissan", model: "Sentra", years: [2015,2016] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2011, price: 2500, availability: "In stock" },
      { brand: "Nissan", model: "Sentra", year: 2015, price: 2300, availability: "In stock" }
    ]
  },

  {
    id: 20,
    name: "Rubber Door Seal (Per Meter)",
    slug: "rubber-door-seal-per-meter",
    description: "EPDM rubber door seal — weatherproof and noise-damping.",
    image: "../images/door-seal.jpg",
    category: "Body Parts",
    tracks: ["body", "others"],
    tags: ["seal", "weatherproof", "rubber"],
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2013,2014] },
      { brand: "Honda", model: "Accord", years: [2012] }
    ],
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 350, availability: "In stock" }, // per meter
      { brand: "Honda", model: "Accord", year: 2012, price: 360, availability: "In stock" }  // per meter
    ]
  }
];