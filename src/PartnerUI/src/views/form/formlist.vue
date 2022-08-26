<template>
  <div @keyup.enter="getFormEntityFilterList">
  <el-dialog v-loading="busy" v-model="showdilaog" :modal="false">
      <img :src="source" class="imageShow" style="width:100%;height:50%;" alt="">
  </el-dialog >
  <el-dialog v-loading="busy" v-model="showDialogDetail" :modal="false">
    <el-form  ref="createForm" :model="detailModel" :rules="createRules" autocorrect="off" spellcheck="false" autocomplete="off" label-position="top" class="margin-top-28">
      <el-row>
        <el-col :span="11">
          <el-form-item  label="User ID">
              <span>
                <el-tag type="success"  effect="light">
                  {{ detailModel.registerUserId}}
                </el-tag>
              </span>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          &nbsp;
        </el-col>
        <el-col :span="11">
          <el-form-item  label="Approve Status">
              <span>
                <el-tag type="danger"  effect="light">
                  {{ detailModel.fromStatus}}
                </el-tag>
              </span>
          </el-form-item>
        </el-col>
      </el-row>     
      <el-row>
        <el-col v-if="detailModel.fromStatus !== 'Rejected'" :span="11">
          <el-form-item  label="Aprroved Price">
              <span>
                <el-tag class="mx-1" effect="dark">
                  {{ detailModel.approvedPrice + " USDT"}}
                </el-tag>
              </span>
          </el-form-item>
        </el-col>
        <el-col v-if="detailModel.fromStatus !== 'Rejected'" :span="2">
          &nbsp;
        </el-col>
        <el-col :span="11">
           <el-form-item  label="Transaction Note">
              <span>
                <el-tag type="danger" effect="light">
                  {{ detailModel.transactionNote}}
                </el-tag>
              </span>
          </el-form-item>
        </el-col>
      </el-row> 
       <el-row>
        <el-col :span="11">
          <el-form-item >
            <el-input v-model="tokenPrice" disabled="true">
              <template #prepend>(Token Price in Private Round)</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          &nbsp;
        </el-col>
        <el-col :span="11">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item >
            <el-input v-model="investeded" disabled="true">
              <template #prepend># Invested USTD Amount</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          &nbsp;
        </el-col>
        <el-col :span="11">
        </el-col>
      </el-row>  
      <el-row>
        <el-col :span="11">
          <el-form-item >
            <el-input v-model="detailModel.approvedPrice" disabled="true">
              <template #prepend># Tokens To Receive</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          &nbsp;
        </el-col>
        <el-col :span="11">
        </el-col>
      </el-row>  
  </el-form>
  </el-dialog >
    <br>
    <el-row :gutter="10" type="flex" justify="start" align="middle">
      <el-col  align="right">
        <el-button type="primary" @click.prevent="dialogForm=true">
          {{ "Add" }}
        </el-button>
      </el-col>
    </el-row>
    <br>
    <el-dialog 
    v-model="dialogForm"
    :modal-append-to-body="false"
    class="pop-up"
    width="50%"   
    >
      <Form @done="done" />
    </el-dialog>
    <el-card>
      <el-table
        v-loading="busy"
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          prop="formUserId"
          label="Id"
          width="150"
        />
        <el-table-column
          prop="registerUserId"
          label="User Id"
          width="440"
        />
        <el-table-column
          prop="transactionId"
          label="Transaction Id"
          width="350"
        />
        <el-table-column
          prop="network"
          label="Network"
          width="300"
        />
        <el-table-column
          prop="fromStatus"
          label="Status"
          width="250"
        />
       <el-table-column
          fixed="right"
          label="Operations"
          width="200"
        >
        <template v-slot="scope">
          <el-button-group>
              <el-tooltip>
                 <el-button type="primary"  @click.prevent="onShow(scope.row.formUserId)">Show</el-button>
              </el-tooltip>
              <el-tooltip >
                 <el-button type="success"  v-if="scope.row.fromStatus !== 'ApproveRequired'"  @click.prevent="onShowDetail(scope.row.formUserId)">Detail</el-button>
              </el-tooltip>
          </el-button-group>
        </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div>
      <el-col :span="24">
        <el-pagination
          :current-page="model.pageIndex"
          :page-sizes="[10,20,30, 50,100,200,500]"
          :page-size="model.pageSize"
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
import formUserApi from '@/api/form/form'
import Form from './components/form.vue'
import { MoneyFormats } from '@/utils/globalVars'

export default {
  components: {
    Form,MoneyFormats
  },
  data() {
    return {
      model: {
        networkType: '',
        transactionId: '',
        pageSize: 10,
        pageIndex: 1
      },
      detailModel:[],
      count: 0,
      list: [],
      busy: false,
      dialogForm: false,
      id: 0,
      searchText: '',
      showdilaog: false,
      showDialogDetail: false,
      source:'',
      tokenPrice:0.035,
      investeded : 0
    }
  },
  created() {
    this.getFormEntityList()
  },
  methods: {
   async onShow(id){
    this.source =''
    this.busy = true
      var x = "data:image/png;base64,"
      var data = []
       await formUserApi.getById(id)
        .then((v) => {
          data = v.data.transactionImage 
          this.source = x + data 
          this.busy = false
          this.showdilaog = true
        })
        .catch((err) => {
          this.$notify.error(err.data)
          this.busy = false
        })      

      
    },
   async onShowDetail(id){
    this.detailModel = this.list.find(o => o.formUserId === id);
    this.investeded = this.detailModel.approvedPrice  * this.tokenPrice
    this.showDialogDetail = true
    },
    done() {
      this.dialogForm = false
      this.getFormEntityList()
    },
    getFormEntityFilterList() {
      this.model.pageIndex = 1
      this.getFormEntityList()
    },
    getFormEntityList() {
      this.busy = true
      formUserApi.getList(this.model)
        .then((v) => {
          this.list = v.data.$values
          this.busy = false
          if(this.list.length > 0){this.count = this.list[0].count}
        })
        .catch((err) => {
          console.log('wrr',err)
          this.$notify.error(err.data)
          this.busy = false
        })
    },
    handleSizeChange(val) {
      this.model.pageSize = val
      this.getFormEntityList()
    },
    handleCurrentChange(val) {
      this.model.pageIndex = val
      this.getFormEntityList()
    }
  }
}
</script>

<style>
/* .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 0px;
    padding-right: 10px;
} */
</style>
