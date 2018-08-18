<template>
  <div class="home">
    <input v-model="searchQuery" autofocus placeholder="Search" type="text">
    <ul v-if="pokemonList">
      <li v-for="(pokemon, index) in pokemonList" :key="index">
        <router-link :to="'/' + pokemon.name">
          <div>{{ pokemon.id }}</div>
          <img class="image" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`">
          <span>{{ pokemon.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    allPokemon () {
      return (!this.$store.state.allPokemon) || this.$store.state.allPokemon.map(pokemon => {
        return {
          name: pokemon.name,
          id: pokemon.url.split('/')[6]
        }
      })
    },
    pokemonList () {
      return this.searchResults || this.allPokemon
    }
  },
  data () {
    return {
      options: {
        keys: ['name', 'id'],
        threshold: 0.1
      },
      searchResults: this.allPokemon,
      searchQuery: ''
    }
  },
  mounted () {
    this.$store.dispatch('fetchAllPokemon')
  },
  watch: {
    searchQuery () {
      this.$search(this.searchQuery, this.allPokemon, this.options).then(results => {
        this.searchResults = results
      })
    }
  }
}
</script>

<style lang="scss" scoped>
input {
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
  max-width: 600px;
  margin: auto;
}

ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 3rem;

  li {
    padding: 4px;
    width: 108px;

    a {
      align-items: center;
      border: 1px solid rgba(#fff, 0.1);
      border-radius: 3px;
      color: #fff;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      padding: 8px;
      position: relative;
      text-decoration: none;
      transition: 0.3s;

      &:hover {
        background-color: rgba(#fff, 0.1);
        border-color: rgba(#fff, 0.2);
      }

      div {
        font-size: 10px;
        line-height: 10px;
        left: 4px;
        position: absolute;
        top: 4px;
      }

      img {
        height: 48px;
        width: 48px;
      }

      span {
        font-size: 12px;
        text-transform: capitalize;
        margin-top: auto;
      }
    }
  }
}
</style>
