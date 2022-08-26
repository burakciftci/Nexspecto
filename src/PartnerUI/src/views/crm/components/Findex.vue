<template>
  <div
    v-loading="busy"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
  >
    <div>
      <el-card>
        <el-form
          ref="crmEditFindex"
          :model="model"
          :disabled="true"
          label-position="left"
          label-width="150px"
          class="itemlabel"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item
                :label="$t('crm.personEditFindex.findex')"
                prop="findex"
              >
                <el-input v-model="model.findex" class="itemlabel" />
              </el-form-item>
            </el-col>
            <el-col :span="2"> &nbsp; </el-col>
            <el-col :span="11">
              <el-form-item
                :label="$t('crm.personEditFindex.partnerFindex')"
                prop="partnerFindex"
              >
                <el-input v-model="model.partnerFindex" class="itemlabel" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                :label="$t('crm.personEditFindex.findexResult')"
                prop="findexResult"
              >
                <el-input v-model="model.findexResult" class="itemlabel" />
              </el-form-item>
            </el-col>
            <el-col :span="2"> &nbsp; </el-col>
            <el-col :span="11">
              <el-form-item
                :label="$t('crm.personEditFindex.findexDate')"
                prop="findexDate"
              >
                <el-input v-model="model.findexDate" class="itemlabel" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import partnerApi from "@/api/crm/partner";

export default {
  props: {
    partyId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      busy: false,
      model: {
        partyId: null,
        findex: "",
        partnerFindex: "",
        findexResult: "",
        findexDate: ""
      },
    };
  },
  created() {
    this.loadFields();
  },
  methods: {
    loadFields() {
      this.busy = true;
      partnerApi
        .getPersonFindex(this.partyId)
        .then((v) => {
          this.model = v.data;
          this.busy = false;
        })
        .catch(() => {
          this.errorMessage = this.$("crm.common.errorLookupFields");
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
</style>
