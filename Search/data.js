// data.js

export const autoParts = [
  // {
  //   id: 1,
  //   name: "Ceramic Brake Pad Set",
  //   image: "../images/brake pads.jpg",
  //   description: "High-friction ceramic pads — quiet, long life, low dust.",
  //   category: "Engine Parts",
  //   compatibilities: [
  //     { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
  //     { brand: "Honda", model: "Civic", years: [2014,2015] }
  //   ],
  //   oem: [],
  //   price: 9500,
  //   availability: "In stock",
  //   variants: [
  //     { brand: "Toyota", model: "Corolla", year: 2010, price: 9500, availability: "In stock" },
  //     { brand: "Toyota", model: "Corolla", year: 2011, price: 10000, availability: "In stock" },
  //     { brand: "Honda", model: "Civic", year: 2014, price: 12000, availability: "Low stock" },
  //     { brand: "Honda", model: "Civic", year: 2015, price: 11500, availability: "Low stock" }
  //   ],
  //   general: {
  //     partType: "Ceramic brake pad set",
  //     whatItDoes: "Provides friction surface to stop the vehicle, reducing noise and wear.",
  //     category: "Engine Parts",
  //     compatibilitySummary: "Compatible with select Toyota and Honda models (see full compatibility list).",
  //     priceRange: "9500 - 12000",
  //     availability: "Varies by variant"
  //   },
  //   specs: {
  //     material: "Ceramic composite",
  //     technology: "Low-dust friction compound",
  //     performance: "Quiet operation, long life",
  //     heatToleranceCategory: "Medium-High",
  //     expectedLifespanCategory: "Medium to long under normal driving",
  //     installationPosition: "Front/Rear depending on vehicle",
  //     partClass: "Aftermarket / Premium",
  //     finish: "Coated friction surface"
  //   }
  // },

  {
    id: 2,
    name: "High-Flow Oil Filter",
    image: "../images/oil filter.jpg",
    description: "Premium oil filter for extended service intervals.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2012,2013,2014] },
      { brand: "Nissan", model: "Altima", years: [2014,2015] }
    ],
    oem: [],
    price: 1800,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 1800, availability: "In stock" },
      { brand: "Nissan", model: "Altima", year: 2014, price: 2000, availability: "In stock" }
    ],
    general: {
      partType: "Engine oil filter",
      whatItDoes: "Filters contaminants from engine oil to prolong engine life.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Toyota and Nissan models (see full compatibility list).",
      priceRange: "1800 - 2000",
      availability: "In stock"
    },
    specs: {
      material: "Cellulose/synthetic blend",
      technology: "High-efficiency filtration media",
      performance: "Extended service interval capable",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Medium",
      installationPosition: "Engine oil line",
      partClass: "Aftermarket compatible",
      finish: "Standard canister"
    }
  },

  {
    id: 3,
    name: "Halogen Headlight Bulb (H4)",
    image: "../images/h4 bulb.jpg",
    description: "Standard H4 halogen bulb with long life coating.",
    category: "Electrical Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Avanza", years: [2010,2011] },
      { brand: "Honda", model: "Civic", years: [2014,2015] }
    ],
    oem: [],
    price: 1200,
    availability: "Low stock",
    variants: [
      { brand: "Toyota", model: "Avanza", year: 2010, price: 1200, availability: "Low stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 1400, availability: "In stock" }
    ],
    general: {
      partType: "Halogen headlight bulb (H4)",
      whatItDoes: "Provides forward illumination for vehicle; single H4 dual-filament bulb for high/low beam.",
      category: "Electrical Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models.",
      priceRange: "1200 - 1400",
      availability: "Varies by variant"
    },
    specs: {
      material: "Glass/metal base",
      technology: "Halogen filament with long-life coating",
      performance: "Standard halogen brightness",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Standard for halogen bulbs",
      installationPosition: "Headlamp",
      partClass: "Aftermarket / OEM fit",
      finish: "Clear coated glass"
    }
  },

  {
    id: 4,
    name: "Panel Air Filter",
    image: ["../images/shaft heads.jpg", "../images/air filter 2.jpg", "../images/air filter 3.jpg"],
    description: "High-capacity air filter for improved engine breathing.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2011,2012,2013] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    oem: [],
    price: 2200,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2012, price: 2200, availability: "In stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 2400, availability: "In stock" }
    ],
    general: {
      partType: "Panel air filter",
      whatItDoes: "Filters intake air to improve combustion and protect the engine.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models.",
      priceRange: "2200 - 2400",
      availability: "In stock"
    },
    specs: {
      material: "High-capacity paper/synthetic media",
      technology: "Pleated media for high surface area",
      performance: "Improves airflow while filtering contaminants",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Medium",
      installationPosition: "Engine intake housing",
      partClass: "Aftermarket / OEM-fit",
      finish: "Standard filter frame"
    }
  },

  {
    id: 5,
    name: "Reinforced Radiator Hose",
    image: "../images/radiator hose.jpg",
    description: "Durable rubber hose, reinforced for high-heat systems.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Nissan", model: "Altima", years: [2014,2015] },
      { brand: "Toyota", model: "Camry", years: [2013,2014] }
    ],
    oem: [],
    price: 3400,
    availability: "In stock",
    variants: [
      { brand: "Nissan", model: "Altima", year: 2014, price: 3400, availability: "In stock" },
      { brand: "Toyota", model: "Camry", year: 2013, price: 3600, availability: "Low stock" }
    ],
    general: {
      partType: "Reinforced radiator hose",
      whatItDoes: "Carries coolant between engine and radiator; reinforced for high heat/pressure.",
      category: "Engine Accessories",
      compatibilitySummary: "Fits select Nissan and Toyota models.",
      priceRange: "3400 - 3600",
      availability: "Varies by variant"
    },
    specs: {
      material: "Reinforced EPDM rubber",
      technology: "Multi-layer reinforcement for heat/pressure resistance",
      performance: "Durable cooling hose",
      heatToleranceCategory: "High",
      expectedLifespanCategory: "Long under correct service",
      installationPosition: "Cooling system",
      partClass: "Aftermarket compatible",
      finish: "Molded rubber"
    }
  },

  {
    id: 6,
    name: "High-Durability Timing Belt",
    image: ["../images/timing belt.jpg", "../images/timing belt 2.jpg"],
    description: "Reinforced timing belt with heat-stable compound.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    oem: [],
    price: 6200,
    availability: "Low stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2010, price: 6200, availability: "Low stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 6500, availability: "In stock" }
    ],
    general: {
      partType: "Timing belt",
      whatItDoes: "Synchronizes camshafts and crankshaft to maintain engine timing.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda engines.",
      priceRange: "6200 - 6500",
      availability: "Varies by variant"
    },
    specs: {
      material: "Reinforced rubber with fiber cords",
      technology: "Heat-stable compound for long life",
      performance: "High durability",
      heatToleranceCategory: "High",
      expectedLifespanCategory: "Long (service interval dependent)",
      installationPosition: "Inside engine timing cover",
      partClass: "Aftermarket/OEM-compatible",
      finish: "Molded tooth profile"
    }
  },

  {
    id: 7,
    name: "Spark Plug (Platinum)",
    image: "../images/spark plug.jpeg",
    description: "Platinum spark plug for efficient ignition and fuel savings.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Honda", model: "Civic", years: [2014,2015] },
      { brand: "Toyota", model: "Yaris", years: [2016,2017] }
    ],
    oem: [],
    price: 900,
    availability: "In stock",
    variants: [
      { brand: "Honda", model: "Civic", year: 2015, price: 900, availability: "In stock" },
      { brand: "Toyota", model: "Yaris", year: 2016, price: 850, availability: "In stock" }
    ],
    general: {
      partType: "Platinum spark plug",
      whatItDoes: "Ignites fuel-air mixture; platinum tip improves life and consistent ignition.",
      category: "Engine Accessories",
      compatibilitySummary: "Fits select Honda and Toyota engines.",
      priceRange: "850 - 900",
      availability: "In stock"
    },
    specs: {
      material: "Ceramic insulator; platinum-tipped electrode",
      technology: "Platinum electrode for longer life",
      performance: "Improved stability and lifespan",
      heatToleranceCategory: "High",
      expectedLifespanCategory: "Longer than standard",
      installationPosition: "Cylinder head",
      partClass: "Aftermarket / Premium",
      finish: "Electrode tip plated"
    }
  },

  {
    id: 8,
    name: "Headlamp Assembly (LH)",
    image: "../images/headlamp.jpeg",
    description: "Full headlamp assembly — left-hand side, includes housing and lens.",
    category: "Body Parts",
    compatibilities: [
      { brand: "Nissan", model: "Sentra", years: [2015,2016] },
      { brand: "Toyota", model: "Corolla", years: [2017] }
    ],
    oem: [],
    price: 12500,
    availability: "Low stock",
    variants: [
      { brand: "Nissan", model: "Sentra", year: 2015, price: 12500, availability: "Low stock" },
      { brand: "Toyota", model: "Corolla", year: 2017, price: 13800, availability: "In stock" }
    ],
    general: {
      partType: "Headlamp assembly (left)",
      whatItDoes: "Complete headlamp assembly including housing, lens and mounting points.",
      category: "Body Parts",
      compatibilitySummary: "Fits select Nissan and Toyota models.",
      priceRange: "12500 - 13800",
      availability: "Varies by variant"
    },
    specs: {
      material: "Plastic housing with glass or polycarbonate lens",
      technology: "Standard halogen/LED compatible housings",
      performance: "OEM-fit replacement",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Front left",
      partClass: "OEM/Aftermarket",
      finish: "Primered/paint-ready or finished lens"
    }
  },
  
  {
    id: 9,
    name: "Front Bumper Cover",
    image: "../images/front bumper.jpeg",
    description: "OEM-fit front bumper cover — primered and ready for paint.",
    category: "Body Parts",
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2013,2014] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    oem: [],
    price: 22000,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 22000, availability: "In stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 21000, availability: "Low stock" }
    ],
    general: {
      partType: "Front bumper cover",
      whatItDoes: "Cosmetic and structural cover for front bumper; primered for painting.",
      category: "Body Parts",
      compatibilitySummary: "OEM-fit for select Camry and Accord models.",
      priceRange: "21000 - 22000",
      availability: "In stock / Low stock"
    },
    specs: {
      material: "Thermoplastic / PP",
      technology: "OEM-fit molding",
      performance: "OEM fit and finish",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long with proper mounting",
      installationPosition: "Front bumper area",
      partClass: "OEM replacement",
      finish: "Primered"
    }
  },

  {
    id: 10,
    name: "LED Interior Dome Light",
    image: "../images/dome light.jpeg",
    description: "Energy-efficient LED dome light with soft-white output.",
    category: "Interior Decorations",
    compatibilities: [
      { brand: "Toyota", model: "Yaris", years: [2016,2017] },
      { brand: "Honda", model: "Fit", years: [2015] }
    ],
    oem: [],
    price: 1800,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Yaris", year: 2016, price: 1800, availability: "In stock" },
      { brand: "Honda", model: "Fit", year: 2015, price: 1750, availability: "In stock" }
    ],
    general: {
      partType: "LED interior dome light",
      whatItDoes: "Provides interior soft-white illumination with low power draw.",
      category: "Interior Decorations",
      compatibilitySummary: "Fits select compact models.",
      priceRange: "1750 - 1800",
      availability: "In stock"
    },
    specs: {
      material: "Plastic housing with LED module",
      technology: "LED with driver",
      performance: "Low power, long life",
      heatToleranceCategory: "Low-Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Interior roof",
      partClass: "Aftermarket / OEM-fit",
      finish: "Diffused lens"
    }
  },

  /* 11 */
  {
    id: 11,
    name: "Door Sill Protector (Stainless)",
    image: "../images/door sill protector.jpeg",
    description: "Stainless door sill protector — prevents scuffs and scratches.",
    category: "Interior Decorations",
    compatibilities: [
      { brand: "Nissan", model: "Altima", years: [2014,2015] },
      { brand: "Toyota", model: "Camry", years: [2013] }
    ],
    oem: [],
    price: 5200,
    availability: "In stock",
    variants: [
      { brand: "Nissan", model: "Altima", year: 2014, price: 5200, availability: "In stock" },
      { brand: "Toyota", model: "Camry", year: 2013, price: 5000, availability: "Low stock" }
    ],
    general: {
      partType: "Door sill protector",
      whatItDoes: "Prevents scuffs and scratches at door sills.",
      category: "Interior Decorations",
      compatibilitySummary: "Fits select models.",
      priceRange: "5000 - 5200",
      availability: "In stock / Low stock"
    },
    specs: {
      material: "Stainless steel",
      technology: "Stamped/form-fitted design",
      performance: "Protective trim",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Door sill",
      partClass: "Accessory",
      finish: "Polished stainless"
    }
  },

  /* 12 */
  {
    id: 12,
    name: "Floor Mat Set (All-Weather)",
    image: "../images/floor mat.jpeg",
    description: "All-weather floor mat set — easy to clean, anti-slip backing.",
    category: "Interior Decorations",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
      { brand: "Honda", model: "Civic", years: [2014,2015] }
    ],
    oem: [],
    price: 4500,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2011, price: 4500, availability: "In stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 4800, availability: "In stock" }
    ],
    general: {
      partType: "All-weather floor mat set",
      whatItDoes: "Protects vehicle carpet and is easy to clean.",
      category: "Interior Decorations",
      compatibilitySummary: "Compatible with select compact sedans.",
      priceRange: "4500 - 4800",
      availability: "In stock"
    },
    specs: {
      material: "Rubber / thermoplastic",
      technology: "Anti-slip backing",
      performance: "All-weather protection",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Vehicle floor",
      partClass: "Accessory",
      finish: "Textured surface"
    }
  },

  /* 13 */
  {
    id: 13,
    name: "Side Mirror (Electric)",
    image: "../images/side mirror.jpeg",
    description: "Power-adjustable side mirror with heating option.",
    category: "Body Parts",
    compatibilities: [
      { brand: "Nissan", model: "Sentra", years: [2015,2016] },
      { brand: "Honda", model: "Accord", years: [2012,2013] }
    ],
    oem: [],
    price: 7200,
    availability: "Low stock",
    variants: [
      { brand: "Nissan", model: "Sentra", year: 2015, price: 7200, availability: "Low stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 6800, availability: "In stock" }
    ],
    general: {
      partType: "Electric side mirror",
      whatItDoes: "Provides power adjustment and optional heating to improve visibility.",
      category: "Body Parts",
      compatibilitySummary: "Fits select Nissan and Honda models.",
      priceRange: "6800 - 7200",
      availability: "Varies by variant"
    },
    specs: {
      material: "ABS housing, glass mirror",
      technology: "Electric motor with heater option",
      performance: "OEM-fit replacement",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Driver/Passenger side",
      partClass: "Aftermarket/OEM-fit",
      finish: "Paintable housing / finished"
    }
  },

  /* 14 */
  {
    id: 14,
    name: "Shock Absorber (Front)",
    image: "../images/shock.jpg",
    description: "Gas-filled front shock absorber for smooth ride control.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Rav4", years: [2015,2016] },
      { brand: "Honda", model: "CR-V", years: [2014,2015] }
    ],
    oem: [],
    price: 9500,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Rav4", year: 2015, price: 9500, availability: "In stock" },
      { brand: "Honda", model: "CR-V", year: 2014, price: 9800, availability: "Low stock" }
    ],
    general: {
      partType: "Front shock absorber",
      whatItDoes: "Dampens suspension motion for ride comfort and control.",
      category: "Chassis Accessories",
      compatibilitySummary: "Fits select Toyota and Honda SUVs.",
      priceRange: "9500 - 9800",
      availability: "Varies by variant"
    },
    specs: {
      material: "Steel body, hydraulic internals",
      technology: "Gas-charged hydraulic damping",
      performance: "Comfort-oriented damping",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Front suspension",
      partClass: "OEM/Aftermarket",
      finish: "Painted/coated"
    }
  },

  /* 15 */
  {
    id: 15,
    name: "Brake Disc (Ventilated)",
    image: ["../images/brake disc.jpg", "../images/brake disc 2.jpg"],
    description: "Ventilated front brake disc for improved cooling.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2013,2014] },
      { brand: "Nissan", model: "Altima", years: [2015] }
    ],
    oem: [],
    price: 7800,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 7800, availability: "In stock" },
      { brand: "Nissan", model: "Altima", year: 2015, price: 8200, availability: "Low stock" }
    ],
    general: {
      partType: "Ventilated brake disc",
      whatItDoes: "Provides braking surface and improved heat dissipation during braking.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Nissan models.",
      priceRange: "7800 - 8200",
      availability: "Varies by variant"
    },
    specs: {
      material: "Cast iron",
      technology: "Ventilated vane design",
      performance: "Good heat dissipation for heavy braking",
      heatToleranceCategory: "High",
      expectedLifespanCategory: "Long",
      installationPosition: "Front",
      partClass: "OEM/Aftermarket compatible",
      finish: "Machined"
    }
  },

  /* 16 */
  {
    id: 16,
    name: "90A Alternator",
    image: "../images/alternator.jpeg",
    description: "90-amp alternator — reliable charging for accessory-heavy cars.",
    category: "Electrical Accessories",
    compatibilities: [
      { brand: "Honda", model: "Civic", years: [2014,2015] },
      { brand: "Toyota", model: "Corolla", years: [2012,2013] }
    ],
    oem: [],
    price: 15200,
    availability: "In stock",
    variants: [
      { brand: "Honda", model: "Civic", year: 2014, price: 15200, availability: "In stock" },
      { brand: "Toyota", model: "Corolla", year: 2012, price: 14800, availability: "Low stock" }
    ],
    general: {
      partType: "Alternator (90A)",
      whatItDoes: "Charges vehicle battery and powers electrical systems when engine runs.",
      category: "Electrical Accessories",
      compatibilitySummary: "Fits select Honda and Toyota models.",
      priceRange: "14800 - 15200",
      availability: "Varies by variant"
    },
    specs: {
      material: "Aluminum housing",
      technology: "Brush/brushless design depending on variant",
      performance: "Reliable charging output 90A",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Engine bay / accessory belt driven",
      partClass: "Aftermarket/OEM-fit",
      finish: "Anodized/coated"
    }
  },

  /* 17 */
  {
    id: 17,
    name: "Universal Roof Rack",
    image: "../images/roof rack.png",
    description: "Adjustable roof rack for crossbars and rooftop cargo.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Rav4", years: [2015,2016] },
      { brand: "Nissan", model: "X-Trail", years: [2014,2015] }
    ],
    oem: [],
    price: 22000,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Rav4", year: 2015, price: 22000, availability: "In stock" },
      { brand: "Nissan", model: "X-Trail", year: 2014, price: 21000, availability: "Low stock" }
    ],
    general: {
      partType: "Universal roof rack",
      whatItDoes: "Provides rooftop cargo carrying capability with adjustable fittings.",
      category: "Chassis Accessories",
      compatibilitySummary: "Adjustable to many crossbar-friendly vehicles.",
      priceRange: "21000 - 22000",
      availability: "In stock"
    },
    specs: {
      material: "Aluminum/alloy",
      technology: "Adjustable clamp fittings",
      performance: "High load capacity (spec dependent)",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Roof",
      partClass: "Accessory",
      finish: "Powder-coated"
    }
  },

  /* 18 */
  {
    id: 18,
    name: "USB Phone Charger (Dual Port)",
    image: "../images/usb phone port.jpeg",
    description: "Dual-port USB charger — fast charge and overcurrent protection.",
    category: "Electrical Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
      { brand: "Nissan", model: "Sentra", years: [2015,2016] }
    ],
    oem: [],
    price: 2500,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2011, price: 2500, availability: "In stock" },
      { brand: "Nissan", model: "Sentra", year: 2015, price: 2300, availability: "In stock" }
    ],
    general: {
      partType: "Dual-port USB charger",
      whatItDoes: "Provides in-car USB charging with protection circuits.",
      category: "Electrical Accessories",
      compatibilitySummary: "Universal 12V accessory compatible.",
      priceRange: "2300 - 2500",
      availability: "In stock"
    },
    specs: {
      material: "Plastic housing",
      technology: "Overcurrent/overvoltage protection",
      performance: "Fast-charge capable (as per variant)",
      heatToleranceCategory: "Low-Moderate",
      expectedLifespanCategory: "Medium",
      installationPosition: "Dashboard / accessory socket",
      partClass: "Accessory",
      finish: "Matte plastic"
    }
  },

  /* 19 */
  {
    id: 19,
    name: "Rubber Door Seal (Per Meter)",
    image: "../images/door seal.jpeg",
    description: "EPDM rubber door seal — weatherproof and noise-damping.",
    category: "Body Parts",
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: [2013,2014] },
      { brand: "Honda", model: "Accord", years: [2012] }
    ],
    oem: [],
    price: 350,
    availability: "In stock",
    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 350, availability: "In stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 360, availability: "In stock" }
    ],
    general: {
      partType: "Rubber door seal (per meter)",
      whatItDoes: "Seals door gaps to stop water and reduce noise.",
      category: "Body Parts",
      compatibilitySummary: "Measured and cut-per-meter for many models.",
      priceRange: "350 - 360 per meter",
      availability: "In stock"
    },
    specs: {
      material: "EPDM rubber",
      technology: "Compression-seal design",
      performance: "Weatherproof, noise-damping",
      heatToleranceCategory: "High",
      expectedLifespanCategory: "Long",
      installationPosition: "Door perimeter",
      partClass: "Accessory",
      finish: "Smooth / ribbed profile"
    }
  },

  /* 20 */
  {
    id: 20,
    name: "Steering Rack",
    image: ["../images/steering rack.jpg", "../images/steering rack 2.jpg"],
    description: "Precision steering rack assembly for smooth steering response and long service life.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: "2007–2011" },
      { brand: "Honda", model: "Accord", years: "2008–2012" }
    ],
    oem: ["33800-89J01", "78510-42010"],
    price: 52000,
    availability: "Low Stock",
    variants: [
      // variants from storeData (id:21) — use the store's variants for steering rack
      { brand: "Toyota", model: "Camry", year: 2007, price: 52000, availability: "Low Stock" },
      { brand: "Honda", model: "Accord", year: 2008, price: 52000, availability: "Low Stock" }
    ],
    general: {
      partType: "Steering rack assembly",
      whatItDoes: "Transfers steering input from the steering wheel to the wheels.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models.",
      priceRange: "52000",
      availability: "Low Stock"
    },
    specs: {
      material: "Steel housing with sealed internals",
      technology: "Precision gear/rack design",
      performance: "High durability for consistent steering feel",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long service life",
      installationPosition: "Front steering system",
      partClass: "OEM/Aftermarket compatible",
      finish: "Factory finish / coated"
    }
  },

  /* 21 */
  {
    id: 21,
    name: "Shaft Head (Drive Shaft End)",
    image: "../images/shaft heads.jpg",
    description: "High-strength drive shaft head for secure coupling and reduced vibration.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Nissan", model: "X-Trail", years: "2010–2015" },
      { brand: "Mitsubishi", model: "Pajero", years: "2006–2011" }
    ],
    oem: ["39100-4A000", "39100-4A001"],
    price: 14500,
    availability: "In Stock",
    variants: [
      { brand: "Nissan", model: "X-Trail", year: 2010, price: 14500, availability: "In Stock" },
      { brand: "Mitsubishi", model: "Pajero", year: 2006, price: 14500, availability: "In Stock" }
    ],
    general: {
      partType: "Drive shaft coupling/head",
      whatItDoes: "Connects and secures sections of the drive shaft, reducing vibration and maintaining drivetrain alignment.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Nissan and Mitsubishi models.",
      priceRange: "14500",
      availability: "In Stock"
    },
    specs: {
      material: "Forged steel",
      technology: "High-strength forging",
      performance: "Designed for durability under drive loads",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Prop shaft / drive shaft",
      partClass: "OEM/Aftermarket compatible",
      finish: "Heat-treated / coated"
    }
  },

  /* 22 */
  {
    id: 22,
    name: "Basket Bearing (Wheel Bearing)",
    image: ["../images/basket bearing.jpg", "../images/basket bearing 2.jpg"],
    description: "Durable wheel bearing (basket style) to ensure smooth wheel rotation and longevity.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2003–2008" },
      { brand: "Toyota", model: "Yaris", years: "2006–2011" }
    ],
    oem: ["90369-46005", "51210-2S000"],
    price: 7200,
    availability: "In Stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2003, price: 7200, availability: "In Stock" },
      { brand: "Toyota", model: "Yaris", year: 2006, price: 7200, availability: "In Stock" }
    ],
    general: {
      partType: "Wheel bearing (basket style)",
      whatItDoes: "Supports wheel rotation and reduces friction between wheel hub and axle.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota models.",
      priceRange: "7200",
      availability: "In Stock"
    },
    specs: {
      material: "Bearing steel",
      technology: "Sealed bearing construction",
      performance: "Reliable long-service performance",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Wheel hub",
      partClass: "OEM/Aftermarket",
      finish: "Sealed / lubricated"
    }
  },

  /* 23 */
  {
    id: 23,
    name: "Hub Assembly",
    image: "../images/hub.jpg",
    description: "Complete hub assembly with flange for secure wheel mounting and reliable operation.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Honda", model: "Fit", years: "2007–2013" },
      { brand: "Nissan", model: "Note", years: "2006–2012" }
    ],
    oem: ["42200-0E030", "43430-0E030"],
    price: 12800,
    availability: "In Stock",
    variants: [
      { brand: "Honda", model: "Fit", year: 2007, price: 12800, availability: "In Stock" },
      { brand: "Nissan", model: "Note", year: 2006, price: 12800, availability: "In Stock" }
    ],
    general: {
      partType: "Hub assembly with flange",
      whatItDoes: "Houses wheel bearing and provides mounting flange for wheel.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Honda and Nissan models.",
      priceRange: "12800",
      availability: "In Stock"
    },
    specs: {
      material: "Steel assembly with integrated bearing",
      technology: "Complete hub assembly to reduce fitment errors",
      performance: "Standard replacement quality",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Wheel hub",
      partClass: "OEM/Aftermarket",
      finish: "Pre-treated / anti-corrosion coating"
    }
  },

  /* 24 */
  {
    id: 24,
    name: "Brake Pads (Front Set)",
    image: "../images/brake pads.jpg",
    description: "Ceramic front brake pad set delivering quiet operation and long life.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2008–2013" },
      { brand: "Honda", model: "Civic", years: "2006–2011" },
      { brand: "Nissan", model: "Almera", years: "2007–2012" }
    ],
    oem: ["04465-02090", "45022-22040"],
    price: 9800,
    availability: "In Stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2008, price: 9800, availability: "In Stock" },
      { brand: "Honda", model: "Civic", year: 2006, price: 9800, availability: "In Stock" },
      { brand: "Nissan", model: "Almera", year: 2007, price: 9800, availability: "In Stock" }
    ],
    general: {
      partType: "Front brake pad set",
      whatItDoes: "Provides friction against the brake disc to slow and stop the vehicle.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota, Honda, and Nissan models.",
      priceRange: "9800",
      availability: "In Stock"
    },
    specs: {
      material: "Ceramic",
      technology: "Low-dust, anti-noise shim",
      performance: "Quiet operation, long life",
      heatToleranceCategory: "Medium-High",
      expectedLifespanCategory: "Long",
      installationPosition: "Front",
      partClass: "Aftermarket / Premium (ceramic)",
      finish: "Coated friction surface"
    }
  },

  /* 25 */
  {
    id: 25,
    name: "Shock Absorber (Rear)",
    image: "../images/shock.jpg",
    description: "Rear shock absorber tuned for comfort and control on mixed road conditions.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Lexus", model: "RX350", years: "2010–2015" },
      { brand: "Toyota", model: "Highlander", years: "2008–2012" }
    ],
    oem: ["48530-60090", "55310-5A2-A01"],
    price: 16500,
    availability: "In Stock",
    variants: [
      { brand: "Lexus", model: "RX350", year: 2010, price: 16500, availability: "In Stock" },
      { brand: "Toyota", model: "Highlander", year: 2008, price: 16500, availability: "In Stock" }
    ],
    general: {
      partType: "Rear shock absorber",
      whatItDoes: "Dampens suspension motion to provide ride comfort and control.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Lexus and Toyota models.",
      priceRange: "16500",
      availability: "In Stock"
    },
    specs: {
      material: "Steel body with hydraulic internals",
      technology: "Hydraulic damping with valving tuned for comfort",
      performance: "Comfort-oriented damping",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Rear",
      partClass: "OEM/Aftermarket options",
      finish: "Painted / corrosion-resistant"
    }
  },

  /* 26 */
  // {
  //   id: 26,
  //   name: "Brake Disc",
  //   image: "../images/brake disc.jpg",
  //   description: "Ventilated front brake disc engineered for reliable stopping power and reduced fade.",
  //   category: "Chassis Accessories",
  //   compatibilities: [
  //     { brand: "Toyota", model: "Corolla", years: "2008–2013" },
  //     { brand: "Honda", model: "Civic", years: "2006–2011" },
  //     { brand: "Nissan", model: "Sentra", years: "2007–2012" }
  //   ],
  //   oem: ["43512-02130", "43512-02131"],
  //   price: 18500,
  //   availability: "In Stock",
  //   variants: [
  //     // storeData had a ventilated brake-disc entry (id:15) — we included that as separate item above,
  //     // but keep Brake Disc here with its autoParts-derived variants (if store provides any matching variants they would be added; none specifically matched "Brake Disc" exactly in storeData)
  //   ],
  //   general: {
  //     partType: "Ventilated brake disc",
  //     whatItDoes: "Provides braking surface for the brake pads; dissipates heat to reduce fade during heavy use.",
  //     category: "Chassis Accessories",
  //     compatibilitySummary: "Compatible with select Toyota, Honda and Nissan models (see full compatibility list).",
  //     priceRange: "18500",
  //     availability: "In Stock"
  //   },
  //   specs: {
  //     material: "Cast iron (typical)",
  //     technology: "Ventilated design for improved cooling",
  //     performance: "Standard (street) performance",
  //     heatToleranceCategory: "High",
  //     expectedLifespanCategory: "Long",
  //     installationPosition: "Front",
  //     partClass: "OEM/Aftermarket compatible",
  //     finish: "Machined surface"
  //   }
  // },

  /* 27 */
  {
    id: 27,
    name: "Ball Joint",
    image: ["../images/ball joint.jpg", "../images/ball joint 2.jpg"],
    description: "Forged ball joint for reliable steering geometry and long-lasting durability.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Hilux", years: "2005–2011" },
      { brand: "Nissan", model: "Navara", years: "2006–2012" }
    ],
    oem: ["43330-60020", "51320-1AA0A"],
    price: 7600,
    availability: "Low Stock",
    variants: [
      { brand: "Toyota", model: "Hilux", year: 2005, price: 7600, availability: "Low Stock" },
      { brand: "Nissan", model: "Navara", year: 2006, price: 7600, availability: "Low Stock" }
    ],
    general: {
      partType: "Ball joint",
      whatItDoes: "Provides a pivot point for steering and suspension components.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Nissan models.",
      priceRange: "7600",
      availability: "Low Stock"
    },
    specs: {
      material: "Forged steel",
      technology: "Sealed joint",
      performance: "Durable steering/suspension component",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Front suspension",
      partClass: "OEM/Aftermarket",
      finish: "Zinc/plated"
    }
  },

  /* 28 */
  {
    id: 28,
    name: "Center Bearing",
    image: ["../images/center bearing.jpg", "../images/center bearing 2.jpg"],
    description: "Center support bearing for multi-piece drive shafts to reduce vibration and wear.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Mitsubishi", model: "L200", years: "2006–2012" },
      { brand: "Isuzu", model: "D-Max", years: "2008–2014" }
    ],
    oem: ["27121-4A000", "27121-3S000"],
    price: 6800,
    availability: "In Stock",
    variants: [
      { brand: "Mitsubishi", model: "L200", year: 2006, price: 6800, availability: "In Stock" },
      { brand: "Isuzu", model: "D-Max", year: 2008, price: 6800, availability: "In Stock" }
    ],
    general: {
      partType: "Center support bearing",
      whatItDoes: "Supports multi-piece drive shafts and reduces vibration and wear.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Mitsubishi and Isuzu models.",
      priceRange: "6800",
      availability: "In Stock"
    },
    specs: {
      material: "Bearing steel with rubber housing",
      technology: "Rubber insulator to damp vibration",
      performance: "Reliable under load",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Drive shaft (center)",
      partClass: "OEM/Aftermarket",
      finish: "Sealed / lubricated"
    }
  },

  /* 29 */
  {
    id: 29,
    name: "Universal Joint (U-Joint)",
    image: "../images/universal joint.jpg",
    description: "Robust universal joint for reliable torque transfer in drive shafts under load.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Nissan", model: "Navara", years: "2006–2014" },
      { brand: "Toyota", model: "Hilux", years: "2005–2015" }
    ],
    oem: ["23100-62010", "27110-2S000"],
    price: 5400,
    availability: "In Stock",
    variants: [
      { brand: "Nissan", model: "Navara", year: 2006, price: 5400, availability: "In Stock" },
      { brand: "Toyota", model: "Hilux", year: 2005, price: 5400, availability: "In Stock" }
    ],
    general: {
      partType: "Universal joint (U-joint)",
      whatItDoes: "Allows angular misalignment in drive shafts while transferring torque.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Nissan and Toyota models.",
      priceRange: "5400",
      availability: "In Stock"
    },
    specs: {
      material: "Hardened steel",
      technology: "Cross-style joint with greaseable caps",
      performance: "Durable torque transfer",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Drive shaft",
      partClass: "Aftermarket/OEM",
      finish: "Greased / plated"
    }
  },

  /* 30 */
  {
    id: 30,
    name: "Shaft Joint (CV Joint)",
    image: "../images/shaft joint.jpg",
    description: "Constant velocity shaft joint to maintain smooth power transfer at varying angles.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2008–2013" },
      { brand: "Honda", model: "Civic", years: "2006–2011" }
    ],
    oem: ["44010-0V010", "38320-1AA0A"],
    price: 11200,
    availability: "Low Stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2008, price: 11200, availability: "Low Stock" },
      { brand: "Honda", model: "Civic", year: 2006, price: 11200, availability: "Low Stock" }
    ],
    general: {
      partType: "Constant velocity (CV) joint",
      whatItDoes: "Maintains smooth power transfer to wheels at varying steering angles.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models.",
      priceRange: "11200",
      availability: "Low Stock"
    },
    specs: {
      material: "Hardened steel",
      technology: "Precision-ground races and sealed boot interface",
      performance: "Smooth power transfer under angle changes",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long with intact boot",
      installationPosition: "Drive axle / CV shaft",
      partClass: "OEM/Aftermarket",
      finish: "Greased and sealed"
    }
  },

  /* 31 */
  {
    id: 31,
    name: "Shaft Hose (Drive Shaft Dust Boot)",
    image: "../images/shaft hose.jpg",
    description: "Protective dust boot for CV/drive shaft joints — prevents contamination and premature wear.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Honda", model: "CR-V", years: "2007–2012" },
      { brand: "Nissan", model: "X-Trail", years: "2010–2016" }
    ],
    oem: ["04432-00010", "04433-00020"],
    price: 2400,
    availability: "In Stock",
    variants: [
      { brand: "Honda", model: "CR-V", year: 2007, price: 2400, availability: "In Stock" },
      { brand: "Nissan", model: "X-Trail", year: 2010, price: 2400, availability: "In Stock" }
    ],
    general: {
      partType: "Drive shaft dust boot / CV boot",
      whatItDoes: "Protects CV joints from dirt and moisture to prevent premature wear.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Honda and Nissan models.",
      priceRange: "2400",
      availability: "In Stock"
    },
    specs: {
      material: "Rubber / thermoplastic elastomer",
      technology: "Flexible boot designed to seal joints",
      performance: "Protective sealing to extend joint life",
      heatToleranceCategory: "Low-Moderate",
      expectedLifespanCategory: "Medium to long",
      installationPosition: "CV joint / drive shaft",
      partClass: "Aftermarket",
      finish: "Molded rubber"
    }
  },

  /* 32 */
  {
    id: 32,
    name: "Arm Bushing",
    image: ["../images/arm bushing.jpg", "../images/arm bushing 2.jpg"],
    description: "Polyurethane control arm bushing for improved handling and reduced play.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2003–2008" },
      { brand: "Toyota", model: "Matrix", years: "2003–2008" }
    ],
    oem: ["48654-60010", "51391-02010"],
    price: 4200,
    availability: "In Stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2003, price: 4200, availability: "In Stock" },
      { brand: "Toyota", model: "Matrix", year: 2003, price: 4200, availability: "In Stock" }
    ],
    general: {
      partType: "Control arm bushing",
      whatItDoes: "Reduces play in suspension links and improves handling precision.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota models.",
      priceRange: "4200",
      availability: "In Stock"
    },
    specs: {
      material: "Polyurethane",
      technology: "Improved compound for reduced deflection",
      performance: "Better handling vs stock rubber",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Longer than rubber",
      installationPosition: "Control arm",
      partClass: "Aftermarket / Performance",
      finish: "Molded polyurethane"
    }
  },

  /* 33 */
  {
    id: 33,
    name: "Control Arm",
    image: "../images/control arm.jpg",
    description: "Stamped steel control arm for dependable suspension geometry and strength.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Honda", model: "Accord", years: "2008–2012" },
      { brand: "Toyota", model: "Camry", years: "2007–2011" }
    ],
    oem: ["48068-02130", "48600-49705"],
    price: 15800,
    availability: "In Stock",
    variants: [
      { brand: "Honda", model: "Accord", year: 2008, price: 15800, availability: "In Stock" },
      { brand: "Toyota", model: "Camry", year: 2007, price: 15800, availability: "In Stock" }
    ],
    general: {
      partType: "Stamped steel control arm",
      whatItDoes: "Connects chassis to wheel hub and maintains suspension geometry.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Honda and Toyota models.",
      priceRange: "15800",
      availability: "In Stock"
    },
    specs: {
      material: "Stamped steel",
      technology: "Reinforced stamping",
      performance: "Durable suspension component",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Lower control arm",
      partClass: "OEM/Aftermarket",
      finish: "E-coated / painted"
    }
  },

  /* 34 */
  {
    id: 34,
    name: "Stabilizer Rubber (Anti-roll Bush)",
    image: ["../images/stabilizer rubber.jpg", "../images/stabilizer rubber 2.jpg"],
    description: "Rubber stabilizer bush to reduce sway and maintain handling stability.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "RAV4", years: "2006–2012" },
      { brand: "Nissan", model: "Qashqai", years: "2007–2012" }
    ],
    oem: ["48815-04010", "48815-0V010"],
    price: 1200,
    availability: "In Stock",
    variants: [
      { brand: "Toyota", model: "RAV4", year: 2006, price: 1200, availability: "In Stock" },
      { brand: "Nissan", model: "Qashqai", year: 2007, price: 1200, availability: "In Stock" }
    ],
    general: {
      partType: "Stabilizer rubber / anti-roll bush",
      whatItDoes: "Reduces sway by isolating the stabilizer bar from the chassis.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Nissan models.",
      priceRange: "1200",
      availability: "In Stock"
    },
    specs: {
      material: "Rubber",
      technology: "Durable elastomer compound",
      performance: "Reduces NVH and sway",
      heatToleranceCategory: "Low-Moderate",
      expectedLifespanCategory: "Medium to long",
      installationPosition: "Sway bar / stabilizer link",
      partClass: "Aftermarket",
      finish: "Molded rubber"
    }
  },

  /* 35 */
  {
    id: 35,
    name: "Linkage (Steering Linkage)",
    image: ["../images/linkage.jpg", "../images/linkage 2.jpg"],
    description: "Steering linkage/component to maintain precise wheel alignment and steering feel.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Hilux", years: "2005–2012" },
      { brand: "Isuzu", model: "D-Max", years: "2008–2014" }
    ],
    oem: ["45503-35010", "45520-35010"],
    price: 7800,
    availability: "Low Stock",
    variants: [
      { brand: "Toyota", model: "Hilux", year: 2005, price: 7800, availability: "Low Stock" },
      { brand: "Isuzu", model: "D-Max", year: 2008, price: 7800, availability: "Low Stock" }
    ],
    general: {
      partType: "Steering linkage component",
      whatItDoes: "Connects steering rack to wheel knuckles to retain alignment and steering response.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Isuzu models.",
      priceRange: "7800",
      availability: "Low Stock"
    },
    specs: {
      material: "High-strength steel",
      technology: "Precision-formed linkage",
      performance: "Reliable steering connection",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Steering linkage",
      partClass: "OEM/Aftermarket",
      finish: "Plated / coated"
    }
  },

  /* 36 */
  {
    id: 36,
    name: "Tie Rod End",
    image: ["../images/tie rod end.jpg", "../images/tie rod end 2.jpg"],
    description: "Adjustable tie rod end for secure steering linkage and precise toe settings.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Nissan", model: "Almera", years: "2007–2012" },
      { brand: "Toyota", model: "Yaris", years: "2006–2011" }
    ],
    oem: ["45046-02010", "45046-60010"],
    price: 3400,
    availability: "In Stock",
    variants: [
      { brand: "Nissan", model: "Almera", year: 2007, price: 3400, availability: "In Stock" },
      { brand: "Toyota", model: "Yaris", year: 2006, price: 3400, availability: "In Stock" }
    ],
    general: {
      partType: "Tie rod end",
      whatItDoes: "Provides adjustable connection in the steering linkage for toe alignment.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Nissan and Toyota models.",
      priceRange: "3400",
      availability: "In Stock"
    },
    specs: {
      material: "Forged steel",
      technology: "Adjustable end with threaded section",
      performance: "Precise steering adjustment capability",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Front steering linkage",
      partClass: "Aftermarket/OEM",
      finish: "Plated / greased"
    }
  },

  /* 37 */
  {
    id: 37,
    name: "Tie Rod Socket (Outer Socket)",
    image: ["../images/tie rod socket.jpg", "../images/tie rod socket 2.jpg"],
    description: "Outer tie rod socket for secure connection between steering rack and wheel assembly.",
    category: "Chassis Accessories",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2008–2013" },
      { brand: "Honda", model: "Civic", years: "2006–2011" }
    ],
    oem: ["45503-0V010", "45046-0V010"],
    price: 2200,
    availability: "In Stock",
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2010, price: 9500, availability: "In stock" },
      { brand: "Toyota", model: "Corolla", year: 2011, price: 10000, availability: "In stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 12000, availability: "Low stock" },
      { brand: "Honda", model: "Civic", year: 2015, price: 11500, availability: "Low stock" }
    ],
    general: {
      partType: "Outer tie rod socket",
      whatItDoes: "Secures the connection between steering rack/tie rod and wheel assembly.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models.",
      priceRange: "2200 (base) / variant prices apply",
      availability: "Varies"
    },
    specs: {
      material: "Hardened steel",
      technology: "Precision socket design",
      performance: "Reliable connection under steering loads",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Front steering linkage / outer tie rod",
      partClass: "Aftermarket/OEM",
      finish: "Plated / corrosion-resistant"
    }
  },

  /* 38 */
  {
    id: 38,
    name: "Universal Joint (U-Joint) — additional store items",
    image: "../images/universal joint.jpg",
    description: "(Additional store-only entry harmonized) Robust universal joint for drive shafts.",
    category: "Engine Accessories",
    compatibilities: [
      { brand: "Nissan", model: "Navara", years: [2006,2007,2008] },
      { brand: "Toyota", model: "Hilux", years: [2005,2006] }
    ],
    oem: [],
    price: 5400,
    availability: "In Stock",
    variants: [
      { brand: "Nissan", model: "Navara", year: 2006, price: 5400, availability: "In Stock" },
      { brand: "Toyota", model: "Hilux", year: 2005, price: 5400, availability: "In Stock" }
    ],
    general: {
      partType: "Universal joint (U-joint)",
      whatItDoes: "Transfers torque across angled shafts.",
      category: "Engine Accessories",
      compatibilitySummary: "Store-sourced variants for common truck models.",
      priceRange: "5400",
      availability: "In Stock"
    },
    specs: {
      material: "Hardened steel",
      technology: "Greaseable caps available",
      performance: "Durable torque transfer",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Drive shaft",
      partClass: "Aftermarket",
      finish: "Greased / plated"
    }
  }
];




// carData isnused for the filter pills at the top of the search page

export const carData = [
  {
    brand: "Toyota",
    models: [
      { name: "Corolla", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Camry", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "RAV4", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Highlander", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Yaris", years: [2025, 2024, 2023, 2022, 2021] }
    ]
  },
  {
    brand: "Honda",
    models: [
      { name: "Civic", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Accord", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "CR-V", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Pilot", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "HR-V", years: [2025, 2024, 2023, 2022, 2021] }
    ]
  },
  {
    brand: "Ford",
    models: [
      { name: "Focus", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Fusion", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Escape", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "Explorer", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "F-150", years: [2025, 2024, 2023, 2022, 2021] }
    ]
  },
  {
    brand: "BMW",
    models: [
      { name: "3 Series", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "5 Series", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "X3", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "X5", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "7 Series", years: [2025, 2024, 2023, 2022, 2021] }
    ]
  },
  {
    brand: "Mercedes-Benz",
    models: [
      { name: "C-Class", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "E-Class", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "S-Class", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "GLC", years: [2025, 2024, 2023, 2022, 2021] },
      { name: "GLE", years: [2025, 2024, 2023, 2022, 2021] }
    ]
  }
];