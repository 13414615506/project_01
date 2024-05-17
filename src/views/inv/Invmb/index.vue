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
        <el-button type="primary" size="default">添加品号</el-button>
        <el-button type="primary" size="default" @click="exportExcel('品号信息.xlsx', '#invmb-table')">导出EXCEL</el-button>
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
                    <el-checkbox-group v-model="invmbTableFilter" @change="handleCheckBoxChange" class="checkbox-wrap">
                        <VueDraggableNext v-model="columns" @end="handleCheckBoxChange">
                            <el-checkbox v-for="(col, index) in columns" :key="index" :label="col.label" size="large"
                                style="display: block" />
                        </VueDraggableNext>
                    </el-checkbox-group>
                </div>
            </el-popover>
        </el-icon>
        <!-- table展示用户信息 -->
        <vtable id="invmb-table" :tableData="invmbArr" :height="vtbheight" :columns="columns" :sumArray="getSum"
            :row-class-name="tableRowClassName" :checkVhide=true :butPremission="true"
            @invmbShowInventory="getInventory" @invmbShowInventoryBusiness="getInventoryBusiness" @invmbShowBomInfo="getBomInfo">
        </vtable>
        <!-- <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data="invmbArr">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="品号" align="center" prop="MB001"></el-table-column>
            <el-table-column label="品名" align="center" prop="MB002" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" align="center" prop="MB003" show-overflow-tooltip></el-table-column>
            <el-table-column label="手机" align="center" prop="MB005" show-overflow-tooltip></el-table-column>
            <el-table-column label="Email" align="center" prop="MB011" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="MB014" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="MB017" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="MB018" show-overflow-tooltip></el-table-column>
            <el-table-column label="品号" align="center" prop="MB019"></el-table-column>
            <el-table-column label="品名" align="center" prop="MB021" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" align="center" prop="MB022" show-overflow-tooltip></el-table-column>
            <el-table-column label="手机" align="center" prop="MB025" show-overflow-tooltip></el-table-column>
            <el-table-column label="Email" align="center" prop="MB026" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="MB027" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="MB028" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="MB029" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table> -->
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 30, 100, 500, 2000]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasInvmb" @size-change="handler" />
    </el-card>
    <!-- 查询库存可用量:展示框 -->
    <el-dialog v-model="dialogVisible" style="width:420px;" title="查询库存状况">
        <el-form class="elInventory" :model="InventoryData" ref="form">
            <div class="form-top">
                <div class="form-top--left">
                    <el-form-item label="预计请购" prop="YJQG">
                        <el-input v-model="InventoryData.YJQG" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="预计进货" prop="YJJH">
                        <el-input v-model="InventoryData.YJJH" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="预计生产" prop="YJSC">
                        <el-input v-model="InventoryData.YJSC" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="计划采购" prop="JHCG">
                        <el-input v-model="InventoryData.JHCG" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="计划生产" prop="JHSC">
                        <el-input v-model="InventoryData.JHSC" readonly></el-input>
                    </el-form-item>

                    <el-form-item label="预计可用" prop="YJKY">
                        <el-input v-model="InventoryData.YJKY" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="计划可用" prop="JHKY">
                        <el-input v-model="InventoryData.JHKY" readonly></el-input>
                    </el-form-item>

                    <el-form-item label="库存数量" prop="KCSL">
                        <el-input v-model="InventoryData.KCSL" readonly></el-input>
                    </el-form-item>
                </div>
                <div class="form-top--right">
                    <el-form-item label="预计领用" prop="YJLY">
                        <el-input v-model="InventoryData.YJLY" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="预计销货" prop="YJXH">
                        <el-input v-model="InventoryData.YJXH" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="计划领用" prop="JHLY">
                        <el-input v-model="InventoryData.JHLY" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="计划销货" prop="JHXH">
                        <el-input v-model="InventoryData.JHXH" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="待领用量" prop="DLSL">
                        <el-input v-model="InventoryData.DLSL" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="待销货量" prop="DXSL">
                        <el-input v-model="InventoryData.DXSL" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="待验收量" prop="DYSL">
                        <el-input v-model="InventoryData.DYSL" readonly></el-input>
                    </el-form-item>
                </div>



            </div>

        </el-form>
        <template #footer>
            <el-button type="primary" size="default" @click="dialogVisible = false">关闭</el-button>
        </template>
    </el-dialog>
    <!-- 查询未来交易量:展示框   -->
    <div class="my-dialog">
        <el-dialog v-model="dialogVisibleBusiness" style="width:920px;height: 480px;" title="未来交易量" class="my-dialog">
            <el-table style="margin: 5px 0px;height: 300px;" border :data="InventoryDataBusiness"
                :row-class-name="tableRowClassName" highlight-current-row>
                <!-- <el-table-column type="selection" align="center"></el-table-column> -->
                <el-table-column label="#" align="center" type="index" width="65px" fixed></el-table-column>
                <el-table-column label="日期" align="center" prop="TD012" width="110px"></el-table-column>
                <el-table-column label="异动别" align="center" prop="TYPE" width="70px"></el-table-column>
                <el-table-column label="入库数量" align="center" prop="INFIELD" width="85px"></el-table-column>
                <el-table-column label="出库数量" align="center" prop="OUTFIELD" width="85px"></el-table-column>
                <el-table-column label="仓库" align="center" prop="MC001" width="70px"></el-table-column>
                <el-table-column label="仓库名称" align="center" prop="MC002" width="85px"></el-table-column>
                <el-table-column label="备注" align="center" prop="MEMO" width="320px"></el-table-column>
                <el-table-column label="备注" align="center" prop="MEMO" width="320px"></el-table-column>
            </el-table>
            <template #footer>
                <el-button type="primary" size="default" @click="dialogVisibleBusiness = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
    <!-- 查询BOM信息:展示框 -->
    <div class="my-dialog">
        <el-dialog v-model="dialogVisibleBomInfo" style="width:1080px;height: 520px;" title="展示BOM清单" class="my-dialog">
            <div class="bomshow">主件品号：{{ BomInfo[0]["MC001"] }}<span style="padding-left: 20px;">标准批量：{{ BomInfo[0]["MC004"] }}</span></div>
            <div class="bomshow">品名：{{ BomInfo[0]["CMB002"] }}</div>
            <div class="bomshow">规格：{{ BomInfo[0]["CMB003"] }}</div>
            <el-table style="margin: 5px 0px;height: 300px;" border :data="BomInfo"
                :row-class-name="tableRowClassName" highlight-current-row>
                <!-- <el-table-column type="selection" align="center"></el-table-column> -->
                <el-table-column label="#" align="center" type="index" width="65px" fixed></el-table-column>
                <el-table-column label="序号" align="center" prop="MD002" width="60px"></el-table-column>
                <el-table-column label="元件品号" align="center" prop="MD003" width="150px"></el-table-column>
                <el-table-column label="品名" align="center" prop="DMB002" width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column label="规格" align="center" prop="DMB003" width="240px" show-overflow-tooltip></el-table-column>
                <el-table-column label="组成用量" align="center" prop="MD006" width="85px"></el-table-column>
                <el-table-column label="底数" align="center" prop="MD007" width="70px"></el-table-column>
                <el-table-column label="损耗率" align="center"  width="80px">
                    <template #default="scope">
                        {{ (scope.row.MD008*100).toFixed(2)+"%" }}
                    </template>
                </el-table-column>
                <el-table-column label="品号属性" align="center" prop="DMB025" width="85px"></el-table-column>
            </el-table>
            <template #footer>
                <el-button type="primary" size="default" @click="dialogVisibleBomInfo = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import vtable from "@/components/Table/index.vue"
import { ref, onMounted, onBeforeMount, reactive, watch } from 'vue';
import { reqInvmbInfo, reqInventory, reqInventoryBusiness, reqBomInfo } from "@/api/inv/invmb";
import type { Records, InvmbResponseData, Inventory, InventoryResponseData, InventoryBusinessResponseData, recordsInventoryBusiness,recordsBomInfo, BomInfoResponseData } from '@/api/inv/invmb/type';
import conditionGroup from "@/components/filter/conditionGroup.vue";
import { exportExcel } from "@/utils/exportExcel";
//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(50);
//用户总个数
let total = ref<number>(0);
//存储全部用户的数组
let invmbArr = ref<Records>([]);
//定义el-chekcbox-group绑定的展示列变量
let invmbTableFilter = ref<string[]>([])
//页面渲染之前
onBeforeMount(() => {
    //判断本地绑在是否有TABLE的自定义筛选数据，有则启用筛选，无的默认展示所有列信息
    if (localStorage.getItem('invmbTableFilter')) {
        invmbTableFilter.value = JSON.parse(localStorage.getItem('invmbTableFilter') || '');
        handleCheckBoxChange(invmbTableFilter.value);
    } else {
        invmbTableFilter.value = columns.value.map(item => item.label);
    }
});
//组件挂载完毕
onMounted(async () => {
    await getHasInvmb();
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
    { 'key': '品号', 'val': 'MB001' },
    { 'key': '品名', 'val': 'MB002' },
    { 'key': '规格', 'val': 'MB003' },
    { 'key': '库存数量', 'val': 'MB064' },
    { 'key': '库存金额', 'val': 'MB065' },
    { 'key': '存货管理', 'val': 'MB019' },
    { 'key': '核准状况', 'val': 'MB109' },
    { 'key': '生效日期', 'val': 'MB030' }
];

//定义筛选值的选项
const valueOptions = {
    MB019: {
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
    MB030: {
        dom: 'date'
    }
};
const query = () => {
    //console.log(conditionList)
    getHasInvmb()
};

/********************************************************************* */
//获取全部已有的用户信息
const getHasInvmb = async (pager = 1) => {
    //收集当前页码
    pageNo.value = pager;
    let testt = { conditions: [{}] }
    testt.conditions.splice(0, 1)
    //let data = JSON.stringify(conditionList)
    conditionList.forEach(element => {
        testt.conditions.push(element)
    });
    let result: InvmbResponseData = await reqInvmbInfo(pageNo.value, pageSize.value, testt);
    if (result.code == 200) {
        total.value = result.data.total;
        result.data.records.forEach((item, index) => {
            item.index = index + 1 + (pageNo.value - 1) * pageSize.value;
        });
        invmbArr.value = result.data.records;
    }
}
//获取库存可用量信息
const getInventory = async (strPH: string, strDate: string) => {
    let result: InventoryResponseData = await reqInventory(strPH, strDate);
    if (result.code == 200) {
        InventoryData = result.data;
        dialogVisible.value = true;
    }
}
//获取未来交易量信息
const getInventoryBusiness = async (strPh: string) => {
    let result: InventoryBusinessResponseData = await reqInventoryBusiness(strPh);
    if (result.code == 200) {
        InventoryDataBusiness = result.data;
        dialogVisibleBusiness.value = true;
    }
}
//获取Bom信息
const getBomInfo=async (strPh:string)=>{
    let result:BomInfoResponseData=await reqBomInfo(strPh);
    debugger
    if(result.code==200 && result.data.length>0){
        BomInfo=result.data;
        dialogVisibleBomInfo.value=true;
    }
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
    getHasInvmb();
}

const columns = ref([
    { strlen: 10, label: "品号", prop: "MB001", width: 120, vhide: false, orderby: true, isShow: true, sort: 0 },
    { strlen: 5, label: "品名", prop: "MB002", width: 120, vhide: true, isShow: true, sort: 0 },
    { strlen: 10, label: "规格", prop: "MB003", width: 230, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "品号分类", prop: "MB005", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "主要仓库", prop: "MB017", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "库存单位", prop: "MB004", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "存货管理", prop: "MB019", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "品号属性", prop: "MB025", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "补货政策", prop: "MB034", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "补货周期", prop: "MB035", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 8, label: "固定前置天数", prop: "MB036", width: 110, vhide: true, isShow: true, sort: 0 },
    { strlen: 5, label: "变动前置天数", prop: "MB037", width: 110, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "批量", prop: "MB038", width: 60, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "最低补量", prop: "MB039", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "补货倍量", prop: "MB040", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "领用倍量", prop: "MB041", width: 85, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "领料码", prop: "MB042", width: 65, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单位标准材料成本", prop: "MB037", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单位标准人工成本", prop: "MB058", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单位标准制造费用", prop: "MB059", width: 180, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "单位标准加工费用", prop: "MB060", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本阶人工", prop: "MB061", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本阶制费", prop: "MB062", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "本阶加工", prop: "MB063", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "库存数量", prop: "MB064", width: 120, vhide: false, orderby: true, isShow: true, sort: 0 },
    { strlen: 5, label: "库存金额", prop: "MB065", width: 120, vhide: false, orderby: true, isShow: true, sort: 0 },
    { strlen: 5, label: "更改品名规格", prop: "MB066", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "工作中心", prop: "MB068", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "品号类别", prop: "MB077", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 5, label: "picture", prop: "MB143", width: 120, vhide: false, isShow: true, sort: 0 },
    { strlen: 18, label: "库存状况", prop: "", width: 220, vhide: false, isShow: true, sort: 0 },
    { strlen: 18, label: "BOM-工艺", prop: "", width: 220, vhide: false, isShow: true, sort: 0 },

]);

const getSum = ["MB064", "MB065"];
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
    localStorage.setItem('invmbTableFilter', JSON.stringify(val));
    const checkedCountBasicEx = val.length
    basicCheckAllEx.value = checkedCountBasicEx === columns.value.length
    isbasicminateEx.value = checkedCountBasicEx > 0 && checkedCountBasicEx < columns.value.length
}
const basicCheckAllEx = ref(false)
const isbasicminateEx = ref(false)
const handleBasicAllChangeEx = (val: any) => {
    invmbTableFilter.value = val ? columns.value.map(item => item.label) : [];
    isbasicminateEx.value = false;
    handleCheckBoxChange(invmbTableFilter.value);
}
const dialogVisible = ref(false)
const dialogVisibleBusiness = ref(false)
const dialogVisibleBomInfo=ref(false)
let InventoryData = reactive<Inventory>({
    PH: "123456",
    YJQG: 0,
    YJJH: 0,
    YJSC: 0,
    YJLY: 0,
    YJXH: 0,
    KCSL: 0,
    YJKY: 0,
    JHCG: 0,
    JHSC: 0,
    JHLY: 0,
    JHXH: 0,
    JHKY: 0,
    DYSL: 0,
    DLSL: 0,
    DXSL: 0
});
let InventoryDataBusiness = reactive<recordsInventoryBusiness>([]);
let BomInfo=reactive<recordsBomInfo>([])
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

::-webkit-scrollbar {
    width: 10px;
    height: 18px;
    background-color: #5ca4bb;
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
:deep(.el-table__body tr.current-row)>td {
    background: #5ca4bb !important;
}

:deep(.checkbox-wrap .el-checkbox) {
    height: 30px;
    max-height: 55px;

}

.form-top {
    display: flex;
    justify-content: space-between;

    .form-top--left {
        padding-right: 10px;
    }

    .form-top--right {
        flex: 1;
    }
}

#elcheckbox {
    height: 180px;
    width: 150px;
    overflow-y: scroll;
}

.elInventory .el-input__inner {
    border-radius: 10px;
    /* 圆角边框 */
    border-color: #0972ea;
    /* 边框颜色 */
    padding: 0 2px;
    /* 内边距 */
    font-size: 14px;
    /* 字体大小 */
    height: 10px;
    /* 高度 */
    width: 80px;
}

.elInventory .el-input {
    width: 150px;
}

.elInventory .el-form-item {
    margin-bottom: 5px;
}
.bomshow{
    line-height: 25px;
    font-weight: 700;
    color: #0972ea;
    
}
:deep(.my-dialog .el-dialog__body){
        padding: 10px 15px 15px 15px;
        font-size: 16px;
}
</style>
