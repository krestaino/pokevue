<template>
  <div class="pokemon">
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
              <span class="name">{{ pokemon.name }}</span>
              <span class="id">#{{ pokemon.id }}</span>
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

          <h3>Weaknesses</h3>
          <div class="flag-container">
            <span
              class="title-case flag type"
              :class="[type, { super: typeEffectiveness.weaknessesSuper.includes(type) }]"
              v-for="(type, index) in typeEffectiveness.weaknesses.sort()"
              :key="index">{{ toTitleCase(type) }}
            </span>
            <span class="title-case flag type none" v-if="!typeEffectiveness.weaknesses.length">None</span>
          </div>

          <h3>Strengths</h3>
          <div class="flag-container">
            <span
              class="title-case flag type"
              :class="[type, { super: typeEffectiveness.strengthsSuper.includes(type) }]"
              v-for="(type, index) in typeEffectiveness.strengths.sort()"
              v-if="!typeEffectiveness.immunities.includes(type)"
              :key="index">{{ toTitleCase(type) }}
            </span>
            <span class="title-case flag type none" v-if="!typeEffectiveness.strengths.length">None</span>
          </div>

          <h3>Immunities</h3>
          <div class="flag-container">
            <span
              class="title-case flag type"
              :class="type"
              v-for="(type, index) in typeEffectiveness.immunities.sort()"
              :key="index">{{ toTitleCase(type) }}
            </span>
            <span class="title-case flag type none" v-if="!typeEffectiveness.immunities.length">None</span>
          </div>

          <!-- <h3>Abilities</h3>
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
              v-for="(move, index) in pokemon.moves.slice(0,24)"
              class="title-case flag"
              :class="{ last: index === 23 }"
              :key="index">{{ toTitleCase(move.move.name) }}
            </span>
          </div> -->
        </div>
      </transition>
    </section>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import * as Vibrant from 'node-vibrant'
import getTypeEffectiveness from '../util/getTypeEffectiveness.js'

export default {
  components: {
    Loader
  },
  mixins: [
    getTypeEffectiveness
  ],
  computed: {
    pokemon () {
      return this.$store.state.pokemon
    },
    pokemonSpecies () {
      return this.$store.state.pokemonSpecies
    },
    typeEffectiveness () {
      return this.getTypeEffectiveness(this.$store.state.pokemon.types)
    }
  },
  data () {
    return {
      errorMessage: null,
      themeHighlight: null,
      limit: 10,
      isLoading: false
    }
  },
  methods: {
    getColorPallet (src) {
      Vibrant.from(src).getPalette()
        .then((palette) => {
          let r = 80
          let g = 80
          let b = 80

          if (palette.DarkMuted && palette.DarkVibrant) {
            r = Math.round(palette.DarkMuted._rgb[0])
            g = Math.round(palette.DarkMuted._rgb[1])
            b = Math.round(palette.DarkMuted._rgb[2])
          }

          this.themeHighlight = `
            <style>
              body {
                background-color: rgba(${r},${g},${b}, 0.5);
              }
              .card, .flag {
                background-color: rgba(${r},${g},${b}, 0.1);
              }
              .app {
                color: rgba(${r},${g},${b}, 1);
              }
            </style>
          `
        })
    },
    isNumber (value) {
      return typeof value === 'number' && isFinite(value)
    },
    search () {
      this.errorMessage = null
      this.isLoading = true
      setTimeout(() => {
        this.$store.dispatch('fetchPokemon', {
          id: null,
          name: this.$route.params.pokemon
        })
          .then(() => {
            this.$router.push(this.pokemon.name)
            this.getColorPallet(this.pokemon.sprites.front_default)
            this.isLoading = false
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
  },
  mounted () {
    this.search()
  },
  watch: {
    '$route' () {
      this.search()
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
  min-height: 112px;
  padding: 2rem 2rem 4rem 2rem;
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
    transform: translateY(24px);
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
  border: 2px solid transparent;
  border-radius: 3px;
  display: inline-block;
  line-height: 1rem;
  padding: 4px 8px;
  position: relative;
  margin-right: 4px;
  margin-top: 4px;

  &.type {
    color: #fff;
  }

  &.super {
    border: 2px solid #111;
  }

  &.none {
    background-color: #999;
  }

  &.last::after {
    bottom: 0;
    content: ' ...';
    left: calc(100% + 8px);
    position: absolute;
    right: 0;
  }

  &.normal { background-color: #b4946b; }
  &.fighting { background-color: #ff6462; }
  &.flying { background-color: #818ccc; }
  &.poison { background-color: #b464a1; }
  &.ground { background-color: #e7b465; }
  &.rock { background-color: #aaa063; }
  &.bug { background-color: #97ab3c; }
  &.ghost { background-color: #836e97; }
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
