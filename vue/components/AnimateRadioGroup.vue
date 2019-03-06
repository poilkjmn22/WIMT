<template lang="html">
  <div
    class="animate-radio-group"
    role="radiogroup"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AnimateRadioGroup',
  componentName: 'AnimateRadioGroup',
  props: {
    value: {},
    disabled: Boolean,
    color: String
  },
  created() {
    this.$on('handleChange', value => {
      this.$emit('change', value);
    });
  }
}
</script>

<style lang="css">
</style>
