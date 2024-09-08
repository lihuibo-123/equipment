<template>
  <div ref="containerRef">
    <div class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-64" @click="updateIframeSrc(appendParamsToUrl(state.iframeSrc, {id: '123'}))">修改</div>
        <div class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-64"  @click="clgsrc">打印数据</div>
        <div class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-64"  @click="sendMessageToIframe({name: '111', id: 222})">发送数据</div>
    <iframe
      ref="iframeRef"
      :src="state.iframeSrc"
      @load="handleIframeLoad"
      style="width: 100%; height: 100%; border: none;"
    ></iframe>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { localStg } from '@/utils/storage';

const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));
const state = reactive({
  iframeSrc: 'http://localhost:4200/home?device=pc'
})
const containerRef = ref<HTMLDivElement | null>(null);
const iframeRef = ref<HTMLIFrameElement | null>(null);

const updateIframeSrc = (url:string) => {
  state.iframeSrc = url;
}

const sendMessageToIframe = (message: object) => {
  console.log('发送中---');
  const sessionToken = localStg.get("sessionToken");
  if (sessionToken) {
    message.sessionToken = sessionToken;
  }

  if (iframeRef.value && iframeRef.value !== null) {
    iframeRef.value.contentWindow.postMessage(message, '*');
  }
};

const setupMessageListener = () => {
  window.addEventListener('message', (event) => {
    if (event.origin !== 'http://localhost:4200') return;
    console.log('Message from iframe:', event.data);
    // 处理消息
  });
};

const appendParamsToUrl = (url:string, params:Record<string, string>) => {
  const queryParams = new URLSearchParams(params);
  return `${url}&${queryParams.toString()}`;
}

const clgsrc = () => { console.log(state.iframeSrc) }

let intervalId: ReturnType<typeof setInterval> | null = null;

const sendRandomMessage = () => {
  const randomMessage = { randomValue: Math.random() };
  sendMessageToIframe(randomMessage);
};

onMounted(() => {
  sendMessageToIframe({name: '111', id: 222});
  setupMessageListener();
  intervalId = setInterval(sendRandomMessage, 1000); // 每秒发送一次
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId); // 清除定时器
  }
});
</script>

<style scoped>
.containerRef {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
