export const SITE = {
  name: "AETHER",
  tagline: "Architecture of Consequence",
  description:
    "AETHER is a premium architecture and construction atelier crafting monumental residences, cultural spaces, and urban landmarks with measured precision.",
  url: "https://aether-architecture.com",
  email: "studio@aether-architecture.com",
  phone: "+1 (212) 555-0148",
  address: "120 Mercer Street, New York, NY 10012",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    vimeo: "https://vimeo.com",
  },
} as const;

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#blueprint", label: "Blueprint" },
  { href: "#process", label: "Process" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
] as const;

/**
 * Exactly three optimized 4-second cinematic accents.
 * Scroll pin distance = duration × VIDEO_SCRUB_PPS (adapts to any length).
 */
export const VIDEOS = {
  hero: {
    src: "/videos/hero-drone-4s.mp4",
    poster: "/images/projects/meridian-house.jpg",
    label: "Drone filming modern commercial architecture",
  },
  blueprint: {
    src: "/videos/blueprint-4s.mp4",
    poster: "/images/projects/obsidian-tower.jpg",
    label: "Blueprint transforms into commercial architecture",
  },
  construction: {
    src: "/videos/construction-4s.mp4",
    poster: "/images/materials/steel.jpg",
    label: "Building construction sequence",
  },
} as const;

/** ~1350px of scroll per second of video (within 1200–1500). Pin = duration × this. */
export const VIDEO_SCRUB_PPS = 1350;

export const PROJECTS = [
  {
    id: "meridian-house",
    title: "Meridian House",
    location: "Malibu, CA",
    year: "2025",
    category: "Residence",
    image: "/images/projects/meridian-house.jpg",
    description: "A cliffside residence carved from light, glass, and coastal stone.",
  },
  {
    id: "obsidian-tower",
    title: "Obsidian Tower",
    location: "Manhattan, NY",
    year: "2024",
    category: "Commercial",
    image: "/images/projects/obsidian-tower.jpg",
    description: "Vertical geometry rising through the city grid with quiet force.",
  },
  {
    id: "lumen-atrium",
    title: "Lumen Atrium",
    location: "Copenhagen",
    year: "2025",
    category: "Cultural",
    image: "/images/projects/lumen-atrium.jpg",
    description: "An interior procession of oak, bronze, and filtered northern light.",
  },
  {
    id: "blueprint-villa",
    title: "Blueprint Villa",
    location: "Tuscany",
    year: "2023",
    category: "Residence",
    image: "/images/projects/blueprint-villa.jpg",
    description: "From line drawing to living form — architecture as transformation.",
  },
  {
    id: "chrono-campus",
    title: "Chrono Campus",
    location: "Singapore",
    year: "2024",
    category: "Mixed Use",
    image: "/images/projects/chrono-campus.jpg",
    description: "A campus composed in phases — measured, luminous, enduring.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    id: "discover",
    title: "Discover",
    copy: "Site, brief, and ambition distilled into a clear spatial thesis.",
  },
  {
    id: "compose",
    title: "Compose",
    copy: "Proportion, light, and material sequenced into a buildable language.",
  },
  {
    id: "engineer",
    title: "Engineer",
    copy: "Structure, envelope, and systems resolved with quiet certainty.",
  },
  {
    id: "construct",
    title: "Construct",
    copy: "Craft on site — tolerances held, details protected, pace measured.",
  },
  {
    id: "refine",
    title: "Refine",
    copy: "Finishes, light calibration, and the final choreography of space.",
  },
  {
    id: "deliver",
    title: "Deliver",
    copy: "Handover with documentation, care protocols, and lasting presence.",
  },
] as const;

export const SERVICES = [
  {
    icon: "precision",
    title: "Architecture",
    copy: "Concept through construction documents — spaces composed with cinematic discipline.",
  },
  {
    icon: "craft",
    title: "Interior Design",
    copy: "Material narratives, custom joinery, and atmospheres tuned to daily ritual.",
  },
  {
    icon: "timeline",
    title: "Construction",
    copy: "Design-build delivery with transparent milestones and exacting site craft.",
  },
  {
    icon: "legacy",
    title: "Master Planning",
    copy: "Campuses and ensembles planned for decades of use, not seasons of trend.",
  },
] as const;

export const GALLERY = [
  { src: "/images/gallery/01.jpg", alt: "Concrete volumes in morning light", span: "tall" },
  { src: "/images/gallery/02.jpg", alt: "Living room with filtered daylight", span: "wide" },
  { src: "/images/gallery/03.jpg", alt: "Cliffside residence facade", span: "normal" },
  { src: "/images/gallery/04.jpg", alt: "Pool terrace at dusk", span: "tall" },
  { src: "/images/gallery/05.jpg", alt: "Glass stair detail", span: "normal" },
  { src: "/images/gallery/06.jpg", alt: "Courtyard residence exterior", span: "wide" },
  { src: "/images/gallery/07.jpg", alt: "Office interior with soft light", span: "normal" },
  { src: "/images/gallery/08.jpg", alt: "Apartment living space", span: "tall" },
] as const;

export const MATERIALS = [
  {
    id: "concrete",
    title: "Concrete",
    copy: "Raw mass refined into quiet monumentality.",
    tone: "#8a8680",
    image: "/images/materials/concrete.jpg",
    quality: 94,
  },
  {
    id: "steel",
    title: "Steel",
    copy: "Precision bones for impossible spans.",
    tone: "#9aa3ad",
    image: "/images/materials/steel.jpg",
    quality: 98,
  },
  {
    id: "wood",
    title: "Wood",
    copy: "Warm grain against cool geometry.",
    tone: "#b08968",
    image: "/images/materials/wood.jpg",
    quality: 91,
  },
  {
    id: "glass",
    title: "Glass",
    copy: "Light as structure. Reflection as facade.",
    tone: "#c5d4de",
    image: "/images/materials/glass.jpg",
    quality: 96,
  },
] as const;

/** @deprecated Prefer SERVICES */
export const WHY_US = SERVICES;

export const TESTIMONIALS = [
  {
    quote:
      "AETHER turned our brief into a living composition of space. Every corridor feels intentional.",
    name: "Elena Voss",
    role: "Principal, Voss Holdings",
  },
  {
    quote:
      "The construction process was as refined as the architecture. Zero noise. Absolute clarity.",
    name: "Marcus Hale",
    role: "CEO, Hale Estates",
  },
  {
    quote:
      "They don't decorate buildings. They choreograph light, material, and time.",
    name: "Sofia Ren",
    role: "Curator, Nordic Foundation",
  },
] as const;

export const STATS = [
  { value: 48, suffix: "+", label: "Projects Delivered" },
  { value: 18, suffix: "", label: "Years of Practice" },
  { value: 12, suffix: "", label: "International Awards" },
  { value: 96, suffix: "%", label: "Client Retention" },
] as const;
