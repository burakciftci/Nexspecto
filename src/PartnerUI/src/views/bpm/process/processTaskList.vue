<template>
  <div class="processTaskList">
    <el-dialog v-model="dialogFormVisible" class="dialogComments">
      <span class="commentsArea">
        {{ modelComments.comments }}
        <el-row v-for="(comment,index) in modelComments.comments" :key="comment +'.'+ index" class="grayBackground"
                type="flex" align="middle" justify="space-between">
          <el-col :span="3"><span>{{ comment.userCode }}</span></el-col>
          <el-col :span="21">
            <div class="usersComments">
              <span class="child-1">{{ comment.comment }}</span>
              <span class="child-2">{{ comment.createDate }}</span>
            </div>
          </el-col>
        </el-row>
      </span>
      <template #footer>
      <span class="dialog-footer">
        <el-form
          :ref="'commentForm'+modelComments.taskAssignmentId"
          :model="newCommentModel"
          :key="'commentForm'+modelComments.taskAssignmentId"
          :rules="validation">
          <el-form-item prop="comment">
            <el-row type="flex" justify="start">
              <label>{{ $t('task.newCommentLabel') }}</label>
            </el-row>
            <el-row type="flex" justify="space-between" align="middle">
              <el-input
                v-model="newCommentModel.comment"
                :placeholder="$t('task.newCommentPlaceholder')"
                :rows="2"
                :key="'comment' + modelComments.taskAssignmentId"
                type="textarea"/>
              <el-button
                :key="'newCommentButton' + modelComments.taskAssignmentId"
                type="action"
                @click.prevent="addNewComment(modelComments.taskAssignmentId,modelComments.taskId)">{{
                  $t('task.newCommenmtButton')
                }}</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogDeadlineFormVisible" top="15vh">
      <el-form
        ref="deadlineForm"
        :model="modelDeadline"
        :rules="validationDeadline"
        label-width="175px"
        class="middle">
        <el-form-item :label="$t('task.deadlineLabel')" prop="comment">
          <el-date-picker
            v-model="modelDeadline.start"
            :picker-options="pickerOptions"
            :placeholder="$t('task.deadlinePlaceholder')"
            type="date"/>
        </el-form-item>
        <strong>{{ $t('task.deadlineWarning', {maxDeadline: modelDeadline.maxAllowedDeadlineString}) }}</strong>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
        <el-button class="default-button" @click="dialogDeadlineFormVisible = false">{{
            $t('notify.discardChanges')
          }}</el-button>
        <el-button type="action" @click="saveDeadLineChange">{{ $t('notify.saveChanges') }}</el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogAssignmentUserFormVisible">
      <el-form
        ref="assignmentUserForm"
        :model="modelAssignmentUser"
        :rules="validationAssignmentUser"
        label-width="275px"
        class="middle">
        <el-form-item :label="$t('task.assignmentUserLabel')" prop="assignmentUser">
          <el-select v-loading="busyComment" v-if="!isSuperUser" v-model="modelAssignmentUser.assignmentUser"
                     :placeholder="$t('newtask.assignToPlaceholder')" clearable filterable>
            <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.text"
              :value="item.value">
              {{ item.text }} - {{item.value}}
            </el-option>
          </el-select>
          <organization-search
            v-if="isSuperUser"
            ref="selectedPerson"
            v-model="modelAssignmentUser.assignmentUser"
            :internal-organization-id="modelAssignmentUser.assignmentUser"
            :key="'assignmentUser'+modelAssignmentUser.assignmentUser"
            :search-place-holder="'Çalışan ara..'"
            :role-type="'Employee'"/>

        </el-form-item>
        <strong>{{ $t('task.assignmentUserWarning') }}</strong>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
        <el-button class="default-button"
                   @click="dialogAssignmentUserFormVisible = false">{{ $t('notify.discardChanges') }}</el-button>
        <el-button type="action" @click="saveAssignmentUserChange">{{ $t('notify.saveChanges') }}</el-button>
      </span>
      </template>
    </el-dialog>

    <div
      v-for="(task, taskIndex) in tasks"
      :key="task.taskAssignmentId"
      style="margin-top:20px;">
      <div v-if="isShowableTask(tasks[taskIndex])">
      <!-- :style="tasks[taskIndex].status===taskStatus.Open?'border:1px solid #b7b7b7;':tasks[taskIndex].status===taskStatus.Completed?'border:1px solid #f59f3e;':tasks[taskIndex].status===taskStatus.Isue?'border:1px solid #494949;':''" -->
        <el-collapse v-loading="busy" v-model="activeNames" class="main-collapse">
          <el-collapse-item :name="isDefaultOpenTask(tasks[taskIndex].status) ? '0': taskIndex">
            <template #title>
              <div class="row1">
                <el-row align="middle" justify="space-between">
                  <el-row>
                    <div
                      :style="tasks[taskIndex].status===taskStatus.Open?'background:#fff;border-color:#b7b7b7;':tasks[taskIndex].status===taskStatus.Completed?'background:#f59f3e;border-color:#f59f3e;':tasks[taskIndex].status===taskStatus.Isue?'background:#494949;border-color:#494949;':'background:#fff;border-color:#b7b7b7;'"
                      style="width:30px;height:30px;border:1px solid;background:white;border-radius:50%;margin: 0 32px;">
                      <div
                        :style="tasks[taskIndex].status===taskStatus.Open?'background:#b7b7b7;':tasks[taskIndex].status===taskStatus.Completed?'background:#fff;':tasks[taskIndex].status===taskStatus.Completed?'background:#fff;':'background:#b7b7b7;'"
                        style="width:10px;height:10px;border-radius:50%;margin:10px auto;"/>
                    </div>
                    <h3 class="margin-top-0 margin-bottom-0 task-title">{{ tasks[taskIndex].title }}</h3> 
                  </el-row>
                  <el-row>
                    <div class="margin-left-25">
                      <span
                        :class="tasks[taskIndex].status===taskStatus.Open?'text-info':tasks[taskIndex].status===taskStatus.Completed?'text-success':'text-danger'">
                        {{ tasks[taskIndex].statusDesc }}
                      </span>
                    </div>
                    <!-- <div class="margin-left-25">
                      <span class="normalFont margin-right-5">
                        {{  tasks[taskIndex].comments ? tasks[taskIndex].comments.length : 0 }} Yorum
                      </span>
                      <el-tooltip :content="$t('tasklist.commentTooltip')" class="item" effect="light" placement="top-start">
                        <el-button class="commentsButton" style="min-width: 30px !important;" @click.stop="editComments(tasks[taskIndex])">
                          <svg-icon icon-class="comment-icon"/>
                        </el-button>
                      </el-tooltip>
                    </div> -->
                    <div class="margin-left-25">
                      Gün: <button class="dayCount">{{ remainDay(tasks[taskIndex].remainDay) }}</button>
                    </div>
                    <div class="margin-left-25">
                      Saat: <button class="hourCount">{{ remainHour(tasks[taskIndex].remainHour) }}</button>
                    </div>
                  </el-row>
                </el-row>
              </div>
              <div class="row2">
                <el-row align="middle" justify="space-around">
                  <div>
                    <span style="color:#b7b7b7;">{{ $t('task.startdate') }}
                      <el-tooltip :content="$t('task.changeDeadlineTooltip')" class="item" effect="light"
                                  placement="top-start">
                        <el-button @click.stop="editDeadline(tasks[taskIndex], taskIndex)" style="font-size: 12px !important;">
                          <strong style="color:#000;">{{ tasks[taskIndex].started }}</strong>
                        </el-button>
                      </el-tooltip>
                    </span>
                  </div>
                  <div v-if="task.maxAllowedDeadlineExtension===0">
                    <span style="color:#b7b7b7;">{{ $t('task.deadlinedate') }}
                      <strong style="color:#000;">{{ tasks[taskIndex].deadline }}</strong>
                    </span>
                  </div>
                  <div v-if="task.maxAllowedDeadlineExtension>0">
                    <span
                      style="color:#b7b7b7;">{{ $t('task.deadlinedate') }}
                      <strong style="color:#000;"> {{ tasks[taskIndex].deadline }}</strong>
                    </span>
                  </div>
                  <div v-if="task.canChangeAssignedEmployee===false && task.canAccess === false" style="float:right;">
                    <svg-icon icon-class="dummy-profile-icon" style="border-radius:50%;vertical-align:middle;margin-right:5px;width:20px;height:20px;"/>
                    <span style="color:#b7b7b7;">{{ tasks[taskIndex].assignmentUserName }}</span>
                  </div>
                  <div v-if="task.canChangeAssignedEmployee===true || task.canAccess === true" style="float:right;">
                    <el-tooltip :content="$t('task.changeAssignmentUserTooltip')" class="item" effect="light"
                                placement="top-start">
                      <el-row>
                        <el-col :span="6">
                          <svg-icon icon-class="dummy-profile-icon"
                                    style="border-radius:50%;vertical-align:middle;margin-right:5px;width:20px;height:20px;"/>
                        </el-col>
                        <el-col :span="18">
                          <span style="color:#b7b7b7;">
                            <el-button v-loading="busyUsers" :disabled="tasks[taskIndex].status===taskStatus.Completed"
                                       @click.stop="editAssignmentUser(tasks[taskIndex], taskIndex)" style="font-size: 12px !important;">
                              <strong style="color:#000;">{{ tasks[taskIndex].assignmentUserName }}</strong>
                            </el-button>
                          </span>
                        </el-col>
                      </el-row>
                    </el-tooltip>
                  </div>
                </el-row>
              </div>
              <i class="fa-solid fa-caret-down"></i>
            </template>
            <el-row>
              <div style="color:#000;font-size:15px;margin-left:120px;" v-html="tasks[taskIndex].details"></div>
            </el-row>
            <el-form v-if="task.formItems" :ref="'taskForm'+taskIndex" :model="task" label-width="150px">
              <el-form-item v-for="(formItem,index) in task.formItems" :key="index">
                <form-element :kick-off-form-items="kickOffFormItems" :disabled="!canBeCompleted(taskIndex)"
                              :model="tasks[taskIndex]" :index="index" :process-id="processId"/>
              </el-form-item>
            </el-form>
            <el-row class="app-container"/>
            <el-row class="app-container" align="middle">
              <span style="color:#b7b7b7;">{{ 'İşleminizi Tamamlamak İçin Lütfen' }} <strong
                style="color:#000;">{{ '"Tamamla"' }}</strong> {{ 'Butonuna Basınız.' }}</span>
              <el-button
                :busy="busy"
                :disabled="!canBeCompleted(taskIndex)"
                type="action"
                class="margin-left-25"
                @click="complateTaskAssingment(taskIndex)">{{ $t('notify.complate') }}
              </el-button>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>

import processApi from '@/api/bpm/process'
import organizationSearch from '@/views/bpm/process/templates/organizationSearch'
import formElement from './formElement'
import {parseTime} from '@/utils'
import lookupApi from '@/api/bpm/lookup'
import {TaskStatus} from '@/views/bpm/Constants/TaskStatus.js'
import {hasActionPermissionNew} from '@/actionPermission.js'

export default {
  components: {
    processApi,
    organizationSearch,
    formElement
  },
  modelValue: {
    type: Array,
    default: []
  },
  emits: ['update:modelValue', 'task-assignment-changed', 'on-error'],
  props: {
    tasks: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showAllTasks: {
      type: Boolean,
      default: false
    },
    showHiddenTasks: {
      type: Boolean,
      default: false
    },
    processId: {
      type: Number,
      default: 0
    },
    kickOffFormItems: {
      type: Array,
      default: null
    }
  },
  data() {
    const self = this
    return {
      busyUsers: false,
      busy: false,
      formDisable: false,
      busyComment: false,
      activeNames: '0',
      dialogFormVisible: false,
      dialogDeadlineFormVisible: false,
      dialogAssignmentUserFormVisible: false,
      dialogCallListFormVisible: false,
      modelComments: {},
      superUserAuthorization: false,
      taskStatus: TaskStatus,
      disabledAssignedEmployee: false,
      newCommentModel: {
        comment: '',
        taskAssignmentId: 0
      },
      commentModel: {
        newComment: ''
      },
      validation: {
        newComment: [
          {min: 5, message: 'Mesajınız en az 5 karakter olmalıdır'},
          {required: true, message: 'Mesajınızı giriniz'}
        ]
      },
      validationDeadline: {
        deadline: [
          {required: true, message: 'Bitiş tarihi giriniz'}
        ]
      },
      validationAssignmentUser: {
        assignmentUser: [
          {required: true, message: 'Görev atanacak kullanıcıyı giriniz'}
        ]
      },
      modelDeadline: {
        taskAssignmentId: 0,
        start: new Date(),
        maxAllowedDeadline: new Date(),
        maxAllowedDeadlineExtension: 0,
        taskIndex: 0
      },
      modelAssignmentUser: {
        taskAssignmentId: 0,
        assignmentUser: '',
        taskIndex: 0
      },
      pickerOptions: {
        disabledDate(time) {
          const now = new Date()
          const today = now.setHours(0, 0, 0, 0)
          return (
            time.getTime() > self.modelDeadline.maxAllowedDeadline ||
            time.getTime() < today
          )
        },
        firstDayOfWeek: 1
      },
      model: {
        formItems: []
      },
      task: [],
      users: [],
      callList: [],
      selectedTaskIndex: 0,
      selectedTaskActivityCommunicationActivityId: 0,
      isSuperUser: false,
      callNotExistsChecked: false
    }

  },
  computed: {},
  mounted() {
    this.superUserAuthorization = hasActionPermissionNew(this.$store.getters.permissions, 'superUserAuthorizationForLookInsideTasks')
    this.getCodes()
  },
  methods: {
    hasActionPermissionNew,
    isShowableTask(task) {
      if (this.showAllTasks && !this.showHiddenTasks) {
        return this.showHiddenTasks || !task.isHidden
      }
      if (this.showAllTasks && this.showHiddenTasks) {
        return this.showHiddenTasks || task.isHidden
      }
      if (!this.showAllTasks && this.showHiddenTasks) {
        return task.isHidden || (task.status === TaskStatus.Open || task.status === TaskStatus.Expired)
      }
      if (!this.showAllTasks && !this.showHiddenTasks) {
        return (task.status === TaskStatus.Open || task.status === TaskStatus.Expired) && !task.isHidden
      }
    },
    isDefaultOpenTask(status) {
      return status === TaskStatus.Open || status === TaskStatus.Expired
    },
    complateTaskAssingment(taskIndex) {
      if (this.busy === true) {
        return
      }
      this.$refs['taskForm' + taskIndex][0].validate((valid) => {
        if (valid) {
          const formData = this.tasks[taskIndex].formItems.map(element => {
            let value = [];
            if (element && element.value) {
              value = element.value.map(x => x !== undefined ? x.toString() : '')
            }
            return {
              formInstanceItemId: element.formInstanceItemId,
              value: value,
              fieldAliasName: element.fieldAliasName
            }
          })
          const model = {formData: formData};
          this.busy = true
          processApi.complateTaskAssingment(this.$store.state.user.sub, this.tasks[taskIndex].taskAssignmentId, model)
            .then(() => {
              this.$notify.success(this.$t('notify.success'))
              this.busy = false
              this.$emit('on-submit')
              this.$emit('task-assignment-completed')
            })
            .catch((err) => {
              if (err.response !== undefined ? err.response.status === 400 : err.status === 400) {
                this.$notify.info(this.$t('task.error.' + err.data))
                this.$emit('task-assignment-changed')
              } else {
                this.$emit('on-error', err.message)
                this.$notify.error(this.$t('notify.error'))
              }
              this.busy = false
            })
        }
      })

    },
    editComments(editComments) {
      this.newCommentModel.comment = ''
      this.newCommentModel.taskAssignmentId = editComments.taskAssignmentId
      this.modelComments = editComments
      this.action = 'edit'
      this.dialogFormVisible = true
    },
    editDeadline(task, taskIndex) {
      this.modelDeadline.start = new Date(task.deadlineDateTime)
      const date = new Date(task.startedDateTime)
      date.setDate(date.getDate() + task.maxAllowedDeadlineExtension)
      this.modelDeadline.maxAllowedDeadline = date
      this.modelDeadline.maxAllowedDeadlineExtension = task.maxAllowedDeadlineExtension
      this.modelDeadline.maxAllowedDeadlineString = parseTime(date, '{y}-{m}-{d} {h}:{i}')
      this.modelDeadline.taskAssignmentId = task.taskAssignmentId
      this.modelDeadline.taskIndex = taskIndex
      this.action = 'edit'
      this.dialogDeadlineFormVisible = true
    },
    saveDeadLineChange() {
      if (this.busyComment === true) {
        return
      }
      this.$refs['deadlineForm'].validate((valid) => {
        if (valid) {
          this.busyComment = true
          processApi.updateAssignmentDeadline(this.$store.state.user.sub, this.modelDeadline.taskAssignmentId, this.modelDeadline.start)
            .then((v) => {
              this.tasks[this.modelDeadline.taskIndex].deadline = parseTime(this.modelDeadline.deadline, '{y}-{m}-{d} {h}:{i}')
              this.$notify.success(this.$t('notify.success'))
              this.$refs['deadlineForm'].resetFields()
              this.$emit('task-assignment-changed')
              this.busyComment = false
              this.dialogDeadlineFormVisible = false
            })
            .catch((err) => {
              this.$emit('on-error', err.message)
              this.$notify.error(this.$t('notify.error'))
              this.busyComment = false
            })
        }
      })
    },
    editAssignmentUser(task, taskIndex) {
      if (!this.isSuperUser) {
        if (((!this.users.some(i => i.value2 === task.assignedInternalOrganizationId)) && !this.isSuperUser) && !task.canAccess) {
          this.$notify.error('Süreci yanlızca aynı organizasyonda bulunan çalışanlar üzerine alabilirler')
        } else {
          console.log('users: ', this.users)
          this.modelAssignmentUser.taskAssignmentId = task.taskAssignmentId
          this.modelAssignmentUser.taskIndex = taskIndex
          this.action = 'edit'
          this.dialogAssignmentUserFormVisible = true
        }
      } else {
        this.modelAssignmentUser.taskAssignmentId = task.taskAssignmentId
        this.modelAssignmentUser.taskIndex = taskIndex
        this.action = 'edit'
        this.dialogAssignmentUserFormVisible = true
      }
    },
    saveAssignmentUserChange() {
      if (this.busyComment === true) {
        return
      }
      console.log(this.modelAssignmentUser)
      this.$refs['assignmentUserForm'].validate((valid) => {
        if (valid) {
          this.busyComment = true
          processApi.updateAssignmentUser(this.$store.state.user.sub, this.modelAssignmentUser.taskAssignmentId, this.modelAssignmentUser)
            .then((v) => {
              this.tasks[this.modelDeadline.taskIndex].assignmentUserCode = this.modelAssignmentUser.assignmentUser
              var username = ''
              if (this.isSuperUser) {
                username = this.$refs.selectedPerson.organizationList[0].partyName
              } else {
                username = this.users.find(i => i.value === this.modelAssignmentUser.assignmentUser).text
              }
              this.tasks[this.modelDeadline.taskIndex].assignmentUserName = username

              this.$notify.success(this.$t('notify.success'))
              this.$refs['assignmentUserForm'].resetFields()
              this.$emit('task-assignment-changed')
              this.busyComment = false
              this.dialogAssignmentUserFormVisible = false
            })
            .catch((err) => {
              this.$emit('on-error', err.message)
              this.$notify.error(this.$t('notify.error'))
              this.busyComment = false
            })
        }
      })
    },
    addNewComment(taskAssignmentId, taskId) {
      if (this.busyComment === true) {
        return
      }
      this.$refs['commentForm' + taskAssignmentId].validate((valid) => {
        if (valid) {
          this.busyComment = true
          processApi.createTaskComment(this.$store.state.user.sub, taskId, this.newCommentModel)
            .then((v) => {
              this.modelComments.comments.push({
                taskCommentId: v.data.id,
                comment: this.newCommentModel.comment,
                userCode: this.$store.state.user.name,
                createDate: new Date(Date.now()).toLocaleDateString('tr- TR', {
                  year: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })
              })
              this.$notify.success((this.$t('notify.success')))
              this.$refs['commentForm' + taskAssignmentId].resetFields()
              this.busyComment = false
            })
            .catch((err) => {
              this.$emit('on-error', err.message)
              this.$notify.error(this.$t('notify.error'))
              this.busyComment = false
            })
        }
      })
    },
    getCodes() {
      this.busyUsers = true
      lookupApi.isSuperUser(this.$store.state.user.sub)
        .then((c) => {
          this.isSuperUser = c.data
          if (!this.isSuperUser) {
            lookupApi.getOrganization(this.$store.state.user.sub)
              .then((v) => {
                var addUser = u => {
                  this.users.push({text: u.text, value: u.value, value2: u.value2})
                  if (u.children) {
                    u.children.forEach(c => addUser(c))
                  }
                }
                addUser(v.data)
                this.users.sort(function (a, b) {
                  return a.text.localeCompare(b.text)
                })
                this.busyUsers = false
              })
              .catch(() => {
                this.errorMessage = this.$t('newtask.errorTemplateCode')
                this.busyUsers = false
              })
          }
        })
        .catch(() => {
          this.errorMessage = this.$t('isSuperUserError')
          this.busyUsers = false
        })
      this.busyUsers = false
    },
    canBeCompleted(index) {
      return this.disabled === false &&
        (this.tasks[index].assignmentUserCode === this.$store.state.user.username) &&
        (this.tasks[index].status !== TaskStatus.Completed)
    },
    remainHour(hour) {
      if (hour <= 0) {
        hour = 0
        return hour
      } else {
        return hour
      }
    },
    remainDay(day) {
      if (day <= 0) {
        day = 0
        return day
      } else {
        return day
      }
    },
    getDateTime(date) {
      var d = date === null ? '' : new Date(date)
      return d === '' ? '' : (d.toLocaleString('tr-TR'))
    },
    getTimeString(time) {
      const minute = parseInt(time / 60)
      const second = time % 60
      let msg = `${second} ${this.$t('deadline.secondsShort')}`
      if (minute > 0) {
        msg = `${minute} ${this.$t('deadline.minutesShort')} ` + msg
      }
      return msg
    },
    rowStyle({row, rowIndex}) {
      if (row.personPhoneCallActivityId === this.selectedTaskActivityCommunicationActivityId) {
        return 'newBackGround'
      } else {
        return ''
      }
    }


  }
}
</script>

<style>
.newBackGround {
  background-color: #f9c3c3 !important
}

.newBackGround > td, .el-table__body tr.current-row > td {
  background-color: #f9c3c3 !important
}
</style>
<style lang="scss" scoped>
.middle {
  ::v-deep(.el-form-item__label) {
    display: flex;
    align-items: center;
  }
}
.processTaskList :deep(.el-collapse-item.is-active:first-child .el-collapse-item__wrap) {
  padding-top: 20px;
}
.processTaskList :deep(.el-collapse-item.is-active .el-collapse-item__header) {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  .fa-solid.fa-caret-down {
    transform: rotate(-90deg);
  }
}
.processTaskList :deep(.el-collapse-item .el-collapse-item .el-collapse-item__header) {
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}
.processTaskList :deep(.el-collapse-item.is-active .el-collapse-item.is-active .el-collapse-item__header) {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.processTaskList :deep(.el-collapse-item.is-active .el-collapse-item.is-active .el-table) {
  border: none;
}
.processTaskList :deep(.el-collapse-item__header) {
  object-fit: contain;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border: solid 1px #ddd;
  background: #fff;
  height: 140px;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding-right: 50px;
  .row1, .row2 {
    width: 100%;
  }
  .task-title {
    width: 750px;
    line-height: 24px;
  }
  .ml-20 {
    margin-left: 20px;
  }

  span {
    vertical-align: middle;
  }

  .day, .hour {
    color: #b7b7b7;
    font-size: 14px;
  }

  .dayCount, .hourCount {
    background: #b7b7b7;
    color: #fff;
    border-radius: 50%;
    font-size: 14px;
    width: 40px;
    height: 40px;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .font1 {
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
    word-break: break-word;
    white-space: nowrap;
  }

  .orangeFont {
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: #f59f3e;
  }

  .normalFont {
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
  }

  .el-checkbox__inner {
    width: 30px;
    height: 30px;
    border-radius: 20px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    border: 8px solid #fff;
    background: #b7b7b7;
  }

  .el-checkbox__inner::after {
    display: none;
  }

  .el-checkbox__input {
    border: 1px solid #b7b7b7;
    border-radius: 50%;
  }

  .el-collapse-item__arrow {
    // margin-bottom: 70px;
  }

  .commentsButton {
    background: none;
    border: none;
    padding: 0px;
    vertical-align: middle;

    .svg-icon {
      width: 30px;
      height: 30px;
    }
  }
  .el-icon {
    display:none;
  }
  .fa-solid.fa-caret-down {
    position: absolute;
    right: 15px;
    top: 60px;
    font-size: 21px;
  }

  .el-collapse-item__arrow::before {
    color: #b7b7b7;
    width: 20px;
    height: 20px;
    font-weight: bold;
    font-size: 20px;
  }
}
.main-collapse {
    ::v-deep(.el-collapse-item__wrap) {
      position: relative;
      top: -1px;
      z-index: 0;
      border: 1px solid #ddd;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    ::v-deep(.el-collapse-item__wrap:first-child) {
      padding-top: 25px;
    }
    // ::v-deep(.el-collapse-item__header) {
    //   z-index: 1;
    // }
  }
:deep(.processTaskList) {
  .el-select {
    width: 100%;
  }

  .el-collapse-item__wrap {
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #e5e5e5;
    background-color: #ffffff;
  }
}

.dialogComments {
  :deep(.el-dialog__body) {
    padding: 25px;
    height: 350px;
    overflow: auto;

    .grayBackground {
      margin-bottom: 20px;

      .usersComments {
        border-radius: 4px;
        box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
        border: solid 1px #e5e5e5;
        background-color: #ffffff;
        padding: 10px;
        font-weight: 100;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .child-1 {
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #000000;
          width: 87%;
        }

        .child-2 {
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #b7b7b7;
        }
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

  :deep(.el-dialog__body::-webkit-scrollbar-track) {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  :deep(.el-dialog__body::-webkit-scrollbar) {
    width: 6px;
    background-color: #F5F5F5;
  }

  :deep(.el-dialog__body::-webkit-scrollbar-thumb) {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #C84243;
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

  :deep(.el-form-item__label) {
    color: #fff;
    font-weight: 500;
  }

  :deep(.el-dialog) {
    width: 960px !important;
  }
}

@media (min-width: 1280px) and (max-width: 1536px) {
  :deep(.taskStatus.el-col-push-8) {
    left: 30% !important;
  }
  .task-title {
    width: 300px !important;
  }
}
</style>
