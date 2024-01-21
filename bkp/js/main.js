// Função para carregar os dados dos Pokémon a partir do arquivo JSON
async function loadPokemonData() {
    const response = await fetch('recursos/pokemonData.json');
    const data = await response.json();
    return data.pokemon;
}

async function loadTypeData() {
    const response = await fetch('recursos/pokemonData.json');
    const data = await response.json();
    return data.types;
}

// Função para criar um elemento HTML para um Pokémon
function createPokemonElement(pokemon, typesData) {
    const pokemonElement = document.createElement('li');
    pokemonElement.classList.add('pokemon');

    const typeClasses = pokemon.types.map(type => type.toLowerCase());
    if (typeClasses.length > 0) {
        pokemonElement.classList.add(typeClasses[0]);
    }

    // Criar o conteúdo do Pokémon
    pokemonElement.innerHTML = `
        <div class="infos">
            <h2 class="name">${pokemon.name}</h2>
            <ol class="type">
                ${typeClasses.map(typeClass => `<li class="${typeClass}">${typeClass}</li>`).join('')}
            </ol>
        </div>
        <div class="details">
            <div class="number">${pokemon.number}</div>
            <div class="imagem">
                <img src="${pokemon.image}" alt="${pokemon.name}">
            </div>
        </div>
    `;

    return pokemonElement;
}

// Função principal para gerar os Pokémon
async function generatePokemonList() {
    const pokemonData = await loadPokemonData();
    const typesData = await loadTypeData();
    
    const pokemonList = document.getElementById('pokemon-list');

    pokemonData.forEach(pokemon => {
        const pokemonElement = createPokemonElement(pokemon, typesData);
        pokemonList.appendChild(pokemonElement);
    });
}

// Chame a função para gerar os Pokémon quando a página for carregada
window.onload = generatePokemonList;
