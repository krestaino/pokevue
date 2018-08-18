<template>
  <div class='pokeball'>
    <div class='upper'>
      <div class='inner'></div>
    </div>
    <div class='middle'></div>
    <div class='lower'>
      <div class='inner'></div>
    </div>
  </div>
</template>

<style lang="scss">
$width: 50px;
$button-width: 12px;
$spacing: 3px;
$color: #ccc;
$border-width: (($width - $button-width) / 2) - (2/3 * $spacing);
$rotation-speed: 1.5s;

.pokeball {
  width: $width;
  height: $width;
  animation: rotate $rotation-speed linear infinite;
  left: calc(50% - #{$width / 2});
  display: inline-block;
  position: absolute;
  // top: calc(16px + 16px + 16px + 16px + 50px);

  @media (max-width: 680px) {
    margin: 0 auto;
    max-width: 100%;
    top: calc(16px + 16px + 50px);
  }

  .inner {
    width: $width;
    height: $width / 2;
    border: $border-width solid $color;
    box-sizing: border-box;
  }

  .upper, .lower {
    width: 100%;
    position: absolute;
    height: calc(50% - #{$spacing / 2});
    overflow: hidden;
  }

  .upper {
    top: 0;

    .inner {
      border-radius: (($width / 2) + $border-width) (($width / 2) + $border-width) 0 0;
      border-bottom: 0;
      margin-bottom: -$spacing / 2;
    }
  }

  .lower {
    bottom: 0;

    .inner {
      margin-top: -$spacing / 2;
      border-radius: 0 0 (($width / 2) + $border-width) (($width / 2) + $border-width);
      border-top: 0;
    }
  }

  .middle {
    border-radius: 50%;
    width: $button-width;
    height: $button-width;
    background-color: $color;
    position: absolute;
    left: calc(50% - #{$button-width / 2});
    top: calc(50% - #{$button-width / 2});
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
