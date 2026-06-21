export type PhotoOverride = {
  caption?: string; alt?: string; memory?: string; location?: string;
  date?: string; order?: number; featured?: boolean; hidden?: boolean;
};

export const siteContent = {
  // Main wording: replace these values with your family's words.
  dadName: "Papa",
  pageTitle: "For Papa",
  subtitle: "A collection of the moments you made unforgettable.",
  fathersDayDate: "2026-06-21",
  introMessage: "You have been there for every adventure, every lesson, every celebration, and every ordinary day that became a memory. This is a small collection of moments that mean more to us than we probably say.",
  finalLetterTitle: "A letter for you",
  finalLetter: "Thank you for being the steady hand, the patient teacher, and the person who always shows up. Every photograph here holds a story, but the best part of every story has always been sharing it with you.",
  signature: "With all our love",
  closingLine: "Happy Father’s Day, Papa.",
  familyQuote: "The best family stories begin with: ‘Remember when Papa…’",
  qualities: [
    { title: "Always showing up", text: "For the big milestones and the quiet days in between." },
    { title: "Making adventures better", text: "Every trip has a story because you were there." },
    { title: "Giving steady advice", text: "Even when we pretended we did not need it." },
    { title: "Believing in every idea", text: "Especially the strange and ambitious ones." },
    { title: "Turning days into stories", text: "The ordinary never stayed ordinary for long." },
    { title: "Being our constant", text: "A person we know we can always depend on." },
  ],
  // Use IDs printed by `npm run process-photos`; all fields are optional.
  heroPhotoId: "",
  finalPhotoId: "",
  portraitPhotoIds: [] as string[],
  featuredPhotoIds: [] as string[],
  hiddenPhotoIds: [] as string[],
  photoOverrides: {} as Record<string, PhotoOverride>,
  // Folder path key -> edits. Example: "family-trips": { title: "Our Adventures", order: 1 }
  albumOverrides: {} as Record<string, { title?: string; description?: string; order?: number; coverPhotoId?: string }>,
  musicEnabled: false,
  musicSrc: "/music/our-song.mp3",
  noIndex: true,
  easterEggMessage: "You found one more memory: we love you, Papa.",
};
