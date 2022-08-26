<template>
  <div v-loading="busy">
    <perspective
      ref="perspectiveparty"
      :items="items"
      :count="count"
      :loading="busy"
      :options="option"
      :show-employee="false"
      :show-internal-organization="false"
      :internal-organization-list-type="internalOrganizationListType"
      employee-list-type="taks"
      microservice = "kernel"
      search-description ="Ara"
      :is-partner="true"
      @get-items="getUserTasks">

      <template v-slot:header/>
      <template v-slot:table-columns>
        <el-table-column :filters="templateTitles"  column-key="templateTitle" prop="templateTitle">
          <template #header>
            {{ $t('focus.templateTitle') }}
            <i class="fa-solid fa-caret-down"></i>
          </template>
          <template #default="scope">
            <p style="font-size:13px;">{{ scope.row.templateTitle }}
            </p>
          </template>
        </el-table-column>
        <el-table-column :filters="taskTitles" column-key="title" prop="title">
          <template #header>
            {{ $t('focus.title') }}
            <i class="fa-solid fa-caret-down"></i>
          </template>
          <template #default="scope">
            <p style="font-size:13px;">{{ scope.row.taskTitle }}
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('focus.processTitle')" >
          <template #default="scope">
            <span style="font-size:13px;">{{ scope.row.processTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('focus.timeRemaining')" >
          <template #default="scope">
            <span style="font-size:13px;">{{ scope.row.dateString }}</span>
          </template>
        </el-table-column>
        <el-table-column :filters="taskUsers" column-key="name" prop="name" width="250px">
          <template #header>
            {{ $t('focus.appointedPerson') }}
            <i class="fa-solid fa-caret-down"></i>
          </template>
          <template #default="scope">
            <span style="font-size:13px;">{{ scope.row.partyName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('processlist.actions')" width="120px">
          <template #default="scope">
            <el-tooltip :content="$t('tasklist.info')" class="item" effect="light" placement="top-start">
              <el-button type="action" class="table-button" plain @click="goToTaskDetail(scope.row)">Süreç <i class="fa-solid fa-arrow-right margin-left-12"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </perspective>
  </div>
</template>
<script>

import {ref} from 'vue'
import processApi from '@/api/bpm/process'
import perspective from '@/components/Perspective'
import {
  Search
} from '@element-plus/icons-vue'

export default {
  components: {
    perspective
  },
  props: {
    internalOrganizationListType: {
      type: String,
      default: 'normal'
    },
    loading: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 20
    },
  },
  data() {
    return {
      Search,
      busy: false,
      option: {
        showSearchText: true,
        showActive: false,
        showArchive: false,
        searchType: false,
        defaultDayFilter: '0',
        showAllDatesButton: false,
        showYesterdayButton: false,
        showTodayButton: false,
      },
      listQuery: {
        page: 1,
        limit: this.size,
        sub: '',
        isArchive: false,
        isActive: true,
        status: '',
        orderby: '',
        sortby: '',
        dayFilter: '1',
        dateRange: [],
        internalOrganizationId: '',
        employeeId: '',
        searchText: '',
        remainAmountMin: 0,
        remainAmountMax: 0,
        searchArea: this.searchArea,
        deliveryStatus: -1,
        templateTitle: '',
        title: ''
      },
      items: [],
      taskUsers: [],
      templateTitles: [],
      taskTitles: [],
      itemCount: 0,
      count: 0,
      selectedRange: []
    }
  },
  computed: {},
  created() {

  },
  mounted() {
  },
  methods: {
    goToTaskDetail(row) {
      this.$router.push({name: 'Process', params: {id: row.processId}})
    },
 /*   datePickerChange() {
      console.log('dr = ' + this.listQuery.dateRange)
      this.listQuery.dayFilter = this.listQuery.dateRange === null ? '0' : 'c'
      this.listQuery.page = 1
      //this.getData()
    },*/
    getTaskTitleList(listQuery) {
      processApi.getTaskTitleList(listQuery).then(
        (x) => this.taskTitles = x.data
      )
    },
    getTemplateTitleList(listQuery) {
      console.log('listQuery' + listQuery)
      processApi.getTemplateTitleList(listQuery).then(
        (t) => this.templateTitles = t.data
      )
    },
    getUserTasks(listQuery) {
      console.log('listQuery' + listQuery)
      this.getTaskTitleList(listQuery),
        this.getTemplateTitleList(listQuery),
        this.busy = true
      processApi.getFocusUserTasks(listQuery).then(({data}) => {
        this.items = data.data
        this.count = data.count
        console.log(data.count)
        this.busy = false
        if (this.count > 0) {
           var newListQuery = Object.assign({}, listQuery);
          newListQuery.limit = this.count
          newListQuery.page = 1
          processApi.getTaskAssignUserList(newListQuery).then(({data}) => {
            this.taskUsers = data.data
            this.itemCount = data.count
            console.log(data.count)
            console.log(this.taskUsers)
          })
            .catch(() => {
              this.errorMessage = this.$t('newprocess.loadSummaryError')
              this.busy = false
            });
        }
      })
        .catch(() => {
          this.errorMessage = this.$t('newprocess.loadSummaryError')
          this.busy = false
        });
    },
  },

}
</script>

<style lang="scss" scoped>
:deep(.taskItemundefined) {
  .el-row {
    //height: 60;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-row:first-child {
    width: 96%;
  }

  .el-row:last-child {
    width: 100%;
  }

  .el-table .completed-row {
    border: 1px solid #0e62d2;
    border-radius: 5px;
  }

  .el-table .issue-row {
    border: 1px solid #ffc107;
    border-radius: 5px;
  }

  .el-table .deadline-row {
    background: #FCC5CF;
  }

  .parentCollapse {
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #e5e5e5;

    .el-collapse-item__header {
      border: none;
      background: linear-gradient(to bottom right, #f5f5f5, #ffffff);
      height: 80px;
      padding-left: 15px;
      padding-top: 0px;
      font-weight: 100;
      font-size: 20px;
      letter-spacing: 1px;

      .day, .hour {
        color: #b7b7b7;
        font-size: 14px;
      }

      .dayCount, .hourCount {
        background-image: linear-gradient(135deg, #e6dede, #d6d0d0);
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 14px;
        border: none;
        cursor: text;
        font-weight: bold;
      }
    }

    .el-checkbox__inner {
      border: none;
      border-radius: 50%;
      -webkit-box-shadow: 0px 10px 69px 4px rgba(0, 0, 0, 0.34);
      -moz-box-shadow: 0px 10px 69px 4px rgba(0, 0, 0, 0.34);
      box-shadow: 0px 10px 69px 4px rgba(0, 0, 0, 0.34);
    }

    .el-button.count {
      border-radius: 50%;
      background: #fff;
      border: 3px solid #c94343;
      color: #c94343;
      padding: 7px 10px;
    }
  }

  .childCollapse {
    .el-collapse-item__header {
      background: linear-gradient(to bottom right, #e7e6e6, #f6f6f6);
      font-size: 14px;
      line-height: 15px;
    }

    .el-checkbox__inner {
      border: none;
      border-radius: 50%;
      -webkit-box-shadow: 0px 0px 0px 0px;
      -moz-box-shadow: 0px 0px 0px 0px;
      box-shadow: 0px 0px 0px 0px;
    }

    .commentsButton {
      background: none;
      border: none;
      padding: 0px;

      .svg-icon {
        width: 30px;
        height: 30px;
      }
    }

    .processRouteButton {
      background: none;
      border: none;
      padding: 0px;

      .svg-icon {
        width: 30px;
        height: 30px;
      }
    }
  }

  .dialogComments {
    .el-dialog__body {
      padding: 25px;

      .commentsArea .el-row {
        margin-bottom: 100px;
        border-bottom: 1px solid #d8d8d8;

        * {
          padding-top: 40px;
        }
      }

      .grayBackground {
        .usersComments {
          background: linear-gradient(to bottom right, #d6d0d0, #e6dede);
          color: #fff;
          padding: 10px;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          border-bottom-left-radius: 30px;
          font-weight: 100;
        }
      }

      .blueBackground {
        .usersComments {
          background: linear-gradient(to bottom right, #1B81FF, #00c6ff);
          color: #fff;
          padding: 10px;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          border-bottom-left-radius: 30px;
          font-weight: 100;
        }
      }
    }

    .el-dialog__body {
      .el-row::after {
        display: none;
      }
    }

    .el-dialog__footer {
      padding: 0px;
    }

    .dialog-footer {
      .commentsArea {
        background: #fff;
      }

      .el-form {
        background: #c94343;
        padding: 25px 50px;
      }

      label {
        color: #fff;
        font-weight: 100;
      }

      .el-textarea {
        width: 80%;
      }

      .el-textarea__inner {
        height: 36px;
        border-radius: 100px;
        border: none;
      }
    }
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: transparent !important;
  }

  @media (min-width: 1200px) and (max-width: 1440px) {
    .speech-bubble-inactive {
      margin-right: 0px;
      margin-left: 0px;
    }
    .el-col-offset-1 {
      margin-left: 0%;
    }
  }
}
</style>

