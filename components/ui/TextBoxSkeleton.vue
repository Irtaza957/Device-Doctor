<template>
  <div class="issues h-16 sm:w-80 bg-light-gray mb-2" />
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.issues {
    position: relative;
    overflow: hidden;
    &::after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      transform: translateX(-50%);
      background: linear-gradient(to right, #E4E4E4, #f3f3f3, #E4E4E4);
      animation: move .8s infinite;
    }
}

@media only screen and (max-width: 639px) {
  .issues {
    width: calc(75vw);
  }
}

@keyframes move {
  0%{
    transform: translateX(-50%);
  }
  100%{
    transform: translateX(100%);
  }
}
</style>
