<template>
  <div class="pokemon">
    <vue-autosuggest
      :suggestions="filteredOptions"
      :on-selected="onSelected"
      :limit="10"
      :input-props="inputProps"
      :class="{ hideSuggestions: !currentQuery }"
    />
    <transition name="fade">
      <Loader v-if="isLoading"/>
    </transition>
    <section :class="{ isLoading: isLoading }">
      <transition name="fade">
        <div v-if="pokemon && pokemonSpecies">
          <div>
            <h1>
              <img class="image" :src="pokemon.sprites.front_default">
              <span class="name">{{ pokemonSpecies.name }}</span>
              <span class="id">#{{ pokemonSpecies.id }}</span>
            </h1>
            <p>{{ pokemonSpecies.flavor_text_entries.filter(description => description.language.name === 'en')[0].flavor_text }}</p>
          </div>
          <div class="card themeHighLight--background--vibrant--01">
            <div>
              <span class="title">Height</span>
              <span class="stat">{{ pokemon.height }}</span>
            </div>
            <div>
              <span class="title">Weight</span>
              <span class="stat">{{ pokemon.weight }}</span>
            </div>
            <div>
              <span class="title">Genus</span>
              <span class="stat">{{ pokemonSpecies.genera.filter(genus => genus.language.name === 'en')[0].genus }}</span>
            </div>
          </div>

          <h2>Stats</h2>
          <div class="card themeHighLight--background--vibrant--01">
            <div
              v-for="(stat, index) in pokemon.stats"
              :key="index">
              <span class="title">{{ toTitleCase(stat.stat.name) }}</span>
              <span class="stat">{{ stat.base_stat }}</span>
            </div>
          </div>

          <h2>Types</h2>
          <div class="flag-container">
            <span
              class="title-case flag themeHighLight--background--vibrant--01"
              v-for="(type, index) in pokemon.types"
              :key="index">{{ toTitleCase(type.type.name) }}
            </span>
          </div>

          <h2>Abilities</h2>
          <div class="flag-container">
            <span
              class="title-case flag themeHighLight--background--vibrant--01"
              v-for="(ability, index) in pokemon.abilities"
              :key="index">{{ toTitleCase(ability.ability.name) }}
            </span>
          </div>

          <h2>Moves</h2>
          <div class="flag-container">
            <span
              class="title-case flag themeHighLight--background--vibrant--01"
              v-for="(move, index) in pokemon.moves"
              :key="index">{{ toTitleCase(move.move.name) }}
            </span>
          </div>
        </div>
      </transition>
    </section>
    <div v-if="errorMessage">{{ errorMessage.toString() }}</div>
    <div v-html="themeHighlight"></div>
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
      palette: null,
      options: [{
        data: ['Frodo', 'Samwise', 'Gandalf', 'Galadriel', 'Faramir', 'Éowyn', 'Peregrine Took', 'Boromir', 'Legolas', 'Gimli', 'Gollum', 'Beren', 'Saruman', 'Sauron', 'Théoden']
      }],
      filteredOptions: [],
      inputProps: {
        id: 'autosuggest__input',
        onInputChange: this.onInputChange,
        placeholder: 'Search by name or ID'
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
              .themeHighLight--background--vibrant--05 {
                background-color: rgba(${Math.round(palette.DarkVibrant._rgb[0])},${Math.round(palette.DarkVibrant._rgb[1])},${Math.round(palette.DarkVibrant._rgb[2])}, 0.5);
              }
              .themeHighLight--background--vibrant--01 {
                background-color: rgba(${Math.round(palette.DarkVibrant._rgb[0])},${Math.round(palette.DarkVibrant._rgb[1])},${Math.round(palette.DarkVibrant._rgb[2])}, 0.1);
              }
              .themeHighLight--color--muted--10 {
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
      if (isNaN(this.currentQuery)) {
        this.search(option.item)
      } else {
        this.search(this.currentQuery)
      }
    },
    onInputChange (text) {
      this.currentQuery = text

      if (text === '' || text === undefined) {
        return
      }

      /* Full control over filtering. Maybe fetch from API?! Up to you!!! */
      const filteredData = this.pokemonList[0].data.filter(item => {
        return item.toLowerCase().indexOf(text.toLowerCase()) > -1
      }).slice(0, this.limit)

      this.filteredOptions = [{
        data: filteredData
      }]
    },
    search (query) {
      this.isLoading = true
      setTimeout(() => {
        this.$store.dispatch('fetchPokemon', query)
          .then(() => {
            this.$store.dispatch('fetchSpecies', this.pokemon.species.name)
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
  padding: 2rem;
  position: relative;
}

section {
  transition: 0.3s;

  &.isLoading {
    margin-top: 92px;
  }
}

h1 {
  align-items: center;
  display: flex;
  margin-left: -16px;

  .image {
    height: 96px;
    width: 96px;
  }

  .name {
    color: #111;
    font-weight: 400;
    font-size: 32px;
    text-transform: capitalize;
  }

  .id {
    color: #999;
    margin-left: 4px;
  }
}

p + p {
  margin: 1rem 0;
}

h2 {
  color: #111;
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
    color: #666;
    font-weight: 300;
  }

  .stat {
    color: #111;
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
}
</style>

<style>
#autosuggest__input {
  color: #666;
  outline: none;
  position: relative;
  display: block;
  font-family: inherit;
  font-size: 20px;
  border: 1px solid #616161;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  font-weight: 300;
  text-transform: capitalize;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.hideSuggestions .autosuggest__results-container {
  display: none;
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
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  color: #666;
  cursor: pointer;
  padding: 15px;
  text-transform: capitalize;
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
