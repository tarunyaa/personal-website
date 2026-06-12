/* ============================================================
   NOTES  —  your daily fast lane.
   This is the ONLY file you touch to post a note.

   To post: copy a block below, paste it at the TOP of the list,
   change the date + text, save, commit, push. Live in ~60s.

   Fields:
     date  (required)  ISO format "YYYY-MM-DD"
     title (optional)  short headline; omit for a pure tidbit
     body  (required)  your note. HTML allowed: <a href>, <em>,
                        <strong>, <code>, <br>. Backtick string,
                        so you can write across multiple lines.
     link  (optional)  { url, label } — a thing you're pointing at

   Newest does NOT have to be first — they're sorted by date.
   ============================================================ */

const NOTES = [
  {
    date: "2026-06-12",
    title: "Starting a notes feed",
    body: `Stealing the best idea from <a href="https://simonwillison.net" target="_blank">Simon Willison</a>: a place to think out loud daily, without the pressure of it becoming an essay. Short thoughts, links, things I'm chewing on. When a few of these circle the same idea, that's when it earns a longer piece.`,
  },
  {
    date: "2026-06-11",
    body: `A note doesn't have to conclude anything. Half the value is just leaving a trail of what I was thinking about, so future-me can see how an idea formed.`,
  },
];
