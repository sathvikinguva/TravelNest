export interface Room {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  description: string;
  rating: number;
}

export interface Flight {
  id: string;
  airline: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  date: string;
  icon: string;
}

export const rooms: Room[] = [
  {
    id: "r1",
    title: "Luxury Ocean Villa",
    location: "Maldives",
    price: 450,
    image: "https://images.unsplash.com/photo-1540541338287-41700207eda6?auto=format&fit=crop&w=800&q=80",
    description: "Experience the ultimate luxury in our overwater villas with private pools.",
    rating: 4.9
  },
  {
    id: "r2",
    title: "Mountain Retreat",
    location: "Swiss Alps",
    price: 320,
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
    description: "Cozy cabins tucked away in the heart of the snow-capped mountains.",
    rating: 4.8
  },
  {
    id: "r3",
    title: "Urban Chic Suites",
    location: "Tokyo",
    price: 280,
    image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=80",
    description: "Modern minimalist design meets city convenience in the heart of Shibuya.",
    rating: 4.7
  },
  {
    id: "r4",
    title: "Tuscan Vineyard Estate",
    location: "Italy",
    price: 380,
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
    description: "Historic villa surrounded by rolling hills and world-class vineyards.",
    rating: 4.9
  }
];

export const flights: Flight[] = [
  {
    id: "f1",
    airline: "SkyHigh Air",
    source: "New York (JFK)",
    destination: "London (LHR)",
    departureTime: "10:00 AM",
    arrivalTime: "10:30 PM",
    price: 550,
    date: "2024-05-15",
    icon: "Plane"
  },
  {
    id: "f2",
    airline: "Global Jet",
    source: "Dubai (DXB)",
    destination: "Paris (CDG)",
    departureTime: "02:00 PM",
    arrivalTime: "07:15 PM",
    price: 420,
    date: "2024-05-16",
    icon: "PlaneTakeoff"
  },
  {
    id: "f3",
    airline: "Oceanic Express",
    source: "Sydney (SYD)",
    destination: "Los Angeles (LAX)",
    departureTime: "08:00 PM",
    arrivalTime: "04:30 PM",
    price: 890,
    date: "2024-05-17",
    icon: "PlaneLanding"
  }
];
