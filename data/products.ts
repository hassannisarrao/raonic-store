export const products = [
  {
    id: 1,
    name: "Raonic Quantum",
    slug: "raonic-quantum",
    price: 1499,
    images: ["/quantum-hero.jpg"], 
    description: "Active Hybrid ANC, 40-hour total playtime, and Hi-Res Audio drivers packed into our most comfortable design yet. Switch seamlessly to Adaptive Transparency when you need to hear the world around you.",
    features: [
      "Active Hybrid ANC", 
      "Hi-Res Audio Drivers", 
      "40H Total Playtime", 
      "Adaptive Transparency"
    ],
    category: "earbuds",
    // NEW: Variant Data added here
    variants: [
      { 
        name: "Carbon Black", 
        colorCode: "#1a1a1a", 
        image: "/quantum-hero.jpg" 
      },
      { 
        name: "Lunar Silver", 
        colorCode: "#e3e4e5", 
        // We will use the same image as a placeholder until you add a silver image
        image: "/quantum-hero.jpg" 
      }
    ]
  }
];