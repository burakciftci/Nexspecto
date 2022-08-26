<template>

  <div
    v-loading="busy"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading">
    <el-dialog v-model="dialogVisible" title="Hatırlatma Notu" width="30%">
      <el-input v-model="model.notes" type="textarea" placeholder="Hatırlatma Notu Giriniz"/>
      <br>
      <br>
      <el-row type="flex" justify="end">
        <el-button :disabled="process" type="action" @click.once="saveDialog">Kaydet</el-button>
        <el-button class="default-button" @click="closeDialog">İptal</el-button>
      </el-row>
    </el-dialog>
    <div>
      <el-row>
        <el-col align="right">
          <el-button v-if="showNewButton" type="action" icon="el-icon-edit-outline" @click="openDialog">
            {{ "Not Ekle" }}
          </el-button>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-table
          v-loading="busy"
          :data="lifeCycleList"
          :header-row-class-name="tableHeader"
          :header-cell-class-name="tableCell"
          :row-class-name="rowStyle"
          element-loading-text="Loading..."
          element-loading-spinner="el-icon-loading"
          style="width: 100%;">
          <el-table-column label="Zaman" prop="createTime">
            <template v-slot="listscope">
              {{ listscope.row.createTime }}
            </template>
          </el-table-column>
          <el-table-column label="Kullanıcı/Birim" prop="userNameSurname">
            <template v-slot="listscope">
              {{ listscope.row.userNameSurname }} / {{ listscope.row.position }}
            </template>
          </el-table-column>
          <el-table-column label="İşlem" prop="lifeCycleStatus">
            <template v-slot="listscope">
              {{ listscope.row.lifeCycleStatus }}
            </template>
          </el-table-column>
          <el-table-column label="Açıklama" prop="description">
            <template v-slot="listscope">
              {{ listscope.row.description }}
            </template>
          </el-table-column>
          <el-table-column label=" " prop="userDescription">
            <template v-slot="listscope">
              {{ listscope.row.userDescription }}
            </template>
          </el-table-column>
          <el-table-column label="Aktivite Türü" prop="activityType">
            <template v-slot="listscope">
              {{ listscope.row.activityType }}
            </template>
          </el-table-column>
        </el-table >
      </el-row>
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
    </div>
  </div>
</template>

<script>

import lifecycleApi from '@/api/crm/customerLifeCycle'
import noteApi from '@/api/crm/partyNote'

export default {
  props: {
    partyId: {
      type: Number,
      default: 0
    },
    showNewButton: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      busy: false,
      lifeCycleList: [],
      visible: false,
      dialogVisible: false,
      model: {
        partyId: this.partyId,
        notes: '',
        partyNoteId: 0
      },
      listQuery: {
        pageSize: 10,
        pageIndex: 1
      },
      count: 0,
      process: false
    }
  },
  created() {
    this.listQuery.pageSize = this.pageSize
    this.getCustomerLifeCycleList()
    this.getLatestNote()
  },
  methods: {
    tableHeader({ row, rowIndex }) {
      return 'tableHeader'
    },
    tableCell({ row, rowIndex, column, columnIndex }) {
      return 'transparent'
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'light'
      } else {
        return 'dark'
      }
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    preventClick() {
      this.saveDialog()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getCustomerLifeCycleList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getCustomerLifeCycleList()
    },
    saveDialog() {
      if (this.process) {
        return
      }
      this.process = true
      this.busy = true
      var save = (this.model.partyNoteId !== 0)
        ? noteApi.updatePartyNote(this.model)
        : noteApi.savePartyNote(this.model)
      save.then((v) => {
        this.$emit('saved')
      })
        .catch((err) => {
          console.log('err :', err)
          this.dialogVisible = false
        })
      this.busy = false
      this.process = false
    },
    getLatestNote() {
      noteApi
        .getLatestNote(this.partyId)
        .then((v) => {
          this.model.notes = v.data.result !== null ? v.data.result.description : ''
          this.model.partyNoteId = v.data.result !== null ? v.data.result.partyNoteId : 0
          this.dialogVisible = false
        })
        .catch(() => {
          this.dialogVisible = false
        })
    },
    getCustomerLifeCycleList() {
      this.busy = true
      lifecycleApi
        .getCustomerLifeCycleListByPartyId(this.partyId, this.listQuery)
        .then((v) => {
          this.lifeCycleList = v.data.result.data
          this.count = v.data.result.count
          this.busy = false
        })
        .catch(() => {
          this.$notify.error(this.$t('notify.error'))
          this.busy = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
