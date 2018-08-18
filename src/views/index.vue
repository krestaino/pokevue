<template>
  <div class="home">
    <input v-model="searchQuery" autofocus placeholder="Search" type="text">
    <div class="container" :class="{ '--open': $route.params.pokemon }">
      <ul v-if="pokemonList" :style="{ height: maxHeight + 'px' }">
        <li v-for="(pokemon, index) in pokemonList" :key="index">
          <router-link :to="'/' + pokemon.name">
            <div>{{ pokemon.id }}</div>
            <img class="image" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`">
            <span>{{ pokemon.name }}</span>
          </router-link>
        </li>
      </ul>
      <aside>
        <Pokemon v-if="$route.params.pokemon" :pokemon="$route.params.pokemon"/>
      </aside>
    </div>
  </div>
</template>

<script>
import Pokemon from '@/components/Pokemon.vue'

export default {
  components: {
    Pokemon
  },
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
      maxHeight: null,
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
        (this.searchQuery === '' && !results.length)
          ? this.searchResults = null
          : this.searchResults = results
      })
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  border-radius: 3px;
  box-shadow: 0px 0px 100px 0px rgba(0,0,0,0.25);
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

.container {
  display: flex;
  margin-top: 3rem;
  position: relative;
  transition: transform 0.3s;

  &.--open {
    transform: translateX(-300px);
  }
}

ul {
  display: flex;
  flex: 4;
  flex-wrap: wrap;
  justify-content: center;
  transition: 0.3s;

  .--open & {
    justify-content: flex-start;
  }

  li {
    opacity: 0;
    padding: 0 8px 8px 0;
    width: 108px;

    @for $i from 1 through 1000 {
      &:nth-child( #{$i} ) {
        animation: fade .3s #{$i * 0.003}s ease 1 forwards;
      }
    }

    @keyframes fade {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    a {
      align-items: center;
      background-color: rgba(#fff, 0.025);
      border: 1px solid rgba(#fff, 0.1);
      border-radius: 3px;
      color: #fff;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      padding: 16px 8px;
      position: relative;
      text-decoration: none;
      transition: 0.3s;

      &:hover,
      &.router-link-active  {
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
        line-height: 13px;
        text-align: center;
        text-transform: capitalize;
        margin-top: 4px;
      }
    }
  }
}

aside {
  left: 100%;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.3s;
  width: 600px;

  .--open & {
    opacity: 1;
  }
}
</style>
