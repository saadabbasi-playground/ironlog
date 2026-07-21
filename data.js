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

/* ---------- Strength standards ----------
   e1RM as a multiple of bodyweight, thresholds for:
   Beginner / Novice / Intermediate / Advanced / Elite.
   Practitioner estimates in the style of community strength standards —
   directional, not gospel (conf: est). */
const LEVELS = ["Beginner","Novice","Intermediate","Advanced","Elite"];const STRENGTH_STANDARDS = {
  bench:    {m:[0.50,0.75,1.00,1.50,2.00], f:[0.25,0.45,0.70,1.00,1.40]},
  squat:    {m:[0.75,1.00,1.50,2.00,2.50], f:[0.50,0.75,1.10,1.50,2.00]},
  deadlift: {m:[1.00,1.25,1.75,2.25,2.75], f:[0.60,0.90,1.30,1.80,2.30]},
  ohp:      {m:[0.35,0.55,0.80,1.05,1.30], f:[0.20,0.35,0.50,0.70,0.90]},
  row_bb:   {m:[0.50,0.75,1.00,1.35,1.70], f:[0.30,0.50,0.70,0.95,1.20]}
};

/* ---------- Technique videos ----------
   Verified uploads from Jeff Nippard's official channel (Technique Tuesday).
   Exercises without a verified ID fall back to the series playlist embed
   and an external YouTube search. */
const VIDS = {
  bench:    "vcBig73ojpE",   // How To Get A Huge Bench Press with PERFECT Technique
  squat:    "bEv6CCg2BC8",   // How To Get A Huge Squat With Perfect Technique
  deadlift: "VL5Ab0T07e4",   // Build A Bigger Deadlift With Perfect Technique
  ohp:      "_RlRDWO2jfg"    // Build Bigger Shoulders With Perfect Training Technique
};
const TECH_PLAYLIST = "PLp4G6oBUcv8yGQifkb4p_ZOoACPnYslx9"; // Technique Tuesday series

/* ============================================================
   EXPANSION PACK — equipment variants & extra exercises
   Each entry is a real alternative for an existing movement pattern,
   so users can swap barbell <-> dumbbell <-> cable <-> machine.
============================================================ */
Object.assign(EX, {
/* ---- CHEST ---- */
smith_bench:{n:"Smith Machine Bench Press",m:"chest",sub:["mid"],sec:["triceps","shoulders"],bias:"mid",type:"compound",eq:"mc",reps:[6,12],
  why:"Fixed bar path lets you push closer to failure safely without a spotter.",
  cues:["Set the bar to touch mid-chest.","Shoulder blades retracted, feet planted.","Control down 2s, press without bouncing."],
  faults:["Bar set too high on the chest.","Bouncing off the safety catches."]},
machine_press:{n:"Chest Press Machine",m:"chest",sub:["mid"],sec:["triceps"],bias:"mid",type:"compound",eq:"mc",reps:[8,15],
  why:"Stable pressing you can take to true failure — ideal for late-session volume.",
  cues:["Handles level with mid-chest.","Press without locking harshly.","Slow return to a chest stretch."],
  faults:["Seat too high or low.","Shoulders rolling forward at the bottom."]},
db_fly:{n:"Dumbbell Fly",m:"chest",sub:["mid"],sec:[],bias:"stretch",type:"isolation",eq:"db",reps:[10,15],
  why:"Deep pec stretch at the bottom — the position that drives chest growth.",
  cues:["Slight fixed elbow bend.","Open wide to a strong stretch.","Hug back up, squeeze at the top."],
  faults:["Bending elbows into a press.","Going so heavy the shoulders take over."]},
incline_cable_fly:{n:"Incline Cable Fly",m:"chest",sub:["upper"],sec:[],bias:"stretch",type:"isolation",eq:"cb",reps:[10,15],
  why:"Constant tension on the upper chest through the full range — cables don't lose load at the stretch.",
  cues:["Bench at 30° between two low cables.","Sweep up and together.","Resist the stretch on the way back."],
  faults:["Cables set too high.","Rushing the eccentric."]},
deficit_pushup:{n:"Deficit Push-Up",m:"chest",sub:["mid"],sec:["triceps"],bias:"stretch",type:"compound",eq:"bw",reps:[8,20],
  why:"Hands elevated lets the chest sink below hand level for a real stretch.",
  cues:["Hands on two low blocks or dumbbells.","Lower the chest below hand level.","Body in one straight line."],
  faults:["Hips sagging.","Cutting depth short."]},
/* ---- BACK ---- */
chinup:{n:"Chin-Up",m:"back",sub:["lats"],sec:["biceps"],bias:"stretch",type:"compound",eq:"bw",reps:[5,12],
  why:"Supinated grip adds heavy biceps involvement while still loading the lats through a full stretch.",
  cues:["Palms facing you, shoulder-width.","Full dead-hang start.","Drive elbows down to the ribs."],
  faults:["Kipping.","Stopping short of the chin over the bar."]},
tbar_row:{n:"T-Bar Row",m:"back",sub:["lats","traps"],sec:["biceps"],bias:"mid",type:"compound",eq:"bb",reps:[8,12],
  why:"Heavy horizontal pull with the chest supported or braced — big mid-back loading.",
  cues:["Hinge over the bar, flat back.","Pull to the lower chest.","Squeeze blades together 1s."],
  faults:["Jerking with the lower back.","Standing upright as reps get hard."]},
chest_supported_row:{n:"Chest-Supported DB Row",m:"back",sub:["lats","traps"],sec:["biceps"],bias:"mid",type:"compound",eq:"db",reps:[8,12],
  why:"Pad removes the lower back and momentum entirely — pure back stimulus.",
  cues:["Chest on an incline bench.","Row to the hips, elbows back.","Full stretch at the bottom."],
  faults:["Lifting the chest off the pad.","Shrugging the weight up."]},
machine_row:{n:"Machine Row",m:"back",sub:["traps","lats"],sec:["biceps"],bias:"short",type:"compound",eq:"mc",reps:[8,15],
  why:"Stable rowing you can safely push to failure for extra weekly volume.",
  cues:["Chest against the pad.","Drive elbows straight back.","Squeeze 1s, control the return."],
  faults:["Using body English.","Half-range reps."]},
neutral_pulldown:{n:"Neutral-Grip Pulldown",m:"back",sub:["lats"],sec:["biceps"],bias:"stretch",type:"compound",eq:"mc",reps:[8,12],
  why:"Shoulder-friendly grip that many people feel in the lats better than a wide grip.",
  cues:["Palms facing each other.","Pull to the upper chest.","Full stretch overhead each rep."],
  faults:["Leaning back excessively.","Pulling with the arms only."]},
inverted_row:{n:"Inverted Row",m:"back",sub:["traps","lats"],sec:["biceps"],bias:"mid",type:"compound",eq:"bw",reps:[8,15],
  why:"Bodyweight horizontal pull — scalable by changing body angle.",
  cues:["Bar at hip height, body straight.","Pull the chest to the bar.","Squeeze the blades, lower slowly."],
  faults:["Hips sagging.","Partial reps."]},
rack_pull:{n:"Rack Pull",m:"back",sub:["traps","erectors"],sec:["glutes"],bias:"mid",type:"compound",eq:"bb",reps:[4,8],
  why:"Overloads the top half of the deadlift — heavy trap and erector stimulus with less fatigue.",
  cues:["Bar set just below the knees.","Lats tight, chest up.","Drive hips through to lockout."],
  faults:["Rounding the back to start.","Bouncing the bar off the pins."]},
barbell_shrug:{n:"Barbell Shrug",m:"back",sub:["traps"],sec:[],bias:"short",type:"isolation",eq:"bb",reps:[8,15],
  why:"Heaviest loading option for the upper traps.",
  cues:["Straight arms, shrug straight up.","Pause 1s at the top.","Lower under control."],
  faults:["Rolling the shoulders.","Bouncing from the knees."]},
/* ---- SHOULDERS ---- */
arnold:{n:"Arnold Press",m:"shoulders",sub:["front"],sec:["triceps"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"The rotation adds range at the bottom, loading the front delt through more of its stretch.",
  cues:["Start palms facing you at chin height.","Rotate out as you press up.","Reverse smoothly on the way down."],
  faults:["Rushing the rotation.","Arching the lower back."]},
machine_ohp:{n:"Shoulder Press Machine",m:"shoulders",sub:["front"],sec:["triceps"],bias:"mid",type:"compound",eq:"mc",reps:[8,15],
  why:"Supported overhead pressing — safe to take close to failure.",
  cues:["Handles at ear height.","Press to full extension.","Lower slowly to the start."],
  faults:["Seat set too low.","Half reps at the bottom."]},
landmine_press:{n:"Landmine Press",m:"shoulders",sub:["front"],sec:["triceps","core"],bias:"mid",type:"compound",eq:"bb",reps:[8,12],
  why:"Angled pressing path that's kinder to shoulders than strict overhead work.",
  cues:["Bar in a corner or landmine, one hand at the shoulder.","Press up and forward.","Ribs down, core braced."],
  faults:["Leaning back to press.","Letting the elbow flare wide."]},
front_raise:{n:"Front Raise",m:"shoulders",sub:["front"],sec:[],bias:"short",type:"isolation",eq:"db",reps:[10,15],
  why:"Direct front-delt work — usually only needed if pressing volume is low.",
  cues:["Raise to eye level, thumbs up.","No swinging.","Lower for 2–3s."],
  faults:["Using the hips to swing.","Heavy weight above shoulder height."]},
machine_latraise:{n:"Lateral Raise Machine",m:"shoulders",sub:["side"],sec:[],bias:"mid",type:"isolation",eq:"mc",reps:[10,20],
  why:"Removes momentum entirely — great for high-rep side-delt burnouts.",
  cues:["Pads on the outer arms, not the hands.","Lead with the elbows.","Pause 1s at the top."],
  faults:["Pushing with the hands.","Shrugging into the reps."]},
/* ---- BICEPS ---- */
bb_curl:{n:"Barbell Curl",m:"biceps",sub:["long","short"],sec:[],bias:"mid",type:"isolation",eq:"bb",reps:[6,12],
  why:"Heaviest loading available for the biceps — the strength builder of curls.",
  cues:["Shoulder-width grip, elbows at your sides.","Curl without swinging.","Lower for 2–3s."],
  faults:["Leaning back to heave the bar.","Elbows drifting forward."]},
cable_bayesian:{n:"Bayesian Cable Curl",m:"biceps",sub:["long"],sec:[],bias:"stretch",type:"isolation",eq:"cb",reps:[10,15],
  why:"Arm behind the body under constant cable tension — the strongest long-head stretch position.",
  cues:["Face away from a low cable, arm back.","Curl without letting the elbow travel forward.","Control back to the deep stretch."],
  faults:["Standing too close to the stack.","Letting the shoulder swing forward."]},
spider_curl:{n:"Spider Curl",m:"biceps",sub:["short"],sec:[],bias:"short",type:"isolation",eq:"db",reps:[10,15],
  why:"Chest-supported with arms hanging vertically — maximal tension at peak contraction.",
  cues:["Chest on an incline bench, arms straight down.","Curl to full contraction.","Squeeze 1s at the top."],
  faults:["Swinging the dumbbells.","Lifting the chest off the pad."]},
concentration_curl:{n:"Concentration Curl",m:"biceps",sub:["short"],sec:[],bias:"mid",type:"isolation",eq:"db",reps:[10,15],
  why:"Braced elbow makes cheating impossible — high peak-contraction tension.",
  cues:["Elbow braced inside the thigh.","Curl to the shoulder, squeeze.","Slow full extension."],
  faults:["Using the torso to swing.","Cutting the bottom range."]},
reverse_curl:{n:"Reverse Curl",m:"biceps",sub:["brach"],sec:[],bias:"mid",type:"isolation",eq:"db",reps:[10,15],
  why:"Pronated grip hits the brachialis and forearm extensors — adds arm and grip thickness.",
  cues:["Palms facing down, elbows fixed.","Curl smoothly, no swing.","Control the negative."],
  faults:["Wrists collapsing.","Going too heavy and swinging."]},
/* ---- TRICEPS ---- */
ez_skull:{n:"EZ-Bar Skull Crusher",m:"triceps",sub:["long","lateral"],sec:[],bias:"mid",type:"isolation",eq:"bb",reps:[8,12],
  why:"Barbell version allows heavier loading than dumbbells for the same movement.",
  cues:["Lower toward or just behind the forehead.","Upper arms vertical.","Extend to lockout without flaring."],
  faults:["Turning it into a close-grip press.","Elbows drifting apart."]},
db_cgpress:{n:"Close-Grip DB Press",m:"triceps",sub:["lateral","medial"],sec:["chest"],bias:"mid",type:"compound",eq:"db",reps:[8,12],
  why:"Dumbbell alternative to close-grip bench — easier on the wrists.",
  cues:["Dumbbells touching, neutral grip.","Elbows tucked close to the ribs.","Press straight up and lock out."],
  faults:["Letting the elbows flare.","Short range at the bottom."]},
bar_pushdown:{n:"Straight-Bar Pushdown",m:"triceps",sub:["lateral","medial"],sec:[],bias:"short",type:"isolation",eq:"cb",reps:[10,15],
  why:"Bar handle lets you load heavier than a rope for the same pushdown pattern.",
  cues:["Elbows pinned to the sides.","Push to full lockout.","1s squeeze, slow return."],
  faults:["Leaning over to press with bodyweight.","Elbows rising each rep."]},
kickback:{n:"Cable Kickback",m:"triceps",sub:["lateral"],sec:[],bias:"short",type:"isolation",eq:"cb",reps:[12,20],
  why:"Peak-contraction work for the lateral head with constant cable tension.",
  cues:["Hinge slightly, upper arm parallel to the floor.","Extend fully back, squeeze.","Only the forearm moves."],
  faults:["Swinging the whole arm.","Going too heavy to lock out."]},
bench_dip:{n:"Bench Dip",m:"triceps",sub:["lateral","medial"],sec:["shoulders"],bias:"stretch",type:"compound",eq:"bw",reps:[8,15],
  why:"No-equipment triceps loading; add plates on the lap to progress.",
  cues:["Hands on a bench behind you.","Lower until upper arms are parallel.","Press to full lockout."],
  faults:["Shoulders shrugging up.","Dropping too deep and straining the shoulder."]},
machine_dip:{n:"Assisted / Machine Dip",m:"triceps",sub:["lateral","long"],sec:["chest"],bias:"stretch",type:"compound",eq:"mc",reps:[8,15],
  why:"Adjustable assistance or load makes the dip pattern usable at any strength level.",
  cues:["Torso upright for triceps bias.","Lower to parallel.","Full lockout at the top."],
  faults:["Leaning forward (shifts to chest).","Partial reps."]},
/* ---- QUADS ---- */
front_squat:{n:"Front Squat",m:"quads",sub:["vasti","rf"],sec:["core"],bias:"mid",type:"compound",eq:"bb",reps:[5,10],
  why:"Upright torso shifts load off the hips onto the quads more than a back squat.",
  cues:["Bar on the front delts, elbows high.","Sit straight down, torso tall.","Drive up keeping the elbows up."],
  faults:["Elbows dropping (bar rolls forward).","Rounding the upper back."]},
smith_squat:{n:"Smith Machine Squat",m:"quads",sub:["vasti"],sec:["glutes"],bias:"mid",type:"compound",eq:"mc",reps:[8,12],
  why:"Fixed path lets you place the feet forward for a quad-dominant position without balance limits.",
  cues:["Feet slightly forward of the bar.","Sink to at least parallel.","Drive through the whole foot."],
  faults:["Feet so far forward the knees strain.","Half depth."]},
step_up:{n:"Dumbbell Step-Up",m:"quads",sub:["vasti"],sec:["glutes"],bias:"mid",type:"compound",eq:"db",reps:[8,15],
  why:"Unilateral quad and glute work with minimal spinal load.",
  cues:["Box at about knee height.","Drive through the top foot, don't push off the floor.","Lower slowly under control."],
  faults:["Bouncing off the trailing leg.","Box so high it becomes a jump."]},
sissy_squat:{n:"Sissy Squat",m:"quads",sub:["rf"],sec:[],bias:"stretch",type:"isolation",eq:"bw",reps:[8,15],
  why:"Knee-dominant movement that loads the rectus femoris in a deep stretch.",
  cues:["Hold support, rise onto the toes.","Lean back, driving knees forward.","Hips and shoulders in one line."],
  faults:["Bending at the hips.","Dropping too fast into the knees."]},
/* ---- HAMSTRINGS ---- */
lying_legcurl:{n:"Lying Leg Curl",m:"hamstrings",sub:["knee"],sec:[],bias:"mid",type:"isolation",eq:"mc",reps:[10,15],
  why:"Knee-flexion work when a seated curl isn't available (seated is slightly better for growth).",
  cues:["Pad just above the heels.","Curl fully, pause 1s.","3s negative."],
  faults:["Hips lifting off the pad.","Fast partial reps."]},
good_morning:{n:"Good Morning",m:"hamstrings",sub:["hinge"],sec:["glutes","back"],bias:"stretch",type:"compound",eq:"bb",reps:[8,12],
  why:"Loaded hip hinge with a long hamstring stretch at lighter absolute loads than an RDL.",
  cues:["Bar on the upper back, soft knees.","Hips back until you feel a strong stretch.","Flat back throughout."],
  faults:["Rounding the back.","Going too heavy too soon."]},
sl_rdl:{n:"Single-Leg RDL",m:"hamstrings",sub:["hinge"],sec:["glutes"],bias:"stretch",type:"compound",eq:"db",reps:[8,12],
  why:"Unilateral hinge with a deep stretch — also exposes and fixes side-to-side imbalances.",
  cues:["Hinge over one leg, back leg extending behind.","Hips square to the floor.","Stand by squeezing the glute."],
  faults:["Hips rotating open.","Rounding the back at the bottom."]},
/* ---- GLUTES ---- */
db_hipthrust:{n:"Dumbbell Hip Thrust",m:"glutes",sub:["max"],sec:["hamstrings"],bias:"short",type:"compound",eq:"db",reps:[10,15],
  why:"Same peak-tension glute pattern as the barbell version, no bar or pad needed.",
  cues:["Upper back on a bench, dumbbell on the hips.","Drive to full hip extension.","Squeeze 1s, ribs down."],
  faults:["Arching the lower back instead of extending the hips.","Partial lockout."]},
machine_hipthrust:{n:"Hip Thrust Machine",m:"glutes",sub:["max"],sec:[],bias:"short",type:"compound",eq:"mc",reps:[10,15],
  why:"Loads the glute bridge pattern comfortably with easy progression.",
  cues:["Pad across the hips.","Full extension, 1s squeeze.","Control the descent."],
  faults:["Hyperextending the lower back.","Short reps."]},
pullthrough:{n:"Cable Pull-Through",m:"glutes",sub:["max"],sec:["hamstrings"],bias:"stretch",type:"compound",eq:"cb",reps:[10,15],
  why:"Hinge pattern with resistance peaking at lockout — glute tension without spinal loading.",
  cues:["Face away from a low cable, rope between the legs.","Hips back into a stretch.","Snap hips forward, squeeze glutes."],
  faults:["Squatting instead of hinging.","Pulling with the arms."]},
kickback_glute:{n:"Cable Glute Kickback",m:"glutes",sub:["max"],sec:[],bias:"short",type:"isolation",eq:"cb",reps:[12,20],
  why:"Isolates one glute at a time at peak contraction.",
  cues:["Ankle strap on a low cable.","Drive the leg straight back, squeeze 1s.","Keep the lower back still."],
  faults:["Arching the back to gain range.","Swinging the leg."]},
/* ---- CALVES ---- */
machine_calf:{n:"Standing Calf Machine",m:"calves",sub:["gastroc"],sec:[],bias:"stretch",type:"isolation",eq:"mc",reps:[8,15],
  why:"Loadable straight-knee calf raise — the main gastrocnemius builder.",
  cues:["Balls of the feet on the platform.","2s stretch at the bottom.","Full rise, 1s squeeze."],
  faults:["Bouncing.","Cutting the stretch."]},
leg_press_calf:{n:"Leg Press Calf Raise",m:"calves",sub:["gastroc"],sec:[],bias:"stretch",type:"isolation",eq:"mc",reps:[10,20],
  why:"Heavy calf loading with a supported back; easy to control tempo.",
  cues:["Balls of feet on the bottom of the platform.","Push through the toes to full extension.","Slow, deep stretch — safety catches on."],
  faults:["Locking the knees.","Bouncing at the bottom."]},
db_calf:{n:"Single-Leg DB Calf Raise",m:"calves",sub:["gastroc"],sec:[],bias:"stretch",type:"isolation",eq:"db",reps:[10,20],
  why:"Unilateral loading with just one dumbbell and a step.",
  cues:["One foot on a step, dumbbell in the same-side hand.","Deep 2s stretch.","Rise as high as possible."],
  faults:["Rushing reps.","Using the support arm to lift."]},
/* ---- CORE ---- */
ab_wheel:{n:"Ab Wheel Rollout",m:"core",sub:["rectus"],sec:[],bias:"stretch",type:"isolation",eq:"bw",reps:[6,12],
  why:"Loads the abs in a lengthened position under anti-extension demand — one of the best ab builders.",
  cues:["Start on the knees, ribs down.","Roll out as far as you can hold a neutral spine.","Pull back with the abs, not the hips."],
  faults:["Lower back arching.","Rolling out past your control."]},
machine_crunch:{n:"Ab Crunch Machine",m:"core",sub:["rectus"],sec:[],bias:"mid",type:"isolation",eq:"mc",reps:[10,15],
  why:"Progressive loading for the abs with a fixed, safe path.",
  cues:["Curl the ribs toward the hips.","Squeeze 1s.","Slow return to a stretch."],
  faults:["Pulling with the arms.","Hinging at the hips."]},
decline_crunch:{n:"Decline Crunch",m:"core",sub:["rectus"],sec:[],bias:"mid",type:"isolation",eq:"bw",reps:[10,20],
  why:"Bodyweight spinal flexion with more range than a floor crunch; hold a plate to progress.",
  cues:["Curl the spine up, not a straight-back sit-up.","Squeeze at the top.","Lower slowly."],
  faults:["Yanking on the neck.","Using momentum."]},
pallof:{n:"Pallof Press",m:"core",sub:["obliques"],sec:[],bias:"mid",type:"isolation",eq:"cb",reps:[10,15],
  why:"Anti-rotation work for the obliques — builds the bracing that protects heavy lifts.",
  cues:["Stand side-on to the cable at chest height.","Press straight out, resist the pull.","Hold 2s, return slowly."],
  faults:["Letting the torso rotate.","Standing too close to the stack."]},
russian_twist:{n:"Russian Twist",m:"core",sub:["obliques"],sec:[],bias:"mid",type:"isolation",eq:"bw",reps:[12,20],
  why:"Rotational oblique work; count reps per side.",
  cues:["Sit leaning back, chest tall.","Rotate from the ribs, not just the arms.","Controlled tempo."],
  faults:["Rounding the lower back.","Flinging the weight side to side."]}
});

/* Re-ranked lists including the expansion (best first; existing top
   entries kept so current users' anchor lifts don't change). */
Object.assign(RANK, {
  chest:      ["bench","incline_db","dbbench","incline_bb","dips_chest","machine_press","smith_bench","db_fly","cable_fly","incline_cable_fly","pec_deck","pushup","deficit_pushup"],
  back:       ["pullup","pulldown","row_bb","dbrow","chinup","tbar_row","chest_supported_row","row_cable","machine_row","neutral_pulldown","deadlift","rack_pull","inverted_row","pullover_cb","facepull","reverse_fly","back_ext","shrug_db","barbell_shrug"],
  shoulders:  ["ohp","dbohp","arnold","machine_ohp","landmine_press","cable_latraise","latraise","machine_latraise","front_raise"],
  biceps:     ["incline_curl","curl","bb_curl","preacher_curl","cable_bayesian","cable_curl","spider_curl","concentration_curl","hammer","reverse_curl"],
  triceps:    ["ohext","cable_ohext","cgbench","ez_skull","skull","db_cgpress","pushdown","bar_pushdown","dip","machine_dip","bench_dip","kickback"],
  quads:      ["squat","hacksquat","legpress","front_squat","smith_squat","lunge","step_up","goblet","sissy_squat","legext"],
  hamstrings: ["rdl","legcurl","lying_legcurl","db_rdl","good_morning","sl_rdl","nordic"],
  glutes:     ["hipthrust","bulgarian","db_hipthrust","machine_hipthrust","pullthrough","kickback_glute","abduction"],
  calves:     ["calf_stand","machine_calf","leg_press_calf","calf_seated","db_calf"],
  core:       ["cablecrunch","ab_wheel","legs_raise","machine_crunch","decline_crunch","plank","pallof","side_plank","russian_twist"]
});
["front_squat","tbar_row","chinup"].forEach(id=>ANCHORS.add(id));

/* ---------- Movement patterns ----------
   Same movement, different equipment — powers the "swap equipment" list. */
const PATTERNS = {
  "Flat press":      ["bench","dbbench","smith_bench","machine_press","pushup","deficit_pushup"],
  "Incline press":   ["incline_bb","incline_db"],
  "Chest fly":       ["cable_fly","db_fly","pec_deck","incline_cable_fly"],
  "Dip":             ["dips_chest","dip","bench_dip","machine_dip"],
  "Vertical pull":   ["pullup","chinup","pulldown","neutral_pulldown"],
  "Horizontal row":  ["row_bb","dbrow","tbar_row","chest_supported_row","row_cable","machine_row","inverted_row"],
  "Deadlift":        ["deadlift","rack_pull"],
  "Shrug":           ["shrug_db","barbell_shrug"],
  "Rear delt":       ["facepull","reverse_fly"],
  "Lat isolation":   ["pullover_cb"],
  "Back extension":  ["back_ext"],
  "Overhead press":  ["ohp","dbohp","arnold","machine_ohp","landmine_press"],
  "Lateral raise":   ["latraise","cable_latraise","machine_latraise"],
  "Front raise":     ["front_raise"],
  "Biceps curl":     ["curl","bb_curl","cable_curl","cable_bayesian","incline_curl","preacher_curl","spider_curl","concentration_curl"],
  "Neutral curl":    ["hammer","reverse_curl"],
  "Overhead triceps":["ohext","cable_ohext"],
  "Skull crusher":   ["skull","ez_skull"],
  "Close-grip press":["cgbench","db_cgpress"],
  "Pushdown":        ["pushdown","bar_pushdown","kickback"],
  "Squat":           ["squat","front_squat","smith_squat","goblet","hacksquat","legpress"],
  "Lunge / split":   ["lunge","step_up","bulgarian"],
  "Leg extension":   ["legext","sissy_squat"],
  "Hip hinge":       ["rdl","db_rdl","good_morning","sl_rdl"],
  "Leg curl":        ["legcurl","lying_legcurl","nordic"],
  "Hip thrust":      ["hipthrust","db_hipthrust","machine_hipthrust","pullthrough"],
  "Glute isolation": ["abduction","kickback_glute"],
  "Calf (straight)": ["calf_stand","machine_calf","leg_press_calf","db_calf"],
  "Calf (bent)":     ["calf_seated"],
  "Ab flexion":      ["cablecrunch","machine_crunch","decline_crunch","legs_raise","ab_wheel"],
  "Anti-rotation":   ["plank","side_plank","pallof","russian_twist"]
};
function patternOf(id){ for(const k in PATTERNS) if(PATTERNS[k].includes(id)) return k; return null; }

/* ---------- Body measurement fields ---------- */
const MEASURES = [
  {k:"weightKg", n:"Bodyweight",   u:"kg", grow:true},
  {k:"chest",    n:"Chest",        u:"cm", grow:true},
  {k:"shoulders",n:"Shoulders",    u:"cm", grow:true},
  {k:"arm",      n:"Arm (flexed)", u:"cm", grow:true},
  {k:"thigh",    n:"Thigh",        u:"cm", grow:true},
  {k:"calf",     n:"Calf",         u:"cm", grow:true},
  {k:"waist",    n:"Waist",        u:"cm", grow:false}
];
/* Which muscle each measurement reflects, for the growth view */
const MEASURE_MUSCLE = {chest:"chest", shoulders:"shoulders", arm:"biceps", thigh:"quads", calf:"calves"};
