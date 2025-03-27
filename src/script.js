// Wait for the HTML file to load first before loading JS
document.addEventListener("DOMContentLoaded", main);

const pokemonGrid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('search');
const typeFilters = document.getElementById('typeFilters');
const modal = document.getElementById('pokemonModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');


let allPokemon = [];
let filteredPokemon = [];
let selectedTypes = [];