// cast.js — one outfit per recurring character. Signature colour = identity; keep it identical in every shot.
export const P77 = { top: 'jersey', color: '#d64a33', color2: '#fff1dc', number: '77', head: 'none' };       // "você", the hero
export const P41 = { top: 'jersey', color: '#3fb950', color2: '#fff1dc', number: '41', head: 'none' }; // the 50-year-old with the scar
export const MOM = { top: 'dress', color: '#f29ac0', head: 'bun' };                                            // mother's voice (ghost)
export const EXTRA = (n, o = {}) => ({ top: 'jersey', color: '#2a2833', color2: '#8a8aa0', number: String(n), head: 'none', ...o });
export const CAST = [P77, P41];
