export const designerImages = [
  '/assets/designer/Designer.jpeg',
  '/assets/designer/Designer (1).jpeg',
  '/assets/designer/Designer (2).jpeg',
  '/assets/designer/Designer (3).jpeg',
  '/assets/designer/Designer (4).jpeg',
  '/assets/designer/Designer (5).jpeg',
  '/assets/designer/Designer (6).jpeg',
  '/assets/designer/Designer (7).jpeg',
  '/assets/designer/Designer (8).jpeg',
  '/assets/designer/Designer (9).jpeg',
  '/assets/designer/Designer (10).jpeg',
  '/assets/designer/Designer (11).jpeg',
  '/assets/designer/Designer (12).jpeg',
  '/assets/designer/Designer (13).jpeg',
  '/assets/designer/Designer (14).jpeg',
  '/assets/designer/Designer (15).jpeg',
  '/assets/designer/Designer (16).jpeg',
  '/assets/designer/Designer (17).jpeg',
  '/assets/designer/Designer (18).jpeg',
  '/assets/designer/Designer (19).jpeg',
  '/assets/designer/Designer (20).jpeg',
  '/assets/designer/Designer (21).jpeg',
  '/assets/designer/Designer (22).jpeg',
  '/assets/designer/Designer (23).jpeg',
  '/assets/designer/Designer (24).jpeg',
  '/assets/designer/Designer (25).jpeg',
  '/assets/designer/Designer (26).jpeg',
  '/assets/designer/Designer (27).jpeg',
  '/assets/designer/Designer (28).jpeg',
  '/assets/designer/Designer (29).jpeg',
  '/assets/designer/Designer (30).jpeg',
  '/assets/designer/Designer (31).jpeg',
  '/assets/designer/Designer (32).jpeg',
  '/assets/designer/Designer (33).jpeg',
  '/assets/designer/Designer (34).jpeg',
  '/assets/designer/Designer (35).jpeg',
  '/assets/designer/Designer (36).jpeg',
];

// Helper function to get random image
export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * designerImages.length);
  return designerImages[randomIndex];
};

// Alternative approach using dynamic generation
export const getRandomImageAlt = () => {
  const totalImages = 10; // Update this number based on how many images you have
  const randomNum = Math.floor(Math.random() * totalImages);
  
  // If it's the first image (Designer.jpg)
  if (randomNum === 0) {
    return '/assets/designer/Designer.jpg';
  }
  
  // For all other images (Designer (1).jpg, Designer (2).jpg, etc.)
  return `/assets/designer/Designer (${randomNum}).jpg`;
}; 