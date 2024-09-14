// Function to generate a unique ID for products
export function generateId(): string {
  const timestamp = Date.now().toString(36); // Convert current timestamp to a base 36 string
  const randomString = Math.random().toString(36).substring(2, 12); // Generate a random base 36 string (10 characters long)
  return `prod_${timestamp}_${randomString}`; // Combine 'prod_' prefix, timestamp, and random string
}
