<template>
  <div>
    <div class="flex justify-center items-center">
      <div class="boxes w-full bg-light-gray" />
    </div>
    <div class="sm:h-6 h-4 w-full bg-light-gray sm:mt-4 mt-3" />
    <div class="sm:h-6 h-4 w-1/2 bg-light-gray sm:mt-3 mt-1.5" />
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.boxes{
  height: calc(100vw / 6);
  max-height: 240px;
  min-height: 150px;
}

.bg-light-gray {
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

@keyframes move {
  0%{
    transform: translateX(-50%);
  }
  100%{
    transform: translateX(100%);
  }

}
</style>
