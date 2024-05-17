<template>
  <div id="ytable" style="width:100%">

    <el-table :id="id" :data="tableData" border :height="height" style="width: 100%" :row-class-name="rowClassName"
      :cell-style="{ 'text-align': 'center' }" :header-cell-style="{ 'text-align': 'center' }" highlight-current-row
      :summary-method="getSummaries" show-summary>
      <el-table-column type="selection" align="center" v-if="checkVhide"></el-table-column>
      <el-table-column label="序号" width="75" prop="index" fixed />
      <template v-for="(column, index) in tableColumns">
        <el-table-column v-if="column.isShow" :prop="column.prop" :label="column.label" :width="column.width"
          :sortable="column.orderby" :filters="column.filter" :show-overflow-tooltip="true">
          <template #default="scope">

            <div>
              {{ scope.row[column.prop.toString()] }}
            </div>
          </template>
          <!-- 自定义views/cop/copth/index中的操作--确认收款按钮 -->
          <template #="{ row, $index }" v-if="column.label == '操作'">
            <el-button type="primary" size="small" v-if="butPremission" @click="alertmes(row)">确认收款</el-button>
          </template>
          <!-- 自定义views/cop/copth/index中品号对应图片 -->
          <template #="{ row, $index }" v-if="column.label == 'picture'">
            <el-popover trigger="hover" width="auto" placement="right" :title="(row.TC012?'PO: '+(row.TC012):row.MB001)+(row.TH019?'---SKU: '+(row.TH019):'')">
              <template #reference>
                <img :src="'http://192.168.8.38:8329/pic/'+row.MB143.toString().substr(3,4)+'000/'+row.MB143.toString()+'.001'"
                  style="max-height: 30PX;max-width: 30PX">
              </template>
              <img :src="'http://192.168.8.38:8329/pic/'+row.MB143.toString().substr(3,4)+'000/'+row.MB143.toString()+'.001'"
              style="max-height: 400px;max-width: 400px"  >
            </el-popover>
          </template>
          <!-- 自定义views/inv/invmb/index中的操作--库存状况 -->
          <template #="{ row, $index }" v-if="column.label == '库存状况'">
            <el-button type="primary" size="small" v-if="butPremission" @click="invmbGetInventory(row)">查询</el-button>
            <el-button type="primary" size="small" v-if="butPremission" @click="invmbGetInventoryBusiness(row)">未来交易</el-button>
          </template>
          <!-- 自定义views/inv/invmb/index中的操作--BOM及工艺 -->
          <template #="{ row, $index }" v-if="column.label == 'BOM-工艺'">
            <el-button type="primary" size="small" v-if="butPremission" @click="invmbGetBomInfo(row)">查询BOM</el-button>
            <el-button type="primary" size="small" v-if="butPremission" @click="invmbGetInventoryBusiness(row)">查询工艺信息</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'

const prop = defineProps({
  id: { type: String },
  tableData: { type: Array },
  height: { type: Number, default: 500 },
  rowClassName: { type: String },
  columns: { type: Array },
  sumArray: { type: Array },
  checkVhide: { type: Boolean },
  butPremission: { type: Boolean }
})
const tableColumns = reactive(prop.columns as columnsTypes)
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: Array<string> = []
  columns.forEach((column: any, index: any) => {
    if (index === 1) {
      sums[index] = '合计'
      return
    }
    const values = data.map((item: { [x: string]: any; }) => Number(item[column.property]))
    if (prop.sumArray?.includes(column.property)) {
      if (!values.every((value: number) => isNaN(value))) {
        sums[index] = values.reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return parseFloat((prev + curr).toFixed(2))
          } else {
            return prev
          }
        }, 0)

      } else {
        sums[index] = ''
      }
    }
  });
  return sums
}
let $emit = defineEmits(['confirmSkm','invmbShowInventory','invmbShowInventoryBusiness','invmbShowBomInfo'])



interface columnsType {
  strlen: Number,
  label: String,
  prop: String,
  width: Number,
  vhide: Boolean,
  orderby: Boolean,
  isShow: Boolean,
  sort: Number,
  filter: String

}

type columnsTypes = columnsType[]

const alertmes = (e: any) => {
  $emit('confirmSkm', e.TH001, e.TH002, e.TH003, e.SKM)
}
//查询库存可用量信息
const invmbGetInventory=(e:any)=>{
  $emit('invmbShowInventory',e.MB001.trim(),getNowTime(false))
}
//查询未来交易量信息
const invmbGetInventoryBusiness=(e:any)=>{
  $emit('invmbShowInventoryBusiness',e.MB001.trim())
}
//查询BomInfo信息
const invmbGetBomInfo=(e:any)=>{
  $emit('invmbShowBomInfo',e.MB001.trim())
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
        nowTime = year + fillZero(month) + fillZero(today)
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

</script>
<style lang="scss">
.el-scrollbar {
  .el-scrollbar__bar.is-horizontal {
    height: 8px;
  }

  .el-scrollbar__bar.is-vertical {
    width: 8px;
  }

  .el-scrollbar__bar.is-horizontal .el-scrollbar__thumb {
    opacity: 1;
    background-color: rgb(120, 123, 235);
    box-shadow: 0 0 6px rgba(230, 6, 6, 0.15);
  }

  .el-scrollbar__bar.is-vertical .el-scrollbar__thumb {
    opacity: 1;
    background-color: rgb(88, 232, 91);
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  }
}
</style>