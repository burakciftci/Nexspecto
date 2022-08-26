<template>
  <div class="notification">
    <i class="fa-solid fa-bell"></i>
    <div class="notification-badge">
        7
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data() {
      return {

      }
  }
}
</script>

<style scoped>
.notification {
  position: relative;
}
.notification i{
    width: 30px;
    height: 30px;
    padding: 8px;
    border-radius: 12px;
    background-color: #ff7c52;
    color: #fff;
    position: relative;
}
.notification .notification-badge {
    width: 24px;
    height: 24px;
    border: solid 1px #fff;
    background-color: #fbe342;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: -20px;
    bottom: 30px;
    border-radius: 100%;
}
</style>
