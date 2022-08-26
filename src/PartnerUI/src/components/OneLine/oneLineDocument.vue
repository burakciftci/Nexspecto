<template>
  <el-row>
    <el-col :span="24">
      <el-tabs :tab-position="tabPosition" v-model="activeTabName">
        <el-tab-pane label="Proje" name="proje">
          <documentGroup v-if="activeTabName == 'proje'" :key="activeTabName"
                         :indices="[{ keyType: 'PRODUCTID', value: productIdForDocumentTab }, { keyType: 'CUSTOMERID', value: partyIdForDocumentTab }]"
                         document-group-type="projectdocumentgroup"/>
        </el-tab-pane>
        <el-tab-pane label="Masraf" name="masraf">
          <documentGroup v-if="activeTabName == 'masraf'" :key="activeTabName"
                         :indices="[{ keyType: 'PRODUCTID', value: productIdForDocumentTab }, { keyType: 'CUSTOMERID', value: partyIdForDocumentTab }]"
                         document-group-type="expensedocumentgroup"/>
        </el-tab-pane>
        <el-tab-pane label="Talep" name="talep">
          <documentGroup v-if="activeTabName == 'talep'" :key="activeTabName"
                         :indices="[{ keyType: 'PRODUCTID', value: productIdForDocumentTab }, { keyType: 'CUSTOMERID', value: partyIdForDocumentTab }]"
                         document-group-type="RequestDocumentGroup"/>
        </el-tab-pane>
        <el-tab-pane label="Teslimat" name="delivery">
          <document-group
            :indices="[{ keyType: 'CUSTOMERID', value: partyIdForDocumentTab }, { keyType: 'PRODUCTID', value: productIdForDocumentTab}]"
            document-group-type="BEFOREOBLIGATIONDOCUMENTS"/>
          <br>
          <document-group
            :indices="[{ keyType: 'CUSTOMERID', value: partyIdForDocumentTab }, { keyType: 'PRODUCTID', value: productIdForDocumentTab}]"
            document-group-type="AFTEROBLIGATIONDOCUMENTS"/>
          <br>
          <document-group
            :indices="[{ keyType: 'CUSTOMERID', value: partyIdForDocumentTab }, { keyType: 'PRODUCTID', value: productIdForDocumentTab}]"
            document-group-type="OTHERDELIVERYDOCUMENTGROUP"/>
          <br>
          <document-group
            :indices="[{ keyType: 'CUSTOMERID', value: partyIdForDocumentTab }, { keyType: 'PRODUCTID', value: productIdForDocumentTab}]"
            document-group-type="GUARANTEELETTEROBLIGATIONS"/>
          <div v-for="item in guarantorList" :key="item.partyId">
            <br>
            <document-group
              :indices="[{ keyType: 'CUSTOMERID', value: item.partyId }, { keyType: 'PRODUCTID', value: productIdForDocumentTab}]"
              :title="item.partyName" document-group-type="GUARANTOROBLIGATIONS"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script>

// import productApi from '@/api/finance/product'
import documentGroup from '@/views/dms/documentGroup'
import personApi from '@/api/crm/person'

export default {
  components: {
    documentGroup
  },
  props: {
    productIdForDocumentTab: {
      type: Number,
      default: 0
    },
    partyIdForDocumentTab: {
      type: String,
      default: ''
    },
    customerIdForDocumentTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogVisible: false,
      product: 0,
      activeTabName: 'proje',
      tabPosition: 'left',
      customer: '',
      partyId: this.partyIdForDocumentTab,
      personDetail: {
        portfolio: {
          name: '',
          po: {
            title: ''
          }
        }
      },
      delay: 1000,
      guarantorList: []
    }
  },
  mounted() {
    this.getPerson()
  },
  created() {
    this.product = this.productIdForDocumentTab
    this.customer = this.partyIdForDocumentTab
    this.getGuarantors()
  },
  methods: {
    getPerson() {
      personApi.getPersonByPartyId(this.partyId)
        .then((result) => {
          this.personDetail = result.data
        }).catch((err) => {
        this.errorMessage = err
      })
    },
    getGuarantors() {
      personApi.getGuarantors(this.customerIdForDocumentTab)
        .then((v) => {
          this.guarantorList = v.data.result
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}

</script>
<style lang="scss" scoped>
.icon-position {
  position: absolute;
  right: -21px;
  top: 50%;
  transform: translateY(-50%)
}

[data-letters]:before {
  content: attr(data-letters);
  display: inline-block;
  font-size: 0.7em;
  font-weight: 100;
  width: 30px;
  height: 30px;
  line-height: 3em;
  text-align: center;
  border-radius: 50%;
  background: #d8d8d8;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
  cursor: pointer;
}

.name {
  margin-left: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;

  div:last-child div:first-child {
    width: 283px;
    white-space: pre-line;
    text-overflow: ellipsis;
    overflow: hidden !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  // span:last-child {
  //   display: inline-block;
  //   width: 250px;
  //   white-space: nowrap;
  //   overflow: hidden !important;
  //   text-overflow: ellipsis;
  // }
}

@media screen and (max-width: 1840px) and (min-width: 1776px) {
  .name {
    div:last-child div:first-child {
      width: 235px !important;
    }
  }
}

@media screen and (max-width: 1775px) and (min-width: 1681px) {
  .name {
    div:last-child div:first-child {
      width: 225px !important;
    }
  }
}

@media screen and (max-width: 1680px) and (min-width: 1545px) {
  .name {
    div:last-child div:first-child {
      width: 180px !important;
    }
  }
}

@media screen and (max-width: 1544px) and (min-width: 1440px) {
  .name {
    div:last-child div:first-child {
      width: 155px !important;
    }
  }
}

@media screen and (max-width: 1439px) and (min-width: 1280px) {
  .name {
    div:last-child div:first-child {
      width: 155px !important;
      font-size: 12px !important;
    }

    div:last-child div:last-child {
      font-size: 12px !important;
    }
  }
  [data-letters]:before {
    margin-right: 0.3em !important;
  }
}

@media screen and (max-width: 1404px) and (min-width: 1280px) {
  .name {
    div:last-child div:first-child {
      width: 115px !important;
      font-size: 12px !important;
    }

    div:last-child div:last-child {
      font-size: 12px !important;
    }
  }
  [data-letters]:before {
    margin-right: 0.3em !important;
  }
}

[data-letters]:before {
  content: attr(data-letters);
  display: inline-block;
  font-size: 0.7em;
  font-weight: 100;
  width: 30px;
  height: 30px;
  line-height: 3em;
  text-align: center;
  border-radius: 50%;
  background: #d8d8d8;
  vertical-align: middle;
  margin-right: 1em;
  color: white;
  cursor: pointer;
}
</style>
