<template>
  <div v-if="hasActionPermissionNew($store.getters.permissions, 'customerCardView')">
    <el-form ref="navBarSearchRef" :model="navBarModel">
      <global-search @open="handleDone"/>
    </el-form>
    <Drawer :closeable="false" :mask-closable="true" align="up" z-index=1000 @close="toggle">
      <global-search v-if="open" @open="handleDone"/>
    </Drawer>
  </div>
</template>
<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'
import Drawer from 'vue-simple-drawer'
import GlobalSearch from './Glob.vue'
import {hasActionPermissionNew} from "@/actionPermission";

export default {
    components: {
    Drawer,
    'global-search': GlobalSearch
  },
  name: 'HeaderSearch',
  data() {
    return {
      open: false
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    hasActionPermissionNew,
    handleDone() {
      this.open = false
    },
    toggle() {
      this.open = !this.open
    },
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  display: inline-block;
  line-height: 80px;
  position: relative;
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }
  i {
    font-size: 21px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: #303133;
    position: absolute;
    right: 15px;
    line-height: 80px;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    // ::v-deep .el-input__inner {
    //   border-radius: 0;
    //   border: 0;
    //   padding-left: 0;
    //   padding-right: 0;
    //   box-shadow: none !important;
    //   border-bottom: 1px solid #d9d9d9;
    //   vertical-align: middle;
    // }
  }

  &.show {
    .header-search-select {
      width: 450px;
      margin-left: 10px;
      ::v-deep(.el-input__inner) {
        height: 40px;
        border-radius: 25px;
        border: solid 1px #ddd;
        background-color: #fff;
      }
    }
  }
}
</style>
