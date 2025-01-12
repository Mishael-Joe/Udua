export function addProductToRecentlyViewed(productId: string) {
  // Retrieve the array from localStorage, or initialize it if it's not present
  const recentlyViewed = JSON.parse(
    localStorage.getItem("recentlyViewed") || "[]"
  );

  // Check if the productId is already in the array
  if (!recentlyViewed.includes(productId)) {
    // If the array exceeds 15 items, remove the oldest (first) item
    if (recentlyViewed.length >= 15) {
      recentlyViewed.shift(); // Removes the first item (oldest)
    }

    // Add the new product ID to the array
    recentlyViewed.push(productId);

    // Store the updated array back into localStorage
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }
}
