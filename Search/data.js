// data.js

export const autoParts = [
  {
    id: 1,
    name: "Brake Disc",
    image: "../images/brake disc.jpg",
    description: "Ventilated front brake disc engineered for reliable stopping power and reduced fade.",
    category: "Chassis Accessories",
    oem: ["43512-02130", "43512-02131"],
    price: 18500,
    availability: "In Stock",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2008–2013" },
      { brand: "Honda", model: "Civic", years: "2006–2011" },
      { brand: "Nissan", model: "Sentra", years: "2007–2012" }
    ],
    keywords: ["brake disc", "rotor", "front disc", "corolla rotor", "civic rotor"],

    general: {
      partType: "Ventilated brake disc",
      whatItDoes: "Provides braking surface for the brake pads; dissipates heat to reduce fade during heavy use.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota, Honda and Nissan models (see full compatibility list).",
      priceRange: "18500",
      availability: "In Stock"
    },

    specs: {
      material: "Cast iron (typical)",            // safe generic
      technology: "Ventilated design for improved cooling",
      performance: "Standard performance (suitable for street use)",
      heatToleranceCategory: "High (ventilated design reduces heat build-up)",
      expectedLifespanCategory: "Long-lasting under normal driving",
      installationPosition: "Front",
      partClass: "OEM/Aftermarket compatible",
      finish: "Machined surface"
    },

    variants: [
      { brand: "Toyota", model: "Camry", year: 2013, price: 7800, availability: "In stock" },
      { brand: "Nissan", model: "Altima", year: 2015, price: 8200, availability: "Low stock" }
    ]
  },

  {
    id: 2,
    name: "Steering Rack",
    image: "../images/steering rack.jpg",
    description: "Precision steering rack assembly for smooth steering response and long service life.",
    category: "Chassis Accessories",
    oem: ["33800-89J01", "78510-42010"],
    price: 52000,
    availability: "Low Stock",
    compatibilities: [
      { brand: "Toyota", model: "Camry", years: "2007–2011" },
      { brand: "Honda", model: "Accord", years: "2008–2012" }
    ],
    keywords: ["steering rack", "rack assembly", "power steering", "camry steering"],

    general: {
      partType: "Steering rack assembly",
      whatItDoes: "Transfers steering input from the steering wheel to the wheels, providing steering control.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models (see full compatibility list).",
      priceRange: "52000",
      availability: "Low Stock"
    },

    specs: {
      material: "Steel housing with sealed internals",
      technology: "Precision gear/rack design",
      performance: "High durability for consistent steering feel",
      heatToleranceCategory: "Moderate (operating environment-rated)",
      expectedLifespanCategory: "Long service life under normal conditions",
      installationPosition: "Front (steering system)",
      partClass: "OEM/Aftermarket compatible",
      finish: "Factory finish / coated to resist corrosion"
    }
  },

  {
    id: 3,
    name: "Shaft Head (Drive Shaft End)",
    image: "../images/shaft heads.jpg",
    description: "High-strength drive shaft head for secure coupling and reduced vibration.",
    category: "Engine Accessories",
    oem: ["39100-4A000", "39100-4A001"],
    price: 14500,
    availability: "In Stock",
    compatibilities: [
      { brand: "Nissan", model: "X-Trail", years: "2010–2015" },
      { brand: "Mitsubishi", model: "Pajero", years: "2006–2011" }
    ],
    keywords: ["shaft head", "drive shaft end", "cv joint", "prop shaft head"],

    general: {
      partType: "Drive shaft coupling/head",
      whatItDoes: "Connects and secures sections of the drive shaft, reducing vibration and maintaining drivetrain alignment.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Nissan and Mitsubishi models (see full compatibility list).",
      priceRange: "14500",
      availability: "In Stock"
    },

    specs: {
      material: "Forged steel (typical)",
      technology: "High-strength forging for reduced vibration",
      performance: "Designed for durability under drive loads",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long-lasting under normal operation",
      installationPosition: "Prop shaft / drive shaft",
      partClass: "Aftermarket / OEM-compatible",
      finish: "Heat-treated / coated"
    }
  },

  {
    id: 4,
    name: "Basket Bearing (Wheel Bearing)",
    image: "../images/basket bearing.jpg",
    description: "Durable wheel bearing (basket style) to ensure smooth wheel rotation and longevity.",
    category: "Chassis Accessories",
    oem: ["90369-46005", "51210-2S000"],
    price: 7200,
    availability: "In Stock",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2003–2008" },
      { brand: "Toyota", model: "Yaris", years: "2006–2011" }
    ],
    keywords: ["bearing", "wheel bearing", "basket bearing", "corolla bearing"],

    general: {
      partType: "Wheel bearing (basket style)",
      whatItDoes: "Supports wheel rotation and reduces friction between wheel hub and axle.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota models (see full compatibility list).",
      priceRange: "7200",
      availability: "In Stock"
    },

    specs: {
      material: "Bearing steel",
      technology: "Sealed bearing construction to keep contaminants out",
      performance: "Reliable, long-service performance",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long under proper maintenance",
      installationPosition: "Wheel hub (front/rear depending on application) — check full compatibility",
      partClass: "OEM/Aftermarket options",
      finish: "Sealed / lubricated"
    }
  },

  {
    id: 5,
    name: "Hub Assembly",
    image: "../images/hub.jpg",
    description: "Complete hub assembly with flange for secure wheel mounting and reliable operation.",
    category: "Chassis Accessories",
    oem: ["42200-0E030", "43430-0E030"],
    price: 12800,
    availability: "In Stock",
    compatibilities: [
      { brand: "Honda", model: "Fit", years: "2007–2013" },
      { brand: "Nissan", model: "Note", years: "2006–2012" }
    ],
    keywords: ["hub", "hub assembly", "wheel hub", "hub bearing"],

    general: {
      partType: "Hub assembly with flange",
      whatItDoes: "Houses the wheel bearing and provides the mounting flange for the wheel.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Honda and Nissan models (see full compatibility list).",
      priceRange: "12800",
      availability: "In Stock"
    },

    specs: {
      material: "Steel assembly with integrated bearing",
      technology: "Complete hub assembly to reduce fitment errors",
      performance: "Standard replacement quality",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long with correct installation",
      installationPosition: "Wheel hub (front/rear varies by vehicle)",
      partClass: "OEM/Aftermarket",
      finish: "Pre-treated / anti-corrosion coating"
    }
  },

  {
    id: 6,
    name: "Brake Pads (Front Set)",
    image: "../images/brake pads.jpg",
    description: "Ceramic front brake pad set delivering quiet operation and long life.",
    category: "Chassis Accessories",
    oem: ["04465-02090", "45022-22040"],
    price: 9800,
    availability: "In Stock",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2008–2013" },
      { brand: "Honda", model: "Civic", years: "2006–2011" },
      { brand: "Nissan", model: "Almera", years: "2007–2012" }
    ],
    keywords: ["brake pads", "front pads", "ceramic pads", "brakes"],

    general: {
      partType: "Front brake pad set",
      whatItDoes: "Provides friction against the brake disc to slow and stop the vehicle; designed for quiet operation.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota, Honda and Nissan models (see full compatibility list).",
      priceRange: "9800",
      availability: "In Stock"
    },

    specs: {
      material: "Ceramic",
      technology: "Low-dust, anti-noise shim",
      performance: "Quiet operation, long life",
      heatToleranceCategory: "Medium-High (road use)",
      expectedLifespanCategory: "Long under normal driving",
      installationPosition: "Front",
      partClass: "Aftermarket / Premium (ceramic)",
      finish: "Coated friction surface"
    }
  },

  {
    id: 7,
    name: "Shock Absorber (Rear)",
    image: "../images/shock.jpg",
    description: "Rear shock absorber tuned for comfort and control on mixed road conditions.",
    category: "Chassis Accessories",
    oem: ["48530-60090", "55310-5A2-A01"],
    price: 16500,
    availability: "In Stock",
    compatibilities: [
      { brand: "Lexus", model: "RX350", years: "2010–2015" },
      { brand: "Toyota", model: "Highlander", years: "2008–2012" }
    ],
    keywords: ["shock absorber", "rear shock", "suspension", "rx350 shock"],

    general: {
      partType: "Rear shock absorber",
      whatItDoes: "Dampens suspension motion to provide ride comfort and control.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Lexus and Toyota models (see full compatibility list).",
      priceRange: "16500",
      availability: "In Stock"
    },

    specs: {
      material: "Steel body with hydraulic internals",
      technology: "Hydraulic damping with valving tuned for comfort",
      performance: "Comfort-oriented damping",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long under normal usage",
      installationPosition: "Rear",
      partClass: "OEM/Aftermarket options",
      finish: "Painted / corrosion-resistant coating"
    }
  },

  {
    id: 8,
    name: "Ball Joint",
    image: "../images/ball joint.jpg",
    description: "Forged ball joint for reliable steering geometry and long-lasting durability.",
    category: "Chassis Accessories",
    oem: ["43330-60020", "51320-1AA0A"],
    price: 7600,
    availability: "Low Stock",
    compatibilities: [
      { brand: "Toyota", model: "Hilux", years: "2005–2011" },
      { brand: "Nissan", model: "Navara", years: "2006–2012" }
    ],
    keywords: ["ball joint", "suspension joint", "steering joint"],

    general: {
      partType: "Ball joint",
      whatItDoes: "Provides a pivot point for steering and suspension components to move while maintaining geometry.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Nissan models (see full compatibility list).",
      priceRange: "7600",
      availability: "Low Stock"
    },

    specs: {
      material: "Forged steel",
      technology: "Sealed joint with grease fitting (where applicable)",
      performance: "Durable steering/suspension component",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long under normal use",
      installationPosition: "Front suspension",
      partClass: "OEM/Aftermarket",
      finish: "Zinc/plated finish"
    }
  },

  {
    id: 9,
    name: "Center Bearing",
    image: "../images/center bearing.jpg",
    description: "Center support bearing for multi-piece drive shafts to reduce vibration and wear.",
    category: "Engine Accessories",
    oem: ["27121-4A000", "27121-3S000"],
    price: 6800,
    availability: "In Stock",
    compatibilities: [
      { brand: "Mitsubishi", model: "L200", years: "2006–2012" },
      { brand: "Isuzu", model: "D-Max", years: "2008–2014" }
    ],
    keywords: ["center bearing", "prop shaft bearing", "drive shaft bearing"],

    general: {
      partType: "Center support bearing",
      whatItDoes: "Supports multi-piece drive shafts and reduces vibration and wear on the drivetrain.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Mitsubishi and Isuzu models (see full compatibility list).",
      priceRange: "6800",
      availability: "In Stock"
    },

    specs: {
      material: "Bearing steel with rubber housing",
      technology: "Integrated rubber insulator to damp vibration",
      performance: "Reliable support under load",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Drive shaft (center support)",
      partClass: "OEM/Aftermarket compatible",
      finish: "Sealed / lubricated"
    }
  },

  {
    id: 10,
    name: "Universal Joint (U-Joint)",
    image: "../images/universal joint.jpg",
    description: "Robust universal joint for reliable torque transfer in drive shafts under load.",
    category: "Engine Accessories",
    oem: ["23100-62010", "27110-2S000"],
    price: 5400,
    availability: "In Stock",
    compatibilities: [
      { brand: "Nissan", model: "Navara", years: "2006–2014" },
      { brand: "Toyota", model: "Hilux", years: "2005–2015" }
    ],
    keywords: ["universal joint", "u-joint", "prop shaft u-joint"],

    general: {
      partType: "Universal joint (U-joint)",
      whatItDoes: "Allows angular misalignment in drive shafts while transferring torque.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Nissan and Toyota models (see full compatibility list).",
      priceRange: "5400",
      availability: "In Stock"
    },

    specs: {
      material: "Hardened steel",
      technology: "Cross-style joint with greaseable caps (where applicable)",
      performance: "Durable torque transfer",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long with proper lubrication",
      installationPosition: "Drive shaft",
      partClass: "OEM/Aftermarket",
      finish: "Greased / plated"
    }
  },

  {
    id: 11,
    name: "Shaft Joint (CV Joint)",
    image: "../images/shaft joint.jpg",
    description: "Constant velocity shaft joint to maintain smooth power transfer at varying angles.",
    category: "Engine Accessories",
    oem: ["44010-0V010", "38320-1AA0A"],
    price: 11200,
    availability: "Low Stock",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2008–2013" },
      { brand: "Honda", model: "Civic", years: "2006–2011" }
    ],
    keywords: ["cv joint", "shaft joint", "constant velocity joint"],

    general: {
      partType: "Constant velocity (CV) joint",
      whatItDoes: "Maintains smooth power transfer to wheels at varying steering angles.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models (see full compatibility list).",
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

  {
    id: 12,
    name: "Shaft Hose (Drive Shaft Dust Boot)",
    image: "../images/shaft hose.jpg",
    description: "Protective dust boot for CV/drive shaft joints — prevents contamination and premature wear.",
    category: "Engine Accessories",
    oem: ["04432-00010", "04433-00020"],
    price: 2400,
    availability: "In Stock",
    compatibilities: [
      { brand: "Honda", model: "CR-V", years: "2007–2012" },
      { brand: "Nissan", model: "X-Trail", years: "2010–2016" }
    ],
    keywords: ["shaft boot", "dust boot", "cv boot", "drive shaft hose"],

    general: {
      partType: "Drive shaft dust boot / CV boot",
      whatItDoes: "Protects CV joints from dirt and moisture to prevent premature wear.",
      category: "Engine Accessories",
      compatibilitySummary: "Compatible with select Honda and Nissan models (see full compatibility list).",
      priceRange: "2400",
      availability: "In Stock"
    },

    specs: {
      material: "Rubber / thermoplastic elastomer",
      technology: "Flexible boot designed to seal joints",
      performance: "Protective sealing to extend joint life",
      heatToleranceCategory: "Low-Moderate",
      expectedLifespanCategory: "Medium to long depending on conditions",
      installationPosition: "CV joint / drive shaft",
      partClass: "Aftermarket",
      finish: "Molded rubber"
    }
  },

  {
    id: 13,
    name: "Arm Bushing",
    image: "../images/arm bushing.jpg",
    description: "Polyurethane control arm bushing for improved handling and reduced play.",
    category: "Chassis Accessories",
    oem: ["48654-60010", "51391-02010"],
    price: 4200,
    availability: "In Stock",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2003–2008" },
      { brand: "Toyota", model: "Matrix", years: "2003–2008" }
    ],
    keywords: ["arm bush", "bushing", "control arm bushing", "polyurethane bushing"],

    general: {
      partType: "Control arm bushing",
      whatItDoes: "Reduces play in suspension links and improves handling precision.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota models (see full compatibility list).",
      priceRange: "4200",
      availability: "In Stock"
    },

    specs: {
      material: "Polyurethane",
      technology: "Improved compound for reduced deflection",
      performance: "Better handling and reduced play vs stock rubber",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Longer than rubber under normal conditions",
      installationPosition: "Control arm (front/rear depending on vehicle)",
      partClass: "Aftermarket / Performance",
      finish: "Molded polyurethane"
    }
  },

  {
    id: 14,
    name: "Control Arm",
    image: "../images/control arm.jpg",
    description: "Stamped steel control arm for dependable suspension geometry and strength.",
    category: "Chassis Accessories",
    oem: ["48068-02130", "48600-49705"],
    price: 15800,
    availability: "In Stock",
    compatibilities: [
      { brand: "Honda", model: "Accord", years: "2008–2012" },
      { brand: "Toyota", model: "Camry", years: "2007–2011" }
    ],
    keywords: ["control arm", "suspension arm", "lower arm"],

    general: {
      partType: "Stamped steel control arm",
      whatItDoes: "Connects chassis to wheel hub and maintains suspension geometry under load.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Honda and Toyota models (see full compatibility list).",
      priceRange: "15800",
      availability: "In Stock"
    },

    specs: {
      material: "Stamped steel",
      technology: "Reinforced stamping for strength",
      performance: "Durable suspension component",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Lower control arm / suspension",
      partClass: "OEM/Aftermarket",
      finish: "E-coated / painted"
    }
  },

  {
    id: 15,
    name: "Stabilizer Rubber (Anti-roll Bush)",
    image: "../images/stabilizer rubber.jpg",
    description: "Rubber stabilizer bush to reduce sway and maintain handling stability.",
    category: "Chassis Accessories",
    oem: ["48815-04010", "48815-0V010"],
    price: 1200,
    availability: "In Stock",
    compatibilities: [
      { brand: "Toyota", model: "RAV4", years: "2006–2012" },
      { brand: "Nissan", model: "Qashqai", years: "2007–2012" }
    ],
    keywords: ["stabilizer bush", "anti roll bush", "sway bar bush"],

    general: {
      partType: "Stabilizer rubber / anti-roll bush",
      whatItDoes: "Reduces sway by isolating the stabilizer bar from the chassis.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Nissan models (see full compatibility list).",
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

  {
    id: 16,
    name: "Linkage (Steering Linkage)",
    image: "../images/linkage.jpg",
    description: "Steering linkage/component to maintain precise wheel alignment and steering feel.",
    category: "Chassis Accessories",
    oem: ["45503-35010", "45520-35010"],
    price: 7800,
    availability: "Low Stock",
    compatibilities: [
      { brand: "Toyota", model: "Hilux", years: "2005–2012" },
      { brand: "Isuzu", model: "D-Max", years: "2008–2014" }
    ],
    keywords: ["linkage", "steering linkage", "tie rod linkage"],

    general: {
      partType: "Steering linkage component",
      whatItDoes: "Connects steering rack to wheel knuckles to retain alignment and steering response.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Isuzu models (see full compatibility list).",
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

  {
    id: 17,
    name: "Tie Rod End",
    image: "../images/tie rod end.jpg",
    description: "Adjustable tie rod end for secure steering linkage and precise toe settings.",
    category: "Chassis Accessories",
    oem: ["45046-02010", "45046-60010"],
    price: 3400,
    availability: "In Stock",
    compatibilities: [
      { brand: "Nissan", model: "Almera", years: "2007–2012" },
      { brand: "Toyota", model: "Yaris", years: "2006–2011" }
    ],
    keywords: ["tie rod end", "tie rod", "steering end"],

    general: {
      partType: "Tie rod end",
      whatItDoes: "Provides adjustable connection in the steering linkage for toe alignment.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Nissan and Toyota models (see full compatibility list).",
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
      partClass: "OEM/Aftermarket",
      finish: "Plated / greased"
    }
  },

  {
    id: 18,
    name: "Tie Rod Socket (Outer Socket)",
    image: "../images/tie rod socket.jpg",
    description: "Outer tie rod socket for secure connection between steering rack and wheel assembly.",
    category: "Chassis Accessories",
    oem: ["45503-0V010", "45046-0V010"],
    price: 2200,
    availability: "In Stock",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: "2008–2013" },
      { brand: "Honda", model: "Civic", years: "2006–2011" }
    ],
    keywords: ["tie rod socket", "outer socket", "tie rod"],

    general: {
      partType: "Outer tie rod socket",
      whatItDoes: "Secures the connection between steering rack/tie rod and wheel assembly.",
      category: "Chassis Accessories",
      compatibilitySummary: "Compatible with select Toyota and Honda models (see full compatibility list).",
      priceRange: "2200",
      availability: "In Stock"
    },

    specs: {
      material: "Hardened steel",
      technology: "Precision socket design",
      performance: "Reliable connection under steering loads",
      heatToleranceCategory: "Moderate",
      expectedLifespanCategory: "Long",
      installationPosition: "Front steering linkage / outer tie rod",
      partClass: "OEM/Aftermarket",
      finish: "Plated / corrosion-resistant"
    },

    variants: [
      { brand: "Toyota", model: "Corolla", year: 2010, price: 9500, availability: "In stock" },
      { brand: "Toyota", model: "Corolla", year: 2011, price: 10000, availability: "In stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 12000, availability: "Low stock" },
      { brand: "Honda", model: "Civic", year: 2015, price: 11500, availability: "Low stock" }
    ]
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