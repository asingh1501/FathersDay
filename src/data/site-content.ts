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
  featuredPhotoIds: [
    "family-memories-img-5991-e625195f0e",
    "family-memories-img-8439-f4ed6f2386",
    "family-memories-d00917e3-f30b-477d-a756-70fb37efd983-8fa53aac51",
  ],
  hiddenPhotoIds: [] as string[],
  photoOverrides: {
    "family-memories-img-1494-043790c1dc": {
      caption: "Together at a family gathering",
      alt: "Papa holding a small child while family members gather for a group photograph",
    },
    "family-memories-img-5331-b9e076e483": {
      caption: "Our day among the airplanes",
      alt: "Papa and two children posing beside a silver aircraft with shark-mouth nose art",
    },
    "family-memories-img-8317-f22b65cba9": {
      caption: "A Raksha Bandhan moment at home",
      alt: "A child tying a rakhi around Papa’s wrist at the dining table",
    },
    "family-memories-img-1886-d5abd6a3e8": {
      caption: "Taking the wheel at the arcade",
      alt: "Papa watching two children sit inside a colorful arcade truck ride",
    },
    "family-memories-img-5991-e625195f0e": {
      caption: "A foggy day at the Golden Gate",
      alt: "Papa standing with two children at an overlook with the Golden Gate Bridge behind them",
      memory: "Even the fog could not hide how special it felt to explore somewhere new together.",
    },
    "family-memories-img-6110-b0bd3b4c12": {
      caption: "Exploring San Francisco together",
      alt: "Papa posing with two children in front of San Francisco City Hall",
    },
    "family-memories-img-6617-d6d713b2e4": {
      caption: "All aboard for another family adventure",
      alt: "A family selfie taken together while riding in an open-sided red passenger car",
    },
    "family-memories-img-8439-f4ed6f2386": {
      caption: "Proud of every milestone",
      alt: "Papa standing behind two children wearing blue martial arts uniforms and holding new belts",
      memory: "You have always been there at the finish line, proud of every step it took to get there.",
    },
    "family-memories-4aab5f82-bf29-471d-903d-71f194385695-9d4d887555": {
      caption: "Papa in the autumn colors",
      alt: "Papa standing in a wide field surrounded by rows of orange autumn trees",
    },
    "family-memories-d00917e3-f30b-477d-a756-70fb37efd983-8fa53aac51": {
      caption: "A very colorful Holi together",
      alt: "A family selfie after celebrating Holi, with bright colors across everyone’s faces and clothes",
      memory: "The best family days are usually the ones that leave the biggest smiles—and the most color.",
    },
  } as Record<string, PhotoOverride>,
  // Folder path key -> edits. Example: "family-trips": { title: "Our Adventures", order: 1 }
  albumOverrides: {} as Record<string, { title?: string; description?: string; order?: number; coverPhotoId?: string }>,
  musicEnabled: false,
  musicSrc: "/music/our-song.mp3",
  noIndex: true,
  easterEggMessage: "You found one more memory: we love you, Papa.",
};
