<template>
  <div class="oneLine">
    <template v-if="!busy">
      <el-row>
        <div>
          <el-popover
            width="100%"
            trigger="hover">
            <template #reference>
              <el-row type="flex" justify="center" align="middle">
                <div class="name">
                  <div v-if="personDetail.partyName" :data-letters="personDetail.partyName.charAt(0)"
                       style="white-space: nowrap;margin:0;"/>
                  <div>{{ personDetail.partyName }}</div>
                </div>
              </el-row>
            </template>
            <div style="width:100%;" class="mb-25">
              <el-row>
                <el-col class="customerCard2">
                  <el-row type="flex" align="middle" justify="space-between">
                    <el-col :span="3">
                      <svg-icon icon-class="dummy-profile-icon" class="avatarImage"/>
                    </el-col>
                    <el-col :span="18" style="text-align:left;">
                      <span class="customerName">{{ personDetail.partyName }}</span>
                    </el-col>
                    <el-col :span="3">
                      <el-button
                        style="background: none;border: none;border-radius: 50%;padding: 0px;margin-right:5px; float:right;"
                        @click="redirectSale">
                        <svg-icon icon-class="calculate-icon" style="width:40px;height:40px;"/>
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row class="pl-75 mt-10">
                    <el-col :span="24">
                      <span v-if="personDetail.portfolio"
                            class="customerOrganizationName">{{ personDetail.portfolio.portfolioName }}</span>
                      <span v-else class="customerRepresentative">{{ ' ' }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="pl-75 mt-10">
                    <el-col :span="12">
                      <span class="phoneNumber2"><strong class="boldGray">{{ 'Telefon: ' }}</strong>
                        {{ $filters.formatPhoneNumber(personDetail.phoneNumber) }} </span>

                      <el-tooltip :open-delay="delay" content="Kopyala" class="item" effect="light"
                                  placement="top-start">
                        <el-button v-clipboard:copy="getUnformattedPhone(personDetail.phoneNumber)"
                                   v-if="personDetail.phoneNumber" style="position: relative;top:3px;cursor:pointer"
                                   class="icon-button">
                          <svg-icon style="width:20px!important;height:20px!important" icon-class="copy"/>
                        </el-button>
                      </el-tooltip>

                    </el-col>
                    <el-col :span="12">
                      <span class="identificationNumber2"><strong class="boldGray">{{
                          'TCKN: '
                        }}</strong>{{
                          personDetail.identificationNumber !== null ? personDetail.identificationNumber : 'TCKN Yok'
                        }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="pl-75 mt-10">
                    <el-col :span="12">
                      <span class="lightGray"><strong>Takip Durumu</strong> {{ '' }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="lightGray"><strong>Oluşturan</strong></span>
                    </el-col>
                  </el-row>
                  <el-row class="pl-75">
                    <el-col :span="12">
                      <span class="statusContent">{{
                          personDetail.customerTrackType !== null ? personDetail.customerTrackType : ''
                        }}  {{
                          '/' + personDetail.customerTrackStatus !== null ? personDetail.customerTrackStatus : ''
                        }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="statusContent">{{ personDetail.creatorName }}</span>
                    </el-col>
                  </el-row>
                  <!-- <span class="cityDistrict">{{ ' ' }}</span> -->
                  <el-row class="pl-75 mt-10">
                    <el-col :span="24">
                      <span class="lightGray sourceTitle">Tasarruf Sahibi Kaynağı</span>
                    </el-col>
                  </el-row>
                  <el-row class="pl-75">
                    <el-col :span="24">
                      <span :style="personDetail.utmSite === null?'':'margin-left:110px;'" class="sourceContent">{{
                          personDetail.utmSource !== null ? personDetail.utmSource : ''
                        }}</span> <span
                      class="long-data"> {{ '/' + personDetail.utmSite !== null ? personDetail.utmSite : '' }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="mt-10">
                    <el-col :span="3">
                      <span class="partyId">{{ personDetail.partyId }}</span>
                    </el-col>
                    <el-col :span="10">
                      <span class="startDate"><strong>{{
                          'Katılım Tarihi: '
                        }}</strong>{{ $filters.parseTime(personDetail.initialContactDate, '{y}.{m}.{d}') }}</span>
                    </el-col>
                    <el-col :span="11">
                      <span><strong style="padding-left:50px;">{{
                          'Şube:'
                        }}</strong> {{ personDetail.portfolio ? personDetail.portfolio.branchName : '' }} </span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-popover>
        </div>
      </el-row>
      <div v-if="hasActionPermissionNew($store.getters.permissions, 'swchPersonDetailsforTasks')" class="icon-position">
        <el-tooltip :open-delay="delay" content="Kişi detaylarını görmek için tıklayınız" class="item" effect="light"
                    placement="top-start">
          <el-button class="icon-button" @click="routePersonDetails">
            <svg-icon icon-class="online-customer" style="width:42px !important;height:42px !important;"/>
          </el-button>
        </el-tooltip>
      </div>
    </template>

  </div>
</template>
<script>

import personApi from '@/api/crm/person'
import {hasActionPermissionNew} from "@/actionPermission";

export default {
  props: {
    partyId: {
      type: String,
      default: '231231-2342-2343-2342'
    }
  },
  data() {
    return {
      busy: false,
      delay: 1000,
      startDate: null,
      personDetail: {
        portfolio: {
          name: '',
          po: {
            title: ''
          }
        }
      }
    }
  },
  mounted() {
    this.getPerson()
  },
  methods: {
    hasActionPermissionNew,
    routePersonDetails() {
      if (this.personDetail.partyType === 1) {
        this.$router.push({name: 'personEdit', params: {partyId: this.personDetail.partyId}})
      } else {
        this.$router.push({name: 'organizationEdit', params: {partyId: this.personDetail.partyId}})
      }
    },
    getPerson() {
      this.busy = true
      personApi.getPersonByPartyId(this.partyId)
        .then((result) => {
          this.personDetail = result.data
          this.calculateDay(this.personDetail.customerDate)
          this.busy = false
        }).catch((err) => {
        this.errorMessage = err
        this.busy = false
      })
    },
    getPhoneNumber() {
      if (this.personDetail.infoString !== null && this.personDetail.infoString !== '') {
        return this.personDetail.infoString
      } else {
        return 'Telefon Yok'
      }
    },
    calculateDay(date) {
      var today = new Date()
      var customerUtcDate = new Date(date)
      this.startDate = Math.round((today - customerUtcDate) / (1000 * 60 * 60 * 24))
      this.startDate = this.startDate + 1
    },
    redirectSale() {
      this.$store.commit('SET_CUSTOMER', {partyId: this.personDetail.partyId, partyName: this.personDetail.partyName})
      this.$router.push({path: '/finance/sale/saleWizard'})
    },
    getUnformattedPhone(number) {
      if (!number) {
        return ''
      }
      if (number.length === 10) {
        return '0' + number
      } else if (number.length === 11) {
        return number
      } else return ''
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

.pl-75 {
  padding-left: 67px;
}

.mt-10 {
  margin-top: 20px;
}

.oneLine {
  padding: 1px 2px;
  width: 100%;
  height: 60px;
  background: #fff;
  border-radius: 4px;
  border: solid 1px #e5e5e5;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.avatarImage {
  border: 4px solid white;
  border-radius: 50%;
  width: 60px !important;
  height: 60px !important;
  position: absolute;
  top: 0px;
  left: 0px;
}

.el-card {
  border-radius: 4px;
  box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #e5e5e5;
  background-image: linear-gradient(113deg, #f5f5f5, #ffffff);
}

.itemlabel {
  width: 100%;
  height: 36px;
  line-height: 36px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding: 20px;
  text-align: center;
}

.alignLeft {
  text-align: left;
  color: white !important;
}

.title {
  font-weight: bold;
  font-size: 15px;
}

.titleInfo {
  font-weight: normal;
  font-size: 13px;
}

.lightGray {
  font-size: 14px;
  font-weight: 100;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #b9b9b9;
}

.phoneNumber2 {
  font-size: 14px;
  font-weight: 100;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #b9b9b9;
}

.identificationNumber2 {
  font-size: 14px;
  font-weight: 100;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #b9b9b9;
}

.customerCard2 {
  padding: 15px;
  width: 530px;
  min-height: 350px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #e5e5e5;
  background-image: linear-gradient(122deg, #f5f5f5, #ffffff);

  .customerName {
    font-size: 21px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
    word-break: break-word;
  }

  .customerOrganizationName {
    font-size: 18px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: #000000;
  }

  .customerRepresentative {
    font-size: 18px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }

  .customerNumber {
    font-size: 14px;
    font-weight: 100;
    margin-bottom: 15px;
  }

  .startDate {
    font-weight: 100;
    font-size: 14px;
    color: #b9b9b9;
  }

  .statusContent {
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }

  .sourceContent {
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }
}

.long-data {
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  top: 280px;
  left: 120px;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
}

.long-data:hover {
  overflow: visible;
  white-space: normal;
  width: auto;
  position: absolute;
  background-color: #fff;
  background: #ffffff;
  position: absolute;
  z-index: 1;
  top: 280px;
  left: 120px;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
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

  div:last-child {
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
    div:last-child {
      width: 235px !important;
    }
  }
}

@media screen and (max-width: 1775px) and (min-width: 1681px) {
  .name {
    div:last-child {
      width: 225px !important;
    }
  }
}

@media screen and (max-width: 1680px) and (min-width: 1545px) {
  .name {
    div:last-child {
      width: 180px !important;
    }
  }
}

@media screen and (max-width: 1544px) and (min-width: 1440px) {
  .name {
    div:last-child {
      width: 155px !important;
    }
  }
}

@media screen and (max-width: 1439px) and (min-width: 1405px) {
  .name {
    div:last-child {
      width: 155px !important;
      font-size: 12px !important;
    }
  }
  [data-letters]:before {
    margin-right: 0.3em !important;
  }
}

@media screen and (max-width: 1404px) and (min-width: 1280px) {
  .name {
    div:last-child {
      width: 115px !important;
      font-size: 12px !important;
    }
  }
  [data-letters]:before {
    margin-right: 0.3em !important;
  }
}
</style>
