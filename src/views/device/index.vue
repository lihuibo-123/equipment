<template>
  <Nspace :size="24" vertical>
    <Nspace vertical>
      <NInput
        placeholder="请输入内容"
        v-model:value="search"
        type="text"
        style="width: 200px"
      />
      <n-button type="primary" style="margin-left: 10px"> 新增 </n-button>
    </Nspace>
    <div style="margin-top: 20px">
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :bordered="false"
      />
    </div>
  </Nspace>
</template>

<script setup lang="ts">
import { ref } from "vue";
const search = ref("");
import { h, defineComponent } from "vue";
import { NButton, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";

interface Device {
  deviceId: number;
  device: string;
}

interface CreateColumnsParams {
  play: (row: Device) => void;
}

const createColumns = ({
  play,
}: CreateColumnsParams): DataTableColumns<Device> => {
  return [
    {
      title: "设备编号",
      key: "deviceId",
    },
    {
      title: "设备名称",
      key: "device",
    },
    {
      title: "操作",
      key: "actions",
      render(row: Device) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => play(row),
          },
          { default: () => "查看" }
        );
      },
    },
  ];
};

const data: Device[] = [{ deviceId: 3, device: "测试设备" }];

const message = useMessage();

const play = (row: Device) => {};

const columns = createColumns({ play });
const pagination = false;
</script>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>
