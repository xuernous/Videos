"""Build story/shots.json from the shot plan below. Each shot starts 0.12 s before its anchor words
(matched in order against timeline/words.json). Run: python projects/japao/story/build_shots.py"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__)); PROJ = os.path.dirname(HERE)
words = json.load(open(os.path.join(PROJ, "timeline/words.json"), encoding="utf-8"))
words = words.get("words", words) if isinstance(words, dict) else words
cfg = json.load(open(os.path.join(PROJ, "config.json")))
DUR = round(cfg["duration"] + 1.5, 2)
norm = lambda s: re.sub(r"[^\wà-ÿō]", "", s.lower())
W = [norm(w["word"]) for w in words]

def S(*names):  # sfx helper: "name@at:gain"
    out = []
    for n in names:
        nm, rest = n.split("@"); at, gain = rest.split(":")
        out.append({"at": float(at), "name": nm, "gain": float(gain)})
    return out

A = lambda n, g: {"name": n, "gain": g}
CUT = {"type": "cut"}
F = lambda d=0.35: {"type": "flash", "dur": d}
D = lambda d=0.6: {"type": "dip", "dur": d}
FD = lambda d=0.6: {"type": "fade", "dur": d}
WH = lambda d=1: {"type": "whip", "dur": 0.35, "dir": d}
Z = {"type": "zoom", "dur": 0.45}

# (id, anchor words, set, scene, extra)
PLAN = [
 # ---------------- COLD OPEN: the chronicle ----------------
 ("s001", "existe um documento", "archive", "Dark archive, lone lectern under a lamp, the chronicle; slow push", {"amb": A("roomtone", -26), "sfx": S("riser@0.5:-18")}),
 ("s002", "é a crônica", "archive", "Insert: chronicle cover, black wolf on red seal, dust", {"sfx": S("swish@0.1:-14")}),
 ("s003", "um império que", "map", "Map: Kezhar territory across the sea crumbles to dust", {"bars": "none", "sfx": S("wind@0.0:-20")}),
 ("s004", "em oito páginas", "archive", "Eight pages fan out, each with a scraped smear; 8 counter", {"sfx": S("blip@0.4:-14", "counter@0.6:-16")}),
 ("s005", "alguém raspou um", "archive", "Macro: a blade scraping parchment", {"sfx": S("swish@0.6:-12")}),
 ("s006", "não rasgou", "archive", "Page: tear line drawn, then crossed out", {"sfx": S("blip@0.2:-14")}),
 ("s007", "não queimou", "archive", "Page: flame icon, crossed out", {"sfx": S("blip@0.2:-14")}),
 ("s008", "raspou", "archive", "Macro: blade scrapes, shavings fly", {"sfx": S("swish@0.1:-10")}),
 ("s009", "letra por letra", "archive", "Letters vanish one by one", {"sfx": S("tick@0.2:-14", "tick@0.5:-14", "tick@0.8:-14")}),
 ("s010", "como quem tenta", "archive", "The scraped name morphs into a man's silhouette being erased", {"sfx": S("shimmer@0.5:-16")}),
 ("s011", "sob luz ultravioleta", "archive", "Researcher switches on a UV lamp; violet light floods the page", {"bars": "scope", "sfx": S("buzz@0.3:-14")}),
 ("s012", "o nome voltou", "archive", "UV insert: KUROZANE NO HAYATO glows violet", {"bars": "scope", "in": F(), "sfx": S("riser@0.0:-14", "stinger@2.2:-8")}),
 ("s013", "os registros japoneses", "archive", "Japanese scroll, 1019 label", {"sfx": S("pop@0.4:-14")}),
 ("s014", "falam apenas de", "map", "Blueprint: a few pirate boats arrive and are repelled", {"bars": "none", "sfx": S("blip@0.5:-14")}),
 ("s015", "a crônica de kezhar conta", "archive", "Thin scroll vs thick chronicle; push to the chronicle", {}),
 ("s016", "fala de uma frota", "sea", "Dusk sea, sails cover the horizon", {"amb": A("wind", -22), "sfx": S("whoosh@0.2:-14")}),
 ("s017", "e de generais", "roster", "Roster: general silhouettes appear one after another", {"bars": "none", "sfx": S("pop@0.3:-14", "pop@0.7:-14", "pop@1.1:-14", "pop@1.5:-14")}),
 ("s018", "para caçar uma", "hill", "A single small figure on a hill at night, wind", {"amb": A("wind", -20)}),
 ("s019", "e conta que", "roster", "Roster: each general crossed with a red slash", {"bars": "none", "sfx": S("hit@0.5:-10", "hit@0.9:-10", "hit@1.3:-10", "hit@1.7:-10", "impact@2.4:-8")}),
 ("s020", "os historiadores dizem", "study", "Modern study: historians shake heads, stamp LENDA", {"amb": A("roomtone", -26), "sfx": S("hit@1.6:-10")}),
 ("s021", "o império que ele", "archive", "Chronicle: the 8 scraped names glow; push to the wolf seal", {"sfx": S("riser@0.4:-14")}),
 # ---------------- IKI ----------------
 ("s022", "primavera de 1019", "coast", "Title card over Iki at dawn: KUROZANE NO HAYATO / PRIMAVERA DE 1019", {"bars": "scope", "in": FD(0.8), "amb": A("wind", -24), "sfx": S("stinger@0.2:-8"), "captions": False}),
 ("s023", "iki era uma", "island3d", "3D orbit of a small island with jade bays", {"kind": "3d", "amb": A("wind", -24)}),
 ("s024", "guardada por apenas", "coast", "Thirty warriors in a line on the beach, counter 30", {"sfx": S("counter@0.8:-16")}),
 ("s025", "naquela época samurai", "blueprint", "Blueprint: SAMURAI = AQUELE QUE SERVE, not a title", {"bars": "none", "in": Z, "sfx": S("pop@0.5:-14")}),
 ("s026", "era quem servia", "coast", "Hayato bows before Sadayuki, warm dawn", {}),
 ("s027", "hayato tinha vinte", "coast", "Hayato medium on the beach, wind; 24 ANOS", {"sfx": S("pop@0.8:-14")}),
 ("s028", "um arco certeiro", "coast", "Hayato draws the bow, arrow hits a target", {"sfx": S("swish@0.9:-10", "hit@1.2:-10")}),
 ("s029", "e a tachi", "coast", "Insert: the tachi in its clean sheath, gleam", {"sfx": S("shimmer@0.3:-16")}),
 ("s030", "conhecia cada um", "campfire", "The thirty around a fire at night, pan across faces", {"amb": A("murmur", -26)}),
 ("s031", "o velho comandante", "campfire", "Sadayuki speaks softly; name card", {}),
 ("s032", "e jirō seu", "campfire", "Jiro grins and claps Hayato's shoulder", {}),
 ("s033", "que perdia todas", "campfire", "Dice: Jiro loses, pours saké for Hayato", {"sfx": S("tick@0.6:-12", "tick@0.75:-12")}),
 ("s034", "do outro lado", "map", "Map: Iki, the sea, the continent", {"bars": "none", "in": WH(1), "sfx": S("whoosh@0.0:-12")}),
 ("s035", "o império de kezhar", "map", "Map: Kezhar red spreading over kingdoms, 3 GERAÇÕES", {"bars": "none", "sfx": S("counter@0.8:-16")}),
 ("s036", "tinha cavalaria pesada", "plain", "Kezhar heavy cavalry charging at dusk", {"amb": A("wind", -22), "sfx": S("impact@0.2:-14")}),
 ("s037", "engenheiros", "plain", "Siege engines and engineers", {}),
 ("s038", "uma frota tomada", "sea", "Ships with sails of vanished peoples, ghostly", {}),
 ("s039", "e escribas que", "scriptorium", "Scribes writing by candlelight: the Escreventes", {"amb": A("roomtone", -26)}),
 ("s040", "no topo o", "throne", "Throne hall, Tarvos on the throne, wolf banners", {"bars": "scope", "sfx": S("stinger@0.3:-10")}),
 ("s041", "que nunca tinha", "throne", "Tarvos close-up smirk, crown; 0 DERROTAS", {"bars": "scope"}),
 ("s042", "e que agora", "throne", "Tarvos closes his fist over the sea on a map table", {"bars": "scope", "sfx": S("hit@1.0:-10")}),
 ("s043", "naquela manhã o", "coast", "Sadayuki points north; Hayato nods and rides off", {"in": D(0.5), "amb": A("wind", -24)}),
 ("s044", "na volta do", "hill", "Hayato on horseback on a hilltop", {}),
 ("s045", "ele viu as", "hill", "Hayato close-up, shocked", {"sfx": S("riser@0.0:-14")}),
 ("s046", "primeiro dezenas", "sea", "Dozens of sails on the horizon", {"sfx": S("impact@0.1:-12")}),
 ("s047", "depois centenas", "sea", "Pull back: hundreds of sails", {"sfx": S("impact@0.1:-10")}),
 ("s048", "nos mastros um", "sea", "Insert: black wolf on red banner flapping", {"bars": "scope", "sfx": S("whoosh@0.2:-14")}),
 # ---------------- THE ATTACK ----------------
 ("s049", "quando chegou era", "coast", "Hayato gallops down; smoke over the village", {"amb": A("wind", -20), "sfx": S("whoosh@0.1:-12")}),
 ("s050", "eram trinta contra", "coast", "30 small defenders vs a horde; 30 vs MILHARES", {"sfx": S("impact@0.3:-10")}),
 ("s051", "uma flecha derrubou", "coast", "Arrow hits the horse; slow fall", {"sfx": S("swish@0.3:-8", "slowmo@0.5:-12")}),
 ("s052", "e ele caiu", "grass", "Hayato in mud, hidden by tall grass", {"sfx": S("hit@0.1:-8")}),
 ("s053", "ouviu tudo", "grass", "Hayato close-up in the grass, eyes wide", {"sfx": S("heartbeat@0.0:-10")}),
 ("s054", "os gritos", "grass", "Through grass blades: silhouettes and fire glow", {"sfx": S("murmur@0.0:-14")}),
 ("s055", "o fogo", "coast", "Village roofs burning, embers", {"sfx": S("impact@0.0:-12")}),
 ("s056", "depois o silêncio", "coast", "Smoke, ash falling, empty beach", {"in": D(0.4)}),
 ("s057", "à noite encontrou", "beach", "Night beach, moon: the covered fallen in a row; Hayato walks", {"bars": "scope", "in": D(0.8), "amb": A("wind", -24)}),
 ("s058", "contados como mercadoria", "beach", "Insert: chalk tally marks on a plank", {"bars": "scope", "sfx": S("tick@0.3:-12", "tick@0.5:-12", "tick@0.7:-12")}),
 ("s059", "jirō estava no", "beach", "Hayato kneels at the end of the row; blue sleeve", {"bars": "scope"}),
 ("s060", "ninguém respirava", "beach", "Wide still beach, waves, moon", {"bars": "scope"}),
 ("s061", "hayato enterrou os", "ravine", "Ravine: Hayato placing stones on cairns", {"amb": A("wind", -24)}),
 ("s062", "levou a noite", "ravine", "Time-lapse: moon arcs, 30 cairns, dawn", {"sfx": S("clock@0.0:-18")}),
 ("s063", "a culpa de", "ravine", "Hayato close-up, grief", {}),
 ("s064", "depois pegou o", "ravine", "Insert: Jiro's bow, counting arrows", {}),
 ("s065", "eram onze", "ravine", "Eleven arrows in a row; counter 11", {"sfx": S("counter@0.0:-14")}),
 # ---------------- ORDEK ----------------
 ("s066", "durante nove noites", "camp", "Enemy camp from the hill, Hayato silhouette fg; NOITE 1..9", {"in": D(0.5), "amb": A("wind", -24), "sfx": S("tick@0.5:-14")}),
 ("s067", "o general ordek", "camp", "Ordek intro, helmet; name card", {"sfx": S("stinger@0.2:-12")}),
 ("s068", "saía sozinho todas", "camp", "Ordek walks alone to the palisade, looks at the sea", {}),
 ("s069", "na décima noite", "camp", "Moonless sky; NOITE 10", {"sfx": S("tick@0.3:-12")}),
 ("s070", "hayato subiu numa", "camp", "Hayato climbs a tree", {}),
 ("s071", "tinha onze flechas", "camp", "Insert: quiver with 11 arrows", {}),
 ("s072", "usou uma", "camp", "Freeze: the arrow hangs mid-flight over the palisade", {"bars": "scope", "in": F(), "sfx": S("freeze@0.0:-8", "swish@0.6:-10")}),
 ("s073", "mas a crônica", "scriptorium", "Chronicle page: scribe writing", {"sfx": S("swish@0.1:-16")}),
 ("s074", "os oficiais de", "beach", "Ten villagers kneel by torchlight; cut before violence; 10", {"bars": "scope", "sfx": S("impact@1.5:-12")}),
 ("s075", "hayato assistiu do", "camp", "Hayato close-up in leaves, horror", {}),
 ("s076", "entendeu que cada", "blueprint", "Blueprint scale: 1 arrow vs 10 lives", {"bars": "none", "sfx": S("blip@0.4:-14")}),
 ("s077", "e nem sempre", "blueprint", "Scale tips toward the villagers", {"bars": "none"}),
 ("s078", "então decidiu que", "camp", "Hayato determined, torchlight; red wolf", {"sfx": S("riser@0.5:-14")}),
 ("s079", "de madrugada com", "dawn", "Macro: knife cuts a notch into the sheath at dawn", {"sfx": S("swish@1.6:-10")}),
 ("s080", "não era orgulho", "dawn", "Hayato's face, still", {}),
 ("s081", "era uma conta", "dawn", "Sheath with the notch", {}),
 ("s082", "primeira marca", "mark", "Mark I: numeral, roster Ordek crossed", {"bars": "scope", "sfx": S("impact@0.3:-8")}),
 # ---------------- SAYO ----------------
 ("s083", "foi então que", "temple", "Burned temple ruins; Hayato walks", {"in": D(0.5), "amb": A("wind", -24)}),
 ("s084", "uma menina de", "temple", "Top-down into a dry well: Sayo looks up", {}),
 ("s085", "a mãe nunca", "temple", "Sayo close-up, sad", {}),
 ("s086", "ela olhou para", "temple", "OTS: Sayo looks up at Hayato", {}),
 ("s087", "você é dos", "temple", "Sayo close-up asks", {}),
 ("s088", "ele não soube", "temple", "Hayato close-up, conflicted", {}),
 ("s089", "hayato a levou", "hills", "Hills: the tall figure and the small one walk", {"amb": A("wind", -24)}),
 ("s090", "ensinou-a a andar", "forest", "Forest: both tiptoe", {}),
 ("s091", "e a apagar", "forest", "Campfire smothered with earth, no smoke", {}),
 ("s092", "ela em troca", "forest", "Sayo talks and talks, Hayato listens", {}),
 ("s093", "era a primeira", "forest", "Hayato close-up, softening", {}),
 ("s094", "e numa noite", "forest", "Night fire, Sayo begins to sing, stars", {"amb": A("wind", -28)}),
 ("s095", "da lama ele", "forest", "Lyrics over Sayo singing", {}),
 ("s096", "cada nome que", "forest", "Lyrics over the sheath and the sea", {}),
 # ---------------- HARSA ----------------
 ("s097", "o exército já", "map", "Map: north Kyushu turns red", {"bars": "none", "in": D(0.4), "sfx": S("impact@0.4:-14")}),
 ("s098", "nas planícies comandava", "plain", "Harsa on horseback; name card", {"amb": A("wind", -22), "sfx": S("stinger@0.3:-12")}),
 ("s099", "a senhora dos", "plain", "Cavalry sweeps a village", {"sfx": S("impact@0.3:-12")}),
 ("s100", "ninguém vencia cavalaria", "blueprint", "Blueprint: cavalry arrows crush infantry in open field", {"bars": "none"}),
 ("s101", "então hayato escolheu", "paddies", "Hayato at the edge of flooded rice paddies", {}),
 ("s102", "provocou harsa até", "paddies", "Hayato shoots; cavalry pursue into the paddies", {"sfx": S("swish@0.6:-10")}),
 ("s103", "onde a lama", "blueprint", "Cross-section: water, mud, deep holes", {"bars": "none"}),
 ("s104", "a cavalaria afundou", "paddies", "Horses sink, splashes", {"sfx": S("impact@0.2:-8")}),
 ("s105", "e ele atirou", "paddies", "Hayato gallops and shoots, speed lines", {"sfx": S("swish@0.4:-10", "swish@0.9:-10")}),
 ("s106", "como seus companheiros", "paddies", "Ghosts of the thirty ride beside him", {"sfx": S("shimmer@0.2:-14")}),
 ("s107", "segunda marca", "mark", "Mark II", {"bars": "scope", "sfx": S("impact@0.3:-8")}),
 # ---------------- THE COURT / KURAI-ONI ----------------
 ("s108", "numa estrada ele", "road", "Road: Hayato stops a messenger with his bow", {"in": D(0.4), "amb": A("wind", -24)}),
 ("s109", "a carta da", "road", "Insert: the court letter unrolls", {}),
 ("s110", "deliberado depois das", "road", "Letter text, Hayato's fist crushes it", {"sfx": S("hit@2.6:-12")}),
 ("s111", "naquela noite sayo", "forest", "Campfire: Sayo asks, Hayato stares into the fire", {"amb": A("wind", -28)}),
 ("s112", "ninguém está vindo", "forest", "Hayato close-up: 'Ninguém está vindo'", {}),
 ("s113", "os invasores começaram", "camp", "Soldiers whisper at a fire, eyes on the dark forest", {}),
 ("s114", "o demônio escuro", "forest", "KURAI-ONI glows red over the dark forest; eyes", {"bars": "scope", "sfx": S("stinger@0.0:-8")}),
 # ---------------- VELKUN ----------------
 ("s115", "velkun o engenheiro", "fort", "Velkun with fort blueprints; name card", {"sfx": S("stinger@0.2:-12")}),
 ("s116", "ergueu em hakata", "fort", "Massive wooden fort on the coast at night", {"amb": A("wind", -22)}),
 ("s117", "hayato não invadiu", "fort", "Hayato on a ridge watching", {}),
 ("s118", "primeiro libertou os", "fort", "Hayato cuts the prisoners' ropes; they flee", {"sfx": S("swish@0.8:-12")}),
 ("s119", "depois numa noite", "fort", "Wind: grass and banners whip", {"amb": A("wind", -16)}),
 ("s120", "disparou seis flechas", "fort", "Six fire arrows arc into the warehouses; 6", {"sfx": S("swish@0.4:-10", "swish@0.9:-10", "swish@1.4:-10")}),
 ("s121", "o fogo encontrou", "blueprint", "Chain: fire → oil", {"bars": "none", "sfx": S("blip@0.3:-12")}),
 ("s122", "o óleo encontrou", "blueprint", "Chain: oil → pitch → blast", {"bars": "none", "sfx": S("impact@0.9:-8")}),
 ("s123", "o forte queimou", "fort", "Fort ablaze; Velkun's silhouette in the tower", {"sfx": S("impact@0.0:-10")}),
 ("s124", "terceira marca", "mark", "Mark III", {"bars": "scope", "sfx": S("impact@0.3:-8")}),
 # ---------------- SABETH ----------------
 ("s125", "o império mandou", "forest", "Sabeth, hooded, with hounds; name card", {"in": D(0.4), "amb": A("wind", -24), "sfx": S("stinger@0.2:-12")}),
 ("s126", "com seus cães", "forest", "Hounds and trackers sniff through the forest", {}),
 ("s127", "ele nunca tinha", "forest", "Sabeth close-up smirk", {}),
 ("s128", "em quatro dias", "forest", "Footprints in mud; DIA 4", {"sfx": S("tick@0.5:-12")}),
 ("s129", "e o de", "forest", "Small footprints beside them", {"sfx": S("heartbeat@0.0:-10")}),
 ("s130", "pela primeira vez", "forest", "Hayato close-up, fear", {}),
 ("s131", "escondeu sayo numa", "waterfall", "Waterfall: Hayato leads Sayo behind the falls", {"amb": A("rain", -22)}),
 ("s132", "se eu não", "waterfall", "Cave: Hayato kneels: 'Se eu não voltar...'", {"amb": A("rain", -24)}),
 ("s133", "depois deixou que", "forest", "Hayato steps into the open, breaks a branch on purpose", {"amb": A("wind", -24)}),
 ("s134", "por seis dias sabeth", "forest", "Chase: hounds run through the forest; DIA 1..6", {"sfx": S("whoosh@0.2:-12")}),
 ("s135", "por seis dias hayato", "map", "Top-down: dotted trail led to a clearing", {"bars": "none"}),
 ("s136", "o último rastreador", "forest", "Dark forest, the last tracker hides", {}),
 ("s137", "o que é", "forest", "Sabeth close-up shouting", {"sfx": S("stinger@0.0:-10")}),
 ("s138", "a floresta não", "forest", "Silent forest, mist", {"sfx": S("wind@0.0:-16")}),
 ("s139", "quarta marca", "mark", "Mark IV", {"bars": "scope", "sfx": S("impact@0.3:-8")}),
 ("s140", "quando hayato voltou", "waterfall", "Sayo steps out from behind the falls", {"amb": A("rain", -24)}),
 ("s141", "não tinha ido", "waterfall", "Hayato kneels, Sayo hugs him", {"sfx": S("shimmer@0.2:-16")}),
 # ---------------- FEAR / GORUUN ----------------
 ("s142", "os soldados pararam", "camp", "Soldiers huddle by the fire, darkness around", {"in": D(0.4), "amb": A("wind", -24)}),
 ("s143", "as fogueiras ficavam", "camp", "Fires burn until dawn (time-lapse)", {}),
 ("s144", "o império mais", "camp", "Soldier close-up, terrified of the dark", {}),
 ("s145", "então veio goruun", "bridge", "Goruun the giant with his mace; name card", {"sfx": S("impact@0.2:-10"), "amb": A("wind", -24)}),
 ("s146", "campeão do exército", "bridge", "The bridge over the river; Goruun waits; soldiers on the bank", {}),
 ("s147", "por sete dias", "bridge", "DIA 1..7; soldiers laugh", {"sfx": S("murmur@0.5:-16")}),
 ("s148", "no oitavo dia", "bridge", "Fog: Hayato walks onto the bridge", {"bars": "scope", "sfx": S("riser@0.0:-14")}),
 ("s149", "sem arco", "bridge", "Insert: the bow left on the ground", {"bars": "scope"}),
 ("s150", "só a tachi", "bridge", "Insert: hand on the tachi", {"bars": "scope", "sfx": S("shimmer@0.1:-14")}),
 ("s151", "desviou de cada", "bridge", "Duel: mace swings, Hayato dodges", {"bars": "scope", "sfx": S("whoosh@0.3:-10", "whoosh@1.3:-10", "hit@2.2:-10")}),
 ("s152", "até a ponte", "bridge", "The bridge cracks under the giant", {"bars": "scope", "sfx": S("impact@0.4:-8")}),
 ("s153", "um único movimento", "bridge", "Freeze: one sword arc, droplets hang", {"bars": "scope", "in": F(), "sfx": S("freeze@0.0:-8")}),
 ("s154", "quando ele atravessou", "bridge", "Hayato walks through parted soldiers", {"bars": "scope"}),
 ("s155", "quinta marca", "mark", "Mark V", {"bars": "scope", "sfx": S("impact@0.3:-8")}),
 ("s156", "e desta vez", "camp", "Soldiers' faces in awe", {}),
 ("s157", "nas fogueiras diziam", "camp", "Campfire tale: a figure with no shadow", {"amb": A("murmur", -26)}),
 ("s158", "e que o", "bridge", "The river runs red to the sea", {}),
 # ---------------- MASANOBU ----------------
 ("s159", "mas alguém tinha", "town", "Dazaifu gate opens at night; the enemy marches in", {"in": D(0.5), "amb": A("wind", -24)}),
 ("s160", "fujihara no masanobu", "town", "Masanobu in court robe and eboshi; name card", {"sfx": S("stinger@0.2:-12")}),
 ("s161", "que trocou mapas", "town", "Insert: a map scroll traded for a seal", {}),
 ("s162", "os trinta de", "beach", "Ghosts of the thirty on the beach", {"bars": "scope", "sfx": S("shimmer@0.2:-16")}),
 ("s163", "que eles valiam", "blueprint", "Scale: 30 stones vs a seal", {"bars": "none"}),
 ("s164", "hayato entrou em", "town", "Day: peasants with rice bags; Hayato among them under a straw hat", {"amb": A("murmur", -24)}),
 ("s165", "subiu numa carroça", "town", "Hayato on a cart points at Masanobu; guards", {"sfx": S("hit@0.4:-12")}),
 ("s166", "perguntando a eles", "town", "Low angle: Hayato calls out to the guards", {}),
 ("s167", "masanobu gritou que", "town", "Masanobu shouts", {}),
 ("s168", "hayato respondeu a", "town", "Hayato close-up: 'A corte nos abandonou.'", {}),
 ("s169", "você nos vendeu", "town", "OTS: Hayato points; Masanobu sweats", {"sfx": S("hit@0.2:-12")}),
 ("s170", "não é a", "town", "Hayato close-up: 'Não é a mesma coisa.'", {}),
 ("s171", "ninguém defendeu o", "town", "Guards lower spears; Masanobu alone", {}),
 ("s172", "sexta marca", "mark", "Mark VI", {"bars": "scope", "sfx": S("impact@0.3:-8")}),
 ("s173", "naquele dia hayato", "town", "Street: people kneel as he passes", {"amb": A("murmur", -26)}),
 ("s174", "ninguém mais o", "town", "The name HAYATO fades away", {}),
 ("s175", "só de oni", "town", "ONI glows", {"sfx": S("stinger@0.0:-12")}),
 # ---------------- FAREWELL ----------------
 ("s176", "ele deixou sayo", "farm", "Farmhouse with warm window; family welcomes Sayo", {"in": D(0.5), "amb": A("wind", -28)}),
 ("s177", "ajoelhou-se diante dela", "farm", "Hayato kneels before Sayo: 'Cante a música.'", {}),
 ("s178", "mas não diga", "farm", "Hayato close-up: 'Mas não diga o meu nome.'", {}),
 ("s179", "deixe só o", "farm", "Hayato: 'Deixe só o oni.'", {}),
 ("s180", "ela pediu para", "farm", "Sayo close-up pleading", {}),
 ("s181", "ele disse que", "farm", "Hayato shakes his head", {}),
 ("s182", "foi a última", "farm", "Hayato walks away down the road at dusk; Sayo at the gate", {}),
 ("s183", "ela entenderia mais", "farm", "Sayo watches, wind in her hair", {}),
 ("s184", "um nome pode", "blueprint", "HAYATO targeted by arrows", {"bars": "none", "sfx": S("swish@0.6:-12")}),
 ("s185", "uma lenda não", "blueprint", "The name dissolves into song; arrows pass through", {"bars": "none", "sfx": S("shimmer@0.0:-12")}),
 ("s186", "da lama ele", "hills", "Lyrics: villages singing at dusk", {"in": FD(0.6)}),
 ("s187", "cada nome que", "hills", "Lyrics: the lone figure walks on the ridge", {}),
 # ---------------- NAJIMA ----------------
 ("s188", "o imperador tarvos", "najima", "Ishkar in a red cloak; name card", {"in": D(0.5), "amb": A("wind", -24), "sfx": S("stinger@0.2:-12")}),
 ("s189", "com mil soldados", "najima", "Fortress of Najima on a hill; 1000", {"sfx": S("counter@0.5:-16")}),
 ("s190", "hayato não atacou", "najima", "Hayato at the forest edge watching", {}),
 ("s191", "cercou-a", "map", "Top-down: a dotted circle closes around the fortress", {"bars": "none", "sfx": S("whoosh@0.0:-12")}),
 ("s192", "um homem sitiando", "map", "1 vs 1000", {"bars": "none", "sfx": S("pop@0.2:-12")}),
 ("s193", "patrulhas sumiam", "najima", "Patrol torches go out one by one", {}),
 ("s194", "barcos queimavam", "najima", "Boats burning at the pier", {"sfx": S("impact@0.1:-14")}),
 ("s195", "flechas caíam do", "najima", "Arrows rain from the dark onto the wall", {"sfx": S("swish@0.2:-10", "swish@0.5:-10")}),
 ("s196", "o cerco também", "najima", "Hayato exhausted against a tree", {}),
 ("s197", "uma lança atingiu", "najima", "Spear thrust; Hayato recoils", {"sfx": S("hit@0.3:-8")}),
 ("s198", "e ele passou", "grotto", "Grotto: Hayato lies by a small fire, fever; DIA 1..5", {"amb": A("wind", -28), "sfx": S("heartbeat@0.0:-12")}),
 ("s199", "vendo os trinta", "grotto", "Ghosts of the thirty stand around him; Jiro smiles", {"sfx": S("shimmer@0.3:-12")}),
 ("s200", "depois voltou ao", "grotto", "Hayato rises at the cave mouth", {}),
 ("s201", "lá dentro a", "najima", "Inside: empty rice barrels, hungry soldiers", {}),
 ("s202", "os soldados desertavam", "najima", "Soldiers slip over the wall at dawn", {}),
 ("s203", "no quadragésimo dia", "najima", "DIA 40", {"sfx": S("counter@0.0:-14")}),
 ("s204", "ishkar saiu sozinho", "najima", "Gate opens, Ishkar walks out alone", {}),
 ("s205", "os dois conversaram", "najima", "Two figures sit at the forest edge, dusk", {"bars": "scope"}),
 ("s206", "ninguém registrou o", "scriptorium", "A scribe's page stays blank", {}),
 ("s207", "ishkar não voltou", "najima", "Empty fortress, gate open, torches leaving", {}),
 ("s208", "sétima marca", "mark", "Mark VII", {"bars": "scope", "sfx": S("impact@0.3:-8")}),
 ("s209", "o império já", "roster", "Roster: seven crossed, only Tarvos left", {"bars": "none"}),
 # ---------------- TARVOS ----------------
 ("s210", "então o próprio", "sea", "Flagship with the throne on deck crossing the sea", {"bars": "scope", "in": D(0.5), "amb": A("wind", -22), "sfx": S("stinger@0.2:-10")}),
 ("s211", "para atrair o", "coast", "Coastal villages burning; DIA counter", {"sfx": S("impact@0.4:-14")}),
 ("s212", "uma velha segurou", "coast", "An old woman holds Hayato's hand, smoke", {}),
 ("s213", "faça eles irem", "coast", "Old woman close-up: 'Faça eles irem embora.'", {}),
 ("s214", "tarvos ancorou centenas", "bay3d", "3D: hundreds of ships lashed together in Hakata bay", {"kind": "3d", "amb": A("wind", -22)}),
 ("s215", "uma cidade flutuante", "bay", "The floating city's lights at night", {}),
 ("s216", "hayato observou o", "cliff", "Hayato on a cliff looks up", {}),
 ("s217", "nuvens como penas", "cliff", "Sky: feather clouds", {}),
 ("s218", "pássaros voando para", "cliff", "Birds fly inland", {}),
 ("s219", "o mar parado", "cliff", "Flat mirror sea, eerie", {}),
 ("s220", "tarvos vinha das", "map", "Map: the steppes far inland", {"bars": "none"}),
 ("s221", "não sabia ler", "bay", "Tarvos close-up, unconcerned, looks at the sky", {}),
 ("s222", "a tempestade chegou", "bay", "Storm: lightning, rain over the fleet", {"bars": "scope", "in": F(0.3), "amb": A("rain", -16), "sfx": S("thunder@0.0:-6")}),
 ("s223", "os navios presos", "bay", "Ships capsize together in a chain", {"bars": "scope", "sfx": S("impact@0.5:-8")}),
 ("s224", "e um pequeno", "bay", "A small fishing boat slips between hulls", {"bars": "scope"}),
 ("s225", "tarvos o esperava", "deck", "Flagship deck in the storm; Tarvos with sword", {"bars": "scope", "sfx": S("thunder@0.5:-10")}),
 ("s226", "eu queria ver", "deck", "Tarvos close-up: 'Eu queria ver o seu rosto'", {"bars": "scope"}),
 ("s227", "foi o duelo", "deck", "Duel: sword clashes, sparks", {"bars": "scope", "sfx": S("hit@0.3:-8", "hit@0.9:-8", "hit@1.5:-8")}),
 ("s228", "ferido hayato recuou", "deck", "Hayato wounded, backed to the rail", {"bars": "scope"}),
 ("s229", "então uma onda", "deck", "A wave tilts the ship; everything slides", {"bars": "scope", "sfx": S("whoosh@0.2:-8")}),
 ("s230", "um único movimento", "deck", "Freeze: one sword arc in the rain", {"bars": "scope", "in": F(), "sfx": S("freeze@0.0:-8")}),
 ("s231", "quando o mastro", "deck", "Mast breaks; lightning reveals one figure standing", {"bars": "scope", "sfx": S("impact@0.2:-6", "thunder@1.5:-10")}),
 ("s232", "oitava marca", "mark", "Mark VIII, deeper and crooked", {"bars": "scope", "sfx": S("impact@0.3:-6")}),
 # ---------------- ERASURE / TODAY ----------------
 ("s233", "sem imperador kezhar", "map", "Map: Kezhar's red territory crumbles", {"bars": "none", "in": D(0.8), "sfx": S("wind@0.0:-18")}),
 ("s234", "e alguém nos", "scriptorium", "A scribe scrapes a name by candlelight", {"sfx": S("swish@0.8:-12")}),
 ("s235", "oito vezes", "archive", "Eight scraped pages in a grid", {"sfx": S("tick@0.2:-12")}),
 ("s236", "porque um império", "throne", "The wolf banner is lowered", {}),
 ("s237", "mas não aceita", "throne", "A lone figure vs the giant wolf banner", {"bars": "scope"}),
 ("s238", "hoje a pesquisadora", "archive", "Modern archive: researcher among papers; years flip", {"in": D(0.6), "amb": A("roomtone", -26), "sfx": S("counter@1.0:-16")}),
 ("s239", "não encontrou nenhuma", "archive", "Empty boxes; she sighs", {}),
 ("s240", "os historiadores concluíram", "study", "Stamp: LENDA", {"sfx": S("hit@1.0:-10")}),
 ("s241", "mas antes de", "ferry", "A modern ferry to Iki at golden hour", {"in": D(0.5), "amb": A("wind", -24)}),
 ("s242", "os pescadores cantaram", "harbor", "Fishermen at their nets sing at sunset", {}),
 ("s243", "perguntou o nome", "harbor", "The researcher asks", {}),
 ("s244", "todos deram a", "harbor", "Fishermen shake their heads", {}),
 ("s245", "nunca teve", "harbor", "Old fisherman close-up, smiling", {}),
 ("s246", "em iki existe", "shrine3d", "Hilltop shrine with a torii at dusk", {"kind": "3d", "amb": A("wind", -26)}),
 ("s247", "atrás dele trinta", "shrine", "Thirty nameless stones; 30", {"sfx": S("counter@0.4:-16")}),
 ("s248", "lá dentro uma", "shrine", "Shrine interior: the old tachi on a stand", {}),
 ("s249", "na bainha oito", "shrine", "Macro: the sheath with 8 marks", {"sfx": S("shimmer@0.2:-14")}),
 ("s250", "as sete primeiras", "shrine", "Highlight the first seven", {"sfx": S("blip@0.2:-14")}),
 ("s251", "a última mais", "shrine", "Highlight the last, deeper and crooked", {"sfx": S("blip@0.2:-12")}),
 ("s252", "como se feita", "shrine", "Memory: a wounded hand carves the mark", {"sfx": S("swish@0.9:-12")}),
 ("s253", "ela perguntou ao", "shrine", "Researcher and monk", {}),
 ("s254", "ele sorriu quem", "shrine", "Monk close-up smiling: 'Quem fez as marcas...'", {}),
 ("s255", "nós respeitamos", "shrine", "The monk bows", {}),
 ("s256", "e toda primavera", "shrine", "Spring: children climb the hill stairs, blossoms", {"in": FD(0.6), "amb": A("wind", -26)}),
 ("s257", "da lama ele", "shrine", "Lyrics: children singing at the shrine", {}),
 ("s258", "cada nome que", "shrine", "Lyrics: blossoms drift toward the sea", {}),
 ("s259", "talvez seja só", "shrine", "The sheath on its stand at dusk", {"in": D(0.5)}),
 ("s260", "mas alguém empilhou", "shrine", "The thirty stones at dusk", {}),
 ("s261", "alguém fez aquelas", "shrine", "The eight marks", {}),
 ("s262", "e alguém teve", "archive", "The chronicle: the scraped name under UV", {"bars": "scope"}),
 ("s263", "oito vezes", "archive", "Eight names glow; title KUROZANE NO HAYATO; fade out", {"bars": "scope", "sfx": S("stinger@0.3:-8"), "captions": False}),
]

MUSIC = [
 (0, "mystery", 0.4), (56.2, "calm", 0.35), (85.2, "dark", 0.45), (108.5, "tension", 0.5), (124.5, "action", 0.7), (139.4, "sad", 0.4),
 (165.1, "tension", 0.55), (203.0, "sad", 0.3), (211.4, "hopeful", 0.35), (250.9, "action", 0.75), (279.0, "dark", 0.45), (299.3, "action", 0.7),
 (325.4, "tension", 0.65), (364.1, "hopeful", 0.3), (370.2, "dark", 0.5), (380.8, "epic", 0.6), (419.0, "tension", 0.5), (469.8, "sad", 0.35),
 (500.5, "dark", 0.55), (556.1, "tension", 0.6), (587.2, "epic", 0.9), (618.2, "mystery", 0.4), (654.0, "wonder", 0.35),
]

def find(anchor, cur):
    toks = [norm(x) for x in anchor.split()]
    for i in range(cur, len(W) - len(toks) + 1):
        if all(W[i + k] == toks[k] for k in range(len(toks))):
            return i
    sys.exit(f"anchor not found after word {cur}: {anchor!r}")

def main():
    shots, cur = [], 0
    for sid, anchor, st, scene, ex in PLAN:
        i = find(anchor, cur); cur = i + 1
        start = 0.0 if not shots else round(max(words[i]["start"] - 0.12, shots[-1]["start"] + 0.3), 2)
        shots.append({"id": sid, "start": start, "_w": i, "set": st, "scene": scene, **ex})
    for k, s in enumerate(shots):
        s["end"] = shots[k + 1]["start"] if k + 1 < len(shots) else DUR
        j = shots[k + 1]["_w"] if k + 1 < len(shots) else len(words)
        s["line"] = " ".join(w["word"] for w in words[s.pop("_w"):j])
        s.setdefault("in", CUT); s.setdefault("bars", None); s.setdefault("sfx", [])
        if "kind" in s: s.setdefault("notes", s.pop("kind"))
    order = ["id", "start", "end", "line", "scene", "set", "bars", "in", "sfx", "amb", "captions", "notes"]
    shots = [{k: s[k] for k in order if k in s} for s in shots]
    music = [{"start": m[0] if k else 0, "end": MUSIC[k + 1][0] if k + 1 < len(MUSIC) else DUR, "mood": m[1], "intensity": m[2]} for k, m in enumerate(MUSIC)]
    out = {"title": cfg["title"], "duration": DUR, "shots": shots, "music": music, "sfx": []}
    json.dump(out, open(os.path.join(HERE, "shots.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    d = sorted(s["end"] - s["start"] for s in shots)
    print(f"{len(shots)} shots, duration {DUR}s, median {d[len(d)//2]:.2f}s, min {d[0]:.2f}s ({[s['id'] for s in shots if s['end']-s['start']==d[0]]}), max {d[-1]:.2f}s")
    for s in shots:
        if s["end"] - s["start"] > 7: print("  long:", s["id"], round(s["end"] - s["start"], 1), s["line"][:60])

main()
