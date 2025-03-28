
const pokemonGrid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('search');
const typeFilters = document.getElementById('typeFilters');
const modal = document.getElementById('pokemonModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');

let allPokemon = [];
let filteredPokemon = [];
let selectedTypes = [];


searchInput.addEventListener('input', handleSearch);
closeBtn.addEventListener('click', closeModal);


fetchPokemon();
createTypeFilters();


function fetchPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
        .then(response => response.json())
        .then(data => {
            allPokemon = [];
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(res => res.json())
                    .then(details => {
                        allPokemon.push({
                            id: details.id,
                            name: details.name,
                            image: details.sprites.front_default,
                            height: details.height,
                            weight: details.weight,
                            types: details.types.map(t => t.type.name)
                        });
                        
                        if (allPokemon.length === data.results.length) {
                            filteredPokemon = [...allPokemon];
                            renderPokemon();
                        }
                    });
            });
        })
        .catch(err => console.error("Error:", err));
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


function showPokemonDetails(pokemon) {
    modalContent.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height / 10}m</p>
        <p>Weight: ${pokemon.weight / 10}kg</p>
        <p>Types: ${pokemon.types.join(', ')}</p>
    `;
    modal.style.display = 'block';
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

function createTypeFilters() {
    const types = ['fire', 'water', 'grass', 'electric', 'poison', 'flying', 'bug', 'normal'];
    
    types.forEach(type => {
        const button = document.createElement('button');
        button.textContent = type;
        button.className = 'type-btn';
        button.addEventListener('click', () => toggleTypeFilter(type));
        typeFilters.appendChild(button);
    });
}

function toggleTypeFilter(type) {
    const index = selectedTypes.indexOf(type);
    if (index === -1) {
        selectedTypes.push(type);
    } else {
        selectedTypes.splice(index, 1);
    }
    handleSearch();
}

const NOTES_URL = 'https://pokemon-vercel-db.vercel.app/notes';
const notesList = document.getElementById('notesList');
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');



// Comment section

function loadNotes() {
    fetch(NOTES_URL)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(notes => {
            notesList.innerHTML = notes.map(note => `
                <div class="note-item" data-id="${note.id}">
                    ${note.text}
                    <button class="delete-btn">X</button>
                </div>
            `).join('');

            // Add event listeners to all delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const noteId = this.parentElement.getAttribute('data-id');
                    deleteNote(noteId);
                });
            });
        })
        .catch(error => {
            console.error('Error loading notes:', error);
            notesList.innerHTML = '<p>Error loading notes. Please try again.</p>';
        });
}

addNoteBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!noteInput.value) return;
    
    fetch(NOTES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            text: noteInput.value,
            createdAt: new Date().toISOString()
            
        })
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to add note');
        return res.json();
    })
    .then(() => {
        noteInput.value = '';
        loadNotes();
    })
    .catch(error => console.error('Error adding note:', error));
});

function deleteNote(id) {
    fetch(`${NOTES_URL}/${id}`, { 
        method: 'DELETE' 
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to delete note');
        loadNotes();
    })
    .catch(error => console.error('Error deleting note:', error));
}

// Initialize notes
loadNotes();