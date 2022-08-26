<template>
  <div class="app-container productCard">
    <div v-loading="busy">
      <el-row type="flex" justify="space-between" align="middle">
        <div class="info">
          <div v-if="customer">
            <span :data-letters="firstLetters(customer)" style="white-space: nowrap;margin:0;" />
            <span class="customer-name">{{ customer.name }}&nbsp;<span>({{ model.methodType=='ordered'? 'STY' : 'SPY' }})</span></span>
          </div>
          <span class="branch-name">{{ model.branchName }}</span>
        </div>
        <div>
          <el-button type="action" @click="goCustomer">Müşteri Kartına Git&nbsp;<i class="el-icon-right el-icon-arrow-right"/></el-button>
        </div>
      </el-row>
    </div>
    <el-row v-if="model.productDelayInformation.length !== 0" style="margin-top:20px;">
      <el-col :span="24">
        <div class="product-delay">
          <span>
            <svg width="24" height="22" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
              <path d="M21.654 21.625c1.512 0 2.462-1.64 1.705-2.953L13.518 1.61c-.756-1.31-2.653-1.313-3.41 0L.265 18.672c-.756 1.31.19 2.953 1.705 2.953h19.683zm-8.846-7.219h-1.991a.492.492 0 0 1-.492-.465l-.304-5.578a.492.492 0 0 1 .492-.52h2.6c.282 0 .506.238.49.52L13.3 13.94a.492.492 0 0 1-.49.465zm-.996 4.512a1.887 1.887 0 1 1 0-3.773 1.887 1.887 0 0 1 0 3.773z" fill="#c94343" fill-rule="nonzero"/>
            </svg>
            &nbsp;&nbsp;
            <span style="font-weight:bold;color:#c94343;">UYARI:</span> Tasarruf Sahibinin <span v-for="item in model.productDelayInformation" :key="item.index" style="font-weight:bold;">{{ item.code + (model.productDelayInformation.length>1?', ':'') }}</span> numaralı {{ model.productDelayInformation.length>1?'projelerinde':'projesinde' }} <span style="font-weight:bold;color:#c94343;"><u>TAKSİT GECİKMESİ VARDIR!!!</u></span>
          </span>
        </div>
      </el-col>
    </el-row>
    <div v-loading="busy" :class="legalFollowUp ? 'watermark':''">
  
      <el-row class="progressbar" type="flex" align="middle" style="padding-left:20px;">
        <el-col :span="20" :style="deliveryNotDone===false?'':'padding-left:20px;'" style="box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);border: solid 1px #e5e5e5;background-color: #fff;height:30px;border-radius:100px;">
          <el-button class="total" circle style="float:right;z-index:20;">
            <span>vade</span>
            <br>
            {{ model.totalTerm + '. Ay' }}
          </el-button>
          <i v-if="deliveryNotDone===false" class="el-icon-check" style="float:left;z-index: 28;left: 10px;position: relative;color: #fff;top: 6px;font-weight: 700;"/>
          <el-button v-else circle style="float:left;left: -75px;z-index: 11;">
            <span v-html="progressText()"/>
          </el-button>
          <div style="position:relative;">
            <div :style="'width:' + ((model.currentTerm/model.totalTerm)*100) + '%'" :class="[displayNone(), deliveryControl()]" style="min-width:4%;height:30px;background-image: linear-gradient(to right, #d8d8d8, #b7b7b7);position:absolute;left:0px;border-radius:100px;max-width:100%;"> <!-- Taksitin olduğu kısım -->
              <span circle style="float:right;z-index:10;left: -7px;top: 7px;position: relative;color: #fff;font-size:12px;">{{ model.currentTerm + '. Ay' }}</span>
            </div>
            <div :style="'width:' + ((totalDelivery/model.totalTerm)*100) + '%'" :class="deliveryProgress()" style="height:30px;background:transparent;position:absolute;left:0px;border-radius: 100px;"> <!-- Teslimatın olduğu kısım -->
              <el-button class="delivery" circle style="float:right;z-index:10;">
                {{ 'teslimat' }}
                <br>
                <strong>{{ (totalDelivery) + '. Ay' }}</strong>
                <span class="finance-type-icon">
                  <svg-icon :icon-class="iconClass()" />
                </span>
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="3" align="right">
          <span v-if="activeNames.length>0" class="more">Daha Az</span>
          <span v-else class="less">Daha Fazla</span>
        </el-col>
      </el-row>
      <el-collapse v-model="activeNames" class="progressCollapse" style="position: relative;z-index: 0;top: -60px;margin-bottom: -30px; ">
        <el-collapse-item name="1">
          <el-form ref="productCard" :model="model" :rules="validation" label-position="left" label-width="200px" class="productInfo">
            <el-row style="margin-bottom: 30px;">
              <el-col :span="24">
                <redline-notice v-if="customer" :party-id="customer.customerId"/>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.campaignName')" prop="campaignName">
                  <span>{{ model.campaign }}</span>
                  <el-tag v-if="isGrowthSavings"> Büyüyen Tasarruf Revizyonu</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
               <el-col :span="11">
                  <el-form-item label="Finansman Türü">
                      <span>{{ model.financeType }}</span>
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row v-if="toggleFinanceType.value === 2" >
              <el-col :span="11">
                <p><br></p>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('product.ordered.financeDetailType')" >
                  <el-select
                    v-model="financeDetailType"
                    placeholder="Fin. Amacı"
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="(item, i) in financeDetailTypes"
                      :key=" i"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.workingCostAmount')">
                  <span>{{ $filters.formatTRY(model.financeCost) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item label="Tasarruf Planı Kayıt Evrakları">
                  <span>{{ model.productDocumentFollowStatus }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.productName')" prop="productName">
                  <span v-if="model.methodType=='ordered'" style="word-break: break-word;">{{ model.maturityTerm + ' Kişilik Tasarruf Programı' }}</span>
                  <span v-else style="word-break: break-word;">{{ model.productName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.financeAmount')" prop="financeAmount">
                  <span>{{ $filters.formatTRY(model.financeAmount) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.versionName')" prop="versionName">
                  <span>{{ model.versionName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.advancePayment')" prop="advancePayment">
                  <span>{{ $filters.formatTRY(model.adwancePayment)  }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="realDrawObject">
              <el-col :span="11">
                <el-form-item :label="$t('productCard.drawingDate')">
                  <span>{{ realDrawObject.drawingDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.drawCount')">
                  <span>{{ realDrawObject.order }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.package')" prop="package">
                  <span v-if="model.methodType=='ordered'">{{ model.package }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.workingCostAdvancePayment')" prop="workingCostAdvancePayment">
                  <span>{{ $filters.formatTRY( model.workingCostAdwancePayment) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="11">
                <el-form-item :label="$t('productCard.installmentAdvantage')" prop="installmentAdvantage">
                  <span>{{ model.installmentAdvantage }}</span>
                </el-form-item>
                &nbsp;
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item v-if="model.methodType=='ordered'" label="Hizmet Durumu" prop="deliveryStatus">
                  <div :class="drawingStatus(model.isReceivedService)" style="font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;letter-spacing: normal;">
                    <el-tag v-if="model.isReceivedService && model.isReceivedService === true" type="success">Hizmet Almıştır</el-tag>
                    <el-tag v-else>Hizmet Almamıştır</el-tag>
                  </div>
                  
                  <el-tag
                    v-for="(item,index) in model.drawDateList.filter(i => new Date(i.date)>= new Date (new Date().getYear(),new Date().getMonth())).slice(0,1)"
                    :key="index" >
                    {{ item.order + '. STB - ' + new Date(item.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }) }}
                  </el-tag>
                 
                </el-form-item>
                <el-form-item v-else-if="model.methodType==='freeplan'" label="Hizmet Durumu">
                  <div :class="drawingStatus(model.isReceivedService)" style="font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;letter-spacing: normal;">
                    <el-tag v-if="model.isReceivedService && model.isReceivedService === true" type="success">Hizmet Almıştır</el-tag>
                    <el-tag v-else>Hizmet Almamıştır</el-tag>
                  
                  </div>
                </el-form-item>

              </el-col>
            </el-row>
            <el-row >
              <el-col :span="11">
                <el-form-item :label="$t('productCard.projectNo')" prop="projectNumber">
                  <el-tag type="type3">{{ model.projectNumber }}</el-tag>
                </el-form-item>
                &nbsp;
              </el-col>
              <el-col v-if="model.cozumProductCode" :span="11">
                <el-form-item :label="$t('productCard.czmProjectNo')" prop="cozumProductCode">
                  <el-tag type="type9">{{ model.cozumProductCode }}</el-tag>
                </el-form-item>
                &nbsp;
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.deliveryStatus')" prop="deliveryStatus">
                  <el-tag :type="deliveryStatus(model.deliveryStatus)">{{ model.deliveryStatus }}</el-tag>
                  <el-tag v-if="actualOrPaymentDate" type="blue">
                    {{ $filters.parseTime(actualOrPaymentDate, '{dd}.{mm}.{yyyy}') }}
                  </el-tag>
                
                  <el-tag v-if="model.isProtocolDelivery" type="action" size="mini" plain>
                    {{ 'Protokollü Teslimat' }}
                  </el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item v-if="risk" label="Takip Durumu">
                  <div :class="risk.productRiskStatusTypeName==='legalfollowup'?'red-1':risk.productRiskStatusTypeName==='closefollowup'?'red-2':'red-3'">{{ risk.productRiskStatusType }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="model.deliveryDetailStatusType && model.deliveryDetailStatusType.trim()">
              <el-col :span="11">
                <span>
                  <div style="opacity: 0; ">
                    {{ '...' }}
                  </div>
                </span>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item v-if="model.deliveryDetailStatusType && model.deliveryDetailStatusType.trim()" label="Teslimat Detayı">
                  <el-tag type="info">
                    {{ model.deliveryDetailStatusType }}
                  </el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item :label="$t('productCard.groupNo')" prop="productCode">
                  <span v-show="model.productCode || model.projectOrder" style="word-break: break-word;">{{ model.productCode + '/' + model.projectOrder }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col v-if="lockType === ''" :span="11">
                <el-form-item :label="$t('productCard.productStatus')" prop="productStatus">
                  <el-tag :type="productStatus(model.productStatus)">{{ model.productStatus }}</el-tag>
                  <el-tag v-if="model.isBirtepProduct" type="success"> {{ 'Birtep Plan: ' + model.residenceCode }} </el-tag>
                  <el-tag v-if="model.isEstatePartnership" type="success"> {{ 'Şirket-i Milk Tasarruf Planı' }} </el-tag>
                  <el-tag v-if="model.isDeserved" type="success"> {{ 'Mahsup Proje' }} </el-tag>
                </el-form-item>
                <el-form-item v-if="model.isRevised" :label="'Revizyon Durumu'" prop="productStatus">
                  <el-tag type=""> {{ 'Revize Tasarruf Planı' }} </el-tag>
                </el-form-item>
              </el-col>
              <el-col v-if="lockType !== ''" :span="11">
                <el-form-item :label="$t('productCard.productStatus')" >
                  <el-tag > {{ lockType }} </el-tag>
                  <el-tooltip :content="lockDescription?lockDescription:'Açıklama Yok'" class="item" effect="light" placement="top">
                    <svg-icon icon-class="info" style="width: 32px;height:32px;margin-right: 5px;cursor:pointer;"/>
                  </el-tooltip>
                  <el-tag v-if="model.isBirtepProduct" type="success"> {{ 'Birtep Plan: ' + model.residenceCode }} </el-tag>
                  <el-tag v-if="model.isEstatePartnership" type="success"> {{ 'Şirket-i Milk Proje' }} </el-tag>
                </el-form-item>
                <el-form-item v-if="model.isRevised" :label="'Revizyon Durumu'" prop="productStatus">
                  <el-tag type=""> {{ 'Revize Tasarruf Planı' }} </el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item v-if="collectionEfficiencyRatio >= 75 " label="Tahsilat Yeterlilik Oranı">
                  <el-tag type="success">{{ '%' + collectionEfficiencyRatio }}</el-tag>
                </el-form-item>
                <el-form-item v-if="collectionEfficiencyRatio < 75 " label="Tahsilat Yeterlilik Oranı">
                  <el-tag type="danger">{{ '%' + collectionEfficiencyRatio }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item label="Tasarruf Planı Tarihi">
                  <span>{{ model.productCreateDate === null ? '' :  $filters.parseTime(model.productCreateDate, '{d}.{m}.{y}') }}</span>
                </el-form-item>
                <el-form-item v-show="model.methodType==='ordered'" label="Noter Teslim Tarihi">
                  <el-tag v-if="deliveryDates && deliveryDates.notaryDeliveryDate!=='8888-01-01T00:00:00'" type="danger">{{ $filters.parseTime(deliveryDates.notaryDeliveryDate, '{d}.{m}.{y}') }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Kesin Son Teslim Tarihi">
                  <span v-if="deliveryDates && deliveryDates.exactDeliveryDate!=='8888-01-01T00:00:00'">{{ months[new Date(deliveryDates.exactDeliveryDate).getMonth()] + ' ' + new Date(deliveryDates.exactDeliveryDate).getFullYear() }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item label="Kesin Teslim Tarihi">
                  <span v-if="deliveryDates && deliveryDates.iDeliveryDate!=='8888-01-01T00:00:00'">{{ months[new Date(deliveryDates.iDeliveryDate).getMonth()] + ' ' + new Date(deliveryDates.iDeliveryDate).getFullYear() }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Teminat Mektubu">
                  <span v-if="model.hasLetterOfGuarantee" style="margin-right: 10px;">{{ 'Var' }}</span>
                  <span v-else style="margin-right: 10px;">{{ 'Yok' }}</span>
                  
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;
              </el-col>
              <el-col :span="11">
                <el-form-item label="Teminat Senedi">
                  <span v-if ="model.hasDocumentOfGuarantee" style="margin-right: 10px;">{{ 'Var' }}</span>
                  <span v-else style="margin-right: 10px;">{{ 'Yok' }}</span>
                 
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="productTagCount !== 0">
              <el-col :span="24">
                <div id="collapse-header">
                  <el-row style="margin-bottom:0;width: fit-content;overflow: hidden;display: flex;align-items: center;">
                    <span class="meta-title">Etiketler</span>
                    <span v-for="(item,index2) in productTags" :key="index2" :class="findText(item)">
                      <el-popover
                        :title="item.tag.name"
                        popper-class="description-popover"
                        placement="top-start"
                        width="500"
                        trigger="hover" >
                        <el-tag type="info">Etiket Tarihi: {{ new Date(item.fromDate).toLocaleDateString() }}</el-tag>
                        <div>
                          <span id="str" style="word-break:break-word;" v-html="item.tag.description"/>
                        </div>
                        <span slot="reference" class="tag">{{ item.tag.shortName }}<svg-icon icon-class="detail-icon" style="margin-left:5px;"/></span>
                      </el-popover>
                    </span>
               
                  </el-row>
                </div>
             
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <!-- Yasal takip uyarısı burada başlıyor -->
      <el-row v-if="hasLegalFollowUp">
        <div class="product-risk" >
          <span>Yasal Takip Durumu:</span>
          <span v-html="legalFollowUpText"/>
          <el-tooltip class="item" effect="light" content="Müşterimizin Yasal Takip durumundaki projeleri ile ilgili olarak Hukuk Birimi ile irtibata geçmeleri gerekmektedir." placement="top-start">
            <span class="el-icon-info"/>
          </el-tooltip>
        </div>
      </el-row>
      <div style="display: flex;justify-content: space-between;align-content: center;">
        <el-button :class="currentComponent=='payingPlan'?'active':''" class="tablinks" @click="currentComponent='payingPlan'">Ödeme Planı</el-button>
        <el-button :class="currentComponent=='accounting'?'active':''" class="tablinks" @click="currentComponent='accounting'">Tahsilat Durumu</el-button>
        <el-button :class="currentComponent=='contract'?'active':''" class="tablinks" @click="currentComponent='contract'">Belgeler</el-button>
        <el-button v-if="isProduct&& !model.isProductLocked && (!isCancelled )" :class="currentComponent=='delivery'?'active':''" class="tablinks" @click="currentComponent='delivery'">Teslimat</el-button>
        <el-button :class="currentComponent=='notes'?'active':''" class="tablinks" @click="currentComponent='notes'">Notlar</el-button>
        <el-button v-if="canCancel && deliveryNotDone && !model.isProductLocked && !ifExistReceivedProductTag" :class="currentComponent=='productCancel'?'active':''" class="tablinks" @click="currentComponent='productCancel'">
          Tasarruf Planı İptali
        </el-button>
        <el-button v-if="deliveryNotDone" :class="currentComponent=='productStandbyDrawing'?'active':''" class="tablinks" @click="currentComponent='productStandbyDrawing'">
          Sıra Tespiti Tarihleri
        </el-button>
        <el-button :class="currentComponent=='birtepDocument'?'active':''" class="tablinks" @click="currentComponent='birtepDocument'">
          Birtep Dokümanları
        </el-button>
      </div>
      <keep-alive>
        <paying-plan
          v-if="currentComponent==='payingPlan'"
          :key="currentComponent+renderKey"
          :delivery-date="deliveryDates"
          :method-type="model.methodType"
          :additional-term="model.additionalTerm"
          :product-id="model.productId"
          :calculation-id="parseInt(this.$route.params.calculationId, 10)"
          :product-status="model.productStatus"
          :project-code="model.projectNumber"
          @paymentUpdated="childUpdated"
          @remainAmount="finalRemainAmount"
          @paymentModel="progress" />
      </keep-alive>
      <keep-alive>
        <accounting v-if="currentComponent==='accounting'" :key="currentComponent+renderKey" :product-id="model.productId" :calculation-id="parseInt(this.$route.params.calculationId, 10)" :customer-name="customer.name" :project-code="model.projectNumber"/>
      </keep-alive>
      <keep-alive>
        <contract v-if="currentComponent==='contract'" :key="currentComponent+renderKey" :is-czm-product="model.cozumProductCode !== null" :is-product="model.productStatus !== 'Teklif'" :calculation-id="parseInt(this.$route.params.calculationId, 10)" :product-id="model.productId" :customer-id="customerId" :customer-guid="customerGuid" @statusUpdated="childUpdated"/>
      </keep-alive>
      <keep-alive>
        <delivery
          v-if="currentComponent==='delivery'"
          :key="currentComponent+renderKey"
          :remain-amount="remainAmount"
          :calculation-id="parseInt(this.$route.params.calculationId, 10)"
          :product-id="model.productId"
          :customer-id="customerId"
          :customer-name="customer.name"
          :customer-guid="customerGuid"
          :project-code="model.projectNumber"
          :proposal-id="model.proposalId"
          :finance-amount="parseFloat(model.financeAmount)"/>
      </keep-alive>
      <keep-alive>
        <notes v-if="currentComponent==='notes'" :key="currentComponent+renderKey" :product-id="model.productId" :create-date="model.productCreateDate"/>
      </keep-alive>
      <keep-alive>
        <product-cancel
          v-if="currentComponent==='productCancel'"
          :key="model.productId"
          :product-id="model.productId"
          :customer-name="customer.name"
          :customer-guid="customerGuid"
          :customer-id="customerId"
          :project-code="model.projectNumber"
          :calculation-id="parseInt(this.$route.params.calculationId, 10)"
          :create-date="model.productCreateDate"
          :is-received-service="model.isReceivedService"
          :is-protocol-delivery="model.isProtocolDelivery"
          :is-merge-product="false"
          @activated="renderKey++"/>
      </keep-alive>
      <keep-alive>
        <product-drawing-standby v-if="currentComponent==='productStandbyDrawing'" :key="model.productId" :product-id="model.productId" @drawInfo="setRealDrawObject"/>
      </keep-alive>
      <keep-alive>
        <documentGroup v-if="currentComponent==='birtepDocument'" :key="currentComponent" :indices="[{ keyType: 'PRODUCTID', value: model.productId }, { keyType: 'CUSTOMERID', value: customerGuid }]" document-group-type="BIRTEPDOCUMENTGROUP "/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import PayingPlan from './Components/PayingPlan'
import Accounting from './Components/Accounting'
import ProductCancel from './Components/ProductCancel'
import Notes from './Components/ProductNote'
import ProductDrawingStandby from './Components/ProductDrawingStandby'
import Contract from './Components/Contract'
import documentGroup from '@/views/dms/documentGroup'
import Delivery from './Components/Delivery'
import partnerApi from '@/api/finance/partner'
import crmPartnerApi from '@/api/crm/partner'

export default {
  name: 'ProductCard',
  components: {
    'Sticky': Sticky,
    'PayingPlan': PayingPlan,
    'ProductCancel': ProductCancel,
    'Accounting': Accounting,
    'Notes': Notes,
    'Contract': Contract,
    'ProductDrawingStandby': ProductDrawingStandby,
    'documentGroup': documentGroup,
    'Delivery': Delivery,
  },
  data() {
    return {
      checkDeliveryFormsPermission: false,
      warningText: false,
      count: 0,
      provinceName: null,
      activeName: null,
      activeNames: ['1'],
      openCancelDialog: false,
      renderKey: 1,
      lockType: null,
      lockDescription: null,
      currentComponent: 'payingPlan',
      newFinanceType: false,
      activeTabName: 'waiting',
      isGrowthSavings: false,
      financeDetailType: null,
      remainAmount: 0,
      model: {
        calculationId: null,
        proposalId: null,
        productId: 0,
        financeAmount: 0,
        financeType: null,
        financeTypeName: null,
        financeCost: 0,
        advanceAmount: 0,
        financeDetailType: null,
        productName: null,
        campaign: null,
        package: null,
        projectNumber: '',
        productCode: '',
        isProtocolDelivery: false,
        projectOrder: null,
        installmentAdvantage: null,
        deliveryStatus: null,
        productStatus: null,
        isBirtepProduct: false,
        residenceCode: '',
        totalTerm: 66,
        isRevised: false,
        isReceivedService: false,
        deliveryDate: 32,
        currentTerm: 0,
        additionalTerm: 0,
        maturityTerm: 96,
        drawingStatus: null,
        isProductLocked: false,
        legalFollowUpList: [],
        productDelayInformation: []
      },
      realDrawObject: null,
      deliveryDates: {
        iDeliveryDate: null,
        notaryDeliveryDate: null,
        exactDeliveryDate: null
      },
      deliveryNotDone: false,
      deliveryDateObj: [],
      passiveProductTags: [],
      passiveProductTagCount: 0,
      productTags: [],
      productTagCount: 0,
      actualOrPaymentDate: null,
      customerId: 0,
      customerGuid: '',
      deliveryPercentage: 12,
      totalPercentage: 12,
      installmentPercentage: 6,
      collectionEfficiencyRatio: 0,
      // deliveryPercentage: Math.round((66 / 100) * 24),
      financeDetailTypes: [],
      busy: false,
      progressBarStatus: 'success',
      customer: null,
      months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      validation: {
      },
      toggleFinanceType: [{
        value: 1,
        label: 'Konut'
      }, {
        value: 2,
        label: 'Taşıt'
      }, {
        value: 4,
        label: 'Çatılı İş Yeri'
      }
      ],
      legalFollowUp: false,
      hasLegalFollowUp: false,
      legalFollowUpText: '',
      risk: null,
      openedProjectCreateActivityId: null,
      currentUserCreateActivityId: null,
      currentUserPositionId: null,
      customerPartyId: null,
      collapse: false,
      progressArray: [],
      progressOrder: 0,
      totalOrder: 0,
      installmentType: 0,
      totalDelivery: 0,
      perDataArray: [],
      ifExistReceivedProductTag: false,
      dialogHistoryVisible: false,
      repaymentHistoryList: [],
      hasRepayment: false
    }
  },
  computed: {
    isProduct: function() {
      return !(this.model.productStatus === 'Teklif' || this.model.productStatus === 'İlk Ödeme Bekleniyor' || this.model.productStatus === 'Onay Bekleniyor' || this.model.productStatus === 'Devir Ayrılan')
    },
    canCancel: function() {
      return this.model.productStatus !== 'Teklif'
    },
    isCancelled: function() {
      return this.model.productStatus === 'İptal Edildi' || this.model.productStatus === 'Ayrılma'
    },
    isLeave: function() {
      return this.model.productStatus === 'Ayrılma'
    }
  },
  watch: {
    model: {
      handler() {

      },
      deep: true
    }
  },
  mounted() {
    this.getCustomer()
    // this.checkLocalStorage()
  },
  updated() {

  },
  created() {
    this.model.calculationId = parseInt(this.$route.params.calculationId, 10)
    this.currentUserCreateActivityId = this.$store.getters.user.sub
    this.currentUserPositionId = this.$store.getters.user.positionId
    // this.customerPartyId = this.$store.getters.customer.partyId
    this.getFields()
    this.getCustomer() // ok
    this.getCollectionEfficiencyRatio()
    this.getDeliveryDates()
    this.getActualOrPaymentDate()
    this.checkIfGrowthSavingsRevision()
    this.getProductLockStatus()
    this.getProductLockDescription()
    this.getFinanceDetailTypes()
    this.getThePersonWhoOpenedProject()
    if (JSON.parse(localStorage.getItem('names')) !== null && JSON.parse(localStorage.getItem('names')).length !== 0) {
      this.perDataArray = JSON.parse(localStorage.getItem('names'))
    } else {
      this.perDataArray = []
    }
  },
  methods: {
    deliveryProgress() {
      if (this.deliveryNotDone === false) {
        return 'deliveryProgress'
      }
    },
    finalRemainAmount(amount) {
      this.remainAmount = amount
    },
    progress(model) {
      this.busy = true
      this.progressArray = model
      this.progressArray.forEach(x => {
        if (x.paymentType === 'workingcostinstallment' && x.paymentStatus === 'payed') {
          this.totalOrder += ((this.progressOrder + 1) / 2) + 2
        }
        if (x.paymentType === 'workingcostinstallment' && x.paymentStatus === 'payed' && x.paymentType === 'workingcostadvancepayment') {
          this.totalOrder += (this.progressOrder + 1) / 2
        }
        if (x.paymentType === 'workingcostinstallment' && x.paymentStatus === 'initial') {
          this.totalOrder = 1
        }
      })
      try {
        this.progressArray.forEach(i => {
          var a = this.months[new Date(this.deliveryDates.exactDeliveryDate).getMonth()] + new Date(this.deliveryDates.exactDeliveryDate).getFullYear()
          var b = this.months[new Date(i.paymentDate).getMonth()] + new Date(i.paymentDate).getFullYear()
          if (a === b) {
            this.totalDelivery = i.order
          }
        })
      } catch (err) {
        console.log(err)
      }
      this.busy = false
    },
    progressText() {
      if ((this.totalOrder < this.model.additionalTerm || this.totalOrder === this.model.additionalTerm) && this.totalOrder !== 0) {
        this.installmentType = 0
        return 'ÇB Taksit'
      } else if (this.totalOrder === this.model.additionalTerm && this.currentTerm === 1) {
        return 'Açılış <br> 1. Ay'
      } else {
        this.installmentType = 1
        return 'Şu an <br>' + this.model.currentTerm + '. Ay'
      }
    },
    displayNone() {
      if (((this.totalOrder < this.model.additionalTerm || this.totalOrder === this.model.additionalTerm) && this.totalOrder !== 0)) {
        return 'display-none'
      }
    },
    deliveryControl() {
      if (this.deliveryNotDone === false) {
        return ''
      } else {
        return 'border-fix'
      }
    },
   // hasActionPermission,
    firstLetters(customer) {
      return customer.name.charAt(0)
    },
    findText(item) {
      var res = item.tag.description.match(/ayrılması durumunda/g)
      var res2 = item.tag.description.match(/ayrılma durumunda/g)
      var res3 = item.tag.description.match(/Ayrılma Durumunda/g)
      var res4 = item.tag.description.match(/Ayrılması Durumunda/g)
      var res5 = item.tag.description.match(/Ayrılması durumunda/g)
      var res6 = item.tag.description.match(/Ayrılma durumunda/g)
      if (res === null && res2 === null && res3 === null && res4 === null && res5 === null && res6 === null) {
        return ''
      } else {
        return 'has-leaving'
      }
    },
    
    getProductTagById(productId) {
      this.busy = true
      partnerApi.getProductTagById(productId)
        .then((v) => {
          if (v.data.success) {
            this.passiveProductTags = v.data.result.filter(i => i.thruDate !== null)
            this.productTags = v.data.result.filter(i => i.thruDate === null)
            this.passiveProductTagCount = this.passiveProductTags.length
            this.productTagCount = this.productTags.length
            if (this.productTagCount > 0) { this.ifExistReceivedProductTag = this.productTags.some(i => i.tagId === 131) }
          } else {
            this.$notify.error(this.$t('notify.' + v.data.errorMessage))
          }
          this.busy = false
        })
    },
    checkIfGrowthSavingsRevision() {
      partnerApi.checkIfGrowthSavingsRevision(this.$route.params.calculationId)
        .then((v) => {
          if (v.data.success) {
            this.isGrowthSavings = v.data.result
          } else {
            this.isGrowthSavings = false
          }
        })
        .catch(() => {
          this.isGrowthSavings = false
        })
    },
    getProvinceName(partyId) {
      crmPartnerApi.getProvinceName(partyId)
        .then((result) => {
          this.provinceName = result.data
        })
        .catch(() => {
          this.$notify.error(this.$t('notify.error'))
        })
    },
    getFinanceDetailTypes() {
      this.busy = true

      partnerApi.getFinanceDetailTypes()
        .then((result) => {
          this.financeDetailTypes = result.data.list
          this.financeDetailTypes = this.financeDetailTypes.filter(m => m.value === 'Motorcycle' || m.value === 'Car')
        })
        .finally(() => {
          this.busy = false
        })
    },
    
    getProductLockStatus() {
      this.busy = true
      partnerApi.getProductLockStatus(this.$route.params.calculationId)
        .then((result) => {
          this.lockType = result.data
        })
        .finally(() => {
          this.busy = false
        })
    },
    getProductLockDescription() {
      this.busy = true
      partnerApi.getProductLockDescription(this.$route.params.calculationId)
        .then((result) => {
          this.lockDescription = result.data
        })
        .finally(() => {
          this.busy = false
        })
    },
    getThePersonWhoOpenedProject() {
      this.busy = true
      partnerApi.getThePersonWhoOpenedProject(this.$route.params.calculationId, 10)
        .then((v) => {
          this.openedProjectCreateActivityId = v.data.result.toUpperCase()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.busy = false
        })
    },
    getActualOrPaymentDate() {
      this.busy = true
      partnerApi.getActualOrPaymentDate(this.$route.params.calculationId, 10)
        .then((v) => {
          this.actualOrPaymentDate = v.data.result
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.busy = false
        })
    },
   
    iconClass() {
      if (this.model.financeType === 'Konut') {
        return 'houseType'
      } else if (this.model.financeType === 'Taşıt') {
        return 'carType'
      } else if (this.model.financeType === 'Tasarruf') {
        return 'savingType'
      } else {
        return 'workplace'
      }
    },
    setRealDrawObject(Obj) {
      this.realDrawObject = Obj
    },
    getDeliveryDates() {
      this.busy = true
      partnerApi.getDeliveryDates(this.$route.params.calculationId)
        .then((v) => {
          this.deliveryDates = v.data.result
          this.busy = false
        })
        .catch((err) => {
          console.log(err)
          this.busy = false
        })
    },
    goCustomer() {
      if (this.customer.partyType === 'person') {
        this.$router.push(
          {
            name: 'personEdit',
            params: { partyId: parseInt(this.customer.customerId) }
          }
        )
      } else if (this.customer.partyType === 'corporateorganization') {
        this.$router.push(
          {
            name: 'organizationEdit',
            params: { partyId: parseInt(this.customer.customerId) }
          }
        )
      }
    },
    drawingStatus(drawingStatus) {
      if (drawingStatus === true) {
        return 'drawingStatusTrue'
      } else {
        return 'drawingStatusFalse'
      }
    },
    deliveryStatus(deliveryStatus) {
      if (deliveryStatus === true) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    productStatus(productStatus) {
      if (productStatus === true) {
        return 'success'
      } else {
        return 'danger'
      }
    },

    routeCustomerCard() {
      this.$store.commit('SET_CUSTOMER', { partyId: this.customer.customerId, partyName: this.customer.name })
      this.$router.push(
        {
          name: 'personEdit',
          params: { partyId: this.customer.customerId }
        })
    },

    childUpdated() {
      this.model.calculationId = parseInt(this.$route.params.calculationId, 10)
      this.getFields()
      this.getCollectionEfficiencyRatio()
      this.renderKey++
    },
    getFields() {
      this.busy = true
      partnerApi.getProductCardList(this.model.calculationId)
        .then((v) => {
          console.log('v', v)
          this.model = v.data
          this.hasLegalFollowUp = this.hasLegalFollowUpProducts()
          this.legalFollowUp = this.onLegalFollowUp()
          this.legalFollowUpText = this.getLegalFollowUpTextWithUserFrendly()
         // this.checkRepaymentExists()
          this.getProductTagById(this.model.productId)
          if (this.model.deliveryStatus !== 'Teslimat Yapıldı') {
            this.deliveryNotDone = true
          }
          if (!this.deliveryNotDone) {
            this.getProductRiskById(this.model.productId)
          }

          if (this.model.maturityTerm === 0) this.model.maturityTerm = this.model.totalTerm
          if (this.model.maturityTerm < this.model.totalTerm + this.model.additionalTerm) {
            var total = this.model.totalTerm
            this.totalPercentage = 24
            this.deliveryPercentage = Math.round(((this.model.deliveryDate + this.model.additionalTerm) / (total + this.model.additionalTerm)) * 24)
            this.installmentPercentage = Math.ceil((this.model.currentTerm / (this.model.deliveryDate + this.model.additionalTerm)) * 24)
            if (this.installmentPercentage === 0) { this.installmentPercentage = 1 }
          } else {
            this.totalPercentage = Math.round(((this.model.totalTerm + this.model.additionalTerm) / this.model.maturityTerm) * 24)
            this.deliveryPercentage = Math.round(((this.model.deliveryDate + this.model.additionalTerm) / (this.model.totalTerm + this.model.additionalTerm)) * 24)
            this.installmentPercentage = Math.ceil((this.model.currentTerm / (this.model.deliveryDate + this.model.additionalTerm)) * 24)
          }
          this.busy = false
        })
        .catch((err) => {
          console.log(err)
          this.busy = false
          this.$message({
            type: 'info',
            message: this.$t('notify.unknownError')
          })
        })
    },
    getCustomer() {
      this.busy = true
      partnerApi.getCustomer(this.model.calculationId)
        .then((v) => {
          this.customer = v.data
          this.customerId = this.customer.customerId
          this.getProvinceName(this.customerId)
          this.customerGuid = this.customer.partyId
          // this.$store.commit('SET_CUSTOMER',
          //   { partyId: this.customer.customerId,
          //     partyName: this.customer.name,
          //     partyType: this.customer.partyType })

          this.busy = false
        })
        .catch((err) => {
          console.log(err)
          this.busy = false
          this.$message({
            type: 'info',
            message: this.$t('notify.unknownError')
          })
        })
    },
    getCollectionEfficiencyRatio() {
      partnerApi
        .getCollectionEfficiencyRatio(this.model.calculationId)
        .then((v) => {
          this.collectionEfficiencyRatio = v.data
        })
    },
    getProductRiskById(productId) {
      partnerApi
        .getProductRiskById(productId)
        .then((v) => {
          this.risk = v.data.sort(function(a, b) { return b.fromDate.localeCompare(a.fromDate) })[0]
        })
    },
    onLegalFollowUp() {
      if (!this.hasLegalFollowUp) {
        return false
      }
      if (this.model.legalFollowUpList.find(x => x.productId === this.model.productId)) {
        return true
      }
      return false
    },
    hasLegalFollowUpProducts() {
      if (!this.model.legalFollowUpList) {
        return false
      }
      return this.model.legalFollowUpList.length > 0
    },
    getLegalFollowUpTextWithUserFrendly() {
      var body = ''
      if (!this.hasLegalFollowUp) {
        return ''
      }
      var tempLegalFollowUpList = Array.from(this.model.legalFollowUpList)
      if (tempLegalFollowUpList.length > 0) {
        body += 'Müşterimizin &nbsp;'
        if (tempLegalFollowUpList.length === 1) {
          body += '<strong>' + tempLegalFollowUpList[0].productCode + '</strong> &nbsp;' + ' No\'lu projesi &nbsp;'
        } else {
          var lastItem = tempLegalFollowUpList.pop()
          body += '<strong>' + tempLegalFollowUpList.map(x => x.productCode).join() + '</strong> &nbsp;' + ' ve &nbsp;' + '<strong>' + lastItem.productCode + '</strong> &nbsp;' + ' No\'lu projeleri &nbsp;'
        }
        body += ' <strong> Yasal Takip Durumunda</strong>'
      }
      return body
    }
  }
}
</script>

<style lang="scss" scoped>
.watermark::before {
  content: "";
  position: absolute;
  z-index: 2;
  pointer-events: none;
  background-image: url("../../../assets/img/birevim/watermark.png");
  background-repeat: repeat;
  width: 100%;
  height: 100%;
}
.product-delay {
  min-height: 60px;
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
.tab {
  min-height: 32px;
    height: 45px;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 4px 4px 0px 0px;
  box-shadow: none;
  padding: 0;
  width: 100%;
  .el-button {
    margin-bottom: 0;
    margin-top: 0;
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid #e5e5e5;
        width: 160px;
    white-space: normal;
    word-break: break-word;
    line-height: 1;
        min-height: 32px;
    height: 46px;
  }
}
.per-tab-table {
  border-collapse: collapse;
  thead {
    color: #fff;
  }
  th, td {
    padding: 10px !important;
  }
}
.warning {
  font-size: 16px;
  font-weight: 600;
  color: #C94343;
}
.product-tag {
  width: fit-content;
  height: 60px;
  object-fit: contain;
  padding: 15px 30px;
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(98deg, #b68787, #8a9599);
  display: flex;
  align-items: center;
    span:nth-child(1) {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #ffffff;
      margin-right: 30px;
    }
}
.red-1 {
  padding: 5px 10px;
  border-radius: 5px;
  background: #a70000;
  color: #fff;
}
.red-2 {
  padding: 5px 10px;
  border-radius: 5px;
  background: #ff5252;
  color: #fff;
}
.red-3 {
  padding: 5px 10px;
  border-radius: 5px;
  background: #ffbaba;
  color: #fff;
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
  margin-bottom: 30px;
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
.svg-icon {
  fill: #b7b7b7;
}
.productCard {
  font-weight: 100;
  
  .el-alert {
    height: 60px !important;
  }
  ::v-deep(.el-alert__title) {
      font-size: 18px !important;
    }
  ::v-deep(.v-modal) {
    z-index: 2;
  }
  ::v-deep(.productInfo .el-row) {
    line-height: 0;
  }
  ::v-deep(.el-collapse-item__arrow) {
    font-size: 25px;
  }
  ::v-deep(.el-collapse-item__wrap) {
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #e5e5e5;
    background-color: #ffffff;
    padding: 25px;
  }
  ::v-deep(.progressCollapse .el-collapse-item__header) {
    height: 100px;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #e5e5e5;
    background-image: linear-gradient(94deg, #f5f5f5, #ffffff);
  }
  ::v-deep(.searchPanel) {
    width: 100%;
  }
  .drawingStatusFalse {
    color: #1a84ff !important;
  }
  .drawingStatusTrue {
    color: #f59f3e !important;
  }
  .deliveryStatusTrue {
    color: #f59f3e !important;
  }
  .deliveryStatusFalse {
    color: #1a84ff !important;
  }
  .productStatusTrue {
    color: #f59f3e !important;
  }
  .productStatusFalse {
    color: #1a84ff !important;
  }
  .box-card {
    padding: 0 0 30px;
    border-radius: 4px !important;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08) !important;
    border: solid 1px #e5e5e5 !important;
    background-color: #fff;
    background-image: none !important;
    ::v-deep(.el-card__body) {
      padding: 0 !important;
    }
  }
  .el-card {
    background-image: linear-gradient(105deg, #f5f5f5, #ffffff);
    border-radius: 4px;
    box-shadow: 0 20px 20px 0 rgba(182, 49, 69, 0.1);
    border: solid 1px #f5f5f5;
  }
  ::v-deep(.el-form-item__label) {
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #909399;
    line-height: 24px;
  }
  ::v-deep(.el-form-item__content) {
    line-height: 24px;
  }
  .el-form-item span {
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #000000;
  }
  .restructuring {
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b7b7b7;
  }
  ::v-deep(.base-wrapper) {
    width: 100%;
  }
  .info {
    min-width: 520px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e5e5e5;
    background-color: #f5f5f5;
    padding: 0 30px 0 20px;
    .customer-name {
      font-size: 21px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000000;
      vertical-align: middle;
      span {
        font-weight: normal;
      }
    }
    .branch-name {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000000;
      span {
        color: #909399;
      }
    }
  }
  [data-letters]:before {
    content:attr(data-letters);
    display:inline-block;
    font-size: 1.1em;
    width: 50px;
    height: 50px;
    line-height: 2.7em;
    text-align:center;
    border-radius:50%;
    border: 2px solid #fff;
    background: #b7b7b7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.1);
    vertical-align:middle;
    margin-right:1em;
    color:white;
    cursor: pointer;
  }
}
.progressbar {
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 30px;
  top: 35px;
  z-index: 20;
  .deliveryProgress {
    background: #ff7c52 !important;
  }
  .display-none {
    display: none;
  }
  .border-fix {
    border-radius: 0px 100px 100px 0px !important;
  }
  .more {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b7b7b7;
  }
  .less {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b7b7b7;
  }
  .el-button {
    font-size: 12px;
    color: #000;
    border: none;
    height: 70px;
    width: 70px;
    position: relative;
    top: -65%;
    object-fit: contain;
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1);
    background-image: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 16px;
    &.delivery {
      font-size: 12px;
      color: #fff;
      border: none;
      height: 70px;
      width: 70px;
      position: relative;
      top: -20px;
      object-fit: contain;
      box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1);
      background-image: linear-gradient(135deg, #ff7c52, #ff9573);
      padding: 10px;
      .finance-type-icon {
        width: 25px;
        height: 25px;
        border-radius: 24px;
        border: solid 0.8px #e5e5e5;
        background-color: #ffffff;
        position: absolute;
        right: -17px;
        top: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    &.total {
      font-size: 12px;
      color: #fff;
      border: none;
      height: 70px;
      width: 70px;
      position: relative;
      top: -20px;
      object-fit: contain;
      box-shadow: 0 0px 20px 0 rgba(0, 0, 0, 0.1);
      background-image: linear-gradient(135deg, #1b81ff, #00c6ff);
      padding: 10px;
    }
  }
}


.description-popover {
  div:nth-child(2) {
    height: 200px;
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

#collapse-header {
  width: 100%;
  border: solid 1px #e5e5e5;
  background-color: #fff;
  min-height: 40px;
  padding: 3px 15px;
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
  .meta-title {
    font-size: 14px;
    font-weight: 100;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #909399;
    margin-right: 10px;
    float: left;
  }
  .tag {
    border-radius: 3px;
    background-color: #f0f2f5;
    padding: 7px;
    font-size: 12px;
    font-weight: 100;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #5a5e66;
    margin-right: 10px;
    overflow: hidden;
    float: left;
    cursor: pointer;
  }
  .has-leaving {
    position: relative;
  }
  .has-leaving::before {
    content: "";
    width: 10px;
    height: 10px;
    right: 5px;
    top: 0px;
    position: absolute;
    background: #c94343;
    border-radius: 50%;
  }
}
.collapse-content {
  object-fit: contain;
  border: solid 1px #e5e5e5;
  background-color: #ffffff;
  padding:20px;
  span {
    font-size: 16px;
    font-weight: 100;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
}
  .el-collapse-item__header {
    border: solid 1px #e5e5e5;
    background-color: #c7c7c7;
    height: 60px;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    line-height: 18px !important;
    .meta-title {
      font-size: 18px;
    }
  }
.white {
  mix-blend-mode: color-dodge;
}
@media screen and (max-width: 1440px) {
  .progressbar {
    width: 93%;
  }
}
</style>
