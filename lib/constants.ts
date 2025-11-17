export type EventItem = {
  title: string;
  image: string; // path under /public, e.g. '/images/xxx.png'
  date?: string; // ISO or human-friendly
  time?: string; // human-friendly time string
  location?: string;
  category?: 'conference' | 'hackathon' | 'meetup' | 'workshop';
  slug?: string;
  description?: string;
};

export const events: EventItem[] = [
  {
    title: 'React Summit',
    image: '/images/event1.png',
    date: '2026-03-18',
    time: '09:30 AM',
    location: 'Amsterdam, NL',
    category: 'conference',
    slug: 'react-summit-2026',
    description:
      "A large community-driven React conference featuring talks, workshops, and networking focused on the React ecosystem.",
  },
  {
    title: 'JSConf EU',
    image: '/images/event2.png',
    date: '2026-05-07',
    time: '10:00 AM',
    location: 'Berlin, DE',
    category: 'conference',
    slug: 'jsconf-eu-2026',
    description: 'Independent JavaScript conference with community talks from library authors and platform teams.',
  },
  {
    title: 'Node+JS Interactive',
    image: '/images/event3.png',
    date: '2026-06-12',
    time: '01:30 PM',
    location: 'Austin, TX, USA',
    category: 'conference',
    slug: 'nodejs-interactive-2026',
    description: 'Keynotes and hands-on sessions about Node.js, server-side JavaScript and the runtime ecosystem.',
  },
  {
    title: 'HackMIT',
    image: '/images/event4.png',
    date: '2026-01-24',
    time: '06:00 PM',
    location: 'Cambridge, MA, USA',
    category: 'hackathon',
    slug: 'hackmit-2026',
    description: '48-hour student hackathon welcoming teams from around the world to build and ship projects.',
  },
  {
    title: 'DevOpsDays',
    image: '/images/event5.png',
    date: '2026-04-20',
    time: '08:30 AM',
    location: 'Chicago, IL, USA',
    category: 'conference',
    slug: 'devopsdays-chicago-2026',
    description: 'Community conference covering DevOps practices, tooling, and culture with talks and open spaces.',
  },
  {
    title: 'CityTech Meetup',
    image: '/images/event6.png',
    date: '2025-12-10',
    time: '07:00 PM',
    location: 'Local — rotating venues',
    category: 'meetup',
    slug: 'citytech-dec-2025',
    description: 'Monthly meetup for local developers to demo projects, share tips, and meet other engineers.',
  },
];

export default events;
