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
        <el-button type="primary" size="default" v-if="userStore.buttons.includes('btn.copth.exportexcel')"
            @click="exportExcel('销货信息.xlsx', '#coptgh-table')">导出EXCEL</el-button>
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
                    <el-checkbox-group v-model="coptghTableFilter" @change="handleCheckBoxChange" class="checkbox-wrap">
                        <VueDraggableNext v-model="columns" @end="handleCheckBoxChange">
                            <el-checkbox v-for="(col, index) in columns" :key="index" :label="col.label" size="large"
                                style="display: block" />
                        </VueDraggableNext>
                    </el-checkbox-group>
                </div>
            </el-popover>
        </el-icon>
        <!-- table展示数据 -->
        <vtable id="coptgh-table" :tableData="coptghArr" :height="vtbheight" :columns="columns" :sumArray="getSum"
            :row-class-name="tableRowClassName" :checkVhide=false :butPremission="butPremissionSkm"
            @confirmSkm="confirmAction">
        </vtable>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 30, 100, 500, 2000]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getData" @size-change="handler" />
    </el-card>
    <el-dialog title="确认收款" v-model="dialogVisible" width="30%" :before-close="handleClose">
        <span>确认要执行此操作吗？</span><br />
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAction">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script setup lang="ts">
import vtable from "@/components/Table/index.vue"
import { ref, onMounted, onBeforeMount, watch, reactive } from 'vue';
import { reqCoptghInfo, reqSetSkm } from "@/api/cop/coptgh";
import type { Records, CoptghResponseData, reqsetskm } from '@/api/cop/coptgh/type';
import conditionGroup from "@/components/filter/conditionGroup.vue";
import { exportExcel } from "@/utils/exportExcel";
import { VueDraggableNext } from 'vue-draggable-next'
import { ElMessage, dateEquals } from 'element-plus';
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
let userStore = useUserStore();
//定义控制确认收款弹窗的变量
let dialogVisible = ref(false)
//确认收款时执行代码
const doAction = async () => {
    //更新收款码
    let result: any = await reqSetSkm(skmdata);
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '确认收款成功' });
        //关闭弹窗
        dialogVisible.value = false
        //获取更新收款码后的信息,更新完毕留在当前页
        getData(pageNo.value);
    }
}
//控制收款码弹窗的关闭按钮
const handleClose = () => {
    dialogVisible.value=false
}
//存储收款码相关类型的数据
let skmdata = reactive<reqsetskm>({});
//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//数据总条数
let total = ref<number>(0);
//存储全部数据的数组
let coptghArr = ref<Records>([]);
//定义el-chekcbox-group绑定的展示列变量
let coptghTableFilter = ref<string[]>([])
//页面渲染之前
onBeforeMount(() => {
    //判断本地绑在是否有TABLE的自定义筛选数据，有则启用筛选，无的默认展示所有列信息
    if (localStorage.getItem('coptghTableFilter')) {
        coptghTableFilter.value = JSON.parse(localStorage.getItem('coptghTableFilter') || '');
        handleCheckBoxChange(coptghTableFilter.value);
    } else {
        coptghTableFilter.value = columns.value.map(item => item.label);
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
//点击确认收款的弹窗
const confirmAction = (XHDB: string, XHDH: string, XH: string, SKM: string) => {
    if (SKM == 'Y') {
        ElMessage({ type: 'warning', message: '已收款无法再次确认收款' });
    } else {
        skmdata.xhdb = XHDB
        skmdata.xhdh = XHDH
        skmdata.xhxh = XH
        skmdata.skm = 'Y'
        skmdata.userid = userStore.username
        skmdata.confirmdate = getNowTime(true)
        dialogVisible.value = true
    }
}
//将时间戳转换为日期格式的方法
let getNowTime = (isAll: boolean) => {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let today = now.getDate()
    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()
    let nowTime = ''
    if (isAll) {
        nowTime = year + '-' + fillZero(month) + '-' + fillZero(today) + ' ' + fillZero(hour) + ':' + fillZero(minute) + ':' + fillZero(second)
    } else {
        nowTime = year + '-' + fillZero(month) + '-' + fillZero(today)
    }
    return nowTime
}
//统一日期格式的方法
let fillZero = (str: any) => {
    let realNum
    if (str < 10) {
        realNum = '0' + str
    } else {
        realNum = str
    }
    return realNum
}

//搜集查询条件数据的集合
const conditionList = [Object.assign({}, condition)];
let floor = 1;
//查询筛选条件的Key
const keyOptions = [
    { 'key': '销货单别', 'val': 'TH001' },
    { 'key': '销货单号', 'val': 'TH002' },
    { 'key': '销货序号', 'val': 'TH003' },
    { 'key': '品号', 'val': 'TH004' },
    { 'key': '品名', 'val': 'TH005' },
    { 'key': '规格', 'val': 'TH006' },
    { 'key': '客户品号', 'val': 'TH019' },
    { 'key': '客户单号', 'val': 'TC012' },
    { 'key': '预交日期', 'val': 'TD013' },
    { 'key': '销货日期', 'val': 'TG003' },
    { 'key': '收款码', 'val': 'SKM' }
];
//定义筛选值的选项
const valueOptions = {
    SKM: {
        dom: 'select',
        data: [
            { 'key': '是', 'val': 'Y' },
            { 'key': '否', 'val': 'N' },
        ]
    },
    MB109: {
        dom: 'select',
        data: [
            { 'key': '已核准', 'val': 'Y' },
            { 'key': '尚待核准', 'val': 'y' },
            { 'key': '不准交易', 'val': 'N' },
        ]
    },
    TG003: {
        dom: 'date'
    },
    TD013: {
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
    let result: CoptghResponseData = await reqCoptghInfo(pageNo.value, pageSize.value, findWhere);
    if (result.code == 200) {
        total.value = result.data.total;
        result.data.records.forEach((item, index) => {
            item.index = index + 1 + (pageNo.value - 1) * pageSize.value;
        });
        coptghArr.value = result.data.records;
    }
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
    getData();
}
//定义TABLE要展示的数据列
const columns = ref([
    { strlen: 18, label: "销货单号", prop: "XHDH", width: 170, vhide: true, orderby: true, isShow: true, sort: 0 },
    { strlen: 12, label: "品号", prop: "TH004", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "品名", prop: "TH005", width: 140, vhide: true, isShow: true, sort: 0 },
    { strlen: 15, label: "规格", prop: "TH006", width: 230, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "销货日期", prop: "TG003", width: 95, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "客户编号", prop: "TG004", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "客户简称", prop: "MA002", width: 100, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "销货数量", prop: "TH008", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单位", prop: "TH009", width: 60, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单价", prop: "TH012", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "金额", prop: "TH013", width: 100, vhide: false, isShow: true, sort: 0 },
    { strlen: 8, label: "订单号", prop: "DDDH", width: 180, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "订单数量", prop: "TD008", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "已交数量", prop: "TD009", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "预交货日", prop: "TD013", width: 95, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "结束码", prop: "TD016", width: 75, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "客户品号", prop: "TH019", width: 85, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "客户单号", prop: "TC012", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "人工单价", prop: "RGDJ", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "人工成本", prop: "RGCB", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "主材料单价", prop: "ZCLDJ", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "主材料成本", prop: "ZCLCB", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "包材单价", prop: "BCDJ", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "包材成本", prop: "BCCB", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "销售发票", prop: "XSFP", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "已开票数量", prop: "TH042", width: 95, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "核销金额", prop: "TB044", width: 100, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "收款码", prop: "SKM", width: 75, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "确认收款人员", prop: "confirmAuthor", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "确认收款时间", prop: "confirmDate", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "操作", prop: "TB044", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "picture", prop: "MB143", width: 120, vhide: false, isShow: true, sort: 0 },
]);
//定义TABLE需要展示数量合计的数组
const getSum = ["TH013", "TH008","TD008","TD009"];
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
    localStorage.setItem('coptghTableFilter', JSON.stringify(val));
    const checkedCountBasicEx=val.length
    basicCheckAllEx.value=checkedCountBasicEx===columns.value.length
    isbasicminateEx.value=checkedCountBasicEx>0 && checkedCountBasicEx<columns.value.length
}
const basicCheckAllEx=ref(false)
const isbasicminateEx=ref(false)
const handleBasicAllChangeEx=(val:any)=>{
    coptghTableFilter.value=val?columns.value.map(item => item.label):[];
    isbasicminateEx.value=false;
    handleCheckBoxChange(coptghTableFilter.value);
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
    --el-table-tr-bg-color:var(--el-color-warning-light-9);
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