export const mockStore = {
  id: "1",
  userID: "1",
  name: "HELLA GOODS",
  description: "Discover our curated collection of premium products that bring flavor, style, and quality to your everyday life. Experience the extraordinary.",
  phoneNumber: "+1 (555) 123-4567",
  street: "123 Design Street",
  city: "Brooklyn",
  state: "NY",
  logoURL: "/logo.png",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockStoreSettings = {
  id: "1",
  storeId: "1",
  templateId: "template1",
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  fontFamily: "Inter",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  twitterUrl: "https://twitter.com",
  showSearchBar: true,
  showFooter: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockProducts = [
  {
    id: "1",
    storeId: "1",
    name: "CRISPY CHILI OIL",
    description: "Deliciously fiery and surprisingly versatile! Bold, aromatic chilies get a savory boost from garlic and shallots, while a hint of soy sauce adds a delightful umami depth.",
    category: "Condiments",
    price: 12.0,
    sku: "CCO001",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [
      {
        id: "1",
        productId: "1",
        url: "/jar-of-crispy-chili-oil-with-red-chili-flakes.jpg",
        altText: "Crispy Chili Oil",
        isPrimary: true,
      }
    ]
  },
  // Add more mock products as needed
]