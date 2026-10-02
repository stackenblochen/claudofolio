# Case study 2: New Meeting Experience for a Secure Messenger
H1 "A New Meeting Experience For A Secure Messenger" (Title Case, vs sentence case elsewhere)

## Section sequence
1. HERO au4x3zpyr: transparent + bg image bg-shadow-right-50perc (cover); pad 160/0 xl (lg 120, md 60/60, sm 80/60, xs 60/40)
   - col 12 (lg 11): H1 white, col pad-bottom 60
   - col 9 (lg 10, md 11): cover image meeting-cover-mobile-desktop (radius 12px = .66rem)
   - col 3 (md 4): confidential stamp svg overlapping (neg margins)
2. INTRO 72b83f2cf: pad 40/80: col 8: H6 "Background" + H2 white x2 (lead)
   - row META: 3 cols (3/3/2): H6 label + P value (custom_lnsf8y3bz white 20px): My Role / Team / Timeline
3. INSIGHTS wbnq5m5nc: col 8: H4 dash + "Key user insights" (NOTE H4 here vs H3 in DS case) + P intro
   - 3× row: col 4 illustration (research_0x.png 948x678) + col 4 (lg/md 5) H6/P bold-ish title + P text  (first title is H6, others P with font_sp4frnlyk – inconsistent)
4. FRAMING wg9o68l90: H4 dash + "From Calls to Meetings" + P ; col 10 (md 12) wide diagram image meetings-framing-overview (radius 16, 12 on sm/xs)
5. SOLUTION 4nu4vjn37: H4 "Design solution" ; H5 dash + "1. Instant meetings" ; P ;
   - CHALLENGE/SOLUTION block: P "● Challenges" (white label, bullet #ff4b53) + P ; P "► Solution" (bullet #00ff32) + P
6. SCREENS 5qjpojvj1: col 10 (md 12) stacked: image before-001 + image meetings-new-adhoc (radius 12, shadow 0 0 40px rgba(0,0,0,.5), border 1px #34373d, padding 20) + caption P.custom_spherse1q "Setting up an ad-hoc meeting" ; second col 10: 2 images join-as-guest + caption
7. SUBCHAPTER r4leyykvw: H5 "2. Scheduled meetings" + P + Challenges/Solution
8. SCREENS 6gvps4uf0: image schedule-02 + caption "My Meetings" (color #6b6b7b inline) + image schedule-01 + caption "Scheduling a meeting" (plain P – not caption style!)
9. SUBCHAPTER mrxsihsxw (HIDDEN on sm + xs!): H5 "3. Calling experience" + P + Challenges/Solution + code module iframe call-grid-no-options.html (interactive demo) – mobile users lose this content entirely
10. OUTCOME ao6g6rm2c: transparent (DS case uses #000) H3 dash + "Outcome" ; UL 3 items
11. OTHER PROJECTS y6cs5yjrx: H3 + portfoliogrid (includes current project)
12. FOOTER

## Content
Background: calling experience doesn't meet enterprise/government expectations; Meetings = streamlined flexible solution.
Meta: Role Product Designer; Team 1 PM, 4–6 devs; Timeline 3 months.
Insights: from stakeholder/peer interviews (Sales, CS, Product), segment research, qualitative user interviews.
 - Familiar patterns (Zoom/Meet/Slack baseline) - Temporary vs persistent - Calendar needs
Framing: Calls → Meetings terminology; call = medium, meeting = goal.
1. Instant meetings: start w/o channel; guests w/o account = growth driver. Challenge: invite-guest flow issues (link regen on password change, password not viewable). Solution: no buy-in to rework; designed around constraints; moved to next quarter roadmap.
2. Scheduled: within groups; stay informed w/o overload. Challenge: full calendar too costly. Solution: basic list view; Outlook/Gmail plugin planned.
3. Calling experience: Wire encrypts every video stream...(hidden on mobile); workshop w/ engineers → new approach; interactive call grid demo.
Outcome: insights + areas for improvement; beta phase feedback shaping roadmap; first milestone public launch Nov 2026.
Typos: "acoount", "desig around", "cinsidered", "as effortless as possible", "users actual goal", "helped setting" ; double space "the  main"
Missing: metrics, visuals of research process, final reflection/learnings; outcome is soft (no numbers).
3. Calling experience full text: Once a meeting started, calling experience defines interaction; most visible part → added improvements. Challenge: Wire encrypts every video stream E2E → each device decrypts, max 9 tiles; pagination for >9 hides active speakers. Solution: workshop with engineers → order by speaking activity; active speakers fill 9 tiles, passive listeners in overflow slot, reappear when speaking; removes pagination. "I vibe-coded the following prototype" → iframe call-grid-no-options.html height 800 (no border radius, frameborder 0). Typos: "videostream", "mre than"
Challenge/Solution label markup: <p><span white><span #ff4b53>●</span> Challenges</span></p> / <span #00ff32>►</span> Solution
