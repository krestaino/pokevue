<template>
  <div class="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/pokemon">Pokemon</router-link>
    </div> -->
    <h1>Pokévue</h1>
    <router-view/>
  </div>
</template>

<style lang="scss">
html {
  box-sizing: border-box;
  background-color: #111;
  overflow-y: scroll;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  background-color:#282828;
  background-size:16px 16px;
  display: grid;
  min-height: 100vh;
  height: 100%;
  transition: 0.5s;
}

.app {
  font-family: 'Open Sans', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #585858;
  padding: 3rem;
  max-width: 2560px;
  width: 100%;

  @media (max-width: 680px) {
    margin: 0 auto;
    max-width: 100%;
  }

  h1 {
    color: #fff;
    font-size: 20px;
    font-weight: 300;
    margin-bottom: 1rem;
    text-align: center;
  }
}

#nav {
  padding: 30px 0;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
