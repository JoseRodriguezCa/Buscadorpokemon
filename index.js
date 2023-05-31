const containerCards = document.querySelector(".container-cards");
const searchPokemon = document.querySelector("#text-pokemon");
const btnSearch = document.querySelector("#btn-search");
const listPokemon = document.querySelector("#name-pokemon");
const listContainer = document.createElement("ul");

document.body.append(listContainer);
listContainer.className = 'list-pokemon';

let listElement;
let listCards;
const api_URL = "https://pokeapi.co/api/v2/pokemon/";
let idPokemon = 1;
let namePokemon;

const paintCards = () => {
  return `
  <div class="card-grid">
    <div class="card">
      <img src=${listCards.image} class="pokemon-image">
      <h2>${listCards.name}</h2>
      <p>ID del Pokemon:${listCards.ID}.</p>
      <p>Tipo de Pokemon:${listCards.type}.</p>
    </div>`;
};

const renderPokemon = () => {
  const template = paintCards();
  containerCards.innerHTML = template;
};

const fetchPokemon = (namePokemon) => {
  fetch(`${api_URL}${namePokemon}`)
    .then((res) => res.json())
    .then((response) => {
      const typeNames = [];
      for (let i = 0; i < response.types.length; i++) {
        typeNames.push(response.types[i].type.name);
      }
      listCards = {
        name: response.name,
        image: response.sprites.front_default,
        ID: response.id,
        type: typeNames,
      };
      renderPokemon();
    });
};

btnSearch.addEventListener("click", (ev) => {
  ev.preventDefault();
  namePokemon = searchPokemon.value;
  console.log(searchPokemon.value);
  fetchPokemon(namePokemon);
});


const fetchPokemonNames = () => {
  return new Promise((resolve, reject) => {
    const allPokemonNames = [];

    const fetchPage = (url) => {
      fetch(url)
        .then((res) => res.json())
        .then((response) => {
          const pokemonNames = response.results.map((pokemon) => pokemon.name);
          allPokemonNames.push(...pokemonNames);

          if (response.next) {
            fetchPage(response.next); 
          } else {
            resolve(allPokemonNames); 
          }
        })
        .catch(reject);
    };

    fetchPage(api_URL);
  });
};

const displayPokemonNames = () => {
  const pokemonList = document.querySelector('.list-pokemon');

  fetchPokemonNames().then((pokemonNames) => {
    for (let i = 0; i < pokemonNames.length; i++) {
      const li = document.createElement('li');
      li.className = 'list';
      li.textContent = pokemonNames[i];
      pokemonList.appendChild(li);

      li.addEventListener('click', () => {
        const pokemonName = pokemonNames[i];
        fetchPokemon(pokemonName);
      });
    }
  }).catch((error) => {
    console.error('Error al obtener los nombres de los Pokémon:', error);
  });
};

fetchPokemon("bulbasaur");
fetchPokemonNames()
displayPokemonNames()

