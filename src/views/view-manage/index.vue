<script setup lang="ts">
import {h, onBeforeMount, onMounted, reactive, ref} from "vue";
import {request} from "@/service/request";
import {NButton} from "naive-ui";
import AddNewView from "@/views/view-manage/modules/addNewView.vue";
import { useMessage } from 'naive-ui'
import emitter from "@/utils/mitt";
import {deleteColFromViewByObjectId, postView} from "@/views/view-manage/requestProvider";

window.$message = useMessage()
// 变量定义
const showAddViewModal = ref(false)
const search = ref("")
const tableLoading = ref<boolean>(false)
const tableColumns = ref([
  {
    title: "序号",
    key: 'no',
    render: (rowData: object, rowIndex: number) => {
      return rowIndex + 1
    },
  },
  {
    title: '视图ID',
    key: 'objectId',
    // sorter: (row1:any, row2:any) =>{
    //   console.log(`row1: ${row1.objectId}, row2, ${row2.objectId},compare: ${row1.objectId > row2.objectId}`)
    //   return row1.objectId > row2.objectId
    // }
  },
  {
    title: '名称',
    key: 'title',
    // sorter: (row1:any, row2:any) =>{
    //   return row1.title > row2.title
    // }
  },
  {
    title: '表名',
    key: 'class',
    // sorter: (row1:any, row2:any) =>{
    //   return row1.class > row2.class
    // }
  },
  {
    title: '表名ID',
    key: 'key',
    // sorter: (row1:any, row2:any) =>{
    //   return row1.key > row2.key
    // }
  },
  {
    title: '创建时间',
    key: 'createdAt',
    render: (rowData: object, rowIndex: number) => {
      let dateTime = new Date(rowData.createdAt);
      let options = { year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Shanghai' };
      return new Intl.DateTimeFormat('zh-CN', options).format(dateTime)
    },
    // sorter: (row1:any, row2:any) =>{
    //   return row1.createdAt > row2.createdAt
    // }
  },
  {
    title: '操作',
    key: 'operation',
    render: (row:any) => {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'info',
            style: {marginLeft: '10px'},
            onClick: () => editTableItemHandler(row.objectId)
          },
          {default: () => '编辑'}
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'error',
            style: {marginLeft: '10px'},
            onClick: () => removeTableItemHandler(row.objectId)
          },
          {default: () => '删除'}
        )
      ]
    }
  }
])

const tableData = ref<any>([])

const pagination = reactive({
    page:1,
    pageSize: 10,
    showSizePicker: true,
    showQuickJumper: true,
    style: {textAlign: 'center'},
    pageSizes: [5, 10, 20, 50, 100, 200, 500],
    onChange: (page: number) => {
      pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
    }
  }
)

// 方法定义
// 添加新视图
const addViewHandler = () => {
  // todo 添加视图弹窗前的处理

  showAddViewModal.value = true
}

const searchViewHandler = async () => {
  tableData.value = []
  if (search.value === "") {
    await refreshTableData()
    return
  }
  await refreshTableData(search.value)
}

// 编辑表格视图项
const editTableItemHandler = (viewId?: any) => {
  console.log('viewId', viewId)
}

// 删除表格视图项
const removeTableItemHandler = (viewId?: any) => {
  deleteColFromViewByObjectId(viewId).then((res:any) => {
    if(res.error){
      window.$message?.error(res.error)
      return
    }
    window.$message?.success("删除成功")
    refreshTableData(search.value)
  }).catch((err:any)=> {
    window.$message?.error(err)
  })
}

const submitSuccess = ()=> {
  showAddViewModal.value = false
  refreshTableData()
}

const handleSorterChange = (sorter:any) => {
  console.log(sorter)
}

const refreshTableData = async (name?: any) => {
  tableLoading.value = true
  let params = {
    count: 'objectId',
    order: '-updatedAt',
    excludeKeys: 'data',
    limit: 10,
    skip: 0,
    where: `{}`
  };
  if (name) {
    params.where = `{"title" : {"$regex": "${name}"}}`
  }
  const {data} = await request({
    url: '/iotapi/classes/View',
    method: 'get',
    params: params,
  })
  let {count, results} = data
  tableData.value = results
  tableLoading.value = false
}

onMounted(() => {
  refreshTableData()
  emitter.on("submitSuccess", ()=>{
    submitSuccess()
  })
})

onBeforeMount(() => {
  emitter.off("submitSuccess")
})
</script>

<template>
  <n-space vertical>
    <n-space inline align="center">
      名称
      <n-input v-model:value="search" type="text" size="small" placeholder="输入视图名称"/>
      <n-button size="small" type="info" @click="addViewHandler">
        <template #icon>
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <path d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" fill="currentColor"></path>
            </svg>
          </n-icon>
        </template>
      </n-button>
      <n-button size="small" type="success" @click="searchViewHandler">
        <template #icon>
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
              <path
                d="M29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29zM4 13a9 9 0 1 1 9 9a9.01 9.01 0 0 1-9-9z"
                fill="currentColor"></path>
            </svg>
          </n-icon>
        </template>
      </n-button>
    </n-space>
    <n-data-table
      :loading="tableLoading"
      :columns="tableColumns"
      :data="tableData"
      :pagination="pagination"
    />

    <n-modal
      v-model:show="showAddViewModal"
      preset="card"
      style="width: 800px"
    >
      <AddNewView></AddNewView>
    </n-modal>
  </n-space>
</template>

<style scoped></style>
