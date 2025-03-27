
const pokemonGrid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('search');
const typeFilters = document.getElementById('typeFilters');
const modal = document.getElementById('pokemonModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');




fetchPokemon();
createTypeFilters();


async function fetchPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
        const data = await response.json();
        
        
        const pokemonWithDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const details = await fetch(pokemon.url).then(res => res.json());
                return {
                    id: details.id,
                    name: details.name,
                    image: details.sprites.front_default,
                    height: details.height,
                    weight: details.weight,
                    types: details.types.map(t => t.type.name)
                };
            })
        );
        
        allPokemon = pokemonWithDetails;
        filteredPokemon = [...allPokemon];
        renderPokemon();
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

function renderPokemon() {
    pokemonGrid.innerHTML = '';
    filteredPokemon.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
        `;
        card.addEventListener('click', () => showPokemonDetails(pokemon));
        pokemonGrid.appendChild(card);
    });
}



function closeModal() {
    modal.style.display = 'none';
}


function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredPokemon = allPokemon.filter(pokemon => 
        pokemon.name.includes(searchTerm) &&
        (selectedTypes.length === 0 || 
         selectedTypes.some(type => pokemon.types.includes(type)))
    );
    renderPokemon();
}

