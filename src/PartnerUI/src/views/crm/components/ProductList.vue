<template>
  <div
    v-loading="busy"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
  >
    <div>
      <el-table
        :data="productList"
        :header-row-class-name="tableHeader"
        :header-cell-class-name="transparent"
        :row-class-name="rowStyle"
      >
        <el-table-column :label="$t('product.list.productId')" prop="productId">
          <template v-slot="scope">
            {{ scope.row.productId }}
          </template>
        </el-table-column>
        <el-table-column label="Tasarruf Planı No" prop="code">
          <template v-slot="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.list.customer')" prop="partyId">
          <template v-slot="scope">
            {{ scope.row.partyId }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('product.list.amount')"
          prop="financeAmount"
        >
          <template v-slot="scope">
            {{ $filters.formatTRY(scope.row.financeAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('product.list.bargainAmount')"
          prop="advanceAmount"
        >
          <template v-slot="scope">
            {{ $filters.formatTRY(scope.row.advanceAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('product.list.installmentAmount')"
          prop="installmentAmount"
        >
          <template v-slot="scope">
            {{ $filters.formatTRY(scope.row.installmentAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="Tasarruf Planı Tarihi" prop="prodcutDate">
          <template v-slot="scope">
            {{ scope.row.productDate }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('product.list.status')"
          align="center"
          prop="status"
        >
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 6"> {{ "İptal Edildi" }}</el-tag>
            <el-tag v-else type="success">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="" prop="isRevised">
          <template v-slot="scope">
            <el-tag v-if="scope.row.isRevised"> Revize</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('campaign.list.actions')"
          class-name="action-buttons td-actions"
          fixed="right"
          width="63"
        >
          <template v-slot="scope">
            <el-button-group>
              <el-button-group>
                <el-button
                  class="icon-button"
                  @click.prevent="goToProductView(scope.row)"
                  ><svg-icon icon-class="sale"
                /></el-button>
              </el-button-group>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import partnerApi from "@/api/finance/partner";

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
      productList: [],
      visible: false,
    };
  },
  created() {
    this.getProductList();
  },
  methods: {
    getStatusLabel(status) {
      switch (status) {
        case 1:
          return "Teklif";
        case 2:
          return "Onay Bekleniyor";
        case 3:
          return "İlk Ödeme Bekleniyor";
        case 4:
          return "Devam Ediyor";
        case 5:
          return "Kapatıldı";
        case 7:
          return "Bekleyen";
        case 8:
          return "Ayrılma";
        case 9:
          return "Ayrılma Bekleniyor";
        case 10:
          return "Devir Ayrılan";
        default:
          return "Tamamlandı";
      }
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "light";
      } else {
        return "dark";
      }
    },
    goToProductView(row) {
      this.$router.push({
        name: "productCard",
        params: { calculationId: row.calculationId },
      });
    },
    getProductList() {
      this.busy = true;
      partnerApi
        .getProductListById(this.partyId)
        .then((v) => {
          this.productList = v.data;
          this.busy = false;
        })
        .catch(() => {
          this.busyList = false;
          this.errorMessage = this.$t("template.errorTemplateCode");
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.itemlabel {
  width: 100%;
  height: 36px;
  line-height: 36px;
}
</style>
