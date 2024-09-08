<script setup lang="ts">
import {computed, h, onMounted, ref} from "vue";
import {getProducts, postView} from "@/views/view-manage/requestProvider";
import {NText} from "naive-ui";
import emitter from "@/utils/mitt";

const selectLoading = ref(false)
const formItemList = computed(() => {
  return [
    {
      label: '绑定产品',
      key: 'bindProduct',
      rule: {
        required: false,
      },
      options: productSelectorList.value
    },
    {
      label: '名称',
      key: 'title',
      rule: {
        required: true,
        message: '请输入名称',
        trigger: ['input', 'blur'],
      }
    },
    {
      label: '语言',
      key: 'language',
      rule: {
        required: false,
      },
      options: [
        {
          label: '中文',
          value: 'zh'
        },
        {
          label: 'En',
          value: 'En'
        },
      ]
    },
    {
      label: '渲染框架',
      key: 'type',
      rule: {
        required: false,
      },
      options: [
        {
          label: '工业组态',
          value: 'Konva'
        }
      ]
    },
    {
      label: '参考模板',
      key: 'flag',
      rule: {
        required: false,
      },
      options: [
        {
          label: 'Dashboard',
          value: 'Dashboard'
        }
      ]
    }
  ]
})

const productSelectorList = ref([])
const templateData = ref(null)

interface formDataInterface {
  bindProduct: null | string,
  title: null | string,
  language: null | string,
  type: null | string,
  flag: null | string,
}

const formData = ref<formDataInterface>({
  bindProduct: null,
  title: null,
  language: null,
  type: 'Konva',
  flag: 'Dashboard',
})

// 方法
const submitFormData = () => {
  let params = {
    ACL: {'role:开发者': {read: true, write: true}},
    class: '',
    data: templateData.value,
    flag: formData.value.flag,
    key: formData.value.bindProduct,
    language: formData.value.language,
    title: formData.value.title,
    type: formData.value.type
  }

  postView(params).then((res:any) => {
    if(res.error){
      window.$message?.error(res.error)
      return
    }
    window.$message?.success("提交成功")
    emitter.emit("submitSuccess")
  }).catch((err:any)=> {
    window.$message?.error(err)
  })
}

const renderSingleSelectTag = ({option}: any) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    [
      h(NText,
        {depth: 3, tag: 'div'},
        {
          default: () => option.label
        }),
      // h(NText,
      //   {depth: 3, tag: 'div'},
      //   {
      //     default: () => option.value
      //   })
    ]
  )
}
const renderLabel = (option: any) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    [
      h(NText,
        {depth: 3, tag: 'div'},
        {
          default: () => option.label
        }),
      h(NText,
        {
          depth: 3,
          tag: 'div',
          style: {
            position: 'absolute',
            right: '16px'
          }
        },
        {
          default: () => option.value
        })
    ]
  )
}

const getTemplate = async () => {
  const {data, error} = await getDLinkJson(formData.value.type, formData.value.flag)
  if(error){
    window.$message?.error(error)
    return
  }
  console.log(data)
}

onMounted(async () => {
  selectLoading.value = true
  const {data, error} = await getProducts()
  if (error) {
    window.$message?.error(error)
    return
  }
  const results = data.results
  let resList = results.map(item => {
    return {
      label: item.name,
      value: item.objectId
    }
  })

  productSelectorList.value = resList

  selectLoading.value = false

  // await getTemplate()
})
</script>

<template>
  <n-spin :show="selectLoading">
    <n-flex vertical>
      <n-form :model="formData">
        <n-form-item v-for="item in formItemList"
                     :label="item.label+'：'"
                     label-placement="left"
                     :label-width="100"
                     require-mark-placement="left"
                     size="medium"
                     :rule="item.rule"
                     :path="item.key"
        >
          <n-input v-if="item.key === 'title'" v-model:value="formData[item.key]" clearable></n-input>
          <n-select v-else v-model:value="formData[item.key]"
                    :disabled="item.key === 'type' || item.key ==='flag'"
                    :options="item?.options"
                    :render-label="renderLabel"
                    :render-tag="renderSingleSelectTag"
          ></n-select>
        </n-form-item>
      </n-form>
      <n-flex inline justify="end">
        <n-button type="primary" @click="submitFormData">提交</n-button>
      </n-flex>
    </n-flex>
  </n-spin>
</template>

<style scoped>

</style>
