<template>
  <div class="new-performance">
    <el-row type="filter">
      <el-form :inline="true">
        <el-form-item label="Tarih Aralığı" label-widt="90px">
          <el-date-picker
            v-model="listQuery.dateRange"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="-"
            value-format="YYYY-MM-DD"
            start-placeholder="Başlangıç Tarihi"
            end-placeholder="Bitiş Tarihi"
          />
        </el-form-item>
        <el-form-item label="Takım Seç" label-widt="90px" style="margin-left: 30px;">
          <el-dropdown
            v-loading="busy"
            :show-timeout="100"
            trigger="click"
            size="medium">
            <span class="el-dropdown-link">
              <span v-if="listQuery.internalOrganizationId == ''">{{ $t('perspective.internalOrganizationTitle') }}</span>
              <span v-if="listQuery.internalOrganizationId != ''">{{ internalOrganizationTitle }}</span>
              <i class="fa-solid fa-caret-down el-icon--right custom-right-icon"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu
                class="no-padding no-border"
                style="width:400px">
                <el-tree
                  :data="internalOrganizations"
                  @current-change="groupSelected"/>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
          <el-button
            type="primary"
            style="float:right;"
            @click="getAllValues"
          >
          <i class="fa-solid fa-magnifying-glass margin-right-15"></i>
          Ara
          </el-button>
      </el-form>
    </el-row>
    <br>
    <el-row type="table-header">
      <div>
        <p>Performans Listesi</p>
        <p>Performans listesine dair tüm incelemelerinizi rahatlıkla yapabilir ve  exel dökümanını indirebilirsiniz.</p>
      </div>
      <el-button v-loading="downloading" type="action" plain @click="exportExcel">Excel İndir <i class="fa-solid fa-download margin-left-15"></i></el-button>
    </el-row>
    <el-row>
      <el-table
        v-loading="tableBusy"
        ref="performance"
        :data="tableData"
        empty-text="Lütfen arama yapınız."
        @filter-change="filterHandler"
        @sort-change="sortHandler"
        show-summary
        sum-text="Toplam">
        <el-table-column v-if="tableData.length" prop="Name" label="İSİM"/>
        <el-table-column v-if="tableData.length"
                         v-for="column in performansReviewItems"
                         :key="column"
                         :label="column"
                         :prop="column"
                         align="center">
          <template #default="scope">
            <div>
              {{ isNaN(parseInt(scope.row[column])) ? 0 : scope.row[column] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>

import performanceApi from '@/api/bpm/performanceInternalOrganization'
import lookupApi from '@/api/bpm/lookup'
import {parseTime} from '@/utils'
import {PerformanceTypes} from '@/views/bpm/Constants/PerformanceType'
import {hasActionPermissionNew} from '@/actionPermission.js'
import {h} from 'vue'

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          var d = new Date()
          return date < new Date(d.getFullYear(), d.getMonth() - 1, 1)
        },
        firstDayOfWeek: 1
      },
      tableBusy: false,
      tableData: [],
      performansReviewItems: [],
      busy: false,
      internalOrganizations: [],
      performanceTypes: {},
      internalOrganizationTitle: '',
      listQuery: {
        limit: 20,
        page: 1,
        orderby: '',
        sortby: '',
        type: 'region',
        id: '',
        internalOrganizationId: '',
        employeeId: '',
        dateRange: []
      },
      positionTypeId: this.$store.getters.user.positionTypeId,
      showName: '',
      tableDataNames: [],
      downloading: false,
      allBranchVisible: true
    }
  },
  computed: {},
  created() {
    this.performanceTypes = PerformanceTypes
    const date = new Date(Date.now())
    const localDate = parseTime(date, '{y}-{m}-{d}')
    this.listQuery.dateRange = [localDate, localDate]
    this.getInternalOrganizationList()
    this.comparePositionTypeId()
  },
  methods: {
    hasActionPermissionNew,
    asd() {
      const i = 0
      var keyNames = Object.entries(this.tableData[i])
      console.log('keyNames', keyNames)
      this.tableDataNames = keyNames
    },
    qwe(item) {
      const parent = this.performanceTypes

      for (const child of Object.keys(parent.properties)) {
        var capital = parent.properties[child]
        console.log('capital', 'NP-' + capital)
      }
      // console.log('this.performanceTypes.properties', this.performanceTypes.properties)
      // console.log('item', item[0])
    },
    comparePositionTypeId() {
      if (this.positionTypeId === 'EB169D94-A5AB-424A-8512-BEB6D1A9C1FB' || this.positionTypeId === 'BF98B367-FCA4-4DB9-9018-7026AC070E96' || this.positionTypeId === '8123C72F-EC1B-41CA-A3E2-1C51AEFCDC8C') {
        this.showName = 'TFU'
      } else {
        this.showName = 'Others'
      }
    },
    getAllValues() {
      this.tableBusy = true
      performanceApi
        .getPerformanceValues(this.listQuery)
        .then((v) => {
          this.tableData = v.data.data
          this.performansReviewItems = v.data.performanceReviewItemTypeList
          this.tableBusy = false
          this.asd()
        })
        .catch((err) => {
          this.tableBusy = false
          console.log(err)
        })
    },

    dateChange() {
      this.getAllValues()
    },
    getInternalOrganizationList() {
      this.busy = true
      this.allBranchVisible = hasActionPermissionNew(this.$store.getters.permissions, 'branchInternalOrganizationListTypePerformanceList')
      const method = lookupApi.getPerspectiveInternalOrganizationTree(this.allBranchVisible)
      method.then((result) => {
        this.busy = false
        const extendArray = a => a.map(e => {
          const t = {id: e.value, label: e.text}
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
        if (this.allBranchVisible) {
          this.internalOrganizations = [...[{id: result.data.value, label: result.data.text}], ...r]
        } else {
          this.internalOrganizations = [...[{id: result.data.value, label: result.data.text}], ...r]
        }
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
      this.getAllValues()
    },
    filterHandler() {
      this.listQuery.page = 1
      const existsCols = this.$refs['performance'].columns.filter(i => i.filterable)
      existsCols.forEach(c => {
        this.listQuery[c.property] = ''
      })
      const cols = this.$refs['performance'].columns.filter(i => i.filteredValue.length > 0)
      cols.forEach(c => {
        this.listQuery[c.property] = c.filteredValue.join(',')
      })
      this.getAllValues()
    },
    sortHandler({column, prop, order}) {
      this.listQuery.sortby = prop
      this.listQuery.orderby = order
      this.listQuery.page = 1
      this.getAllValues()
    },
    getPerformanceValue(row, column) {
      var value = row[column]
      if (value === null || typeof value !== 'number') {
        value = 0
      }
      return value
    },
    exportExcel() {
      this.downloading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['İsim', 'ALINAN RANDEVU', 'GERÇEKLEŞEN RANDEVU İM', 'YÖNLENDİRİLEN TELEFON - İM', 'ALINAN GİS', 'GERÇEKLEŞEN GİS - İM']
        const filterVal = ['Name', 'ALINAN RANDEVU', 'GERÇEKLEŞEN RANDEVU İM', 'YÖNLENDİRİLEN TELEFON - İM', 'ALINAN GİS', 'GERÇEKLEŞEN GİS - İM']
        const data = this.formatJson(filterVal, this.tableData)

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Performans Listesi',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (isNaN(parseInt(v[j])) && j === 'Name') {
          return v[j]
        } else if (isNaN(parseInt(v[j]))) {
          return 0
        }
        else {
          return v[j]
        }
      }))
    },
  }

}
</script>
<style lang="scss" scoped>
:deep(.new-performance) {
  .before-search {
    padding: 15px 0;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b7b7b7;
  }

  .bmt-list {
    padding: 20px !important;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:nth-child(1) {
      background-color: #f5f5f5;
    }

    &:nth-child(4) {
      background-color: #f5f5f5;
    }

    &:nth-child(5) {
      background-color: #f5f5f5;
    }

    &:nth-child(8) {
      background-color: #f5f5f5;
    }

    &:nth-child(9) {
      background-color: #f5f5f5;
    }

    &:nth-child(12) {
      background-color: #f5f5f5;
    }

    &:nth-child(13) {
      background-color: #f5f5f5;
    }

    &:nth-child(16) {
      background-color: #f5f5f5;
    }

    &:nth-child(17) {
      background-color: #f5f5f5;
    }

    &:nth-child(20) {
      background-color: #f5f5f5;
    }

    &:nth-child(2n+1) {
      border-right: 1px solid #e5e5e5;
    }

    .title {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #909399;
    }

    .desc {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000000;
    }
  }
}

.el-table tbody tr:nth-child(2n) {
  background-color: #ccc !important;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #c2d281 !important;
}

.name-area {
  height: 60px;
  padding: 15px 30px 16px 20px;
  object-fit: contain;
  border-radius: 4px;
  background-image: linear-gradient(93deg, #ff5252, #c94343 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span:first-child {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }

  span:last-child {
    font-size: 21px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }
}

@media only screen and (max-width: 1440px) {
  .small {
    text-overflow: ellipsis;
  }
}

table {
  border-spacing: 0px;

  thead {
    border-radius: 4px;
    background-image: linear-gradient(92deg, #ff5252, #c94343);

    tr {
      th {
        padding: 10px;
        font-size: 16px;
        font-weight: 100;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        color: #ffffff;
      }
    }
  }

  tbody {
    tr {
      td:nth-child(1),
      td:nth-child(2),
      td:nth-child(3),
      td:nth-child(4) {
        font-weight: bold;
      }

      padding: 10px 5px;
    }

    .style1 {
      color: #1a84ff !important;
    }

    .style2 {
      color: #f59f3e !important;
    }

    .style3 {
      color: #000000 !important;
    }

    .white {
      background-blend-mode: multiply;
      //background-image: #fff;
      height: 66px;
    }

    .gray {
      background-blend-mode: multiply;
      background-image: linear-gradient(
          to left,
          rgba(0, 0, 0, 0.03),
          rgba(0, 0, 0, 0.05)
      );
      height: 66px;
    }

    .orange {
      background-color: #c84243 !important;
    }

    .postpone {
      background-image: linear-gradient(
          45deg,
          #78ab41 25%,
          #7cb341 25%,
          #7cb341 50%,
          #78ab41 50%,
          #78ab41 75%,
          #7cb341 75%,
          #7cb341 100%
      ) !important;
      background-size: 67.88px 67.88px !important;
      border-radius: 6px !important;
    }
    .bye {}
  }
}
</style>
