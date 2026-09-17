import generic from '../verticals/generic/index.js';
import solar from '../verticals/solar/index.js';
import realEstate from '../verticals/real-estate/index.js';
const registry={generic,solar,'real-estate':realEstate};
export function getVertical(slug='generic'){return registry[slug]||registry.generic}
export function listVerticals(){return Object.values(registry).map(v=>({slug:v.slug,name:v.name,conversion_modes:v.conversion_modes}))}
