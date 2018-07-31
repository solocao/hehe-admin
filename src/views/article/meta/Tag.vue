<template>
  <div>
    <span v-for="item in data">
      {{item.name}}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      default: null
    }
  },
  methods: {

  }

};
</script>

