<template>
  <div v-if="paymentPlan != null">
    <el-row style="margin-bottom:20px;">
      <div>
        <el-button class="action-button button-right" icon="el-icon-printer" circle @click="printDocument"/>
        <!-- <el-button type="warning" icon="el-icon-message" circle class="action-button button-right" @click="handleEmailSend"/> -->
      </div>
    </el-row>
    <el-dialog :visible.sync="sendProposalDialog" title="Teklifi Eposta Gönder" width="75%" append-to-body>
      <el-card>
        <el-form label-position="left" label-width= "150px" class="itemlabel">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="'Eposta Adresi'">
                <el-input v-model="customerEmail" placeholder="Eposta adresi giriniz" class="itemlabel" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" align="right">
              <el-form-item>
                <el-button type="action" @click.prevent="sendProposal">
                  {{ 'Teklifi Gönder' }}
                </el-button>
                <el-button class="default-button" @click="sendProposalDialog=false">
                  {{ this.$t('buttons.cancel') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-dialog>
    <div id="printTable" style="width:210mm;background:#fff;">
      <div class="frame" style="page-break-after:always;">
        <el-row type="flex" justify="space-between" align="middle" class="alignment">
          <div class="background"><span>Ödeme Planı</span></div>
          <div class="birevim">444 23 53 | birevim.com</div>
        </el-row>
        <el-row type="flex" justify="space-between" align="middle" class="alignment" style="margin-top:20px;">
          <el-col :span="24" class="w-75" style="padding-left:30px;">
            <div class="table saving-plan-proposal" style="width:100%;display:table;">
              <div class="table-row-group" style="display:table-row-group;">
                <div class="table-row" style="table-row;">
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="150px">Tasarruf Sahibi</span>
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="35px">:</span>
                  <span class="table-cell" style="font-weight:300;display:table-cell;">{{ paymentPlan.customerName }}</span>
                </div>
                <div style="width:100%;height:1px;border-bottom: 1px dotted #000;" />
                <div class="table-row" style="table-row;">
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="150px">Tasarruf Türü</span>
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="35px">:</span>
                  <span class="table-cell" style="font-weight:300;display:table-cell;">{{ paymentPlan.financeType === 1 ? 'Konut' :
                  paymentPlan.financeType === 2 ? 'Taşıt' : paymentPlan.financeType === 3 ? 'Tasarruf' : 'Çatılı İş Yeri'
                  }}</span>
                </div>
                <div style="width:100%;height:1px;border-bottom: 1px dotted #000;" />
                <div class="table-row" style="table-row;">
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="150px">Tasarruf Yöntemi</span>
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="35px">:</span>
                  <span v-if="paymentPlan.methodType===1" class="table-cell" style="font-weight:300;display:table-cell;">Sıra Tespitli Tasarruf Yöntemi {{ paymentPlan.version }}</span>
                  <span v-else class="table-cell" style="font-weight:300;display:table-cell;">Serbest Planlı Tasarruf Yöntemi</span>
                </div>
               
                <div style="width:100%;height:1px;border-bottom: 1px dotted #000;" />
                <div class="table-row" style="table-row;">
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="150px">Tasarruf Planı No</span>
                  <span class="table-cell" style="font-weight:900;display: table-cell;" width="35px">:</span>
                  <span class="table-cell" style="font-weight:300;display:table-cell;">{{ projectCode }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" align="middle" class="alignment">
          <el-col :span="10" class="back-mini">
            <div class="background-small">Teklif Detayları</div>
          </el-col>
          
        </el-row>
        <el-row type="flex" justify="space-between" align="middle" class="mt-20" style="padding-left:18px;">
          <div class="proposal-detail-table" style="display:table;width:100%;">
            <div class="table-row-group" style="display:table-row-group;">
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:900;">Tasarruf Tutarı</span>
                </div>
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:600;">{{  $filters.formatTRY(paymentPlan.financeAmount) }}</span>
                </div>
              </div>
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:900;">Teslim Aralığı</span>
                </div>
                <div v-if="paymentPlan.methodType===1" class="table-cell" style="">
                  <span style="font-weight:600;">{{ '3-' + paymentPlan.deliveryDate + '. aylar arası' }}</span>
                </div>
                <div v-else class="table-cell" style="">
                  <span style="font-weight:600;">{{ paymentPlan.deliveryDate + '. Ay' }}</span>
                </div>
              </div>
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:900;">Çalışma Bedeli Tutarı</span>
                </div>
                <div class="table-cell" style="">
                  <span style="font-weight:600;">{{ $filters.formatTRY(paymentPlan.workingCostAmount) }}</span>
                </div>
              </div>
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:900;">İlk Taksit</span>
                </div>
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:600;">{{ $filters.formatTRY(paymentPlan.installmentAmount)  }}</span>
                </div>
              </div>
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:900;">Peşinat</span>
                </div>
                <div class="table-cell" style="">
                  <span v-if="((paymentPlan.advanceAmount))>=0" style="font-weight:600;">
                    {{ $filters.formatTRY(paymentPlan.advanceAmount)  }}
                  </span>
                  <span v-else style="font-weight:600;">{{ $filters.formatTRY('0') }}</span>
                </div>
              </div>
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:900;">Toplam İlk Ödeme Tutarı</span>
                </div>
                <div class="table-cell" style="">
                  <span style="font-weight:600;">
                    {{ $filters.formatTRY(firstPayment) }}
                  </span>
                </div>
              </div>
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;">
                  <span style="font-weight:900;">Toplam Maliyet</span>
                </div>
                <div class="table-cell" style="">
                  <span style="font-weight:600;">{{ $filters.formatTRY((paymentPlan.financeAmount) + (paymentPlan.workingCostAmount)) }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-row>
       
        <!-- <el-row type="flex" justify="center" align="middle">
          <div class="delivery">
            <img src="https://teba.tech/img/birevim/group97.png" style="width:40px;" alt="">
            <span class="pl-1" style="font-size: 14px;font-weight:bold;">Sadece {{ deliveryMonth }} {{ new Date().getFullYear() + '`' + 'de' }} {{ deliveryCount }} Teslimat</span>
          </div>
        </el-row>
        <el-row type="flex" justify="space-between" align="middle">
          <span class="pl-2" style="font-weight:300;font-size:14px;">{{ branchCount }} şubemiz ve {{ employeeCount }} çalışanımız ile hayallerinize kavuşmaya vesile olmaktan gurur duyuyoruz.</span>
        </el-row> -->
        <el-row style="margin-top:10px;margin-bottom:10px;">
          <el-col :span="24" align="center">
            <span style="font-weight:bold;color:#d8252c;">Tasarruf Finans Uzmanınız</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" style="padding-left:30px;">
          <div class="customer-representative-table" style="display:table;width:100%;font-size:14px;">
            <div class="table-row-group" style="display:table-row-group;">
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;border:1px dotted #c7c6c1;padding:2px;font-weight:300;">
                  <div style="display:flex;align-items:center;padding:5px 5px 5px 15px;">
                    <img src="https://teba.tech/img/birevim/person.png" width="20px" alt="" style="margin-right:15px;">
                    <span v-if="paymentPlan">{{ paymentPlan.employeeName }}</span>
                  </div>
                </div>
                <div class="table-cell" style="display:table-cell;border:1px dotted #c7c6c1;border-left:none;padding:2px;font-weight:300;">
                  <div style="display:flex;align-items:center;padding:5px 5px 5px 15px;">
                    <img src="https://teba.tech/img/birevim/call.png" width="20px" alt="" style="margin-right:15px;">
                    <span v-if="paymentPlan">{{ paymentPlan.employeePhone }}</span>
                  </div>
                </div>
                <div class="table-cell" style="display:table-cell;border:1px dotted #c7c6c1;border-left:none;padding:2px;font-weight:300;">
                  <div style="display:flex;align-items:center;padding:5px 5px 5px 15px;">
                    <img src="https://teba.tech/img/birevim/message.png" width="20px" alt="" style="margin-right:15px;">
                    <span v-if="paymentPlan">{{ paymentPlan.employeeMail }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-row>
        <el-row style="padding-left:30px;">
          <div style="padding:2px;border:1px dotted #c7c6c1;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;font-size:14px;font-weight:300;">
            <div style="display:flex;align-items:center;padding:5px 5px 5px 15px;">
              <img src="https://teba.tech/img/birevim/location.png" width="15px" alt="" style="margin-right:15px;">
              <span>Küçükbakkalköy Mah. Merdivenköy yolu Cad. No: 2 Ataşehir</span>
            </div>
          </div>
        </el-row>
        <div style="position:absolute;right:-10px;bottom:-15px;background:#fff;padding:10px;" class="logo"><img src="https://teba.tech/img/birevim/birevim_svg.svg" alt="" style="width:163px;height:43px;"></div>
      </div>
      <div class="frame2">
        <el-row type="flex" justify="space-between" align="middle" class="alignment" style="">
          <div class="background"><span>Tasarruf</span><br> <strong>Ödeme Planı</strong></div>
          <div class="birevim">444 23 53 | birevim.com</div>
        </el-row>
        <el-row type="flex" justify="end" align="right" class="alignment-3">
          <el-col :span="6" class="delivery-term">
            <div class="alignment-2">
              <div class="green-box"/>
              <span style="margin-right: 20px;">Ödenmiş Taksitleriniz</span>
            </div>
          </el-col>
          <el-col :span="6" class="delivery-term">
            <div class="alignment-2">
              <div class="red-box"/>
              <span>Teslimat Tarihiniz</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt-20" style="padding-left:30px;margin-bottom:30px">
          <div class="table payment-plan" style="display:table;border-spacing:0 5px;">
            <div style="display:table-header-group;">
              <div style="display:table-row;">
                <div style="display:table-cell;"/>
              </div>
            </div>
            <div class="table-row-group" style="display:table-row-group;">
              <div class="table-row mt-20" style="display:table-row;">
                <div class="table-cell head" style="display:table-cell;font-weight:900;border:1px dotted #c7c6c1;">
                  <span>Dönem</span>
                </div>
                <div class="table-cell head" style="display:table-cell;font-weight:900;border:1px dotted #c7c6c1;">
                  <span>Taksit Tarihi</span>
                </div>
                <div class="table-cell head" style="display:table-cell;font-weight:900;border:1px dotted #c7c6c1;">
                  <span>Aylık Ödeme</span>
                </div>
                
                <div class="table-cell head" style="display:table-cell;font-weight:900;border:1px dotted #c7c6c1;">
                  <span>Ödeme Durumu</span>
                </div>
                <div class="table-cell head" style="display:table-cell;font-weight:900;border:1px dotted #c7c6c1;">
                  <span>Ödeme Türü</span>
                </div>
              </div>
            </div>
            <div v-for="(item,index) in paymentPlan.paymentPlan" :key="index" style="width:100%;display:table-row-group;">
              <div :style="dateCompare(item.paymentDate) ? 'background:#D4605D' : item.paymentStatus == 'payed' ? 'background:#ccf265' : ''" :class="dateCompare(item.paymentDate) == index ? 'colorExactDelivery' : (item.paymentStatus == 'payed' ? 'colorDelivery' : '')" class="table-row mt-20 pbbb" style="display:table-row;font-weight:600;">
                <div class="table-cell" style="display:table-cell;text-align:center;border:1px dotted #c7c6c1;padding:5px;border-radius: 10px 0 0 10px;">
                  <span>{{ item.paymentType === 'projectinstallment' ? item.order : '#' }}</span>
                </div>
                <div class="table-cell" style="display:table-cell;text-align:center;border:1px dotted #c7c6c1;padding:5px;border-left:none;">
                  <span>{{ new Date(item.paymentDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' , day:'numeric' }) }}</span>
                </div>
                <div class="table-cell" style="display:table-cell;text-align:center;border:1px dotted #c7c6c1;padding:5px;border-left:none;">
                  <span>{{ $filters.formatTRY(item.amount) }}</span>
                </div>
               
                <div class="table-cell" style="display:table-cell;text-align:center;border:1px dotted #c7c6c1;padding:5px;border-left:none;">
                  <span>{{ item.paymentStatusText }}</span>
                </div>
                <div class="table-cell" style="display:table-cell;text-align:center;border:1px dotted #c7c6c1;padding:5px;border-radius: 0 10px 10px 0;border-left:none;">
                  <span>{{ item.paymentType==='projectinstallment'?'Tasarruf Taksidi':item.paymentTypeText }}</span>
                </div>
              </div>
            </div>
            <div class="table-footer-group" style="display:table-footer-group;">
              <div class="table-row" style="display:table-row;">
                <div class="table-cell" style="display:table-cell;height:30px;"/>
              </div>
            </div>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { Printd } from 'printd'
// import proposalApi from '@/api/finance/proposal'
// import contractApi from '@/api/finance/contract'
import partnerApi from '@/api/finance/partner'

export default {
  components: {

  },
  props: {
    calculationId: {
      type: Number,
      default: null
    },
    deliveryDate: {
      type: Object,
      default: null
    },
    projectCode: {
      type: String,
      default: null
    },
    blockedAmount: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      firstPayment: 0,
      // deliveryCount: this.$store.getters.parameters.financeParameters.find(i => i.name === 'Teklif Formu Teslimat Sayısı').value, // 1.489,
      // deliveryMonth: this.$store.getters.parameters.financeParameters.find(i => i.name === 'Teklif Formu Teslimat Ayı').value, // 'Mart',
      // branchCount: this.$store.getters.parameters.financeParameters.find(i => i.name === 'Teklif Formu Şube Sayısı').value, // 95,
      // employeeCount: this.$store.getters.parameters.financeParameters.find(i => i.name === 'Teklif Formu Çalışan Sayısı').value, // 1200,
      cssText2: `
      .pl-2 {
        margin-left: 20px !important;
      }
      .logo {
          display: block !important;
        }
        div.background {
          background: #c51315 !important;
        }
        .height {
          height: 10px !important;
        }
        #printTable div:nth-child(4) div div div div:last-child {
          padding: 10px !important;
        }
        .logo, .image {
          margin-left:25px;
        }
        .alignment .w-75 {
          padding-left: 0px !important;
          margin-top: 25px;
        }
        .proposal-detail-table .table-cell {
          padding: 10px !important;
        }
        .campaign {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.campaign span:nth-child(2) {
  background-image: linear-gradient(to left, #ff9317, #fff);
  padding: 5px 10px 5px 60px;
  color: #fff;
  text-align: right;
  position: relative;
  -webkit-print-color-adjust: exact;
}
.campaign span:nth-child(2)::after {
  content: "";
  position: absolute;
  right: -20px;
  width: 0;
  top: -1px;
  height: 0;
  border-top: 15px solid transparent;
  border-left: 20px solid #ff9317;
  border-bottom: 15px solid transparent;
  -webkit-print-color-adjust: exact;
}
.proposal-detail-table .table-cell.campaign {
  padding: 10px !important;
}
      `,
      cssText: `
@import url("https://fonts.cdnfonts.com/css/roboto");

      .qr-desc {
	font-size: 14px;
	font-weight: 300;
}
#printTable {
  font-family:'Roboto';
  height:297mm;
}
.logo {
          display: block !important;
        }
.text {
  font-family: 'Shadows Into Light Two', cursive;
  font-size: 36px;
  display: block !important;
}

.frame {
  position: relative;
  margin-top: 60px !important;
  padding-right: 25px;
  border: 1px solid #c7c6c1;
  break-inside: avoid;
  height: 295mm;
}

#head {
   position: fixed;
   display:flex;
    width: 100%;
    background-color: transparent;
    top: 0;
    height: 10px;
}

.frame2 {
  margin-top: 60px !important;
  padding:0 25px 0 0;
  border-top: 1px solid #c7c6c1;
  position: relative;
}

.no-print {
	display: none;
}

.colorDelivery {
	background: #e67b7d;
	-webkit-print-color-adjust: exact;
}

.fixed {
	position: fixed;
	bottom: 0;
	display: flex !important;
	width: 793px;
}

.pl-1 {
	padding-left: 10px;
}

.pl-2 {
	margin-left: 70px
}

.page-break {
	page-break-after: always;
}

.page-break-2 {
	page-break-before: always;
}

.mt-20 {
	margin-top: 10px;
}

.height {
	height: 80px !important;
}

.back {
	width: 50%;
}

.back-mini {
	width: 40%;
}

.alignment {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.alignment-2 {
	display: flex;
	align-items: center;
}

.alignment-3 {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

  .green-box {
  width: 15px;
  height: 15px;
  border-radius: 5px;
  background-color: #ccf265;
  margin-right:5px;
}
.red-box {
  width: 15px;
  height: 15px;
  border-radius: 5px;
  background-color: #B53330;
  margin-right:5px;
  -webkit-print-color-adjust: exact;
}

div.background {
  font-size: 42px;
	margin-top: -40px;
  margin-left: 25px;
  z-index: 3;
  line-height: 45px;
}

div.background span {
  background:#fff;
	color: #000;
	font-weight: 300;
  letter-spacing: normal;
  padding: 0 10px;
}

div.background strong {
  background:#fff;
	color: #d8252c;
	font-weight: 800;
  letter-spacing: normal;
  padding: 0 10px;
}

div.birevim {
	color: #404341;
  font-size: 18px;
  font-weight: bold;
	background-color: #fff;
  margin-top: -65px;
  background: #fff;
  z-index: 2;
	margin-right: 10px;
	font-weight: bold;
	padding: 0 10px;
}
div.background-small {
	font-size: 36px;
	font-weight: 300;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: normal;
	color: #cc242b;
	margin-left: 25px;
}

div.background-small-2 {
	height: 30px;
	background: #c51315;
	position: relative;
	justify-content: center;
	align-items: center;
	display: flex;
	font-size: 18px;
	color: #fff;
	border-top-left-radius: 8px;
	-webkit-print-color-adjust: exact;
}

div.background-small-2:before {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	border-top: 30px solid white;
	border-right: 15px solid #c51315;
	width: 0px;
	-webkit-print-color-adjust: exact;
}

.w-75 {
	width: 75%;
}

.saving-plan-proposal .table-row {
	padding: 5px 0;
	font-size: 14px;
}

.saving-plan-proposal .table-row .table-cell:first-child {
	width: 150px;
}

.saving-plan-proposal .table-row .table-cell:nth-child(2) {
	width: 35px;
}

.proposal-detail-table {
	border-collapse: separate;
	border-spacing: 5px;
}

.proposal-detail-table .table-cell {
	border: 1px solid rgb(213, 222, 216);
	padding: 8px;
	border-radius: 5px;
}

.proposal-detail-table .table-cell.campaign {
	padding: 0 10px !important;
}

.proposal-detail-table .table-row .table-cell:first-child {
	width: 200px !important;
}

.dotted {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px dotted #000;
	border-radius: 5px;
  margin: 0px 0 15px 20px;
  font-weight: 300;
}

.dotted img:first-child {
	margin-right: 10px;
}

.delivery {
  height: 20px;
	width: 95%;
	border-radius: 5px;
	background-color: #404341;
	color: #fff;
	display: flex;
	align-items: center;
	-webkit-print-color-adjust: exact;
  margin-left: 20px;
  padding: 10px 5px;
}
.delivery img {
  position: relative;
  top: 5px;
}
.pbbb {
  overflow: hidden !important;
  page-break-inside: avoid;
}

.customer-representative-table .table-row-group .table-row:first-child .table-cell {
	width: 33%;
}

.customer-representative-table .table-row-group .table-row:first-child .table-cell:first-child {
	border-top-left-radius: 5px;
}

.customer-representative-table .table-row-group .table-row:first-child .table-cell:last-child {
	border-top-right-radius: 5px;
}

.customer-representative-table .table-row-group .table-row:nth-child(2) {
	width: 100%;
}

.payment-plan {
	width: 100%;
}

.payment-plan .table-row-group .table-row .table-cell {
	border: 1px dotted #000;
	padding: 5px;
	text-align: center;
}

.payment-plan .table-row-group .table-row .table-cell:nth-child(2),
.payment-plan .table-row-group .table-row .table-cell:nth-child(3),
.payment-plan .table-row-group .table-row .table-cell:nth-child(4),
.payment-plan .table-row-group .table-row .table-cell:nth-child(5) {
	border-left: none;
}

.payment-plan .table-row-group .table-row {
	-moz-border-radius: 10px;
	-webkit-border-radius: 10px;
	border-radius: 10px;
}

.payment-plan .table-row-group .table-row>div:first-child {
	border-radius: 10px 0 0 10px;
	-moz-border-radius: 10px 0 0 10px;
}

.payment-plan .table-row-group .table-row>div:last-child {
	border-radius: 0 10px 10px 0;
	-moz-border-radius: 0 10px 10px 0;
}

.payment-plan .table-row-group .table-row .table-cell.head {
	font-weight: bold;
}

.payment-plan .table-row-group .table-row:nth-child(23n) {
	font-weight: bold;
	margin-bottom: 25px;
}

.campaign {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.campaign span:nth-child(2) {
	border: 3px solid #ce242b;
	padding: 5px;
	color: #ce242b;
	font-weight: 500;
	-webkit-print-color-adjust: exact;
}

.version3-table thead tr th,
.version3-table tbody tr td {
	border: 1px dotted #c7c6c1;
	padding: 5px;
}
.version3-table thead tr th:first-child {
  border-top-left-radius: 5px;
}
.version3-table thead tr th:last-child {
  border-top-right-radius: 5px;
}
.version3-table tbody tr:last-child td:first-child {
  border-bottom-left-raidus: 5px;
}
.version3-table tbody tr:last-child td:last-child {
  border-bottom-right-raidus: 5px;
}

ul li {
	font-size: 12px;
	font-weight: 100;
}`,
      isPrinting: false,
      isShowFull: false,
      deliveryTerm: 0,
      // salary: 5000,
      // ratio: 0.07,
      organizationDetails: [],
      organizationFixedPhone: '',
      organizationMobilePhone: '',
      organizationMail: '',
      organizationName: '',
      employeeDetails: [],
      employeeFixedPhone: '',
      employeeMobilePhone: '',
      employeeMail: '',
      initialPlan: {},
      sendProposalDialog: false,
      totalPayment: 0,
      constantVals: {
        totalAmount: 0,
        totalMonth: 0,
        installment: 0,
        financeType: 'house',
        workingCostAmount: 0,
        workingCostRatio: 0,
        advanceRatio: 0,
        advanceAmount: 0,
        deliveryTerm: 0,
        campaignName: '',
        addionalMonth: 0
      },
      usage: null,
      // ibanList: [
      //   {
      //     bankName: 'Ziraat Bankası',
      //     iban: 'TR31 0001 0008 2479 1637 9950 01',
      //     accountNo: '79163799-5001',
      //     branchCode: '824',
      //     branchName: 'Bağlarbaşı'
      //   },
      //   {
      //     bankName: 'Türkiye Finans',
      //     iban: 'TR72 0020 6003 1903 1370 4700 01',
      //     accountNo: '3137047-1',
      //     branchCode: '319',
      //     branchName: 'Örnek Mahallesi'
      //   },
      //   {
      //     bankName: 'Albaraka',
      //     iban: 'TR44 0020 3000 0387 7611 0000 01',
      //     accountNo: '11-3877611-1',
      //     branchCode: '1',
      //     branchName: 'Kadıköy'
      //   },
      //   {
      //     bankName: 'Kuveyt Türk',
      //     iban: 'TR03 0020 5000 0939 9508 1000 03',
      //     accountNo: '93995081-1',
      //     branchCode: '80',
      //     branchName: 'Kozyatağı'
      //   },
      //   {
      //     bankName: 'Ziraat Katılım',
      //     iban: 'TR12 0020 9000 0010 3979 0000 01',
      //     accountNo: '103979-1',
      //     branchCode: '8',
      //     branchName: 'Üsküdar'
      //   },
      //   {
      //     bankName: 'Vakıfbank',
      //     iban: 'TR37 0001 5001 5800 7307 3940 75',
      //     accountNo: '158007307394075',
      //     branchCode: '311',
      //     branchName: 'Altunizade'
      //   },
      //   {
      //     bankName: 'Halkbank',
      //     iban: 'TR97 0001 2001 3150 0010 1005 36',
      //     accountNo: '10100536',
      //     branchCode: '1315',
      //     branchName: 'Altunizade'
      //   },
      //   {
      //     bankName: 'Yapı Kredi',
      //     iban: 'TR48 0006 7010 0000 0052 6593 70',
      //     accountNo: '52659370',
      //     branchCode: '397',
      //     branchName: 'Kısıklı Caddesi'
      //   },
      //   {
      //     bankName: 'Türkiye İş Bankası',
      //     iban: 'TR43 0006 4000 0011 2170 5461 19',
      //     accountNo: '1217-0546119',
      //     branchCode: '1217',
      //     branchName: 'Altunizade'
      //   }
      // ],
      selectedDeliveryTerm: null,
      standardList: null,
      campaignList: null,
      customerEmail: '',
      userCode: '',
      paymentPlan: {}
    }
  },
  computed: {
  

  },
  mounted() {

  },
  activated() {
  },
  created() {
    this.createPayingPlan()
    this.getFirstPayment()
  },
  methods: {
   
    getFirstPayment() {
      this.busy = true
      partnerApi.getFirstPayment(this.calculationId)
        .then((v) => {
          this.firstPayment = v.data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.busy = false
        })
    },
    createPayingPlan() {
      partnerApi
        .createPayingPlan(this.calculationId)
        .then((v) => {
          this.paymentPlan = v.data.result
          console.log('paymentPlan : ', this.paymentPlan)
          if (this.blockedAmount > 0) {
            this.applyBlockedFundToPlan(this.blockedAmount)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    applyBlockedFundToPlan(amount) {
      for (let index = this.paymentPlan.paymentPlan.length - 1; amount > 0; index--) {
        if (index < 0) break
        var element = this.paymentPlan.paymentPlan[index]
        if (amount < element.remainAmount) {
          element.remainAmount = element.remainAmount - amount
          element.paymentStatusText = 'Kısmi Ödeme'
          element.paymentStatus = 'partialpayed'
          amount = 0
        } else {
          amount = amount - element.remainAmount
          element.paymentStatus = 'payed'
          element.paymentStatusText = 'Ödenmiş'
          element.remainAmount = 0
        }
      }
    },
    printDocument() {
      const d = new Printd()
      var currentStat = this.isShowFull
      this.isShowFull = true
      // opens the "print dialog" of your browser to print the element
      this.isPrinting = true
      this.$nextTick(() => {
        d.print(document.getElementById('printTable'), [this.cssText])
        this.isShowFull = currentStat
        this.isPrinting = false
      })
    },
    dateCompare(date) {
      var options = { year: 'numeric', month: 'numeric' }
      var paymentDate = new Date(date)
      if (this.deliveryDate !== undefined || this.deliveryDate !== null) {
        var newDeliveryDate = new Date(this.deliveryDate.exactDeliveryDate !== null ? this.deliveryDate.exactDeliveryDate : this.deliveryDate.iDeliveryDate)
        paymentDate = paymentDate.toLocaleDateString('tr-TR', options)
        newDeliveryDate = newDeliveryDate.toLocaleDateString('tr-TR', options)
        if (paymentDate === newDeliveryDate) {
          console.log('paymentDate: ', paymentDate)
          console.log('newDeliveryDate: ', newDeliveryDate)
          return true
        }
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.logo {
  display: none;
}
.text {
  display: none;
}
.el-dialog{
  width: 850px !important;
}
#printTable {
  font-family:'Roboto', sans-serif;
}
.frame2{
  padding-top: 100px;
}
@media print {
  .frame {
    position: relative;
        border: 1px solid #404341;
        padding:10px;
        margin-top:50px;
        height: calc(100vh - 50px);
      }
  .colorDelivery {
        background-color: #e67b7d;
      }
}
.pl-1 {
  padding-left:10px;
}
.pl-2{
  margin-left: 70px;
}
div.background {
    font-size: 42px;
    margin-top: -60px;
    margin-left: 25px;
}
div.background span {
  color: #000;
  font-weight: 300;
  letter-spacing: normal;
}
div.background strong {
  color: #d8252c;
  font-weight: bold;
  letter-spacing: normal;
}
div.birevim {
  color: #3d403f;
  font-size: 24px;
  font-weight: bold;
  background-color: #fff;
  margin-top: -20px;
  margin-right: 10px;
}
div.background-2 {
    height: 50px;
    background: #c51315;
    position: relative;
    justify-content: center;
    align-items: center;
    display: flex;
    font-size: 24px;
    color: #fff;
    border-top-right-radius: 8px;
}

div.background-2:before {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    border-top: 50px solid white;
    border-right: 20px solid #c51315;
    width: 1px;
}
div.background-small {
  font-size: 36px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #cc242b;
  margin-left: 25px;
}
.saving-plan-proposal .table-row {
    padding: 5px 0;
    font-size: 14px;
    font-weight: normal;
    .table-cell:first-child {
        width: 150px;
    }
    .table-cell:nth-child(2) {
        width: 35px;
    }
}

.proposal-detail-table {
  border-collapse:separate;
  border-spacing:5px;
  font-size: 14px;
}

.proposal-detail-table .table-cell {
  border: 1px solid rgb(213, 222, 216);
  padding: 10px;
  border-radius: 5px;
}
.proposal-detail-table .table-cell.campaign {
  padding: 0 10px !important;
}
.proposal-detail-table .table-row .table-cell:first-child {
  width: 200px !important;
}
.mt-20 {
  margin-top: 20px;
}
.dotted {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px dotted #000;
  border-radius: 5px;
  margin: 0px 0 15px 20px;
  img:first-child {
    margin-right: 10px;
  }
}
ul li {
  font-size: 12px;
  font-weight: 100;
}
.delivery {
  height: 30px;
  width:100%;
  border-radius: 5px;
  background-color: #404341;
  color: #fff;
  display: flex;
  align-items: center;
  margin-left: 20px;
  padding: 20px 5px;
}
.customer-representative-table .table-row-group .table-row .table-cell {
  text-align: center;
}
.customer-representative-table .table-row-group .table-row:first-child .table-cell {
  width: 33%;
}
.customer-representative-table .table-row-group .table-row:first-child .table-cell:first-child {
  border-top-left-radius: 5px;
}
.customer-representative-table .table-row-group .table-row:first-child .table-cell:last-child {
  border-top-right-radius: 5px;
}
.customer-representative-table .table-row-group .table-row:nth-child(2) {
  width: 100%;
}
  .green-box {
  width: 15px;
  height: 15px;
  border-radius: 5px;
  background-color: #ccf265;
  margin-right:5px;
}
.red-box {
  width: 15px;
  height: 15px;
  border-radius: 5px;
  background-color: #B53330;
  margin-right:5px;
  -webkit-print-color-adjust: exact;
}
.alignment-2 {
  display:flex;
  align-items:center;
}
.payment-plan {
  width: 100%;
}
.payment-plan .table-row-group .table-row .table-cell {
  border: 1px dotted #000;
  padding: 5px;
  text-align: center;
}
.payment-plan .table-row-group .table-row {
  -moz-border-radius:10px;
   -webkit-border-radius:10px;
   border-radius:10px;
   margin-top: 20px;
}
.payment-plan .table-row-group .table-row > div:first-child {
  border-radius: 10px 0 0 10px;
  -moz-border-radius: 10px 0 0 10px;
}

.payment-plan .table-row-group .table-row > div:last-child {
  border-radius: 0 10px 10px 0;
  -moz-border-radius: 0 10px 10px 0;
}
.payment-plan .table-row-group .table-row .table-cell.head {
  font-weight: bold;
}
.payment-plan .table-row-group .table-row .table-cell:nth-child(2), .payment-plan .table-row-group .table-row .table-cell:nth-child(3), .payment-plan .table-row-group .table-row .table-cell:nth-child(4), .payment-plan .table-row-group .table-row .table-cell:nth-child(5) {
  border-left: none;
}
.payment-plan .table-row-group .table-row:nth-child(25n) {
  page-break-after: always;
}
.campaign {
  display: flex;
  align-items: center;
  justify-content: space-between;
  span:nth-child(2) {
    border: 3px solid #ce242b;
    padding: 5px;
    color: #ce242b;
    font-weight: 500;
  }
}

.version3-table thead tr th,
.version3-table tbody tr td {
	border: 1px dotted #c7c6c1;
	padding: 5px;
}
.version3-table thead tr th:first-child {
  border-top-left-radius: 5px;
}
.version3-table thead tr th:last-child {
  border-top-right-radius: 5px;
}
.version3-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 5px;
}
.version3-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 5px;
}

.qr-desc {
        font-size:14px;
        font-weight:300;
      }
</style>

