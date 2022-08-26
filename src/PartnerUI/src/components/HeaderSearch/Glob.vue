<template>
  <div class="new-performance glob">
    <global-search
      ref="perspective1"
      :items="items"
      :count="count"
      :loading="busy"
      :options="option"
      :internal-organization-list-type="internalOrganizationListType"
      :on-card="onCard"
      show-header="false"
      search-area="customerId"
      microservice="crm"
      search-description="Lütfen arama yapınız!"
      @get-items="getParties"
      @open="handleDone">
      <template v-slot:header/>
      <template v-slot:custom>
        <div v-if="items === null || items.length < 1" :loading="false" class="search-text">
          Henüz Arama Gerçekleşmedi
        </div>
        <div v-for="item in items" v-else :key="item.code" :loading="false" class="header">
          <div v-if="organizationSearch">
            <div class="table">
              <div class="table-header-group">
                <div class="table-header-row">
                  <div class="table-header-cell">
                    Müşteri No
                  </div>
                  <div class="table-header-cell">
                    Ünvan
                  </div>
                  <div class="table-header-cell">
                    VKN
                  </div>
                  <div class="table-header-cell">
                    Tarih
                  </div>
                  <div class="table-header-cell">
                    Kademesi
                  </div>
                  <div class="table-header-cell">
                    Telefon Numarası
                  </div>
                  <div class="table-header-cell">
                    Çözüm Müşteri No
                  </div>
                </div>
              </div>
              <div class="table-row-group">
                <div class="table-row">
                  <div class="table-row-cell">
                    {{ item.partyId }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.partyName }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.identificationNumber?functionCharAt(item.identificationNumber)[0] + '*********' + functionCharAt(item.identificationNumber)[1]:'Tanımlı Değil' }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.createDate | parseTime('{d}.{m}.{y}') }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.customerStage }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.telecomNumber }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.czmPartyId }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="productSearch">
            <!-- <div> -->
            <div class="table">
              <div class="table-header-group">
                <div class="table-header-row">
                  <div class="table-header-cell">
                    Tasarruf Planı No
                  </div>
                  <div class="table-header-cell">
                    Tasarruf Sahibi Adı
                  </div>
                  <div class="table-header-cell">
                    Çözüm Tasarruf Planı No
                  </div>
                  <div class="table-header-cell">
                    Finansman Tutarı
                  </div>
                  <div class="table-header-cell">
                    Metod Türü
                  </div>
                  <div class="table-header-cell">
                    Tasarruf Planı Tarihi
                  </div>
                  <div class="table-header-cell">
                    Birtep Mi?
                  </div>
                  <div class="table-header-cell">
                    Status
                  </div>
                </div>
              </div>
              <div class="table-row-group">
                <div class="table-row">
                  <div class="table-row-cell">
                    {{ item.code }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.name }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.cozumProductCode === "" ? '-' : item.cozumProductCode }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.financeAmount | formatTRY }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.methodType }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.productCreateDate | parseTime('{d}.{m}.{y}') }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.isBirtepProduct ? 'Evet' : 'Hayır' }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.productStatus }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="partySearch" style="width: 95%;">
            <div class="table">
              <div class="table-header-group">
                <div class="table-header-row">
                  <div class="table-header-cell">
                    T.S No
                  </div>
                  <div class="table-header-cell">
                    Adı Soyadı
                  </div>
                  <div class="table-header-cell">
                    TCKN
                  </div>
                  <div class="table-header-cell">
                    İl
                  </div>
                  <div class="table-header-cell">
                    İlçe
                  </div>
                  <div class="table-header-cell">
                    Portföy
                  </div>
                  <div class="table-header-cell">
                    TFU
                  </div>
                  <div class="table-header-cell">
                    Durumu
                  </div>
                </div>
              </div>
              <div class="table-row-group">
                <div class="table-row">
                  <div class="table-row-cell">
                    {{ item.partyId }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.partyName }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.identificationNumber?functionCharAt(item.identificationNumber)[0] + '*********' + functionCharAt(item.identificationNumber)[1]:'Tanımlı Değil' }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.city }}
                  </div>
                  <div class="table-row-cell">
                    {{ item.county }}
                  </div>
                  <div class="table-row-cell">
                    {{ portfolioName(item) }}
                  </div>
                  <div class="table-row-cell">
                    {{ portfolioOwnerName(item) }}
                  </div>
                  <div class="table-row-cell">
                    {{ customerStage(item) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-button class="icon-button" @click="viewEditParty(item)">
            <svg-icon icon-class="sale"/>
          </el-button>
        </div>
      </template>
    </global-search>
  </div>
</template>
<script>

import GlobalSearch from './GlobalSearch.vue'
import partyApi from '@/api/crm/party'
import filter from '@/components/Filters/index.vue'
import waves from '@/directive/waves/index.js'
import customerApi from '@/api/crm/customerQuery.js'


export default {
  name: 'Glob',
  components: {
    'GlobalSearch': GlobalSearch,
    'detail-filter': filter
  },
  directives: {
    waves
  },
  data() {
    return {
      productSearch: false,
      organizationSearch: false,
      partySearch: false,
      pickerOptions: {
        disabledDate(date) {
          var d = new Date()
          return date < new Date(d.getFullYear(), d.getMonth() - 1, 1)
        },
        firstDayOfWeek: 1
      },
      onCard: true,
      customerTrackTypeList: [],
      customerTrackStatusList: [],
      customerStageList: [],
      showName: '',
      option: {
        showSearchText: true,
        showActive: false,
        showArchive: false,
        searchType: true,
        showYesterdayButton: false,
        showTodayButton: false,
        showAllDatesButton: false,
        showDatePicker: false,
        defaultDayFilter: '1',
        pageSizes: [25, 50, 100],
        mode: 'div'
      },
      items: [],
      count: 0,
      internalOrganizationListType: '',
      enumerations: {
        customerTrackStatus: [],
        customerTrackTypes: [],
        customerStages: [],
        utmReferences: []
      },
      delay: 1000,
      busy: false
    }
  },
  computed: {
  },
  async  mounted() {
    this.enumerations = (await customerApi.getCustomerListEnumerations()).data
  },
  //   created() {
  //     if (hasActionPermission(this.$store.getters.permission_routers, 'branchInternalOrganizationListTypeCustomerList')) {
  //       this.internalOrganizationListType = 'branch'
  //     } else {
  //       this.internalOrganizationListType = 'normal'
  //     }
  //   },
  methods: {
    functionCharAt(identificationNumber) {
      const value = [null, null]
      if (identificationNumber) {
        value[0] = identificationNumber.charAt(0)
        value[1] = identificationNumber.charAt(10)
      }
      return value
    },
    portfolioName(item) {
      if (item.portfolioName) {
        return item.portfolioName.split(' ').slice(0, 2).join(' ')
      } else {
        return 'Bulunamadı'
      }
    },
    portfolioOwnerName(item) {
      if (item.portfolioOwnerName) {
        return item.portfolioOwnerName
      } else {
        return 'Bulunamadı'
      }
    },
    customerStage(item) {
      if (item.customerStage) {
        return item.customerStage.split(' ')[0]
      } else {
        return 'Bulunamadı'
      }
    },
    viewEditParty(item) {
      this.$emit('open', false)
      // if (this.productSearch === true) {
      //   this.$router.push(
      //     {
      //       name: 'ProductCard',
      //       params: { calculationId: item.calculationId }
      //     })
      // } else if (this.organizationSearch === true) {
      //   this.$router.push(
      //     {
      //       name: 'organizationEdit',
      //       params: { partyId: item.partyId }
      //     })
      // } else if (this.partySearch === true) {
      //   this.$router.push(
      //     {
      //       name: 'personEdit',
      //       params: { partyId: item.partyId }
      //     })
      // }
      this.$router.push(
          {
            name: 'personEdit',
            params: { partyId: item.partyId }
          })
    },
    handleDone() {
      this.$emit('open', false)
    },
    comparePositionTypeId() {
      if (this.positionTypeId === 'EB169D94-A5AB-424A-8512-BEB6D1A9C1FB' || this.positionTypeId === 'BF98B367-FCA4-4DB9-9018-7026AC070E96' || this.positionTypeId === '8123C72F-EC1B-41CA-A3E2-1C51AEFCDC8C') {
        this.showName = 'TFU'
      } else {
        this.showName = 'Others'
      }
    },
    async getParties(listQuery) {
        this.busy = true
        try {
          if (listQuery.searchText !== '' && listQuery.searchText !== null) {
          // console.log('Query', listQuery)
            if (listQuery.searchArea === 'productCode') {
              this.productSearch = true
              this.organizationSearch = false
              this.partySearch = false
              const data = (await productApi.searchProduct(listQuery)).data
              this.items = data.result
              this.count = data.count
            } else if (listQuery.searchArea === 'czmProductCode') {
              this.productSearch = true
              this.organizationSearch = false
              this.partySearch = false
              const data = (await productApi.searchCozumProduct(listQuery)).data
              this.items = data.result
              this.count = data.count
            } else if (listQuery.searchArea === 'organizationCustomerId' || listQuery.searchArea === 'organizationCzmId') {
              this.organizationSearch = true
              this.productSearch = false
              this.partySearch = false
              const data = (await organizationApi.queryCustomers(listQuery)).data
              this.items = data.data
              this.count = data.count
            } else {
              this.partySearch = true
              this.productSearch = false
              this.organizationSearch = false
              const data = (await partyApi.queryCustomers(listQuery)).data
              this.items = data.data
              this.count = data.count
            }
          }
          // alert(this.productSearch)
          this.busy = false
        } catch (err) {
          console.log(err)
          this.$notify.error(this.$t('notify.error'))
          this.busy = false
        }
    },
    getIdentificationNumber(row) {
      if (!row.identificationNumber || !row.identificationNumber.length) return ''
      return (row.identificationNumber.includes('M') || row.identificationNumber.trim() === '' || row.identificationNumber === '0') ? '' : (row.identificationNumber.substring(0, 2) + '*******' + row.identificationNumber.substring(row.identificationNumber.length - 2, row.identificationNumber.length))
    },
    getTelecomeNumber(row) {
      return (!row.telecomNumber || row.telecomNumber.length < 10 || row.telecomNumber.trim() === '' || row.telecomNumber === '0') ? '' : ('*******' + row.telecomNumber.substring(row.telecomNumber.length - 4, row.telecomNumber.length))
    }
  }

}
</script>
<style lang="scss" scoped>
.glob {
  .header {
  margin-bottom: 20px;
  min-height: 90px;
  height: auto;
  padding: 20px;
  position: relative;
  border-radius: 12px;
  border: solid 1px #ededed;
  background-color: #fff;
    .more {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
    .icon-bg {
      width: 30px;
      height: 30px;
      margin-right: 5px;
      border-radius: 50%;
      border: solid 1px #e5e5e5;
      background-color: #fff;
      display: inline-block;
      padding: 6px 7px;
      cursor: pointer;
      .svg-icon {
        vertical-align: baseline;
      }
      &:first-child {
        .svg-icon{
          filter: invert(76%) sepia(7%) saturate(10%) hue-rotate(7deg) brightness(95%) contrast(94%);
        }
      }
      &:nth-child(2) {
        .svg-icon{
          filter: invert(76%) sepia(7%) saturate(10%) hue-rotate(7deg) brightness(95%) contrast(94%);
        }
      }
    }
    .table {
      width: 95%;
      display: table;
      .table-header-group {
        display: table-header-group;
        .table-header-row {
          display: table-row;
          .table-header-cell {
            display: table-cell;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: #909399;
            &:nth-child(2) {
              width: 250px;
            }
          }
        }
      }
      .table-row-group {
        &:before {
          content:"@";
          display:block;
          line-height:10px;
          text-indent:-99999px;
        }
        display: table-row-group;
        .table-row {
          display: table-row;
          .table-row-cell {
            display: table-cell;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: #000;
            vertical-align: middle;
            &:nth-child(2) {
              span {
                display: -webkit-box;
                width: 250px;
                word-break: break-word;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .filter-bg {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 80px;
    padding: 20px;
    object-fit: contain;
    border-radius: 4px;
    background-color: #f5f5f5;
    margin-bottom: 30px;
    * {
      margin-right: 20px;
    }
  }
}
.new-performance {
  .el-table tbody tr:nth-child(2n) {
    background-color: #ccc !important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td{
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
      background-image: #fff;
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
  }
}
.header {
  margin-bottom: 20px;
  height: 90px;
  padding: 20px;
  position: relative;
  .el-col {
    span:first-child {
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #909399;
    }
    span:last-child {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000000;
    }
  }
  .icon-button {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-block;
    min-width: 30px !important;
  }
}
.search-text {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b7b7b7;
  }
</style>
