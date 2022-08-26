<template>
  <div class="productNote">
    <el-dialog
      v-model="dialogVisible"
      title="Tasarruf Planı Notu"
      width="30%">
      <el-select v-model="model.noteType" style="margin-bottom:20px;">
        <el-option
          v-for="item in noteTypeList"
          :key="item.name"
          :label="item.title"
          :value="item.name"/>
      </el-select>
      <el-input
        v-model="model.notes"
        type="textarea"
        placeholder="Tasarruf Planı Notu Giriniz"/>
      <br>
      <br>
      <el-row type="flex" justify="end">
        <el-button type="secondary" @click="closeDialog">İptal</el-button>
        <el-button :disabled="process" type="action" @click.prevent="saveDialog">Kaydet</el-button>
      </el-row>
    </el-dialog>
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="Notlar">
        <el-row>
          <el-col align="right">
            <el-button :loading="busy" type="secondary" icon="el-icon-edit-outline" @click="openDialog">
              {{ "Not Ekle" }}
            </el-button>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-table v-loading="busy" :data="noteList" :header-row-class-name="tableHeader" :header-cell-class-name="tableCell" :row-class-name="rowStyle" style="width: 100%;">
            <el-table-column label="Zaman" prop="date" width="150px">
              <template v-slot="listscope">
                <span>{{  $filters.parseTime(listscope.row.date, '{d}.{m}.{y}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Kullanıcı" prop="username" width="150px">
              <template v-slot="listscope">
                {{ listscope.row.username }}
              </template>
            </el-table-column>
            <el-table-column label="Not Tipi" prop="title" width="225px">
              <template v-slot="listscope">
                {{ listscope.row.noteType }}
              </template>
            </el-table-column>
            <el-table-column label="Açıklama" prop="description">
              <template v-slot="listscope">
                 {{ listscope.row.description }}
              </template>
            </el-table-column>
          </el-table >
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-pagination
              :current-page="listQuery.page"
              :page-sizes="[10,20,30, 50]"
              :page-size="listQuery.pageSize"
              :total="count"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </el-col>
        </el-row>
      </el-tab-pane>
   
    </el-tabs>
    <div class="app-container"/>
  </div>
</template>

<script>

import partnerApi from '@/api/finance/partner'
import { Money } from 'v-money'
import { MoneyFormats } from '@/utils/globalVars'
import moment from 'moment'

export default {
  components: {
    Money
  },
  props: {
    createDate: {
      type: String,
      default: null
    },
    productId: {
      type: Number,
      default: 0
    }
  },
  data() {
    var validAmount = (rule, value, callback) => {
      if (value > 0) {
        if (value < 10000000) {
          callback
        } else {
          callback(new Error('Lütfen 10.000.000 TL\'den küçük bir değer giriniz!'))
        }
        callback()
      } else {
        callback(new Error('Lütfen sıfırdan büyük bir değer giriniz!'))
      }
    }
    var createDate = this.createDate
    return {
      MoneyFormats,
      firstPaymentAmountSum: 0,
      tabPosition: 'left',
      busy: false,
      productNoteList: [],
      noteList: [],
      visible: false,
      dialogVisible: false,
      model: {
        productId: this.productId,
        notes: '',
        partyNoteId: 0,
        noteType: '',
        amount: 0,
        paymentDate: '',
        description: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      count: 0,
      noteTypeList: [{ name: 'Note', title: 'Not' }, { name: 'FinanceNote', title: 'Finans Notu' }, { name: 'DeliveryNote', title: 'Teslimat Notu' }, { name: 'GMDeliveryCoordinationNote', title: 'GM Tah. Koor. Bilg. Notu' }, { name: 'BranchDeliveryCoordinationNote', title: 'Şube Tah. Koor. Bilg. Notu' }, { name: 'CozumNote', title: 'Çözüm Notu' }],
      process: false,
      validation: {
        paymentDate: [
          { required: true, message: 'Lütfen bir değer giriniz!' }
        ],
        amount: [
          { required: true, validator: validAmount }
        ]
      },
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          var myDate = moment(moment().subtract(1, 'days').toDate().toDateString())
          var futureDate = moment(moment(createDate).add(15, 'days').toDate().toDateString())
          return !(moment(time).isBetween(myDate, futureDate))
        }
      }
    }
  },
  watch: {
  },
  created() {
    this.model.productId = this.productId
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
      //this.firstPaymentPromiseDialogVisible = false
    },
    preventClick() {
      this.saveDialog()
    },
    checkDate() {
      var myDate = moment(moment().toDate().toDateString())
      var futureDate = moment(moment(this.createDate).add(15, 'days').toDate().toDateString())
      return moment().isBetween(myDate, futureDate)
    },
    saveDialog() {
      if (this.busy === true) return

      this.process = true
      this.busy = true
      partnerApi
        .savePartyNote(this.model)
        .then((v) => {
          if (v.data.success) {
            this.$emit('saved')
            this.getLatestNote()
            this.clearAreas()
            this.dialogVisible = false
            this.process = false
            this.$notify.success(this.$t('notify.success'))
          } else {
            this.$notify.error(this.$t('notify.' + v.data.errorMessage))
            this.process = false
          }
        })
        .catch((err) => {
          console.log('err :', err)
          this.dialogVisible = false
          this.process = false
        })
      this.busy = false
      this.process = false
    },
    getLatestNote() {
      this.busy = true
      partnerApi
        .getLatestNote(this.model.productId, this.listQuery)
        .then((v) => {
          this.noteList = v.data.data
          this.count = v.data.count
          this.dialogVisible = false
        })
        .catch((err) => {
          console.log('errrrrr: ', err)
          this.dialogVisible = false
        })
      this.busy = false
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getLatestNote()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getLatestNote()
    },
    clearAreas() {
      this.model.notes = ''
      this.model.partyNoteId = ''
      this.model.noteType = ''
    },
  }
}
</script>

<style lang="scss" scoped>
.productNote ::v-deep(.delivery) {
  .cell {
    line-height: 24px !important;
  }
}
.description-popover {
  div:nth-child(2) {
    height: 150px;
    overflow-y: auto;
    padding-right: 10px;
    &::-webkit-scrollbar-thumb
      {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #C84243;
      }
     &::-webkit-scrollbar
      {
        width: 6px;
        background-color: #F5F5F5;
      }
      &::-webkit-scrollbar-track
      {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
      }
  }
}
.long-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
}
</style>
