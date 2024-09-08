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

const updateIframeSrc =  (url:string) => {
  state.iframeSrc = url;
}

const sendMessageToIframe = (message: object) => {
  // 获取 sessionToken
  console.log('发送中---');
  const sessionToken = localStg.get("sessionToken");
  if (sessionToken) {
    // 将 sessionToken 添加到消息对象中
    message.sessionToken = sessionToken;
  }

  if (iframeRef.value && iframeRef.value !== null) {
    iframeRef.value.contentWindow.postMessage(message, '*');
  }
};


const setupMessageListener = () => {
  window.addEventListener('message', (event) => {
    // 确保消息来源是您信任的源
    if (event.origin !== 'http://localhost:4200') return;
    console.log('Message from iframe:', event.data);
    // 处理消息
  });
};

const appendParamsToUrl = (url:string, params:Record<string, string>) => {
  const queryParams = new URLSearchParams(params);
  return `http://localhost:4200/home?device=pc&${queryParams.toString()}`;
}



const clgsrc = () => {console.log(state.iframeSrc)}
// const handleIframeLoad = () => {
//   resizeIframe();
//   window.addEventListener('resize', resizeIframe);
// };

// const resizeIframe = () => {
//   if (iframeRef.value && containerRef.value) {
//     const containerWidth = containerRef.value.clientWidth;
//     const containerHeight = containerRef.value.clientHeight;

//     iframeRef.value.contentWindow?.postMessage({
//       type: 'resize',
//       width: containerWidth,
//       height: containerHeight
//     }, '*');
//   }
// };


onMounted(() => {
  // resizeIframe();
sendMessageToIframe({name: '111', id: 222})
  setupMessageListener();
});

onBeforeUnmount(() => {
  // window.removeEventListener('resize', resizeIframe);
});
</script>

<style scoped>
.containerRef {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
