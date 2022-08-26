
<template>
  <div>
    <el-dialog v-model="dialogSelectedRole" :title="'Kurumsal Müşteri Ara'" append-to-body>
      <el-form
        ref="form3"
        :model="formModel1">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-input
                v-loading="busy"
                v-uppercase
                v-model="searchQueryParty"
                :placeholder="'Kurumsal Müşteri No, Kurumsal Müşteri Adı, VKN'"
                prefix-icon="el-icon-search"
                style="width:350px; margin-bottom: 10px;"
                clearable
                @keyup.enter.native="handleCurrentChange(1)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="action" style="margin-bottom: 10px;" @click="handleCurrentChange(1)">{{ 'Ara' }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table ref="tableParty" :data="partyTableData">
        <el-table-column :label="$t('crm.partyRoles.partyId')" prop="partyId"/>
        <el-table-column :label="$t('crm.partyRoles.partyName')" prop="partyName"/>
        <el-table-column :label="'İşlemler'">
          <template slot-scope="scope">
            <el-tooltip :content="'Seç'" effect="light" placement="top-start">
              <el-button @click="selectResponsibility(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="20">
        <el-pagination
          :current-page="listQuery.pageIndex"
          :page-sizes="[5,10,15,20]"
          :page-size="listQuery.limit"
          :total="count"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-col>
      <p/>
    </el-dialog>
    <el-dialog v-model="dialogSelectedParty" :title="'Referans Ara'" append-to-body>
      <el-form
        ref="form4"
        :model="formModel2">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-input
                v-model="searchQueryParty"
                :placeholder="'Müşteri No, Müşteri Adı, TCKN, Telefon'"
                @keyup.enter.native="handleCurrentChangeReference(1)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="action" @click="handleCurrentChangeReference(1)">{{ 'Ara' }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table ref="tableReference" :data="referenceTableData">
        <el-table-column :label="$t('crm.partyRoles.partyId')" prop="partyId"/>
        <el-table-column :label="$t('crm.partyRoles.partyName')" prop="partyName"/>
        <el-table-column :label="'İşlemler'">
          <template v-slot="scope">
            <el-button type="action" @click="selectReference(scope.row)">{{ 'Seçme' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="20">
        <el-pagination
          :current-page="listQuery.pageIndex"
          :page-sizes="[5,10,15,20]"
          :page-size="listQuery.limit"
          :total="count"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChangeReference"
          @current-change="handleCurrentChangeReference"/>
      </el-col>
      <p/>
    </el-dialog>
    <div>
      <el-form
        ref="form1"
        :model="formModel" >
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-select id="source" v-model="sourceModel" :disabled="sourceDisable" clearable filterable placeholder="Kaynak" @change="getReferanceOptions(sourceModel.text), checkRole()">
                <el-option
                  v-for="item in sourceOptions"
                  :id="'source'+item.value"
                  :key="item.value"
                  :label="item.text"
                  :value="{value: item.value, text: item.text}"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select id="sub-source" v-model="referanceModel" :disabled="referenceDisable" :change="getCorporateCampaignOptions(sourceModel)" :placeholder="referencePlanceHolder" clearable filterable >
                <el-option
                  v-for="item in referanceOptions"
                  :id="'sub-source'+item.value"
                  :key="item.value"
                  :label="item.text"
                  :value="{value: item.value, text: item.text}"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select v-if="!showCorporateCampaign" id="campaign" v-model="campaignModel" :disabled="campaignDisable" clearable filterable placeholder="Kampanya">
                <el-option
                  v-for="item in campaignOptions"
                  :id="'campaign'+item.value"
                  :key="item.value"
                  :label="item.text"
                  :value="{value: item.value, text: item.text}"
                />
              </el-select>
              <el-select v-else id="corporate-campaign" v-model="corporateCampaignModel" clearable filterable placeholder="Kurumsal Kampanya">
                <el-option
                  v-for="item in corporateCampaignOptions"
                  :id="'corporate-campaign'+item.value"
                  :key="item.value"
                  :label="item.text"
                  :value="{value: item.value, text: item.text}"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button v-loading="busy" id="source-selector-save" type="action" @click="sendDataToParent">Kaydet </el-button><br>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>
          <el-col :span="6"><p/></el-col>
          <el-col :span="6"><p/></el-col>
          <el-col :span="6">
            <el-col :span="6">
              <el-form-item style= "width: 175px;">

              </el-form-item>
            </el-col>
          </el-col>

        </el-row>-->
        <el-row>
          <div v-if="!dateDisable">
            <div v-if="!callCenter">
              <el-col :span="6">
                <el-form-item>
                  <el-date-picker
                    v-model="thruDate"
                    :picker-options="pickerOptions"
                    :disabled="dateDisable"
                    clearable
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="Bitiş"/>
                </el-form-item>
              </el-col>
            </div>
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import callCenterApi from '@/api/crm/callCenter'

export default {
  props: {
    requirementData: {
      type: Boolean,
      default: true
    },
    callCenter: {
      type: Boolean,
      default: false
    },
    personEdit: {
      type: Boolean,
      default: false
    },
    partyId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pickerOptions: {
        firstDayOfWeek: 1
      },
      party: false,
      formModel: {},
      sourceModel: '',
      sourceOptions: [],
      referanceModel: { text: '', value: 0 },
      referanceOptions: [],
      campaignModel: '',
      campaignOptions: [],
      corporateCampaignModel: '',
      corporateCampaignOptions: [],
      thruDate: '2999-01-01',
      sourceReferanceCampaignData: ['', '', '', '', '', '', '', '', '', '', ''],
      selectedResponsibility: 0,
      dialogSelectedRole: false,
      dialogSelectedParty: false,
      searchQueryParty: null,
      partyTableData: [],
      referenceTableData: [],
      formModel1: {},
      formModel2: {},
      vttVtgRelation: 0,
      sourceDisable: false,
      referenceDisable: false,
      campaignDisable: false,
      dateDisable: true,
      referencePlanceHolder: 'Alt Kaynak',
      busy: false,
      listQuery: {
        pageIndex: 1,
        limit: 5
      },
      count: 0,
      showCorporateCampaign: false,
      selectedCorporate: false
    }
  },
  created() {
    this.getSourceOptions(this.callCenter, this.personEdit)
  },
  methods: {
    selectResponsibility(row) {
      this.selectedResponsibility = row.partyId
      this.referanceModel.value = row.partyId
      this.referanceModel.text = row.partyName
      this.referencePlanceHolder = row.partyName
      this.referenceDisable = true
      this.dialogSelectedRole = false
      // this.getCampaignOptions(row.partyName, row.partyId)
      this.selectedCorporate = true
      this.showCorporateCampaign = true
      this.getCampaignOptions('REFERANS', 19191)
      this.getCorporateCampaignOptions(row.partyId)
      this.$notify.success(this.$t('notify.success'))
    },
    selectReference(row) {
      this.selectedResponsibility = row.partyId
      this.referanceModel.value = row.partyId
      this.referanceModel.text = row.partyName
      this.referencePlanceHolder = row.partyName
      this.referenceDisable = true
      this.dialogSelectedParty = false
      this.$notify.success(this.$t('notify.success'))
    },
    checkRole() {
      if (this.sourceModel.text === 'KURUMSAL PORTFÖY') {
        this.dialogSelectedRole = true
      }
      if (!this.callCenter) {
        this.partyTableData = []
        this.selectedResponsibility = 0
        this.vttVtgRelation = 0

        if (this.sourceModel.text === 'VTT' || this.sourceModel.text === 'VTG' || this.sourceModel.text === 'REFERANS') {
          this.vttVtgRelation = this.sourceModel.value
          this.dialogSelectedParty = true
        }
      }
    },
    getAllParties(searchQueryParty) {
      this.searchQueryParty = searchQueryParty
      this.busy = true
      callCenterApi.getAllParties(searchQueryParty, this.party, this.listQuery)
        .then((result) => {
          this.partyTableData = result.data.data
          this.count = result.data.count
          this.busy = false
        }).catch((err) => {
          this.$notify.error(this.$t('notify.error', err))
          this.busy = false
        })
    },
    getAllReferences(searchQueryParty) {
      this.searchQueryParty = searchQueryParty
      this.busy = true
      this.referenceTableData = []
      callCenterApi.getAllReferences(searchQueryParty, this.sourceModel.text, this.listQuery)
        .then((result) => {
          this.busy = true
          this.referenceTableData = result.data.data
          this.count = result.data.count
          this.busy = false
        }).catch((err) => {
          this.$notify.error(this.$t('notify.error' + err))
          this.busy = false
        })
    },
    getSourceOptions(callCenter, personEdit) {
      this.referanceModel = { text: '', value: 0 }
      this.sourceModel = { text: '', value: 0 }
      this.campaignModel = { text: '', value: 0 }
      this.selectedResponsibility = 0
      this.vttVtgRelation = 0
      this.referanceOptions = []
      this.sourceOptions = []
      this.campaignOptions = []
      this.busy = true
      callCenterApi.getSourceOptions(callCenter)
        .then((v) => {
          this.sourceOptions = v.data
        })
        .catch(() => {
          this.$notify.error(this.$t('notify.error'))
        })
        .finally(() => {
          this.busy = false
        })

      if (personEdit) {
        callCenterApi.getAvailableData(this.partyId)
          .then((data) => {
            if (!data || !data.data || !data.data.length) {
              return
            }

            this.sourceModel.value = data.data[0].sourceId
            this.referanceModel.value = data.data[0].referenceId
            this.campaignModel.value = data.data[0].campaignId
            this.thruDate = data.data[0].thruDate

            if (data.data[0].thruDate !== '') {
              this.dateDisable = true
            }
          }).catch((err) => {
            this.$notify.error(this.$t('notify.error') + err)
          }).finally(() => {
            this.busy = false
          })
      }
    },
    getReferanceOptions(source) {
      const excludedSources = ['SAHA ETKİNLİKLERİ', 'KİŞİSEL']
      if (excludedSources.includes(source)) {
        callCenterApi.getReferanceOptions(source)
          .then((v) => {
            this.referanceOptions = []
            this.referanceModel = { text: '', value: 0 }
            this.referanceOptions = v.data
          })
          .catch(() => {
            // this.$notify.error('Güncel Tarihe Uygun Referans Bulunamadı')
            this.referanceOptions = []
            this.referanceModel = { text: '', value: 0 }
          })
      } else {
        this.referanceModel = { text: '', value: 0 }
        this.referanceOptions = []
      }
      this.getCampaignOptions(this.sourceModel.text, this.sourceModel.value)
    },
    getCampaignOptions(source, id) {
      if (source === 'KURUMSAL PORTFÖY') {
        this.campaignOptions = []
        this.campaignModel = ''
      } else {
        callCenterApi.getCampaignOptions(id)
          .then((v) => {
            this.campaignOptions = []
            this.campaignModel = ''
            this.campaignOptions = v.data
          })
          .catch(() => {
            this.$notify.error('Güncel Tarihe Uygun Kampanya Bulunamadı')
            this.campaignOptions = []
            this.campaignModel = ''
          })
      }
    },
    getCorporateCampaignOptions(id) {
      if (id > 0) {
        callCenterApi.getCorporateCampaignOptions(id)
          .then((v) => {
            this.corporateCampaignOptions = []
            this.corporateCampaignModel = ''
            this.corporateCampaignOptions = v.data
          })
          .catch(() => {
            this.$notify.error('Güncel Tarihe Uygun Kampanya Bulunamadı')
            this.corporateCampaignOptions = []
            this.corporateCampaignOptions = ''
          })
      }
    },
    sendDataToParent() {
      this.sourceReferanceCampaignData[0] = this.sourceModel.value
      this.sourceReferanceCampaignData[1] = this.referanceModel.value
      this.sourceReferanceCampaignData[2] = this.campaignModel.value
      this.sourceReferanceCampaignData[9] = this.corporateCampaignModel.value

      if (!this.callCenter) {
        if (this.thruDate === '') {
          this.$notify.error('Bitiş tarihi boş olamaz')
          return
        }
        this.sourceReferanceCampaignData[3] = this.thruDate
        if (this.sourceModel.text === 'ANLAŞMALI KURUM') {
          if (this.selectedResponsibility === 0) {
            this.$notify.error('Kurum sorumlusu seçilmek zorundadır.')
            return
          }
        }
        this.sourceReferanceCampaignData[4] = this.selectedResponsibility
        this.sourceReferanceCampaignData[5] = this.vttVtgRelation
      }
      if (this.requirementData) {
        if (!this.sourceModel) {
          this.$notify.error('Kaynak boş olamaz !')
          return
        }
        if (!this.referanceModel.value) {
          this.$notify.error('Alt Kaynak boş olamaz !')
          return
        }
        if (!this.showCorporateCampaign && !this.campaignModel.value) {
          this.$notify.error('Kampanya boş olamaz !')
          return
        }
        if (this.showCorporateCampaign && !this.corporateCampaignModel.value) {
          this.$notify.error('Kampanya boş olamaz !')
          return
        }
      }
      this.sourceReferanceCampaignData[6] = this.sourceModel.text
      this.sourceReferanceCampaignData[7] = this.referanceModel.text
      this.sourceReferanceCampaignData[8] = this.campaignModel.text
      this.sourceReferanceCampaignData[10] = this.corporateCampaignModel.text
      if (this.showCorporateCampaign) {
        this.sourceReferanceCampaignData[2] = this.corporateCampaignModel.value
        this.sourceReferanceCampaignData[8] = this.corporateCampaignModel.text
      }
      this.$emit('childData', this.sourceReferanceCampaignData)
      this.$notify.success(this.$t('notify.success'))
      this.sourceModel = ''
      this.referanceModel = { text: '', value: 0 }
      this.campaignModel = ''
      this.selectedResponsibility = 0
      this.vttVtgRelation = 0
      this.referanceModel = { text: '', value: 0 }
      this.sourceModel = { text: '', value: 0 }
      this.campaignModel = { text: '', value: 0 }
      this.selectedResponsibility = 0
      this.vttVtgRelation = 0
      this.referanceOptions = []
      this.referenceDisable = false
      this.selectedCorporate = false
      this.showCorporateCampaign = false
    },
    async handleSizeChange(val) {
      this.listQuery.limit = val
      this.getAllParties(this.searchQueryParty)
    },
    async handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getAllParties(this.searchQueryParty)
    },
    async handleSizeChangeReference(val) {
      this.listQuery.limit = val
      this.getAllReferences(this.searchQueryParty)
    },
    async handleCurrentChangeReference(val) {
      this.listQuery.pageIndex = val
      this.getAllReferences(this.searchQueryParty)
    }
  }
}
</script>
