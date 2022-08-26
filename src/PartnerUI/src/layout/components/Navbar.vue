<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <search id="header-search"/>

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <p v-if="$store.getters.name" style="white-space: nowrap;margin:0;"
             :data-letters="$store.getters.name.charAt(0)"/>
          <span class="avatar-name">Welcome <span>{{ $store.getters.name }}</span></span>
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/profile/index">
              <el-dropdown-item>Profile</el-dropdown-item>
            </router-link>
            <!-- <router-link to="/">
              <el-dropdown-item>Dashboard</el-dropdown-item>
            </router-link>
            <a
              target="_blank"
              href="https://github.com/PanJiaChen/vue-element-admin/"
            >
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://panjiachen.github.io/vue-element-admin-site/#/"
            >
              <el-dropdown-item>Docs</el-dropdown-item>
            </a> -->
            <el-dropdown-item divided @click="logout">
              <span style="display: block">Logout</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Notification from '@/components/Notification'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    Notification
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('LogOut')
      await this.$router.push({path: `/login?redirect=${this.$route.fullPath}`})
      await this.$store.dispatch('tagsView/delAllCachedViews')
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 80px;
  overflow: hidden;
  position: relative;
  background: transparent;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border: none;

  .hamburger-container {
    line-height: 80px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  #header-search {
    display: inline-block;
    line-height: 80px;
    margin-left: 17px;
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 80px;

    &:focus {
      outline: none;
    }

    .notification-container {
      line-height: 80px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
      margin-right: 50px;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      min-width: 285px;
      height: 40px;
      padding: 5px;
      border-radius: 12px;
      border: solid 1px #ddd;
      background-color: #fff;
      margin-top: 17px;


      .avatar-wrapper {
        position: relative;
        padding-right: 25px;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 100%;
        }

        p {
          display: inline;
        }

        .avatar-name {
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #303133;

          span {
            font-weight: 500;
          }
        }

        i {
          position: absolute;
          right: 5px;
          top: 3px;
          color: #303133;
        }
      }
    }
  }
}

[data-letters]:before {
  content: attr(data-letters);
  display: inline-block;
  font-size: 1.1em;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background: #b7b7b7;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
  cursor: pointer;
}
</style>
