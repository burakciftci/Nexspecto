<template>
  <div class="app-container policy">
    <el-card>
      <el-dialog v-model="policyDialogVisible" title="Yetki Ekle">
        <el-card style="width: 90%">
          <el-form
            v-loading="busy"
            ref="saveForm"
            :model="policyModel"
            label-position="left"
            label-width="220px"
          >
            <el-form-item label="Yetki Grubu" prop="group">
              <el-select
                v-model="policyModel.groupId"
                placeholder="Yetki Grubu"
              >
                <el-option
                  v-for="item in partnerPolicyGroups"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Yetki İsmi" prop="name">
              <el-input
                v-model="policyModel.name"
                placeholder="Yetki ismini giriniz..."
                clearable
              />
            </el-form-item>
            <el-form-item label="Yetki Başlığı" prop="title">
              <el-input
                v-model="policyModel.title"
                placeholder="Yetki başlığını giriniz..."
                clearable
              />
            </el-form-item>
            <el-form-item label="Yetki Açıklaması" prop="description">
              <el-input
                v-model="policyModel.description"
                placeholder="Yetki açıklamasını giriniz..."
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-form-item>
                <el-row type="flex" justify="end">
                  <el-button type="action" @click="savePolicy">{{
                    this.$t("buttons.save")
                  }}</el-button>
                  <el-button
                    class="default-button"
                    @click="closePolicyUpdateForm"
                    >{{ this.$t("buttons.cancel") }}</el-button
                  >
                </el-row>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-card>
      </el-dialog>
      <el-dialog v-model="policyGroupDialogVisible" title="Yetki Grubu Ekle">
        <el-card style="width: 90%">
          <el-form
            v-loading="busy"
            ref="saveForm"
            :model="policyModel"
            label-position="left"
            label-width="220px"
          >
            <el-form-item label="Yetki Grubu İsmi" prop="name">
              <el-input
                v-model="policyModel.name"
                placeholder="Yetki grubu ismini giriniz..."
                clearable
              />
            </el-form-item>
            <el-form-item label="Yetki Grubu Başlığı" prop="title">
              <el-input
                v-model="policyModel.title"
                placeholder="Yetki grubu başlığını giriniz..."
                clearable
              />
            </el-form-item>
            <el-form-item label="Yetki Grubu Açıklaması" prop="description">
              <el-input
                v-model="policyModel.description"
                placeholder="Yetki grubu açıklamasını giriniz..."
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-form-item>
                <el-row type="flex" justify="end">
                  <el-button type="action" @click="savePolicy">{{
                    this.$t("buttons.save")
                  }}</el-button>
                  <el-button
                    class="default-button"
                    @click="closePolicyUpdateForm"
                    >{{ this.$t("buttons.cancel") }}</el-button
                  >
                </el-row>
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-card>
      </el-dialog>
      <el-dialog
        v-model="dialogVisible"
        width="70%"
        title="İzin Verilen Görevler ve Çalışanlar"
      >
        <el-row style="margin: 0px">
          <el-col :span="12" class="title2">İzin Verilen Görevler </el-col>
          <el-col :span="12" class="title"> İzin Verilen Çalışanlar </el-col>
        </el-row>
        <el-row style="margin: 0px">
          <el-col :span="12" class="list2">
            <el-row
              v-for="(item, index) in userPermissionList.positionTypeList"
              :key="item"
              style="margin-bottom: 10px"
            >
              <el-col :span="2"> {{ index + 1 }}</el-col>
              <el-col :span="20"> {{ item.positionTypeName }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="12" class="list">
            <el-row
              v-for="(item, index) in userPermissionList.employeeList"
              :key="item"
              style="margin-bottom: 10px"
            >
              <el-col :span="2"> {{ index + 1 }}</el-col>
              <el-col :span="20"> {{ item.partyName }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-dialog>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select
            ref="selectedPosition"
            v-model="selectedPositionType"
            :placeholder="'Yetki Tanımlası Yapılacak Görevleri Seçiniz.'"
            :loading="busy"
            :filter-method="filterMethod"
            filterable
            style="width: 100%"
            clearable
            @change="getPositionTypePermissions"
          >
            <div style="height: 100%; display: flex">
              <div style="margin: auto; padding-left: 5px">
                <i class="el-icon-search" />
              </div>
            </div>
            <el-option
              v-for="item in temp"
              :key="item.positionTypeId"
              :label="item.description"
              :value="item.positionTypeId"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select
            ref="selectedPerson"
            v-model="selectedEmployee"
            :remote-method="getUsers"
            :loading="busy"
            :filter-method="filterMethodEmployee"
            placeholder="Yetki Tanımlaması Yapılacak Kullanıcıları Seçiniz."
            filterable
            clearable
            style="width: 100%"
            @change="getEmployeePermissions"
          >
            <div style="height: 100%; display: flex">
              <div style="margin: auto; color: crimson; padding-left: 6px">
                <i class="el-icon-search" />
              </div>
            </div>
            <el-option
              v-for="value in tempEmployee"
              :key="value.partyId"
              :label="value.name"
              :value="value.partyId"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-button class="action-button button-right" @click="savePolicyPair"
            >Yetkileri Kaydet</el-button
          >
          <!-- <el-button
            :disabled="listPositionType === null && listEmployee === null"
            class="primary-button button-right"
            @click="openDialog = true"
          >
            Yetkileri Gör
          </el-button> -->
          <el-button
            class="action-button button-right"
            @click.prevent="addPolicy"
          >
            Yetki Ekle
          </el-button>
          <el-button
            class="action-button button-right"
            @click.prevent="addPolicyGroup"
          >
            Yetki Grubu Ekle
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row class="header">
      <el-col :span="6">
        <span>Bağlantılar</span>
      </el-col>
      <el-col :span="4">
        <span>Açıklama</span>
      </el-col>
      <el-col :span="5">
        <span>Modül Adı</span>
      </el-col>
      <el-col :span="3" align="center">
        <span>Görev Bazında Yetkiler</span>
      </el-col>
      <el-col :span="3" align="center">
        <span>Çalışan Bazında Yetkiler</span>
      </el-col>
    </el-row>
    <el-row class="header" style="background: #fff; color: #000">
      <el-col :span="6">
        <!-- <span>{{ 'Tümünü Aç Kapa' }}</span> -->
      </el-col>
      <el-col :span="4">
        <!-- <span>{{ 'Açıklama' }}</span> -->
      </el-col>
      <el-col :span="5" align="right">
        <span>{{ "Tümünü Aç Kapa" }}</span>
      </el-col>
      <el-col :span="3" align="center">
        <el-switch
          v-model="all"
          :disabled="disablePosition()"
          active-color="#f59f3e"
          inactive-color="#b9b9b9"
          @change="changeAll"
        />
      </el-col>
      <el-col :span="3" align="center">
        <el-switch
          v-model="all2"
          :disabled="disableEmployee()"
          active-color="#f59f3e"
          inactive-color="#b9b9b9"
          @change="changeAll2"
        />
      </el-col>
    </el-row>
    <el-row
      v-for="(item, index) in items"
      :key="index"
      :name="index + 1"
      :style="item.name === 'everything' ? 'display:none;' : ''"
      type="flex"
      align="middle"
      style="margin-bottom: 0"
    >
      <el-col :span="24">
        <div id="collapse-header">
          <el-row type="flex" align="middle" style="margin-bottom: 0">
            <el-col :span="6">
              <span
                v-if="collapse === index"
                class="meta-title"
                @click="collapse = -2"
              >
                {{ item.title }}
              </span>
              <span v-else class="meta-title" @click="collapse = index">
                {{ item.title }}
              </span>
            </el-col>
            <el-col :span="4">
              <!-- <span>{{ item.meta? $t('route.description.'+ item.meta.description) : ' ' }}</span> -->
            </el-col>
            <el-col :span="5">
              <!-- <span>{{ item.meta? $t('route.tag.'+ item.meta.tag) : ' ' }}</span> -->
            </el-col>
            <el-col :span="3" align="center">
              <el-switch
                :disabled="disablePosition()"
                v-model="
                  positionTypePolicyList.find((i) => i.name === item.name)
                    .permission
                "
                active-color="#f59f3e"
                inactive-color="#b9b9b9"
              />
            </el-col>
            <el-col :span="3" align="center">
              <el-switch
                :disabled="disableEmployee()"
                v-model="
                  employeePolicyList.find((i) => i.name === item.name)
                    .permission
                "
                active-color="#f59f3e"
                inactive-color="#b9b9b9"
              />
            </el-col>
            <el-col :span="3" align="right">
              <div
                v-if="collapse === index"
                style="cursor: pointer; color: #b7b7b7"
                @click="collapse = -2"
              >
                <span>Daha Az</span>
                <svg-icon icon-class="accordion-close-icon" />
              </div>
              <div
                v-else
                style="cursor: pointer; color: #b7b7b7"
                @click="collapse = index"
              >
                <span>Daha Fazla</span>
                <svg-icon
                  icon-class="accordion-close-icon"
                  style="transform: rotate(90deg); -ms-transform: rotate(90deg)"
                />
              </div>
            </el-col>
          </el-row>
        </div>
        <el-collapse-transition>
          <div v-show="collapse == index" class="collapse-content">
            <el-row
              v-for="(x, index2) in item.children"
              :key="index2"
              type="flex"
              align="middle"
              class="children-row"
            >
              <el-col :span="6">
                <span style="width: 200px; display: block; line-height: 16px">
                  {{ x.title }}
                </span>
              </el-col>
              <el-col :span="4">
                <span class="read-more">
                  {{ x.description }}
                </span>
                <el-popover
                  placement="bottom"
                  width="200"
                  trigger="click"
                  class="desc"
                >
                  <svg-icon
                    icon-class="read-more"
                    style="
                      width: 22px;
                      height: 22px;
                      cursor: pointer;
                      position: relative;
                      left: -20px;
                      top: -2px;
                    "
                  />
                  <span style="word-break: break-word">
                    {{ x.description }}
                  </span>
                </el-popover>
              </el-col>
              <el-col :span="5">
                <span> </span>
              </el-col>
              <el-col :span="3" align="center">
                <el-switch
                  :disabled="disablePosition()"
                  v-model="
                    positionTypePolicyList.find((i) => i.name === x.name)
                      .permission
                  "
                  active-color="#f59f3e"
                  inactive-color="#b9b9b9"
                />
              </el-col>
              <el-col :span="3" align="center">
                <el-switch
                  :disabled="disableEmployee()"
                  v-model="
                    employeePolicyList.find((i) => i.name === x.name).permission
                  "
                  active-color="#f59f3e"
                  inactive-color="#b9b9b9"
                />
              </el-col>
              <!-- <el-col :span="3" align="center">
                <el-button
                  class="detail-button"
                  @click="
                    getResourceUsers(
                      positionTypePolicyList.find((i) => i.resource === x.name)
                        .resource
                    )
                  "
                  >Detay</el-button
                >
              </el-col> -->
            </el-row>
          </div>
        </el-collapse-transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import policyApi from "@/api/admin/policy";

export default {
  name: "Policy",
  data() {
    return {
      partnerPolicies: [],
      partnerPolicyGroups: [],
      positionTypes: [],
      organizations: [],
      dialogVisible: false,
      employees: [],
      selectedEmployee: null,
      selectedPositionType: null,
      userPermissionList: {},
      partyType: 1,
      all: false,
      all2: false,
      employeePolicyList: [],
      positionTypePolicyList: [],

      items: [],
      // items2: [],
      temp: [],
      tempEmployee: [],
      listEmployee: null,
      listPositionType: null,
      busy: true,
      activeNames: [],
      openDialog: false,
      collapse: -1,
      search: "",
      employeeNameSurname: "",
      policyName: "",
      excelData: [],
      excelArray: [],
      downloading: false,
      disabled: false,
      filterArray: [],
      linksArray: [],
      policyDialogVisible: false,
      policyGroupDialogVisible: false,
      policyModel: {
        name: "",
        title: "",
        description: "",
        groupId: null,
      },
      // validation: {
      //   group: [
      //     {
      //       required: true,
      //       message: this.$t("partner.policygrouprequired"),
      //     },
      //   ],
      //   title: [
      //     {
      //       required: true,
      //       message: this.$t("partner.policytitlerequired"),
      //     },
      //     {
      //       min: 2,
      //       max: 250,
      //       message: this.$t("partner.policytitlenotvalid"),
      //     },
      //   ]
      // },
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    async getPolicies() {
      try {
        const v = await policyApi.getPolicies();
        this.partnerPolicies = v.data.result.filter((x) => x.groupId);
        this.partnerPolicyGroups = v.data.result.filter((x) => !x.groupId);
        console.log(JSON.parse(JSON.stringify(this.partnerPolicies)));
      } catch (err) {
        this.$notify.error(this.$t("notify.error") + err.message);
      }
      this.busy = false;
    },
    refreshRouterList() {
      this.items = [];
      this.positionTypePolicyList = [];
      this.employeePolicyList = [];

      this.partnerPolicyGroups.forEach((element) => {
        if (element.name) {
          const children = this.partnerPolicies.filter(
            (x) => x.groupId == element.id
          );
          if (children.length > 0) {
            element["children"] = children;
          }
          this.items.push(element);
        }
      });
      console.log(JSON.parse(JSON.stringify(this.items)));

      this.items.forEach((element) => {
        if (element.name) {
          this.positionTypePolicyList.push({
            permission:
              this.listPositionType &&
              this.listPositionType.findIndex(
                (x) => x.policy.id === element.id && x.type === "positiontype"
              ) >= 0,
            id: element.id,
            name: element.name,
            title: element.title,
            description: element.description,
          });
          this.employeePolicyList.push({
            permission:
              this.listPositionType &&
              this.listPositionType.findIndex(
                (x) => x.policy.id === element.id && x.type === "employee"
              ) >= 0,
            id: element.id,
            name: element.name,
            title: element.title,
            description: element.description,
          });

          if (element.children) {
            element.children.forEach((el) => {
              if (el.name) {
                this.positionTypePolicyList.push({
                  permission:
                    this.listPositionType &&
                    this.listPositionType.findIndex(
                      (x) => x.policy.id === el.id && x.type === "positiontype"
                    ) >= 0,
                  id: el.id,
                  name: el.name,
                  title: el.title,
                  description: el.description,
                });
                this.employeePolicyList.push({
                  permission:
                    this.listEmployee &&
                    this.listEmployee.findIndex(
                      (x) => x.policy.id === el.id && x.type === "employee"
                    ) >= 0,
                  id: el.id,
                  name: el.name,
                  title: el.title,
                  description: el.description,
                });
              }
            });
          }
        }
      });
      console.log(JSON.parse(JSON.stringify(this.positionTypePolicyList)));

      this.all = this.items.length === this.positionTypePolicyList.length;
      this.all2 = this.items.length === this.employeePolicyList.length;
    },
    async refresh() {
      this.getPositionTypes();
      this.getUsers("");
      await this.getPolicies();
      this.refreshRouterList();
    },
    addPolicy() {
      this.policyDialogVisible = true;
      this.policyModel = {
        name: "",
        title: "",
        description: "",
        groupId: null,
      };
    },
    addPolicyGroup() {
      this.policyGroupDialogVisible = true;
      this.policyModel = {
        name: "",
        title: "",
        description: "",
        groupId: null,
      };
    },
    savePolicy() {
      policyApi
        .createPolicy(this.policyModel)
        .then(() => {
          this.$notify.success(this.$t("notify.success"));
          this.closePolicyUpdateForm();
          this.getPolicies();
        })
        .catch((err) => {
          this.$notify.error(this.$t("notify.error") + err.message);
          this.busy = false;
        });
    },
    savePolicyPair() {
      if (!(this.selectedPositionType || this.selectedEmployee)) {
        alert("En az bir görev veya çalışan seçiniz...");
        return;
      }

      if (this.selectedPositionType) {
        const createList = this.positionTypePolicyList
          .filter(
            (element) =>
              element.permission &&
              this.listPositionType.findIndex(
                (x) => element.id == x.policy.id
              ) < 0
          )
          .map((x) => x.id);

        if (createList.length > 0)
          policyApi
            .createPolicyPair([
              {
                positionTypeId: this.selectedPositionType,
                policyIdArray: createList,
              },
            ])
            .then(() => {
              this.$notify.success(this.$t("notify.success"));
              this.getPositionTypePermissions();
              this.busy = false;
            })
            .catch((err) => {
              this.$notify.error(this.$t("notify.error") + err.message);
              this.busy = false;
            });

        const deleteList = this.listPositionType
          .filter(
            (pairObj) =>
              this.positionTypePolicyList.findIndex(
                (element) =>
                  pairObj.policy.id == element.id && !element.permission
              ) >= 0
          )
          .map((x) => x.id);

        if (deleteList.length > 0)
          policyApi
            .deletePolicyPair(deleteList)
            .then(() => {
              this.$notify.success(this.$t("notify.success"));
              this.getPositionTypePermissions();
              this.busy = false;
            })
            .catch((err) => {
              this.$notify.error(this.$t("notify.error") + err.message);
              this.busy = false;
            });
      }

      if (this.selectedEmployee) {
        const createList = this.employeePolicyList
          .filter(
            (element) =>
              element.permission &&
              this.listEmployee.findIndex(
                (x) => element.id == x.policy.id
              ) < 0
          )
          .map((x) => x.id);

        if (createList.length > 0)
          policyApi
            .createPolicyPair([
              {
                userId: this.selectedEmployee,
                policyIdArray: createList,
              },
            ])
            .then(() => {
              this.$notify.success(this.$t("notify.success"));
              this.getEmployeePermissions();
              this.busy = false;
            })
            .catch((err) => {
              this.$notify.error(this.$t("notify.error") + err.message);
              this.busy = false;
            });

        const deleteList = this.listEmployee
          .filter(
            (pairObj) =>
              this.employeePolicyList.findIndex(
                (element) =>
                  pairObj.policy.id == element.id && !element.permission
              ) >= 0
          )
          .map((x) => x.id);

        if (deleteList.length > 0)
          policyApi
            .deletePolicyPair(deleteList)
            .then(() => {
              this.$notify.success(this.$t("notify.success"));
              this.getPositionTypePermissions();
              this.busy = false;
            })
            .catch((err) => {
              this.$notify.error(this.$t("notify.error") + err.message);
              this.busy = false;
            });
      }
    },
    clear() {},
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    disablePosition() {
      if (!this.selectedPositionType) {
        return true;
      } else {
        return false;
      }
    },
    disableEmployee() {
      if (!this.selectedEmployee) {
        return true;
      } else {
        return false;
      }
    },
    getResourceUsers(resource) {
      this.busy = true;
      this.dialogVisible = true;
      policyApi
        .getResourceUsers(resource)
        .then((v) => {
          this.userPermissionList = v.data.result;
          this.busy = false;
        })
        .catch(() => {
          this.$notify.success(this.$t("notify.deleteSuccess"));
          this.busy = false;
        });
    },
    getUsers(query) {
      this.busy = true;
      policyApi
        .getUsers(query)
        .then((v) => {
          this.employees = v.data.result;
          this.tempEmployee = this.employees;
          this.busy = false;
        })
        .catch(() => {
          this.$notify.success(this.$t("notify.deleteSuccess"));
          this.busy = false;
        });
    },
    filterMethod(query) {
      this.temp = this.positionTypes.filter(
        (i) => i.description.indexOf(query.toLocaleUpperCase("tr-TR")) > -1
      );
    },
    filterMethodEmployee(query) {
      this.tempEmployee = this.employees.filter(
        (i) => i.name.indexOf(query.toLocaleUpperCase("tr-TR")) > -1
      );
    },
    getEmployeePermissions() {
      this.selectedPositionType = null;
      this.listEmployee = [];
      this.listPositionType = [];

      this.busy = true;
      policyApi
        .getPolicyPairs(this.selectedPositionType, this.selectedEmployee)
        .then((v) => {
          this.listEmployee = v.data.result.map((x) => {
            return { ...x, type: "employee" };
          });
          // this.refreshRouterList();
          this.busy = false;
        })
        .catch((err) => {
          this.$notify.error(this.$t("notify.error") + err.message);
          this.busy = false;
        });

      this.tempEmployee.forEach((i) => {
        if (i.partyId === this.selectedEmployee) {
          this.employeeNameSurname = i.name;
        }
      });
    },
    getPositionTypePermissions() {
      this.selectedEmployee = null;
      this.listEmployee = [];
      this.listPositionType = [];
      console.log(this.selectedPositionType);

      if (this.selectedPositionType) {
        this.busy = true;
        policyApi
          .getPolicyPairs(this.selectedPositionType, this.selectedEmployee)
          .then((v) => {
            this.listPositionType = v.data.result.map((x) => {
              return { ...x, type: "positiontype" };
            });
            console.log(this.listPositionType);
            this.refreshRouterList();
            this.busy = false;
          })
          .catch((err) => {
            this.$notify.error(this.$t("notify.error") + err.message);
            this.busy = false;
          });
      }

      this.temp.forEach((i) => {
        if (i.positionTypeId === this.selectedPositionType) {
          this.policyName = i.description;
        }
      });
    },
    changeAll() {
      this.positionTypePolicyList.forEach((el) => {
        el.permission = this.all;
      });
    },
    changeAll2() {
      this.employeePolicyList.forEach((el) => {
        el.permission = this.all2;
      });
    },
    getPositionTypes() {
      policyApi
        .getPartnerPositionTypes()
        .then((v) => {
          this.positionTypes = v.data.result;
          console.log(this.positionTypes);
          this.temp = this.positionTypes;
          this.busy = false;
        })
        .catch((err) => {
          this.$notify.error(this.$t("notify.error") + err.message);
          this.busy = false;
        });
    },
    closePolicyUpdateForm() {
      this.policyDialogVisible = false;
      this.policyGroupDialogVisible = false;
      this.busy = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.policy >>> {
  .header {
    height: 70px;
    display: flex;
    align-items: center;
    object-fit: contain;
    border-radius: 4px;
    background-image: linear-gradient(94deg, #ff5252, #c94343);
    color: #fff;
    font-weight: 100;
    margin-bottom: 0;
    padding: 10px;
  }
  #collapse-header {
    border: solid 1px #e5e5e5;
    background-image: linear-gradient(93deg, #f5f5f5, #ffffff);
    height: 60px;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    line-height: 18px !important;
    .meta-title {
      font-size: 18px;
      cursor: pointer;
    }
  }
  .collapse-content {
    object-fit: contain;
    border: solid 1px #e5e5e5;
    background-color: #ffffff;
    padding: 20px;
    span {
      font-size: 16px;
      font-weight: 100;
    }
    .el-row:last-child {
      margin-bottom: 0;
    }
  }
  .el-collapse-item__header {
    border: solid 1px #e5e5e5;
    background-image: linear-gradient(93deg, #f5f5f5, #ffffff);
    height: 60px;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    line-height: 18px !important;
    .meta-title {
      font-size: 18px;
    }
  }
  .read-more {
    display: inline-block !important;
    width: 140px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-switch__core {
    width: 60px !important;
    height: 30px !important;
    border-radius: 20px !important;
    &:after {
      top: 4px !important;
      left: 4px !important;
      width: 20px !important;
      height: 20px !important;
    }
  }
  .el-switch.is-checked .el-switch__core::after {
    left: 100% !important;
    margin-left: -24px !important;
  }
  .detail-button {
    border: solid 1px #e5e5e5;
    background-color: #ffffff;
    display: flex;
    height: 30px;
    align-items: center;
    span {
      font-size: 14px;
      font-weight: bold;
      color: #000;
    }
  }
  .el-select .el-icon-search {
    font-weight: bold;
    color: #000;
  }
  .el-select .el-input .el-select__caret {
    font-size: 26px !important;
    transform: rotateZ(0) !important;
  }
  .el-select .el-icon-arrow-up:before {
    content: "\25be";
    color: #000;
  }
  .children-row {
    border-bottom: 1px solid rgb(229, 229, 229);
    margin-bottom: 0;
    padding: 10px 0;
    &:last-child {
      border-bottom: none;
    }
  }
  #myTable {
    th,
    td {
      padding: 5px;
      font-size: 16px;
    }
  }
  #myInput {
    width: 350px;
    height: 40px;
    padding: 12px 14px 12px 12px;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 19px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e5e5e5;
    background-color: #ffffff;
  }
}
.title {
  background-color: rgb(241, 224, 170);
  border-radius: 4px 4px 0px 0px !important;
  font-weight: bold;
  border: 1px solid rgb(241, 224, 170);
  padding: 5px;
}
.list {
  border: 1px solid rgb(241, 224, 170);
  padding: 5px;
}
.title2 {
  background-color: rgb(170, 195, 241);
  border-radius: 4px 4px 0px 0px !important;
  font-weight: bold;
  border: 1px solid rgb(170, 195, 241);
  padding: 5px;
}
.list2 {
  border: 1px solid rgb(170, 195, 241);
  padding: 5px;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
