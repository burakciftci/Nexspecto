<template>
  <div v-loading="busy">
    <el-alert
      v-if="model.processSummary.isActive===false"
      title="Bu süreç arşivlenmiştir. Değişiklik yapılamaz"
      type="info"/>
    <el-card class="process-header">
      <el-row :gutter="10" type="flex" justify="space-between">
        <el-col :span="12">
          <el-tooltip :content="$t('templateList.processCount')" effect="dark" placement="bottom">
            <label style="float: left;"><h3 class="margin-top-0 margin-bottom-0"> {{ model.processSummary.processTitle }} </h3></label>
          </el-tooltip>
        </el-col>
        <el-col :span="12">
          <label style="float:right;" class="black">
            <strong>{{ model.processSummary.templateCodeTitle }}</strong> - Çalışan
            <label style="float: right;margin-left:25px; ">
              <svg-icon icon-class="dummy-profile-icon"
                        style="border-radius:50%;vertical-align:middle;width:20px;height:20px;"/>
              {{ model.processSummary.ownerUserCode }}
            </label></label>
        </el-col>
      </el-row>
      <el-row style="margin-top: 25px;margin-bottom: 25px;">
        <el-col :span="24">
          <el-progress :text-inside="true" :stroke-width="30" :percentage="processSummaryPercentage" color="#ff5252"/>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <label style="float: left;">
            <span class="gray">{{ $t('processListItem.status') }}</span> :
            <span :class="statusColor">
            {{
                model.processSummary.status === 'Wait' ? 'Görev Bekleyen Süreç' : model.processSummary.status === 'Pass' ? 'Görev Tamamlanmış Süreç' : 'Görev Süresi Geçmiş Süreç'
              }}
            </span>
          </label>
        </el-col>
        <el-col :span="8">
          <label style="float: right;">
            <span class="gray">{{ 'Tamamlanan: ' }}</span>
            <span class="black">
             {{ model.processSummary.completedTaskCount }} / {{ model.processSummary.totalTaskCount }}
           </span>
          </label>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;margin-bottom:20px;">
        <div style="height:1px; width:100%;background:#e5e5e5;"/>
      </el-row>
      <el-row :gutter="50">
        <el-col v-for="formItem in model.kickOffFormItems" :key="formItem.formInstanceItemId" :span="6"
                :style="formItem.formItemType ==='customer' || getProductId(formItem)>0 || getProductIdForDocument(formItem)>0 ? '' : 'display:none;'">
          <div
            v-if="formItem.formItemType==='customer' && hasActionPermissionNew(this.$store.getters.permissions,'swchPersonDetailsforTasks')">
            <oneLineCustomer :party-id="formItem.valueString"/>
          </div>
          <div
            v-if="getProductId(formItem)>0 && hasActionPermissionNew(this.$store.getters.permissions,'swchProductDetailsforTasks')">
            <oneLineProduct :product-id="getProductId(formItem)" :party-id="formItem.valueString"/>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row type="flex" justify="end" style="margin-top:25px;" class="process-switch-row">
      <div v-if="hasActionPermissionNew(this.$store.getters.permissions, 'swchProcessHiddenTasks')"
           style="margin-right:20px;">
        <label>Gizli Adımları Göster</label>
        <el-switch
          v-model="showHiddenTasks"
          active-color="#f59f3e"
          inactive-color="#b9b9b9"
        />
      </div>
      <div>
        <label class="margin-right-5">Sürecin Tüm Adımlarını Göster</label>
        <el-switch
          v-model="showAllTasks"
          active-color="#f59f3e"
          inactive-color="#b9b9b9"/>
      </div>
    </el-row>
    <br>
    <process-task-list
      v-if="model.tasks"
      :disabled="model.processSummary.isActive === false"
      :tasks="model.tasks"
      :show-all-tasks="showAllTasks"
      :show-hidden-tasks="showHiddenTasks"
      :kick-off-form-items="model.kickOffFormItems"
      :process-id="model.processSummary.processId"
      @task-assignment-completed="getProcessForUser"
      @task-assignment-changed="getProcessForUser"
      @on-error="$emit('on-error')"/>
  </div>
</template>

<script>


import {hasActionPermissionNew} from "@/actionPermission";
import processApi from '@/api/bpm/process'
import oneLineCustomer from '@/components/OneLine/oneLineCustomer'
import oneLineProduct from '@/components/OneLine/oneLineProduct'
import ProcessTaskList from "@/views/bpm/process/processTaskList";

export default {
  name: 'Process',
  components: {ProcessTaskList, oneLineCustomer, oneLineProduct},
  data() {
    return {
      errorMessage: '',
      showAllTasks: false,
      showHiddenTasks: false,
      superUserAuthorization: false,
      productIdForDocumentTab: 0,
      partyIdForDocumentTab: '',
      busy: false,
      model: {
        processSummary: {
          processId: 0,
          templateTitle: '',
          templateCodeTitle: '',
          completedTaskCount: 0,
          totalTaskCount: 1,
          status: '',
          processTitle: '',
          isActive: false,
          ownerUserCode: ''
        },
        tasks: [
          {
            taskId: 0,
          }
        ],
        kickOffFormItems: []

      },
      validation: {}
    }
  },
  computed: {
    statusColor() {
      if (this.model.processSummary.status === 'Wait') {
        return 'text-info'
      } else if (this.model.processSummary.status === 'Issue') {
        return 'text-danger'
      } else if (this.model.processSummary.status === 'Pass') {
        return 'text-success'
      } else {
        return 'text-default'
      }
    },
    processSummaryPercentage: {
      get() {
        return Math.round(100 *
          (this.model.processSummary.completedTaskCount /
            this.model.processSummary.totalTaskCount))
      }
    }
  },
  mounted() {
    this.showHiddenTasks = hasActionPermissionNew(this.$store.getters.permissions, 'swchProcessHiddenTasks')
    this.superUserAuthorization = hasActionPermissionNew(this.$store.getters.permissions, 'superUserAuthorizationForLookInsideTasks')
    this.$nextTick(() => {
      this.getProcessForUser()
    })
  },
  created() {
  },
  methods: {
    hasActionPermissionNew,
    getProcessForUser() {
      this.model.processId = parseInt(this.$route.params.id, 10)
      this.busy = true
      // this.$store.state.user.sub = '930F8A27-DD80-49BB-8F29-E7121C8D7430' // test için
      processApi.getItem(this.$store.state.user.sub, this.model.processId, this.superUserAuthorization)
        .then((x) => {
          this.model = x.data
          this.busy = false
        })
        .catch(() => {
          this.errorMessage = this.$t('newprocess.loadSummaryError')
          this.busy = false
        })
    },
    getProductId(formItem) {
      const formItemObject = JSON.parse(formItem.content);
      if (!(formItemObject || formItemObject.eventHook)) {
        return 0
      }
      if (formItem.formItemType === 'customerproductinformation' || formItemObject.eventHook === 'ProductId' || formItemObject.eventHook === 'ToProductId' || formItemObject.eventHook === 'CurrentProductId' || formItemObject.eventHook === 'ReceiverProductId') {
        return parseInt(formItem.valueString)
      }
      return 0
    },
    getProductIdForDocument(formItem) {
      const formItemObject = JSON.parse(formItem.content);
      if (!(formItemObject || formItemObject.eventHook)) {
        return ''
      }
      if (formItemObject.eventHook === 'CustomerGuid') {
        this.partyIdForDocumentTab = formItem.valueString
      }
      return ''
    }
  },

}
</script>
<style lang="scss" scoped>
.process-header {
  border-radius: 12px;
  border: solid 1px #ddd;
  background: #fff;
  box-shadow: none;
  // ::v-deep(.el-progress-bar__outer) {
  //   box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  //   border: solid 1px #e5e5e5;
  //   background-color: #fff;
  // }
  // ::v-deep(.el-progress-bar__innerText) {
  //   display: inline-flex;
  //   align-items: center;
  //   justify-content: center;
  //   color: #000;
  //   font-size: 12px;
  //   margin: -20px 0px 0px -70px;
  //   background: #fff;
  //   width: 70px;
  //   height: 70px;
  //   border-radius: 100%;
  //   border: solid 1px #e5e5e5;
  //   position: fixed;
  // }
}

.gray {
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #b7b7b7;
}

.orange {
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #f59f3e;
}

.black {
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000;
}

:deep(.process-switch-row) {
  .el-switch__core {
    width: 60px !important;
    height: 30px !important;
    border-radius: 20px !important;

    &:after {
      top: 4px !important;
      left: 4px !important;
      width: 20px !important;
      height: 20px !important;
    }
  }

  .el-switch.is-checked .el-switch__core::after {
    left: 100% !important;
    margin-left: -24px !important;
  }
}

// .process-header >>> {
//   .el-progress-bar__innerText {
//     z-index: 6;
//     width: 70px;
//     height: 70px;
//     background: #fff;
//     color: #000;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 50%;
//   }
// }
</style>
