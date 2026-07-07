/* ============================================================
   IRONLOG SCIENCE CONFIG — data layer, separate from UI
   Update programming rules here without touching app code.
   conf: 'strong' = direct meta-analytic support
         'moderate' = consistent but limited studies
         'est' = reasonable practitioner estimate (Israetel-style)
============================================================ */

/* ---------- Muscle taxonomy ---------- */
const MUSCLES = {
  chest:      {n:"Chest",      subs:{upper:"Upper (clavicular)", mid:"Mid (sternal)", lower:"Lower (costal)"}},
  back:       {n:"Back",       subs:{lats:"Lats", traps:"Traps", rear:"Rear delts", erectors:"Spinal erectors"}},
  shoulders:  {n:"Shoulders",  subs:{front:"Front delts", side:"Side delts"}},
  biceps:     {n:"Biceps",     subs:{long:"Long head (outer)", short:"Short head (inner)", brach:"Brachialis"}},
  triceps:    {n:"Triceps",    subs:{long:"Long head", lateral:"Lateral head", medial:"Medial head"}},
  quads:      {n:"Quads",      subs:{rf:"Rectus femoris", vasti:"Vasti (outer/inner/deep)"}},
  hamstrings: {n:"Hamstrings", subs:{hinge:"Hip-hinge biased", knee:"Knee-flexion biased"}},
  glutes:     {n:"Glutes",     subs:{max:"Gluteus maximus", med:"Gluteus medius"}},
  calves:     {n:"Calves",     subs:{gastroc:"Gastrocnemius", soleus:"Soleus"}},
  core:       {n:"Core",       subs:{rectus:"Rectus abdominis", obliques:"Obliques"}}
};

/* ---------- Weekly volume landmarks (sets/muscle/week) ----------
   MEV = minimum effective, MAV = maximum adaptive, MRV = max recoverable.
   Ranges are estimates per Israetel's framework, scaled in-app by
   training age. Frequency ≥2x/wk per muscle where the split allows
   (Schoenfeld 2016 frequency meta). */
const LANDMARKS = {
  chest:      {mev:10, mav:16, mrv:22, conf:"est"},
  back:       {mev:10, mav:18, mrv:25, conf:"est"},
  shoulders:  {mev:8,  mav:16, mrv:24, conf:"est"},
  biceps:     {mev:8,  mav:14, mrv:20, conf:"est"},
  triceps:    {mev:6,  mav:12, mrv:18, conf:"est"},   // pressing overlap counted separately
  quads:      {mev:8,  mav:14, mrv:18, conf:"est"},
  hamstrings: {mev:6,  mav:12, mrv:16, conf:"est"},
  glutes:     {mev:4,  mav:10, mrv:16, conf:"est"},   // heavy overlap from squats/hinges
  calves:     {mev:8,  mav:14, mrv:20, conf:"est"},
  core:       {mev:4,  mav:10, mrv:16, conf:"est"}
};

/* ---------- Programming rules ---------- */
const RULES = {
  expFactor: {beginner:0.15, intermediate:0.40, advanced:0.60}, // position between MEV and MAV
  priorityBoost: 0.35,           // extra fraction of (MAV-MEV) for priority muscles, capped near MRV
  priorityCap: 0.90,             // fraction of MRV priority volume may not exceed
  mesoWeeks: 5,                  // 4 loading weeks + 1 deload (4–6 wk deload cadence, conf: moderate)
  rirByWeek: [3, 2, 2, 1],       // target RIR per loading week; deload = RIR 4+, half sets (conf: moderate)
  deloadSetFactor: 0.5,
  rotateAfterWeeks: 6,           // suggest rotating non-anchor lifts every 4–8 wks (conf: est)
  minFrequency: 2,               // per-muscle sessions/week target (conf: strong for ≥1x, moderate for 2x>1x at equal volume)
  bigJump: 5, smallJump: 2.5,    // kg load increments (lb: doubled in-app)
  repsInRangeToProgress: true
};

/* ---------- Nutrition parameters ----------
   General fitness education, not medical advice. */
const NUTRITION = {
  activity: {sedentary:1.2, light:1.375, moderate:1.55, high:1.725},
  goalAdj:  {bulk:+0.15, cut:-0.20, recomp:0.00},           // surplus 10–20%, deficit 15–25% (conf: moderate)
  proteinPerKg: {lo:1.6, hi:2.2, default:1.8},              // conf: strong (Morton 2018 meta)
  perMealProteinPerKg: {lo:0.3, hi:0.5},                    // MPS spacing, 3–5 meals (conf: moderate)
  fatFloorPerKg: 0.8,                                       // hormonal health floor 0.5–1 g/kg (conf: moderate)
  meals: 4,
  disclaimer: "General fitness nutrition education, not medical or clinical advice. If you have a medical condition, are unsure of your body-composition data, or have a history of disordered eating, consult a qualified professional."
};

/* ---------- Split structures (muscles trained per day) ----------
   Auto-recommendation favours ≥2x/wk frequency for the available days. */
const SPLITS = {
  fb2:    {label:"Full Body ×2", days:[
            {name:"Full Body A", mus:["quads","chest","back","shoulders","triceps","core"]},
            {name:"Full Body B", mus:["hamstrings","glutes","chest","back","biceps","calves"]}]},
  fb3:    {label:"Full Body ×3", days:[
            {name:"Full Body A", mus:["quads","chest","back","shoulders","triceps"]},
            {name:"Full Body B", mus:["hamstrings","glutes","back","chest","biceps","core"]},
            {name:"Full Body C", mus:["quads","hamstrings","shoulders","back","triceps","biceps","calves"]}]},
  ppl3:   {label:"Push / Pull / Legs", days:[
            {name:"Push", mus:["chest","shoulders","triceps"]},
            {name:"Pull", mus:["back","biceps","core"]},
            {name:"Legs", mus:["quads","hamstrings","glutes","calves"]}]},
  ul4:    {label:"Upper / Lower ×2", days:[
            {name:"Upper A", mus:["chest","back","shoulders","triceps","biceps"]},
            {name:"Lower A", mus:["quads","hamstrings","glutes","calves","core"]},
            {name:"Upper B", mus:["chest","back","shoulders","biceps","triceps"]},
            {name:"Lower B", mus:["quads","hamstrings","glutes","calves","core"]}]},
  pplul5: {label:"PPL + Upper / Lower", days:[
            {name:"Push", mus:["chest","shoulders","triceps"]},
            {name:"Pull", mus:["back","biceps","core"]},
            {name:"Legs", mus:["quads","hamstrings","glutes","calves"]},
            {name:"Upper", mus:["chest","back","shoulders","triceps","biceps"]},
            {name:"Lower", mus:["quads","hamstrings","glutes","calves","core"]}]},
  ppl6:   {label:"PPL ×2", days:[
            {name:"Push A", mus:["chest","shoulders","triceps"]},
            {name:"Pull A", mus:["back","biceps","core"]},
            {name:"Legs A", mus:["quads","hamstrings","glutes","calves"]},
            {name:"Push B", mus:["chest","shoulders","triceps"]},
            {name:"Pull B", mus:["back","biceps","core"]},
            {name:"Legs B", mus:["quads","hamstrings","glutes","calves","core"]}]}
};
// auto pick by available days
const AUTO_SPLIT = {2:"fb2", 3:"fb3", 4:"ul4", 5:"pplul5", 6:"ppl6"};
// user preference mapping: pref -> days -> split (fallback to auto)
const PREF_SPLIT = {
  ppl:  {3:"ppl3", 5:"pplul5", 6:"ppl6"},
  ul:   {4:"ul4", 5:"pplul5"},
  fb:   {2:"fb2", 3:"fb3"}
};
const SPLIT_NOTES = {
  ppl3: "Heads up: PPL over 3 days trains each muscle once a week. Research favours ≥2x/week at equal volume — Full Body ×3 would hit everything 3x. Your call."
};

/* ============================================================
   EXERCISE DATABASE
   m: primary muscle · sub: sub-regions emphasised · sec: secondary movers
   bias: 'stretch' (long-muscle-length tension) | 'short' | 'mid'
   type: 'compound' | 'isolation'
   eq: bb barbell · db dumbbell · cb cable · mc machine · bw bodyweight
============================================================ */
const EX = {
/* ---------------- CHEST ---------------- */
bench:{n:"Barbell Bench Press",m:"chest",sub:["mid"],sec:["triceps","shoulders"],bias:"mid",type:"compound",eq:"bb",reps:[5,10],
  why:"Highest loading potential for the pecs; sternal fibres take most of the tension at a flat angle.",
  cues:["Shoulder blades pinched back and down onto the bench.","Feet planted, slight arch, eyes under bar.","Lower to mid-chest in ~2s.","Press up and slightly back — don't bounce."],
  faults:["Flaring elbows to 90° (shoulder stress).","Cutting range short of the chest.","Hips lifting off the bench."]},
incline_bb:{n:"Incline Barbell Press",m:"chest",sub:["upper"],sec:["shoulders","triceps"],bias:"mid",type:"compound",eq:"bb",reps:[6,10],
  why:"~30° incline shifts tension to the clavicular (upper) fibres.",
  cues:["Bench at 30° — steeper turns it into a shoulder press.","Touch just below the collarbones.","Elbows ~45–60° from torso."],
  faults:["Bench angle too steep.","Bouncing off the chest."]},
incline_db:{n:"Incline DB Press",m:"chest",sub:["upper"],sec:["shoulders","triceps"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"Dumbbells allow a deeper stretch than a bar — long-length tension favours upper-chest growth.",
  cues:["30° bench.","Lower until you feel a deep upper-chest stretch.","Press up and slightly together."],
  faults:["Stopping the descent early.","Turning it into a fly on the way down."]},
dbbench:{n:"Dumbbell Bench Press",m:"chest",sub:["mid"],sec:["triceps","shoulders"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"Greater range of motion than a barbell — more stretch on the pecs at the bottom.",
  cues:["Wrists stacked over elbows.","Lower slowly to a full stretch.","Dumbbells close but not clanging at the top."],
  faults:["Half reps at the bottom.","Shoulders rolling forward."]},
cable_fly:{n:"Cable Fly",m:"chest",sub:["mid"],sec:[],bias:"stretch",type:"isolation",eq:"cb",reps:[10,15],
  why:"Cables keep tension on the pecs at long muscle lengths where machines and dumbbells lose it.",
  cues:["Slight elbow bend, locked through the set.","Open wide to a deep stretch.","Hug a barrel — squeeze at the mid-line."],
  faults:["Bending elbows to press instead of fly.","Rushing the stretch position."]},
pec_deck:{n:"Pec Deck / Machine Fly",m:"chest",sub:["mid"],sec:[],bias:"mid",type:"isolation",eq:"mc",reps:[10,15],
  why:"Stable, easy to push close to failure safely — good volume tool.",
  cues:["Elbows slightly below shoulder height.","Squeeze 1s at the mid-line.","Slow 2–3s return."],
  faults:["Shrugging shoulders up.","Short choppy reps."]},
dips_chest:{n:"Chest Dips",m:"chest",sub:["lower"],sec:["triceps","shoulders"],bias:"stretch",type:"compound",eq:"bw",reps:[6,12],
  why:"Forward-leaning dips load the lower/costal pec fibres at a long length.",
  cues:["Lean torso forward ~30°.","Lower until a stretch across the chest.","Press up without locking harshly."],
  faults:["Staying bolt upright (shifts to triceps).","Shoulders shrugging toward ears."]},
pushup:{n:"Push-Up",m:"chest",sub:["mid"],sec:["triceps","shoulders","core"],bias:"mid",type:"compound",eq:"bw",reps:[8,20],
  why:"Scalable pressing pattern; deficit push-ups add stretch.",
  cues:["One straight line head-to-heels.","Chest to just above the floor.","Elbows ~45°. Elevate feet to progress."],
  faults:["Sagging hips.","Flared elbows.","Partial depth."]},
/* ---------------- BACK ---------------- */
pullup:{n:"Pull-Up",m:"back",sub:["lats"],sec:["biceps","core"],bias:"stretch",type:"compound",eq:"bw",reps:[5,12],
  why:"Loads the lats through a full stretch at the dead hang; king of vertical pulls.",
  cues:["Full dead-hang start.","Drive elbows down, chest to bar.","No kipping; slow negative."],
  faults:["Half reps from the bottom.","Chin-poking instead of chest leading."]},
pulldown:{n:"Lat Pulldown",m:"back",sub:["lats"],sec:["biceps"],bias:"stretch",type:"compound",eq:"mc",reps:[8,12],
  why:"Adjustable-load vertical pull; full stretch at the top drives lat growth.",
  cues:["Chest tall, slight lean back.","Pull elbows down and back to upper chest.","Full stretch at the top every rep."],
  faults:["Rocking the torso for momentum.","Pulling behind the neck."]},
row_bb:{n:"Barbell Row",m:"back",sub:["lats","traps"],sec:["biceps","erectors"],bias:"mid",type:"compound",eq:"bb",reps:[6,10],
  why:"Heavy horizontal pull hitting lats and mid-back together with high loading.",
  cues:["Hinge to ~45°, flat back.","Pull to the lower ribs.","Squeeze shoulder blades 1s."],
  faults:["Standing up as reps get hard.","Yanking with the arms only."]},
row_cable:{n:"Seated Cable Row",m:"back",sub:["traps","lats"],sec:["biceps","rear"],bias:"short",type:"compound",eq:"cb",reps:[8,12],
  why:"Constant tension with a hard mid-back squeeze at peak contraction.",
  cues:["Chest up, pull to the sternum.","Drive elbows back, squeeze blades together.","Let the weight stretch you forward under control."],
  faults:["Rounding into a slouch.","Leaning back excessively."]},
dbrow:{n:"One-Arm DB Row",m:"back",sub:["lats"],sec:["biceps"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"Unilateral row with a long stretch at the bottom and big range of motion.",
  cues:["Hand and knee braced on bench.","Pull to the hip, not the shoulder.","Full stretch at the bottom, no rotation."],
  faults:["Twisting the torso to heave.","Short pumping reps."]},
pullover_cb:{n:"Cable Pullover",m:"back",sub:["lats"],sec:[],bias:"stretch",type:"isolation",eq:"cb",reps:[10,15],
  why:"Isolates the lats in their most stretched position — no biceps involvement.",
  cues:["Hinge slightly, arms nearly straight.","Sweep from overhead-stretch down to the hips.","Feel the lats, not the arms."],
  faults:["Bending elbows into a pushdown.","Cutting the overhead stretch short."]},
shrug_db:{n:"Dumbbell Shrug",m:"back",sub:["traps"],sec:[],bias:"short",type:"isolation",eq:"db",reps:[10,15],
  why:"Direct upper-trap work at peak contraction.",
  cues:["Straight arms — shrug straight up.","Pause 1s at the top.","Slow 2s descent."],
  faults:["Rolling the shoulders.","Using bounce from the knees."]},
facepull:{n:"Face Pull",m:"back",sub:["rear","traps"],sec:[],bias:"short",type:"isolation",eq:"cb",reps:[12,20],
  why:"Trains rear delts and mid-traps; balances all your pressing and protects shoulders.",
  cues:["Rope at face height.","Pull toward the eyes, split the rope.","Finish in a double-biceps position."],
  faults:["Turning it into a row.","Going too heavy to hold the end position."]},
reverse_fly:{n:"Reverse DB Fly",m:"back",sub:["rear"],sec:[],bias:"mid",type:"isolation",eq:"db",reps:[12,20],
  why:"Direct rear-delt isolation — a chronically undertrained muscle.",
  cues:["Hinge over, slight elbow bend.","Sweep out and back, thumbs slightly down.","Control the negative."],
  faults:["Swinging with momentum.","Shrugging traps into the movement."]},
deadlift:{n:"Deadlift",m:"back",sub:["erectors","traps"],sec:["glutes","hamstrings"],bias:"mid",type:"compound",eq:"bb",reps:[3,6],
  why:"Maximal loading for the erectors, traps and entire posterior chain.",
  cues:["Bar over mid-foot, shins to bar.","Take the slack out — lats tight.","Push the floor away; bar stays on the legs.","Stand tall, no lean-back."],
  faults:["Rounding the lower back.","Jerking the bar off the floor.","Hitching."]},
back_ext:{n:"Back Extension",m:"back",sub:["erectors"],sec:["glutes","hamstrings"],bias:"stretch",type:"isolation",eq:"bw",reps:[10,15],
  why:"Trains erectors and glutes through a stretch with low spinal compression.",
  cues:["Hinge at the hips over the pad.","Round slightly for erectors / stay flat for glutes.","Squeeze glutes at the top."],
  faults:["Hyperextending violently at the top.","Bouncing."]},
/* ---------------- SHOULDERS ---------------- */
ohp:{n:"Overhead Press",m:"shoulders",sub:["front"],sec:["triceps","core"],bias:"mid",type:"compound",eq:"bb",reps:[5,10],
  why:"Heaviest front-delt loading; also builds pressing strength that carries to everything.",
  cues:["Bar at the collarbone, glutes tight.","Press straight up, head moves back then through.","Lock out with biceps by the ears."],
  faults:["Excessive lower-back arch.","Pressing around the chin in a curve."]},
dbohp:{n:"Seated DB Shoulder Press",m:"shoulders",sub:["front"],sec:["triceps"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"Deeper bottom position than a barbell — more delt stretch, friendlier on wrists.",
  cues:["Start at ear height, palms forward.","Press to full extension.","Lower until elbows are just below shoulder line."],
  faults:["Flaring ribs / arching hard.","Half reps at the bottom."]},
latraise:{n:"Dumbbell Lateral Raise",m:"shoulders",sub:["side"],sec:[],bias:"short",type:"isolation",eq:"db",reps:[10,20],
  why:"Direct side-delt work — the muscle that makes shoulders look wide.",
  cues:["Lead with the elbows out to shoulder height.","Pinky slightly higher than thumb.","3s negative — the way down grows it."],
  faults:["Swinging from the hips.","Shrugging traps into every rep."]},
cable_latraise:{n:"Cable Lateral Raise",m:"shoulders",sub:["side"],sec:[],bias:"stretch",type:"isolation",eq:"cb",reps:[10,15],
  why:"Cable keeps tension at the bottom, where dumbbells give the delt a rest — long-length tension bias.",
  cues:["Cable at the lowest setting, start behind the body.","Raise out to shoulder height.","Constant tension — no resting at the bottom."],
  faults:["Standing too far from the stack.","Turning it into an upright row."]},
/* ---------------- BICEPS ---------------- */
incline_curl:{n:"Incline DB Curl",m:"biceps",sub:["long"],sec:[],bias:"stretch",type:"isolation",eq:"db",reps:[8,12],
  why:"Arms behind the torso put the long head under stretch — strongest regional-growth signal.",
  cues:["Bench ~45–60°, arms hanging back.","Curl without the elbows drifting forward.","Full stretch at the bottom of every rep."],
  faults:["Elbows creeping up to the front.","Shortening the bottom range."]},
curl:{n:"Dumbbell Curl",m:"biceps",sub:["long","short"],sec:[],bias:"mid",type:"isolation",eq:"db",reps:[8,12],
  why:"The bread-and-butter biceps builder — supinated grip hits both heads.",
  cues:["Elbows pinned to your sides.","Curl up without swinging.","Slow 2–3s lowering."],
  faults:["Hip swing / body english.","Elbows drifting forward at the top."]},
preacher_curl:{n:"Preacher Curl",m:"biceps",sub:["short"],sec:[],bias:"stretch",type:"isolation",eq:"mc",reps:[8,12],
  why:"The pad eliminates cheating and loads the biceps hard in the stretched bottom position.",
  cues:["Armpits snug on the pad.","Lower to a full (not violent) stretch.","No bouncing out of the bottom."],
  faults:["Lifting elbows off the pad.","Dropping into the stretch."]},
cable_curl:{n:"Cable Curl",m:"biceps",sub:["long","short"],sec:[],bias:"mid",type:"isolation",eq:"cb",reps:[10,15],
  why:"Constant tension through the whole range — great close-to-failure volume tool.",
  cues:["Elbows at your sides.","Curl to full contraction, squeeze 1s.","Control the cable all the way down."],
  faults:["Leaning back to finish reps.","Elbows travelling forward."]},
hammer:{n:"Hammer Curl",m:"biceps",sub:["brach"],sec:[],bias:"mid",type:"isolation",eq:"db",reps:[8,12],
  why:"Neutral grip biases the brachialis — pushes the biceps up and adds arm thickness.",
  cues:["Palms facing each other throughout.","Elbows still, no swing.","Control the negative."],
  faults:["Rotating the wrist mid-rep.","Swinging heavy weights."]},
/* ---------------- TRICEPS ---------------- */
ohext:{n:"Overhead DB Triceps Extension",m:"triceps",sub:["long"],sec:[],bias:"stretch",type:"isolation",eq:"db",reps:[8,15],
  why:"Overhead position stretches the long head — shown to grow the triceps ~1.4x more than pushdowns (Maeo 2022).",
  cues:["One dumbbell, both hands, elbows by the ears.","Lower behind the head to a deep stretch.","Elbows point forward — don't flare.","Lock out fully."],
  faults:["Elbows flaring wide.","Cutting the stretch short.","Arching the lower back."]},
cable_ohext:{n:"Cable Overhead Extension",m:"triceps",sub:["long"],sec:[],bias:"stretch",type:"isolation",eq:"cb",reps:[10,15],
  why:"Same long-head stretch as the DB version with smoother constant tension.",
  cues:["Face away from the stack, rope overhead.","Let the rope pull to a deep stretch.","Extend to lockout, elbows steady."],
  faults:["Bowing the torso to cheat.","Elbows drifting apart."]},
pushdown:{n:"Cable Pushdown (Rope)",m:"triceps",sub:["lateral","medial"],sec:[],bias:"short",type:"isolation",eq:"cb",reps:[10,15],
  why:"Peak-contraction work for the lateral head — the visible outer sweep of the arm.",
  cues:["Elbows pinned, slight forward lean.","Push down and split the rope at lockout.","1s hard squeeze at the bottom."],
  faults:["Elbows rising on the way up.","Leaning over the cable and pressing with bodyweight."]},
skull:{n:"Skull Crusher",m:"triceps",sub:["long","lateral"],sec:[],bias:"mid",type:"isolation",eq:"db",reps:[8,12],
  why:"Lowering behind the head gets partial long-head stretch with heavier loading than overhead work.",
  cues:["Lower toward the forehead or just behind it.","Upper arms vertical and still.","Elbows track straight, no flare."],
  faults:["Turning it into a close-grip press.","Elbows drifting back."]},
cgbench:{n:"Close-Grip Bench Press",m:"triceps",sub:["lateral","medial"],sec:["chest","shoulders"],bias:"mid",type:"compound",eq:"bb",reps:[6,10],
  why:"Heaviest triceps loading available — compound overload for all three heads.",
  cues:["Shoulder-width grip, wrists straight.","Elbows tucked, touch the lower chest.","Drive up through the triceps."],
  faults:["Grip so narrow the wrists cave.","Flaring into a regular bench."]},
dip:{n:"Dips (upright)",m:"triceps",sub:["lateral","long"],sec:["chest","shoulders"],bias:"stretch",type:"compound",eq:"bw",reps:[6,12],
  why:"Upright dips load the triceps through a big range; easy to progress with added weight.",
  cues:["Torso vertical for triceps bias.","Lower until upper arms are parallel.","Full lockout, shoulders away from ears."],
  faults:["Excessive forward lean (shifts to chest).","Tiny partial reps."]},
/* ---------------- QUADS ---------------- */
squat:{n:"Barbell Back Squat",m:"quads",sub:["vasti","rf"],sec:["glutes","core"],bias:"mid",type:"compound",eq:"bb",reps:[5,10],
  why:"Highest-loading quad builder with huge systemic growth stimulus.",
  cues:["Bar on upper back, brace hard.","Sit down between the hips.","At least parallel depth.","Knees track over toes."],
  faults:["Heels lifting.","Knees caving in.","Good-morning-ing the weight up."]},
hacksquat:{n:"Hack Squat",m:"quads",sub:["vasti"],sec:["glutes"],bias:"stretch",type:"compound",eq:"mc",reps:[8,12],
  why:"Back-supported deep knee flexion — maximal quad stretch without balance limits.",
  cues:["Feet lower on the platform for quad bias.","Sink deep — full knee bend.","Drive through mid-foot."],
  faults:["Half depth with big plates.","Knees collapsing inward."]},
legpress:{n:"Leg Press",m:"quads",sub:["vasti"],sec:["glutes"],bias:"stretch",type:"compound",eq:"mc",reps:[8,15],
  why:"Deep, stable quad loading — easy to take close to failure safely.",
  cues:["Feet shoulder-width, mid-platform.","Lower to ~90° knee bend or deeper.","Never let the lower back roll off the pad."],
  faults:["Bouncing at the bottom.","Locking knees violently."]},
legext:{n:"Leg Extension",m:"quads",sub:["rf"],sec:[],bias:"short",type:"isolation",eq:"mc",reps:[10,15],
  why:"Only lift that fully loads the rectus femoris (it's slack in squats since the hip is bent).",
  cues:["Pad on the shins, back against the seat.","Extend to full lockout, squeeze 1s.","3s negative."],
  faults:["Kicking the weight up.","Half-range pumping."]},
goblet:{n:"Goblet Squat",m:"quads",sub:["vasti"],sec:["glutes","core"],bias:"mid",type:"compound",eq:"db",reps:[8,15],
  why:"Quad-dominant squat pattern with minimal equipment.",
  cues:["Dumbbell vertical at the chest.","Torso tall, elbows inside knees at depth.","Drive through the whole foot."],
  faults:["Tipping forward.","Cutting depth."]},
lunge:{n:"Walking Lunge",m:"quads",sub:["vasti"],sec:["glutes"],bias:"stretch",type:"compound",eq:"bw",reps:[8,15],
  why:"Deep split position stretches quads and glutes; brutal and effective with just bodyweight or dumbbells.",
  cues:["Long stride, back knee nearly touches.","Front shin roughly vertical.","Push through the front heel."],
  faults:["Short choppy steps.","Torso collapsing forward."]},
/* ---------------- HAMSTRINGS ---------------- */
rdl:{n:"Romanian Deadlift",m:"hamstrings",sub:["hinge"],sec:["glutes","back"],bias:"stretch",type:"compound",eq:"bb",reps:[6,10],
  why:"Loads the hamstrings in a deep stretch at the hip — the top hinge-pattern builder.",
  cues:["Soft knees, hips push straight back.","Bar slides down the thighs, back flat.","Stop at a strong hamstring stretch (~mid-shin).","Hips forward to stand, squeeze glutes."],
  faults:["Squatting the weight down.","Rounding the back.","Bouncing at the bottom."]},
db_rdl:{n:"Dumbbell RDL",m:"hamstrings",sub:["hinge"],sec:["glutes"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"Same stretch-loaded hinge with dumbbells.",
  cues:["Dumbbells brush the thighs down.","Hips back, flat back.","Feel the hamstrings, stand with the glutes."],
  faults:["Bending the knees into a squat.","Looking up and over-arching."]},
legcurl:{n:"Seated Leg Curl",m:"hamstrings",sub:["knee"],sec:[],bias:"stretch",type:"isolation",eq:"mc",reps:[8,15],
  why:"Seated beats lying curls for growth (Maeo 2021) — the bent hip keeps the hamstrings stretched while they flex the knee.",
  cues:["Thighs pinned under the pad.","Curl all the way to full flexion.","3s negative to a full stretch."],
  faults:["Hips lifting to cheat.","Fast half reps."]},
nordic:{n:"Nordic Curl (eccentric)",m:"hamstrings",sub:["knee"],sec:[],bias:"stretch",type:"isolation",eq:"bw",reps:[3,8],
  why:"Brutal eccentric knee-flexion overload — also protective against hamstring strains.",
  cues:["Anchor the ankles, tall hips.","Lower as slowly as possible.","Catch with hands, push back up."],
  faults:["Breaking at the hips.","Free-falling the last half."]},
/* ---------------- GLUTES ---------------- */
hipthrust:{n:"Barbell Hip Thrust",m:"glutes",sub:["max"],sec:["hamstrings"],bias:"short",type:"compound",eq:"bb",reps:[8,12],
  why:"Peak glute tension at full hip extension — heaviest direct glute loading.",
  cues:["Upper back on a bench, bar over the hips.","Drive to a full lockout, ribs down.","1s hard squeeze at the top."],
  faults:["Arching the lower back instead of extending hips.","Partial lockouts."]},
bulgarian:{n:"Bulgarian Split Squat",m:"glutes",sub:["max"],sec:["quads"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"Deep unilateral stretch on the glute of the front leg — outstanding growth-per-kilo.",
  cues:["Rear foot on a bench, long stance for glute bias.","Sink deep, slight forward torso lean.","Drive through the front heel."],
  faults:["Stance too short (all quads).","Bouncing off the back leg."]},
abduction:{n:"Hip Abduction",m:"glutes",sub:["med"],sec:[],bias:"short",type:"isolation",eq:"mc",reps:[12,20],
  why:"Direct glute-med work — hip stability and the upper-glute shelf.",
  cues:["Lean slightly forward for upper-glute bias.","Push out wide, pause 1s.","Slow return."],
  faults:["Rocking the torso.","Fast bouncy reps."]},
/* ---------------- CALVES ---------------- */
calf_stand:{n:"Standing Calf Raise",m:"calves",sub:["gastroc"],sec:[],bias:"stretch",type:"isolation",eq:"bw",reps:[8,15],
  why:"Straight knee = gastrocnemius; the deep stretched pause is where growth comes from.",
  cues:["Balls of feet on a step.","2s pause in the deep stretch.","Drive to full height, 1s squeeze."],
  faults:["Bouncing out of the bottom.","Tiny mid-range pulses."]},
calf_seated:{n:"Seated Calf Raise",m:"calves",sub:["soleus"],sec:[],bias:"mid",type:"isolation",eq:"mc",reps:[10,20],
  why:"Bent knee slackens the gastroc so the soleus does the work — needed for complete calf size.",
  cues:["Pad on the knees.","Full stretch at the bottom, full rise at the top.","Slow tempo — the calves love time under tension."],
  faults:["Bouncing.","Loading so heavy the range disappears."]},
/* ---------------- CORE ---------------- */
cablecrunch:{n:"Cable Crunch",m:"core",sub:["rectus"],sec:[],bias:"mid",type:"isolation",eq:"cb",reps:[10,15],
  why:"Loaded spinal flexion — abs grow with progressive load like any muscle.",
  cues:["Kneel under a high cable, rope behind the head.","Curl ribs to hips — it's a spine curl, not a hip hinge.","Slow return to a full stretch."],
  faults:["Hinging at the hips.","Pulling with the arms."]},
legs_raise:{n:"Hanging Leg Raise",m:"core",sub:["rectus"],sec:[],bias:"stretch",type:"isolation",eq:"bw",reps:[8,15],
  why:"Trains the lower abdominal region with a loaded stretch at the hang.",
  cues:["Raise by curling the pelvis up, not just lifting legs.","No swinging.","Bend knees to regress."],
  faults:["Swinging momentum.","Only moving at the hips."]},
plank:{n:"Plank",m:"core",sub:["rectus","obliques"],sec:[],bias:"mid",type:"isolation",eq:"bw",reps:[30,60],
  why:"Anti-extension bracing — the foundation under every heavy lift. Reps here = seconds.",
  cues:["Forearms down, one straight line.","Squeeze glutes, brace like taking a punch.","Breathe steadily."],
  faults:["Sagging hips.","Piking up."]},
side_plank:{n:"Side Plank",m:"core",sub:["obliques"],sec:[],bias:"mid",type:"isolation",eq:"bw",reps:[20,45],
  why:"Direct oblique and lateral-chain work. Reps = seconds per side.",
  cues:["Elbow under the shoulder.","Hips high — straight line.","Stack or stagger the feet."],
  faults:["Hips dropping.","Rolling forward."]}
};

/* ---------- Effectiveness ranking per muscle (best first) ----------
   Ordering blends loading potential, stretch bias, and progression ease.
   Estimates informed by regional-hypertrophy research; treat as a strong
   default, not gospel. */
const RANK = {
  chest:      ["bench","incline_db","dbbench","incline_bb","dips_chest","cable_fly","pec_deck","pushup"],
  back:       ["pullup","pulldown","row_bb","dbrow","row_cable","deadlift","pullover_cb","facepull","reverse_fly","back_ext","shrug_db"],
  shoulders:  ["ohp","dbohp","cable_latraise","latraise"],
  biceps:     ["incline_curl","curl","preacher_curl","cable_curl","hammer"],
  triceps:    ["ohext","cable_ohext","cgbench","skull","pushdown","dip"],
  quads:      ["squat","hacksquat","legpress","lunge","goblet","legext"],
  hamstrings: ["rdl","legcurl","db_rdl","nordic"],
  glutes:     ["hipthrust","bulgarian","abduction"],
  calves:     ["calf_stand","calf_seated"],
  core:       ["cablecrunch","legs_raise","plank","side_plank"]
};

/* Anchor lifts: kept stable across rotations for long-term progress tracking */
const ANCHORS = new Set(["bench","squat","rdl","deadlift","ohp","pullup","pulldown","row_bb","hipthrust","cgbench"]);
const BIG_LIFTS = new Set(["squat","deadlift","rdl","legpress","hacksquat","hipthrust"]); // bigger load jumps
