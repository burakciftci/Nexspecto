<template>
  <div v-loading="loading" class="global-search">
    <div @keyup.enter="searchWithText">
      <el-select
        :hidden="true"
        v-if="options.searchType"
        v-model="listQuery.searchArea"
        style="width:0%;display: none;"
        @change="clearSearchText">
        <el-option :value="'name'" :label="'İsim'">İsim</el-option>
      </el-select>
      <el-input
        v-uppercase
        v-model="searchText"
        :key="keyValue"
        placeholder="Arama yapınız..."
        :style="innerShowTable?'z-index:20000;':''"
      />
      <i class="fa-solid fa-magnifying-glass" :style="innerShowTable?'z-index:20000;':''" @click="searchWithText" />
    </div>
    

    <slot name="header"/>
    <el-dialog v-model="innerShowTable" :title="'Toplam Kayıt: ' + items.length" custom-class="result-dialog" :show-close="false">
    <div v-if="innerShowTable" style="margin-top:20px;">
      <tree-table
        v-if="perspectiveOptions.mode === 'treetable'"
        ref="table1"
        :data="items"
        :expand-all="true"
        border
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortHandler"
        @filter-change="filterHandler">
        <slot name="table-columns"/>
      </tree-table>
      <el-table
        v-if="perspectiveOptions.mode === 'table'"
        ref="table1"
        :data="items"
        :row-style="paymentDateList ? color : null"
        :stripe="paymentDateList ? false : true"
        :show-header="false"
        border
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortHandler"
        @filter-change="filterHandler">
        <slot name="table-columns"/>
      </el-table>
      <div v-if="perspectiveOptions.mode === 'div'" class="scroll-list">
        <div :data="items" @sort-change="sortHandler" @filter-change="filterHandler">
          <slot name="custom"/>
        </div>
      </div>
      <el-col :span="12">
        <el-pagination
          v-if="perspectiveOptions.showPaging"
          :current-page="listQuery.page"
          :page-sizes="perspectiveOptions.pageSizes"
          :page-size="listQuery.limit"
          :total="count"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-col>
      <el-col :span="4">
        <el-dropdown
          v-if="perspectiveOptions.showArchive || perspectiveOptions.showActive"
          :hide-on-click="false"
          :show-timeout="100"
          size="mini"
          split-button
          trigger="click">{{
            listQuery.isActive && listQuery.isArchive ? this.$t('templateList.actives') + ', ' + this.$t('templateList.archives') : (listQuery.isActive ? this.$t('templateList.actives') : (listQuery.isArchive ? this.$t('templateList.archives') : ' Yok '))
          }}
          <el-dropdown-menu slot="dropdown">
            <el-checkbox
              v-if="perspectiveOptions.showArchive"
              v-model="listQuery.isArchive"
              :label="$t('templateList.archives')"
              @change="handleCheckBox"/>
            <el-checkbox
              v-if="perspectiveOptions.showActive"
              v-model="listQuery.isActive"
              :label="$t('templateList.actives')"
              @change="handleCheckBox"/>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col
        v-if="sumOfFinanceAmount && sumOfWorkingCostAmount"
        :span="8"
        style="float: right; padding-right: 0px; text-align: end;">
        <el-tag type="blue" style="font-size: 15px;">
          {{ 'Toplam F.B: ' + sumOfFinanceAmount }}
        </el-tag>
        <el-tag type="blue" style="font-size: 15px;">
          {{ 'Toplam Ç.B: ' + sumOfWorkingCostAmount }}
        </el-tag>
      </el-col>
      <el-col :span="8" style="float: right; padding-right: 10px; text-align: end;">
        <slot name="footer-summary"/>
      </el-col>
    </div>
    </el-dialog>

  </div>
</template>
<script>
import lookupApi from '@/api/bpm/lookup'
import treeTable from '@/components/TreeTable'
import { MoneyFormats } from '@/utils/globalVars'
import Drawer from 'vue-simple-drawer'


export default {
  name: 'GlobalSearch',
  components: {
    treeTable,
    Drawer
  },
  props: {
    searchDescription: {
      type: String,
      default: ''
    },
    microservice: {
      type: String,
      default: '',
      validator: function(value) {
        return ['crm', 'kernel', 'finance', 'dms', 'audit', 'identity', 'hr'].indexOf(value) !== -1
      }
    },
    employeeListType: {
      type: String,
      default: 'normal'
    },
    internalOrganizationListType: {
      type: String,
      default: 'normal'
    },
    loading: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    sumOfFinanceAmount: {
      type: String,
      default: null
    },
    sumOfWorkingCostAmount: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    // filters: {
    //   type: Array,
    //   default: () => []
    // },
    // filterProperty: {
    //   type: String,
    //   default: ''
    // },
    defaultFilters: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: 20
    },
    onCard: {
      type: Boolean,
      default: false
    },
    searchArea: {
      type: String,
      default: 'name'
    },
    options: {
      type: Object,
      default: () => {
        return {
          showSearchText: true,
          defaultDayFilter: '1',
          showArchive: true,
          showActive: true,
          showPaging: true,
          searchType: false,
          pageSizes: [10, 20, 30, 50],
          showAllDatesButton: true,
          showYesterdayButton: true,
          showTodayButton: true,
          showDatePicker: true,
          initialDateRange: [],
          remainAmountFilter: false,
          mode: {
            type: String,
            value: ['table', 'treetable']
          }
        }
      }
    },
    showInternalOrganization: {
      type: Boolean,
      default: true
    },
    showEmployee: {
      type: Boolean,
      default: true
    },
    paymentDateList: {
      type: Boolean,
      default: false
    },
    showTable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerShowTable: false,
      MoneyFormats,
      pickerOptions: {
        firstDayOfWeek: 1
      },
      deliveryStatus: [
        { text: 'Tümü', value: -1 },
        { text: 'Teslimat Yapıldı', value: 1 },
        { text: 'Teslimat Yapılmadı', value: 0 }
      ],
      busy: false,
      delay: 1000,
      listQuery: {
        page: 1,
        limit: this.size,
        sub: '',
        isArchive: false,
        isActive: true,
        status: '',
        orderby: '',
        sortby: '',
        dayFilter: '1',
        dateRange: [],
        internalOrganizationId: '',
        employeeId: '',
        searchText: '',
        remainAmountMin: 0,
        remainAmountMax: 0,
        searchArea: 'phone',
        deliveryStatus: -1
      },
      employeeListAll: false,
      internalOrganizationTitle: '',
      internalOrganizations: [],
      employeeList: [],
      keyValue: 0,
      employeeName: '',
      mounted: false,
      searchText: '',
      remainAmountMin: 0,
      remainAmountMax: 0,
      perspectiveOptions: {},
      defaultOptions: {
        showSearchText: true,
        showArchive: true,
        showActive: true,
        pageSizes: [10, 20, 30, 50],
        showPaging: false,
        defaultDayFilter: '1',
        showAllDatesButton: true,
        showYesterdayButton: true,
        showDatePicker: true,
        showPastButton: false,
        showTodayButton: true,
        remainAmountFilter: false,
        initialDateRange: [],
        searchButtonStyle: 'width:65%; margin-bottom: 10px;',
        mode: 'table'
      },
      labelPosition: 'left'
    }
  },
  computed: {
    isDatesVisible() {
      return this.options && (this.perspectiveOptions.showYesterdayButton ||
          this.perspectiveOptions.showTodayButton ||
          this.perspectiveOptions.showAllDatesButton ||
          this.perspectiveOptions.showPastButton ||
          this.perspectiveOptions.showDatePicker)
    }
  },
  watch: {
    searchText: function(newValue, oldValue) {
      if (oldValue.length > 0 && newValue.length === 0) {
        this.listQuery.searchText = null
        this.getData()
      }
    }

  },
  // watch: {
  //   listQuery: {
  //     handler: function(newValue, oldValue) {
  //       if (this.mounted && (this.listQuery.dayFilter !== 'c' || (this.listQuery.dayFilter === 'c' && this.listQuery.dateRange.length === 2))) {
  //         this.$emit('get-items', this.listQuery)
  //       }
  //     },
  //     deep: true
  //   }
  // },
  mounted() {
    if (this.defaultFilters.length > 0) {
      this.defaultFilters.forEach(e => {
        this.listQuery[e.columnName] = ''
        this.listQuery[e.columnName] = e.filterValues.join(',')
      })
    }
    // if (this.filters.length > 0) {
    //   this.listQuery[this.filterProperty] = ''
    //   this.listQuery[this.filterProperty] = this.filters.join(',')
    // }
    // if (hasActionPermission(this.$store.getters.permission_routers, 'perspectiveEmployeeListAll')) {
    //   this.employeeListAll = true
    // }
    this.$nextTick(() => {
      this.listQuery.sub = this.$store.state.user.sub
      this.perspectiveOptions = this.defaultOptions
      Object.keys(this.options).forEach(key => {
        if (key in this.perspectiveOptions) {
          this.perspectiveOptions[key] = this.options[key]
        }
      })
      this.listQuery.dayFilter = this.perspectiveOptions.defaultDayFilter
      this.listQuery.dateRange = this.perspectiveOptions.initialDateRange
      if (!this.onCard) {
        this.getInternalOrganizationList()
      } else if (this.onCard && this.listQuery.searchText !== '') {
        this.getData()
      }
    })
  },
  // updated() {
  //   this.mounted = true
  // },
  methods: {
    close() {
      this.$emit('open', false)
    },
    getData() {
      this.internalOrganizations.length
      if (this.internalOrganizations.length > 0 && !this.onCard) {
        this.$emit('get-items', this.listQuery)
      } else if (this.onCard) {
        this.$emit('get-items', this.listQuery)
      }
      if (this.defaultFilters.length > 0) {
        this.defaultFilters.forEach(e => {
          this.$refs['table1'].columns.find(i => i.label === e.columnName).filteredValue = e.filterValues
        })
      }
    },
    color({ row, rowIndex }) {
      if (row.lateAmount >= 10) {
        return 'background:rgba(255, 249, 196, 1) !important;'
      }
    },
    remainAmountChanged() {
      this.listQuery.remainAmountMin = this.remainAmountMin
      this.listQuery.remainAmountMax = this.remainAmountMax
      if (this.remainAmountMin <= this.remainAmountMax) {
        this.getData()
      }
    },
    searchWithText() {
      this.listQuery.searchText = this.searchText
      this.listQuery.page = 1
      this.innerShowTable = true
      this.getData()
    },
    clearSearchText() {
      this.searchText = ''
      this.listQuery.searchText = ''
      this.keyValue++
    },
    filterHandler() {
      this.listQuery.page = 1
      this.listQuery.status = ''
      const existsCols = this.$refs['table1'].columns.filter(i => i.filterable)
      existsCols.forEach(c => {
        this.listQuery[c.property] = ''
      })
      const cols = this.$refs['table1'].columns.filter(i => i.filteredValue.length > 0)
      cols.forEach(c => {
        this.listQuery[c.property] = c.filteredValue.join(',')
      })
      this.getData()
    },
    sortHandler({ column, prop, order }) {
      this.listQuery.sortby = prop
      this.listQuery.orderby = order
      this.listQuery.page = 1
      this.getData()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.getData()
    },
    handleCheckBox() {
      this.listQuery.page = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getData()
    },
    datePickerChange() {
      this.listQuery.dayFilter = this.listQuery.dateRange === null ? '0' : 'c'
      this.listQuery.page = 1
      this.getData()
    },
    getInternalOrganizationList() {
      this.busy = true
      const method = (this.internalOrganizationListType === 'normal')
        ? lookupApi.getPerspectiveInternalOrganizationTree()
        : ((this.internalOrganizationListType === 'branch')
          ? lookupApi.getPerspectiveRegionBranchTree()
          : lookupApi.getPerspectiveRootTree())

      method.then((result) => {
        const extendArray = a => a.map(e => {
          const t = { id: e.value, label: e.text }
          if (e.children && e.children.length > 0) {
            t.children = extendArray(e.children)
          } else {
            delete t.children
          }
          return t
        })
        var r = []
        if (result.data.children) {
          r = extendArray(result.data.children)
        }
        this.internalOrganizations = [...[{ id: result.data.value, label: result.data.text }], ...r]
        this.busy = false
        this.groupSelected(this.internalOrganizations[0])
      })
        .catch((err) => {
          this.$emit('on-error', err)
          this.busy = false
        })
    },
    groupSelected(currentData) {
      this.listQuery.internalOrganizationId = currentData.id
      this.internalOrganizationTitle = currentData.label
      this.listQuery.page = 1
      if (this.employeeListType === 'normal') {
        this.getEmployeeList(currentData.id)
      } else {
        this.getEmployeeListForEveryone(currentData.id)
      }
    },
    getEmployeeListForEveryone(internalOrganizationId) {
      this.busy = true
      lookupApi.getPerspectiveEmployeeListWithoutTree(internalOrganizationId)
        .then((v) => {
          if (v.data !== null) {
            if (v.data.length === 1 && !this.employeeListAll) {
              this.employeeList = [...[{ id: v.data[0].value, label: v.data[0].text }]]
              this.listQuery.employeeId = v.data[0].value
              this.employeeName = v.data[0].text
            } else {
              this.employeeList = [...[{ id: undefined, label: this.$t('perspective.all') }]]
              v.data.map(item => ({ id: item.value, label: item.text })).forEach(element => {
                this.employeeList.push(element)
              })
              this.listQuery.employeeId = undefined
              this.employeeName = this.$t('perspective.all')
            }
            this.busy = false
            this.getData()
          }
        })
        .catch((err) => {
          console.log('err: ', err)
          this.busy = false
        })
    },
    getEmployeeList(internalOrganizationId) {
      this.busy = true
      lookupApi.getPerspectiveEmployeeList(internalOrganizationId, false)
        .then((v) => {
          if (v.data.value !== null) {
            if (v.data.show) {
              const extendArray = a => a.map(e => {
                const t = { id: e.value, label: e.text }
                if (e.children && e.children.length > 0) {
                  t.children = extendArray(e.children)
                } else {
                  delete t.children
                }
                return t
              })
              var r = []
              if (v.data.children) {
                r = extendArray(v.data.children)
              }
              if (r.length === 0 && !this.employeeListAll) {
                this.employeeList = [...[{ id: v.data.value, label: v.data.text }]]
                this.listQuery.employeeId = v.data.value
                this.employeeName = v.data.text
              } else {
                this.employeeList = [...[{ id: undefined, label: this.$t('perspective.all') }, {
                  id: v.data.value,
                  label: v.data.text
                }], ...r]
                const user = this.employeeList.find(i => i.id === this.$store.state.user.sub)
                if (user) {
                  this.listQuery.employeeId = user.id
                  this.employeeName = user.label
                } else {
                  this.listQuery.employeeId = undefined
                  this.employeeName = this.$t('perspective.all')
                }
              }
              this.busy = false
            } else if (!this.employeeListAll) {
              this.employeeList = [...[{ id: v.data.value, label: v.data.text }]]
              this.listQuery.employeeId = v.data.value
              this.employeeName = v.data.text
            } else {
              this.employeeList = [...[{ id: undefined, label: this.$t('perspective.all') }, {
                id: v.data.value,
                label: v.data.text
              }]]
              this.listQuery.employeeId = undefined
              this.employeeName = this.$t('perspective.all')
            }
            this.getData()
          }
          this.busy = false
        })
        .catch((err) => {
          console.log('err: ', err)
          this.busy = false
        })
    },
    employeeSelected(currentData) {
      this.listQuery.employeeId = currentData.id
      this.employeeName = currentData.label
      this.listQuery.page = 1
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.background:hover {
  background-color: rgb(200, 66, 67) !important;
}

@media (min-width: 1200px) and (max-width: 1440px) {
  .speech-bubble-inactive {
    margin-right: 0px;
    margin-left: 0px;
  }
  .el-col-offset-1 {
    margin-left: 0%;
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}

.click {
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1a84ff;
  cursor: pointer;
}

.el-table__body-wrapper.is-scrolling-none {
  &::-webkit-scrollbar {
    width: 7px;
    height: 80%;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #C84243;
    border-radius: 10px;

  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b30000;
  }
}

.remainAmountFilter {
.el-form-item.a, .el-form-item.b {
    .el-form-item__label {
      line-height: 1.3 !important;
    }
  }
}
.global-search {
  .scroll-list {
    max-height: 330px;
    overflow: auto;
    /* width */
    &::-webkit-scrollbar {
      width: 0px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
    
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #888; 
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555; 
    }
  }
  .el-input-group__append, .el-input-group__prepend {
      width: 207px !important;
  }
  width: 100%;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
  .fa-solid.fa-magnifying-glass {
    position: absolute;
    right: 15px;
    top: 31px;
    cursor: pointer;
  }
    .close-orange {
      display: inline-block;
      width: 40px;
      height: 40px;
      object-fit: contain;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
      border: solid 1px #e5e5e5;
      background-color: #ffffff;
      text-align: center;
      border-radius: 100%;
      cursor: pointer;
      vertical-align: middle;
    }
    .orange-text {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-align: right;
      color: #ff5252;
    }
  .form-area {
    background: #f5f5f5;
    padding: 20px 30px;
  }
  .el-select .el-input__inner {
    height: 60px;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e5e5e5;
    background-color: #ffffff;
  }
  .el-input ::v-deep(.el-input__inner) {
    border: solid 1px #ddd;
    background-color: #ffffff;
    width: 454px;
    height: 40px;
    border-radius: 25px;
    &::placeholder {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #909399;
    }
  }
  .el-select .el-icon-arrow-up:before {
    content: "\25be";
    color: #000;
    vertical-align: middle;
    font-size: 24px;
  }
  .el-select .el-icon-arrow-up {
    transform: rotate(0deg);
  }
  ::v-deep(.result-dialog) {
    width: 100%;
    margin-top: 80px;
    padding: 30px;
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
    border: solid 1px #ddd;
    background-color: #f5f5f5;
    .el-dialog__header {
      padding: 0;
      height: 0px;
      line-height: 0;
      .el-dialog__title {
        padding-left: 20px;
      }
    }
  }
  ::v-deep(.el-overlay-dialog) {
    left: 240px !important;
  }
}
</style>
