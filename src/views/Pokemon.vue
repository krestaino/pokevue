<template>
  <div class="pokemon">
    <input type="text" autofocus @keydown.enter="search" placeholder="Search by name or ID" v-model="query">
    <input type="button" value="Go" @click="search">
    <section v-if="pokemon && pokemonSpecies && !isLoading">
      <div>
        <h1 class="title-case">{{ pokemonSpecies.name }} <span class="id">#{{ pokemonSpecies.id }}</span></h1>
        <p>
          <img class="image" :src="pokemon.sprites.front_default">
        </p>
        <p>{{ pokemonSpecies.flavor_text_entries.filter(description => description.language.name === 'en')[0].flavor_text }}</p>
      </div>
      <div class="card">
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
      <div class="card">
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
          class="title-case flag"
          v-for="(type, index) in pokemon.types"
          :key="index">{{ toTitleCase(type.type.name) }}
        </span>
      </div>

      <h2>Abilities</h2>
      <div class="flag-container">
        <span
          class="title-case flag"
          v-for="(ability, index) in pokemon.abilities"
          :key="index">{{ toTitleCase(ability.ability.name) }}
        </span>
      </div>

      <h2>Moves</h2>
      <div class="flag-container">
        <span
          class="title-case flag"
          v-for="(move, index) in pokemon.moves"
          :key="index">{{ toTitleCase(move.move.name) }}
        </span>
      </div>
    </section>
    <Loader v-if="isLoading"/>
    <div v-if="errorMessage">{{ errorMessage.toString() }}</div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'

export default {
  components: {
    Loader
  },
  computed: {
    pokemon () {
      return this.$store.state.pokemon
    },
    pokemonSpecies () {
      return this.$store.state.pokemonSpecies
    }
  },
  data () {
    return {
      errorMessage: null,
      isLoading: false,
      query: ''
    }
  },
  methods: {
    search () {
      this.isLoading = true
      setTimeout(() => {
        this.$store.dispatch('fetchPokemon', this.query)
          .then(() => {
            this.$store.dispatch('fetchSpecies', this.pokemon.species.name)
            this.isLoading = false
          })
          .catch(error => {
            this.errorMessage = error
            this.isLoading = false
          })
      }, 333)
    },
    toTitleCase (string) {
      return string.replace('-', ' ').trim()
    }
  }
}
</script>

<style scoped lang="scss">
.id {
  opacity: 0.5;
}

.image {
  height: 96px;
  width: 96px;
}

.card {
  background-color: #ddd;
  border-radius: 3px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px;

  span {
    display: block;
  }

  .stat {
    font-weight: bold;
  }
}

.title-case,
.title {
  text-transform: capitalize;
}

.flag-container {
  margin-top: -4px;
}

.flag {
  background-color: #ddd;
  border-radius: 3px;
  display: inline-block;
  padding: 4px 8px;
  margin-right: 4px;
  margin-top: 4px;
}
</style>
