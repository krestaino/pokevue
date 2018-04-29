<template>
  <div class="app themeHighLight--color--muted--10">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/pokemon">Pokemon</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style lang="scss">
html {
  background-color: #111;
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
  margin: 2% auto;
  max-width: 600px;
  width: 100%
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
