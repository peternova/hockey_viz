# Sources

Where the app's content comes from, and how much each source is trusted.

Each content item in the app has a `sources` list that refers to the IDs below (e.g. `fih-2027`). Anything that's a coaching *opinion*, rather than a rule, is marked "varies by coach" in the app.

## Tier 1: Rules (authoritative)

| ID | Source | Notes |
|---|---|---|
| `fih-2027` | **FIH Rules of Hockey 2027** (in force internationally from 1 Nov 2026). [Rules page](https://www.fih.hockey/about-fih/official-documents/rules-of-hockey) · [PDF](https://www.fih.hockey/static-assets/pdf/02_2026-11-10_fih_rules_of_hockey_2027_clean.pdf) | The main reference. Each national association (Hockey Australia, Hockey NZ) picks its own start date, so **your 2027 club season may still use the 2026 edition**. FIH says this edition changes *no core elements of the game*. |
| `fih-2026` | **FIH Rules of Hockey 2026** (from 1 Mar 2026). [PDF](https://www.fih.hockey/static-assets/pdf/fih-Rules-of-hockey-2026-final.pdf) | Previous edition. Brought in the aerial-ball change: opponents may close in once the receiver has touched the ball (Rule 9.10). |

### Rule facts already checked (used directly in the app)

- **Pitch:** 91.40 m × 55.00 m. The 23 m lines are 22.90 m from each back-line (Rules 1.1, 1.5).
- **Circle:** quarter-circles of 14.63 m radius centred on the goal-posts, joined by a 3.66 m straight line. A dotted line runs 5 m outside it. The penalty spot is 6.475 m from the goal-line (Specs 1.3–1.4).
- **Back-line marks:** 5 m and 10 m from the nearer goal-post. **Side-line marks:** 14.63 m from the back-line (Specs 1.3 f–g).
- **Match:** 4 × 15 min quarters, 2 min breaks between quarters, 10 min half-time. Unlimited rolling subs, made within 3 m of the centre-line (Rules 5.1, 2.3).
- **Centre pass:** may go in any direction. Every other player must be in their own half until the ball is played (Rule 6.4).
- **Ball over the back-line:**
  - Off an attacker: a defensive free hit up to 15 m out.
  - Off a defender, unintentionally: restart **on the 23 m line**, in line with where it crossed (this is the "long corner").
  - Off a defender, intentionally: a **penalty corner** (Rule 7.4).
- **Free hits:**
  - Opponents must be 5 m away. The taker can **self-pass** (Rule 13.2 d).
  - An attacking free hit inside the 23 m area can't go into the circle until it has travelled 5 m or been touched by a defender (13.2 f).
  - Defenders' free hits within 15 m of the back-line are taken up to 15 m out (13.1 b).
- **Penalty corner (Rule 13.3):**
  - The injector stands with at least one foot outside the field, at the mark ≥10 m from the goal-post.
  - Up to **5 defenders, including the GK**, behind the back-line. The other defenders wait beyond the centre-line.
  - Attackers start outside the circle.
  - The ball must leave the circle before a goal can be scored.
  - If the first shot is a **hit**, it must cross the line no higher than **460 mm**. Flicks and drag flicks may go higher if safe.
  - The PC ends when the ball goes **more than 5 m outside the circle** (13.5).
  - New in 2027: the corner should start within about **40 s** of being awarded.
- **Aerial balls (9.10):** stay 5 m away from the receiver until the receiver has touched the ball.
- **Obstruction (9.12):**
  - Don't back into an opponent or shield the ball with your stick or body.
  - "Third-party" (shadow) obstruction means blocking a defender who is trying to reach the ball.
- **Raised balls (9.9):** no intentionally raised hits except shots at goal. A flick or scoop towards an opponent within 5 m counts as dangerous.
- **Cards (Rule 14):** green = 2 min, yellow = 5 or 10 min, red = off for the rest of the match. From 2027, a second card for the same player must be a higher colour.
- **Goalkeeper:** can't play outside their own 23 m area. From 2027, a goalkeeper can be swapped during play at the centre-line substitution area.

## Tier 2: Coaching (governing bodies)

| ID | Source | Used for |
|---|---|---|
| `ha-coaching` | [Hockey Australia coaching (Hockey Ed)](https://www.hockey.org.au/hockey-ed/coaching) · [Coaching & Officiating Framework](https://www.hockey.org.au/news/national-coaching-and-officiating-framework) | AU coaching pathway and terminology |
| `hnz-hub` | [Hockey NZ Coaching Resource Hub](https://hockeynz.co.nz/resources) (free portal with an activity library) | NZ coaching principles and activities |
| `state-hubs` | e.g. [Hockey NSW coaching resource hub](https://www.hockeynsw.com.au/performance/coaching-resource-hub), [Hockey Victoria](https://www.hockeyvictoria.org.au/info-hub/coach-opportunities), [Canterbury Hockey coaching](https://canterburyhockey.org.nz/coaching) | Drills and local practice (some need a login) |
| `fih-academy` | FIH Academy online courses (via fih.hockey) | Phases of play, pressing, transitions |
| `other-na` | England Hockey, USA Field Hockey, KNHB coaching material | Cross-checking tactics and alternative (US/UK) terms |

## Tier 3: Seeing it at elite level

| ID | Source | Used for |
|---|---|---|
| `footage` | FIH Pro League, Olympics and Hockey One matches (Kookaburras, Hockeyroos, Black Sticks) | Real examples of the patterns the app animates. Useful to watch alongside the app. |

## Tier 4: Masters context

| ID | Source | Used for |
|---|---|---|
| `masters` | [Hockey Australia Masters](https://hockey.org.au/news/hockey-australia-masters-announces-strategic-plan-2026-2028), World Masters Hockey, your state masters association | Format and rule variations for masters competitions |

## Tier 5: Coaching knowledge (drafted, needs review)

| ID | Source | Notes |
|---|---|---|
| `coaching-consensus` | Widely taught principles of team play: support angles, cover and balance, channelling, pressing structures, leading and re-leading | Drafted by Claude from general coaching knowledge. **Shows a "draft" badge until you or your coach mark it reviewed.** Team systems differ, so where your coach teaches it differently, the coach is right for your team. |
