<template>
  <div>
    <el-row>
      <el-table
        v-loading="busy"
        :data="regulations"
        element-loading-text="Yükleniyor..."
        element-loading-spinner="el-icon-loading"
        style="width: 100%;">
        <el-table-column label="Portföy Adı(Eski)" prop="oldPortfolioTitle">
          <template v-slot="listscope">
            {{ listscope.row.oldPortfolioTitle }}
          </template>
        </el-table-column>
        <el-table-column label="Başlangıç Tarih(Eski)" prop="oldFromDate">
          <template v-slot="listscope">
            {{ new Date(listscope.row.oldFromDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit',hour:'numeric',minute:'numeric' }) }}
          </template>
        </el-table-column>
        <el-table-column label="Bitiş Tarihi(Eski)" prop="oldThruDate">
          <template v-slot="listscope">
            <span v-if="listscope.row.oldThruDate === null">{{ 'Devam Ediyor' }}</span>
            <span v-else>{{ new Date(listscope.row.oldThruDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit',hour:'numeric',minute:'numeric' }) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="İşlemi Yapan Kullanıcı(Eski)" prop="oldOperatorUsername">
          <template v-slot="listscope">
            {{ listscope.row.oldOperatorUsername === null ? 'REDCASE GEÇİŞ': listscope.row.oldOperatorUsername }}
          </template>
        </el-table-column>

        <el-table-column label="Portföy Adı(Yeni)" prop="newPortfolioTitle">
          <template v-slot="listscope">
            {{ listscope.row.newPortfolioTitle }}
          </template>
        </el-table-column>
        <el-table-column label="Başlangıç Tarih(Yeni)" prop="newFromDate">
          <template v-slot="listscope">
            {{ new Date(listscope.row.newFromDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit',hour:'numeric',minute:'numeric' }) }}
          </template>
        </el-table-column>
        <el-table-column label="Bitiş Tarihi(Yeni)" prop="oldThruDate">
          <template v-slot="listscope">
            <span v-if="listscope.row.newThruDate === null">{{ 'Devam Ediyor' }}</span>
            <span v-else>{{ new Date(listscope.row.newThruDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit',hour:'numeric',minute:'numeric' }) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="İşlemi Yapan Kullanıcı(Yeni)" prop="newOperatorUsername">
          <template v-slot="listscope">
            {{ listscope.row.newOperatorUsername === null ? 'REDCASE GEÇİŞ': listscope.row.newOperatorUsername }}
          </template>
        </el-table-column>

        <el-table-column label="Düzenlenme Tarihi" prop="regulationDate">
          <template v-slot="listscope">
            <span v-if="listscope.row.regulationDate === null">{{ 'Devam Ediyor' }}</span>
            <span v-else>{{ new Date(listscope.row.regulationDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit',hour:'numeric',minute:'numeric' }) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Açıklama" prop="statement">
          <template v-slot="listscope">
            {{ listscope.row.statement }}
          </template>
        </el-table-column>

      </el-table >
    </el-row>
  </div>
</template>

<script>
import lifecycleApi from '@/api/crm/customerLifeCycle'
export default {
  props: {
    partyPortfolioId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      regulations: [],
      busy: false
    }
  },
  created() {
    this.loadItems(this.partyPortfolioId)
  },
  methods: {
    loadItems(partyPortfolioId) {
      this.busy = true
      lifecycleApi.getPartyPortfolioRegulations(partyPortfolioId)
        .then((result) => {
          this.regulations = result.data
        })
        .catch((ex) => this.$exceptionHandle(ex))
        .finally(this.busy = false)
    }
  }
}
</script>
