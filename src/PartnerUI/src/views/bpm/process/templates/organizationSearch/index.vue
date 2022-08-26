<template>
  <el-form>
    <el-col>
      <el-form-item>
        <el-select
          v-loading="busyOrganization"
          :disabled="disabled"
          v-model="selectedPartyId"
          :remote-method="remoteOrganizationSearch"
          :clearable="clearable"
          :placeholder="searchPlaceHolder"
          filterable
          remote
          reserve-keyword
          class="itemlabel"
          @change="organizationSelected">
          <el-option
            v-for="item in organizationList"
            :key="item.partyId"
            :label="item.text"
            :value="item.partyId"/>
        </el-select>
      </el-form-item>
    </el-col>
  </el-form>
</template>
<script>
import lookupApi from '@/api/hr/lookup'

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
      }
    },
    internalOrganizationId: {type: String, default: ''},
    searchPlaceHolder: {type: String, default: 'Şube ara..'},
    disabled: {type: Boolean, default: false},
    clearable: {type: Boolean, default: true},
    onlyActive: {type: Boolean, default: false},
    roleType: {type: String, default: 'Branch'},
    containsItself: {type: Boolean, default: false},
    hasPortfolio: {type: Boolean, default: false}
  },
  data() {
    return {
      organizationList: [],
      busyOrganization: false,
      selectedPartyId: null,
      internalOrganizationPartyId: '',
      selectedPartyName: ''
    }
  },
  created() {
    if (this.internalOrganizationId) {
      this.searcOrganization('', this.roleType, this.internalOrganizationId)
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
  methods: {
    organizationSelected(val) {
      this.internalOrganizationPartyId = this.selectedPartyId
      this.selectedPartyName = val.partyName
      this.value = this.internalOrganizationPartyId
    },
    searcOrganization(query, partyRoleType, partyId) {
      this.busyOrganization = true
      lookupApi.getInternalOrganization(query, this.$store.state.user.sub, partyRoleType, partyId, this.onlyActive, this.hasPortfolio, this.containsItself)
        .then((v) => {
          this.organizationList = v.data
          this.busyOrganization = false
          if (partyId && partyRoleType !== 'Branch') {
            this.selectedPartyId = partyId
            this.internalOrganizationPartyId = partyId
          }
        })
        .catch((err) => {
          this.$emit('on-error', err.message)
          this.$notify.error(this.$t('notify.error'))
          this.busyOrganization = false
        })
    },
    remoteOrganizationSearch(query) {
      if (query && query.length > 1 && !this.hasPortfolio) {
        this.searcOrganization(query, this.roleType, null)
      } else if (query && query.length > 1 && this.hasPortfolio) {
        this.searcOrganization(query, this.roleType, this.internalOrganizationId)
      } else {
        this.organizationList = []
      }
    }
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}

.itemlabel {
  width: 100%
}
</style>
