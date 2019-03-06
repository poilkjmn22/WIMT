<template lang="html">
  <div class="animate-checkbox-group" role="group" aria-label="animate-checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AnimateCheckboxGroup',
  componentName: 'AnimateCheckboxGroup',
  props: {
    value: {},
    color: String,
    disabled: Boolean
  }
}
</script>

<style lang="css">
</style>
