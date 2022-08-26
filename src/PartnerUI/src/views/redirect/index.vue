<script>
export default {
  beforeCreate() {
    console.log(this.$route.params)
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  // created() {
  //   console.log(this.$route.params)
  //   const { params, query } = this.$route
  //   const { path } = params
  //   console.log(params + " params query "+ query)
  //   this.$router.replace({ path: '/' + path, query })
  // },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
