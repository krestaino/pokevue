import Vue from 'vue'
import Vuex from 'vuex'
import pokemonList from './pokemonList.json'

const Pokedex = require('pokeapi-js-wrapper')
const options = {
  protocol: 'https',
  versionPath: '/api/v2/',
  cache: true
}
const P = new Pokedex.Pokedex(options)

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pokemon: null,
    pokemonList: pokemonList,
    pokemonSpecies: null
  },
  mutations: {
    SET_POKEMON (state, pokemon) {
      state.pokemon = pokemon
    },
    SET_SPECIES (state, species) {
      state.pokemonSpecies = species
    }
  },
  actions: {
    fetchPokemon ({ commit, state }, pokemon) {
      return new Promise((resolve, reject) => {
        P.resource([`/api/v2/pokemon/${pokemon}`, `api/v2/pokemon-species/${pokemon}`])
          .then(response => {
            commit('SET_POKEMON', response[0])
            commit('SET_SPECIES', response[1])
            resolve()
          })
          .catch(() => {
            commit('SET_POKEMON', null)
            commit('SET_SPECIES', null)
            reject(new Error('Pokémon not found.'))
          })
      })
    }
  }
})
