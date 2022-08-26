<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane :label="$t('focus.taskList')" name="multitask">
      <multitask/>
    </el-tab-pane>
    <el-tab-pane label="Tamamlanan Görevlerim" name="completed">
        <focus-user-process-list/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { ref } from 'vue'
import multitask from '@/views/dashboard/focus/components/task/components/multitask.vue'
import FocusUserProcessList from "@/views/dashboard/focus/components/task/components/focusUserProcessList";

  export default {
    components :
    {
      FocusUserProcessList,
      multitask
    },

  data() {
    return {
      activeName: null
    }
  },
  created() {
    this.activeName = ref('multitask')
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
