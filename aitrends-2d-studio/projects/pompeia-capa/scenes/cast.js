// cast.js — one signature colour per recurring character.
export const BAKER = { top: 'dress', color: '#d64a33', head: 'curly' };          // "você", o padeiro (túnica vermelha)
export const ARCH = { top: 'tshirt', color: '#3fb950', head: 'cap', headColor: '#3fb950' }; // arqueólogo, 1.800 anos depois
export const LOCAL = (k = 0) => ({ top: 'dress', color: ['#3a3340', '#2e2a38', '#41363a'][k % 3], head: ['none', 'bun', 'curly'][k % 3] }); // moradores (sem cor de destaque)
