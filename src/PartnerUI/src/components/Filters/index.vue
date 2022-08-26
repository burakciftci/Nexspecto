<template>
  <div>
    <el-row>
      <el-col :md="7" :lg="8" :xl="12" style="display: inline-flex;">
        <div :class="currentComponent=='yesterday'?'speech-bubble':'speech-bubble-inactive'" style="padding:0 10px;" @click="currentComponent='yesterday'">Dün</div>
        <div :class="currentComponent=='today'?'speech-bubble':'speech-bubble-inactive'" style="padding:0 10px;" @click="currentComponent='today'">Bugün</div>
        <div :class="currentComponent=='week'?'speech-bubble':'speech-bubble-inactive'" style="padding:0 10px;" @click="currentComponent='week'">Bu Hafta</div>
        <div :class="currentComponent=='month'?'speech-bubble':'speech-bubble-inactive'" style="padding:0 10px;" @click="currentComponent='month'">Bu Ay</div>
        <div :class="currentComponent=='year'?'speech-bubble':'speech-bubble-inactive'" style="padding:0 10px;" @click="currentComponent='year'">Bu Yıl</div>
        <div :class="currentComponent=='all'?'speech-bubble':'speech-bubble-inactive'" style="padding:0 10px;" @click="currentComponent='all'">Tümü</div>
      </el-col>
      <el-col :md="4" :lg="3" :xl="3" :offset="1" style="padding-top:15px;">
        <div style="color: #1a84ff;" @click="openPanel">{{ 'Detaylı Arama' }}</div>
      </el-col>
      <el-col :md="6" :lg="6" :xl="4" style="padding-right: 25px;">
        <el-input
          v-model="query"
          :placeholder="('Ad Soyad')"
          autofocus
          prefix-icon="el-icon-search"
          clearable
          style="margin-top:5px;"
        />
      </el-col>
      <el-col :md="6" :lg="6" :xl="4" style="padding-top:5px;">
        <el-select v-model="value" style="width:48%" clearable placeholder="Organizasyon">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select v-model="value2" style="width:48%" clearable placeholder="Lütfen Bölge Seçiniz">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-col>
    </el-row>
    <div type="flex" justify="space-between" style="position:absolute;z-index:8;width:100%;">
      <div v-if="searchVisible" style="width:100%;">
        <el-row style="z-index:1;padding:15px;object-fit: contain;border-radius: 4px;box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);border: solid 2px #1a84ff;background-color: #ffffff;height:170px;" @blur="searchVisible=false">
          <el-form >
            <el-row type="flex" justify="space-between">
              <el-col :md="9" :lg="9" :xl="9">
                <el-form-item>
                  <div class="block">
                    <el-date-picker
                      v-model="valueDate"
                      :picker-options="pickerOptions"
                      type="daterange"
                      align="right"
                      start-placeholder="Başlangıç Tarihi"
                      end-placeholder="Bitiş Tarihi"
                      default-value="2010-10-01"/>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :md="8" :lg="8" :xl="8">
                <el-form-item :label-position="left" label="Adres">
                  <el-select v-model="value3" class="city" style="width:45%;">
                    <el-option
                      v-for="item in options3"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                  <el-select v-model="value3" class="city" style="width:45%;">
                    <el-option
                      v-for="item in options3"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="7" :lg="7" :xl="7">
                <el-form-item>
                  <el-select placeholder="Gelişmiş Sıralama" style="float:right;">
                    <el-option
                      v-for="item in options5"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :md="7" :lg="7" :xl="7">
                <el-form-item :label-position="left" label="TCKN" label-width="40px">
                  <el-input v-model="input" placeholder="tckn"/>
                </el-form-item>
              </el-col>
              <el-col :md="7" :lg="7" :xl="7">
                <el-form-item :label-position="left" label="Muhattap No" label-width="100px">
                  <el-input v-model="input" placeholder="muhattap no"/>
                </el-form-item>
              </el-col>
              <el-col :md="7" :lg="7" :xl="7">
                <el-form-item :label-position="left" label="Telefon" label-width="50px">
                  <el-input v-model="input" placeholder="telefon"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        firstDayOfWeek: 1
      },
      currentComponent: 'today',
      options: [{
        value: 'Birevim',
        label: 'Birevim'
      }],
      value: 'Birevim',
      options2: [{
        value: 'Marmara',
        label: 'Marmara'
      },
      {
        value: 'İç Anadolu',
        label: 'İç Anadolu'
      },
      {
        value: 'Akdeniz',
        label: 'Akdeniz'
      },
      {
        value: 'Ege',
        label: 'Ege'
      }],
      options3: [{
        value: 'İstanbul',
        label: 'İstanbul'
      },
      {
        value: 'Ankara',
        label: 'Ankara'
      },
      {
        value: 'İzmir',
        label: 'İzmir'
      },
      {
        value: 'Kayseri',
        label: 'Kayseri'
      }],
      options4: [{
        value: 'Açık',
        label: 'Açık'
      },
      {
        value: 'Kapalı',
        label: 'Kapalı'
      }],
      options5: [{
        value: 'İsime Göre (A-Z)',
        label: 'İsime Göre (A-Z)'
      },
      {
        value: 'İsime Göre (Z-A)',
        label: 'İsime Göre (Z-A)'
      }],
      value2: 'Bölgeler',
      value3: 'İl-ilçe seçiniz',
      value4: 'Durum',
      valueDate: '',
      input: '',
      searchVisible: false,
      query: '',
      listQuery: {
        page: 1,
        limit: 20,
        isArchive: false,
        isActive: true,
        query: '',
        orderby: '',
        districtId: '',
        provinceId: '',
        organizationId: ''
      }
    }
  },
  methods: {
    openPanel() {
      this.searchVisible = !this.searchVisible
    }
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 1200px) and (max-width: 1440px) {
 .speech-bubble-inactive{
  margin-right: 0px;
  margin-left: 0px;
}
.el-col-offset-1{
  margin-left: 0%;
}
}
</style>
