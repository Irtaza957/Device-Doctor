<template>
  <div class="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-black bg-opacity-10 backdrop-filter z-50">
    <div
      class="bg-white rounded shadow-lg w-80 sm:w-96"
      data-aos="flip-left"
      data-aos-duration="400"
    >
      <div class="p-5">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
        >
          <svg
            class="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div class="my-6 text-center">
          <p class="text-sm text-gray-500">
            {{ popupInformation }}
          </p>
        </div>
        <div class="items-center px-4 py-3">
          <button
            id="ok-btn"
            class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            @click="$emit('closeModal')"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    popupInformation: {
      type: String,
      default: () => ''
    }
  }
}
</script>
