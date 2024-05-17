<template>
    <el-collapse v-model="activeNames">
        <el-collapse-item title="查询条件" name="1" style="">
            <el-card class="form" style="">
                <conditionGroup :floor="floor" :conditionList="conditionList" :key-list="keyOptions"
                    :val-list="valueOptions"> </conditionGroup>
                <el-button type="primary" size="default" @click="query">查询</el-button>
            </el-card>
        </el-collapse-item>
    </el-collapse>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" v-if="userStore.buttons.includes('btn.acrtab.exportexcel')"
            @click="exportExcel('销售发票信息.xlsx', '#acrtab-table')">导出EXCEL</el-button>
        <!--筛选Vtable展示列按钮-->
        <el-icon :size="20" style="float: right; font-size: 33px; padding-right:50px" class="grid">
            <el-popover placement="bottom" trigger="hover" width="80">
                <template #reference>
                    <el-button>
                        <Grid />
                    </el-button>
                </template>
                <div id="elcheckbox">
                    <div class="basicEx">
                        <el-checkbox v-model="basicCheckAllEx" :indeterminate="isbasicminateEx"
                            @change="handleBasicAllChangeEx">全选</el-checkbox>
                    </div>
                    <el-checkbox-group v-model="acrtabTableFilter" @change="handleCheckBoxChange" class="checkbox-wrap">
                        <VueDraggableNext v-model="columns" @end="handleCheckBoxChange">
                            <el-checkbox v-for="(col, index) in columns" :key="index" :label="col.label" size="large"
                                style="display: block" />
                        </VueDraggableNext>
                    </el-checkbox-group>
                </div>
            </el-popover>
        </el-icon>
        <!-- table展示数据 -->
        <vtable id="acrtab-table" :tableData="acrtabArr" :height="vtbheight" :columns="columns" :sumArray="getSum"
            :row-class-name="tableRowClassName" :checkVhide=false :butPremission="butPremissionSkm">
        </vtable>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 30, 100, 500, 2000]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getData" @size-change="handler" />
    </el-card>
</template>

<script setup lang="ts">
import vtable from "@/components/Table/index.vue"
import { ref, onMounted, onBeforeMount, watch, reactive } from 'vue';
import { reqAcrtabInfo } from "@/api/acr/acrtb";
import type { Records, AcrtabResponseData } from '@/api/acr/acrtb/type';
import conditionGroup from "@/components/filter/conditionGroup.vue";
import { exportExcel } from "@/utils/exportExcel";
import { VueDraggableNext } from 'vue-draggable-next'
import { ElMessage, dateEquals } from 'element-plus';
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
let userStore = useUserStore();

//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//数据总条数
let total = ref<number>(0);
//存储全部数据的数组
let acrtabArr = ref<Records>([]);
//定义el-chekcbox-group绑定的展示列变量
let acrtabTableFilter = ref<string[]>([])
//页面渲染之前
onBeforeMount(() => {
    //判断本地绑在是否有TABLE的自定义筛选数据，有则启用筛选，无的默认展示所有列信息
    if (localStorage.getItem('acrtabTableFilter')) {
        acrtabTableFilter.value = JSON.parse(localStorage.getItem('acrtabTableFilter') || '');
        handleCheckBoxChange(acrtabTableFilter.value);
    } else {
        acrtabTableFilter.value = columns.value.map(item => item.label);
    }
});
//组件挂载完毕
onMounted(async () => {
    await getData();
});
/*******************************************/
let butPremissionSkm = ref(userStore.buttons.includes('btn.acrtab.confirm'))
//用于控制查询条件显示\折叠的变量
const activeNames = ref('1')
//定义V-TABLE的高度变量
const vtbheight = ref(window.innerHeight - 316)
//默认查询条件的参数
const condition = {
    id: '1',
    index: 1,
    condition: 'equal',
    operate: 'and',
    field: '',
    value: '',
    header: true,
    checked: true,
    pid: -1,
    floor: 1
};


//搜集查询条件数据的集合
const conditionList = [Object.assign({}, condition)];
let floor = 1;
//查询筛选条件的Key
const keyOptions = [
    { 'key': '请购单别', 'val': 'TB001' },
    { 'key': '请购单号', 'val': 'TB002' },
    { 'key': '请购序号', 'val': 'TB003' },
    { 'key': '品号', 'val': 'TB004' },
    { 'key': '品名', 'val': 'PM' },
    { 'key': '规格', 'val': 'GG' },
    { 'key': '请购日期', 'val': 'TA003' },
    { 'key': '审核码', 'val': 'TB025' }
];
//定义筛选值的选项
const valueOptions = {

    TB025: {
        dom: 'select',
        data: [
            { 'key': '已审核', 'val': 'Y' },
            { 'key': '未审核', 'val': 'N' },
            { 'key': '审核失败', 'val': 'U' },
            { 'key': '作废', 'val': 'V' },
        ]
    },
    TA003: {
        dom: 'date'
    }
};
const query = () => { getData() };

/********************************************************************* */
//获取全部已有的用户信息
const getData = async (pager = 1) => {
    //收集当前页码
    pageNo.value = pager;
    let findWhere = { conditions: [{}] }
    findWhere.conditions.splice(0, 1)
    //let data = JSON.stringify(conditionList)
    conditionList.forEach(element => {
        findWhere.conditions.push(element)
    });
    let result: AcrtabResponseData = await reqAcrtabInfo(pageNo.value, pageSize.value, findWhere);
    if (result.code == 200) {
        total.value = result.data.total;
        result.data.records.forEach((item, index) => {
            item.index = index + 1 + (pageNo.value - 1) * pageSize.value;
        });
        acrtabArr.value = result.data.records;
    }
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
    getData();
}
//定义TABLE要展示的数据列
const columns = ref([
    { strlen: 18, label: "销售发票", prop: "XSFP", width: 170, vhide: true, orderby: true, isShow: true, sort: 0 },
    { strlen: 12, label: "来源别", prop: "LYB", width: 75, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "来源单号", prop: "LYDH", width: 120, vhide: true, isShow: true, sort: 0 },
    { strlen: 15, label: "单据日期", prop: "TB008", width: 90, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "备注", prop: "TB011", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "审核码", prop: "TB012", width: 75, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "科目编号", prop: "TB013", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "科目名称", prop: "MA003", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "原币无税金额", prop: "TB017", width: 110, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "原币税额", prop: "TB018", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本币无税金额", prop: "TB019", width: 110, vhide: false, isShow: true, sort: 0 },
    { strlen: 8, label: "本币税额", prop: "TB020", width: 85, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "部门", prop: "TB021", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "结账数量", prop: "TB022", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "结账单价", prop: "TB023", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "折扣率", prop: "TB024", width: 70, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "品号", prop: "TB039", width: 120, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "品名", prop: "PM", width: 140, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "规格", prop: "GG", width: 230, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单位", prop: "TB042", width: 75, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "原币已核销金额", prop: "TB043", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本币已核销金额", prop: "TB044", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "原币已冲减金额", prop: "TB045", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本币已冲减金额", prop: "TB046", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本币差额", prop: "TB047", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "核销状态", prop: "HXZT", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "累计调汇金额", prop: "TB050", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本次开票原币无税金额", prop: "TB051", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本次开票本币无税金额", prop: "TB052", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "审核日期", prop: "TA003", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "客户编号", prop: "TA004", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "客户名称", prop: "MA002", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "客户全称", prop: "TA008", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "币种", prop: "TA009", width: 70, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "汇率", prop: "TA010", width: 70, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "发票种类", prop: "FPZL", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "税种", prop: "SZ", width: 70, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "生成分录-收入", prop: "TA013", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "生成分录-销货成本", prop: "TA014", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "发票号码", prop: "TA015", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "发票日期", prop: "TA016", width: 120, vhide: false, isShow: true, sort: 0 },
    

]);
//定义TABLE需要展示数量合计的数组
const getSum = ["TD039", "TD035","TD035"];
//给TABLE奇偶行添加对应的类名
const tableRowClassName = (row: any, rowIndex: any) => {
    if ((row.rowIndex + 1) % 2 === 0) {
        return "oddRow";
    }
    return "evenRow";
};
//监听查询条件窗体展开或折叠自动调整TABLE高度
watch(activeNames, (newVal, oldVal) => {

    if (activeNames.value == '1') {
        vtbheight.value = window.innerHeight - 316
    } else {
        vtbheight.value = window.innerHeight - 228
    }
})
//通过改变CHECKBOX来动态显示或隐藏TABLE列
const handleCheckBoxChange = (val: string[]) => {
    columns.value.forEach(item => {
        if (val.indexOf(item.label) != -1) {
            item.isShow = true
            item.sort = val.indexOf(item.label) - val.length
        } else {
            item.isShow = false
        }
    })
    columns.value.sort((a, b) => a.sort - b.sort)
    localStorage.setItem('acrtabTableFilter', JSON.stringify(val));
    const checkedCountBasicEx=val.length
    basicCheckAllEx.value=checkedCountBasicEx===columns.value.length
    isbasicminateEx.value=checkedCountBasicEx>0 && checkedCountBasicEx<columns.value.length
}
const basicCheckAllEx=ref(false)
const isbasicminateEx=ref(false)
const handleBasicAllChangeEx=(val:any)=>{
    acrtabTableFilter.value=val?columns.value.map(item => item.label):[];
    isbasicminateEx.value=false;
    handleCheckBoxChange(acrtabTableFilter.value);
}
</script>

<style lang="scss" scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;

    :deep(.el-card__body) {
        display: flex;
        justify-content: space-between;
        align-items: center;

        button {
            margin-left: 25px;

        }
    }
}

:deep(.el-collapse-item__content) {
    padding-bottom: 0px;
}

:deep(.el-table) .oddRow {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
    //    background: #e3f0da !important; 
}

:deep(.el-table .evenRow) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
    //   background-color: #6c8d90;
}

/* 鼠标悬停当前行颜色 有fixed固定列时*/
:deep(.el-table__body) .el-table__row.hover-row td {
     background-color: #c0d8e0 !important; //暗黑模式

}
// 鼠标点击时行的颜色
:deep(.el-table__body tr.current-row) > td {
    background:#5ca4bb !important;
}
:deep(.checkbox-wrap .el-checkbox) {
    height: 30px;
    max-height: 55px;

}

#elcheckbox {
    height: 180px;
    width: 150px;
    overflow-y: scroll;
}

.dialog-footer {
    padding-left: 220px;
}
</style>