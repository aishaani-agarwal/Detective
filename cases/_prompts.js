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
    },
    "pit-lane": {
      suspects: {
        tomas: "Spanish chief mechanic man, 47, grey moustache, team polo shirt and headset around neck, gruff weathered face, motorsport garage at night",
        dani: "Young Spanish racing driver man, 21, race suit unzipped to the waist, damp hair, cocky brittle expression, pit lane at dusk",
        elena: "Spanish race engineer woman, 34, team softshell jacket, hair tied back, headset, analytical unsmiling face, pit wall with screens"
      }
    },
    "deep-freeze": {
      suspects: {
        ingvild: "Norwegian polar station leader woman, 51, weathered face, thermal layers and unzipped red parka, calm authority, Antarctic station interior",
        priya: "Indian glaciologist woman, 38, fleece and beanie, glasses fogged at the edge, warm anxious expression, polar laboratory",
        rune: "Norwegian station engineer man, 44, heavy beard, oil-marked overalls over thermals, dry weathered face, generator shed"
      }
    },
    "box-114": {
      suspects: {
        joana: "Portuguese bank manager woman, 52, tailored navy suit, short greying hair, formal composed expression, marble bank interior",
        marta: "Portuguese woman, 36, dark coat and simple jewellery, sharp guarded expression, bank lobby",
        rui: "Portuguese bank clerk man, 41, glasses, shirtsleeves and tie, mild helpful face, vault corridor with deposit boxes"
      }
    },
    "the-understudy": {
      suspects: {
        lukas: "Austrian stage manager man, 49, dark clothes, headset, clipboard, harried precise face, backstage of a concert hall",
        anneke: "Dutch concert violinist woman, 33, black concert gown, hair up, poised strained expression, concert hall wings",
        nina: "Austrian orchestral violinist woman, 29, black concert dress, hair in a low bun, quiet watchful face, orchestra pit lighting"
      }
    },
    "ghost-wards": {
      suspects: {
        lorna: "Filipina hospital billing supervisor woman, 45, office blouse and lanyard, hair clipped up, harried defensive face, hospital admin office",
        ramon: "Filipino records officer man, 38, glasses, polo shirt and ID badge, anxious careful expression, server room",
        emil: "Filipino hospital director man, 56, white coat over shirt and tie, greying moustache, warm authoritative face, hospital corridor"
      }
    },
    "slack-water": {
      suspects: {
        morag: "Scottish woman, 54, wool jumper and scarf, greying hair pinned back, contained grieving face, window with grey sea behind",
        lena: "German woman, 41, walking jacket and short practical hair, watchful reserved expression, coastal hotel lounge",
        dougal: "Scottish groundsman man, 47, waxed jacket and moustache, weathered ruddy face, slow steady gaze, island shoreline at dusk"
      }
    },
    "green-room": {
      suspects: {
        dev: "British-Indian tour manager man, 43, glasses, laminate pass and black jacket, exhausted alert face, festival backstage at night",
        saff: "Young Black British security supervisor woman, 30, hi-vis over black, hair braided back, direct unsentimental face, festival gate at night",
        joss: "Young British DJ man, 27, streetwear and chains, fresh fade, charming quick smile, festival compound at night"
      }
    },
    "service": {
      suspects: {
        freja: "Danish sous chef woman, 31, chef whites with sleeves rolled, hair scraped back, sharp tired face, stainless steel kitchen at night",
        ivan: "Bulgarian electrician man, 56, grey moustache, work jacket and tool belt, careful guarded expression, dim service corridor",
        mads: "Danish restaurateur man, 49, well-cut dark shirt, greying hair swept back, practised charming smile, empty dining room at night"
      }
    },
    "vintage": {
      suspects: {
        hugo: "Young French man, 34, expensive rumpled shirt, tousled hair, faintly petulant expression, chateau interior",
        yves: "Old French cellar master, 61, weathered face and white moustache, worn work coat, proud stubborn gaze, barrel cellar by lamplight",
        claire: "French estate manager woman, 42, tailored blazer, hair in a neat twist, composed commercial expression, chateau office"
      }
    },
    "the-scholarship": {
      suspects: {
        denise: "African-American financial aid officer woman, 39, cardigan and lanyard, warm tired face, cluttered campus office",
        tarun: "Indian-American systems analyst man, 33, glasses, plain shirt, literal unsmiling expression, screens glowing behind",
        gregory: "American university administrator man, 57, blazer and tie, silver hair and moustache, avuncular confident face, wood-panelled office"
      }
    },
    "proof": {
      suspects: {
        isla: "Scottish distillery manager woman, 46, quilted jacket over shirt, hair tied back, measured commercial expression, warehouse of casks",
        ewan: "Older Scottish warehouseman, 58, flat cap and work coat, weathered dry face, dim bonded warehouse",
        dougie: "Scottish distiller man, 52, glasses, wool jumper, quiet thoughtful face, copper stills behind him"
      }
    },
    "second-serve": {
      suspects: {
        valeria: "Argentine tournament director woman, 48, smart blazer with accreditation pass, dark hair up, brisk political expression, stadium corridor",
        nico: "Young Argentine tennis player man, 24, damp hair and training top, proud defensive expression, clay court at dusk",
        matias: "Argentine chair umpire man, 41, glasses, official polo shirt and cap, formal composed face, umpire's chair"
      }
    },
    "the-relay": {
      suspects: {
        thandiwe: "South African control room supervisor woman, 43, hi-vis vest over blouse, hair braided back, sharp procedural expression, wall of control screens",
        kagiso: "Young South African technician man, 29, hard hat and hi-vis, wary guarded face, electrical substation yard",
        pieter: "South African engineer man, 51, grey moustache, hi-vis over shirt, dry senior expression, substation switchgear"
      }
    },
    "airside": {
      suspects: {
        yusuf: "British-Nigerian loadmaster man, 45, hi-vis over flight crew shirt, headset around neck, weary precise face, cargo aircraft hold",
        orla: "Young Irish groom woman, 27, padded gilet and yard boots, hair tied back, blunt direct expression, horse transport crate on apron",
        dermot: "Irish ground handling supervisor man, 50, glasses, hi-vis jacket, chatty open face, floodlit airport apron at night"
      }
    }
  }
};
