// cast.js — one signature colour per recurring character (no club crests or real likenesses).
export const COACH = { top: 'tracksuit', color: '#efece6', head: 'none', face: 'glasses' };   // "você", o técnico (white tracksuit + glasses)
export const PREZ = { top: 'suit', color: '#c9a227', head: 'none' };                           // o presidente (gold blazer)
export const FAN = { top: 'jersey', color: '#efece6', color2: '#1a1a1a', number: '', head: 'capBack', headColor: '#d64a33' }; // o corintiano (red cap)
export const PLAYER = (n = '9') => ({ top: 'jersey', color: '#efece6', color2: '#1a1a1a', number: String(n), head: 'none' }); // time da casa (branco)
export const RIVAL = (n = '7') => ({ top: 'jersey', color: '#141416', color2: '#efece6', number: String(n), head: 'none' });  // o Galo (preto)
