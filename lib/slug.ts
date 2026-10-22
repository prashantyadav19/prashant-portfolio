// "Neural search and an AI Personal Shopper Agent" → "neural-search-and-an-ai-personal-shopper-agent"
export function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
