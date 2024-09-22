import {
  IconReceiptOff,
  IconFlame,
  IconCircleDotted,
  IconFileCode,
} from "@tabler/icons-react";
import { IconListCheck, IconUser, IconShoppingCart } from "@tabler/icons-react";

export const HeaderNavList = {
  admin: [
    {
      title: "Admins",
      link: "/admin/admins",
    },
    {
      title: "Pending Cars",
      link: "/admin/cars/pending",
    },
    {
      title: "Users",
      link: "/admin/users",
    },
    {
      title: "Customer",
      link: "/admin/customer",
    },
    {
      title: "Accounts",
      link: "/admin/accounts",
    },
    {
      title: "Random Cars",
      link: "/admin/randomcars",
    },
    {
      title: "Target Cars",
      link: "/admin/targetcars",
    },
  ],
  subAdmin: [
    {
      title: "Users",
      link: "/admin/users",
    },
    {
      title: "Customer",
      link: "/admin/customer",
    },
    {
      title: "Accounts",
      link: "/admin/accounts",
    },
    {
      title: "Random Cars",
      link: "/admin/randomcars",
    },
    {
      title: "Target Cars",
      link: "/admin/targetcars",
    },
  ],
  user: [
    {
      title: "My Account",
      link: "/home",
    },
    {
      title: "My Cars",
      link: "/mycars",
    },
    {
      title: "Auction",
      link: "/auction",
    },
    {
      title: "Marketplace",
      link: "/marketplace",
    },
    {
      title: "My Auctions",
      link: "/myauctions",
    },
  ],
  seller: [
    {
      title: "My Account",
      link: "/home",
    },
    {
      title: "My Cars",
      link: "/mycars",
    },
    {
      title: "Auction",
      link: "/auction",
    },
    {
      title: "Marketplace",
      link: "/marketplace",
    },
    {
      title: "My Auctions",
      link: "/myauctions",
    },
  ],
  trader: [
    {
      title: "My Account",
      link: "/home",
    },
    {
      title: "My Cars",
      link: "/mycars",
    },
    {
      title: "Auction",
      link: "/auction",
    },
    {
      title: "Marketplace",
      link: "/marketplace",
    },
    {
      title: "My Auctions",
      link: "/myauctions",
    },
  ],
  public: [
    {
      title: "Home",
      link: "/#home",
    },
    {
      title: "Marketplace",
      link: "/marketplace",
    },
    {
      title: "Auction",
      link: "/auction",
    },
    {
      title: "How it Works?",
      link: "/#howItWorks",
    },
    {
      title: "Contact Us",
      link: "/#contactUs",
    },
  ],
};

export const categories = [
  {
    label: "Customer Support",
    image:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "User Guides",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Sales Questions",
    image:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
];
export const workCardList = [
  {
    svg: "account.svg",
    title: "Register",
    isSmall: false,
    isOpposite: false,
  },
  {
    svg: "bids.svg",
    title: "Win an auction",
    isSmall: false,
    isOpposite: false,
  },
  {
    svg: "truck.svg",
    title: "We'll handle delivery",
    isSmall: true,
    isOpposite: false,
  },
  {
    svg: "carsearch.svg",
    title: "Find your vehicle",
    isSmall: true,
    isOpposite: true,
  },
  {
    svg: "payment.svg",
    title: "Settle the payment",
    isSmall: false,
    isOpposite: true,
  },
  {
    svg: "garage.svg",
    title: "Enjoy your vehicle",
    isSmall: false,
    isOpposite: true,
  },
];

export const CarAdviceList = [
  {
    img: "/assets/e1.jpg",
    link: {
      url: "#",
      title: "Best affordable electric cars",
    },
  },
  {
    img: "/assets/e2.jpg",
    link: {
      url: "#",
      title: "Best used cars for 3 children seats",
    },
  },
  {
    img: "/assets/e3.jpg",
    link: {
      url: "#",
      title: "Best first cars for new drivers",
    },
  },
];

export const packageModes = {
  "7-DAYS TRIAL (free)": "TRIAL",
  "BASIC ($2,000 / year)": "BASIC",
  "PLUS ($5,000 / 2 years)": "PLUS",
  "ADVANCED ($8,000 / 3 years)": "ADVANCED",
};

export const mockdata = [
  {
    title: "Inventory Selection",
    description:
      "Our vast inventory includes the latest models, high-quality used cars, and everything in between, ensuring you have a wide range of options to choose from.",
    icon: IconListCheck,
  },
  {
    title: "Customer Service",
    description:
      "Our dedicated team is committed to making your car-buying experience enjoyable, hassle-free, and informative.",
    icon: IconUser,
  },
  {
    title: "Trade-In Services",
    description:
      " Looking to upgrade to a newer model? We provide competitive offers for your current vehicle, making it easier to transition to your dream car.",
    icon: IconShoppingCart,
  },
];

export const userRole = ["USER", "ADMIN", "SUBADMIN","SELLER","TRADER"];

export const userStatus = ["PENDING", "DENIED", "APPROVED"];
export const identityType = ["IDCARD", "LICENSE"];
export const carStatus = ["NEW", "LIVE", "ENDED", "PAID"];
export const userCarStatus = ["LIVE", "MARK AS SOLD","PENDING"];
export const driveType = ["Tracțiune Față", "Tracțiune Spate", "Integrală","4x4"];
export const fuelType=["Petrol","Diesel","Electric","Hybrid"];
export const transmission = ["Automat", "Manual"]
export const vehicleType=["Cars","Vans","Caravans","Trailers","Agro","Construction"];
export const driveSide=["RHD","LHD","Center","Other"]
export const carColors = [
  { value: '#EF4444', label: 'Red' },
  { value: '#1E9BE4', label: 'Blue' },
  { value: '#2E2E2E', label: 'Black' },
  { value: '#34D399', label: 'Green' },
  { value: '#6B7280', label: 'Grey' },
  { value: '#C0C0C0', label: 'silver' },
  { value: '#964B00', label: 'brown' },
  { value: '#F5F5DC', label: 'beige' },
  { value: '#FB923C', label: 'Orange' },
  { value: '#FBBF24', label: 'Yellow' },
  { value: '#5B21B6', label: 'Purple' },
  { value: '#878681', label: 'Bare Metal' },
  { value: '#FFF', label: 'Other' }
];
export const signupImageURL =
  "https://images.unsplash.com/photo-1608341089966-92c09e62214f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8NTR8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=1200&q=100";

export const publicRoutes = [
  // public routes that don't require authentication
  "/api/users/register",
  "/api/users/register-account",
  "/api/users/googleAuthenticate",
  "/api/users/authenticate",
  "/api/users/reset",
  /^\/api\/verify\/.*/,
  /^\/api\/cars.*/,
  /^\/api\/marketplace.*/,

];

export const comments = [
  {
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    name: "Jacob Warnhalter",
    title: "10 minutes ago",
    content:
      "If you're looking for a trustworthy car dealership, look no further. Trade Dept delivers on their promises, and their commitment to transparency is refreshing.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
    name: "Alice Johnson",
    title: "1 hour ago",
    content:
      "I had a great experience with Trade Dept. They helped me find the perfect car for my needs. Highly recommended!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=250&q=80",
    name: "Samuel Mitchell",
    title: "2 hours ago",
    content:
      "Trade Dept provided me with excellent customer service and a wide selection of vehicles. I'm extremely satisfied with my purchase.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1617441356293-de82acf3552f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHByb2ZpbGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=250&q=80",
    name: "Emily Anderson",
    title: "3 hours ago",
    content:
      "The team at Trade Dept made the car-buying process stress-free. I found my dream car with their help, and I couldn't be happier!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1hbGUlMjBwcm9maWxlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=250&q=80",
    name: "Michael Turner",
    title: "4 hours ago",
    content:
      "I traded in my old car and upgraded to a newer model with Trade Dept. Their trade-in offer was fair, and the entire process was efficient.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fG1hbGUlMjBwcm9maWxlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=250&q=80",
    name: "Olivia Smith",
    title: "5 hours ago",
    content:
      "Trade Dept offers top-quality vehicles. I purchased a used car from them, and it's been running perfectly since day one. Great service!",
  },
];

export const initialPriceRange = [1000, 500000];

export const initialMileRange = [10000, 8000000];

export const defaultDescription =
  "<h3>Highlights</h3>\
<ul><li><p>Huge specification including Clubsport package</p></li><li><p>Recent PDI (available to view in documents section)</p></li><li><p>Just 4,920 miles from new with two owners</p></li><li><p>Pure white over black leather and Alcantara interior</p></li><li><p>Manual 6-speed gearbox with auto-blip</p></li>\
<li><p>Last serviced in November of 2022</p></li><li><p>HPI clear</p></li><li><p>Accompanied by two keys, book pack, and the history folio</p></li><li><p>Registration 'P2 LEM' not included in sale</p></li><li><p>Guide price (hammer) - £75k - £80k</p></li><li><p>Please refer to the documents section for the history summary, recent PDI done at Barwell Motorsport, rev range report done at RPM Technik, and service booklet scan</p></li></ul>\
<h3>About this specific vehicle</h3>\
<p>This well specified example of Porsche's heroic Cayman GT4 was delivered to its first owner, Mr Field of Redditch, on the 4th of December 2015 via Porsche centre Solihull. It is clear that the owner did not hold back with options when ordering the car, specifying the car with a vast number of options, including the desirable Clubsport package.</p>\
<p>Presenting in Pure White over a black leather interior, the car is complemented by all the options desired by a Porsche enthusiast, much like the two owners of this car. On the exterior, the car is notably fitted with the hugely beneficial Porsche Ceramic Composite Brakes (PCCB) which are fitted behind the gunmetal grey 20-inch wheels and yellow brake callipers.</p>\
<p>Meanwhile, on the interior, the Clubsport package denotes the car with the all-important 918 bucket seats, and roll cage, meaning that coupled with the PCCB brakes, this car is ready for fast road or even track use. Additionally optioned on the interior is the tasteful Chrono pack, 6-point harness, contract red stitching, carbon fibre trim, Alcantara steering wheel, and fire extinguisher.</p>\
<p>In the car's early life, Mr Field would keep it in his car for just two months, before the car passed to its current keeper on the 11th of February 2016. During his ownership, the car has seen three services, and has been loving kept since, playing a regular attendee at Porsche Club Great Britain mini tours and meet-ups.</p>\
<p>Most recently serviced in November of 2022, and having had two brand-new front tyres fitted just last month, this well-specified Cayman GT4 is accompanied by its spare key (of which appears to have never been used), original service book pack, and history folio, is available for viewing by appointment at our showrooms outside of London immediately.</p><p><strong>Tyres</strong></p><p>Front Right: Michelin Pilot Sport Cup 2 - 27/23 - 245/35 R20 - 7mm tread</p>\
<p>Front Left: Michelin Pilot Sport Cup 2 - 11/23 - 245/35 R20 - 7mm tread</p><p>Rear Right: Michelin Pilot Sport Cup 2 - 37/15 - 295/30 R20 - 5mm tread</p><p>Rear Left: Michelin Pilot Sport Cup 2 - 37/15 - 295/30 R20 - 5mm tread</p><p><strong>Rev Range Report</strong></p><p>Within the 'Documents' section of this listing, you will find a recent rev range report, which shows a single over-rev 73 hours into the total 215 operating hours of the engine. It went into 'stage' 4/6 of the over-rev scale, meaning that is it unlikely the engine sustained any damage.</p>\
<h3>Description</h3>\
<p>The Porsche 981 Cayman GT4 has earned rave reviews since its launch, and many named it as one of the best new drivers' cars on the market at the time of launch. Only 50 GT4s were originally destined for the UK and each dealer's limited allocation immediately sold out, demand was far greater than Porsche could have first thought, so ultimately it was decided more would be allocated to the UK.</p><p>Engineered in Weissach, the car has elements of the new GT3 as well as the 918 - making the pedigree of the GT4 unquestionable. The 3.8-litre 6 cylinder mid-engined layout is coupled with rear wheel drive and 6-speed manual transmission, derived from the Cayman GTS. Performance figures are impressive too, with 385 bhp, a top speed of 186 mph and a 0-60 time of just 4.4 seconds.</p>\
<p>A limited-slip differential is fitted as standard and adjustable camber shims are offered to tweak the handling to the drivers' taste. The chassis is what truly makes the GT4 stand out, due in part to the fact that many parts are derived from the fantastic 991 GT3, including the suspension, brakes, and electric steering system. Lap times around the Nürburgring have been incredibly fast, with a time of 7 minutes 40 seconds putting the car on par with the likes of the Audi R8 V10 and Lamborghini Murcielago LP640.</p>\
<p></p>\
<p>*Payment within 3 working days and collection within 7 calendar days</p><p>**The sale of this Cayman GT4 is being facilitated by DK Engineering on behalf of the private owner - the invoice will be from private owner to buyer. However, the owner has agreed to include a self underwritten warranty which will last for 6 months from the point of sale (subject to Ts &amp; Cs). DK Engineering are more than happy to facilitate any questions about the vehicle and can assist with arranging finance on the car.</p>";

export const currencyFormater = (value) => {
  if (value) {
    const formattedPrice = `${Number(value)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    return formattedPrice;
  } else {
    return value;
  }
};

export const fallBackURL = "https://placehold.co/516x240?text=NoCard";
export const fallBackURL600 = "https://placehold.co/600x400?text=NoCard";

export const createFakeBidderProfile = (bidPrice, init) => {
  const firstNames = [
    "Alice",
    "Charlotte",
    "David",
    "Eve",
    "Fiona",
    "George",
    "James",
    "Elizabeth",
    "Barbara",
    "Patricia",
    "Michael",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Brown",
    "Taylor",
    "Lee",
    "Anderson",
    "Williams",
    "Jones",
    "Garcia",
    "Rodriguez",
    "Davis",
  ];

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];

  const fullName = `${randomFirstName} ${randomLastName}`;
  bidPrice = Number(bidPrice) || 0;
  const bidAmount = init ? 0 : 50;
  const fakeBidding = {
    price: bidPrice + bidAmount,
    name: fullName,
  };
  return fakeBidding;
};

export const features = [
  {
    icon: IconReceiptOff,
    title: "Transparent Pricing",
    description:
      "We believe in clear and straightforward pricing. No hidden fees or surprises - what you see is what you get.",
  },
  {
    icon: IconFileCode,
    title: "Competitive Trade-In Options",
    description:
      "Looking to trade in your current vehicle? We offer competitive trade-in values, making it easier to upgrade to your dream car.",
  },
  {
    icon: IconCircleDotted,
    title: "Expert Guidance",
    description:
      "Our experienced team is here to assist you in selecting the right vehicle, explaining features, and addressing any questions or concerns.",
  },
  {
    icon: IconFlame,
    title: "Post-Sale Support",
    description:
      "Our commitment doesn`t end after the sale. We provide exceptional customer service and maintenance services to keep your vehicle in top condition.",
  },
];

export const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Bus', 'Van', 'Bicycle'];