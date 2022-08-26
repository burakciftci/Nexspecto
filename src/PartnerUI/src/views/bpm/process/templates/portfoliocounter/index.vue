<template>
  <el-col v-loading="busy" :span="formItemContent.cols">
    <el-row>
      <el-form-item label="Portfoyü Aktarılcak Bmt" prop="bmtList" label-width="140px">
        <el-select v-loading="busy" v-model="value.formItems[index].value[0]" class="itemlabel" clearable>
          <el-option
            v-for="item in bmtList"
            :key="item.portfolioId"
            :label="item.portfolioName"
            :value="item.portfolioId"/>
        </el-select>
      </el-form-item>
    </el-row>
  </el-col>
</template>

<script>

import portfolioApi from '@/api/crm/portfolio'

export default {

  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    formItemContent: {
      type: Object,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  data() {
    return {
      busy: false,
      party: null,
      portfolioCounterType: null,
      bmtList: [],
      validation: {
        bmt: [
          { required: true, message: 'Doldurulmalıdır' }
        ]
      }
    }
  },
  mounted() {
    this.party = this.formItemContent.aliasBranch
    this.portfolioCounterType = this.formItemContent.aliasPortfolioCounter
  },
  created() {
  },
  methods: {
  },
  getBmtList() {
    portfolioApi.getBmtlistBySystem(this.party, this.portfolioCounterType)
      .then((v) => {
        this.bmtList = v.data
        this.busy = false
      })
      .catch((err) => {
        if (err.data.status === 400) {
          err.data.errors.DomainValidations.forEach((v) => {
            // eslint-disable-next-line
            this.$notify.error(this.$t(('crm.error.')+ v + '  '))
          })
        } else {
          this.$notify.error(this.$t('notify.error'))
        }
      })
  }
}
</script>

<style scoped>
.itemlabel {
  width:100%;
  height: 36px;
  line-height: 36px;
}
</style>

