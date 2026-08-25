// Notes — short engineering write-ups. Each is one src/pages/notes/<slug>.astro file
// rendered through Note.astro, registered here. Adding one = a row here + a file.
// These are mined from real incidents on this project's own build (tasks/lessons.md).

export interface Note {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO yyyy-mm-dd
  readingTime: string;
}

export const notes: Note[] = [
  {
    slug: 'fonts-nobody-saw',
    title: 'The fonts nobody saw',
    summary:
      'For weeks, every visitor to this site rendered in fallback fonts, and every check I had said the fonts were fine. How a curl that returns 200 can lie to you, and what I verify now.',
    date: '2026-07-03',
    readingTime: '4 min',
  },
  {
    slug: 'the-reveal-that-revealed-nothing',
    title: 'The reveal that revealed nothing',
    summary:
      'A scroll animation that hid content instead of showing it, and passed every "it builds" check. The bug was one word. The lesson was about what "verified" has to mean.',
    date: '2026-07-02',
    readingTime: '3 min',
  },
  {
    slug: 'done-means-evidence',
    title: 'Done means evidence',
    summary:
      'A custom 404 that never served, a plan that described a site already shipped, and the habit that catches both: treat "done" as a claim that owes proof from the deployed thing.',
    date: '2026-07-02',
    readingTime: '4 min',
  },
];

export const getNote = (slug: string) => notes.find((n) => n.slug === slug);
