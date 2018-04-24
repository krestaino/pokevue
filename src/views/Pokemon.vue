<template>
  <div class="pokemon">
    <input type="text" autofocus @keydown.enter="search" v-model="query">
    <input type="button" value="Go" @click="search">
    <section v-if="pokemon && pokemonSpecies">
      <div>
        <h1 class="title-case">{{ pokemonSpecies.name }} <span class="id">#{{ pokemonSpecies.id }}</span></h1>
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
  </div>
</template>

<script>
export default {
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
      query: ''
    }
  },
  methods: {
    search () {
      this.$store.dispatch('fetchPokemon', this.query).then(() => {
        this.$store.dispatch('fetchSpecies', this.pokemon.species.name)
      })
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

.card {
  background-color: #ddd;
  border-radius: 3px;
  display: inline-block;
  padding: 12px;

  div + div {
    margin-top: 8px;
  }

  span {
    display: block;
  }

  .stat {
    font-weight: bold;
  }
}

.title-case {
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
