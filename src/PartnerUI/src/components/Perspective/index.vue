<template>
  <div v-loading="loading">
    <el-row v-if="!isCallCenterScreen" type="filter">
      <div v-if="isDatesVisible" style="line-height: 25px;">
        <el-form :inline="true">
          <div
            v-if="defaultOptions.showPastButton"
            :class="
              listQuery.dayFilter === 'p'
                ? 'speech-bubble'
                : 'speech-bubble-inactive'
            "
            style="padding: 0 10px"
            @click="
              listQuery.dayFilter = 'p';
              getData();
            "
          >
            {{ this.$t("notify.past") }}
          </div>
          <div
            v-if="defaultOptions.showYesterdayButton"
            :class="
              listQuery.dayFilter === '-1'
                ? 'speech-bubble'
                : 'speech-bubble-inactive'
            "
            style="padding: 0 10px"
            @click="
              listQuery.dayFilter = '-1';
              getData();
            "
          >
            {{ this.$t("notify.yesterday") }}
          </div>
          <div
            v-if="defaultOptions.showTodayButton"
            :class="
              listQuery.dayFilter === '1'
                ? 'speech-bubble'
                : 'speech-bubble-inactive'
            "
            style="padding: 0 10px"
            @click="
              listQuery.dayFilter = '1';
              getData();
            "
          >
            {{ this.$t("notify.today") }}
          </div>
          <el-form-item label="Tarih Aralığı" label-widt="90px">
            <el-date-picker
              v-if="defaultOptions.showDatePicker"
              v-model="listQuery.dateRange"
              :picker-options="pickerOptions"
              range-separator="-"
              value-format="YYYY-MM-DD"
              type="daterange"
              start-placeholder="Başlangıç"
              end-placeholder="Bitiş"
              @change="datePickerChange()"
            />
          </el-form-item>
          <div
            v-if="defaultOptions.showAllDatesButton"
            :class="
              listQuery.dayFilter === '0'
                ? 'speech-bubble'
                : 'speech-bubble-inactive'
            "
            style="padding: 0 10px"
            @click="
              listQuery.dayFilter = '0';
              getData();
            "
          >
            {{ this.$t("notify.all") }}
          </div>
        </el-form>
      </div>
      <div style="line-height: 25px;margin-left: 20px;">
        <div @keyup.enter="searchWithText">
          <el-form :inline="true">
            <el-form-item v-if="options.searchType" label="Tarih Aralığı" label-widt="90px">
              <el-select
                v-model="listQuery.searchArea"
                style="
                  width: 30%;
                  font-size: 9px;
                  padding: 1px;
                  margin-bottom: 10px;
                "
                @change="clearSearchText"
              >
                <el-option :value="'customerId'" :label="'Tasarruf Sahibi No'"
                >Tasarruf Sahibi No
                </el-option
                >
                <el-option :value="'idno'" :label="'TC No'">TC No</el-option>
                <el-option :value="'phone'" :label="'Telefon'"
                >Telefon
                </el-option
                >
                <el-option :value="'name'" :label="'İsim'">İsim</el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="options.showSearchText && listQuery.searchArea === 'name'" label="Kayıt İçi Arama" label-widt="90px">
              <el-input
                v-uppercase
                :key="keyValue"
                v-model="searchText"
                :placeholder="searchDescription"
                clearable
              >
                <template #append>
                  <el-button class="input-append-button" @click="searchWithText">
                    <i class="fa-solid fa-magnifying-glass" />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="options.showSearchText && listQuery.searchArea === 'phone'" label="Tarih Aralığı" label-widt="90px">
              <el-input
                v-uppercase
                v-mask="'+90(###) ### ## ##'"
                v-model="searchText"
                :placeholder="'+90(###) ### ## ##'"
                :key="keyValue"
                prefix-icon="Search"
                clearable
              >
                <templete>
                  <el-button :icon="Search" @click="searchWithText"/>
                </templete>
              </el-input>
            </el-form-item>
            <el-form-item v-if="options.showSearchText && listQuery.searchArea === 'idno'" label="Tarih Aralığı" label-widt="90px">
              <el-input
                v-uppercase
                v-mask="'###########'"
                v-model="searchText"
                :placeholder="searchDescription"
                :key="keyValue"
                prefix-icon="el-icon-search"
                clearable
              >
                <templete>
                  <el-button icon="Search" @click="searchWithText"/>
                </templete>
              </el-input>
            </el-form-item>
            <el-form-item v-if="options.showSearchText && listQuery.searchArea === 'customerId'" label="Tarih Aralığı" label-widt="90px">
              <el-input
                v-uppercase
                v-mask="'#######'"
                v-model="searchText"
                :placeholder="searchDescription"
                :key="keyValue"
                prefix-icon="Search"
                clearable
              >
                <templete>
                  <el-button :icon="Search" @click="searchWithText"/>
                </templete>
              </el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-dropdown
              v-loading="busy"
              v-show="showInternalOrganization"
              :show-timeout="100"
              trigger="click"
              size="medium"
            >
              <span class="el-dropdown-link">
                <span v-if="listQuery.internalOrganizationId === ''">{{
                    $t("perspective.internalOrganizationTitle")
                  }}</span>
                <span v-if="listQuery.internalOrganizationId !== ''">{{
                    internalOrganizationTitle
                  }}</span>
                <i class="el-icon-caret-bottom el-icon--right"/>
              </span>
              <template #dropdown>
                <el-dropdown-menu
                  class="no-padding no-border"
                  style="width: 400px"
                >
                  <el-tree
                    :data="internalOrganizations"
                    @current-change="groupSelected"
                  />
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div>
            <el-dropdown
              v-loading="busy"
              v-show="showEmployee"
              :show-timeout="100"
              trigger="click"
              size="medium"
            >
              <span class="el-dropdown-link">
                <span v-if="listQuery.employeePartyId === ''">{{
                    $t("perspective.employeePartyIdTitle")
                  }}</span>
                <span v-if="listQuery.internalOrganizationId !== ''">{{
                    employeeName
                  }}</span>
                <i class="el-icon-caret-bottom el-icon--right"/>
              </span>
              <template #dropdown>
                <el-dropdown-menu
                  class="no-padding no-border"
                  style="width: 400px"
                >
                  <el-tree
                    :data="employeeList.filter((e) => e.label)"
                    @current-change="employeeSelected"
                  />
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-if="options.remainAmountFilter">
            <el-popover
              v-if="options.remainAmountFilter"
              placement="bottom"
              title="Detaylı Arama"
              width="400"
              trigger="click"
              content="this is content, this is content, this is content"
            >
              <template v-slot:reference>
                <span class="click">Detaylı Filtre</span>
              </template>
              <el-row class="remainAmountFilter">
                <el-form :label-position="labelPosition" label-width="105px">
                  <el-col :span="24">
                    <el-form-item
                      label="Minimum Kalan Taksit Tutarı"
                      style="line-height: 1.3"
                      class="a"
                    >
                      <!-- <el-input-number v-model="remainAmountMin" :controls="false" @change="remainAmountChanged"/> -->
                      <money
                        v-model="remainAmountMin"
                        v-bind="MoneyFormats.money"
                        :min="0"
                        autofocus
                        class="el-input__inner itemlabel"
                        style="width: 80%"
                        @blur.native="remainAmountChanged"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="Maximum Kalan Taksit Tutarı"
                      class="b"
                    >
                      <!-- <el-input-number v-model="remainAmountMax" :controls="false" @change="remainAmountChanged"/> -->
                      <money
                        v-model="remainAmountMax"
                        v-bind="MoneyFormats.money"
                        :min="0"
                        autofocus
                        class="el-input__inner itemlabel"
                        style="width: 80%"
                        @blur.native="remainAmountChanged"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="Teslimat Durumu" class="c">
                      <el-select
                        v-model="listQuery.deliveryStatus"
                        placeholder="Tes. Durumu"
                        style="width: 80%"
                        @change="getData(listQuery.deliveryStatus)"
                      >
                        <el-option
                          v-for="item in deliveryStatus"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-popover>
          </div>
        </div>
      </div>
      <el-button
        type="primary"
        style="position: absolute;right: 20px;"
        @click="searchWithText"
      >
        <i class="fa-solid fa-magnifying-glass margin-right-15"></i>
        Ara
      </el-button>
    </el-row>
    <slot name="header"/>
    <div v-if="showTable" :class="{ 'margin-top-20': !isCallCenterScreen }">
      <el-table
        v-if="perspectiveOptions.mode === 'table'"
        ref="table1"
        :data="items"
        :class="{ 'rounded': !isCallCenterScreen }"
        style="width: 100%"
        sortable
        @filter-change="filterHandler"
      >
        <slot name="table-columns"/>
      </el-table>
      <!-- <el-col :span="4">
        <el-dropdown
          v-if="perspectiveOptions.showArchive || perspectiveOptions.showActive"
          :hide-on-click="false"
          :show-timeout="100"
          size="mini"
          split-button
          trigger="click"
        >{{
            listQuery.isActive && listQuery.isArchive
              ? this.$t("templateList.actives") +
              ", " +
              this.$t("templateList.archives")
              : listQuery.isActive
                ? this.$t("templateList.actives")
                : listQuery.isArchive
                  ? this.$t("templateList.archives")
                  : " Yok "
          }}
          <template #dropdown>
            <el-checkbox
              v-if="perspectiveOptions.showArchive"
              v-model="listQuery.isArchive"
              :label="$t('templateList.archives')"
              @change="handleCheckBox"
            />
            <el-checkbox
              v-if="perspectiveOptions.showActive"
              v-model="listQuery.isActive"
              :label="$t('templateList.actives')"
              @change="handleCheckBox"
            />
          </template>
        </el-dropdown>
      </el-col>
      <el-col
        v-if="sumOfFinanceAmount && sumOfWorkingCostAmount"
        :span="8"
        style="float: right; padding-right: 0px; text-align: end"
      >
        <el-tag type="blue" style="font-size: 15px">
          {{ "Toplam F.B: " + sumOfFinanceAmount }}
        </el-tag>
        <el-tag type="blue" style="font-size: 15px">
          {{ "Toplam Ç.B: " + sumOfWorkingCostAmount }}
        </el-tag>
      </el-col>
      <el-col
        :span="8"
        style="float: right; padding-right: 10px; text-align: end"
      >
        <slot name="footer-summary"/>
      </el-col> -->
    </div>
    <el-row>
      <el-pagination
        v-if="perspectiveOptions.showPaging"
        :current-page="listQuery.page"
        :page-sizes="perspectiveOptions.pageSizes"
        :page-size="listQuery.limit"
        :total="count"
        :class="
          portfolioCockpit === true ? 'perspective-portfolio-cockpit' : ''
        "
        :layout="
          portfolioCockpit === true
            ? 'prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        "
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>
<script>
import lookupApi from "@/api/bpm/lookup";
import {hasActionPermissionNew} from "@/actionPermission.js";
import {MoneyFormats} from "@/utils/globalVars";
import {Search} from "@element-plus/icons-vue";
import {ElTable} from "element-plus";

export default {
  components: {},
  props: {
    searchDescription: {
      type: String,
      default: "",
    },
    microservice: {
      type: String,
      default: "",
      validator: function (value) {
        return (
          [
            "crm",
            "kernel",
            "finance",
            "dms",
            "audit",
            "identity",
            "hr",
          ].indexOf(value) !== -1
        );
      },
    },
    employeeListType: {
      type: String,
      default: "normal",
    },
    internalOrganizationListType: {
      type: String,
      default: "normal",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
    sumOfFinanceAmount: {
      type: String,
      default: null,
    },
    sumOfWorkingCostAmount: {
      type: String,
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
    // filters: {
    //   type: Array,
    //   default: () => []
    // },
    // filterProperty: {
    //   type: String,
    //   default: ''
    // },
    defaultFilters: {
      type: Array,
      default: () => [],
    },
    isCallCenterScreen: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 20,
    },
    onCard: {
      type: Boolean,
      default: false,
    },
    searchArea: {
      type: String,
      default: "name",
    },
    options: {
      type: Object,
      default: () => {
        return {
          showSearchText: true,
          defaultDayFilter: "1",
          showArchive: true,
          showActive: true,
          showPaging: true,
          searchType: false,
          pageSizes: [10, 20, 30, 50],
          showAllDatesButton: true,
          showYesterdayButton: true,
          showTodayButton: true,
          showDatePicker: true,
          initialDateRange: [],
          remainAmountFilter: false,
          mode: {
            type: String,
            value: "table",
          },
        };
      },
    },
    showInternalOrganization: {
      type: Boolean,
      default: true,
    },
    showEmployee: {
      type: Boolean,
      default: true,
    },
    paymentDateList: {
      type: Boolean,
      default: false,
    },
    showTable: {
      type: Boolean,
      default: true,
    },
    portfolioCockpit: {
      type: Boolean,
      default: false,
    },
    isPartner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Search,
      MoneyFormats,
      pickerOptions: {
        firstDayOfWeek: 1,
      },
      deliveryStatus: [
        {text: "Tümü", value: -1},
        {text: "Teslimat Yapıldı", value: 1},
        {text: "Teslimat Yapılmadı", value: 0},
      ],
      busy: false,
      delay: 1000,
      listQuery: {
        page: 1,
        limit: this.size,
        sub: "",
        isArchive: false,
        isActive: true,
        status: "",
        orderby: "",
        sortby: "",
        dayFilter: "1",
        dateRange: [],
        internalOrganizationId: "",
        employeeId: "",
        searchText: "",
        remainAmountMin: 0,
        remainAmountMax: 0,
        searchArea: this.searchArea,
        deliveryStatus: -1,
        templateTitle: "",
        title: "",
      },
      employeeListAll: false,
      internalOrganizationTitle: "",
      internalOrganizations: [],
      employeeList: [],
      keyValue: 0,
      employeeName: "",
      mounted: false,
      searchText: "",
      remainAmountMin: 0,
      remainAmountMax: 0,
      perspectiveOptions: {},
      defaultOptions: {
        showSearchText: true,
        showArchive: true,
        showActive: true,
        pageSizes: [10, 20, 30, 50],
        showPaging: true,
        defaultDayFilter: "1",
        showAllDatesButton: true,
        showYesterdayButton: true,
        showDatePicker: true,
        showPastButton: false,
        showTodayButton: true,
        remainAmountFilter: false,
        initialDateRange: [],
        mode: "table",
      },
      labelPosition: "left",
      likeManager: false,
    };
  },
  computed: {
    isDatesVisible() {
      return (
        this.options &&
        (this.perspectiveOptions.showYesterdayButton ||
          this.perspectiveOptions.showTodayButton ||
          this.perspectiveOptions.showAllDatesButton ||
          this.perspectiveOptions.showPastButton ||
          this.perspectiveOptions.showDatePicker)
      );
    },
  },
  watch: {
    searchText: function (newValue, oldValue) {
      if (oldValue.length > 0 && newValue.length === 0) {
        this.listQuery.searchText = "";
        this.getData();
      }
    },
  },
  // watch: {
  //   listQuery: {
  //     handler: function(newValue, oldValue) {
  //       if (this.mounted && (this.listQuery.dayFilter !== 'c' || (this.listQuery.dayFilter === 'c' && this.listQuery.dateRange.length === 2))) {
  //         this.$emit('get-items', this.listQuery)
  //       }
  //     },
  //     deep: true
  //   }
  // },
  mounted() {
    if (this.defaultFilters.length > 0) {
      this.defaultFilters.forEach((e) => {
        this.listQuery[e.columnName] = "";
        this.listQuery[e.columnName] = e.filterValues.join(",");
      });
    }
    // if (this.filters.length > 0) {
    //   this.listQuery[this.filterProperty] = ''
    //   this.listQuery[this.filterProperty] = this.filters.join(',')
    // }
    if (
      hasActionPermissionNew(
        this.$store.getters.permissions,
        "perspectiveEmployeeListAll"
      )
    ) {
      this.employeeListAll = true;
    }
    this.likeManager = hasActionPermissionNew(
      this.$store.getters.permissions,
      "perspectiveEmployeeListLikeManager"
    );
    this.$nextTick(() => {
      this.listQuery.sub = this.$store.state.user.sub;
      this.perspectiveOptions = this.defaultOptions;
      Object.keys(this.options).forEach((key) => {
        if (key in this.perspectiveOptions) {
          this.perspectiveOptions[key] = this.options[key];
        }
      });
      this.listQuery.dayFilter = this.perspectiveOptions.defaultDayFilter;
      this.listQuery.dateRange = this.perspectiveOptions.initialDateRange;
      if (!this.onCard && !this.isPartner) {
        this.getInternalOrganizationList();
      } else {
        this.getData();
      }
    });
  },
  // updated() {
  //   this.mounted = true
  // },
  methods: {
    hasActionPermissionNew,
    getData() {
      if (this.isPartner) {
        this.listQuery.sub = this.$store.state.user.sub;
        this.listQuery.internalOrganizationId =
          this.$store.state.user.internalOrganizationId;
       // this.listQuery.employeeId = this.$store.state.user.sub;
        this.$emit("get-items", this.listQuery);
        return;
      }
      if (this.internalOrganizations.length > 0 && !this.onCard) {
        this.$emit("get-items", this.listQuery);
      } else if (this.onCard) {
        this.$emit("get-items", this.listQuery);
      }
      if (this.defaultFilters.length > 0) {
        this.defaultFilters.forEach((e) => {
          this.$refs["table1"].columns.find(
            (i) => i.label === e.columnName
          ).filteredValue = e.filterValues;
        });
      }
    },
    color({row, rowIndex}) {
      if (row.lateAmount >= 10) {
        return "background:rgba(255, 249, 196, 1) !important;";
      }
    },
    remainAmountChanged() {
      this.listQuery.remainAmountMin = this.remainAmountMin;
      this.listQuery.remainAmountMax = this.remainAmountMax;
      if (this.remainAmountMin <= this.remainAmountMax) {
        this.getData();
      }
    },
    searchWithText() {
      this.listQuery.searchText = this.searchText;
      this.listQuery.page = 1;
      this.getData();
    },
    clearSearchText() {
      this.searchText = "";
      this.listQuery.searchText = this.searchText;
      this.keyValue++;
    },
    filterHandler(filters) {
      console.log(filters);
      this.listQuery.page = 1;
      this.listQuery.status = "";
      Object.entries(filters).forEach(
        ([key, value]) =>
          (this.listQuery[key] = Array.isArray(value) ? value.join(",") : value)
      );

      this.getData();
    },
    sortHandler({column, prop, order}) {
      this.listQuery.sortby = prop;
      this.listQuery.orderby = order;
      this.listQuery.page = 1;
      this.getData();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.page = 1;
      this.getData();
    },
    handleCheckBox() {
      this.listQuery.page = 1;
      this.getData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getData();
    },
    datePickerChange() {
      console.log("dr = " + this.listQuery.dateRange);
      this.listQuery.dayFilter = this.listQuery.dateRange === null ? "0" : "c";
      this.listQuery.page = 1;
      this.getData();
    },
    getInternalOrganizationList() {
      this.busy = true;
      const method =
        this.internalOrganizationListType === "normal"
          ? lookupApi.getPerspectiveInternalOrganizationTree()
          : this.internalOrganizationListType === "branch"
            ? lookupApi.getPerspectiveRegionBranchTree()
            : lookupApi.getPerspectiveRootTree();

      method
        .then((result) => {
          const extendArray = (a) =>
            a.map((e) => {
              const t = {id: e.value, label: e.text};
              if (e.children && e.children.length > 0) {
                t.children = extendArray(e.children);
              } else {
                delete t.children;
              }
              return t;
            });
          var r = [];
          if (result.data.children) {
            r = extendArray(result.data.children);
          }
          this.internalOrganizations = [
            ...[{id: result.data.value, label: result.data.text}],
            ...r,
          ];
          this.busy = false;
          this.groupSelected(this.internalOrganizations[0]);
        })
        .catch((err) => {
          this.$emit("on-error", err);
          this.busy = false;
        });
    },
    groupSelected(currentData) {
      this.listQuery.internalOrganizationId = currentData.id;
      this.internalOrganizationTitle = currentData.label;
      this.listQuery.page = 1;
      if (this.employeeListType === "normal") {
        this.getEmployeeList(currentData.id);
      } else {
        this.getEmployeeListForEveryone(currentData.id);
      }
    },
    getEmployeeListForEveryone(internalOrganizationId) {
      this.busy = true;
      lookupApi
        .getPerspectiveEmployeeListWithoutTree(internalOrganizationId)
        .then((v) => {
          if (v.data !== null) {
            if (v.data.length === 1 && !this.employeeListAll) {
              this.employeeList = [
                ...[{id: v.data[0].value, label: v.data[0].text}],
              ];
              this.listQuery.employeeId = v.data[0].value;
              this.employeeName = v.data[0].text;
            } else {
              this.employeeList = [
                ...[{id: undefined, label: this.$t("perspective.all")}],
              ];
              v.data
                .map((item) => ({id: item.value, label: item.text}))
                .forEach((element) => {
                  this.employeeList.push(element);
                });
              this.listQuery.employeeId = undefined;
              this.employeeName = this.$t("perspective.all");
            }
            this.busy = false;
            this.getData();
          }
        })
        .catch((err) => {
          console.log("err: ", err);
          this.busy = false;
        });
    },
    getEmployeeList(internalOrganizationId) {
      this.busy = true;
      lookupApi
        .getPerspectiveEmployeeList(internalOrganizationId, this.likeManager)
        .then((v) => {
          if (v.data.value !== null) {
            if (v.data.show) {
              const extendArray = (a) =>
                a.map((e) => {
                  const t = {id: e.value, label: e.text};
                  if (e.children && e.children.length > 0) {
                    t.children = extendArray(e.children);
                  } else {
                    delete t.children;
                  }
                  return t;
                });
              var r = [];
              if (v.data.children) {
                r = extendArray(v.data.children);
              }
              if (r.length === 0 && !this.employeeListAll) {
                this.employeeList = [
                  ...[{id: v.data.value, label: v.data.text}],
                ];
                this.listQuery.employeeId = v.data.value;
                this.employeeName = v.data.text;
              } else {
                this.employeeList = [
                  ...[
                    {id: undefined, label: this.$t("perspective.all")},
                    {
                      id: v.data.value,
                      label: v.data.text,
                    },
                  ],
                  ...r,
                ];
                const user = this.employeeList.find(
                  (i) => i.id === this.$store.state.user.sub
                );
                if (user) {
                  this.listQuery.employeeId = user.id;
                  this.employeeName = user.label;
                } else {
                  this.listQuery.employeeId = undefined;
                  this.employeeName = this.$t("perspective.all");
                }
              }
              this.busy = false;
            } else if (!this.employeeListAll) {
              this.employeeList = [
                ...[{id: v.data.value, label: v.data.text}],
              ];
              this.listQuery.employeeId = v.data.value;
              this.employeeName = v.data.text;
            } else {
              this.employeeList = [
                ...[
                  {id: undefined, label: this.$t("perspective.all")},
                  {
                    id: v.data.value,
                    label: v.data.text,
                  },
                ],
              ];
              this.listQuery.employeeId = undefined;
              this.employeeName = this.$t("perspective.all");
            }
            this.getData();
          }
          this.busy = false;
        })
        .catch((err) => {
          console.log("err: ", err);
          this.busy = false;
        });
    },
    employeeSelected(currentData) {
      this.listQuery.employeeId = currentData.id;
      this.employeeName = currentData.label;
      this.listQuery.page = 1;
      this.getData();
    },
  },
};
</script>
<style lang="scss" scoped>
.background:hover {
  background-color: rgb(200, 66, 67) !important;
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

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}

.click {
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1a84ff;
  cursor: pointer;
}

:deep(.el-table__body-wrapper.is-scrolling-none) {
  &::-webkit-scrollbar {
    width: 7px;
    height: 80%;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #c84243;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b30000;
  }
}

.remainAmountFilter {
  :deep(.el-form-item.a),
  :deep(.el-form-item.b) {
    .el-form-item__label {
      line-height: 1.3 !important;
    }
  }
}

.perspective-portfolio-cockpit :deep(.btn-quicknext) {
  display: none;
}

.perspective-portfolio-cockpit :deep(li.number:last-child) {
  display: none;
}

.is-call-center-screen :v-deep(.el-table) {
    border-radius: 0 !important;
}
</style>
