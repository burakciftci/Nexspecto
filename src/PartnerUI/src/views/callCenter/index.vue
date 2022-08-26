<template>
<keep-alive>
  <div v-loading="busy" class="call-center-page">
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
          <template v-slot="scope">
            <el-tooltip :content="'Seç'" class="item" effect="light" placement="top-start">
              <el-button class="icon-button" @click="selectResponsibility(scope.row)"><svg-icon icon-class="sale"/></el-button>
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
                v-loading="busy"
                v-uppercase
                v-model="searchQueryParty"
                :placeholder="'Müşteri No, Müşteri Adı, TCKN, Telefon'"
                prefix-icon="el-icon-search"
                style="width:350px; margin-bottom: 10px;"
                clearable
                @keyup.enter.native="handleCurrentChangeReference(1)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="action" style="margin-bottom: 10px;" @click="handleCurrentChangeReference(1)">{{ 'Ara' }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table ref="tableReference" :data="referenceTableData">
        <el-table-column :label="$t('crm.partyRoles.partyId')" prop="partyId"/>
        <el-table-column :label="$t('crm.partyRoles.partyName')" prop="partyName"/>
        <el-table-column :label="'İşlemler'">
          <template v-slot="scope">
            <el-tooltip :content="'Seç'" class="item" effect="light" placement="top-start">
              <el-button class="icon-button" @click="selectReference(scope.row)"><svg-icon icon-class="sale"/></el-button>
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
          @size-change="handleSizeChangeReference"
          @current-change="handleCurrentChangeReference"/>
      </el-col>
      <p/>
    </el-dialog>
    <el-dialog v-model="showCallHistoryDialog">
      <CallHistory v-if="showCallHistoryDialog" :phone-number="model.customerInfo.phoneNumber" :party-id="model.customerInfo.partyId"/>
    </el-dialog>
    <el-dialog v-model="dialogSmsOtp">
      <otp-input
        v-if="dialogSmsOtp"
        :first-name="model.customerInfo.firstName"
        :last-name="model.customerInfo.lastName"
        :phone-number="model.otpPhoneNumber"
        :title="'Telefonla Doğrulama Kodu'"
        :sms-type="'SmsOtp'"
        :place-holders="placeHolders"
        @onOtpValidated="validateOtp"
        @dialogClosed="otpDialogClosed"/>
    </el-dialog>
    <el-form ref="callCenterForm" :label-position="labelPosition" :model="searchModel" :rules="rules" class="call-center-form-area" @submit.prevent="searchCallCenter(searchModel.customerInfo.phoneNumber)">
      <el-row type="filter">
        <div class="el-form el-form--medium el-form--inline" @keyup.enter="searchCallCenter(searchModel.customerInfo.phoneNumber)">
          <el-form-item prop="customerInfo.phoneNumber" v-if="searchModel.customerInfo == null && searchModel.customerForm != null" label-width="138px" label="Telefon ile Arama" style="width:77%;"> 
            <el-input 
              class="simpleInput" 
              v-model="searchModel.customerForm.phoneNumber" 
              v-maska="'5## ### ## ##'"
              placeholder="Lütfen ara yapmak istediğiniz telefon numarasını giriniz.">
              <template #append>
                <el-button :disabled="!enableSearchButton" class="input-append-button" @click="searchCallCenter(searchModel.customerInfo.phoneNumber)">
                  <i class="fa-solid fa-magnifying-glass" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="customerInfo.phoneNumber" v-else-if="searchModel.customerInfo == null && searchModel.customerForm == null" label-width="138px" label="Telefon ile Arama" style="width:77%;"> 
            <el-input 
              class="simpleInput"
              v-model="searchModel.customerInfo.phoneNumber" 
              v-maska="'5## ### ## ##'"
              placeholder="Lütfen ara yapmak istediğiniz telefon numarasını giriniz.">
              <template #append>
                <el-button :disabled="!enableSearchButton" class="input-append-button" @click="searchCallCenter(searchModel.customerInfo.phoneNumber)">
                  <i class="fa-solid fa-magnifying-glass" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="customerInfo.phoneNumber" v-else label-width="138px" label="Telefon ile Arama" style="width:77%;"> 
            <el-input 
              class="simpleInput"
              v-model="searchModel.customerInfo.phoneNumber"
              v-maska="'5## ### ## ##'"
              placeholder="Lütfen ara yapmak istediğiniz telefon numarasını giriniz."
              @change="setNumber(searchModel.customerInfo.phoneNumber)">
              <template #append>
                <el-button :disabled="!enableSearchButton" class="input-append-button" @click="searchCallCenter(searchModel.customerInfo.phoneNumber)">
                  <i class="fa-solid fa-magnifying-glass" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <span v-if="validationErrors.phoneNumber != null" class="simpleLabel">{{ validationErrors.phoneNumber }}</span>
          <el-button type="primary" style="float:right;" @click="endCallCenter()"><i class="fa-solid fa-arrows-rotate margin-right-10"></i>Çağrı Sonlandır7</el-button>
        </div>
      </el-row>
      <table class="el-table call-center-table">
        <thead>
          <tr>
            <th>TCKN</th>
            <th>Müşteri No</th>
            <th>Telefon No</th>
            <th>Tasarruf Sahibi</th>
            <th>İl</th>
            <th>İlçe</th>
            <th>Şube</th>
            <th>Portföy Sahibi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ searchModel.customerInfo != null ? searchModel.customerInfo.identificaitonNumber : '' }}</td>
            <td>{{ searchModel.customerInfo != null ? searchModel.customerInfo.partyId : '' }}</td>
            <td>{{ searchModel.customerInfo != null ? searchModel.customerInfo.phoneNumber : searchModel.customerForm.phoneNumber }}</td>
            <td>{{ searchModel.customerInfo != null ? searchModel.customerInfo.partyName : '' }}</td>
            <td>{{ searchModel.customerInfo != null ? (searchModel.customerInfo.city != null ? searchModel.customerInfo.city.label : '') : '' }}</td>
            <td>{{ searchModel.customerInfo != null ? (searchModel.customerInfo.district != null ? searchModel.customerInfo.district.label : '') : '' }}</td>
            <td>{{ currentBranchName }}</td>
            <td>{{ searchModel.branchInfo != null ? searchModel.branchInfo.portfolioOwner : '' }}</td>
            <td><el-button type="action" class="table-button" plain @click="applyModel()" :disabled="canApplyModel">İlişkilendir</el-button></td>
          </tr>
        </tbody>
        <!-- <tbody v-else class="empty-data">
          <td colspan="9">Henüz bilgi yok. Telefon ile data araması gerçekleştikten sonra ilgili bilgiler gelecektir.</td>
        </tbody> -->
      </table>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template #title>
              <el-row type="table-header">
                <div>
                  <p>Form Bilgisi Giriş Alanı</p>
                  <p>Yukarıdaki alanda yer alan ilgili tasarruf sahibini ilişkilendirdikten sonra bu alanda bulunan bilgiler otomatik olarak dolacaktır.</p>
                </div>
              </el-row>
            </template>
            <div v-if="showFormArea" class="association-form">
              <el-row>
                <el-col :span="12" class="left-side">
                  <el-form-item v-if="model.customerInfo.phoneNumber != null" label="Telefon" type="frame">
                    <el-form-item label="Telefon No">
                      <el-input v-model="model.customerInfo.phoneNumber" :disabled="disableOptions.phoneNumber">
                        <template #append>
                          <el-button v-if="showChangePhoneNumber" class="input-append-button custom-append-button" @click="showOtpButton()">
                            Düzenle <i class="fa-solid fa-pen-to-square margin-left-5"></i>
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item v-if="showChangePhoneNumber" :disabled="!otpButton" class="long_label" label="Düzenlenen Telefon No" prop="otpPhoneNumber">
                      <el-input v-model="model.otpPhoneNumber">
                        <template #append>
                          <el-button class="input-append-button custom-append-button" @click="showOtpDialog()">
                            Doğrula <i class="fa-solid fa-comment-dots margin-left-5" />
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-form-item>
                  <el-form-item v-else label="Telefon" type="frame">
                    <el-form-item label="Telefon No">
                      <el-input v-model="searchModel.customerInfo.phoneNumber" :disabled="disableOptions.phoneNumber">
                        <template #append>
                          <el-button v-if="showChangePhoneNumber" class="input-append-button custom-append-button" @click="showOtpButton()">
                            Düzenle <i class="fa-solid fa-pen-to-square margin-left-5"></i>
                            <i class="fa-solid fa-pen-to-square"></i>
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item v-if="showChangePhoneNumber" :disabled="!otpButton" class="long_label" label="Düzenlenen Telefon No" prop="otpPhoneNumber">
                      <el-input v-model="model.otpPhoneNumber">
                        <template #append>
                          <el-button class="input-append-button custom-append-button" @click="showOtpDialog()">
                            Doğrula <i class="fa-solid fa-comment-dots margin-left-5" />
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-form-item>
                  <el-form-item label="Şube">
                    <el-input v-if="model.branchInfo.branchName != null && model.portfolioInfo.internalOrganizationPartyId != null" v-model="model.branchInfo.branchName" disabled></el-input>
                    <el-input v-model="notFoundBranch" v-else :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="Adı" prop="customerInfo.firstName">
                    <el-input v-model="model.customerInfo.firstName" :disabled="disableOptions.firstName" @input="model.customerInfo.firstName = model.customerInfo.firstName.toLocaleUpperCase('tr-TR')"></el-input>
                  </el-form-item>
                  <span v-if="validationErrors.firstName != null" class="simpleLabel">{{ validationErrors.firstName }}<br></span>
                  <el-form-item label="Soy Adı" prop="customerInfo.lastName">
                    <el-input v-model="model.customerInfo.lastName" :disabled="disableOptions.lastName" @input="model.customerInfo.lastName = model.customerInfo.lastName.toLocaleUpperCase('tr-TR')"></el-input>
                  </el-form-item>
                    <span v-if="validationErrors.lastName != null" class="simpleLabel">{{ validationErrors.lastName }}<br></span>
                    <el-form-item label="İl" prop="customerInfo.city">
                        <el-select
                          v-model="model.customerInfo.city.value"
                          clearable
                          filterable
                          @change="getDistrictsForChangeCity()"
                          :disabled="disableOptions.city">
                          <el-option
                            v-for="item in provinceList"
                            :key="item.geoId"
                            :label="item.geoName"
                            :value="item.geoId"/>
                        </el-select>
                      </el-form-item>
                    <span v-if="validationErrors.city != null" class="simpleLabel">{{ validationErrors.city }}<br></span>
                     <el-form-item v-if="model.customerInfo.city.value != null" label="İlçe" prop="customerInfo.district">
                        <el-select
                          v-model="model.customerInfo.district.value"
                          filterable
                          clearable
                          @change="findBranchesByIds()"
                          :disabled="disableOptions.district">
                          <el-option
                            v-for="item in districtList"
                            :key="item.geoId"
                            :label="item.geoName"
                            :value="item.geoId"
                          />
                        </el-select>
                      </el-form-item>
                    <span v-if="validationErrors.district != null" class="simpleLabel">{{ validationErrors.district }}<br></span>
                    <el-form-item label="Email" prop="email">
                    <el-input v-model="model.email" :disabled="disableOptions.email">
                      <template #append>
                        <el-tooltip content="Yeniden Doğrulama Maili Gönder">
                          <el-button class="input-append-button custom-append-button" :disabled="disableOptions.reSendEmailButton" @click="resendVerificationEmail()" v-loading="emailLoading">Aktive Et <i class="fa-solid fa-paper-plane margin-left-10"></i></el-button>
                        </el-tooltip>
                      </template>
                    </el-input>
                  </el-form-item>
                    <span v-if="validationErrors.email != null" class="simpleLabel">{{ validationErrors.email }}<br></span>
                    <el-form-item label="Meslek" prop="customerInfo.occupation">
                        <el-select
                          v-model="model.classificationInfo.occupation"
                          filterable
                          clearable
                          :disabled="disableOptions.occupation"
                          >
                          <el-option
                            v-for="item in occupationList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Cinsiyet" prop="customerInfo.gender">
                        <el-select
                          v-model="model.classificationInfo.gender"
                          placeholder="Cinsiyet"
                          clearable
                          :disabled="disableOptions.gender">
                          <el-option
                            v-for="item in genderList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                      </el-form-item>
                </el-col>
                <el-col :span="12" class="right-side">
                  <el-form-item v-if="model.customerInfo.phoneNumber != null" label="Finans Türü" type="frame">
                    <el-form-item label="Finans Türü">
                      <el-select
                        v-model="model.classificationInfo.financeType"
                        clearable
                        :disabled="disableOptions.financeType"
                        :key="renderFinanceType"
                        >
                        <el-option
                          v-for="item in financeTypes"
                          :disabled="item.children[0].label ? true : false"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label"/>
                      </el-select>
                    </el-form-item>
                    <span v-if="validationErrors.financeType != null" class="simpleLabel">{{ validationErrors.financeType }}<br></span>
                    <el-form-item :disabled="model.classificationInfo.financeType !== 'Otomobil'" label="İhtiyaç Türü">
                      <el-select
                        v-model="model.classificationInfo.needType"
                        filterable
                        clearable>
                        <el-option
                          v-for="item in needTypes"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label"/>
                      </el-select>
                    </el-form-item>
                  </el-form-item>
                <el-form-item label="Veri Tipi">
                    <el-input v-if="isIncomingCall" :disabled="true" placeholder="Form Verisi"></el-input>
                    <el-input v-else :disabled="true" placeholder="Yok"></el-input>
                </el-form-item>
                <el-form-item label="Durum" prop="stage">
                  <el-select v-model="model.stage" @change="stageChange" :disabled="disableOptions.status">
                   <el-option
                      v-for="item in filteredCallCenterStageList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!isIncomingCall" label="Kaynak" type="frame">
                    <el-form-item label="Kaynak">
                      <el-select
                        v-model="model.campaignInfo.sourceName"
                        clearable
                        filterable
                        placeholder="Kaynak"
                        :disabled="disableOptions.source"
                        id="source"
                        @change="getReferenceOptions(model.campaignInfo.sourceName), checkRole()"
                        >
                          <el-option
                            v-for="item in sourceOptions"
                            :id="'source'+item.value"
                            :key="item.value"
                            :label="item.text"
                            :value="{value: item.value, text: item.text}"
                          />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Alt Kaynak">
                      <el-select
                        v-model="model.campaignInfo.referenceName"
                        clearable
                        filterable
                        :disabled="disableOptions.source || referenceDisable"
                        :change="getCorporateCampaignOptions(0, model.campaignInfo.referenceName)"
                        :placeholder="referencePlanceHolder"
                        id="sub-source"
                        >
                          <el-option
                            v-for="item in referenceOptions"
                            :id="'sub-source'+item.value"
                            :key="item.value"
                            :label="item.text"
                            :value="{value: item.value, text: item.text}"
                          />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Kampanya" v-if="!showCorporateCampaign">
                      <el-select
                        v-model="model.campaignInfo.campaignName"
                        clearable
                        filterable
                        placeholder = "Kampanya"
                        :disabled="disableOptions.source"
                        :change="setCampaignId(model.campaignInfo.campaignName)"
                        id="campaign"
                        >
                        <el-option
                          v-for="item in campaignOptions"
                          :id="'campaign'+item.value"
                          :key="item.value"
                          :label="item.text"
                          :value="{value: item.value, text: item.text}"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Kurumsal Kampanya" v-else>
                      <el-select
                        v-model="model.campaignInfo.campaignName"
                        clearable
                        filterable
                        :disabled="disableOptions.source"
                        :change="setCampaignId(model.campaignInfo.campaignName)"
                        id="corporate-campaign"
                        >
                        <el-option
                          v-for="item in corporateCampaignOptions"
                          :id="'corporate-campaign'+item.value"
                          :key="item.value"
                          :label="item.text"
                          :value="{value: item.value, text: item.text}"
                        />
                      </el-select>
                    </el-form-item>
                </el-form-item>
                <!-- <el-form-item v-if="!isIncomingCall" label="Kaynak" prop="campaignInfo">
                  <el-button @click="selectSource()" :disabled="disableOptions.source"> {{ 'Kaynak' }} </el-button>
                </el-form-item>
                <span v-if="!isIncomingCall && model.campaignInfo.sourceId != null" :span="12">
                    Kaynak : {{ model.campaignInfo.sourceName }} <br>
                    Alt Kaynak : {{ model.campaignInfo.referenceName }} <br>
                    Kampanya : {{ model.campaignInfo.campaignName }}
                </span> -->
                  <el-form-item v-if="isIncomingCall" label="Kaynak">
                    <el-input v-model="model.campaignInfo.sourceName" disabled/>
                  </el-form-item>
                  <el-form-item v-if="isIncomingCall" label="Alt Kaynak">
                    <el-input v-model="model.campaignInfo.referenceName" disabled/>
                  </el-form-item>
                <el-form-item label="Gizlilik Ayarları" type="frame">
                  <el-form-item label="Reklam İzni" prop="adsPermission" class="end-switch">
                    <el-switch
                      v-model="model.adsPermission"
                      :disabled="disableOptions.permissions"
                      active-color="#68c23a"
                      inactive-color="#dddddd"
                      @change="adsPermissionDisable"
                    />
                    <!-- <el-radio-group v-model="model.adsPermission" @change="adsPermissionDisable" :disabled="disableOptions.permissions">
                      <el-radio :label="true">Var</el-radio>
                      <el-radio :label="false">Yok</el-radio>
                    </el-radio-group> -->
                  </el-form-item>
                  <el-form-item label="Reklam Türü" prop="adsPermissionType">
                    <el-checkbox v-model="model.marketingPermissionInfo.smsMarketingPermission" :disabled="disableOptions.permissionsType" label="SMS"/>
                    <el-checkbox v-model="model.marketingPermissionInfo.emailMarketingPermission" :disabled="disableOptions.permissionsType" label="E-Mail"/>
                    <el-checkbox v-model="model.marketingPermissionInfo.phoneMarketingPermission" :disabled="disableOptions.permissionsType" label="Telefon"/>
                  </el-form-item>
                </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row type="table-footer">
              <el-col :span="16">
                <p>Lütfen gerekli işlemleri bitirdikten sonra <span style="font-weight: 500;color: #606266;"> “Kaydet” </span> butonuna basınız. Aşağıda ki aktiviteler tablosundaki bilgilerin gelmesi için <span style="font-weight: 500;color: #606266;"> "Finans Türü" </span> bölümünü seçtiğinizden emin olunuz.</p>
              </el-col>
              <el-button v-if="enableHistoryButton" @click="showCallHistory()">Çağrı Geçmişi</el-button>
              <el-button v-if="enableUpdateButton" type="action" class="table-button" plain @click="updateCallCenter()">Güncelle</el-button>
              <el-button v-if="enableSaveButton" :disabled="disableOptions.saveButton" type="action" @click="saveCallCenter()">Kaydet</el-button>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
    <div>
      <!-- partyId > 0 çünkü kayıt oluşturulmayan müşterilerin aktiviteleri olamaz. -->
      <customer-activities
        v-if="enableActivity && model.customerInfo.partyId > 0" 
        :key="renderKey"
        :customer-id="model.customerInfo.partyId"
        :finance-type="model.classificationInfo.financeType"
        :need-type="model.classificationInfo.needType"
        :organization-id="model.portfolioInfo.internalOrganizationPartyId"
        :is-c-w ="true"
        :have-customer-id="true"
        :show-button="true"
        :show-other-branch-activity="showOtherBranchActivity"
        @dialogClosed="closeActivityDialog"/>
    </div>
  </div>
</keep-alive>
</template>
<script>

import callCenterApi from '@/api/crm/callCenter'
import sourceSelector from '@/components/SourceSelector/index.vue'
import CustomerActivities from '@/components/CustomerActivities/CustomerActivities.vue'
import CallHistory from '@/components/CustomerActivities/CallCenterActivities'


import OtpInput from '@/components/Otp/index.vue'


import { validEmailFormat } from '@/utils/validate'

export default {
  name: 'CallCenter',
  components: { sourceSelector, CustomerActivities, CallHistory, OtpInput },
  data() {
    const validateAdsPermission = (rule, value, callback) => {
      if(this.model.adsPermission === true && !this.validatePermissionType()) {
        callback(new Error('Reklam Türü Seçiniz'))
      }
      callback()
    }
    const validateCity = (rule, value, callback) => {
      if(value === null){
        callback(new Error('şehir boş olamaz'))
      }
      callback()
    }
    const validateDistrict = (rule, value, callback) => {
      if(value === null){
        callback(new Error('ilçe boş olamaz'))
      }
      callback()
    }
    const valideteStageForRegisteredCustomer = (rule, value, callback) => {
      if(this.registeredCustomer) {
        if(this.model.stage === 1 || this.model.stage === 4)
        {
          callback(new Error('Kayıtlı Müşteri İçin: "Pasif" veya "Kayıt Oluşturuldu" Seçilemez.'))
        }
      }
      callback()
    }
    const validateEmail = (rule, value, callback) => {
    if(validEmailFormat(value) != true) {
      callback(new Error('Email Formatı Uygun Değil'))
    }
    else{
      if(this.searchModel.customerInfo != null && this.searchModel.customerInfo.partyId != null) {
        this.disableOptions.reSendEmailButton = false
      }
    }
    callback()
    }
    const validateFinanceType = (rule, value, callback) => {
      if(!this.validateNeedType()) {
        callback(new Error('İhtiyaç Türü Seç.'))
      }
      callback()
    }
    const validatePhoneNumber = (rule, value , callback ) => {
        if(value === "") {
          // callback(new Error(this.$t('crm.validations.phoneNumberCantNull')))
          callback(new Error('Numara Boş Olamaz.'))
        }
        // v-maska hepsini yapıyor.
        // var res = value.replace(/\D/g, "")
        // if(value.length != res.length) {
        //   callback(new Error('Sadece Rakam Giriniz.'))
        // }
        // if(value.length != 10) {
        //   callback(new Error('10 Haneli Giriniz.'))
        // }
        // if(!value.startsWith("5")) {
        //   callback(new Error('Numara "5" İle Başlamalıdır.'))
        // }
        callback()
    }
    return {
    busy: false,
    occupationList: [],
    customerCallCenterStageList: [],
    filteredCallCenterStageList: [],
    genderList: [],
    financeTypes: [],
    needTypes: [],
    advertisementPermissions: [],
    provinceList: [],
    districtList: [],
    CustomerCallCenterStage: {
      Passive: 1,
      CouldNotBeReached: 2,
      WaitingForProcess: 3,
      RecordCreated: 4,
      InformationGiven: 5
    },
      CallCenterActivityType: {
      PhoneCall: 1,
      Saved: 2,
      ProcessStarted: 3,
      EndPhoneCall: 4
    },
    selectedDistrict: null,
    searchModel: {
        customerInfo: {
          partyId: null,
          partyName: null,
          phoneNumber: null,
          identificationNumber: null,
          createActivityId : null,
          city: {
            label: null,
            value: null
          },
          district: {
            label: null,
            value: null
          },
          firstName: null,
          lastName: null,
          partyNote: null
        },
        portfolioInfo: {
          portfolioId: null,
          portfolioName: null,
          internalOrganizationPartyId: null,
          agentPartyId: null
        },
        branchInfo: {
          branchName: null,
          portfolioOwner: null
        },
        campaignInfo: {
          sourceId: null,
          referenceId: null,
          campaignId: null,
          corporateCampaignId: null,
          sourceName: null,
          referenceName: null,
          campaignName: null
        },
        marketingPermissionInfo: {
          smsMarketingPermission: false,
          phoneMarketingPermission: false,
          emailMarketingPermission: false
        },
        email: null,
        stage: 3,
        adsPermission: false,
        otpPhoneNumber: null,
        oldPhoneNumber: null,
        isPhoneNumberChengedWithOtp: false,
        classificationInfo: {
          UTMReference: null,
          UTMSource: null,
          UTMSite: null,
          gender: null,
          occupation: null,
          financeType: null,
          needType: null,
          advertisementPermission: null
        },
        agentActivity: {
          activityType: null,
          createActivityId: null,
          customerCallCenterId: 0,
          infoString: null,
          callId: null
        },
        customerForm: {
          customerCallCenterId : 0,
          phoneNumber : null,
          firstName : null,
          lastName : null,
          cityGeoId : null,
          districtGeoId : null,
          description : null,
          partySourceType : null,
          UTMSource : null,
          UTMSite : null,
          UTMCampaign : null,
          UTMReference : null,
          email : null,
          occupationClassificationId : null,
          genderClassificationId : null,
          referencePartyId : null,
          smsMarketingPermission : false,
          emailMarketingPermission : false,
          phoneMarketingPermission : false,
          PDPL : false,
          activityNote : null,
          partyNote : null,
          customerCallCenterStage: 3,
          stage: 3,
          partyApplicationStatusClassificationId : 0,
          partyApplicationStatusClassification : '',
          isOutbound : false,
          isBlacklist : false,
          customerId : null,
          customerPotentialId : 0,
          campaignInfo : null,
          financeType : null,
          needType : null
        }
    },
    model: {
        customerInfo: {
          partyId: null,
          partyName: null,
          phoneNumber: null,
          identificationNumber: null,
          createActivityId : null,
          city: {
            label: null,
            value: null
          },
          district: {
            label: null,
            value: null
          },
          firstName: null,
          lastName: null,
          partyNote: null
        },
        portfolioInfo: {
          portfolioId: null,
          portfolioName: null,
          internalOrganizationPartyId: null,
          agentPartyId: null
        },
        branchInfo: {
          branchName: null,
          portfolioOwner: null
        },
        campaignInfo: {
          sourceId: null,
          referenceId: null,
          campaignId: null,
          corporateCampaignId: null,
          sourceName: null,
          referenceName: null,
          campaignName: null
        },
        marketingPermissionInfo: {
          smsMarketingPermission: false,
          phoneMarketingPermission: false,
          emailMarketingPermission: false
        },
        email: null,
        stage: 3,
        adsPermission: false,
        otpPhoneNumber: null,
        oldPhoneNumber: null,
        isPhoneNumberChengedWithOtp: false,
        classificationInfo: {
          UTMReference: null,
          UTMSource: null,
          UTMSite: null,
          gender: null,
          occupation: null,
          financeType: null,
          needType: null,
          advertisementPermission: null
        },
        agentActivity: {
          activityType: null,
          createActivityId: null,
          customerCallCenterId: 0,
          infoString: null,
          callId: null
        },
        customerForm: {
          customerCallCenterId : 0,
          phoneNumber : null,
          firstName : null,
          lastName : null,
          cityGeoId : null,
          districtGeoId : null,
          description : null,
          partySourceType : null,
          UTMSource : null,
          UTMSite : null,
          UTMCampaign : null,
          UTMReference : null,
          email : null,
          occupationClassificationId : null,
          genderClassificationId : null,
          referencePartyId : null,
          smsMarketingPermission : false,
          emailMarketingPermission : false,
          phoneMarketingPermission : false,
          PDPL : false,
          activityNote : null,
          partyNote : null,
          customerCallCenterStage: 3,
          stage: 3,
          partyApplicationStatusClassificationId : 0,
          partyApplicationStatusClassification : null,
          isOutbound : false,
          isBlacklist : false,
          customerId : null,
          customerPotentialId : 0,
          campaignInfo : null,
          financeType : null,
          needType : null
        }
    },
    isIncomingCall: false,
    dialogSelectedRole: false,
    dialogFormVisible: false,
    dialogTableVisible: false,
    enableSaveButton: true,
    enableSearchButton: true,
    enableUpdateButton: false,
    enableHistoryButton: false,
    dialogSmsOtp: false,
    placeHolders: {},
    otpButton: false,
    showChangePhoneNumber: false,
    currentBranchName: null,
    newCustomer: false,
    searchedCallCenter: false,
    renderFinanceType: 0,
    hasActiveProject: false,
    phoneNumberFromRoute: null,
    callIdFromRoute: null,
    isInbound: false,
    disableOptions: {
      upperPhoneNumber: false,
      phoneNumber: true,
      firstName: false,
      lastName: false,
      city: false,
      district: false,
      note: false,
      source: false,
      status: false,
      financeType: false,
      needType: false,
      email: false,
      occupation: false,
      gender: false,
      permissions: false, //can be change ad permissions everytime
      permissionsType: false,
      saveButton: true,
      reSendEmailButton: true
    },
    canApplyModel: true,
    registeredCustomer: false,
    enableActivity: false,
    renderKey: 0,
    showOtherBranchActivity: false,
    placeHolders: {},
    showCallHistoryDialog: false,
    validationErrors: {
      phoneNumber: null,
      firstName: null,
      lastName: null,
      city: null,
      district: null,
      financeType: null,
      email: null
    },
    //reset modele eklenmedi
    sourceOptions: [],
    referenceOptions: [],
    campaignOptions: [],
    corporateCampaignOptions: [],
    partyTableData: [],
    referenceTableData: [],
    searchQueryParty: null,
    party: false,
    listQuery: {
        pageIndex: 1,
        limit: 5
    },
    count: 0,
    selectedResponsibility: 0,
    dialogSelectedRole: false,
    dialogSelectedParty: false,
    referencePlanceHolder: 'Alt Kaynak',
    referenceDisable: false,
    showCorporateCampaign: false,
    emailLoading: false,
    vttVtgRelation: 0,
    sourceName: null,
    sourceId: null,
    referenceName: null,
    referenceId: null,
    campaignId: null,
    campaignName: null,
    //reset modele eklenmedi
    rules: {
        'customerInfo.phoneNumber': [{ validator: validatePhoneNumber, trigger: 'change'}],
        'otpPhoneNumber': [{ validator: validatePhoneNumber, trigger: 'change'}],
        'email': [{ validator: validateEmail, trigger: 'change'}],
        // 'classificationInfo.financeType': [{ validator: validateFinanceType, trigger: 'change' || 'blur'}],
        'classificationInfo.needType': [{ validator: validateFinanceType, trigger: 'change' && 'blur' }],
        'stage': [{ validator: valideteStageForRegisteredCustomer, trigger: 'change' }],
        'adsPermissionType': [{ validator: validateAdsPermission, trigger: 'change' }],

        // 'customerInfo.phoneNumber': [{ required: true, message: 'Telefon Numarası Zorunlu', trigger: 'blur' }],
        // 'email': [{ required: true, message: 'Email Zorunlu', trigger: 'blur' }],
        // 'classificationInfo.financeType': [{ required: true, message: 'Finans Türü Zorunlu', trigger: 'blur' }],
        // 'stage': [{ required: true, message: 'Durum Zorunlu', trigger: 'blur' }],
        // 'adsPermission': [{ required: true, message: 'Reklam İzni Zorunlu', trigger: 'blur' }],
        // 'customerInfo.firstName': [{ required: true, message: 'İsim Zorunlu', trigger: 'blur' }],
        // 'customerInfo.lastName': [{ required: true, message: 'Soyisim Zorunlu', trigger: 'blur' }],
        'customerInfo.city': [{ validator: validateCity, trigger: 'change' && 'blur' }],
        'customerInfo.district': [{ validator: validateDistrict, trigger: 'change' && 'blur' }],
        // 'customerInfo.gender': [{ required: true, message: 'Cinsiyeet Zorunlu', trigger: 'blur' }],
        // 'customerInfo.occupation': [{ required: true, message: 'Meslek Zorunlu', trigger: 'blur' }],
        // 'customerForm.partyNote': [{ required: true, message: 'Açıklama Zorunlu', trigger: 'blur' }],
      },
      activeNames: ["1"],
      showFormArea: false,
      labelPosition: 'left',
      notFoundBranch: 'Şube Bilgisi Yok'
    }
  },
  created() {
    this.model = this.searchModel
    this.getLookupValues()
    this.getProvinces()
    this.getSourceOptions()
    this.model.stage = this.CustomerCallCenterStage.WaitingForProcess
    if(this.$route.query.phoneNumber != undefined && this.$route.query.callId != undefined && Object.keys(this.$route.query).length === 2){
      this.phoneNumberFromRoute = this.$route.query.phoneNumber
      this.callIdFromRoute = this.$route.query.callId
      this.isInbound = true
      this.searchCallCenter(this.phoneNumberFromRoute, this.callIdFromRoute, this.isInbound)
      this.$notify.warning('Gelen Arama.')
    }
    else if((this.$route.query.phoneNumber === undefined || this.$route.query.callId === undefined) && Object.keys(this.$route.query).length != 2 && Object.keys(this.$route.query).length != 0) {
      this.$notify.error('Gelen Arama Parametreleri Hatalı.')
    }
  },
  methods: {
    showOtpButton(){
      this.otpButton = true
    },
    showOtpDialog(){
      this.phoneNumberIsExist(this.model.otpPhoneNumber)
    },
    phoneNumberIsExist(otpPhoneNumber){
      this.busy  = true
      callCenterApi.isPhoneNumberExist(otpPhoneNumber).then((data) => {
        if(data.data){
          this.$notify.error('Telefon numarası başka bir kullanıcıda birincil numara olarak kayıtlı.')
          return
        }
        else {
          this.$notify.success('Otp gönderdildi.')
          this.placeHolders['fullName'] = `${this.model.customerInfo.firstName} ${this.model.customerInfo.lastName}`
          this.dialogSmsOtp = true
          return
        }
      }).catch((err) => {
          this.$notify.error(this.$t('notify.error') + err)
          return
      }).finally(() => {
        this.busy = false
      })
    },
    otpDialogClosed() {
      this.dialogSmsOtp = false
    },
    validateOtp(value){
      this.oldPhoneNumber = this.searchModel.customerForm.phoneNumber
      this.model.customerInfo.phoneNumber = this.model.otpPhoneNumber
      this.searchModel.customerForm.phoneNumber = this.model.otpPhoneNumber
      this.$notify.success('Telefon numarası değiştirilmiştir.')
      this.isPhoneNumberChengedWithOtp = true
    },
    validatePermissionType(){
      if(this.model.marketingPermissionInfo.emailMarketingPermission === false && this.model.marketingPermissionInfo.phoneMarketingPermission === false && this.model.marketingPermissionInfo.smsMarketingPermission === false) {
        return false
      }
      return true
    },
    validateNeedType(){
      this.renderFinanceType++
      if(this.model.classificationInfo.financeType === 'Otomobil') {
        if(!(this.model.classificationInfo.needType === 'ARABA' || this.model.classificationInfo.needType === 'MOTOSİKLET'))  {
          return false
        }
      }
      return true

    },
    checkFinanceType(){
      if(this.model.classificationInfo.financeType === null){
          this.$notify.error('Finans Türü Seçiniz.')
          return false
      }
      if(this.model.classificationInfo.financeType === 'Otomobil') {
        if(!(this.model.classificationInfo.needType === 'ARABA' || this.model.classificationInfo.needType === 'MOTOSİKLET'))  {
          this.$notify.error('İhtiyaç Türü Seçiniz.')
          return false
        }
      }
      return true
    },
    checkHasActiveProject(){
      this.busy = true
      callCenterApi.checkHasActiveProject(this.searchModel.customerInfo.partyId).then((data) => {
        this.hasActiveProject = data.data
      }).catch((err) => {
          this.$notify.error(this.$t('notify.error') + err)
      }).finally(() => {
        this.busy = false
      })
    },
    itIsRegisteredCustomer(){
        this.checkHasActiveProject()
        this.disableOptions.saveButton = false
        this.disableOptions.firstName = true
        this.disableOptions.lastName = true
        this.disableOptions.status= false
        this.disableOptions.city = false
        this.disableOptions.district = false
        this.showChangePhoneNumber = false
        this.disableOptions.permissions = false
        this.disableOptions.financeType = false
        if(this.model.classificationInfo.financeType === null) {
          this.disableOptions.financeType = false
          this.disableOptions.needType = false
        }
        if(this.model.classificationInfo.financeType === 'Otomobil') {
          if(this.model.classificationInfo.needType === null || this.model.classificationInfo.needType === '')
          {
            this.disableOptions.needType = false
          }
        }
        this.disableOptions.email = true
        if(this.searchModel.email === null || this.searchModel.email === ''){
          this.disableOptions.email = false
        }
        if(!this.hasActiveProject) {
          this.disableOptions.firstName = false
          this.disableOptions.lastName = false
          this.disableOptions.email = false
        }
        this.disableOptions.saveButton = true
        

    },
    itIsCustomerPotential(){
        this.disableOptions.phoneNumber = true
        this.disableOptions.firstName = false
        this.disableOptions.lastName = false
        this.disableOptions.city = false
        this.disableOptions.district = false
        this.disableOptions.note = false
        this.disableOptions.source = true
        this.disableOptions.status = false
        this.disableOptions.financeType = false
        if(this.model.classificationInfo.financeType === null) {
          this.disableOptions.financeType = false
          this.disableOptions.needType = false
        }
        if(this.model.classificationInfo.financeType === 'Otomobil') {
          this.disableOptions.needType = false
        }
        this.disableOptions.email = false
        this.disableOptions.occupation = false
        this.disableOptions.gender = false
        this.disableOptions.permissions = false
        this.disableOptions.saveButton = false
        this.showChangePhoneNumber = true
    },
    itIsNoRegisteredCustomer(){
        this.disableOptions.phoneNumber = true
        this.disableOptions.firstName = false
        this.disableOptions.lastName = false
        this.disableOptions.city = false
        this.disableOptions.district = false
        this.disableOptions.note = false
        this.disableOptions.source = false
        this.disableOptions.status = false
        this.disableOptions.financeType = false
        this.disableOptions.needType = false
        this.disableOptions.email = false
        this.disableOptions.occupation = false
        this.disableOptions.gender = false
        this.disableOptions.permissions = false
        this.disableOptions.saveButton = false
        this.showChangePhoneNumber = false
    },
    endCallCenter(){
      if(!this.searchedCallCenter) {
          this.$notify.error('Önce arama yapınız!')
          return
      }
      this.busy = true
      const phoneNumber = this.searchModel.customerInfo != null ? this.searchModel.customerInfo.phoneNumber : this.model.customerInfo.phoneNumber
      callCenterApi.createActivityLog(this.CallCenterActivityType.EndPhoneCall, phoneNumber, (this.model.agentActivity.customerCallCenterId === null ? 0 : this.model.agentActivity.customerCallCenterId), this.model.agentActivity.callId)
        .then(() => {
          this.$notify.success(this.$t('notify.success'))
        })
        .catch((err) => {
          this.$notify.error(this.$t('notify.error') + err)
        })
        .finally(() => {
          this.busy = false
          this.enableSearchButton = true
          this.resetModel()
          this.$router.push("/callCenter")
        })
    },
    saveCall(data){
      this.busy = true
      this.model.customerInfo.partyId = data.data.customerId
      // this.searchModel.customerInfo.partyId = data.data.customerId
      // console.log(this.model.customerInfo.partyId, this.searchModel.customerInfo.partyId,'bakalım noluyo')
      this.busy = false
    },
    setSearchModel(){
      if(this.searchModel.customerInfo.city == null) {
        this.searchModel.customerInfo.city = { label: null, value: null }
        this.searchModel.customerInfo.district = { label: null, value: null }
      }
      if(this.model.customerForm != null) {
        this.model.customerForm.customerCallCenterStage = this.model.stage != null ? this.model.stage : this.CustomerCallCenterStage.WaitingForProcess
        this.model.customerForm.stage = this.model.stage = this.model.stage != null ? this.model.stage : this.CustomerCallCenterStage.WaitingForProcess
      }
    },
    searchCallCenter(phoneNumber, callId = null, isInbound = false) {
      if(callId === null)
      {      
        var formEl = this.$refs['callCenterForm']
        formEl.validate((valid, fields) => {
          if (valid) {
            console.log('submit!')
          } else {
            console.log('error submit!', fields)
          }
        })
      }
    this.enableSearchButton = false
    this.disableOptions.upperPhoneNumber = true
    this.busy = true
      callCenterApi.searchCallCenter(phoneNumber, callId, isInbound)
      .then((data) => {
        if(data.data.customerInfo != null) {
          this.searchModel = data.data
          if(this.searchModel.branchInfo != null) {
          this.currentBranchName = this.searchModel.branchInfo.branchName
          }
          this.setSearchModel()
          this.model.agentActivity = data.data.agentActivity
          this.canApplyModel = false
          if(this.searchModel.customerInfo.partyId != null) {
            this.showFormArea = false
            if(this.model.customerForm == null){
              this.setModelFromCustomerForm(data.data)
            }
            this.itIsRegisteredCustomer()
          }
        }
        if(data.data.customerForm != null && data.data.customerInfo == null) {
          this.searchModel = data.data
          if(this.searchModel.branchInfo != null) {
            this.currentBranchName = this.searchModel.branchInfo.branchName
          }
          this.showFormArea = true
          this.setModelFromCustomerForm(data.data)
          this.canApplyModel = true
          this.itIsCustomerPotential()
          this.model.agentActivity = data.data.agentActivity 
          this.setIncomingCall()

        }
        if(data.data.customerForm == null && data.data.customerInfo == null) { 
          this.canApplyModel = true
          this.showFormArea = true
          this.itIsNoRegisteredCustomer()
          this.newCustomer = true
          this.model.agentActivity = data.data.agentActivity
          this.model.customerInfo.phoneNumber = this.searchModel.customerInfo.phoneNumber.split(' ').join('')
        }
        if(data.data.campaignInfo != null) {
          this.disableOptions.source = true
        }
        if(data.data.campaignInfo == null) {
          this.disableOptions.source = false
        }
        if(data.data.customerInfo != null) {
          this.disableOptions.reSendEmailButton = false
        }
        else {
          this.disableOptions.reSendEmailButton = true
        }
        this.setAdsPermissions()

      }).catch((err) => {
        console.log(err,'err')
        this.$notify.error(this.$t('notify.error') + err)
      }).finally(() => {
        this.busy = false
        this.searchedCallCenter = true
      })
    },
    setNumber(data){
      // i don't know why i need this
      this.model.customerInfo.phoneNumber = data
    },
    checkFluentValidation(err){
      if(err.data.title === "One or more validation errors occurred.") {
        if(err.data.errors['CustomerInfo.PhoneNumber'] != undefined) {
          this.validationErrors.phoneNumber = err.data.errors['CustomerInfo.PhoneNumber'][0]
          this.$notify.error(this.$t('notify.error') + ' ' +this.validationErrors.phoneNumber)
        }
        else if(err.data.errors['CustomerInfo.FirstName'] != undefined) {
          this.validationErrors.firstName = err.data.errors['CustomerInfo.FirstName'][0]
          this.$notify.error(this.$t('notify.error') + ' ' +this.validationErrors.firstName)

        }
        else if(err.data.errors['CustomerInfo.LastName'] != undefined) {
          this.validationErrors.lastName = err.data.errors['CustomerInfo.LastName'][0]
          this.$notify.error(this.$t('notify.error') + ' ' +this.validationErrors.lastName)

        }
        else if(err.data.errors['CustomerInfo.City'] != undefined) {
          this.validationErrors.city = err.data.errors['CustomerInfo.City'][0]
          this.$notify.error(this.$t('notify.error') + ' ' +this.validationErrors.city)

        }
        else if(err.data.errors['CustomerInfo.District'] != undefined) {
          this.validationErrors.district = err.data.errors['CustomerInfo.District'][0]
          this.$notify.error(this.$t('notify.error') + ' ' +this.validationErrors.district)

        }
        else if(err.data.errors['ClassificationInfo.FinanceType'] != undefined) {
          this.validationErrors.financeType = err.data.errors['ClassificationInfo.FinanceType'][0]
          this.$notify.error(this.$t('notify.error') + ' ' +this.validationErrors.financeType)

        }
        else if(err.data.errors['Email'] != undefined) {
          this.validationErrors.email = err.data.errors['Email'][0]
          this.$notify.error(this.$t('notify.error') + ' ' +this.validationErrors.email)

        }
        else {
          this.$notify.error(this.$t('notify.error') + err)
        }
      }
      else  {
          this.$notify.error(this.$t('notify.error') + err)

      }
    },
    checkCustomerStage(){
      if(this.model.customerInfo.partyId != null && this.model.customerInfo.partyId != '' && (this.model.stage === 1 || this.model.stage === 4)){
        this.$notify.error('Kayıtlı müşteri için kayıt oluşturuldu veya pasif seçilemez.')
        return false
      }
      return true
    },
    validateCityAndDistrictAndEmailPermission(){
      if(this.model.customerInfo.city.value == null || this.model.customerInfo.district.value == null){
          this.$notify.error('İl ilçe giriniz..')
          this.busy = false
          return false
      }
      if(this.model.marketingPermissionInfo.emailMarketingPermission && this.model.email == null){
          this.$notify.error('Hem email izni verip hem emaili boş bırakamazsınız..')
          this.busy = false
          return false
      }
      this.busy = false
      return true
    },
    reSetFinanceTypes(){
      this.model.classificationInfo.financeType = this.financeTypes.find(m => m.value === this.model.classificationInfo.financeType).label
      console.log(this.model.classificationInfo.financeType,'this.model.classificationInfo.financeType')

        if(this.model.classificationInfo.needType != null && this.model.classificationInfo.needType != ''){
          this.model.classificationInfo.needType = this.needTypes.find(m => m.value === this.model.classificationInfo.needType).label
        }
    },
    saveCallCenter(){
    this.busy = true
      this.$refs['callCenterForm'].validate((valid) => {
        if (valid) {
          console.log(valid,'valid?')
        } else {
          this.$notify.error('Girilen Bilgileri Kontrol Ediniz.')
          return
        }
      })
      this.busy = true
      if(!this.busy) {
        this.busy = true
      }
      if(!this.checkFinanceType()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}
      if(!this.validateCityAndDistrictAndEmailPermission()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}
      this.resetFluentValidations()
      if(!this.setModel()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}
      if(!this.checkCustomerStage()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}
      if(!this.busy) {
        this.busy = true
      }

      this.model.campaignInfo.sourceId = this.sourceId
      this.model.campaignInfo.sourceName = this.sourceName
      this.model.campaignInfo.referenceId = this.referenceId
      this.model.campaignInfo.referenceName = this.referenceName
      this.model.campaignInfo.campaignId = this.campaignId
      this.model.campaignInfo.campaignName = this.campaignName

      const inboundString = this.model.agentActivity.callId + ',' + this.isInbound

      callCenterApi.saveCallCenter(this.model, inboundString)
      .then((data) => {
        if(!this.busy) {
        this.busy = true
        }
        this.$notify.success(this.$t('notify.success'))
        this.saveCall(data)
        this.enableActivity = true
        this.enableUpdateButton = true
        this.newCustomer = false
      }).catch((err) => {
        if(!this.busy) {
        this.busy = true
        }
        this.checkFluentValidation(err)
      }).finally(() => {
        this.reSetFinanceTypes()
        this.busy = false
      })
    },
    updateCallCenter(){
    this.busy = true
      this.$refs['callCenterForm'].validate((valid) => {
        if (valid) {
          console.log(valid,'valid?')
        } else {
          this.$notify.error('Girilen Bilgileri Kontrol Ediniz.')
          return
        }
      })
      this.busy = true
      if(!this.busy) {
        this.busy = true
      }
      if(!this.checkFinanceType()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}

      if(!this.validateCityAndDistrictAndEmailPermission()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}
      this.resetFluentValidations()
      if(!this.setModel()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}
      if(!this.checkCustomerStage()) {
        this.busy = false 
        this.reSetFinanceTypes()
        return}

      if(!this.busy) {
        this.busy = true
      }

      const inboundString = this.model.agentActivity.callId + ',' + this.isInbound

      callCenterApi.updateCallCenter(this.model, inboundString)
      .then((data) => {
        if(!this.busy) {
        this.busy = true
        }
        this.$notify.success(this.$t('notify.success'))
        this.saveCall(data)
        this.enableActivity = true
      }).catch((err) => {
        if(!this.busy) {
        this.busy = true
        }
        this.$notify.error(this.$t('notify.error') + err)
        this.checkFluentValidation(err)
      }).finally(() => {
        this.reSetFinanceTypes()
        this.busy = false
      })
    },
    setModel(){
      if(this.model.stage === 3) {
        this.$notify.error('İşlem bekliyor seçilemez.')
        return false
      }
      if(this.model.classificationInfo.financeType == null || this.model.classificationInfo.financeType == '') {
        this.$notify.error('Finans Türü Seçiniz, Verileri Doldurunuz.')
        return false
      }
      if(this.model.classificationInfo.financeType == 'Otomobil' && (typeof this.model.classificationInfo.financeType) != "number") {
        this.model.classificationInfo.financeType = this.financeTypes.find(m => m.label === this.model.classificationInfo.financeType).value
        this.model.classificationInfo.needType = this.needTypes.find(m => m.label === this.model.classificationInfo.needType).value
      } else {
        if((typeof this.model.classificationInfo.financeType) != "number") {
        this.model.classificationInfo.financeType = this.financeTypes.find(m => m.label === this.model.classificationInfo.financeType).value
        this.model.classificationInfo.needType = null }
      }
      if(this.model.customerInfo.partyId === null || this.model.customerInfo.partyId === '') {
        this.model.customerInfo.partyId = 0
      }
      if(this.customerCallCenterStageList.find(m => m.label === this.model.stage) != null && (typeof this.customerCallCenterStageList.find(m => m.label === this.model.stage) != "number")){
        this.model.stage = this.customerCallCenterStageList.find(m => m.label === this.model.stage).value
      }
      if(this.model.customerForm === null){
        this.setDefaultCustomerForm()
      }
      return true
    },
    setDefaultCustomerForm(){
      let defaultStage = null
      if(this.model.stage != null && this.model.stage != 0) {
        defaultStage = this.model.stage
      }
      else {
        defaultStage = this.CustomerCallCenterStage.WaitingForProcess
      }
      this.model.customerForm = {
          customerCallCenterId : 0,
          phoneNumber : '',
          firstName : '',
          lastName : '',
          cityGeoId : null,
          districtGeoId : null,
          description : '',
          partySourceType : '',
          UTMSource : '',
          UTMSite : '',
          UTMCampaign : '',
          UTMReference : '',
          email : '',
          occupationClassificationId : null,
          genderClassificationId : null,
          referencePartyId : null,
          smsMarketingPermission : false,
          emailMarketingPermission : false,
          phoneMarketingPermission : false,
          PDPL : false,
          activityNote : '',
          partyNote : '',
          customerCallCenterStage: defaultStage,
          stage: defaultStage,
          partyApplicationStatusClassificationId : 0,
          partyApplicationStatusClassification : '',
          isOutbound : false,
          isBlacklist : false,
          customerId : null,
          customerPotentialId : 0,
          campaignInfo : null,
          financeType : '',
          needType : '',
        }
    },
    setPermissions(){
      if(this.model.marketingPermissionInfo.emailMarketingPermission || this.model.marketingPermissionInfo.smsMarketingPermission || this.model.marketingPermissionInfo.phoneMarketingPermission) {
        this.model.adsPermission = true
      } 
    },
    setModelFromCustomerForm(data){
      if(data.customerForm != null)  {
        this.model.customerForm = data.customerForm
        this.model.customerInfo.firstName = data.customerForm.firstName
        this.model.customerInfo.lastName = data.customerForm.lastName
        this.model.customerInfo.city.value = data.customerForm.cityGeoId
        if(this.model.customerInfo.city.value != null) {
          this.getDistricts()
          this.model.customerInfo.district.value = data.customerForm.districtGeoId
          this.findBranchesByIds()
        }
        this.model.campaignInfo.sourceName = data.customerForm.utmSource
        this.model.campaignInfo.referenceName = data.customerForm.utmSite
        this.model.agentActivity.customerCallCenterId = data.customerForm.customerCallCenterId
        this.model.agentActivity.customerPotentialId = data.customerForm.customerPotentialId
        this.model.email = data.customerForm.email
        this.model.marketingPermissionInfo.emailMarketingPermission = data.customerForm.emailMarketingPermission
        this.model.marketingPermissionInfo.phoneMarketingPermission = data.customerForm.phoneMarketingPermission
        this.model.marketingPermissionInfo.smsMarketingPermission = data.customerForm.smsMarketingPermission
        this.setPermissions()
        this.model.classificationInfo.financeType = data.customerForm.financeType != null ? data.customerForm.financeType : null
        this.model.classificationInfo.gender = data.customerForm.genderClassificationId != null ? data.customerForm.genderClassificationId : null
        this.model.classificationInfo.needType = data.customerForm.needType != null ? data.customerForm.needType : null
        this.model.classificationInfo.occupation = data.customerForm.occupationClassificationId != null ? data.customerForm.occupationClassificationId : null
        this.model.customerForm.partySourceType = ''
        this.model.customerForm.partySourceType = data.customerForm.partySourceType != null ? data.customerForm.partySourceType : null
        this.model.stage = data.customerForm.stage
      }
    },
    applyModel(){
      this.disableOptions.saveButton = false
      this.disableOptions.phoneNumber = true
      const data = this.searchModel
      this.model = data
      if(this.model.customerInfo.city != null && this.model.customerInfo.district != null) 
      {
        this.getDistricts()
        this.findBranchesByIds()
      }
      if(this.model.customerInfo.partyName != null && this.model.customerInfo.partyName != '')
      {
        this.model.customerInfo.firstName = data.customerInfo.partyName.substr(0, data.customerInfo.partyName.indexOf(' '))
        this.model.customerInfo.lastName = data.customerInfo.partyName.substr(data.customerInfo.partyName.indexOf(' ') + 1)
      }
      if(this.model.customerInfo.partyId != null) 
      {
        callCenterApi.getCustomerCallCenterStageById(this.model.customerInfo.partyId).then((v) => 
        {
          const stage = this.filteredCallCenterStageList.find(m => m.value === v.data)
          if (stage) 
          {
            this.model.stage = stage.label

          }
        })
      }
      if (this.model.classificationInfo.financeType != null) {
        const f = this.financeTypes.find(r => r.value === data.classificationInfo.financeType)
        if (f) {
          this.model.classificationInfo.financeType = f.label
        }
      }

      if (this.model.classificationInfo.needType != null) {
        const n = this.needTypes.find(r => r.value === data.classificationInfo.needType)
        if (n) {
          this.model.classificationInfo.needType = n.label
        }
      }
      if(this.model.classificationInfo.financeType != 'Otomobil') {
        // this.needTypes = []
        this.model.classificationInfo.needType = null
      }
      this.setPermissions()

      this.enableUpdateButton = true
      this.enableHistoryButton = true
      this.enableActivity = true
      this.showFormArea = true

    },
    resendVerificationEmail(){
      this.disableOptions.reSendEmailButton = true
      this.emailLoading = true
      const reSendEmailModel = {
        partyId: this.model.customerInfo.partyId,
        email: this.model.email
      }
      callCenterApi.resendVerificationEmail(reSendEmailModel).then(() => {
        this.$notify.success('Doğrulama e-postası gönderildi')
      }).catch((err) => {
        this.$notify.error(this.$t('notify.' + err))
        this.disableOptions.reSendEmailButton = false
      }).finally(() => {
        this.emailLoading = false
      })
    },
    getLookupValues(){
      this.busy = true
      callCenterApi.getLookupValues(1)
      .then((data) => {
        this.occupationList = data.data.occupations
        this.customerCallCenterStageList = this.filteredCallCenterStageList = data.data.customerStages
        this.model.stage = data.data.customerStages[3].value
        this.genderList = data.data.genders
        this.financeTypes = data.data.financeTypes
        this.needTypes = data.data.needTypes.filter(m => m.label === 'MOTOSİKLET' || m.label === 'ARABA')
        this.advertisementPermissions = data.data.advertisementPermissions
      })
      .catch((err) => {
        this.$notify.error(this.$t('notify.error') + err)
      })
      .finally(() => {
        this.busy = false
      })
    },
    getProvinces() {
      this.busy = true
      callCenterApi.getProvinceListByCountryId(1)
        .then((v) => {
          this.provinceList = v.data
        })
        .catch((err) => {
          this.$notify.error(this.$t('notify.error') + err)
        })
        .finally(() => {
          this.busy = false
        })
    },
    getDistrictsForChangeCity(){
      //İl değişti.
        this.model.customerInfo.district.value = null
        this.model.customerInfo.district.label = null
        this.model.branchInfo.branchName = null
        this.getDistricts()
    },
    getDistricts() {
      if(this.model.customerInfo.city.value == null || this.model.customerInfo.city.value == '')
      {
        this.model.customerInfo.district.value = null
        this.model.customerInfo.district.label = null
        this.model.branchInfo.branchName = null
        this.disableOptions.district = true
      }
      if(this.model.customerInfo.city.value != null && this.model.customerInfo.city.value != '')
      {
        this.busy = true
        this.disableOptions.district = false
        callCenterApi.getDistrictListByProvinceId(this.model.customerInfo.city.value)
        .then((v) => {
          this.districtList = v.data
          if (this.selectedDistrict != null) {
            this.searchModel.customerInfo.district.value = this.districtList.find(i => i.geoName === this.selectedDistrict).geoId
          }
        })
        .catch((err) => {
          this.$notify.error(this.$t('notify.error') + err)
        })
        .finally(() => {
          this.busy = false
        })
      }
    },
    findBranchesByIds() {
      this.busy = true
      if((this.model.customerInfo.city.value != null && this.model.customerInfo.city.value != '') && (this.model.customerInfo.district.value != null && this.model.customerInfo.district.value != ''))
      {
        callCenterApi.findBranchesByIds(this.model.customerInfo.city.value, this.model.customerInfo.district.value)
          .then((v) => {
            if(this.searchModel.branchInfo == null) {
              this.searchModel.branchInfo = {
                branchInfo :'',
                portfolioOwner: ''
              } 
            }
            if(this.searchModel.branchInfo.branchName != v.data.branchName) 
            {
              this.showOtherBranchActivity = true
              this.model.branchInfo.branchName = v.data.branchName
            }
            else
            {
              this.showOtherBranchActivity = false
              const searchModelBranch = this.searchModel.branchInfo.branchName
              this.model.branchInfo.branchName = searchModelBranch
            }
            this.searchModel.portfolioInfo != null ? this.searchModel.portfolioInfo.internalOrganizationPartyId = v.data.branchGuid : console.log('')
            this.model.portfolioInfo.internalOrganizationPartyId = v.data.branchGuid
            if(this.newCustomer){
              this.showOtherBranchActivity = false
            }
            if(!this.newCustomer && this.searchModel.branchInfo.branchName == null) {
              this.showOtherBranchActivity = true
            }
            if(this.renderKey === 0){
              this.showOtherBranchActivity = false
            }
            this.renderKey++
          })
          .catch((err) => {
            this.$notify.error(this.$t('notify.error') + err)
          })
          .finally(() => {
            this.busy = false
          })
      }
      else{
        this.$notify.error('Şube bilgisi için il ve ilçeyi doldurunuz.')
        this.busy = false
      }

    },
    adsPermissionDisable() {
      if (!this.model.adsPermission) {
        this.searchModel.marketingPermissionInfo.emailMarketingPermission = false
        this.searchModel.marketingPermissionInfo.phoneMarketingPermission = false
        this.searchModel.marketingPermissionInfo.smsMarketingPermission = false
        this.disableOptions.permissionsType = true
      }
      else {
        this.disableOptions.permissionsType = false
      }
    },
    setAdsPermissions(){
      if(this.searchModel.marketingPermissionInfo =! null)
      {
        if (this.searchModel.marketingPermissionInfo.smsMarketingPermission || this.searchModel.marketingPermissionInfo.emailMarketingPermission || this.searchModel.marketingPermissionInfo.phoneMarketingPermission) {
          this.model.adsPermission = true
          this.model.adsPermissionType = false
        }
        else {
          this.disableOptions.permissionsType = true
        }
      }

    },
    stageChange(val) {
      const stage = this.customerCallCenterStageList.find(p => p.value === val)
      if (stage) {
        this.model.stage = stage.value
      }
    },
    setIncomingCall(){
      this.searchModel.customerForm.partySourceType = 'incomingcall'
      this.model.customerForm.partySourceType = 'incomingcall'
      this.isIncomingCall = true
    },
    closeActivityDialog() {
      this.renderKey++
    },
    showCallHistory() {
      this.showCallHistoryDialog = true
    },
    getSourceOptions() {
      callCenterApi.getSourceOptions(false)
      .then((data) => {
        this.busy = true
        this.sourceOptions = data.data
      })
      .catch(() => {
        this.$notify.error(this.$t('notify.error'))
      })
      .finally(() => {
        this.busy = false
      })
    },
    getReferenceOptions(entity) {
      this.sourceId = entity.value
      this.sourceName = entity.text
      this.showCorporateCampaign= false
      this.model.campaignInfo.referenceName = null
      this.referenceDisable = false
      this.referencePlanceHolder = 'Alt Kaynak'
      const excludedSources = ['SAHA ETKİNLİKLERİ', 'KİŞİSEL', 'TMSF']
      if (excludedSources.includes(entity.text)) {
        callCenterApi.getReferanceOptions(entity.text)
          .then((v) => {
            this.referenceOptions = v.data
          })
          .catch((err) => {
            console.log(err, 'ere')
          })
      } else {
        this.referanceOptions = []
      } 
      this.getCampaignOptions(this.model.campaignInfo.sourceName.text, this.model.campaignInfo.sourceName.value)
    },
    checkRole(){
      if (this.model.campaignInfo.sourceName.text === 'KURUMSAL PORTFÖY') {
        this.dialogSelectedRole = true
      }
      this.partyTableData = []
      this.selectedResponsibility = 0
      this.vttVtgRelation = 0
      if (this.model.campaignInfo.sourceName.text === 'VTT' || this.model.campaignInfo.sourceName.text === 'VTG' || this.model.campaignInfo.sourceName.text === 'REFERANS') {
        this.vttVtgRelation = this.model.campaignInfo.sourceName.value
        this.dialogSelectedParty = true
      }

    },
    getCorporateCampaignOptions(partyId, entity = null){
      this.referenceId = entity != null ? entity.value : null
      this.referenceName = entity != null ? entity.text : null

      if (partyId > 0) {
        callCenterApi.getCorporateCampaignOptions(partyId)
          .then((v) => {
            this.corporateCampaignOptions = v.data
          })
          .catch(() => {
            this.$notify.error('Güncel Tarihe Uygun Kampanya Bulunamadı')
          })
      }
    },
    getCampaignOptions(source, id){

      this.model.campaignInfo.campaignName = null
      if (source === 'KURUMSAL PORTFÖY') {
        this.campaignOptions = []
      } else {
        callCenterApi.getCampaignOptions(id)
          .then((v) => {
            this.campaignOptions = []
            this.campaignOptions = v.data
          })
          .catch(() => {
            this.$notify.error('Güncel Tarihe Uygun Kampanya Bulunamadı')
            this.campaignOptions = []
          })
      }
    },
    selectResponsibility(row) {
      this.selectedResponsibility = row.partyId
      this.model.campaignInfo.referenceName = { text: '', value: 0 },
      this.model.campaignInfo.referenceName.value = row.partyId
      this.model.campaignInfo.referenceName.text = row.partyName
      this.referencePlanceHolder = row.partyName
      this.referenceDisable = true
      this.dialogSelectedRole = false
      this.showCorporateCampaign = true
      this.getCampaignOptions('REFERANS', 19191)
      this.getCorporateCampaignOptions(row.partyId)
      this.$notify.success(this.$t('notify.success'))
    },
    selectReference(row) {
      this.selectedResponsibility = row.partyId
      this.model.campaignInfo.referenceName = { text: '', value: 0 },
      this.model.campaignInfo.referenceName.value = row.partyId
      this.model.campaignInfo.referenceName.text = row.partyName
      this.referencePlanceHolder = row.partyName
      this.referenceDisable = true
      this.dialogSelectedParty = false
      this.$notify.success(this.$t('notify.success'))
    },
    getAllReferences(searchQueryParty) {
      this.searchQueryParty = searchQueryParty
      this.busy = true
      this.referenceTableData = []
      callCenterApi.getAllReferences(searchQueryParty, this.model.campaignInfo.sourceName.text, this.listQuery)
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
    setCampaignId(entity){
      this.campaignId = this.model.campaignInfo.campaignId = entity != null ? entity.value : null
      this.campaignName = this.model.campaignInfo.campaignId = entity != null ? entity.text : null
    },
    //muzo
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
    },
    resetCampaignSourceVariables(){
      this.sourceOptions= []
      this.referenceOptions= []
      this.campaignOptions= []
      this.corporateCampaignOptions= []
      this.partyTableData= []
      this.referenceTableData= []
      this.searchQueryParty= null
      this.party= false
      this.listQuery= {
          pageIndex: 1,
          limit: 5
      }
      this.count= 0
      this.selectedResponsibility= 0
      this.dialogSelectedRole= false
      this.dialogSelectedParty= false
      this.referencePlanceHolder= 'Alt Kaynak'
      this.referenceDisable= false
      this.showCorporateCampaign= false
      this.vttVtgRelation = 0
      this.sourceName= null
      this.sourceId= null
      this.referenceName= null
      this.referenceId= null
      this.campaignId= null
      this.campaignName= null
    },
    resetModel(){
    this.searchModel = {
        customerInfo: {
          partyId: null,
          partyName: null,
          phoneNumber: null,
          identificationNumber: null,
          createActivityId : null,
          city: {
            label: null,
            value: null
          },
          district: {
            label: null,
            value: null
          },
          firstName: null,
          lastName: null,
          partyNote: null
        },
        portfolioInfo: {
          portfolioId: null,
          portfolioName: null,
          internalOrganizationPartyId: null,
          agentPartyId: null
        },
        branchInfo: {
          branchName: null,
          portfolioOwner: null
        },
        campaignInfo: {
          sourceId: null,
          referenceId: null,
          campaignId: null,
          corporateCampaignId: null,
          sourceName: null,
          referenceName: null,
          campaignName: null
        },
        marketingPermissionInfo: {
          smsMarketingPermission: false,
          phoneMarketingPermission: false,
          emailMarketingPermission: false
        },
        email: null,
        stage: 3,
        adsPermission: false,
        otpPhoneNumber: null,
        oldPhoneNumber: null,
        isPhoneNumberChengedWithOtp: false,
        classificationInfo: {
          UTMReference: null,
          UTMSource: null,
          UTMSite: null,
          gender: null,
          occupation: null,
          financeType: null,
          needType: null,
          advertisementPermission: null
        },
        agentActivity: {
          activityType: null,
          createActivityId: null,
          customerCallCenterId: 0,
          infoString: null,
          callId: null
        },
        customerForm: {
          customerCallCenterId : 0,
          phoneNumber : null,
          firstName : null,
          lastName : null,
          cityGeoId : null,
          districtGeoId : null,
          description : null,
          partySourceType : null,
          UTMSource : null,
          UTMSite : null,
          UTMCampaign : null,
          UTMReference : null,
          email : null,
          occupationClassificationId : null,
          genderClassificationId : null,
          referencePartyId : null,
          smsMarketingPermission : false,
          emailMarketingPermission : false,
          phoneMarketingPermission : false,
          PDPL : false,
          activityNote : null,
          partyNote : null,
          customerCallCenterStage: 3,
          stage: 3,
          partyApplicationStatusClassificationId : 0,
          partyApplicationStatusClassification : null,
          isOutbound : false,
          isBlacklist : false,
          customerId : null,
          customerPotentialId : 0,
          campaignInfo : null,
          financeType : null,
          needType : null
        }
      }
       this.model = {
        customerInfo: {
          partyId: null,
          partyName: null,
          phoneNumber: null,
          identificationNumber: null,
          createActivityId : null,
          city: {
            label: null,
            value: null
          },
          district: {
            label: null,
            value: null
          },
          firstName: null,
          lastName: null,
          partyNote: null
        },
        portfolioInfo: {
          portfolioId: null,
          portfolioName: null,
          internalOrganizationPartyId: null,
          agentPartyId: null
        },
        branchInfo: {
          branchName: null,
          portfolioOwner: null
        },
        campaignInfo: {
          sourceId: null,
          referenceId: null,
          campaignId: null,
          corporateCampaignId: null,
          sourceName: null,
          referenceName: null,
          campaignName: null
        },
        marketingPermissionInfo: {
          smsMarketingPermission: false,
          phoneMarketingPermission: false,
          emailMarketingPermission: false
        },
        email: null,
        stage: 3,
        adsPermission: false,
        otpPhoneNumber: null,
        oldPhoneNumber: null,
        isPhoneNumberChengedWithOtp: false,
        classificationInfo: {
          UTMReference: null,
          UTMSource: null,
          UTMSite: null,
          gender: null,
          occupation: null,
          financeType: null,
          needType: null,
          advertisementPermission: null
        },
        agentActivity: {
          activityType: null,
          createActivityId: null,
          customerCallCenterId: 0,
          infoString: null,
          callId: null
        },
        customerForm: {
          customerCallCenterId : 0,
          phoneNumber : null,
          firstName : null,
          lastName : null,
          cityGeoId : null,
          districtGeoId : null,
          description : null,
          partySourceType : null,
          UTMSource : null,
          UTMSite : null,
          UTMCampaign : null,
          UTMReference : null,
          email : null,
          occupationClassificationId : null,
          genderClassificationId : null,
          referencePartyId : null,
          smsMarketingPermission : false,
          emailMarketingPermission : false,
          phoneMarketingPermission : false,
          PDPL : false,
          activityNote : null,
          partyNote : null,
          customerCallCenterStage: 3,
          stage: 3,
          partyApplicationStatusClassificationId : 0,
          partyApplicationStatusClassification : null,
          isOutbound : false,
          isBlacklist : false,
          customerId : null,
          customerPotentialId : 0,
          campaignInfo : null,
          financeType : null,
          needType : null
        }
    }
      this.selectedDistrict = null
      this.busy = false
      this.isIncomingCall = true
      this.dialogFormVisible = false
      this.dialogTableVisible = false
      this.enableSaveButton = true
      this.enableUpdateButton = false
      this.enableHistoryButton = false
      this.dialogSmsOtp = false
      this.placeHolders = {}
      this.otpButton = false
      this.showChangePhoneNumber = false
      this.disableOptions.phoneNumber = true
      this.disableOptions.firstName = false
      this.disableOptions.lastName = false
      this.disableOptions.city = false
      this.disableOptions.district = false
      this.disableOptions.note = false
      this.disableOptions.source = false
      this.disableOptions.status = false
      this.disableOptions.financeType = false
      this.disableOptions.needType = false
      this.disableOptions.email = false
      this.disableOptions.occupation = false
      this.disableOptions.gender = false
      this.disableOptions.permissions = false
      this.disableOptions.saveButton = true
      this.disableOptions.upperPhoneNumber = false
      this.canApplyModel = true
      this.registeredCustomer = false
      this.enableActivity = false
      this.renderKey = 0
      this.showOtherBranchActivity = false
      this.placeHolders = {}
      this.showCallHistoryDialog = false

      this.isIncomingCall = false
      this.currentBranchName = null

      this.newCustomer = false

      this.searchedCallCenter =  false

      this.hasActiveProject = false

      this.showFormArea = false

      this.resetFluentValidations()
      this.resetCampaignSourceVariables()
      this.getSourceOptions()
      this.$notify.success('Form Temizlendi.')
      if(this.busy){
        this.busy = false
      }

    },
    resetFluentValidations()
    {
      this.validationErrors.phoneNumber = null
      this.validationErrors.firstName = null
      this.validationErrors.lastName = null
      this.validationErrors.city = null
      this.validationErrors.district = null
      this.validationErrors.financeType = null
      this.validationErrors.email = null
    }
  },
};
</script>
<style lang="scss" scoped>
.simpleInput {
  width: 100%;
}
.simpleLabel {
  margin-left: 120px;
}
.call-center-table {
  border-radius: 12px;
  outline: 1px solid #ddd;
  margin: 20px 0;
  th, td {
    text-align: left;
    padding: 0 10px 0 15px;
    &:first-child {
      padding-left: 20px;
    }
  }
  th {
    border-top: none;
    height: 50px;
  }
  td {
    border-bottom: none;
    height: 40px;
  }
}
.activity-table {
  border-radius: 12px;
  outline: 1px solid #ddd;
  margin: 20px 0;
  th, td {
    text-align: left;
    padding: 0 10px 0 15px;
    &:first-child {
      padding-left: 20px;
    }
  }
  th {
    border-top: none;
    height: 50px;
  }
  td {
    border-bottom: none;
    height: 40px;
  }
}
::v-deep(.el-input-group__append) {
    left: 0 !important;
}
::v-deep(.el-collapse .el-collapse-item .el-collapse-item__content) {
    padding: 0 !important;
}
::v-deep(.el-checkbox) {
    border: 1px solid;
    border-radius: 12px;
    padding: 8px;
    margin-bottom: 12px;
    border-color: #dddddd;
}
::v-deep(.el-checkbox.is-checked) {
    border-color: #303133;
}
::v-deep(.el-checkbox.is-checked .el-checkbox__label) {
    color: #303133 !important;
}
::v-deep(.el-checkbox__input.is-checked) {
    color: #303133 !important;
}
::v-deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #303133 !important;
    border-color: #303133 !important;
}

::v-deep(.el-checkbox .el-checkbox__label) {
    color: #dddddd !important;
}
::v-deep(.el-checkbox__input) {
    color: #dddddd !important;
}
::v-deep(.el-checkbox__input .el-checkbox__inner) {
    background-color: #ffffff !important;
    border-color: #dddddd !important;
}
</style>
