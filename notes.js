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
     slug  (optional)  custom permalink id for that day's card. Defaults to
                        "note-<date>"; set a slug for a cleaner shareable URL
                        (e.g. slug: "agent-loops" → reachable at /#agent-loops).
                        Notes sharing a date render together in one dated card.

   Newest does NOT have to be first — they're sorted by date.
   ============================================================ */

const NOTES = [
  {
    date: "2026-06-23",
    title: "Agency, Maslow, and judging less harshly",
    body: `Building's place in Maslow's hierarchy of needs. Can differences in human agency across individuals be explained by varying biological and social initial conditions?<br><br>The capacity for agency isn't evenly distributed, because of variance in biology and initial conditions. Whether someone's Maslow needs were met matters: if a life lacks safety or emotional stability, the brain often allocates more energy toward survival and emotional regulation instead of long-term agency and growth. One of the hardest truths is that many highly agentic people became that way partly because they were rewarded early, had stable attachment and supportive environments, and experienced competence young. Chronic stress can genuinely impair a person and psychologically regress them.<br><br>Agency can be defined as the ability to sustain willpower and discipline, but it shows up differently across people. For some it's conventional markers like career or wealth; for others it's emotional resilience, caregiving, and so on. And it can be a different human experience altogether: people experience effort differently, and what feels manageable to one person can feel overwhelming to another.<br><br>So judge less harshly. Everyone is grey, not black and white.`,
  },
  {
    date: "2026-06-20",
    title: "Datacenters in space",
    body: `If AI demand is overwhelming enough to exceed incremental terrestrial capacity, then deploy to space. But even then it's expensive; it'll take years of engineering to reach Space-Earth datacenter cost parity. So is the real incentive avoiding regulation? No, even if it costs more, demand might overshoot terrestrial capacity enough to make space datacenters a necessity.`,
  },
  {
    date: "2026-06-12",
    title: "Starting a notes feed",
    body: `Stealing the best idea from <a href="https://simonwillison.net" target="_blank">Simon Willison</a>: a place to think out loud daily, without the pressure of it becoming an essay. Short thoughts, links, things I'm chewing on. When a few of these circle the same idea, that's when it earns a longer piece.`,
  },
  {
    date: "2026-06-11",
    body: `A note doesn't have to conclude anything. Half the value is just leaving a trail of what I was thinking about, so future-me can see how an idea formed.`,
  },
  {
    date: "2026-06-05",
    body: `Not many people try to understand things from first principles. Understanding systems is the new gold of this age, maybe because the activation energy required is so high.`,
  },
  {
    date: "2026-06-04",
    body: `Multi-agent debate as a new scaling law.`,
  },
  {
    date: "2026-06-03",
    body: `Extractive systems arise because human agency varies; someone can always see farther ahead.<br><br>(In the context of <em>Why Nations Fail</em>.)`,
  },
  {
    date: "2026-05-27",
    title: "Ego detachment",
    body: `Do a lot of successful people simply not have egos? Ego detachment as the thing that lets them reinvent themselves over and over.<br><br>And: how does writing something change your prefrontal cortex?`,
  },
  {
    date: "2026-05-16",
    title: "Driving dynamics in Chennai",
    body: `I visited Chennai. The roads have minimal rules: no lanes, no signaling before switching, no U-turn conventions. Driving there is a decentralized game where every agent optimizes for their own arrival, their life, and the lives of others. Surprisingly, it works: mostly car damage, not much that's mortality-threatening.<br><br>In the US and other first-world countries there are far more rules aiming at the same effect, minimizing accidents. But is the outcome actually better? How does Chennai's accident rate compare to a similar American city, or to Singapore?<br><br>My hunch is that the demand for more rules is driven by a lower tolerance for car damage, which is often aesthetic or non-functional; it doesn't affect how the car actually works. If so, why did car aesthetics, and the rules protecting them, evolve this way? And why is breaking into cars so much more common in California than in Chennai?`,
  },
  {
    date: "2026-05-05",
    title: "Fuck derivates",
    body: `Everything is a derivative play which is why humans are such high inertia beings<br>Systems built upon systems upon systems<br>Systems created to extract value and systems created ontop of that to extract value and systems created ontop of that to extract value which is why removing a layer of system is so hard. At every layer there are humans with incentives to keep that layer because of the fake value it creates.<br>It's an onion peeling exercise.<br>Everybody wants to change the world. But no one wants to try.<br>Next to you build something, ask yourself if it actually creates value or is a derivative play.`,
  },
  {
    date: "2026-04-24",
    title: "Social constructs and societal inertia",
    body: `Social constructionism was needed because human society has too much inertia from its sheer size. Social constructs let a wide range of people agree on the same systems. When there's an economic crisis, nothing actually changed, but the social constructs we use to organize large societies broke. This ties to the idea from <em>Sapiens</em> that humans colonized the world because of their innate ability to tell stories.<br><br>How much of our society is constructed around nation vs. nation, and what would it look like under earth vs. alien planets? How decentralized would that latter effort be across nations? Why did we stop sending men to the moon after the fall of the USSR?<br><br>Mobility does exist within society: there are locks and keys for those who see the systems and how the world around them works, with mobility across the strata. Social media, food, and other incentives sedate most of the population, extracting value through the economy. But I suspect there are people living on a different plane altogether: those in power, making the actual society-level decisions.<br><br>Economic growth isn't just more and better machines and more and better educated people; it's a transformative, destabilizing process of widespread creative destruction. A Citrini piece this week is a damning example: a kind of Randian genre fiction in which markets are unceasing, rational beings sitting outside human creation and thrust upon us without choice. The fear of mass job displacement is real, but it rests on a flawed premise: that what we sit atop are radical, infallible systems of pure market competition. Capitalism has never been this. Global markets are, at most, a few hundred people coordinating to make difficult trade-offs, organizing trillions in capital and billions of jobs. That is not a natural force thrust onto us.`,
  },
];
