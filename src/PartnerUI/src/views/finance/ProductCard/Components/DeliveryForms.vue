<template>
  <div class="app-container">
    <div>
      <el-button type="secondary" @click="printDocument()">
        Teslim Formu Yazdır
      </el-button>
    </div>
    <div id="printTable">
      <div class="personal-info">KİŞİSEL BİLGİLER</div>
      <div :class="financeType==='Konut'?'':'small'" class="control-list">TASARRUF TAHSİS KONTROL LİSTESİ</div>
      <div :class="financeType==='Konut'?'':'small'" class="approve-control-list">TASARRUF FİNANS ONAY KONTROL LİSTESİ</div>
      <div style="position:absolute;right:-10px;bottom:-15px;background:#fff;padding:10px;" class="logo"><img src="https://teba.tech/img/birevim/birevim_svg.svg" alt="" style="width:215px;height:33px;"></div>
      <div style="position:absolute;left:20px;bottom:-25px;background:#fff;padding:10px;"><img src="../../../../assets/img/birevim/birlikte_logo.svg" alt=""></div>
      <el-row type="flex" justify="space-between" align="middle" class="alignment">
        <div class="background">
          <span>{{ financeType==='Taşıt'?'Taşıt':financeType==='Konut'?'Gayrimenkul':financeType==='Çatılı İş Yeri'?'Çatılı İş Yeri':'Tasarruf' }}</span>
          <img v-if="financeType==='Taşıt'" src="../../../../assets/img/birevim/icon-car.svg" alt="" class="icon-car">
          <img v-if="financeType==='Konut'" src="../../../../assets/img/birevim/icon-home.svg" alt="" class="icon-home">
          <img v-if="financeType==='Tasarruf'" src="../../../../assets/img/birevim/icon-tasarruf.svg" alt="" class="icon-tasarruf">
          <img v-if="financeType==='Çatılı İş Yeri'" src="../../../../assets/img/birevim/isyeri.png" alt="" class="icon-tasarruf">
          <br>
          <strong>Teslim Formu</strong>
        </div>
        <div class="birevim">444 23 53 | birevim.com</div>
      </el-row>
      <el-row class="area-one">
        <el-col :span="12" class="area-left">
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Proje Kodu' }}</div>
                <div class="divTableCell width-10">{{ ':' + ' ' }}</div>
                <div class="divTableCell"> {{ projectCode }}</div>
              </div>
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Adı Soyadı' }}</div>
                <div class="divTableCell width-10">:</div>
                <div class="divTableCell"> {{ customerName }}</div>
              </div>
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Proje Tutarı' }}</div>
                <div class="divTableCell width-10">:</div>
                <div class="divTableCell"> {{ financeAmount | formatTRY }}</div>
              </div>
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Vekalet T./Risk T.' }}</div>
                <div class="divTableCell width-10">:</div>
                <div class="divTableCell">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/{{ riskAmount | formatTRY }}</div>
              </div>
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Grup Türü/No' }}</div>
                <div class="divTableCell width-10">:</div>
                <div class="divTableCell"> {{ ' ' }}</div>
              </div>
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Telefon' }}</div>
                <div class="divTableCell width-10">:</div>
                <div class="divTableCell">{{ '0' + phoneNumber }}</div>
              </div>
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Meslek' }}</div>
                <div class="divTableCell width-10">:</div>
                <div class="divTableCell"> {{ ' ' }}</div>
              </div>
              <div class="divTableRow border-bottom-row">
                <div class="divTableCell width-160">{{ 'İl / Şube' }}</div>
                <div class="divTableCell">:</div>
                <div class="divTableCell"> <span v-if="provinceName">{{ provinceName + '/' }}</span> <span>{{ branchName }}</span></div>
                <!-- <div class="divTableCell"><span>{{ branchName }}</span></div> -->
              </div>
              <div v-if="financeType==='Konut'" class="divTableRow border-bottom-row">
                <div class="divTableCell width-160">{{ 'Piyasa Satış Değ.' }}</div>
                <div class="divTableCell">:</div>
                <div class="divTableCell"> {{ ' ' }}</div>
              </div>
              <div v-if="financeType==='Konut'" class="divTableRow border-bottom-row">
                <div class="divTableCell width-120">{{ 'Acil Satış Değ.' }}</div>
                <div class="divTableCell width-10">:</div>
                <div class="divTableCell"> {{ ' ' }}</div>
              </div>
            </div>
          </div>
          <div class="flex mt-30">
            <div class="flex mr-5">
              <div :class="methodType==='ordered'?'checked':''" class="checkbox mr-5"/>
              <div>Sıra Tespitli Yöntem</div>
            </div>
            <div class="flex">
              <div :class="methodType==='freeplan'?'checked':''" class="checkbox mr-5"/>
              <div>Serbest Planlı Yöntem</div>
            </div>
          </div>
          <div class="mt-40">
            <div class="commentary-info">
              <span>ŞERH BİLGİSİ:</span>
              <span>....................................................
              ..................................................................................
              ..................................................................................
              ..................................................................................
              ..................................................................................
              ..................................................................................
              ..................................................................................
              ..................................................................................</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="financeType==='Çatılı İş Yeri'">
            <el-row v-for="item in storeControlList" :key="item.id" type="flex" justify="start" align="middle" class="cont-list mb-5">
              <div class="flex mr-5">
                <div :class="item.text1===''?'none':''" class="checkbox mr-5"/>
                <div class="width-135">{{ item.text1 }}</div>
              </div>
              <div class="flex">
                <div :class="item.text2===''?'none':''" class="checkbox mr-5"/>
                <div>{{ item.text2 }}</div>
              </div>
            </el-row>
          </div>
          <div v-if="financeType==='Konut'">
            <el-row v-for="item in homeControlList" :key="item.id" type="flex" justify="start" align="middle" class="cont-list mb-5">
              <div class="flex mr-5">
                <div :class="item.text1===''?'none':''" class="checkbox mr-5"/>
                <div class="width-135">{{ item.text1 }}</div>
              </div>
              <div class="flex">
                <div :class="item.text2===''?'none':''" class="checkbox mr-5"/>
                <div>{{ item.text2 }}</div>
              </div>
            </el-row>
          </div>
          <div v-if="financeType==='Taşıt'">
            <el-row v-for="item in carControlList" :key="item.id" type="flex" justify="start" align="middle" class="cont-list mb-5">
              <div class="flex mr-5">
                <div :class="item.text1===''?'none':''" class="checkbox mr-5"/>
                <div class="width-135">{{ item.text1 }}</div>
              </div>
              <div class="flex">
                <div :class="item.text2===''?'none':''" class="checkbox mr-5"/>
                <div>{{ item.text2 }}</div>
              </div>
            </el-row>
          </div>
          <div v-if="financeType==='Tasarruf'">
            <el-row v-for="item in savingControlList" :key="item.id" type="flex" justify="start" align="middle" class="cont-list mb-5">
              <div class="flex mr-5">
                <div :class="item.text1===''?'none':''" class="checkbox mr-5"/>
                <div class="width-135">{{ item.text1 }}</div>
              </div>
              <div class="flex">
                <div :class="item.text2===''?'none':''" class="checkbox mr-5"/>
                <div>{{ item.text2 }}</div>
              </div>
            </el-row>
          </div>
          <div class="mt-30">
            <el-row v-for="item in approveList" :key="item.id" :style="(financeType==='Tasarruf'||financeType==='Taşıt')&&(item.id===15||item.id===16||item.id===17)?false:financeType==='Konut'&&item.id===14?'margin-bottom:0px;':''" class="approve-list mb-5" >
              <div v-show="(financeType==='Tasarruf'||financeType==='Taşıt')&&(item.id===15||item.id===16||item.id===17)?false:financeType==='Konut'&&item.id===14?false:true" class="flex">
                <div class="checkbox mr-5"/>
                <div>{{ item.text }}</div>
              </div>
            </el-row>
          </div>
          <div :class="financeType==='Konut'?'mt-20':'mt-30'">
            <el-row>
              <div class="delivery-title mb-10">TESLİMAT ÖDEME ŞEKLİ</div>
              <div class="flex">
                <div class="flex mr-5">
                  <div class="checkbox mr-5"/>
                  <div class="width-135">{{ 'EFT/Havale' }}</div>
                </div>
                <div class="flex">
                  <div class="checkbox mr-5"/>
                  <div>{{ 'Bloke Çek' }}</div>
                </div>
              </div>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row class="mt-20">
        <el-col :span="12">
          <table class="blueTable">
            <tbody>
              <tr>
                <td class="p-relative">
                  <span>
                    TASARRUF TAHSİS <br> YETKİLİSİ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
                <td class="p-relative">
                  <span>
                    TASARRUF TAHSİS <br> YÖNETMENİ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="p-relative">
                  <span>
                    TASARRUF TAHSİS <br> MÜDÜRÜ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="12">
          <table class="blueTable2">
            <tbody>
              <tr>
                <td class="p-relative">
                  <span>
                    TASARRUF FİNANS <br>  ONAY YETKİLİSİ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
                <td class="p-relative">
                  <span>
                    TASARRUF FİNANS <br>  ONAY YÖNETMENİ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="p-relative">
                  <span>
                    TASARRUF FİNANS<br>ONAY MÜDÜRÜ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
              </tr>
              <tr>
                <td class="p-relative">
                  <span>
                    TASARRUF TAHSİS <br> MÜDÜRÜ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
                <td class="p-relative">
                  <span>
                    ARŞİV <br>GÖREVLİSİ
                  </span>
                  <div class="date-area">...../...../......</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between" class="mt-10">
        <div class="revision-date">Son Revizyon Tarihi: -</div>
        <div v-if="financeType==='Konut'" class="release-date">Yayın Tarihi: 16.10.2020 TOD-F001/00</div>
        <div v-if="financeType==='Taşıt'" class="release-date">Yayın Tarihi: 16.10.2020 TOD-F002/00</div>
        <div v-if="financeType==='Tasarruf'" class="release-date">Yayın Tarihi: 16.10.2020 TOD-F003/00</div>
        <div v-if="financeType==='Çatılı İş Yeri'" class="release-date">Yayın Tarihi: 16.10.2020 TOD-F004/00</div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Printd } from 'printd'
// import lookupApi from '@/api/finance/lookup'
// import productApi from '@/api/finance/productRisk'
import partnerApi from '@/api/finance/partner'

export default {
  props: {
    calculationId: {
      type: Number,
      default: null
    },
    customerName: {
      type: String,
      default: null
    },
    projectCode: {
      type: String,
      default: null
    },
    partyId: {
      type: String,
      default: null
    },
    financeType: {
      type: String,
      default: null
    },
    financeAmount: {
      type: String,
      default: null
    },
    methodType: {
      type: String,
      default: null
    },
    branchName: {
      type: String,
      default: null
    },
    provinceName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      phoneNumber: '',
      riskAmount: '',
      savingControlList: [
        {
          id: 1,
          text1: 'Vekaletname',
          text2: 'Kefil Gelir Belgesi'
        },
        {
          id: 2,
          text1: 'Kimlik Fotokopisi',
          text2: 'Transfer Talimat D.'
        },
        {
          id: 3,
          text1: 'İkametgah/Fatura',
          text2: 'Teslimat Msf. Kes. D.'
        },
        {
          id: 4,
          text1: 'Gelir Belgesi',
          text2: 'Senet İmza Tutanağı'
        },
        {
          id: 5,
          text1: 'Senet',
          text2: 'Teminat Mekt./Sen.'
        },
        {
          id: 6,
          text1: 'İmza Beyannamesi',
          text2: 'Araç Ruhsat F.kopisi'
        },
        {
          id: 7,
          text1: 'Kefil Kimlik F.kopisi',
          text2: 'Tapu'
        },
        {
          id: 8,
          text1: 'Kefil İkametgahı',
          text2: 'Muvafakatname'
        }
      ],
      carControlList: [
        {
          id: 1,
          text1: 'Vekaletname',
          text2: 'Kefil İkametgahı'
        },
        {
          id: 2,
          text1: 'Kimlik Fotokopisi',
          text2: 'Kefil Gelir Belgesi'
        },
        {
          id: 3,
          text1: 'İkametgah/Fatura',
          text2: 'Transfer Talimat D.'
        },
        {
          id: 4,
          text1: 'Gelir Belgesi',
          text2: 'Teslimat Msf. Kes. D.'
        },
        {
          id: 5,
          text1: 'Senet',
          text2: 'Senet İmza Tutanağı'
        },
        {
          id: 6,
          text1: 'İmza Beyannamesi',
          text2: 'Teminat Mekt./Sen.'
        },
        {
          id: 7,
          text1: 'Kefil Kimlik F.kopisi',
          text2: 'Araç Ruhsat F.kopisi'
        },
        {
          id: 8,
          text1: 'Tem. Yönt. İlşk. Bil.F',
          text2: ''
        }
      ],
      homeControlList: [
        {
          id: 1,
          text1: 'Vekaletname',
          text2: 'Kefil İkametgahı'
        },
        {
          id: 2,
          text1: 'Kimlik Fotokopisi',
          text2: 'Kefil Gelir Belgesi'
        },
        {
          id: 3,
          text1: 'İkametgah/Fatura',
          text2: 'Transfer Talimat D.'
        },
        {
          id: 4,
          text1: 'Gelir Belgesi',
          text2: 'Teslimat Msf. Kes. D.'
        },
        {
          id: 5,
          text1: 'Muvafakatname',
          text2: 'Senet İmza Tutanağı'
        },
        {
          id: 6,
          text1: 'Senet',
          text2: 'Teminat Mekt./Sen.'
        },
        {
          id: 7,
          text1: 'İmza Beyannamesi',
          text2: 'Tapu'
        },
        {
          id: 8,
          text1: 'Kefil Kimlik F.kopisi',
          text2: 'Tem. Yönt. İlşk. Bil.F'
        }
      ],
      storeControlList: [
        {
          id: 1,
          text1: 'Vekaletname',
          text2: 'Kefil İkametgahı'
        },
        {
          id: 2,
          text1: 'Kimlik Fotokopisi',
          text2: 'Kefil Gelir Belgesi'
        },
        {
          id: 3,
          text1: 'İkametgah/Fatura',
          text2: 'Transfer Talimat D.'
        },
        {
          id: 4,
          text1: 'Gelir Belgesi',
          text2: 'Teslimat Msf. Kes. D.'
        },
        {
          id: 5,
          text1: 'Senet İmza Tutanağı',
          text2: 'Senet'
        },
        {
          id: 6,
          text1: 'Teminat Mekt./Sen.',
          text2: 'İmza Beyannamesi'
        },
        {
          id: 7,
          text1: 'Tapu',
          text2: 'Kefil Kimlik F.kopisi'
        },
        {
          id: 8,
          text1: 'Tem. Yönt. İlşk. Bil.F',
          text2: ''
        }
      ],
      approveList: [
        { id: 1, text: 'Haftalık teslimat listesi uyumu' },
        { id: 2, text: 'Teslimat listesi harici finans onayı' },
        { id: 3, text: 'İmzalı sözleşmeyle sistemdeki tutar uyumu' },
        { id: 4, text: 'Teminat mektubu / senedi' },
        { id: 5, text: 'Teslimat tutarı ile talimat tutarı uyumu' },
        { id: 6, text: 'Teslimat masraflarının tahsilatı' },
        { id: 7, text: 'İlgili aya ait taksit ödemesi' },
        { id: 8, text: 'Kalan risk ile vekalet tutarı kontrolü' },
        { id: 9, text: 'Alıcı ve satıcı ad soyad kontrolü' },
        { id: 10, text: 'IBAN kontrolü' },
        { id: 11, text: 'Satış evraklarının kontrolü' },
        { id: 12, text: 'Sigorta poliçesi oluşturulması' },
        { id: 13, text: 'İpotek yazısı' },
        { id: 14, text: 'Oto ekspertiz raporu' },
        { id: 15, text: 'Sistemde teslimat onayı' },
        { id: 16, text: 'Tapu takyidat belgesi' },
        { id: 17, text: 'G değerlendirme raporu' }
      ],
      isShowFull: false,
      isPrinting: false,
      dialogVisible: false,
      cssText: `
      @import url("https://unpkg.com/element-ui/lib/theme-chalk/index.css");
      @import url("https://fonts.cdnfonts.com/css/roboto");
      #printTable {
        font-family:'Roboto';
        border: solid 0.4px #4d4d4d;
        position: relative;
        margin: 60px 18px 0 18px !important;
        width:210mm;
        height:297mm;
        background:#fff;
        display: block !important;
        -webkit-print-color-adjust: exact;
      }
      .alignment {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        -webkit-print-color-adjust: exact;
      }

      div.background strong {
        color: #d8252c;
        font-weight: 800;
        letter-spacing: normal;
        padding: 0 10px;
        -webkit-print-color-adjust: exact;
      }

      div.background img {
        position: absolute;
        background: #fff;
        margin-left: -10px;
      }

      div.background .icon-home {
        width: 45px;
      }

      div.background .icon-tasarruf {
        width: 40px;
      }

      div.birevim {
        color: #404341;
        font-size: 18px;
        font-weight: bold;
        background-color: #fff;
        margin-top: -55px;
        background: #fff;
        z-index: 2;
        margin-right: 10px;
        font-weight: bold;
        padding: 0 10px;
        -webkit-print-color-adjust: exact;
      }
      div.personal-info {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 36.8px;
        width: 420px;
        border: solid 1px #da0812;
        background-color: #ffffff;
        font-size: 24.8px;
        font-weight: 800;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.26;
        letter-spacing: normal;
        text-align: center;
        color: #e30613;
        transform-origin: center;
        transform: rotate(-90deg);
        position: absolute;
        left: -209px;
        top: 272px;
        -webkit-print-color-adjust: exact;
      }
      div.control-list {
        height: 36.8px;
        width: 174.8px;
        border: solid 1px #e30613;
        background-color: #ffffff;
        font-size: 13.2px;
        font-weight: 800;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.1;
        letter-spacing: normal;
        text-align: center;
        color: #e30613;
        position: absolute;
        left: 50%;
        top: 135px;
        transform: translateX(-60px) rotate(-90deg);
        transform-origin: center;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-print-color-adjust: exact;
      }
      .approve-control-list {
        height: 36.8px;
        width: 360px;
        border: solid 1px #e30613;
        background-color: #ffffff;
        font-size: 13.2px;
        font-weight: 800;
        font-stretch: normal;
        font-style: normal;
        line-height: 4.24;
        letter-spacing: normal;
        text-align: center;
        color: #e30613;
        position: absolute;
        left: 50%;
        top: 437px;
        transform: translateX(-152px) rotate(-90deg);
        transform-origin: center;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-print-color-adjust: exact;
      }
      .approve-control-list.small {
        top: 415px !important;
        width: 317px !important;
        transform: translateX(-130px) rotate(-90deg) !important;
      }
      .divTable{ display: table; border-collapse: collapse; }
      .divTableRow { display: table-row; }
      .divTableHeading { display: table-header-group;}
      .divTableCell, .divTableHead { display: table-cell;}
      .divTableHeading { display: table-header-group;}
      .divTableFoot { display: table-footer-group;}
      .divTableBody { display: table-row-group;}
      .area-one {
        margin-top: 15px;
        margin-left: 45px;
      }
      .area-one .el-col:last-child {
        padding-left: 40px;
      }
      .width-160 {
        width: 160px;
      }
      .width-120 {
        width: 120px;
      }
      .width-10 {
        width: 10px;
      }
      .width-135 {
        width: 135px;
      }
      .border-bottom-row {
        font-size: 14px;
        border-bottom: solid 0.4px #4d4d4d;
        -webkit-print-color-adjust: exact;
      }
      .border-bottom-row:last-child {
        border-bottom: none;
      }
      .border-bottom-row .divTableCell:nth-child(3) {
        width: 180px;
      }
      .border-bottom-row .divTableCell {
        padding-bottom: 10px;
        padding-top: 10px;
      }
      .checkbox {
        width: 15px;
        height: 15px;
        border: solid 0.5px #e30613;
        border-radius: 4px;
        -webkit-print-color-adjust: exact;
      }
      .checkbox.checked::before {
        content: "";
        display: inline-block;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        height: 12px;
        width: 6px;
        border-bottom: 2px solid #e30613;
        border-right: 2px solid #e30613;
        position: relative;
        left: 4px;
        bottom: 2px;
        -webkit-print-color-adjust: exact;
      }
      .flex {
        display: flex;
        justify-content: flex-end;
        align-content: center;
      }
      .mr-5 {
        margin-right: 5px;
      }
      .mb-5 {
        margin-bottom: 5px;
      }
      .mb-10 {
        margin-bottom: 10px;
      }
      .mt-10 {
        margin-top: 10px;
      }
      .mt-20 {
        margin-top: 20px;
      }
      .mt-30 {
        margin-top: 30px;
      }
      .mt-40 {
        margin-top: 40px;
      }
      .mt-50 {
        margin-top: 50px;
      }
      .mt-60 {
        margin-top: 60px;
      }
      .mt-75 {
        margin-top: 75px;
      }
      .mt-100 {
        margin-top: 100px;
      }
      .cont-list {
        font-size: 14px;
        font-weight: bold;
      }
      .approve-list {
        font-size: 14px;
        font-weight: bold;
      }
      .approve-list:first-child {
        margin-top: 30px;
      }
      .area-left {
        font-weight: bold;
      }
      .area-left div:nth-child(2) {
        font-size: 14px;
      }
      .delivery-title {
        font-size: 18.6px;
        font-weight: 800;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: normal;
        text-align: left;
        color: #e30613;
        -webkit-print-color-adjust: exact;
      }
      .commentary-info {
        line-height: 1.5;
      }
      .commentary-info span:first-child {
        font-size: 18.6px;
        color: #4d4d4d;
        font-weight: 800;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        -webkit-print-color-adjust: exact;
      }
      .commentary-info span:last-child {
        font-size: 14px;
        color: #b2b2b2;
        font-weight: 800;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        -webkit-print-color-adjust: exact;
      }
      table.blueTable {
        border: 0.6px solid #4d4d4d;
        border-right: none;
        border-left: none;
        background-color: #EEEEEE;
        width: 100.5%;
        text-align: left;
        border-collapse: collapse;
        -webkit-print-color-adjust: exact;
      }
      table.blueTable td {
        border: 0.6px solid #4d4d4d;
        border-left: none;
        padding: 3px 2px;
        -webkit-print-color-adjust: exact;
      }
      table.blueTable tbody td {
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        vertical-align: top;
        height: 135px;
      }
      table.blueTable tr {
        background: #fff;
        -webkit-print-color-adjust: exact;
      }
      table.blueTable2 {
        border: 0.6px solid #4d4d4d;
        border-right: none;
        background-color: #EEEEEE;
        width: 100.5%;
        text-align: left;
        border-collapse: collapse;
        -webkit-print-color-adjust: exact;
      }
      table.blueTable2 td {
        border: 0.6px solid #4d4d4d;
        padding: 3px 2px;
        -webkit-print-color-adjust: exact;
      }
      table.blueTable2 tbody td {
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        vertical-align: top;
      }
      table.blueTable2 tbody td:first-child {
        height: 88px;
      }
      table.blueTable2 tbody td:last-child {
        height: 87px;
      }
      table.blueTable2 tbody td:nth-child(2) {
        height: 88px;
      }
      table.blueTable2 tr {
        background: #fff;
      }
      .revision-date{
        font-size: 13px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        color: #9d9d9c;
        margin-left: 20px;
        -webkit-print-color-adjust: exact;
      }
      .release-date {
        font-size: 13px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        color: #9d9d9c;
        margin-right: 20px;
        -webkit-print-color-adjust: exact;
      }
      .none {
        visibility: hidden;
      }
      .p-relative {
        position: relative;
      }
      .date-area {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
      }
      `
    }
  },
  created() {
    this.getCustomerPhoneNumber()
    this.getRiskAmount()
  },
  methods: {
    getCustomerPhoneNumber() {
      this.busy = true
      partnerApi.getCustomerPhoneNumber(this.partyId)
        .then((v) => {
          // console.log(v.data)
          this.busy = false
          this.phoneNumber = v.data
          console.log('tel', this.phoneNumber)
        })
        .catch((err) => {
          this.busy = false
          console.log(err)
        })
    },
    getRiskAmount() {
      partnerApi
        .riskAmount(this.calculationId)
        .then((v) => {
          console.log('riskamount', v)
          this.riskAmount = v.data
          // this.busy = false
        })
        .catch(() => {
          this.$notify.error(this.$t('notify.error'))
          console.log('hataaaa')
          // this.busy = false
        })
    },
    printDocument() {
      const d = new Printd()
      this.$nextTick(() => {
        d.print(document.getElementById('printTable'), [this.cssText])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.cdnfonts.com/css/roboto");
#printTable {
  font-family:'Roboto';
  border: solid 0.4px #4d4d4d;
  position: relative;
  margin: 60px 18px 0 18px !important;
  width:210mm;
  height:297mm;
  background:#fff;
  display: none;
}
.alignment {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  color: #d8252c;
  font-weight: 800;
  letter-spacing: normal;
  padding: 0 10px;
}

div.background img {
  position: absolute;
  background: #fff;
}

div.background .icon-home {
  width: 45px;
}

div.background .icon-tasarruf {
  width: 40px;
}

div.birevim {
  color: #404341;
  font-size: 18px;
  font-weight: bold;
  margin-top: -55px;
  background: #fff;
  z-index: 2;
  margin-right: 10px;
  padding: 0 10px;
}
div.personal-info {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36.8px;
  width: 420px;
  border: solid 1px #da0812;
  background-color: #ffffff;
  font-size: 24.8px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.26;
  letter-spacing: normal;
  text-align: center;
  color: #e30613;
  transform-origin: center;
  transform: rotate(-90deg);
  position: absolute;
  left: -209px;
  top: 272px;
}
div.control-list {
  height: 36.8px;
  width: 161.8px;
  border: solid 1px #e30613;
  background-color: #ffffff;
  font-size: 13.2px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.1;
  letter-spacing: normal;
  text-align: center;
  color: #e30613;
  position: absolute;
  left: 50%;
  top: 129px;
  transform: translateX(-55px) rotate(-90deg);
  transform-origin: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.approve-control-list {
  height: 36.8px;
  width: 329px;
  border: solid 1px #e30613;
  background-color: #ffffff;
  font-size: 13.2px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 4.24;
  letter-spacing: normal;
  text-align: center;
  color: #e30613;
  position: absolute;
  left: 50%;
  top: 406px;
  transform: translateX(-138px) rotate(-90deg);
  transform-origin: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.approve-control-list.small {
  top: 386px !important;
  width: 290px !important;
  transform: translateX(-118px) rotate(-90deg) !important;
}
.divTable{ display: table; border-collapse: collapse; }
.divTableRow { display: table-row; }
.divTableHeading { display: table-header-group;}
.divTableCell, .divTableHead { display: table-cell;}
.divTableHeading { display: table-header-group;}
.divTableFoot { display: table-footer-group;}
.divTableBody { display: table-row-group;}
.area-one {
  margin-top: 15px;
  margin-left: 45px;
}
.area-one .el-col:last-child {
  padding-left: 40px;
}
.width-160 {
  width: 160px;
}
.width-120 {
  width: 120px;
}
.width-10 {
  width: 10px;
}
.width-135 {
  width: 135px;
}
.border-bottom-row {
  font-size: 14px;
  border-bottom: solid 0.4px #4d4d4d;
}
.border-bottom-row:last-child {
  border-bottom: none;
}
.border-bottom-row .divTableCell:nth-child(3) {
  width: 180px;
}
.border-bottom-row .divTableCell {
  padding-bottom: 10px;
  padding-top: 10px;
}
.checkbox {
  width: 15px;
  height: 15px;
  border: solid 0.5px #e30613;
  border-radius: 4px;
}
.checkbox.checked::before {
  content: "";
  display: inline-block;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  height: 12px;
  width: 6px;
  border-bottom: 2px solid #e30613;
  border-right: 2px solid #e30613;
  position: relative;
  left: 4px;
  bottom: 2px;
}
.flex {
  display: flex;
  justify-content: flex-end;
  align-content: center;
}
.mr-5 {
  margin-right: 5px;
}
.mb-5 {
  margin-bottom: 5px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mt-10 {
  margin-top: 10px;
}
.mt-20 {
  margin-top: 20px;
}
.mt-30 {
  margin-top: 30px;
}
.mt-40 {
  margin-top: 40px;
}
.mt-50 {
  margin-top: 50px;
}
.mt-60 {
  margin-top: 60px;
}
.mt-75 {
  margin-top: 75px;
}
.mt-100 {
  margin-top: 100px;
}
.cont-list {
  font-size: 14px;
  font-weight: bold;
}
.approve-list {
  font-size: 14px;
  font-weight: bold;
}
.approve-list:first-child {
  margin-top: 30px;
}
.area-left {
  font-weight: bold;
}
.area-left div:nth-child(2) {
  font-size: 14px;
}
.delivery-title {
  font-size: 18.6px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #e30613;
}
.commentary-info {
  line-height: 1.5;
}
.commentary-info span:first-child {
  font-size: 18.6px;
  color: #4d4d4d;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
}
.commentary-info span:last-child {
  font-size: 14px;
  color: #b2b2b2;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
}
table.blueTable {
  border: 0.6px solid #4d4d4d;
  border-right: none;
  border-left: none;
  background-color: #EEEEEE;
  width: 101%;
  text-align: left;
  border-collapse: collapse;
}
table.blueTable td {
  border: 0.6px solid #4d4d4d;
  border-left: none;
  padding: 3px 2px;
}
table.blueTable tbody td {
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  vertical-align: top;
  height: 135px;
}
table.blueTable tr {
  background: #fff;
}
table.blueTable2 {
  border: 0.6px solid #4d4d4d;
  border-right: none;
  background-color: #EEEEEE;
  width: 100.5%;
  text-align: left;
  border-collapse: collapse;
}
table.blueTable2 td {
  border: 0.6px solid #4d4d4d;
  padding: 3px 2px;
}
table.blueTable2 tbody td {
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  vertical-align: top;
  height: 90px;
}
table.blueTable2 tr {
  background: #fff;
}
.revision-date{
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #9d9d9c;
  margin-left: 20px;
}
.release-date {
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #9d9d9c;
  margin-right: 20px;
}
.none {
  visibility: hidden;
}
.p-relative {
  position: relative;
}
.date-area {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
}
</style>
