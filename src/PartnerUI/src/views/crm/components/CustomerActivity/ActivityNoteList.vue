<template>
  <div>
    <el-col>
      <el-table :data="noteList" style="width: 100%;">
        <el-table-column :label="$t('personEdit.user')" prop="userDescription"/>
        <el-table-column :label="$t('personEdit.description')" prop="description" />
        <el-table-column :label="$t('personEdit.subject')" prop="subject" />
        <el-table-column :label="$t('personEdit.date')">
          <template v-slot="scope">
            {{ $filters.parseTime(scope.row.fromDate,'{dd}.{mm}.{yyyy}') }}
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          :current-page="listQuery.pageIndex"
          :page-sizes="[5,10,20,30, 50]"
          :page-size="listQuery.pageSize"
          :total="count"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-col>
  </div>

</template>

<script>

import noteApi from '@/api/crm/partyNote'

export default {
  props: {
    customerId: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      busy: false,
      noteList: [],
      partyId: '',
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      count: 0
    }
  },
  mounted() {
    this.listQuery.pageSize = this.pageSize
    this.getNotes()
  },
  methods: {
    getNotes() {
      this.busy = true
      noteApi.getActivityNotifications(this.partyId, this.listQuery, this.customerId) // b349f953-2477-4849-985a-6eadf3a7388c
        .then((v) => {
          if (v.data.success) {
            this.noteList = v.data.result.data
            this.count = v.data.result.count
          }
        })
        .catch()
        .finally(() => {
          this.busy = false
        })
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getNotes()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getNotes()
    }
  }
}

</script>
