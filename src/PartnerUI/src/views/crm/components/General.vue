<template>
  <div>
    <div
      v-loading="busy"
      element-loading-text="Loading..."
      element-loading-spinner="el-icon-loading"
      class="app-container"
    >
      <div>
        <el-card>
          <el-form
            ref="crmEditPersonGeneral"
            :model="model"
            :disabled="true"
            label-position="left"
            label-width="150px"
            class="itemlabel"
          >
            <el-row>
              <el-col :span="11">
                <el-form-item
                  :label="$t('crm.personEditGeneral.tckn')"
                  prop="identificationNumber"
                >
                  <el-input
                    v-model="model.identificationNumber"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.firstName')"
                  prop="firstName"
                >
                  <el-input
                    v-uppercase
                    v-model="model.firstName"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.middleName')"
                  prop="middleName"
                >
                  <el-input
                    v-uppercase
                    v-model="model.middleName"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.lastName')"
                  prop="lastName"
                >
                  <el-input
                    v-uppercase
                    v-model="model.lastName"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.fatherName')"
                  prop="fatherName"
                >
                  <el-input
                    v-uppercase
                    v-model="model.fatherName"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.motherName')"
                  prop="motherName"
                >
                  <el-input
                    v-uppercase
                    v-model="model.motherName"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.dateOfBirth')"
                  prop="birthDay"
                >
                  <el-input v-model="model.birthDay" class="itemlabel" />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.motherMaidenName')"
                  prop="motherMaidenName"
                >
                  <el-input
                    v-uppercase
                    v-model="model.motherMaidenName"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditIdentity.gender')"
                  prop="genderClassificationTypeValueId"
                >
                  <el-input v-model="model.gender" class="itemlabel" />
                </el-form-item>
              </el-col>
              <el-col :span="2"> &nbsp; </el-col>
              <el-col :span="11">
                <el-form-item
                  :label="$t('crm.personEditGeneral.kvkStatus')"
                  prop="kvkStatusClassificationTypeValueId"
                >
                  <el-input v-model="model.kvkStatus" class="itemlabel" />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.portfolio')"
                  prop="portfolio"
                >
                  <el-input v-model="model.portfolio" class="itemlabel" />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditWorkingLife.occupation')"
                  prop="occupationClassificationTypeValueId"
                >
                  <el-input v-model="model.occupation" class="itemlabel" />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.disabledType')"
                  prop="disabledTypeClassificationTypeValueId"
                >
                  <el-input v-model="model.disabledType" class="itemlabel" />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.quickPersonCreate.telNo')"
                  prop="phoneNumber"
                >
                  <el-input v-model="model.phoneNumber" class="itemlabel" />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.email')"
                  prop="email"
                >
                  <el-input
                    v-uppercase
                    v-model="model.email"
                    class="itemlabel"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('crm.personEditGeneral.address')"
                  prop="address"
                >
                  <el-input
                    v-uppercase
                    v-model="model.address"
                    :rows="5"
                    type="textarea"
                    class="itemlabel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- model.person.partyId -->
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import partnerApi from "@/api/crm/partner";
import { hasActionPermission } from "@/actionPermission.js";

export default {
  props: {
    partyId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      componentKey: 0,
      busy: false,
      isUpdatePortfolioAuthorization: false,
      disabledTypeStatusList: [],
      kvkStatusList: [],
      portfolioList: [],
      genderList: [],
      occupationList: [],
      personEdit: true,
      model: {
        partyId: null,
        disabledType: null,
        gender: null,
        occupation: null,
        kvkStatus: null,
        identificationNumber: null,
        firstName: null,
        middleName: null,
        lastName: null,
        motherMaidenName: null,
        maidenName: null,
        fatherName: null,
        motherName: null,
        birthDay: null,
        phoneNumber: null,
        address: null,
        email: null,
        portfolio: null,
        occupation: null,
      },
    };
  },
  async created() {
    await this.getLookupFields();
    this.loadFields();
    this.getContacts();
  },
  methods: {
    hasActionPermission,
    forceToRender() {
      this.componentKey += 1;
    },
    permissionFalseMethod() {
      this.model.smsMarketingPermission = false;
      this.model.emailMarketingPermission = false;
      this.model.phoneMarketingPermission = false;
    },
    async getLookupFields() {
      this.busy = true;
      try {
        const v = await partnerApi.getPersonGeneralLookup();
        this.disabledTypeStatusList = v.data.disabledTypeStatusList;
        this.genderList = v.data.genderList;
        this.kvkStatusList = v.data.kvkStatusList;
        this.portfolioList = v.data.portfolioList;
        this.occupationList = v.data.occupationList;
        this.busy = false;
      } catch (error) {
        this.busy = false;
        this.errorMessage = this.$t("crm.common.errorLookupFields");
      }
    },
    loadFields() {
      this.busy = true;
      partnerApi
        .getPersonGeneral(this.partyId) //
        .then((v) => {
          console.log(v.data);
          this.model = { ...this.model, ...v.data };
          if (v.data.birthDay != null) {
            this.model.birthDay =
              this.model.birthDay.toString() === "1900-01-01T00:00:00"
                ? null
                : new Date(v.data.birthDay);
            if (
              typeof this.model.birthDay !== "string" &&
              this.model.birthDay !== null
            ) {
              this.model.birthDay =
                this.model.birthDay.getFullYear() +
                "-" +
                (this.model.birthDay.getMonth() + 1 < 10
                  ? "0" + (this.model.birthDay.getMonth() + 1)
                  : this.model.birthDay.getMonth() + 1) +
                "-" +
                (this.model.birthDay.getDate() < 10
                  ? "0" + this.model.birthDay.getDate().toString()
                  : this.model.birthDay.getDate().toString());
            }
          }
          if (v.data.disabledTypeClassificationTypeValueId) {
            this.model.disabledType = this.disabledTypeStatusList?.find(
              (x) => x.value == v.data.disabledTypeClassificationTypeValueId
            )?.label;
          }
          if (v.data.genderClassificationTypeValueId) {
            this.model.gender = this.genderList?.find(
              (x) => x.value == v.data.genderClassificationTypeValueId
            )?.label;
          }
          if (v.data.kvkStatusClassificationTypeValueId) {
            this.model.kvkStatus = this.kvkStatusList?.find(
              (x) => x.value == v.data.kvkStatusClassificationTypeValueId
            )?.label;
          }
          if (v.data.portfolio) {
            this.model.portfolio = this.portfolioList?.find(
              (x) => x.value == v.data.portfolio
            )?.label;
          }
          if (v.data.occupationClassificationTypeValueId) {
            this.model.occupation = this.occupationList?.find(
              (x) => x.value == v.data.occupationClassificationTypeValueId
            )?.label;
          }
          this.busy = false;
        })
        .catch((err) => {
          this.busy = false;
          console.log("loadFields", err);
          this.errorMessage = this.$t("crm.common.errorLookupFields");
        });
    },
    getContacts() {
      this.busy = true;
      partnerApi
        .getContactListsForGeneral(this.partyId)
        .then((v) => {
          this.model.phoneNumber = v.data.find(
            (x) => x.mechType == 3
          )?.description;
          this.model.address = v.data.find((x) => x.mechType == 2)?.description;
          this.model.email = v.data.find((x) => x.mechType == 5)?.description;
          this.busy = false;
          console.log(this.model);
        })
        .catch(() => {
          this.$notify.error(this.$t("notify.error"));
          this.busy = false;
        });
    },
  },
};
</script>

<style scope>
.el-input.is-disabled .el-input__inner {
  color: #000;
  cursor: default;
}
.el-textarea.is-disabled .el-textarea__inner {
  color: #000;
  cursor: default;
}

.itemlabel {
  width: 100%;
}

.mb-25 {
  margin-bottom: 25px;
}

.updateButton {
  float: right;
  width: 112px;
  height: 40px;
  margin-right: 19px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(110deg, #ff7c52, #ff9573);
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
}
</style>

