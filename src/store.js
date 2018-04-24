import Vue from 'vue'
import Vuex from 'vuex'

const Pokedex = require('pokeapi-js-wrapper')
const options = {
  protocol: 'https',
  versionPath: '/api/v2/',
  cache: true,
  timeout: 5 * 1000 // 5s
}
const P = new Pokedex.Pokedex(options)

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pokemon: null,
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
        P.getPokemonByName(pokemon)
          .then(response => {
            commit('SET_POKEMON', response)
            resolve()
          })
      })
    },
    fetchSpecies ({ commit, state }, species) {
      return new Promise((resolve, reject) => {
        P.getPokemonSpeciesByName(species)
          .then(response => {
            commit('SET_SPECIES', response)
            resolve()
          })
      })
    }
  }
})
