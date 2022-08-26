<template>
  <section class="app-main">
    <router-view v-slot="{ Component }" >
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="key"/>
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  width: calc(100% + 2px);
  position: relative;
  left: -1px;
  top: -2px;
  overflow: hidden;
  padding: 30px;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  border: solid 1px #ddd;
  background-color: #f5f5f5;
}
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>