<template>
  <div
    v-loading="busy"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
  >
    <div>
      <el-table
        :data="relationList"
        fix
        highlight-current-row
        style="width: 100%"
        @filter-change="filterChange"
      >
        <el-table-column
          :filters="filterRelationshipTypeList"
          :label="$t('crm.relationCreate.relationShipType')"
          prop="relationShipType"
          column-key="relation"
          sortable
          fixed
        >
          <template v-slot="scope">{{
            scope.row.relationShipTypeName
          }}</template>
        </el-table-column>
        <el-table-column :label="'Rolü'" prop="relationRoleName" />
        <el-table-column :label="'İlgili'" prop="relatedPartyName" />
        <el-table-column :label="'Tasarruf Sahibi No'" prop="relatedPartyId" />
        <el-table-column label="Telefon" prop="relatedPartyTel" />
        <el-table-column label="Tarih" prop="fromDate">
          <template v-slot="scope">{{
            $filters.parseTime(scope.row.fromDate, "{dd}.{mm}.{yyyy}")
          }}</template>
        </el-table-column>
        <el-table-column label="Açıklama" prop="relationDesc" />
        <el-table-column label="Referans Kaynağı" prop="referenceSource" />
        <el-table-column :label="$t('crm.common.actions')">
          <template v-slot="scope">
            <!-- <el-button-group> -->
            <el-tooltip
              :delay="delay"
              content="Müşteriyi Görüntüle"
              class="item"
              effect="light"
              placement="top-start"
            >
              <el-button
                v-if="scope.row.relatedPartyId"
                class="icon-button"
                @click="goToCustomer(scope.row)"
              >
                <svg-icon icon-class="sale" />
              </el-button>
            </el-tooltip>
            <!-- </el-button-group> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-col :span="24">
        <el-pagination
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="listQuery.limit"
          :total="count"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
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
      relationList: [],
      filterRelationshipTypeList: [],
      count: null,
      delay: 1000,
      busy: false,
      listQuery: {
        page: 1,
        limit: 20,
        party: null,
        relationType: "",
      },
    };
  },
  created() {
    this.getLookupFields();
    this.getAllValues();
  },
  methods: {
    getLookupFields() {
      this.busy = true;
      partnerApi
        .getRelationLookupFields()
        .then((v) => {
          const relationShipList = v.data.relationShipList;
          this.filterRelationshipTypeList = relationShipList.map((item) => ({
            text: item.label,
            value: item.value,
          }));
          this.busy = false;
        })
        .catch(() => {
          this.errorMessage = this.$("crm.common.errorLookupFields");
          this.busy = false;
        });
    },
    getAllValues() {
      if (this.partyId > 0) {
        this.listQuery.party = this.partyId;
        this.busy = true;
        partnerApi.getRelations(this.listQuery)
          .then((v) => {
            this.relationList = v.data.list;
            this.count = v.data.count;
            this.busy = false;
          })
          .catch(() => {
            this.$notify.error(this.$t("notify.error"));
            this.busy = false;
          });
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getAllValues();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getAllValues();
    },
    filterChange(filters) {
      this.listQuery.page = 1;
      this.listQuery.relationType = "";

      if (Object.keys(filters)[0] === "relation") {
        this.filteredelationType = Object.values(filters)[0];
      }
      for (let index = 0; index < this.filteredelationType.length; index++) {
        if (index === 0) {
          this.listQuery.relationType = this.filteredelationType[index];
        } else {
          this.listQuery.relationType =
            this.listQuery.relationType + "," + this.filteredelationType[index];
        }
      }
      this.getAllValues();
    },
    goToCustomer({ relatedPartyId, relatedPartyType }) {
      const name = relatedPartyType === 1 ? "personEdit" : "organizationEdit";
      this.$router.push({ name, params: { partyId: relatedPartyId } });
    },
  },
};
</script>
<style scoped>
.itemlabel {
  width: 100%;
  height: 36px;
  line-height: 36px;
}
</style>

