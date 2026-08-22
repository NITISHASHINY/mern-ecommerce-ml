// Image service for product images
export const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  if (product.imageUrl) {
    return product.imageUrl;
  }
  // Fallback images based on category
  const fallbackImages = {
    'Electronics': 'https://picsum.photos/seed/electronics/300/300',
    'Clothing': 'https://picsum.photos/seed/clothing/300/300',
    'Books': 'https://picsum.photos/seed/books/300/300',
    'Home & Kitchen': 'https://picsum.photos/seed/home/300/300',
    'Beauty': 'https://picsum.photos/seed/beauty/300/300',
    'Sports': 'https://picsum.photos/seed/sports/300/300',
    'Toys': 'https://picsum.photos/seed/toys/300/300',
    'Automotive': 'https://picsum.photos/seed/auto/300/300'
  };
  return fallbackImages[product.category] || 'https://picsum.photos/seed/default/300/300';
};

export default getProductImage;