// ============================================================
// IMAGE PROMPTS — server-side. One portrait prompt per suspect,
// one scene prompt per intro panel. Used by /api/image, which
// generates each image ONCE and caches it to public/generated/.
// ============================================================

const PORTRAIT_STYLE = "Photorealistic character portrait photograph, chest-up, subject looking at camera with a guarded expression, dramatic low-key noir lighting from one side, deep shadows, muted desaturated colors with warm amber accents, dark blurred background, cinematic film grain, shot on 85mm lens. No text, no watermark.";

module.exports = {
  PORTRAIT_STYLE,
  prompts: {
    "rao-mansion": {
      suspects: {
        meera: "Elegant Indian woman, 48, in a deep purple silk saree with fine gold jewellery, hair in a low bun, weary guarded eyes, at an upscale Diwali party at night",
        arjun: "Polished Indian corporate executive man, 55, in an expensive bandhgala jacket, rimless glasses, salesman's half-smile that doesn't reach the eyes, Diwali party at night",
        divya: "Composed Indian woman, 31, tech executive, sleek straight dark hair, minimalist dark green kurta, precise unreadable expression, Diwali party at night"
      }
      },
    "suryagarh-sangeet": {
      suspects: {
        yashwant: "Proud Indian industrialist man, 57, heavy build, grey mustache, cream sherwani with a brocade stole, simmering resentment behind formal composure, palace wedding at night",
        kamini: "Sharp theatrical Indian woman, 55, in a rich magenta silk saree with heavy antique jewellery, knowing acid smile, palace courtyard at night",
        aditi: "Polished Indian event planner woman, 38, elegant fusion outfit with an earpiece and clipboard-poise, bright controlled client smile, palace wedding at night"
      }
      },
    "studio-seven": {
      suspects: {
        prem: "Charismatic 1970s Bombay film hero, 35, slicked hair, open-collar patterned shirt with a scarf, practiced dazzling smile fraying at the edges, film studio at night, vintage 1970s photograph look",
        farooq: "Weary 1970s Bombay film producer, 50, heavyset, thick glasses, safari suit, cigarette smoke, calculating tired eyes, studio office at night, vintage 1970s photograph look",
        meenakshi: "Regal 1970s Bombay film star woman, 42, dramatic kohl-lined eyes, elaborate updo, silk saree and vintage jewellery, magnificent wounded pride, studio at night, vintage 1970s photograph look"
      }
      },
    "empty-frame": {
      suspects: {
        hendrik: "Gruff Dutch security chief, 55, ex-military bearing, short grey hair and mustache, dark suit with an earpiece, defensive jaw, museum gala at night",
        isabelle: "Precise French insurance assessor woman, 41, impeccable dark tailored suit, sleek hair, cool appraising gaze, faint amusement, museum gala at night",
        matteo: "Gentle Italian art restorer man, 36, soft eyes, slightly long artist's hair, fine-knit turtleneck under a blazer, reverent melancholy expression, museum gallery at night"
      }
      },
    "gold-dust": {
      suspects: {
        astrid: "Norwegian elite cross-country skier woman, 25, athletic, pale blonde hair pulled back, national team jacket, controlled unreadable calm, snowy backdrop at dawn",
        bjorn: "Weathered Norwegian ski coach man, 52, wind-burned face, grey beard stubble, heavy team parka and beanie, grave paternal eyes, snowy backdrop",
        marta: "Practical Polish team physiotherapist woman, 39, fleece team jacket, hair in a quick bun, brisk warm face gone defensive, ski lodge interior"
      }
      },
    "house-edge": {
      suspects: {
        emile: "Nervous young French croupier man, 34, slicked hair, immaculate casino dealer's waistcoat and bow tie, sweat at the temple, professional smile under strain, casino at night",
        rafael: "Suave Portuguese casino host man, 45, tailored midnight-blue velvet jacket, silver-streaked hair, practiced velvet charm, wounded elegance, casino salon at night",
        colette: "Dry French surveillance chief woman, 51, severe chic grey suit, reading glasses on a chain, unimpressed economical gaze, wall of monitors glowing behind her"
      }
      },
    "dead-weight": {
      suspects: {
        ray: "Sun-worn American charter yacht captain, 54, salt-and-pepper beard, faded cap and open linen shirt, easy grin with hard eyes, marina at golden hour",
        lucia: "Sharp Cuban-American first mate woman, 33, athletic, dark hair in a braid, crew polo, streetwise guarded expression, yacht deck backdrop",
        dex: "Meticulous British-Nigerian marine engineer man, 41, wire-rim glasses, spotless coveralls, precise anxious expression, engine room backdrop"
      }
      },
    "false-turner": {
      suspects: {
        margaux: "Patrician English auction house director woman, 49, silver-streaked chignon, pearl earrings, impeccable tweed and silk, gracious steel gaze, saleroom backdrop",
        tom: "Earnest young British researcher man, 31, of Nigerian heritage, round glasses, slightly rumpled cardigan and tie, anxious scholarly expression, archive stacks backdrop",
        sophie: "Poised Swedish client liaison woman, 36, minimalist elegant cream suit, ash-blonde hair, serene discreet composure, auction house interior"
      }
      },
    "scrubbed": {
      suspects: {
        hannah: "American flight director woman, 44, mission-control polo and lanyard, headset around neck, crisp exhausted authority, launch control room glow",
        marcus: "Quiet American propulsion engineer man, 38, wire glasses, company badge, cleanroom-neat appearance, calm deliberate expression of someone who has decided something, lab backdrop",
        yuri: "Former Russian cosmonaut man, 58, silver crew cut, weathered charismatic face, expensive casual blazer over a flight-heritage polo, storyteller's twinkle, desert facility backdrop"
      }
      },
    "closing-time": {
      suspects: {
        vivienne: "Jazz singer woman, 44, mixed heritage, sequinned dark gown, hair up, tired knowing eyes, backstage of a dim club at night",
        teddy: "Older American bartender man, 61, white moustache, rolled shirtsleeves and waistcoat, weathered kind face, behind a dark bar",
        roland: "American club manager man, 39, slicked hair, open collar and loosened tie, ingratiating smile that doesn't reach the eyes, dim club interior"
      }
    },
    "salt-and-silver": {
      suspects: {
        anselmo: "Elderly Spanish priest, 63, black cassock, wire glasses, thin severe face, candlelit cathedral sacristy",
        ignacio: "Spanish security chief man, 45, close beard, dark uniform polo with radio, defensive stance, cathedral cloister at dusk",
        beatriz: "Spanish art conservator woman, 38, hair tied back, nitrile gloves and lab coat over dark clothes, cool appraising gaze, conservation studio"
      }
    },
    "quiet-car": {
      suspects: {
        renata: "English insurance loss adjuster woman, 41, sharp grey trouser suit, short blonde hair, unreadable composure, train first-class interior",
        marco: "Swiss-Italian train manager man, 52, railway uniform and cap, greying moustache, weary official expression, train corridor",
        silvan: "Young Swiss courier man, 34, dark suit, neat side part, controlled blank expression, train compartment at night"
      }
    },
    "night-shift": {
      suspects: {
        fiona: "Australian intensive care doctor woman, 47, scrubs and lanyard, hair pinned back, exhausted authority, hospital corridor at night",
        ari: "Young Australian male nurse, 29, Middle Eastern heritage, scrubs, warm anxious face, hospital ward at night",
        grant: "Australian anaesthetic technician man, 38, theatre scrubs and cap around neck, moustache, dry guarded expression, hospital theatre suite"
      }
    },
    "cold-chain": {
      suspects: {
        wim: "Dutch crane operator man, 55, high-visibility jacket over fleece, grey moustache, blunt weathered face, container port at night",
        yasmin: "Dutch-Moroccan customs inspector woman, 33, uniform jacket with badge, dark hair tied back, sharp guarded expression, port terminal",
        ruud: "Dutch refrigeration technician man, 41, work overalls, wire glasses, talkative open face, refrigerated container stack at night"
      }
    },
    "ledger": {
      suspects: {
        jiwoo: "Korean security engineer man, 36, glasses, plain dark hoodie over shirt, literal unsmiling expression, server room glow",
        claire: "Korean-American compliance officer woman, 44, immaculate charcoal suit, hair in a low bun, polished corporate composure, glass office at night",
        daehyun: "Korean executive man, 49, late forties, dark suit and tie, grey at the temples, measured authoritative gaze, corporate boardroom at night"
      }
    }
  }
};
