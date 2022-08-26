
<template>
  <div
    :loading="busy"
    :element-loading-text="'Yükleniyor...'"
    :element-loading-spinner="'el-icon-loading'"
    :class="hasLegalFollowUp ? 'watermark' : ''"
    class="app-container"
  >
    <el-card class="box-card" shadow="always">
      <el-row>
        <el-col :xl="2" :lg="2" :md="3" :sm="4">
          <el-row>
            <p
              v-if="model.partyName"
              :data-letters="firstLetters(model)"
              style="white-space: nowrap; margin: 0"
            />
          </el-row>
        </el-col>
        <el-col :xl="22" :lg="22" :md="21" :sm="20">
          <el-row>
            <el-col>
              <span class="customerName">{{ model.partyName }}</span>
              <span class="customerStage">{{
                " (" + model.customerStage + ")"
              }}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col>
              <span class="phoneNumber">
                <strong class="boldGray">Telefon: </strong>
                <el-tooltip
                  :show-after="0"
                  :content="
                    model.partyContactMechAttributeType === 'WrongNumber'
                      ? 'Yanlış Numara'
                      : ''
                  "
                  :disabled="
                    model.partyContactMechAttributeType !== 'WrongNumber'
                  "
                  :hide-after="10000"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <span
                    :style="
                      model.partyContactMechAttributeType ===
                      'WrongNumber'
                        ? 'color:#C94343;'
                        : ''
                    "
                  >
                    <span>{{
                      $filters.formatPhoneNumber(model.phoneNumber)
                    }}</span>
                  </span>
                </el-tooltip>
                <span
                  style="
                    vertical-align: middle;
                    right: -4px;
                    position: relative;
                  "
                >
                  <el-tooltip
                    :show-after="0"
                    :content="copyPhoneText()"
                    :hide-after="10000"
                    class="item"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-button
                      v-clipboard:copy="
                        getUnformattedPhone(model.phoneNumber)
                      "
                      v-if="model.phoneNumber"
                      class="icon-button"
                      @click="copyPhone()"
                    >
                      <svg-icon
                        style="
                          width: 30px !important;
                          height: 30px !important;
                          margin: 0 !important;
                          vertical-align: sub;
                        "
                        icon-class="copy"
                      />
                    </el-button>
                  </el-tooltip>
                </span>
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span class="identificationNumber">
                <strong class="boldGray">TCKN: </strong
                >{{
                  model.identificationNumber !== null
                    ? model.identificationNumber
                    : "TCKN Yok"
                }}
                <span
                  style="
                    vertical-align: middle;
                    right: -4px;
                    position: relative;
                  "
                >
                  <el-tooltip
                    :show-after="0"
                    :content="copyPhoneText()"
                    :hide-after="10000"
                    class="item"
                    effect="dark"
                    placement="top-start"
                  >
                    <el-button
                      v-clipboard:copy="model.identificationNumber"
                      v-if="model.phoneNumber"
                      class="icon-button"
                      @click="copyPhone()"
                    >
                      <svg-icon
                        style="
                          width: 30px !important;
                          height: 30px !important;
                          margin: 0 !important;
                          vertical-align: sub;
                        "
                        icon-class="copy"
                      />
                    </el-button>
                  </el-tooltip>
                </span>
              </span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="middle">
            <span class="customerPortfolioInfo">
              {{ model.portfolio.branchName }} -
              {{ model.portfolio.agentName }}
            </span>
          </el-row>
          <el-row class="draw">
            <el-col :span="24"><div class="line" /></el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :lg="4" :md="5" :sm="6">
              <span class="partyId2">{{ model.partyId }}</span>
            </el-col>
            <el-col :xl="10" :lg="10" :md="16" :sm="18">
              <span class="sourceContent">
                <span class="lightGray"><strong>Katılım Tarihi: </strong></span>
                <span class="startDate">{{
                  $filters.parseTime(
                    model.initialContactDate,
                    "{dd}.{mm}.{yyyy}"
                  )
                }}</span>
              </span>
            </el-col>
            <el-col :xl="3" :lg="3" :md="5" :sm="6">
              <span class="partyId2">{{
                whatDay(model.initialContactDate) + ". Gün"
              }}</span>
            </el-col>
            <div :style="model.czmPartyId ? '' : 'display: none;'">
              <el-col :xl="3" :lg="3" :md="4" :sm="4">
                <span class="sourceContent">
                  <span class="lightGray"><strong>CzmId: </strong></span>
                  <el-tooltip
                    :content="
                      model.partyAttributeType
                        ? 'Çözüm Müşterisi'
                        : 'Birevim Müşterisi'
                    "
                  >
                    <span
                      :class="
                        model.partyAttributeType
                          ? 'czmCustomer'
                          : 'redCaseCustomer'
                      "
                      >{{ model.czmPartyId }}</span
                    >
                  </el-tooltip>
                </span>
              </el-col>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-row
      v-if="productDelayInformation.length !== 0"
      style="margin-top: 20px"
    >
      <el-col :span="24">
        <div class="product-delay">
          <span>
            <svg
              width="24"
              height="22"
              xmlns="http://www.w3.org/2000/svg"
              style="vertical-align: middle"
            >
              <path
                d="M21.654 21.625c1.512 0 2.462-1.64 1.705-2.953L13.518 1.61c-.756-1.31-2.653-1.313-3.41 0L.265 18.672c-.756 1.31.19 2.953 1.705 2.953h19.683zm-8.846-7.219h-1.991a.492.492 0 0 1-.492-.465l-.304-5.578a.492.492 0 0 1 .492-.52h2.6c.282 0 .506.238.49.52L13.3 13.94a.492.492 0 0 1-.49.465zm-.996 4.512a1.887 1.887 0 1 1 0-3.773 1.887 1.887 0 0 1 0 3.773z"
                fill="#c94343"
                fill-rule="nonzero"
              />
            </svg>
            &nbsp;&nbsp;
            <span style="font-weight: bold; color: #c94343">UYARI:</span>
            Tasarruf Sahibinin
            <span
              v-for="item in productDelayInformation"
              :key="item.index"
              style="font-weight: bold"
              >{{
                item.code + (productDelayInformation.length > 1 ? ", " : "")
              }}</span
            >
            numaralı
            {{
              productDelayInformation.length > 1 ? "projelerinde" : "projesinde"
            }}
            <span style="font-weight: bold; color: #c94343"
              ><u>TAKSİT GECİKMESİ VARDIR!!!</u></span
            >
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="hasLegalFollowUp">
      <div class="product-risk">
        <span>Yasal Takip Durumu:</span>
        <span v-html="legalFollowUpText" />
        <el-tooltip
          class="item"
          effect="light"
          content="Müşterimizin Yasal Takip durumundaki projeleri ile ilgili olarak Hukuk Birimi ile irtibata geçmeleri gerekmektedir."
          placement="top-start"
        >
          <span class="el-icon-info" />
        </el-tooltip>
      </div>
    </el-row>
    <div>
      <div class="tab" style="position: relative; z-index: 3">
        <el-button
          :class="currentComponent === 'general' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'general'"
          >Genel Bilgiler</el-button
        >
        <el-button
          :class="currentComponent === 'findex' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'findex'"
          >Mali</el-button
        >
        <el-button
          :class="currentComponent === 'relation' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'relation'"
          >İlişki Listesi</el-button
        >
        <el-button
          :class="currentComponent === 'financeProduct' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'financeProduct'"
          >Proje Listesi</el-button
        >
        <el-button
          :class="currentComponent === 'lifecycle' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'lifecycle'"
          >Geçmiş</el-button
        >
        <el-button
          :class="
            currentComponent === 'customerPortfolioLifeCycle' ? 'active' : ''
          "
          class="tablinks"
          @click="currentComponent = 'customerPortfolioLifeCycle'"
          >Portföy Geçmişi</el-button
        >
        <el-button
          :class="currentComponent === 'customerActivities' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'customerActivities'"
          >{{ $t("crm.personEdit.customerActivities") }}</el-button
        >
        <el-button
          :class="currentComponent === 'customerDocuments' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'customerDocuments'"
          >{{ $t("crm.personEdit.customerDocuments") }}</el-button
        >
        <el-button
          :class="currentComponent === 'CallCenterActivities' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'CallCenterActivities'"
          >Çağrı Geçmişi</el-button
        >
        <el-button
          :class="currentComponent == 'redline' ? 'active' : ''"
          class="tablinks"
          @click="currentComponent = 'redline'"
          >Şikayetler</el-button
        >
      </div>
      <el-row />
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <general
            v-if="currentComponent === 'general'"
            :key="currentComponent"
            :party-id="model.partyId"
            @refresh="refreshScreen"
          />
          <findex
            v-if="currentComponent === 'findex'"
            :key="currentComponent"
            :party-id="model.partyId"
          />
          <relation
            v-if="currentComponent === 'relation'"
            :key="currentComponent"
            :party-id="model.partyId"
          />
          <finance-product
            v-if="currentComponent === 'financeProduct'"
            :key="currentComponent"
            :party-id="model.partyId"
          />
          <lifecycle
            v-if="currentComponent === 'lifecycle'"
            :key="currentComponent + renderKey"
            :party-id="model.partyId"
            @saved="renderKey++"
          />
          <customer-Portfolio-Life-Cycle
            v-if="currentComponent === 'customerPortfolioLifeCycle'"
            :key="currentComponent"
            :party-id="model.partyId"
          />
          <customer-activity-lists
            v-if="currentComponent === 'customerActivities'"
            :key="currentComponent"
            :customer-id="model.partyId"
            :have-customer-id="true"
          />
          <customer-Documents
            v-if="currentComponent === 'customerDocuments'"
            :key="currentComponent"
            :indices="[
              { keyType: 'CUSTOMERID', value: model.createActivityId },
            ]"
            document-group-type="CUSTOMERDOCUMENTS"
          />
          <CallCenterActivities
            v-if="currentComponent === 'CallCenterActivities'"
            :party-id="model.partyId"
          />
          <redline
            v-if="currentComponent == 'redline'"
            :key="currentComponent"
            :party-id="model.partyId"
          />
          <!-- <el-dialog
            :v-model="showCustomerPhoneNumberDialog"
            :title="$t('crm.personEdit.noPermissionPhoneNumber')"
            width="35%"
          >
            <el-card>
              <h3 style="color: red">
                DİKKAT! Bu telefon numarasının aranma izni yoktur!
              </h3>
              <h4>{{ model.phoneNumber }}</h4></el-card
            >
          </el-dialog> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import general from "./components/General.vue";
import findex from "./components/Findex.vue";
import financeProduct from "./components/ProductList.vue";
import lifecycle from "@/components/CustomerActivities/CustomerLifeCycle.vue";
import customerPortfolioLifeCycle from "./components/CustomerPortfolioLifeCycle/CustomerPortfolioLifeCycle.vue";
import relation from "./components/Relation.vue";
import productRiskApi from "@/api/finance/productRisk";
import partnerApi from "@/api/crm/partner";
import CallCenterActivities from "./components/CallCenterActivities";
import redline from "@/views/bpm/redline/redLineCustomerCardList.vue";
import CustomerActivityLists from "./components/CustomerActivity/CustomerActivities";
import documentGroup from "@/views/dms/documentGroup";

export default {
  components: {
    CallCenterActivities,
    customerDocuments: documentGroup,
    general,
    findex,
    lifecycle,
    customerPortfolioLifeCycle,
    financeProduct,
    relation,
    redline,
    CustomerActivityLists,
  },
  data() {
    return {
      currentComponent: "general",
      busy: false,
      renderKey: 0,
      model: {
        partyId: null,
        partyType: null,
        partyName: null,
        partyStatus: null,
        portfolio: null,
        createActivityId: null,
        customerStage: null,
        partyContactMechAttributeType: null,
        phoneNumber: null,
        identificationNumber: null,
        portfolio: {
          branchName:null,
          agentName:null,
        },
        initialContactDate: null,
        czmPartyId: null,
        partyAttributeType: null
      },
      validation: {},
      legalFollowUpList: [],
      hasLegalFollowUp: false,
      legalFollowUpText: "",
      phoneNumber: "",
      copied: false,
      showCustomerPhoneNumberDialog: false,
      productDelayInformation: [],
    };
  },
  created() {
    this.model.partyId = parseInt(this.$route.params.partyId, 10);
    this.getPersonByPartyId(this.model.partyId);
    this.loadLegalFollowUpBar(this.model.partyId);
    this.getDelayInformation(this.model.partyId);
  },
  methods: {
    getPersonByPartyId() {
      this.busy = true;
      partnerApi
        .getPersonByPartyId(this.model.partyId)
        .then((result) => {
          this.model = result.data;
          this.busy = false;
        })
        .catch((err) => {
          this.errorMessage = err;
          // this.errorMessage = this.$t("template.errorTemplateCode");
          this.busy = false;
        });
    },
    refreshScreen() {
      this.getFields();
      this.getPersonByPartyId(this.model.partyId);
    },
    getLegalFollowUpTextWithUserFrendly() {
      if (this.legalFollowUpList === null) {
        return "";
      }
      const tempLegalFollowUpList = Array.from(this.legalFollowUpList);
      if (tempLegalFollowUpList.length > 0) {
        if (tempLegalFollowUpList.length === 1) {
          return (
            tempLegalFollowUpList[0].productCode +
            "<strong> &nbsp; Yasal Takip Durumunda</strong>"
          );
        } else {
          const lastItem = tempLegalFollowUpList.pop();
          return (
            "Müşterimizin &nbsp;" +
            "<strong>" +
            tempLegalFollowUpList.map((x) => x.productCode).join() +
            "</strong> &nbsp;" +
            " ve &nbsp;" +
            " <strong>" +
            lastItem.productCode +
            "</strong> &nbsp;" +
            " No'lu projeleri &nbsp; <strong> Yasal Takip Durumunda</strong>"
          );
        }
      }
      return "";
    },
    getUnformattedPhone(number) {
      if (!number) {
        return "";
      }
      if (number.length === 10) {
        return "0" + number;
      } else if (number.length === 11) {
        return number;
      } else return "";
    },
    loadLegalFollowUpBar(customerId) {
      this.busy = true;
      productRiskApi
        .getLegalFollowupList(customerId)
        .then((res) => {
          if (res.data != null && res.data.length > 0) {
            this.legalFollowUpList = Array.from(res.data);
            this.hasLegalFollowUp = true;
            this.legalFollowUpText = this.getLegalFollowUpTextWithUserFrendly();
          }
        })
        .catch(() => {
          this.errorMessage = this.$t("template.errorTemplateCode");
        })
        .finally(() => {
          this.busy = false;
        });
    },
    getDelayInformation(customerId) {
      this.busy = true;
      productRiskApi
        .getDelayInformation(customerId)
        .then((res) => {
          if (res.data != null && res.data.length > 0) {
            this.productDelayInformation = Array.from(res.data);
          }
        })
        .catch(() => {
          this.errorMessage = this.$t("template.errorTemplateCode");
        })
        .finally(() => {
          this.busy = false;
        });
    },
    whatDay(initialDate) {
      // initialContactDate
      const sep = new Date(initialDate);
      const today = new Date();
      return Math.floor((today - sep) / (1000 * 60 * 60 * 24));
    },
    firstLetters(model) {
      const array = model.partyName.split(" ");
      return array[0].charAt(0) + array[array.length - 1].charAt(0);
    },
    copyPhone() {
      this.copied = true;
    },
    copyPhoneText() {
      if (this.copied === false) {
        return "Kopyala";
      } else {
        setTimeout(() => {
          this.copied = false;
        }, 3000);
        return "Kopyalandı!";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.watermark::before {
  content: "";
  position: absolute;
  z-index: 2;
  pointer-events: none;
  background-image: url("../../assets/img/birevim/watermark.png");
  background-repeat: repeat;
  width: 100%;
  height: 100%;
  top: 0;
}
.customerPortfolioInfo {
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
  margin-top: 10px;
}
.box-card {
  position: relative;
  z-index: 3;
  .draw {
    margin-top: 25px;
    margin-bottom: 25px;
    .line {
      background: #e5e5e5;
      height: 1px;
      width: 109%;
      position: absolute;
      left: -9%;
    }
  }
  .partyId2 {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }
  .czmCustomer {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: blue;
  }
  .redCaseCustomer {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: red;
  }
  .mt-10 {
    margin-top: 10px;
  }
  [data-letters]:before {
    content: attr(data-letters);
    display: inline-block;
    font-size: 1.1em;
    width: 60px;
    height: 60px;
    line-height: 3em;
    text-align: center;
    border-radius: 50%;
    border: 2px solid #fff;
    background: #b7b7b7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.1);
    vertical-align: middle;
    margin-right: 1em;
    color: white;
    cursor: pointer;
  }
  .customerName {
    font-size: 21px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }
  .customerStage {
    font-size: 21px;
    font-weight: 100;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }
  .lightGray {
    font-size: 14px;
    font-weight: 100;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b7b7b7;
  }
  .phoneNumber {
    font-size: 14px !important;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000 !important;
    background-image: linear-gradient(to left, #ffffff, rgba(255, 255, 255, 0));
    border-radius: 15px;
    padding: 5px 0;
    .boldGray {
      color: #909399;
    }
  }
  .identificationNumber {
    font-size: 14px !important;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000 !important;
    background-image: linear-gradient(to left, #ffffff, rgba(255, 255, 255, 0));
    border-radius: 15px;
    padding: 5px 0;
    .boldGray {
      color: #909399;
    }
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
  .startDate {
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }
  .link {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #1a84ff;
    cursor: pointer;
  }
  .link:focus {
    outline: none;
  }
}
.product-risk {
  width: fit-content;
  height: 60px;
  padding: 20px;
  object-fit: contain;
  border-radius: 4px;
  background-image: linear-gradient(94deg, #b63049, #c94343);
  display: flex;
  align-items: center;
  margin-top: 30px;
  position: relative;
  z-index: 3;
  span:first-child {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
    margin-right: 30px;
  }
  span:nth-child(2) {
    height: 30px;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e5e5e5;
    background-color: #f5f5f5;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 0.88;
    letter-spacing: normal;
    display: flex;
    align-items: center;
    padding: 10px;
    font-size: 14px;
    color: #c03a46;
  }
  span:nth-child(3) {
    object-fit: contain;
    border: 0;
    background-color: #f5f5f500;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 0.88;
    letter-spacing: normal;
    color: #ffff;
    display: flex;
    align-items: center;
    padding: 10px;
    margin-left: 5px;
    margin-right: -20px;
    cursor: pointer;
  }
}
.el-card {
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
  border: solid 1px #e5e5e5;
  background-color: #f5f5f5;
}
.itemlabel {
  width: 100%;
  height: 36px;
  line-height: 36px;
}
.avatarImage {
  border: 4px solid white;
  border-radius: 50%;
  width: 60px !important;
  height: 60px !important;
  position: absolute;
  top: 20px;
  left: 20px;
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

.long-data {
  display: inline-block !important;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
  cursor: pointer;
}

// .long-data:hover {
//   overflow: visible;
//   white-space: normal;
//   width: auto;
//   background-color: #fff;
//   background: #ffffff;
//   z-index: 1;
//   font-size: 14px;
//   font-weight: 300;
//   font-style: normal;
//   font-stretch: normal;
//   line-height: normal;
//   letter-spacing: normal;
//   color: #000000;
// }
.jobs >>> .el-tabs__header.is-left {
  margin-top: 68px;
}
.product-delay {
  min-height: 30px;
  height: auto;
  padding: 10px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  object-fit: contain;
  border-radius: 4px;
  border: solid 1px #c94343;
  background-color: #feeaea;
  svg path {
    fill: #c94343;
  }
}
</style>

