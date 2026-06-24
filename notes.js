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
    date: "2026-06-24",
    body: `The only difference between investing and gambling is time horizon.`,
  },
  {
    date: "2026-04-23",
    title: "Consume or create?",
    body: `Do humans tend to consume or create? And which is better for us? Back in the pre-device days, I think we mostly created, whether it was art or stories.`,
  },
  {
    date: "2026-04-19",
    title: "The illusion of scarcity",
    body: `My mom has been trying to buy gold in India. She found one design she loved in Salem but didn't buy it, wanting to see more options first since it's an expensive, infrequent purchase. We looked in Singapore, she liked a few, didn't buy. Now we're back in Chennai, nothing clicks, and the Salem design is gone.<br><br>My argument: there are too many stores and too many choices in India, and not all of them are online, so you can't physically see everything. It's an illusion of scarcity. The market is vastly larger than the visible search window, so one design disappearing doesn't mean true scarcity.<br><br>A few models that fit: the secretary problem (optimal stopping under uncertainty), choice overload (more options, less confidence), and satisficing vs maximizing (expensive, symbolic purchases push you to maximize, which means longer delays and more regret). Both can be true at once: the market is objectively abundant, but the experience is subjectively scarce.`,
  },
  {
    date: "2026-04-15",
    title: "A simulator for counterfactual history",
    body: `Does there exist an online simulator that could show what world inequality would look like today given different initial conditions, the ones that led to different political and economic institutions?`,
  },
  {
    date: "2026-06-20",
    title: "Path dependence theory",
    body: `Humans are high-inertia beings because we aren't a hive mind; we need systems to coordinate effort. Civilization is a massive coordination problem, and the economy is the coordination axis.`,
  },
  {
    date: "2026-04-21",
    title: "Agency, Maslow, and judging less harshly",
    body: `Building's place in Maslow's hierarchy of needs. Can differences in human agency across individuals be explained by varying biological and social initial conditions?<br><br>The capacity for agency isn't evenly distributed, because of variance in biology and initial conditions. Whether someone's Maslow needs were met matters: if a life lacks safety or emotional stability, the brain often allocates more energy toward survival and emotional regulation instead of long-term agency and growth. One of the hardest truths is that many highly agentic people became that way partly because they were rewarded early, had stable attachment and supportive environments, and experienced competence young. Chronic stress can genuinely impair a person and psychologically regress them.<br><br>Agency can be defined as the ability to sustain willpower and discipline, but it shows up differently across people. For some it's conventional markers like career or wealth; for others it's emotional resilience, caregiving, and so on. And it can be a different human experience altogether: people experience effort differently, and what feels manageable to one person can feel overwhelming to another.<br><br>So judge less harshly. Everyone is grey, not black and white.`,
  },
  {
    date: "2026-04-13",
    title: "Building for others vs. yourself",
    body: `I've been spending countless sleepless nights building Crux. Back in college, all-nighters were the worst feeling because the cause was external: an exam, a homework deadline. Today I'm staying up because of an inner compulsion to build this out.<br><br>Even though the cause is internal now, it's still mentally strenuous, just in a different way. It's harder to work for yourself. You keep doubting whether this is what you should be doing with your time. When someone else told you what to do with your time, it was a given. Society has normalized working for others; it hasn't normalized working for yourself.`,
  },
  {
    date: "2026-04-05",
    title: "Is building an expression of the soul?",
    body: `Tesla apparently received visions of his inventions, not sketches but fully formed machines he had to bring into existence. Mozart described music arriving to him. Newton poked sticks into his eyeballs because he wanted to know what colors were made of. Kafka wrote through the night compulsively, believing writing was the only authentic expression of his inner life.<br><br>I think building is an expression of the soul when the idea comes from your inner muse. The common thread among these people is that they felt the visions were theirs, and theirs to put into the world. This inner world exists within you, and building externalizes it.<br><br>C&eacute;zanne spent his life trying to paint what he actually <em>saw</em>: not the conventional representation of a mountain, but the raw perceptual experience of looking at one. He failed constantly, by his own account, but the failure was generative because the standard he measured against was his interior truth. Dostoevsky said his novels came from trying to answer questions that tormented him personally; the books weren't entertainment, they were his inner arguments made visible. He needed readers not for validation but as <em>witnesses</em>.<br><br>I think this is what gives life meaning. In one way. Not sure. Newton poking his eyeball is different: there's a difference between meaning and curiosity.<br><br>Self-improvement is a gateway drug into entrepreneurship, because you start seeing life as a system you can optimize. You start to believe that if you don't like something about your life, you can change it. And since the source of most people's problems is money, you stop waiting for a raise and start building something. The ultimate goal is getting paid to be yourself: to solve problems you can't help but solve, to study what you can't pull yourself away from, to eliminate any work that doesn't challenge you creatively.<br><br><em>"There is something special about working on a project of your own. I wouldn't say exactly that you're happier. A better word would be excited, or engaged. You're happy when things are going well, but often they aren't... So why do it at all? Because to the kind of people who like working this way, nothing else feels as right. You feel as if you're an animal in its natural habitat, doing what you were meant to do: not always happy, maybe, but awake and alive."</em><br>(Paul Graham)`,
  },
  {
    date: "2026-06-04",
    title: "Datacenters in space",
    body: `If AI demand is overwhelming enough to exceed incremental terrestrial capacity, then deploy to space. But even then it's expensive; it'll take years of engineering to reach Space-Earth datacenter cost parity. So is the real incentive avoiding regulation? No, even if it costs more, demand might overshoot terrestrial capacity enough to make space datacenters a necessity.`,
  },
  {
    date: "2026-04-09",
    title: "Treasure hunt",
    body: `I would create a global, open-ended treasure hunt. It would unfold across different spaces: cryptic maps hidden in public libraries, puzzles in radio signals, star charts buried underground, historical riddles. Players would have to think about whether the Hanging Gardens of Babylon were ever real, which borders didn't exist in Pangea, what Nikola Tesla would have felt before he died alone and poor despite building a nation's electricity infrastructure, and whether digital twins of humans are actually possible.<br><br>When I was younger I did a competition called World Scholar's Cup, where we argued about whether the value of a charitable action depends on the motive behind it, and whether love potions (if they existed) would be ethical. I want to recreate the feeling of shared adventure and collaboration found in <em>Hunter x Hunter</em> and <em>The 39 Clues</em>. Cicada 3301 is a real-world example: a series of puzzles posted to recruit highly intelligent people skilled in cryptography.<br><br>Although we're becoming a very technologically advanced society, our inner motivations and worldly curiosity haven't evolved. We're still living for our base needs. I want to use this treasure hunt to bring about the cultural renaissance humanity so desperately needs.`,
  },
  {
    date: "2026-05-27",
    title: "National interest as innovation's engine",
    body: `Is national and self-interest the real driving force behind innovation? AGI looks like the next instance: US vs. China. The space race was the prior one, and it stalled almost completely after the fall of the USSR, once there was no rival left to race against.`,
  },
  {
    date: "2026-05-23",
    title: "Starting a notes feed",
    body: `Stealing the best idea from <a href="https://simonwillison.net" target="_blank">Simon Willison</a>: a place to think out loud daily, without the pressure of it becoming an essay. Short thoughts, links, things I'm chewing on. When a few of these circle the same idea, that's when it earns a longer piece.`,
  },
  {
    date: "2026-05-19",
    body: `A note doesn't have to conclude anything. Half the value is just leaving a trail of what I was thinking about, so future-me can see how an idea formed.`,
  },
  {
    date: "2026-05-15",
    body: `Not many people try to understand things from first principles. Understanding systems is the new gold of this age, maybe because the activation energy required is so high.`,
  },
  {
    date: "2026-05-11",
    body: `Multi-agent debate as a new scaling law.`,
  },
  {
    date: "2026-05-07",
    body: `Extractive systems arise because human agency varies; someone can always see farther ahead.<br><br>(In the context of <em>Why Nations Fail</em>.)`,
  },
  {
    date: "2026-05-03",
    title: "Ego detachment",
    body: `Do a lot of successful people simply not have egos? Ego detachment as the thing that lets them reinvent themselves over and over.`,
  },
  {
    date: "2026-04-29",
    title: "Driving dynamics in Chennai",
    body: `I visited Chennai. The roads have minimal rules: no lanes, no signaling before switching, no U-turn conventions. Driving there is a decentralized game where every agent optimizes for their own arrival, their life, and the lives of others. Surprisingly, it works: mostly car damage, not much that's mortality-threatening.<br><br>In the US and other first-world countries there are far more rules aiming at the same effect, minimizing accidents. But is the outcome actually better? How does Chennai's accident rate compare to a similar American city, or to Singapore?<br><br>My hunch is that the demand for more rules is driven by a lower tolerance for car damage, which is often aesthetic or non-functional; it doesn't affect how the car actually works. If so, why did car aesthetics, and the rules protecting them, evolve this way? And why is breaking into cars so much more common in California than in Chennai?`,
  },
  {
    date: "2026-05-25",
    title: "Accept imperfection",
    body: `Accept yourself and other adults as imperfect creatures. Life is unpredictable, and everyone is just trying their best, making decisions under asymmetric information and limited cognitive ability. So you should never analyze another person's actions too much.<br><br>A few things I keep in mind: most adults accept incompleteness, that some meaningful things will simply go undone. Most revisit their priorities periodically and choose tradeoffs consciously. Most are awkward, hold opinions, and sometimes don't verbalize them well. And chronic stress can psychologically regress a person, on top of the fact that agency takes different forms. So don't judge too harshly.`,
  },
  {
    date: "2026-06-19",
    title: "Are chess and go solvable?",
    body: `Are chess and go solvable games, and which games aren't? The technical classification is "solved games," with a hierarchy: ultra-weakly solved (you know the outcome from the start), weakly solved (you know a perfect strategy from the start), and strongly solved (you know the optimal move from every position).<br><br>Chess and go are finite, so in principle they're solvable; there are just so many possible games that we haven't cracked them, not even at the easiest level of knowing whether perfect play ends in a win or a draw. Computers like Stockfish and AlphaZero play far better than any human, but playing well isn't the same as proving the answer. We've fully solved only tiny corners, like chess endgames with a handful of pieces left. And some games can't be solved this way at all: poker has hidden cards and luck, so there's no single perfect move to pin down the way there is in chess or go.`,
  },
  {
    date: "2026-06-18",
    body: `How does writing something change your prefrontal cortex?`,
  },
  {
    date: "2026-05-09",
    title: "Thoughts as clouds",
    body: `View negative thoughts as passing clouds. In Buddhism, thoughts are seen as natural, passing events rather than a reflection of who you are. Observe them like clouds drifting across the sky or leaves floating down a stream: acknowledge their presence, refrain from clinging to them, and let them naturally pass.<br><br>This matters because, from a biological and evolutionary perspective, the brain wasn't optimized for perfect truth or calm or perfectly useful thoughts. It was optimized for survival and prediction under uncertainty. That produces a mind that generates many noisy thoughts that aren't a true reflection of your morality.`,
  },
  {
    date: "2026-06-17",
    title: "Why Indians wear gold",
    body: `Why do Indians, even the grandmas, still wear so much gold? Because in India gold became five things at once, continuously for thousands of years: a store of value, social status, religious symbolism (Lakshmi, auspiciousness, weddings), women's financial security, and an inheritance system. Most societies had gold for some of these; India had all of them at once.<br><br>For older generations especially, jewelry was a decentralized bank: portable savings, emergency insurance, dowry, the one form of wealth a woman personally controlled when banks and states weren't trusted and invasions, famines, and currency instability were within living memory. Gold kept outperforming trust in institutions, so "gold is never wasted" stuck.<br><br>Where did ancient India get it? Some domestic mines (Kolar in the south, river and Himalayan trade), but mostly a massive trade surplus: the world paid India in gold and silver for its spices, textiles, and steel. The Romans literally complained their gold kept draining into India.<br><br>Other places have gold cultures too; it just manifests differently. China buys enormous amounts (wedding gold, Lunar New Year, investment bars), but jade historically outranked gold among elites and the Communist era suppressed overt luxury for decades. Africa has deep traditions (Ghana was literally the "Gold Coast," with Akan royal gold regalia), but it spans thousands of cultures and colonial extraction drained much of the wealth outward instead of letting it pool in households for centuries. In the West and South America, colonization disrupted indigenous systems and wealth later financialized into banks, equities, and real estate, so visible gold faded into fashion. India is unusual because gold became all of these things at once, continuously across almost the whole society, surviving invasions, colonization, partition, and modernization. That's why a middle-class Indian grandmother casually wears amounts that would look extraordinary elsewhere.`,
  },
  {
    date: "2026-06-16",
    title: "Fuck derivates",
    body: `Everything is a derivative play which is why humans are such high inertia beings<br>Systems built upon systems upon systems<br>Systems created to extract value and systems created ontop of that to extract value and systems created ontop of that to extract value which is why removing a layer of system is so hard. At every layer there are humans with incentives to keep that layer because of the fake value it creates.<br>It's an onion peeling exercise.<br>Everybody wants to change the world. But no one wants to try.<br>Next to you build something, ask yourself if it actually creates value or is a derivative play.`,
  },
  {
    date: "2026-06-08",
    title: "Social constructs and societal inertia",
    body: `Social constructionism was needed because human society has too much inertia from its sheer size. Social constructs let a wide range of people agree on the same systems. When there's an economic crisis, nothing actually changed, but the social constructs we use to organize large societies broke. This ties to the idea from <em>Sapiens</em> that humans colonized the world because of their innate ability to tell stories.`,
  },
  {
    date: "2026-04-27",
    title: "Reduce replaying",
    body: `Replaying moments or fantasizing about the future isn't abnormal; it looks like a normal function of the human nervous system. The brain relies on mental simulations to process the social world, driven by the Default Mode Network (DMN), the part that's active when you're not focused on the outside environment.<br><br>Replaying can be the mind's way of resolving unfinished feelings, or of preparing for future social situations. If it gets to be too much, just stop and divert your attention.`,
  },
  {
    date: "2026-06-14",
    title: "Do we feel strangers' suffering?",
    body: `Are we physically incapable of feeling unknown humans' suffering the way we feel that of people we know? Do we treat strangers with the same emotional regard as aliens, a feature of evolution? Why did Eren Yeager choose genocide?`,
  },
  {
    date: "2026-06-12",
    title: "Nation vs. nation, earth vs. aliens",
    body: `How much of our society is constructed around nation vs. nation, and what would it look like under earth vs. alien planets? How decentralized would that latter effort be across nations? Why did we stop sending men to the moon after the fall of the USSR?`,
  },
  {
    date: "2026-05-31",
    title: "Mobility across the strata",
    body: `Mobility does exist within society: there are locks and keys for those who see the systems and how the world around them works, with mobility across the strata. Social media, food, and other incentives sedate most of the population, extracting value through the economy. But I suspect there are people living on a different plane altogether: those in power, making the actual society-level decisions.`,
  },
  {
    date: "2026-04-25",
    title: "Markets aren't a natural force",
    body: `A line from <em>Why Nations Fail</em> that stuck with me: "Economic growth is not just a process of more and better machines, and more and better educated people, but also a transformative and destabilizing process associated with widespread creative destruction."<br><br>Then I read this, <a href="https://minutes.substack.com/p/on-the-garden-against-citrini" target="_blank">on the garden, against Citrini</a>, which made me think: "A Citrini piece this week is a damning example: a kind of Randian genre fiction in which markets are unceasing, rational beings sitting outside human creation and thrust onto us without choice. The fear of mass job displacement is real, but it rests on a flawed premise: that what we sit atop are radical, infallible systems of pure market competition. Capitalism has never been this. Global markets are, at most, a few hundred people coordinating to make difficult trade-offs, organizing trillions in capital and billions of jobs. That is not a natural force thrust onto us."`,
  },
  {
    date: "2026-04-17",
    title: "The statistics I tell myself",
    body: `Becoming an adult has mostly meant inheriting the consequences of my own carelessness: no one left to double-check the stove, the fridge door, the tap, the hair iron, the lock. So I developed new fears, each one a small catastrophe my brain insists is imminent.<br><br>Affirmations don't work on me; telling myself "it'll be fine" feels like a lie my brain has already seen through. But statistics do work. They take the worst-case story in my head and swap it for a number that doesn't care how I feel. Most stove fires never leave the pan. A running tap can't flood a house unless the drain is also blocked. Hair irons shut themselves off. Burglaries have fallen for decades. Roughly 1 in 294 cars is stolen in a year. A day of overeating is water, not fat.<br><br>What I keep noticing: adults don't avoid disaster through superhuman vigilance. We've built environments, habits, and rituals that route around our forgetfulness. The drain is faster than the faucet. The iron has a timer. The door locks when it closes. Carelessness isn't a moral failing; it's the default condition of a creature with finite working memory, and the systems are what make me reliable.<br><br>I am median. The pan is contained. The drain is open. The iron has shut itself off. The door has held. The car is fine. The body resets. That, somehow, works.`,
  },
];
