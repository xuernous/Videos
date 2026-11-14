// cast.js — "Japão" (Kurozane no Hayato). One signature item per recurring character; extras (x) are drawn by lib.drawChar.
// x: topknot | crown | helmet | eboshi | kasa | beard | bald
export const HAYATO   = { top: 'trench', color: '#262c44', head: 'headband', headColor: '#d64a33', x: ['topknot'] };   // red hachimaki
export const JIRO     = { top: 'tshirt', color: '#3a6ea5', head: 'spiky', x: [] };                                      // blue kimono
export const SADAYUKI = { top: 'trench', color: '#6b5a48', head: 'bun', x: ['beard'] };                                  // old commander
export const IKI      = { top: 'tshirt', color: '#3b3546', head: 'bun', x: [] };                                         // the thirty
export const SAYO     = { top: 'dress', color: '#f29ac0', head: 'ponytail', headColor: '#f29ac0', kid: true, x: [] };   // pink
export const TARVOS   = { top: 'trench', color: '#4a0f16', head: 'none', x: ['crown', 'beard'] };                        // gold crown
export const ORDEK    = { top: 'trench', color: '#3a2a2a', head: 'none', x: ['helmet'] };
export const HARSA    = { top: 'tracksuit', color: '#8a5ad6', color2: '#d6c2ff', head: 'ponytail', x: [] };             // purple
export const VELKUN   = { top: 'suit', color: '#4a3a30', color2: '#c9a227', head: 'none', face: 'glasses', x: ['bald'] };
export const SABETH   = { top: 'trench', color: '#2f3a28', head: 'hood', headColor: '#3f6b40', x: [] };                 // green hood
export const GORUUN   = { top: 'none', head: 'spiky', x: ['helmet'] };
export const MASANOBU = { top: 'suit', color: '#6a3a8a', color2: '#c9a227', head: 'none', x: ['eboshi'] };              // purple court robe
export const ISHKAR   = { top: 'trench', color: '#8a1a22', head: 'none', x: [] };                                        // red cloak
export const SOLDIER  = { top: 'tshirt', color: '#6e1a20', head: 'none', x: ['helmet'] };                                 // Kezhar soldier
export const SCRIBE   = { top: 'trench', color: '#4a3a2a', head: 'none', x: ['bald'] };
export const PEASANT  = { top: 'tshirt', color: '#5a5040', head: 'none', x: ['kasa'] };
export const MESSENGER= { top: 'tshirt', color: '#b08a4a', head: 'none', x: ['eboshi'] };
export const OLDWOMAN = { top: 'dress', color: '#5a5266', head: 'bun', x: [] };
export const RESEARCHER = { top: 'labcoat', head: 'bun', face: 'glasses', x: [] };                                       // modern
export const HISTORIAN= { top: 'suit', color: '#3a3a48', color2: '#8a7a5a', head: 'none', face: 'glasses', x: [] };
export const MONK     = { top: 'trench', color: '#c97a2a', head: 'none', x: ['bald'] };                                  // saffron
export const FISHER   = { top: 'tshirt', color: '#2f5a6a', head: 'beanie', headColor: '#2f5a6a', x: [] };
export const CHILD    = (c) => ({ top: 'tshirt', color: c, head: 'none', kid: true, x: [] });
export const FAMILY   = { top: 'tshirt', color: '#7a6a4a', head: 'bun', x: [] };
