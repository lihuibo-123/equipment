<script setup lang="ts">
import { $t } from '@/locales';
import { toRaw } from 'vue';
import useMqtt from "@/store/mqtt";
import {localStg} from "@/utils/storage";
import md5 from "js-md5";
// const MQTTStore = useMQTTStore()

const { hostname, protocol } = location
let router=md5('/index')
const head = protocol === 'https:' ? 'wss' : 'ws'
const ip = hostname === 'localhost'?'43.138.140.98' : hostname // 修复代理带端口的问题
const options = {
  clientId: localStg.get("sessionToken") || '',  //clientId不能重复，这里可以随机生成
  username: localStg.get("userobjectId") || '',
  password: localStg.get("sessionToken") || '',
  connectTimeout: 30 * 1000, // ms,
  host: ip,
  // protocol: head,
  // reconnectPeriod: 4000, // ms
  router: router,
  isSSL: protocol === 'https:',
  port: protocol == 'http:' ? 8083 : 8084,
  clean: false,
};
// 使用hoosk函数导出的值
const { data, connection } = useMqtt(options);

console.info('data', data);
console.info('connection', toRaw(connection));

// MQTTStore.connect("MQTT_CLIENTID")

defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}




withDefaults(defineProps<Props>(), {
  showTitle: true
});
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <SystemLogo class="text-32px text-primary" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      {{ $t('system.title') }}
    </h2>
  </RouterLink>
</template>

<style scoped>




</style>
