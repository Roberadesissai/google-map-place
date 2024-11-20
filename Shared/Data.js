const japaneseImages = [
  '/images/Japanese/Dango.png',
  '/images/Japanese/Dorayaki.png',
  '/images/Japanese/Mochi.png',
  '/images/Japanese/Oden.png',
  '/images/Japanese/Onigiri.png',
  '/images/Japanese/Ramen.png',
  '/images/Japanese/Sushi.png',
  '/images/Japanese/Takoyaki.png',
  '/images/Japanese/Tempura.png',
  '/images/Japanese/Tofu.png'
]

const koreanImages = [
  '/images/Korean/Bibimbap.png',
  '/images/Korean/Bulgogi.png',
  '/images/Korean/Hoeddeok.png',
  '/images/Korean/Jjigae.png',
  '/images/Korean/Kimbab.png',
  '/images/Korean/Kimchi.png',
  '/images/Korean/Odeng.png',
  '/images/Korean/Songpyeon.png',
  '/images/Korean/Tteokbokki.png',
  '/images/Korean/Tteokkochi.png'
]

const ethiopianImages = [
  '/images/Ethiopian/doro.png',
  // Add more Ethiopian dish images here as you get them
]

// Get random images once when the file is loaded
const randomJapaneseImage = japaneseImages[Math.floor(Math.random() * japaneseImages.length)]
const randomKoreanImage = koreanImages[Math.floor(Math.random() * koreanImages.length)]
const randomEthiopianImage = ethiopianImages[Math.floor(Math.random() * ethiopianImages.length)]

export const categories = [
  { 
    id: 1, 
    name: 'Indian',
    value: 'indian',
    description: 'Indian cuisine is known for its bold flavors, aromatic spices, and a wide variety of dishes.',
    image: '/images/masala-dosa.png',
    itemCount: 12
  },
  {
    id: 2,
    name: 'Italian',
    value: 'italian',
    description: 'Italian cuisine is known for its simplicity, using fresh ingredients to create delicious and flavorful dishes.',
    image: '/images/pizza.png',
    itemCount: 12
  },
  {
    id: 3,
    name: 'Mexican',
    value: 'mexican',
    description: 'Mexican cuisine is known for its bold flavors, spicy sauces, and a wide variety of dishes.',
    image: '/images/taco.png',
    itemCount: 12
  },
  {
    id: 4,
    name: 'Japanese',
    value: 'japanese',
    description: 'Experience authentic Japanese cuisine with our selection of traditional dishes.',
    image: randomJapaneseImage,
    itemCount: 12
  },
  {
    id: 5,
    name: 'Korean',
    value: 'korean',
    description: 'Discover the rich flavors of Korean cuisine, from street food to traditional dishes.',
    image: randomKoreanImage,
    itemCount: 12
  },
  {
    id: 6,
    name: 'American',
    value: 'american',
    description: 'American cuisine offers a diverse range of comfort foods and classic favorites.',
    image: '/images/hamburger.png',
    itemCount: 12
  },
  {
    id: 7,
    name: 'Chinese',
    value: 'chinese',
    description: 'Chinese cuisine features diverse flavors, cooking methods, and regional specialties.',
    image: '/images/noodles.png',
    itemCount: 12
  },
  {
    id: 8,
    name: 'Ramen',
    value: 'ramen',
    description: 'Japanese ramen features rich broths, fresh noodles, and various toppings.',
    image: '/images/ramen.png',
    itemCount: 12
  },
  {
    id: 9,
    name: 'Ethiopian',
    value: 'ethiopian',
    description: 'Ethiopian cuisine offers unique flavors with traditional injera bread and rich, spiced stews.',
    image: randomEthiopianImage,
    itemCount: 12
  }
]

export const ratings = [
  { id: 2, name: '2 Stars', value: 2, icon: '⭐️⭐️' },
  { id: 3, name: '3 Stars', value: 3, icon: '⭐️⭐️⭐️' },
  { id: 4, name: '4 Stars', value: 4, icon: '⭐️⭐️⭐️⭐️' },
  { id: 5, name: '5 Stars', value: 5, icon: '⭐️⭐️⭐️⭐️⭐️' }
]

export default { categories, ratings }
