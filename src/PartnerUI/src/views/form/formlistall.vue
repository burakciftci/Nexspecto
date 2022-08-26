<template>
  <div @keyup.enter="getFormEntityFilterList">
      <el-dialog v-model="showdilaog" :modal="false">
      <img :src="source" class="imageShow" style="width:100%;height:50%;" alt="">
  </el-dialog>
  <el-dialog v-model="approveDialog" :modal="false">
      <el-form  ref="createForm" :model="modelUpdate"  autocorrect="off" spellcheck="false" autocomplete="off" label-position="top" class="margin-top-28">
      <el-row>
        <el-col :span="11">
          <el-form-item prop="approvePrice" label="Approve Price">
                <el-input
                  v-model="modelUpdate.approvedPrice"
                  placeholder="Approve Price"
                  name="approvePrice"
                  type="number"
                  tabindex="1"
                />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          &nbsp;
        </el-col>
        <el-col :span="11">
          <el-form-item prop="transactionNote" label="Transaction Note">
            <el-input
              v-model="modelUpdate.transactionNote"
              placeholder="Transaction Note"
              name="transactionNote"
              type="textarea"
              tabindex="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="margin-top-30 text-center">
        <el-button  :disabled="modelUpdate.transactionNote.length <= 0" type="success" @click.prevent="update">Aprrove</el-button>
      </div>
      </el-form>
  </el-dialog>
  <el-dialog v-model="rejectDialog" :modal="false">
      <el-form  ref="createForm" :model="modelUpdate"  autocorrect="off" spellcheck="false" autocomplete="off" label-position="top" class="margin-top-28">
        <el-row>
          <el-col :span="2">
            &nbsp;
          </el-col>
          <el-col :span="11">
            <el-form-item prop="transactionNote" label="Transaction Note">
              <el-input
                v-model="modelUpdate.transactionNote"
                placeholder="Transaction Note"
                name="transactionNote"
                type="textarea"
                tabindex="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
      <div class="margin-top-30 text-center">
        <el-button  :disabled="modelUpdate.transactionNote.length <= 0" type="primary" @click.prevent="update">Reject</el-button>
      </div>
      </el-form>
  </el-dialog>
    <br>
    <el-card>
      <el-table
        v-loading="busy"
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          prop="formUserId"
          label="Id"
          width="80"
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
          width="260"
        />
        <el-table-column
          prop="fromStatus"
          label="Status"
          width="260"

        />
        <el-table-column
          prop="fromStatus"
          label="Image"
          width="250"
        >
        <template v-slot= "scope">
          <el-button  @click.prevent="onShow(scope.row.formUserId)">Show</el-button>
        </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operations"
          width="200"
        >
        <template v-slot="scope">
          <el-button-group>
              <el-tooltip :open-delay="0" content="Approve" class="item" effect="light" placement="top-start">
                   <el-button v-if="scope.row.fromStatus === 'ApproveRequired' "  circle type="success"  @click="handleUptadeAprove(scope.row.formUserId)" effect="light" ><el-icon><Check /></el-icon></el-button>
              </el-tooltip>
              <el-tooltip :open-delay="0" content="Reject" class="item" effect="light" placement="top-start">
                   <el-button v-if="scope.row.fromStatus === 'ApproveRequired'"  circle type="primary"  @click="handleUptadeRejected(scope.row.formUserId)" effect="light" ><el-icon><CloseBold /></el-icon></el-button>
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
import {
  Check,
  CloseBold
} from '@element-plus/icons-vue'



export default {
  components: {
    Form,Check,CloseBold
  },
  data() {
    return {
      model: {
        networkType: '',
        transactionId: '',
        pageSize: 10,
        pageIndex: 1
      },
      id:0,
      modelUpdate: {
        approvedPrice:0,
        formStatus: '',
        transactionNote: ''
      },
      count: 0,
      list: [],
      busy: false,
      dialogForm: false,
      approveDialog : false,
      rejectDialog : false,
      id: 0,
      searchText: '',
      showdilaog: false,
      source:'',
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
    handleUptadeAprove(id){ 
      this.id = id
      this.modelUpdate.formStatus = 'Approve'
      this.approveDialog = true
    },
    handleUptadeRejected(id){
      this.id = id
      this.modelUpdate.formStatus = 'Rejected'
      this.rejectDialog = true
    },

    update() {
      this.busy = true
      formUserApi.updateUserForm(this.id, this.modelUpdate)
        .then((v) => {
          this.busy = false
          this.modelUpdate.approvedPrice = 0
          this.modelUpdate.formStatus = ''
          this.modelUpdate.transactionNote = ''
          this.approveDialog = false
          this.rejectDialog = false
          this.getFormEntityList()
          this.$notify.success('Success')
        })
        .catch((err) => {
          this.$notify.error(err.data)
          this.busy = false
        })
    },
    getFormEntityFilterList() {
      this.model.pageIndex = 1
      this.getFormEntityList()
    },
    getFormEntityList() {
      this.busy = true
      formUserApi.getAll()
        .then((v) => {
          this.list = v.data.$values
          this.busy = false
          if(this.list.length > 0){this.count = this.list[0].count}
        })
        .catch((err) => {
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
