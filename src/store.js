import Vue from 'vue'
import Vuex from 'vuex'

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
    allPokemon: null,
    pokemon: null,
    pokemonSpecies: null
  },
  mutations: {
    SET_ALL_POKEMON (state, allPokemon) {
      state.allPokemon = allPokemon
    },
    SET_POKEMON (state, pokemon) {
      state.pokemon = pokemon
    },
    SET_SPECIES (state, species) {
      state.pokemonSpecies = species
    }
  },
  actions: {
    fetchAllPokemon ({ commit, state }) {
      return new Promise((resolve, reject) => {
        P.resource('/api/v2/pokemon/?limit=802')
          .then(response => {
            commit('SET_ALL_POKEMON', response)
            resolve()
          })
          .catch(() => {
            commit('SET_ALL_POKEMON', null)
            reject(new Error('Could not fetch all Pokémon.'))
          })
      })
    },
    fetchPokemon ({ commit, state }, pokemon) {
      return new Promise((resolve, reject) => {
        P.resource([`/api/v2/pokemon/${pokemon.id || pokemon.name}`, `api/v2/pokemon-species/${pokemon.id || pokemon.name}`])
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
