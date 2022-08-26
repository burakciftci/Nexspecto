<template>
  <div
    v-loading="busy">
      <el-table
        v-loading="busy"
        :data="lifeCycleList">
        <el-table-column label="Zaman" prop="createTime">
          <template v-slot="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="Kullanıcı/Birim" prop="userNameSurname">
          <template v-slot="scope">
            {{ scope.row.userNameSurname }} / {{ scope.row.position }}
          </template>
        </el-table-column>
        <el-table-column label="İşlem" prop="lifeCycleStatus">
          <template v-slot="scope">
            {{ scope.row.lifeCycleStatus }}
          </template>
        </el-table-column>
        <el-table-column label="Açıklama" prop="description">
          <template v-slot="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label=" " prop="userDescription">
          <template v-slot="scope">
            {{ scope.row.userDescription }}
          </template>
        </el-table-column>
        <el-table-column label="Aktivite Türü" prop="activityType">
            <template v-slot="scope">
              {{ scope.row.activityType }}
            </template>
          </el-table-column>
      </el-table>
      <div>
        <el-pagination
          :current-page="listQuery.pageIndex"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.pageSize"
          :total="count"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
</template>
<script>
import customerActivityApi from '@/api/crm/customerActivity'

export default {
  props: {
    customerId: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      busy: false,
      lifeCycleList: [],
      listQuery: {
        pageSize: 10,
        pageIndex: 1
      },
      count: 0
    }
  },
  created(){
    this.getCustomerLifeCycleList()
  },
  methods: {
    getCustomerLifeCycleList() {
      this.busy = true
      customerActivityApi
        .getCustomerLifeCycleListByPartyId(this.customerId, this.listQuery)
        .then((v) => {
          this.lifeCycleList = v.data.result.data
          console.log(this.lifeCycleList,'this.lifeCycleList')
          this.count = v.data.result.count
          this.busy = false
        })
        .catch(() => {
          this.$notify.error(this.$t('notify.error'))
          this.busy = false
        })
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getCustomerLifeCycleList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getCustomerLifeCycleList()
    },
  }
}
</script>