<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="Bekleyen Görevlerim" name="pending">
        Bekleyenler
    </el-tab-pane>
    <el-tab-pane label="Tamamlanan Görevlerim" name="completed">
        Tamamlananlar
    </el-tab-pane>
  </el-tabs>
</template> 
<script>
import { ref } from 'vue'

  export default { 
  data() {
    return {
      activeName: null
    }
  },
  created() {
    this.activeName = ref('pending')
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