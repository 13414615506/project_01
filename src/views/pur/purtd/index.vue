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
        <el-button type="primary" size="default" v-if="userStore.buttons.includes('btn.purtcd.exportexcel')"
            @click="exportExcel('采购单信息.xlsx', '#purtcd-table')">导出EXCEL</el-button>
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
                    <el-checkbox-group v-model="purtcdTableFilter" @change="handleCheckBoxChange" class="checkbox-wrap">
                        <VueDraggableNext v-model="columns" @end="handleCheckBoxChange">
                            <el-checkbox v-for="(col, index) in columns" :key="index" :label="col.label" size="large"
                                style="display: block" />
                        </VueDraggableNext>
                    </el-checkbox-group>
                </div>
            </el-popover>
        </el-icon>
        <!-- table展示数据 -->
        <vtable id="purtcd-table" :tableData="purtcdArr" :height="vtbheight" :columns="columns" :sumArray="getSum"
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
import { reqPurtcdInfo } from "@/api/pur/purtd";
import type { Records, PurtcdResponseData } from '@/api/pur/purtd/type';
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
let purtcdArr = ref<Records>([]);
//定义el-chekcbox-group绑定的展示列变量
let purtcdTableFilter = ref<string[]>([])
//页面渲染之前
onBeforeMount(() => {
    //判断本地绑在是否有TABLE的自定义筛选数据，有则启用筛选，无的默认展示所有列信息
    if (localStorage.getItem('purtcdTableFilter')) {
        purtcdTableFilter.value = JSON.parse(localStorage.getItem('purtcdTableFilter') || '');
        handleCheckBoxChange(purtcdTableFilter.value);
    } else {
        purtcdTableFilter.value = columns.value.map(item => item.label);
    }
});
//组件挂载完毕
onMounted(async () => {
    await getData();
});
/*******************************************/
let butPremissionSkm = ref(userStore.buttons.includes('btn.copth.confirm'))
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
    { 'key': '采购单别', 'val': 'TD001' },
    { 'key': '采购单号', 'val': 'TD002' },
    { 'key': '采购序号', 'val': 'TD003' },
    { 'key': '品号', 'val': 'TD004' },
    { 'key': '品名', 'val': 'PM' },
    { 'key': '规格', 'val': 'GG' },
    { 'key': '采购日期', 'val': 'TC003' },
    { 'key': '结束码', 'val': 'TD016' },
    { 'key': '审核码', 'val': 'TD018' }
];
//定义筛选值的选项
const valueOptions = {

    TD018: {
        dom: 'select',
        data: [
            { 'key': '已审核', 'val': 'Y' },
            { 'key': '未审核', 'val': 'N' },
            { 'key': '审核失败', 'val': 'U' },
            { 'key': '作废', 'val': 'V' },
        ]
    },
    TD016: {
        dom: 'select',
        data: [
            { 'key': '自动结束', 'val': 'Y' },
            { 'key': '未结束', 'val': 'N' },
            { 'key': '指定结束', 'val': 'y' },
        ]
    },
    TG003: {
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
    let result: PurtcdResponseData = await reqPurtcdInfo(pageNo.value, pageSize.value, findWhere);
    if (result.code == 200) {
        total.value = result.data.total;
        result.data.records.forEach((item, index) => {
            item.index = index + 1 + (pageNo.value - 1) * pageSize.value;
        });
        purtcdArr.value = result.data.records;
    }
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
    getData();
}
//定义TABLE要展示的数据列
const columns = ref([
    { strlen: 18, label: "采购单号", prop: "CGDH", width: 180, vhide: true, orderby: true, isShow: true, sort: 0 },
    { strlen: 12, label: "品号", prop: "TD004", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "品名", prop: "PM", width: 150, vhide: true, isShow: true, sort: 0 },
    { strlen: 15, label: "规格", prop: "GG", width: 230, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "采购数量", prop: "TD008", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单位", prop: "TD009", width: 65, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "采购单价", prop: "TD010", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "采购金额", prop: "TD011", width: 100, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "预交货日", prop: "TD012", width: 100, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "参考单号", prop: "CKDH", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "备注", prop: "TD014", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 8, label: "已交数量", prop: "TD015", width: 85, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "结束码", prop: "TD016", width: 70, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "审核码", prop: "TD018", width: 70, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "来原单号", prop: "TD024", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "请购单号", prop: "QGDH", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "税率", prop: "TD033", width: 65, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "税前金额", prop: "TD034", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "税额", prop: "TD035", width: 65, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "计价单位", prop: "TD038", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "计价数量", prop: "TD039", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "采购日期", prop: "TC003", width: 100, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "供应商编号", prop: "TC004", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "供应商简称", prop: "MA002", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "交易币种", prop: "TC005", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "汇率", prop: "TC006", width: 65, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "价格说明", prop: "TC007", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "付款条件", prop: "TC008", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "备注2", prop: "TC009", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "采购人员编号", prop: "TC011", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "采购人员", prop: "MV002", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "税种", prop: "TC018", width: 65, vhide: false, isShow: true, sort: 0 },

]);
//定义TABLE需要展示数量合计的数组
const getSum = ["TD008", "TD011","TD015","TD034","TD035"];
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
    localStorage.setItem('purtcdTableFilter', JSON.stringify(val));
    const checkedCountBasicEx=val.length
    basicCheckAllEx.value=checkedCountBasicEx===columns.value.length
    isbasicminateEx.value=checkedCountBasicEx>0 && checkedCountBasicEx<columns.value.length
}
const basicCheckAllEx=ref(false)
const isbasicminateEx=ref(false)
const handleBasicAllChangeEx=(val:any)=>{
    purtcdTableFilter.value=val?columns.value.map(item => item.label):[];
    isbasicminateEx.value=false;
    handleCheckBoxChange(purtcdTableFilter.value);
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