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
        <el-button type="primary" size="default" v-if="userStore.buttons.includes('btn.coptcd.exportexcel')" @click="exportExcel('订单信息.xlsx', '#coptcd-table')">导出EXCEL</el-button>
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
                    <el-checkbox-group v-model="coptcdTableFilter" @change="handleCheckBoxChange" class="checkbox-wrap">
                        <el-checkbox v-for="(col, index) in columns" :label="col.label" size="large"
                            style="display: block" />
                    </el-checkbox-group>
                </div>
            </el-popover>
        </el-icon>
        <!-- table展示用户信息 -->
        <vtable id="coptcd-table" :tableData="coptcdArr" :height="vtbheight" :columns="columns" :sumArray="getSum"
            :row-class-name="tableRowClassName" :checkVhide=false>
        </vtable>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 30, 100, 500, 2000]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasUser" @size-change="handler" />
    </el-card>
</template>

<script setup lang="ts">
import vtable from "@/components/Table/index.vue"
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { reqCoptcdInfo } from "@/api/cop/coptcd";
import type { Records, CoptcdResponseData } from '@/api/cop/coptcd/type';
import conditionGroup from "@/components/filter/conditionGroup.vue";
import { exportExcel } from "@/utils/exportExcel";
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
let coptcdArr = ref<Records>([]);
//定义el-chekcbox-group绑定的展示列变量
let coptcdTableFilter = ref<string[]>([])
//页面渲染之前
onBeforeMount(() => {
    //判断本地绑在是否有TABLE的自定义筛选数据，有则启用筛选，无的默认展示所有列信息
    if (localStorage.getItem('coptcdTableFilter')) {
        coptcdTableFilter.value = JSON.parse(localStorage.getItem('coptcdTableFilter') || '');
        handleCheckBoxChange(coptcdTableFilter.value);
    } else {
        coptcdTableFilter.value = columns.value.map(item => item.label);
    }
});
//组件挂载完毕
onMounted(async () => {
    await getHasUser();
});
/*******************************************/
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
    { 'key': '订单单别', 'val': 'TD001' },
    { 'key': '订单单号', 'val': 'TD002' },
    { 'key': '订单序号', 'val': 'TD003' },
    { 'key': '品号', 'val': 'PH' },
    { 'key': '品名', 'val': 'PM' },
    { 'key': '规格', 'val': 'GG' },
    { 'key': '审核码', 'val': 'TD021' },
    { 'key': '结束码', 'val': 'TD016' },
    { 'key': '客户单号', 'val': 'TC012' },
    { 'key': '客户品号', 'val': 'TD014' },
    { 'key': '预交货日', 'val': 'TD013' }
];
//定义筛选值的选项
const valueOptions = {
    TD016: {
        dom: 'select',
        data: [
            { 'key': '已结束', 'val': 'Y' },
            { 'key': '未结束', 'val': 'N' },
            { 'key': '指定结束', 'val': 'y' },
        ]
    },
    TD021: {
        dom: 'select',
        data: [
            { 'key': '已审核', 'val': 'Y' },
            { 'key': '未审核', 'val': 'N' },
            { 'key': '作废', 'val': 'V' },
        ]
    },
    TD013: {
        dom: 'date'
    }
};
const query = () => { getHasUser() };

/********************************************************************* */
//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
    //收集当前页码
    pageNo.value = pager;
    let findWhere = { conditions: [{}] }
    findWhere.conditions.splice(0, 1)
    //let data = JSON.stringify(conditionList)
    conditionList.forEach(element => {
        findWhere.conditions.push(element)
    });
    let result: CoptcdResponseData = await reqCoptcdInfo(pageNo.value, pageSize.value, findWhere);
    if (result.code == 200) {
        total.value = result.data.total;
        result.data.records.forEach((item, index) => {
            item.index = index + 1 + (pageNo.value - 1) * pageSize.value;
        });
        coptcdArr.value = result.data.records;
    }
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
    getHasUser();
}

const columns = ref([
    { strlen: 14, label: "订单号", prop: "DDDH", width: 165, vhide: true, orderby: true, isShow: true ,sort:0},
    { strlen: 12, label: "品号", prop: "PH", width: 120, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "品名", prop: "PM", width: 150, vhide: true, isShow: true ,sort:0},
    { strlen: 15, label: "规格", prop: "GG", width: 230, vhide: true, isShow: true ,sort:0},
    { strlen: 5, label: "订单日期", prop: "TC003", width: 95, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "客户编号", prop: "TC004", width: 85, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "客户单号", prop: "TC012", width: 85, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "订单数量", prop: "TD008", width: 85, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "已交数量", prop: "TD009", width: 85, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "赠品量", prop: "TD024", width: 70, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "赠品已交量", prop: "TD025", width: 95, vhide: false, isShow: true ,sort:0},
    { strlen: 8, label: "单位", prop: "TD010", width: 60, vhide: true, isShow: true ,sort:0},
    { strlen: 5, label: "单价", prop: "TD011", width: 85, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "金额", prop: "TD012", width: 95, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "预交货日", prop: "TD013", width: 95, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "客户品号", prop: "TD014",width: 85, vhide: true, isShow: true ,sort:0},
    { strlen: 5, label: "结束码", prop: "TD016", width: 75, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "税前金额", prop: "TD038", width: 95, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "人工单价", prop: "RGDJ", width: 85, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "主材料单价", prop: "ZCLDJ", width: 95, vhide: false, isShow: true ,sort:0},
    { strlen: 5, label: "包材单价", prop: "BCDJ", width: 85, vhide: false, isShow: true ,sort:0},
    
]);

const getSum = ["TD008", "TD009","TD012"];
const tableRowClassName = (row: any, rowIndex: any) => {
    if ((row.rowIndex + 1) % 2 === 0) {
        return "oddRow";
    }
    return "evenRow";
};
watch(activeNames, (newVal, oldVal) => {
    if (activeNames.value == '1') {
        vtbheight.value = window.innerHeight - 316
    } else {
        vtbheight.value = window.innerHeight - 228
    }
})
const handleCheckBoxChange = (val: string[]) => {
    columns.value.forEach(item => {
        if (val.includes(item.label)) {
            item.isShow = true
            item.sort = val.indexOf(item.label) - val.length
        } else {
            item.isShow = false
        }
    })
    columns.value.sort((a, b) => a.sort - b.sort)
    localStorage.setItem('coptcdTableFilter', JSON.stringify(val));
    const checkedCountBasicEx=val.length
    basicCheckAllEx.value=checkedCountBasicEx===columns.value.length
    isbasicminateEx.value=checkedCountBasicEx>0 && checkedCountBasicEx<columns.value.length
}
const basicCheckAllEx=ref(false)
const isbasicminateEx=ref(false)
const handleBasicAllChangeEx=(val:any)=>{
    coptcdTableFilter.value=val?columns.value.map(item => item.label):[];
    isbasicminateEx.value=false;
    handleCheckBoxChange(coptcdTableFilter.value);
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
</style>