// ============================================================
// IMAGE PROMPTS — server-side. One portrait prompt per suspect,
// one scene prompt per intro panel. Used by /api/image, which
// generates each image ONCE and caches it to public/generated/.
// ============================================================

const PORTRAIT_STYLE = "Photorealistic character portrait photograph, chest-up, subject looking at camera with a guarded expression, dramatic low-key noir lighting from one side, deep shadows, muted desaturated colors with warm amber accents, dark blurred background, cinematic film grain, shot on 85mm lens. No text, no watermark.";
const SCENE_STYLE = "Photorealistic cinematic establishing shot, moody noir atmosphere, dramatic lighting, deep shadows, muted desaturated palette with warm amber accents, film grain, anamorphic feel. No people's faces in sharp focus, no text, no watermark.";

module.exports = {
  PORTRAIT_STYLE,
  SCENE_STYLE,
  prompts: {
    "rao-mansion": {
      suspects: {
        meera: "Elegant Indian woman, 48, in a deep purple silk saree with fine gold jewellery, hair in a low bun, weary guarded eyes, at an upscale Diwali party at night",
        arjun: "Polished Indian corporate executive man, 55, in an expensive bandhgala jacket, rimless glasses, salesman's half-smile that doesn't reach the eyes, Diwali party at night",
        divya: "Composed Indian woman, 31, tech executive, sleek straight dark hair, minimalist dark green kurta, precise unreadable expression, Diwali party at night"
      },
      intro: [
        "Grand modern Indian mansion at night during Diwali, strings of warm fairy lights and oil lamps on ledges, fireworks bursting in the sky above, guests as distant silhouettes on a lawn",
        "A dark wood-paneled study lit only by a doorway's spill of light, an overturned chair, a desk with scattered papers, ominous stillness, seen from the doorway",
        "Three polaroid photographs and a case file spread on a dark desk under a single desk lamp, red string and pins, detective's midnight workspace"
      ]
    },
    "suryagarh-sangeet": {
      suspects: {
        yashwant: "Proud Indian industrialist man, 57, heavy build, grey mustache, cream sherwani with a brocade stole, simmering resentment behind formal composure, palace wedding at night",
        kamini: "Sharp theatrical Indian woman, 55, in a rich magenta silk saree with heavy antique jewellery, knowing acid smile, palace courtyard at night",
        aditi: "Polished Indian event planner woman, 38, elegant fusion outfit with an earpiece and clipboard-poise, bright controlled client smile, palace wedding at night"
      },
      intro: [
        "Majestic Rajasthani heritage palace hotel at night decorated for a wedding sangeet, marigold garlands, lantern-lit sandstone arches, distant qawwali stage in a courtyard",
        "Monsoon downpour hammering an emptying palace courtyard at night, guests fleeing under arches, abandoned chairs and flowers in the rain, one lit window high in a tower",
        "A hall of mirrors in an old palace lit by a few candles, an overturned silver glass on a marble floor, ominous reflections repeating into darkness"
      ]
    },
    "studio-seven": {
      suspects: {
        prem: "Charismatic 1970s Bombay film hero, 35, slicked hair, open-collar patterned shirt with a scarf, practiced dazzling smile fraying at the edges, film studio at night, vintage 1970s photograph look",
        farooq: "Weary 1970s Bombay film producer, 50, heavyset, thick glasses, safari suit, cigarette smoke, calculating tired eyes, studio office at night, vintage 1970s photograph look",
        meenakshi: "Regal 1970s Bombay film star woman, 42, dramatic kohl-lined eyes, elaborate updo, silk saree and vintage jewellery, magnificent wounded pride, studio at night, vintage 1970s photograph look"
      },
      intro: [
        "1970s Bombay film studio exterior at night, huge arc lights blazing over a soundstage, rain machines spraying over a film set, vintage equipment and cables, period photograph feel",
        "A pitch-dark film editing room lit by a single torch beam, film reels and editing benches in shadow, one empty space on a shelf of labeled film canisters, 1970s period detail",
        "Three vintage photographs and a police file on a dark desk beside an old rotary telephone and film reel, single desk lamp, 1977 Bombay CID office at night"
      ]
    },
    "empty-frame": {
      suspects: {
        hendrik: "Gruff Dutch security chief, 55, ex-military bearing, short grey hair and mustache, dark suit with an earpiece, defensive jaw, museum gala at night",
        isabelle: "Precise French insurance assessor woman, 41, impeccable dark tailored suit, sleek hair, cool appraising gaze, faint amusement, museum gala at night",
        matteo: "Gentle Italian art restorer man, 36, soft eyes, slightly long artist's hair, fine-knit turtleneck under a blazer, reverent melancholy expression, museum gallery at night"
      },
      intro: [
        "Grand Amsterdam museum gallery at night during a black-tie gala, champagne guests as silhouettes, one small luminous Dutch Golden Age painting glowing on a dark wall",
        "Museum gallery bathed in dim red emergency lighting, empty ornate gilded frame hanging on the wall, velvet rope askew, eerie stillness",
        "Covered museum courtyard at night crowded with evacuated gala guests in evening wear seen from above as silhouettes, red alarm light washing the scene"
      ]
    },
    "gold-dust": {
      suspects: {
        astrid: "Norwegian elite cross-country skier woman, 25, athletic, pale blonde hair pulled back, national team jacket, controlled unreadable calm, snowy backdrop at dawn",
        bjorn: "Weathered Norwegian ski coach man, 52, wind-burned face, grey beard stubble, heavy team parka and beanie, grave paternal eyes, snowy backdrop",
        marta: "Practical Polish team physiotherapist woman, 39, fleece team jacket, hair in a quick bun, brisk warm face gone defensive, ski lodge interior"
      },
      intro: [
        "Norwegian winter mountain valley at dawn, cross-country ski trails, a small timber wax cabin with one lit window, aurora-tinged sky, deep snow",
        "Violent blizzard whiteout at night around a lone timber cabin, snow streaking horizontally through one weak light, a snowmobile half-buried",
        "A single sports drink bottle standing on a rough wooden workbench among ski wax and tools, cold morning light through a frosted window, ominous quiet"
      ]
    },
    "house-edge": {
      suspects: {
        emile: "Nervous young French croupier man, 34, slicked hair, immaculate casino dealer's waistcoat and bow tie, sweat at the temple, professional smile under strain, casino at night",
        rafael: "Suave Portuguese casino host man, 45, tailored midnight-blue velvet jacket, silver-streaked hair, practiced velvet charm, wounded elegance, casino salon at night",
        colette: "Dry French surveillance chief woman, 51, severe chic grey suit, reading glasses on a chain, unimpressed economical gaze, wall of monitors glowing behind her"
      },
      intro: [
        "Opulent Monte Carlo casino salon at night, chandeliers, a high-stakes baccarat table with stacked plaques, elegant crowd gathered watching in silhouette",
        "Dark casino surveillance suite, a wall of glowing monitors showing gaming floors, one empty chair, a champagne bottle standing untouched on the desk",
        "Collapsed champagne tower aftermath in a grand casino salon, broken glass glittering across marble under chandelier light, staff silhouettes rushing"
      ]
    },
    "dead-weight": {
      suspects: {
        ray: "Sun-worn American charter yacht captain, 54, salt-and-pepper beard, faded cap and open linen shirt, easy grin with hard eyes, marina at golden hour",
        lucia: "Sharp Cuban-American first mate woman, 33, athletic, dark hair in a braid, crew polo, streetwise guarded expression, yacht deck backdrop",
        dex: "Meticulous British-Nigerian marine engineer man, 41, wire-rim glasses, spotless coveralls, precise anxious expression, engine room backdrop"
      },
      intro: [
        "Luxury charter yacht hauled out on stilts in a Caribbean boatyard at dusk, palm trees, work lights, keel exposed, moody tropical sky",
        "Night scene at a Bahamian boatyard, blue-white welding light flickering from beneath a yacht's hull on stilts, distant string lights and a dockside party glow",
        "US Customs inspection at a Miami dock, a detection dog sitting alert beside a yacht's keel, agents as silhouettes, harsh floodlights, tension"
      ]
    },
    "false-turner": {
      suspects: {
        margaux: "Patrician English auction house director woman, 49, silver-streaked chignon, pearl earrings, impeccable tweed and silk, gracious steel gaze, saleroom backdrop",
        tom: "Earnest young British researcher man, 31, of Nigerian heritage, round glasses, slightly rumpled cardigan and tie, anxious scholarly expression, archive stacks backdrop",
        sophie: "Poised Swedish client liaison woman, 36, minimalist elegant cream suit, ash-blonde hair, serene discreet composure, auction house interior"
      },
      intro: [
        "Grand London auction house saleroom mid-auction, packed bidders, auctioneer's rostrum, a dramatic Turner-style storm watercolour spotlit on an easel",
        "Flooded basement archive, dark water covering the floor reflecting a hanging bulb, document boxes on shelves rising from the water, burst pipe dripping",
        "A single old letter under ultraviolet light in a dark forensics lab, a ghostly watermark glowing in the paper, gloved hands at the edges"
      ]
    },
    "scrubbed": {
      suspects: {
        hannah: "American flight director woman, 44, mission-control polo and lanyard, headset around neck, crisp exhausted authority, launch control room glow",
        marcus: "Quiet American propulsion engineer man, 38, wire glasses, company badge, cleanroom-neat appearance, calm deliberate expression of someone who has decided something, lab backdrop",
        yuri: "Former Russian cosmonaut man, 58, silver crew cut, weathered charismatic face, expensive casual blazer over a flight-heritage polo, storyteller's twinkle, desert facility backdrop"
      },
      intro: [
        "Private aerospace launch site in the Mojave desert at dusk, a sleek white rocket on the pad with service tower, floodlights coming on, mountains behind",
        "Aerospace cleanroom at night, figures in white bunny suits, gleaming rocket valve assembly on a stand, one airlock door sealed with red tags, sterile eerie light",
        "Rocket engine valve component glowing faint fluorescent green under UV inspection light in a dark lab, investigators' gloved hands, ominous discovery"
      ]
    }
  }
};
