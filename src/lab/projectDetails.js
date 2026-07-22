export const projectDetails = {
  precinct: {
    hasPage: true,
    meta: [
      ['Timeline', 'Two months of weekends'],
      ['Role', 'App design, iOS engineering, data pipeline, landing page'],
      ['Team', 'Solo (friend as client)'],
      ['Tools', 'SwiftUI, MapKit, SQLite, Python'],
    ],
    highlights: [
      { title: 'Why I built it', text: 'A friend was moving to New York and wanted to know the neighborhoods. The data existed but only in datasets and desktop tools, so I built the app version.' },
      { title: 'Finding a precinct', text: '49,000 precincts across four states are stored on the device. An R-tree index narrows your location, then a point-in-polygon test finds your precinct with no network request.' },
      { title: 'Learning iOS', text: 'This was my first iOS app, so almost everything was new: SwiftUI, SQLite, and how to make a lookup across 49,000 precinct shapes feel instant using a spatial index.' },
    ],
    sections: [
      {
        heading: 'Why I built it',
        body: 'A friend of mine was moving to New York and wanted to actually know the neighborhoods he was considering before signing a lease. He makes political maps for a living, so he knew the data existed. It just lived in datasets and desktop tools. I built Precinctly to put it on a phone: it shows the voting history and demographics of the precinct you are standing in.',
      },
      {
        heading: 'The user flow',
        body: 'The app works like a weather app for political data. It opens to a map centered on you, with a bottom sheet already showing your precinct\'s lean. Tapping any other precinct, searching a place, and checking the home screen widget all lead to the same profile: the lean, the presidential trajectory across past elections, who lives there, and income.',
        image: {
          src: '/projects/precinctly/user-flow.png',
          alt: 'User flow chart: onboarding leads to the map, and tapping, searching, or the widget all end at the precinct profile',
          caption: 'Every path ends at the same precinct profile.',
        },
      },
      {
        heading: 'The design system',
        body: 'I kept the design close to standard iOS. Display numbers and headers use New York, Apple\'s serif font, and labels and body text use SF Pro. Almost everything on screen is neutral ink. The one big color is the red to purple to blue scale for partisan lean, plus green and orange for the money comparisons. The widget draws your precinct\'s actual shape in a small chip next to the lean number.',
        image: {
          src: '/projects/precinctly/design-system.png',
          alt: 'Design system board: neutrals, the partisan lean scale, semantic colors, typography, the app icon, and the widget chip',
        },
      },
      {
        heading: 'From his data to a public app',
        body: 'The first version ran on my friend\'s private precinct shapes plus public Census data, which was enough to prove the idea. I could not ship his work files, so he helped me find the public versions of the same shapes and I rebuilt on those. I did all the building solo, with him as the client. I would build for a weekend, show him, and adjust from his feedback. A working version took about a week. The rest of the two months went to UI, speed, and where the data should live, since this was my first app and all of that was new to me. I also designed the app\'s interface myself and built the landing page for it. He was moving in August, so I had a real deadline.',
      },
      {
        heading: 'Making 49,000 precincts fast on a phone',
        body: [
          'Everything is stored on the device, so a lookup never talks to a server. The catch is that finding your precinct means checking your location against 49,000 polygons, and precinct boundaries are detailed shapes with hundreds of corners each. Checking them one by one was too slow for an app that should answer the moment you open it. This was also my first time using SQLite, so I had to learn how a database handles shapes at all.',
          'The fix is a two-step lookup. First, every precinct gets a plain rectangle drawn around its shape. Checking whether a point sits inside a rectangle is nearly free, so an index of those rectangles, called an R-tree, lets the database instantly discard every precinct whose rectangle does not contain you. That cuts 49,000 candidates down to a handful. Second, since rectangles overlap near borders, the app traces the real boundary of each remaining precinct to see which one actually contains your point.',
          'The expensive boundary check ends up running on a few shapes instead of 49,000, so a lookup feels instant. I started with California, New York, Texas, and Massachusetts, the places my friend and I actually spend time. More states mostly means finding public data and paying for it in app size.',
        ],
        image: {
          src: '/projects/precinctly/lookup.png',
          alt: 'Diagram of the precinct lookup: 49,000 bounding boxes narrow to 3 candidates, then one exact boundary test finds your precinct',
          afterParagraph: 1,
        },
      },
      {
        heading: 'Edge cases',
        body: [
          'Search is where the messy inputs show up. An address can sit outside the four covered states, and a GPS fix can land where no precinct exists, so the app checks for both and tells you which states it covers. When precise location is off, iOS only shares a rough location that could land in the wrong precinct, so the app asks for one-time full accuracy and the widget falls back to its cached precinct.',
          'When a precinct has little or no data, the app says so. If only 40 ballots were cast somewhere, it prints "only 40 votes cast" next to the lean, and missing values show a plain dash. A small test suite checks known locations against the bundled database to catch these cases if they ever break again.',
        ],
      },
      {
        heading: 'Getting the Census data right',
        body: [
          'The data pipeline joins election returns with Census voting districts, and the Census surprised me twice. Early on the app ranked one precinct the richest in its area, and it took me a while to learn the Census stops counting household income at $250,000. Around 170 precincts sit at that cap reporting the exact same "$250k+", and there is no separating them.',
          'The second surprise was race. The Census asks about race and Hispanic origin as two separate questions, so the shares overlap and can add up to well over 100 percent, and the columns I have cannot be forced into one clean total. The app calls both out. Income shows as "$250k+" once it hits the cap, and an info box in the profile explains why the race numbers overlap. The widget has been on my home screen since it started working, and I like seeing it update from time to time.',
        ],
      },
      {
        heading: 'What is next',
        body: 'Precinctly is still in progress. This was my first iOS app, and getting it onto the App Store is the next step. More states are on the list after that.',
      },
    ],
  },
  erewhon: {
    hasPage: true,
    meta: [
      ['Timeline', 'July 2026'],
      ['Role', 'Research automation, data design, frontend, maintenance pipeline'],
      ['Team', 'Solo'],
      ['Tools', 'Research agents, JavaScript, Algolia, GitHub Actions'],
    ],
    highlights: [
      { title: 'Recovering the old menu', text: 'Research agents swept press coverage, Wayback Machine snapshots, and recipe pages to recover 100 discontinued smoothies, each backed by its source links.' },
      { title: 'Drawing the ingredients', text: 'Every ingredient gets a flat-color SVG icon with an ink outline, plus a constant wobble inspired by skribbl.io that makes the whole page look hand drawn.' },
      { title: 'Keeping it current', text: 'A pipeline checks the live menu twice a month and opens a pull request with images and ingredients already filled in. I review the pull request and decide whether to merge it.' },
    ],
    sections: [
      {
        heading: 'The menu kept disappearing',
        body: [
          'When friends visit LA for the first time, I take them to Erewhon. It feels like the LA tourist thing to do. At some point I tried to look up old smoothies I had ordered with them, and the pages were just gone. Erewhon rotates limited smoothies out of its menu, and the old pages usually disappear with them.',
          'The history was still scattered across press coverage, archived menus, partner recipes, and copycat posts. I set out to rebuild the full catalog from those public sources, starting from 2022, since older drinks have too little surviving evidence to document properly.',
        ],
      },
      {
        heading: 'Rebuilding it with research agents',
        body: [
          'The task was open-ended internet research. For every smoothie I needed proof it existed, its dates, its collaborator, and its ingredient list. I ran it with Claude subagents that swept press stories, Wayback Machine snapshots, brand recipe pages, and recipe transcriptions, then I synthesized their findings into records.',
          'It burnt millions of tokens because the research was open ended and each subagent worked in its own context. I was on a subscription plan, so the cost was fine. The result was 100 smoothie records backed by 258 source links, with each record keeping its sources attached. The oldest drinks were the hardest, since some only survive in an Instagram post or an article that lists half the ingredients.',
        ],
        image: {
          src: '/projects/erewhon/record-strawberry-glaze.png',
          alt: 'Archive record for the Strawberry Glaze Skin Smoothie, with ingredients and source links',
          caption: 'A finished record with its source links at the bottom of the sheet.',
        },
      },
      {
        heading: 'The ingredients page',
        body: [
          'The archive is a chronological catalog with filters for celebrity collabs, brand collabs, and house drinks, and each smoothie opens into its own sheet. Erewhon publishes full ingredient lists and markets these as health drinks, so I added an ingredients page that indexes every one and counts how often it appears. Banana leads at 67 smoothies.',
          'The visual style took the most iteration. Every ingredient is a flat-color SVG icon with an ink outline. I generated the icons with Claude and reworked the ones that missed. On top of that, the whole page runs a constant wobble where the linework redraws a few times a second, inspired by skribbl.io, a game I grew up playing. The wobble is what makes everything look hand drawn. There are 133 icons covering 163 ingredients, since close variants of an ingredient share an icon.',
        ],
        image: {
          src: '/projects/erewhon/ingredient-cabinet.png',
          alt: 'The ingredient browser, a grid of small wobbly icons with counts of how many smoothies use each one',
          caption: 'The ingredients page on the live site.',
        },
      },
      {
        heading: 'Automating menu updates',
        body: [
          'The deep research only had to happen once, to recover the past. From here on, any smoothie Erewhon releases will show up on their own site when it launches, so keeping the archive current is a much smaller problem than building it was. The scheduled refresh reads the live menu feed instead of repeating the historical search. I built a pipeline that checks the live menu on a schedule, and it ended up being my favorite part of the project.',
          'The menu page itself is an empty shell that loads its products from an Algolia search index, so the pipeline reads the same public feed the browser uses. Each drink it finds gets sorted into skip, still live, relaunch, rename, or new. Erewhon sometimes reuses a product listing for a different edition, so the archive trusts its own slugs over their product IDs. Drinks that fall off the menu are marked discontinued, and nothing gets deleted from the archive.',
        ],
      },
      {
        heading: 'Guardrails',
        body: [
          'A bad automated run could wreck the archive, so the pipeline refuses to ship anything suspicious. It stops if too few smoothies come back, too many look new at once, or one pass would discontinue half the menu. Those patterns usually mean the fetch broke or the site changed, so the pipeline waits for me to look at it.',
          'The expensive steps run last. A headless browser only opens the handful of genuinely new product pages, and a model only sees ingredient text the regex matcher could not handle.',
        ],
      },
      {
        heading: 'Every update is a pull request',
        body: [
          'GitHub Actions runs the refresh on the 1st and 15th. If nothing changed, it stays quiet. If something did, it opens a pull request with the images, ingredients, and status changes filled in, and I decide whether it merges.',
          'The first automated refresh added Tree-Ripe Mango Protein Trifle with 11 ingredients. Ten matched the existing icon set. Granola was the only new one, added with a placeholder icon for me to replace.',
        ],
        image: {
          src: '/projects/erewhon/menu-refresh-pr.png',
          alt: 'GitHub pull request titled Menu refresh from the tonic bar, opened by the automated workflow',
          caption: 'The automated pull request that added Tree-Ripe Mango Protein Trifle and proposed granola as a new ingredient in the archive.',
        },
      },
    ],
  },
  'image-tagger': {
    meta: [
      ['Role', 'Taxonomy design, model integration, Python'],
      ['Team', 'Solo'],
      ['Tools', 'Python, Gemini API, OpenAI API, Discord.py'],
    ],
    highlights: [
      { title: 'Saving the archive', text: 'Twitter made likes private and put the API behind a paywall, so I downloaded my liked posts before losing access. That left me 10,000 saved art references with no usernames or context to search by.' },
      { title: 'Making tags consistent', text: 'Vision models tag every image against a fixed vocabulary of subjects, mediums, palettes, and composition, so labels stay consistent across the whole archive.' },
      { title: 'Searching from memory', text: 'I can search loose phrases like "sunset landscapes with warm colors" and recover images I only half remember.' },
    ],
  },
  tweetfetch: {
    meta: [
      ['Role', 'Bot design, archive parsing, async Python'],
      ['Team', 'Solo'],
      ['Tools', 'Python, Discord.py, AsyncIO'],
    ],
    highlights: [
      { title: 'Parsing the export', text: 'A Twitter data export is one giant JSON file. TweetFetch turns it into a Discord bot I can search by username, date, keyword, or media type.' },
      { title: 'More ways to browse', text: 'A slideshow, collection stats, and a guessing game with timed hints, added after the bot had been running for a while and I wanted more ways to look through the collection.' },
      { title: 'Keeping commands responsive', text: 'Async Python keeps large archives from blocking other commands, so the bot stays quick in a normal channel.' },
    ],
  },
  synth: {
    meta: [
      ['Role', 'Bot development, API integration'],
      ['Team', 'Solo'],
      ['Tools', 'Python, Discord.py, TextSynth API'],
    ],
    highlights: [
      { title: 'Why I built it', text: 'I used TextSynth in a CS class and put it in Discord so my friends could try prompts without touching the API.' },
      { title: 'Comparing models', text: 'The same prompt could go to GPT-3, CodeGen, or FairseqGPT, which made the differences between models easy to see side by side.' },
      { title: 'Tracking real use', text: 'Commands showed remaining credits and server latency, and the bot logged generation counts so I could see how the API behaved in real use.' },
    ],
  },
  'stockx-guess': {
    meta: [
      ['Team', 'Two contributors'],
      ['Tools', 'JavaScript, HTML, CSS'],
    ],
    highlights: [
      { title: 'The game', text: 'You get three sneakers and guess the market price of each one, committing to a number before you see the answer.' },
      { title: 'The data', text: 'Titles, images, and average sale prices parsed from an unofficial StockX source, with missing images and strange prices cleaned up so rounds feel fair.' },
      { title: 'Scoring', text: 'Points scale with how close each guess lands to the average selling price, totaled over three rounds.' },
    ],
  },
  cybercredit: {
    meta: [
      ['Timeline', '24 hours'],
      ['Team', 'Team of three'],
      ['Tools', 'JavaScript, TypeScript, Etherscan API, CyberConnect API'],
    ],
    highlights: [
      { title: 'A 24-hour build', text: 'Built in 24 hours at the Blockchain@Columbia hackathon with a team of three.' },
      { title: 'Wallet-based scoring', text: 'Estimate lending risk from public wallet activity instead of a credit bureau, scoring transaction frequency, token diversity, protocol use, and account age.' },
      { title: 'Making the score legible', text: 'The front end turned Etherscan and CyberConnect data into a wallet profile and credit score that was easy for judges to follow.' },
    ],
  },
};
