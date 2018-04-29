<template>
  <div class="pokemon">
    <vue-autosuggest
      :suggestions="filteredOptions"
      :on-selected="onSelected"
      :limit="10"
      :input-props="inputProps"
      :class="{ hideSuggestions: !currentQuery, errorMessage: errorMessage }"
      :renderSuggestion="renderSuggestion"
    />
    <div class="error" v-if="errorMessage">{{ errorMessage.toString() }}</div>
    <div v-html="themeHighlight"></div>
    <transition name="fade">
      <Loader v-if="isLoading"/>
    </transition>
    <section :class="{ isLoading: isLoading }">
      <transition name="fade">
        <div v-if="pokemon && pokemonSpecies" key>
          <div>
            <h2>
              <img class="image" :src="pokemon.sprites.front_default">
              <span class="name">{{ pokemonSpecies.name }}</span>
              <span class="id">#{{ pokemonSpecies.id }}</span>
            </h2>
            <p>{{ pokemonSpecies.flavor_text_entries.filter(description => description.language.name === 'en')[0].flavor_text }}</p>
          </div>
          <div class="card">
            <div>
              <span class="title">Height</span>
              <span class="stat">{{ pokemon.height / 10 }} m</span>
            </div>
            <div>
              <span class="title">Weight</span>
              <span class="stat">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
            </div>
            <div>
              <span class="title">Genus</span>
              <span class="stat">{{ pokemonSpecies.genera.filter(genus => genus.language.name === 'en')[0].genus }}</span>
            </div>
          </div>

          <h3>Stats</h3>
          <div class="card">
            <div
              v-for="(stat, index) in pokemon.stats"
              :key="index">
              <span class="title">{{ toTitleCase(stat.stat.name) }}</span>
              <span class="stat">{{ stat.base_stat }}</span>
            </div>
          </div>

          <h3>Types</h3>
          <div class="flag-container">
            <span
              class="title-case flag type"
              :class="type.type.name"
              v-for="(type, index) in pokemon.types"
              :key="index">{{ toTitleCase(type.type.name) }}
            </span>
          </div>

          <h3>Abilities</h3>
          <div class="flag-container">
            <span
              class="title-case flag"
              v-for="(ability, index) in pokemon.abilities"
              :key="index">{{ toTitleCase(ability.ability.name) }}
            </span>
          </div>

          <h3>Moves</h3>
          <div class="flag-container">
            <span
              class="title-case flag"
              v-for="(move, index) in pokemon.moves"
              :key="index">{{ toTitleCase(move.move.name) }}
            </span>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import * as Vibrant from 'node-vibrant'
import { VueAutosuggest } from 'vue-autosuggest'

export default {
  components: {
    Loader,
    VueAutosuggest
  },
  computed: {
    pokemon () {
      return this.$store.state.pokemon
    },
    pokemonList () {
      return [{
        data: this.$store.state.pokemonList
      }]
    },
    pokemonSpecies () {
      return this.$store.state.pokemonSpecies
    }
  },
  data () {
    return {
      themeHighlight: null,
      currentQuery: null,
      filteredOptions: [],
      inputProps: {
        autofocus: true,
        id: 'autosuggest__input',
        onInputChange: this.onInputChange,
        placeholder: 'Search for Pokémon by name or ID'
      },
      limit: 10,
      errorMessage: null,
      isLoading: false,
      query: ''
    }
  },
  methods: {
    getColorPallet (src) {
      Vibrant.from(src).getPalette()
        .then((palette) => {
          this.themeHighlight = `
            <style>
              body {
                background-color: rgba(${Math.round(palette.DarkVibrant._rgb[0])},${Math.round(palette.DarkVibrant._rgb[1])},${Math.round(palette.DarkVibrant._rgb[2])}, 0.5);
              }
              .card, .flag {
                background-color: rgba(${Math.round(palette.DarkVibrant._rgb[0])},${Math.round(palette.DarkVibrant._rgb[1])},${Math.round(palette.DarkVibrant._rgb[2])}, 0.1);
              }
              .app {
                color: rgba(${Math.round(palette.DarkMuted._rgb[0])},${Math.round(palette.DarkMuted._rgb[1])},${Math.round(palette.DarkMuted._rgb[2])}, 1);
              }
            </style>
          `
        })
    },
    isNumber (value) {
      return typeof value === 'number' && isFinite(value)
    },
    onSelected (option) {
      this.search(option.item.name)
    },
    onInputChange (text) {
      this.currentQuery = text

      if (text === '' || text === undefined) {
        return
      }

      /* Full control over filtering. Maybe fetch from API?! Up to you!!! */
      const filteredData = this.pokemonList[0].data.filter(item => {
        return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1 || item.id.indexOf(text) > -1
      }).slice(0, this.limit)

      if (!filteredData.length) {
        this.errorMessage = new Error('Pokémon not found.')
      } else {
        this.errorMessage = null
      }

      this.filteredOptions = [{
        data: filteredData
      }]
    },
    search (query) {
      this.errorMessage = null
      this.isLoading = true
      setTimeout(() => {
        this.$store.dispatch('fetchPokemon', query)
          .then(() => {
            this.$store.dispatch('fetchSpecies', this.pokemon.species.name)
            this.$router.push(this.pokemon.species.name)
            this.isLoading = false
          })
          .then(() => {
            this.getColorPallet(this.pokemon.sprites.front_default)
          })
          .catch(error => {
            this.errorMessage = error
            this.isLoading = false
          })
      }, 500)
    },
    toTitleCase (string) {
      return string.replace('-', ' ').trim()
    },
    renderSuggestion (suggestion) {
      /* You will need babel-plugin-transform-vue-jsx for this kind of full customizable
       * rendering. If you don't use babel or the jsx transform, then you can use this
       * function to just `return suggestion['propertyName'];`
       */
      const pokemon = suggestion.item
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '15px',
              marginRight: '10px'
            }}
            src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png'}
          />{' '}
          <span>{pokemon.name}</span>
          <span class="id">{pokemon.id}</span>
        </div>
      )
    }
  },
  mounted () {
    if (this.$route.params.pokemon) {
      this.search(this.$route.params.pokemon)
    }
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.pokemon {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 0px 100px 0px rgba(0,0,0,0.25);
  padding: 2rem;
  position: relative;

  @media (max-width: 680px) {
    box-shadow: none;
    border-radius: 0;
    padding: 1rem;
  }
}

section {
  transition: 0.3s;

  &.isLoading {
    margin-top: 92px;
  }
}

.error {
  background-color: rgba(255, 0, 0, 0.55);
  border-radius: 3px;
  color: #fff;
  font-weight: 600;
  margin: 8px 0;
  padding: 6px;
  text-align: center;
}

h2 {
  align-items: center;
  display: flex;
  margin-left: -16px;

  .image {
    height: 96px;
    width: 96px;
  }

  .name {
    font-weight: 400;
    font-size: 32px;
    text-transform: capitalize;
  }

  .id {
    margin-left: 4px;
    opacity: 0.5;
  }
}

p + p {
  margin: 1rem 0;
}

h3 {
  font-size: 1.5rem;
  margin: 1rem 0 0 0;
}

.card {
  border-radius: 3px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 1rem 0;
  padding: 12px;

  span {
    display: block;
  }

  .title {
    font-weight: 300;
    opacity: 0.75;
  }

  .stat {
    font-weight: 600;
  }
}

.title-case,
.title {
  text-transform: capitalize;
}

.flag-container {
  margin-top: -4px;
  padding-top: 12px;
}

.flag {
  border-radius: 3px;
  display: inline-block;
  line-height: 1rem;
  padding: 4px 8px;
  margin-right: 4px;
  margin-top: 4px;

  &.type {
    color: #fff;
  }

  &.normal { background-color: #b4946b; }
  &.fighting { background-color: #ff6462; }
  &.flying { background-color: #818ccc; }
  &.poison { background-color: #b464a1; }
  &.ground { background-color: #e7b465; }
  &.rock { background-color: #aaa063; }
  &.bug { background-color: #97ab3c; }
  &.ghost { background-color: #97ab3c; }
  &.steel { background-color: #8cb4be; }
  &.fire { background-color: #fc7851; }
  &.water { background-color: #4fc8db; }
  &.grass { background-color: #79c85b; }
  &.electric { background-color: #ffc711; }
  &.psychic { background-color: #fd668f; }
  &.ice { background-color: #6edcd3; }
  &.dragon { background-color: #5a64ab; }
  &.dark { background-color: #5a504f; }
  &.fairy { background-color: #fe78aa; }
}
</style>

<style>
#autosuggest__input {
  border-radius: 3px;
  color: #666;
  outline: none;
  position: relative;
  display: block;
  font-family: inherit;
  font-size: 16px;
  border: 1px solid #aaa;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  font-weight: 300;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.hideSuggestions .autosuggest__results-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: none;
}

.errorMessage #autosuggest__input {
  border-color: rgba(255, 0, 0, 0.75);
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #aaa;
  border-top: 0;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background: white;
  padding: 0px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  border-top: 1px solid #dedede;
  color: #666;
  cursor: pointer;
  padding: 8px;
  text-transform: capitalize;
}

.autosuggest__results .id {
  font-size: 12px;
  margin-top: 3px;
  opacity: 0.5;
}

.autosuggest__results .id::before {
  content: '#';
  margin-left: 5px;
}

.autosuggest__results .autosuggest__results_item:first-child {
  border-top: 0;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results .autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #ddd;
}
</style>
