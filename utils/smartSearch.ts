export function parseSmartSearch(query: string) {
  if (!query) return { cleanQuery: "", priceLimit: null };

  let text = query.toLowerCase().trim();

  // 1. Synonym Dictionary (Customize these for Raonic's products)
  const synonyms: Record<string, string> = {
    "kicks": "shoes",
    "sneakers": "shoes",
    "ear pods": "earbuds",
    "airpods": "earbuds",
    "tshirt": "shirt",
    "tee": "shirt",
    "shades": "glasses",
    "sunnies": "glasses"
  };

  // Replace synonyms in the text
  Object.keys(synonyms).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    text = text.replace(regex, synonyms[word]);
  });

  // 2. Extract Price Intent (e.g., "under 5000", "< 5000")
  let priceLimit = null;
  const underRegex = /(?:under|below|<|less than)\s*(?:rs\.?|pkr)?\s*(\d+)/i;
  const match = text.match(underRegex);
  
  if (match && match[1]) {
    priceLimit = parseInt(match[1], 10);
    // Remove the price phrase from the text so it doesn't confuse the text search
    text = text.replace(match[0], "").trim(); 
  }

  // 3. Remove Conversational Fluff
  const stopWords = ["show", "me", "with", "a", "an", "the", "for", "in", "some", "looking", "want", "buy"];
  let cleanWords = text.split(" ").filter(word => !stopWords.includes(word));
  
  return {
    cleanQuery: cleanWords.join(" ").trim(),
    priceLimit
  };
}