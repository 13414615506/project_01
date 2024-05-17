<template>
  <div :class="{ 'marginClass': onlyOne }" v-if="reDraw">
    <div v-for="(item, index) in conditionList" :style="{ 'flex-direction': 'column' }">
      <div :style="{ 'display': 'flex', 'flex-direction': 'row', 'align-items': 'center' }" >
        <!--elcheckbox-->
        <div :style="{ 'display': 'flex', 'flex-direction': 'row', 'align-items': 'center' }">
          <!-- <i class="el-icon-circle-plus-outline color-success font-title-large" style="cursor: pointer"
            @click="_addItem(item)"></i>
            v-if="!item.groups"
          <i class="el-icon-circle-close color-danger font-title-large" style="cursor: pointer;margin-left: 5px;"
            @click="_delItem(item)"></i> -->
          <el-checkbox style="padding: 0 10px 0 10px" v-model="item.checked"></el-checkbox>
        </div>
        <!--且/或-->
        <div style="position: relative">
          <div v-if="item.header"
            :style="{ 'position': 'absolute', 'top': '-23px', 'left': '0px', 'display': 'flex', 'flex-direction': 'row', 'width': '100%' }">
            <div class="condition-header" style="margin-left: calc(50% - 15px)">且/或</div>
          </div>
          <el-select v-model="item.operate" style="width: 65px;padding: 5px 0 5px 1px" size="small">
            <el-option v-for="ot in [{ 'key': '且', 'val': 'and' }, { 'key': '或', 'val': 'or' }]" :key="ot.val"
              :label="ot.key" :value="ot.val">
            </el-option>
          </el-select>
        </div>
        <!--字段-->
        <div style="position: relative">
          <div v-if="item.header"
            :style="{ 'position': 'absolute', 'top': '-23px', 'left': '0px', 'display': 'flex', 'flex-direction': 'row', 'width': '100%' }">
            <div class="condition-header" style="margin-left: calc(50% - 15px)">字段</div>
          </div>
          <el-select v-model="item.field" style="width: 120px; margin-left: 10px; padding: 5px 0 5px 0px" size="small"
            @change="item.value = '', item.condition = 'equal'">
            <el-option v-for="ot in keyList" :key="ot.val" :label="ot.key" :value="ot.val">
            </el-option>
          </el-select>
        </div>
        <!--运算符-->
        <div style="position: relative">
          <div v-if="item.header"
            :style="{ 'position': 'absolute', 'top': '-23px', 'left': '0px', 'display': 'flex', 'flex-direction': 'row', 'width': '100%' }">
            <div class="condition-header" style="margin-left: calc(50% - 15px)">运算符</div>
          </div>
          <el-select v-model="item.condition" v-if="conditionMap"
            style="width: 80px;margin-left: 10px; padding: 5px 0 5px 0px" size="small">
            <!-- <el-option v-for="ot in conditionMap[item.field]" :key="ot.val" :label="ot.key" :value="ot.val">
            </el-option> -->
          </el-select>
          <el-select v-model="item.condition" v-else style="width: 80px;margin-left: 10px; padding: 5px 0 5px 0px"
            size="small">
            <el-option v-for="ot in conditionSelect" :key="ot.val" :label="ot.key" :value="ot.val">
            </el-option>
          </el-select>
        </div>
        <!--值-->
        <div style="position: relative">
          <div v-if="item.header"
            :style="{ 'position': 'absolute', 'top': '-23px', 'left': '0px', 'display': 'flex', 'flex-direction': 'row', 'width': '100%' }">
            <div class="condition-header" style="margin-left: calc(10% - 15px)">值</div>
          </div>
          <el-select v-model="item.value"
            v-if="valList && valList[item.field.toString()] && valList[item.field.toString()].dom == 'select'"
            style="width: 300px;margin-left: 10px; padding: 5px 0 5px 0px" size="small">
            <el-option v-for="ot in valList[item.field.toString()].data" :key="ot.val" :label="ot.key" :value="ot.val">
            </el-option>
          </el-select>
          <el-date-picker
            v-else-if="valList && valList[item.field.toString()] && valList[item.field.toString()].dom == 'date'"
            size="small" v-model="item.value" type="datetime" placeholder="日期"
            style="width: 300px;height: 35px;margin-left: 10px; cursor: pointer; padding: 5px 0 5px 0px"
            :editable="false" format="YYYY-MM-DD" value-format="YYYYMMDD">
          </el-date-picker>
          <el-input v-else v-model="item.value" style="width: 300px;margin-left: 10px; padding: 5px 0 5px 0px"
            placeholder="值" clearable size="small" />
          <el-button v-if="item.index != 1" type="primary" icon="Delete" size="small"
            style="padding: 5px 0 5px 0px;margin-left:10px; cursor: pointer;width: 50px;"
            @click="_removeChild(index)">删除
          </el-button>
          <el-button v-if="item.index == 1" type="primary" icon="Delete" size="small"
            style="padding: 5px 0 5px 0px;margin-left:10px; cursor: pointer;width: 50px;" @click="_addChild">添加
          </el-button>
        </div>
      </div>
      <!-- <conditionGroup :conditionList="item.groups" v-if="item.groups && item.groups.length > 0" :only-one="false"
        :parentData="parentData" :floor="floor" :borderColor="borderColor" :key-list="keyList" :val-list="valList"
        :condition-map="conditionMap"></conditionGroup> -->
    </div>

  </div>
</template>


<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
const props = defineProps({
  onlyOne: {
    type: Boolean,
    default: () => true
  },
  floor: {
    type: Number,
    default: () => 1
  },
  conditionList: {
    type: Array,
    default: () => []
  },
  keyList: {
    type: Array,
    default: () => []
  },
  conditionMap: {
    type: Object,
    default: () => { }
  },
  valList: {
    type: Object,
    default: () => { }
  },
  parentData: {
    type: Object,
    default: () => { }
  },
  borderColor: {
    type: Array,
    default: () => ['rgba(64, 158, 111, 0.2)']
  }
})

const condition = {
  id: '1',
  index: 1,
  condition: 'equal',
  operate: 'and',
  field: '',
  value: '',
  checked: false,
  header: true,
  pid: -1,
  floor: 1
}
interface conditionType {
  id: String,
  index: Number,
  condition: String,
  operate: String,
  field: String,
  value: String,
  checked: Boolean,
  header: Boolean,
  pid: Number,
  floor: Number
}
type conditionTypes = conditionType[]
interface keyOption {
  key: String,
  val: String
}
type keyOptions = keyOption[]

interface keyVal {
  key: String,
  val: String
}
interface keyfileds {
  dom: String,
  data: keyVal[]
}
interface vallistOpt {
  [key: string]: keyfileds
}




















let conditionList = ref(props.conditionList as conditionTypes)
const gradWidth = 20
const leftWidth = 20
const groupBtnSize = 20
const alpha = 0.2

const initData = [
  Object.assign({}, condition)
]


/************************************************************************************/

// const removeNode = (list, targetList) => {
//   for (var i = 0; i < list.length; i++) {
//     var o = list[i]
//     for (var tid of targetList) {
//       if (o.id == tid) {
//         list.splice(i--, 1)
//       }
//     }
//   }
// }


const _addChild = () => {
  addChild(conditionList.value)
}
const _removeChild = (index: any) => {
  removeChild(conditionList.value, index)
}
const addItem = (groups: any[], index: number, conditionList: any, parentThis: any) => {
  var newItem = Object.assign({}, condition, {
    id: new Date().getTime(),
    index: index + 1,
    floor: groups[0].floor,
    pid: groups[0].pid
  })
  groups.splice(index, 0, newItem)
}
const addChild = (conditionList: any[]) => {
  console.log(conditionList[conditionList.length - 1].index)
  var newItem = Object.assign({}, condition, {
    id: new Date().getTime() + '',// (new Date().tostring()),
    index: conditionList[conditionList.length - 1].index + 1,
    floor: 1,
    pid: -1,
    checked: true
  })
  newItem.header = false
  conditionList.splice(conditionList.length, 0, newItem)
}
const removeChild = (conditionList: any[], index: number) => {
  if (conditionList.length > 1 && index != 0) {
    // console.log(conditionList, index)
    conditionList.splice(index, 1)
  }

}

const reIndex = (list: string | any[], i: number, arr: any[]) => {
  for (var index = 0; index < list.length; index++) {
    var o = list[index]
    if (arr.indexOf(i) == -1) {
      arr.push(i)
    }
    if (o.groups && o.groups.length > 0) {
      o.index = index + 1
      o.floor = i
      if (i == 1) {
        o.pid = -1
      }
      reIndex(o.groups, i + 1, arr)
    } else {
      o.index = index + 1
      o.floor = i
      o.checked = false
      if (i == 1) {
        o.pid = -1
      }
    }
  }
}

const countItem = (list: string | any[], i: number) => {
  var sum = i || 0
  for (var index = 0; index < list.length; index++) {
    var o = list[index]
    if (o.groups && o.groups.length > 0) {
      sum += countItem(o.groups, i)
    } else {
      sum++
    }
  }
  return sum
}
// const uniquePush = (arr, item) => {
//   var exist = false
//   for (var o of arr) {
//     if (o.id == item.id) {
//       exist = true
//     }
//   }
//   if (!exist) {
//     arr.push(item)
//   }
// }

/************************************************************************************* */

let $emit = defineEmits(['input'])
// let plotList = ref([])
// let loading = ref(false)
let reDraw = ref(true)
// let addGroupIndex = ref(0)
let conditionSelect = ref([
  { 'key': '>', 'val': 'greaterthan' },
  { 'key': '=', 'val': 'equal' },
  { 'key': '<', 'val': 'lessthan' },
  { 'key': '>=', 'val': 'greaterthanorequal' },
  { 'key': '<=', 'val': 'lessthanorequal' },
  { 'key': '!=', 'val': 'notequal' },
  { 'key': 'like', 'val': 'like' },
  { 'key': '包含', 'val': 'contain' },
  { 'key': '不包含', 'val': 'notcontain' }
])
let onlyOne = ref<Boolean>(true)
// let floor = ref(props.floor)
let keyList = ref(props.keyList as keyOptions)
let conditionMap = ref(props.conditionMap)
let valList = reactive(props.valList as vallistOpt)

// let borderColor = ref([])

</script>

<style type="text/css">
:root {
  --borderWidth: 1px;
  --borderColor: rgba(158, 158, 158, 1);
}

table {
  border-collapse: collapse;
}

.marginClass {
  margin-bottom: 10px;
}

.condition-header {
  font-weight: 600;
  display: flex;
  flex-direction: row;
}

.group-button {
  margin-left: 47px;
  display: flex;
  flex-direction: row;
  align-items: center
}

.group-left {
  border-left: var(--borderWidth) solid var(--borderColor);
}

.group-top-left {
  border-top: var(--borderWidth) solid var(--borderColor);
  border-left: var(--borderWidth) solid var(--borderColor);
}

.group-bottom-left {
  border-bottom: var(--borderWidth) solid var(--borderColor);
  border-left: var(--borderWidth) solid var(--borderColor);
}
</style>
