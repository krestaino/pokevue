<template>
  <div class="home">
    <input v-model="searchQuery" autofocus type="text">
    <ul>
      <li v-for="(pokemon, index) in searchResults" :key="index">
        <router-link :to="'/' + pokemon.name">
          <div>
            <img class="image" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`">
          </div>
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
      return this.$store.state.allPokemon.map(pokemon => {
        return {
          name: pokemon.name,
          id: pokemon.url.split('/')[6]
        }
      })
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
}

ul {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(6, 1fr);
  margin-top: 8px;

  li {
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
      text-decoration: none;
      transition: 0.3s;

      &:hover {
        background-color: rgba(#fff, 0.1);
        border-color: rgba(#fff, 0.2);
      }

      img {
        height: 48px;
        widows: 48px;
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
