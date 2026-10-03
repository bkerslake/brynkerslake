# Cognition interview: Suno recommendation feeds

## The story you are telling

This is not primarily a recommendation-algorithm story. It is an ownership story:

> I entered an unfamiliar domain, identified an under-owned product problem, defined a path without a PM or roadmap, learned the technical stack quickly, coordinated specialists, recovered from flawed early approaches, and shipped three measurable production experiences.

By the end, the interviewers should believe that you can take an ambiguous, high-value problem from discovery through production operation—even when the relevant product, data, and technical context is incomplete.

## Recommended 90-second opening

I joined Suno as a full-stack engineering intern. I completed my assigned summer project in the first three weeks, but while using Suno I had noticed a much larger product problem: the recommendation experience was weak, even though improving retention was one of the company’s biggest priorities.

There was a small group working on recommendations, but it was not a conventional product team. There was no dedicated PM, no detailed roadmap, and only a few people responsible for a very large problem. I asked to join them and helped turn that ambiguity into three production homepage feeds: For You, Because You Create, and Creators You May Like.

Over roughly eight weeks, I owned every data pipeline, the rollout, and production health. I implemented most of the backend serving and frontend integration, and I co-designed the architecture, ranking logic, and experiments with an ML scientist and a data scientist.

The strongest results were a 63% lift in feed playtime for Because You Create and a statistically significant 15% lift in net follows from personalized creator recommendations. What I want to focus on is how we got there—especially the places my first approaches failed and what I changed.

## 25-minute pacing and talk track

### Slide 1 — Eight weeks, three feeds (0:00–1:15)

- Deliver the opening above.
- Establish the contrast: intern title versus production ownership.
- Say exactly what you owned; do not imply that you worked alone.
- Preview that you will discuss failures, not only the polished architecture.

Transition: “I’ll start with the result, because these were not small internal prototypes.”

### Slide 2 — Impact upfront (1:15–3:20)

- The feeds became prominent homepage discovery surfaces.
- Suno Web was operating at approximately 1.1M DAU and 7M MAU.
- Because You Create: +63% feed-specific playtime.
- Personalized creators: +15% net follows, marked statistically significant in the launch summary.
- Scope: three live feeds built in parallel across data, ranking, serving, UI, experimentation, and rollout.

Be precise: these are relative lifts versus control. Do not imply they are absolute conversion rates.

Transition: “Those metrics matter because Suno’s product loop is different from conventional streaming.”

### Slide 3 — Creation changes the problem (3:20–5:15)

- Spotify-like products primarily infer taste from consumption.
- Suno also observes what a user tries to create—a high-intent but nuanced taste signal.
- A creation may be private, stylized, new, or missing a standard catalog representation.
- The company goal was retention; the feeds improved leading indicators such as listening and follows.

Do not claim that the internship proved long-term retention causally. Say that the feeds targeted retention and improved leading behaviors.

Transition: “The organizational context was just as important: no one handed us a delivery plan.”

### Slide 4 — Autonomy without a roadmap (5:15–7:00)

- You joined as a full-stack intern.
- You shipped the assigned bot-detection and data-agent work in three weeks.
- You raised the weak recommendation experience as a user-observed problem.
- You asked to join the small, ad hoc recommendations effort.
- You turned broad problems into three parallel, testable product tracks.

Your autonomy was defining and driving the path—not pretending you had no collaborators.

Transition: “Here is the exact division of responsibility.”

### Slide 5 — Ownership and collaboration (7:00–8:30)

Use this wording:

> The ML scientist brought deeper recommendation-science judgment: algorithms, scoring, and metric interpretation. I brought the engineering ownership needed to turn those ideas into a reliable product. I wrote all the data pipelines, implemented most of the serving and UI work, and owned rollout and production health. We co-owned architecture, ranking, and experimentation.

Never say that the ML scientist was “not a good engineer.” Describe complementary strengths. That answer sounds more senior and shows that you can lead specialists.

### Slide 6 — Three user jobs (8:30–10:20)

- For You is a mixture feed: combine multiple signals and degrade gracefully.
- Because You Create is an anchor feed: one visible creation explains the neighbors.
- Creators You May Like is an entity feed: recommend people and optimize for follows.
- The differences affect retrieval, ranking, cold start, safety, assembly, and success metrics.

Transition: “I kept those semantics separate while building a shared production platform underneath them.”

### Slide 7 — Shared recommendation loop (10:20–13:20)

Walk left to right:

1. Collect listening, like, creation, and profile signals.
2. Retrieve a broad candidate pool through similarity, personal sources, and fallbacks.
3. Rerank for relevance, quality, novelty, negative signals, and safety.
4. Assemble each feed with its own slot and hard-floor rules.
5. Precompute results for fast serving, retain online fallback, and attribute actions to the exact recommendation.

Why offline:

- More predictable latency and capacity.
- Expensive retrieval is amortized.
- Results are reproducible and easier to compare in experiments.

Tradeoffs:

- Less freshness.
- More responsibility for expiry, backfills, fallbacks, and serve-time safety checks.

### Slide 8 — Pipeline failure at scale (13:20–15:45)

Tell this candidly:

> I did not have a data-engineering background. My first design was logically correct and passed small tests, but it joined at too broad a grain. At production scale it generated a 23.4-billion-row intermediate, spilled roughly four terabytes, and timed out after four hours.

Recovery:

- Inspect the execution plan and locate the cardinality explosion.
- Make bucket eligibility part of the join key.
- Expand candidates only to feeds that can consume them.
- Verify output equivalence on a bounded cohort before scaling.

Lesson: grain and fan-out are architectural decisions.

### Slide 9 — Silent data-semantic failures (15:45–18:00)

- The fast-moving codebase contained overlapping historical and current-state sources.
- Identity existed in numeric and UUID forms.
- A generated feed was not the same as a stored, served, or impressed feed.
- A wrong but plausible source could produce stale, empty, or incomplete results that looked like a ranking failure.

Your debugging method:

1. Select one affected user.
2. Trace signal → retrieval → ranking → storage → API response → impression.
3. Identify the first broken contract.
4. Add a durable validation or source tag so the failure cannot remain silent.

### Slide 10 — Creation-specific failure (18:00–20:30)

- Original order: sample one strong creation, then check whether it was eligible and had an embedding.
- This zeroed 47.12% of users in the historical eligible cohort.
- Correct order: validate first, then sample.
- The zero-seed rate fell to the true 7.91% floor.

Then explain the product rules:

- Rotate among strong creations rather than always choosing the top hit.
- Keep the explaining anchor visible.
- Permit an owner to see their private or stylized creation.
- Never expose another user’s private work.

Clarify that the percentages are from a historical eligible cohort, not current MAU.

### Slide 11 — Experiment decisions (20:30–22:30)

- Because You Create beat the listening-seeded treatment: +63% feed playtime and +36% feed plays.
- Personalized creators: +15% net follows, +7.9% carousel CTR, +17% profile follows, guardrails flat.
- The earlier listening-seeded homepage shelf validated the format: +18% feed playtime, +5.6% feed plays, +4.2% likes, no other regressions.

Only the creator net-follow launch summary explicitly states statistical significance. Do not apply that claim to every metric.

If asked about For You, say that the offline path shipped after holding or improving engagement while improving reliability and latency, but do not invent a precise lift without the primary readout.

### Slide 12 — Reusable capability (22:30–24:00)

- Configuration made new feed mixes, cohorts, and rollbacks easier.
- Offline results, hard floors, serve-time checks, and online fallback made serving resilient.
- Stable attribution connected recommendations to impressions, plays, follows, and experiments.
- You owned the operational loop through launch and production health.

Prioritization point: you invested in shared contracts without flattening meaningful product differences.

### Slide 13 — Reflection and close (24:00–25:00)

What you would do differently:

- Map source-of-truth, identifiers, grain, and expected fan-out in week one.
- Define exposure, north star, mechanisms, and guardrails before implementation.
- Review real feed outputs before optimizing sophisticated ranking logic.
- Build fallbacks and operational telemetry with the first prototype.

Recommended final line:

> The part I am proudest of is not that I learned recommendation systems quickly. It is that I took an ambiguous, under-owned product problem and built the path from diagnosis to measurable production impact.

Then stop. Do not fill the silence; let them begin Q&A.

## Likely Q&A and strong answer outlines

### 1. What did you personally do versus the rest of the team?

I owned all data pipelines, most backend serving, most frontend implementation, rollout, and production health. I co-owned architecture, retrieval/ranking design, and experimentation. The ML scientist contributed recommendation-science judgment and metric interpretation; a data scientist helped analyze experiments; design supplied UI specifications.

Give one artifact per claim if pressed: a pipeline, serving fallback, UI integration, launch checklist, or health metric.

### 2. Why were you allowed to take on this scope as an intern?

I first established trust by finishing the assigned project in three weeks. I then raised a concrete user and company problem, found the small group already responsible for it, and volunteered for unowned engineering work. Scope expanded because I kept closing loops rather than because someone assigned me a large title.

### 3. Did you originate the project?

The recommendation problem was already recognized, but there was no detailed roadmap or conventional team driving it. I identified the gap independently as a user, asked to join, and helped define and execute the path from broad pain points to three production experiments.

### 4. Why build three feeds in parallel?

They targeted different parts of the same retention loop and shared enough infrastructure to make parallel work efficient. Building the shared candidate, ranking, serving, and measurement contracts once reduced the marginal cost of each feed. I still preserved feed-specific semantics.

### 5. Why precompute recommendations instead of calculating them live?

At Suno’s scale, live similarity retrieval and hydration would make latency and capacity less predictable. Precomputation amortized expensive work and produced reproducible snapshots. We retained online paths for freshness, cold start, and offline misses.

### 6. What are the downsides of offline recommendations?

Staleness, expiry and backfill complexity, and the possibility that privacy or block state changes after generation. We addressed them with grace windows, request-time safety rechecks, hard minimum feed sizes, and online fallback.

### 7. Why not use one ranking algorithm for all three feeds?

The products optimize different entities and behaviors. For You mixes songs from many signals. Because You Create requires an explanatory creation anchor. Creators You May Like ranks people and optimizes for follows. A common pipeline contract is useful; identical semantics would be incorrect.

### 8. How did For You handle cold start?

It used the strongest personal sources available first, including creation and interaction signals. When those were sparse, it degraded to geographically relevant and then global discovery. The order mattered: personal direct signals filled before trending.

### 9. How did creator recommendations work?

We represented both what a user listens to and what they create, then searched a quality-controlled creator corpus. Listening carried more weight, with creation acting as an additional or fallback signal. We excluded self, existing follows, blocks, and unsafe or low-quality candidates before serving.

### 10. Why use rank fusion rather than raw similarity scores?

Signals from different searches or buckets have different numeric scales. Rank fusion combines relative ordering rather than assuming that raw magnitudes are calibrated. Feed-specific weights then express product priorities.

### 11. How did you avoid filter bubbles?

Mix multiple signal sources, retain exploration and trend fallbacks, rotate anchors, penalize recently served items, deduplicate creators, and monitor concentration and repeat rates. The goal is not maximum nearest-neighbor similarity; it is useful discovery over time.

### 12. How did you handle privacy and safety?

At generation time, remove unsafe or ineligible candidates so they do not consume slots. At serve time, recheck mutable state such as privacy, blocks, rights, and deletion. An owner could see their own private creation; another user could not.

### 13. What happened if a pipeline failed?

The last good precomputed result survived through a grace period. If a row was missing, expired, or became too short after current-state filtering, the API used a cached or real-time fallback. An offline failure degraded personalization rather than producing an empty homepage.

### 14. What exactly caused the 23.4B-row query?

I joined candidate data to feed configuration at user grain and applied bucket eligibility afterward. That created combinations a feed could never consume. Moving bucket eligibility into the join key prevented the invalid fan-out while preserving outputs.

### 15. Why did small tests fail to reveal it?

Correctness tests validated content, not cardinality. A bounded cohort did not expose the production multiplication. I changed my validation approach to include expected grain, fan-out estimates, execution-plan inspection, and cost as well as output correctness.

### 16. What was the hardest bug?

The hardest bugs looked like ranking failures but were data-contract failures. A plausible source or identifier could silently return stale or empty candidates. Tracing a single user across every system boundary was more effective than changing model weights.

### 17. Explain the sample-then-validate failure.

We selected one strong creation and only afterward checked whether it had the representation needed for similarity search. One invalid sample erased the entire seed even when other valid creations existed. Filtering first and sampling second reduced zero-seed users from 47.12% to the true 7.91% floor in the historical cohort.

### 18. Why sample among good creations instead of always taking the best one?

Always choosing the top creation makes the shelf repetitive and over-indexes on a single hit. Uniform or controlled rotation among strong, eligible creations preserves quality while creating discovery across a user’s catalog.

### 19. How did you decide what metrics mattered?

I used a hierarchy: one primary outcome, mechanism metrics, quality metrics, guardrails, and engineering health. Plays mattered for song feeds; follows mattered for creators. I also separated experiment assignment from actual shelf and item impressions.

### 20. Can you claim that this improved retention?

I would say it improved leading behaviors tied to retention: listening, playtime, and follows. The company goal was retention, but the internship window and the launch summaries do not support a blanket causal claim about long-term retention. Longer-term return metrics should be evaluated with sufficient duration and power.

### 21. Were all of the results statistically significant?

The creator net-follow result was explicitly marked statistically significant. The other launch summaries describe positive or neutral outcomes but do not include enough statistical detail in the material I brought to make a broader significance claim.

### 22. Why are sample sizes and confidence intervals not in the deck?

The artifacts available for this preparation were launch summaries. Before external circulation I would pull the primary experiment readouts and add baselines, sample sizes, duration, confidence intervals, and exact exposure definitions. I intentionally did not invent them.

### 23. How did you prioritize without a PM?

I prioritized by company objective, user reach, reversibility, and shared leverage. I chose homepage surfaces tied to retention, built common contracts that supported multiple experiments, used staged rollouts and fallbacks to limit risk, and delayed sophistication that did not unblock a product decision.

### 24. How did you influence people without authority?

I made ambiguity concrete: wrote down the product question, surfaced the data and engineering constraints, proposed a bounded test, assigned clear decisions to the people with the strongest expertise, and owned the integration work. Reliable follow-through created influence.

### 25. What disagreement did you have with the ML scientist?

Use a real example if you have one. A safe structure is: the scientist optimized for ranking quality or metric sensitivity; you raised serving, data-quality, or operational constraints; together you designed an experiment or fallback that preserved the product goal without risking reliability. Do not invent a disagreement.

### 26. What would you do differently?

Create a source-of-truth and grain map immediately, define the metric tree and exposure semantics earlier, prototype real feed outputs before sophisticated ranking, and design fallbacks and observability alongside the first implementation.

### 27. What are you most proud of?

Not a particular query or model. You are proud that you turned an under-owned problem into an operated system: product hypotheses, production engineering, experiments, rollout, and measurable user impact.

### 28. What did you learn about leadership?

Leadership was not having every answer. It was defining the decisions, finding the right expertise, making tradeoffs explicit, and continuing to own the result after the code shipped.

### 29. How is this relevant to a deployed engineer role?

The project required discovering the real problem, learning an unfamiliar domain, working across product, data, ML, backend, and UI, making the system observable, navigating an incomplete organization, and staying accountable through production outcomes. That is the operating pattern you want to repeat.

### 30. What would you do next if you had another quarter?

Pull longer-term retention and durable-follow results; improve hourly or event-driven freshness; strengthen low-signal personalization; formalize concentration and novelty metrics; make experiment configuration safer; and turn the ad hoc operating model into a clear ownership and incident process.

## Language to use—and language to avoid

Use:

- “I owned the engineering path; the ML scientist added recommendation-science depth.”
- “There was no dedicated PM or predefined roadmap, so I helped define the path.”
- “My first design was logically correct but operationally unusable.”
- “The experiment improved leading indicators tied to retention.”
- “I do not have the primary readout here, so I would not claim an exact number.”

Avoid:

- “I built everything myself.”
- “The ML scientist was not a good engineer.”
- “The codebase was terrible.” Use “fast-moving,” “messy,” or “had overlapping sources,” then explain your response.
- “We improved retention” unless you have the actual retention result.
- “All metrics were significant.”
- Internal table, repository, service, or configuration names.

## Facts to confirm before the interview

1. Experiment name, duration, and sample size for each result.
2. Control and treatment baseline values—not only relative lift.
3. Confidence intervals or the company’s accepted statistical decision rule.
4. Exact exposure definition: assignment, shelf impression, or item impression.
5. Exact For You experiment outcome and latency/reliability change.
6. Whether the current DAU and MAU figures are approved for external use.
7. Whether the historical 47.12% → 7.91% cohort figures are approved for external use.
8. One real example of a disagreement or difficult prioritization decision with a partner.
9. One concrete production-health metric you personally monitored after launch.
10. The exact internship calendar, so “three weeks” and “next eight weeks” cannot be misread as overlapping or inconsistent.

## Final rehearsal checklist

- Finish the core deck in 23–24 minutes during rehearsal, leaving room for pauses.
- Deliver slides 1–3 without technical jargon.
- Spend the most detail on slides 7–10.
- Use “I” for your decisions and implementation; use “we” for shared scientific and launch decisions.
- State metric caveats before the interviewer has to ask.
- Practice answering the ownership question in under 45 seconds.
- Keep the appendix open and know which backup slide answers each technical question.
- End on the reflection slide; do not advance to the appendix until asked.
