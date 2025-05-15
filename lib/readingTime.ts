export function calculateReadingTime(text: string) {
  const wordsPerMinute = 200; // Vitesse de lecture moyenne
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}
