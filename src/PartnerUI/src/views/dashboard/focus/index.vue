<template>
  <div>
    <task/>
  </div>
</template>
<script>
import { ref } from 'vue'
import task from './components/task/index'

  export default {
       components: {
    task,
  },
  data() {
    return {
      activeName: null
    }
  },
  created() {
    this.activeName = ref('tasks')
  },
  methods:{
    handleClick (tab, event) {
        console.log(tab, event)
    }
  }
}

</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  background-color: #f4f5f7;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
