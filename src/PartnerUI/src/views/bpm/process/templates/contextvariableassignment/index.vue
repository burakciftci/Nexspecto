<template>
  <div/>
</template>
<script>
export default {
  components: {
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    formItemContent: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    this.value.formItems[this.index].value[0] = this.formItemContent.label
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

