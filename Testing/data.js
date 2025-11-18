// data.js
// Exported autoParts array (18 items) — use: import { autoParts } from './data.js';

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
    keywords: ["brake disc", "rotor", "front disc", "corolla rotor", "civic rotor"]
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
    keywords: ["steering rack", "rack assembly", "power steering", "camry steering"]
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
    keywords: ["shaft head", "drive shaft end", "cv joint", "prop shaft head"]
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
    keywords: ["bearing", "wheel bearing", "basket bearing", "corolla bearing"]
  },

  {
    id: 5,
    name: "Hub Assembly",
    image: "../images/hubs.jpg",
    description: "Complete hub assembly with flange for secure wheel mounting and reliable operation.",
    category: "Chassis Accessories",
    oem: ["42200-0E030", "43430-0E030"],
    price: 12800,
    availability: "In Stock",
    compatibilities: [
      { brand: "Honda", model: "Fit", years: "2007–2013" },
      { brand: "Nissan", model: "Note", years: "2006–2012" }
    ],
    keywords: ["hub", "hub assembly", "wheel hub", "hub bearing"]
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
    keywords: ["brake pads", "front pads", "ceramic pads", "brakes"]
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
    keywords: ["shock absorber", "rear shock", "suspension", "rx350 shock"]
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
    keywords: ["ball joint", "suspension joint", "steering joint"]
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
    keywords: ["center bearing", "prop shaft bearing", "drive shaft bearing"]
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
    keywords: ["universal joint", "u-joint", "prop shaft u-joint"]
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
    keywords: ["cv joint", "shaft joint", "constant velocity joint"]
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
    keywords: ["shaft boot", "dust boot", "cv boot", "drive shaft hose"]
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
    keywords: ["arm bush", "bushing", "control arm bushing", "polyurethane bushing"]
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
    keywords: ["control arm", "suspension arm", "lower arm"]
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
    keywords: ["stabilizer bush", "anti roll bush", "sway bar bush"]
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
    keywords: ["linkage", "steering linkage", "tie rod linkage"]
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
    keywords: ["tie rod end", "tie rod", "steering end"]
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
    keywords: ["tie rod socket", "outer socket", "tie rod"]
  }
];

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