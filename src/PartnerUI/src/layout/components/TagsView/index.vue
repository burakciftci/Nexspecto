<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in cachedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent="openMenu(tag,$event)"
      >
        {{generateTitle(tag.title, tag.params)}}
        <i v-if="isActive(tag)" class="fa-solid fa-xmark" @click.prevent.stop="closeSelectedTag(tag)"></i>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Yenile</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Kapat</li>
      <li @click="closeOthersTags">Diğerlerini Kapat</li>
      <li @click="closeAllTags(selectedTag)">Tümünü Kapat</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import path from 'path'
import {ref} from 'vue'
import { generateTitle } from '@/utils/i18n'

export default {
  components: { ScrollPane
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      console.log('value', value)
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    generateTitle,
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      console.log(tags)
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ cachedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(cachedViews, view)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ cachedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(cachedViews, view)
      })
    },
    toLastView(cachedViews, view) {
      const latestView = cachedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 27px;
  width: 100%;
  background: transparent;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      // border: 1px solid #d8dce5;
      color: #bfbfbf;
      background: transparent;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      &::after {
        content: '';
        width: 1px;
        height: 14px;
        background-color: #ddd;
        position: absolute;
        margin-left: 10px;
        top: 5px;
      }
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        color: #d6001c;
        margin-left: 7px !important;
        margin-right: 4px;
        position: relative;
        z-index: 1;
        &:before {
          content: "";
          position: absolute;
          top: -2px;
          right: 0;
          width: 100%;
          height: 30px;
          line-height: 30px;
          background-color: #f5f5f5;
          z-index: -1;
          border-top-left-radius: 15px;
          border-top-right-radius: 60px;
          transform: skewX(-10deg);
          transform-origin: 100% 100%;
          margin-right: 10px;
        }
        &:after{
          content:"";
          position:absolute;
          top:-2px; left:0;
          width:100%;
          height: 30px;
          line-height: 30px;
          background-color:#f5f5f5;
          z-index:-1;
          border-top-right-radius: 15px;
          border-top-left-radius: 60px;
          -ms-transform: skewX(10deg);
          -webkit-transform: skewX(10deg);
          transform: skewX(10deg);

        -ms-transform-origin:100% 100%;
          -webkit-transform-origin:100% 100%;
          transform-origin:100% 100%;
        }
        &:last-child {
          &::after {
            content:"";
          position:absolute;
          top:-2px; left:0;
          width:100%;
          height: 30px;
          line-height: 30px;
          background-color:#f5f5f5;
          z-index:-1;
          border-top-right-radius: 15px;
          border-top-left-radius: 60px;
          -ms-transform: skewX(10deg);
          -webkit-transform: skewX(10deg);
          transform: skewX(10deg);

          -ms-transform-origin:100% 100%;
          -webkit-transform-origin:100% 100%;
          transform-origin:100% 100%;
          display: block !important;
          }
        }
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
      &.previous {
        &::after {
          display: none;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  ::v-deep(.el-scrollbar__view) {
    padding-left: 75px;
    border-top: 1px solid #ddd;
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
