/**
 * Clean legacy text from note content
 * Removes words like "FAVOURITES" that may have been added in older versions
 */
export const cleanNoteContent = (content: string | null): string => {
  if (!content) return '';
  
  // Remove "FAVOURITES" and variations
  return content
    .replace(/\bFAVOURITES\b/gi, '')
    .replace(/\bFAVORITES\b/gi, '')
    .trim();
};

/**
 * Clean legacy text from note title
 */
export const cleanNoteTitle = (title: string): string => {
  if (!title) return '';
  
  // Remove "FAVOURITES" and variations
  return title
    .replace(/\bFAVOURITES\b/gi, '')
    .replace(/\bFAVORITES\b/gi, '')
    .trim();
};

/**
 * Clean legacy text from tags array
 * Filters out "FAVOURITES" and variations from tags
 */
export const cleanTags = (tags: string[] | null | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return [];
  
  return tags
    .map(tag => tag.trim())
    .filter(tag => {
      const upperTag = tag.toUpperCase();
      return upperTag !== 'FAVOURITES' && upperTag !== 'FAVORITES';
    })
    .filter(Boolean);
};
