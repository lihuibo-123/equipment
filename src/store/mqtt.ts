import * as mqtt from "mqtt/dist/mqtt.min.js";
// import  mqtt from "mqtt/dist/mqtt.min.js";
import { reactive, ref, onMounted, onUnmounted, nextTick } from "vue";
function useMqtt(options: any) {
  const data = ref();
  const connection = reactive({
    // ws or wss
    protocol: options.protocol,
    host: options.host,
    // ws -> 8083; wss -> 8084
    port: options.port,
    clientId: options.clientId,
    username: options.username,
    password: options.password,
    clean: options.clean,
    connectTimeout: options.connectTimeout, // ms
    reconnectPeriod: options.reconnectPeriod // ms
  });
  // //订阅信息设置
  // const subscription = ref({
  //   topic: options.subscription.topic, //需要动态配置
  //   qos: options.subscription.qos as mqtt.QoS
  // });
  let client = ref({
    connected: false
  } as mqtt.MqttClient);
  const receivedMessages = ref("");
  const subscribedSuccess = ref(false);
  const btnLoadingType = ref("");
  const retryTimes = ref(0);
  // const data = ref(); //接收的数据值
  // //初始化
  const initData = () => {
    client.value = {
      connected: false
    } as mqtt.MqttClient;
    retryTimes.value = 0;
    btnLoadingType.value = "";
    subscribedSuccess.value = false;
  };
  const handleOnReConnect = () => {
    retryTimes.value += 1;
    if (retryTimes.value > 5) {
      try {
        client.value.end();
        initData();
        console.log("connection maxReconnectTimes limit, stop retry");
      } catch (error) {
        console.log("handleOnReConnect catch error:", error);
      }
    }
  };
  // // 创建连接
  const createConnection = () => {
    try {
      btnLoadingType.value = "connect";
      const { protocol, host, port, ...options } = connection;
      const connectUrl = `${protocol}://${host}:${port}/mqtt`;
      console.log('connectUrl',connectUrl)
      client.value = mqtt.connect(connectUrl, options);

      if (client.value.on) {
        client.value.on("connect", () => {
          btnLoadingType.value = "";
          console.log("connection successful");
        });
        client.value.on("reconnect", handleOnReConnect);
        client.value.on("error", (error: any) => {
          console.log("connection error:", error);
        });
        client.value.on("message", (topic: string, message: any) => {
          receivedMessages.value = receivedMessages.value.concat(message.toString());
          data.value = JSON.parse(message); //将接收的message JSON对象转成js对象
          console.log("收到的数据--------------", data.value);
        });
      }
    } catch (error) {
      btnLoadingType.value = "";
      console.log("mqtt.connect error:", error);
    }
  };
  //订阅消息
  // const doSubscribe = () => {
  //   btnLoadingType.value = "subscribe";
  //   const { topic, qos } = subscription.value;
  //   client.value.subscribe(topic, { qos }, (error: Error, granted: mqtt.ISubscriptionGrant[]) => {
  //     btnLoadingType.value = "";
  //     if (error) {
  //       console.log("subscribe error:", error);
  //       return;
  //     }
  //     subscribedSuccess.value = true;
  //     console.log("subscribe successfully:", granted);
  //   });
  // };
  //关闭连接
  const destroyConnection = () => {
    if (client.value.connected) {
      btnLoadingType.value = "disconnect";
      try {
        client.value.end(false, () => {
          initData();
          console.log("disconnected successfully");
        });
      } catch (error) {
        btnLoadingType.value = "";
        console.log("disconnect error:", error);
      }
    }
  };
  onMounted(() => {
    nextTick(() => {
      createConnection();
      // doSubscribe();
    });
  });
  // //组件销毁前断开连接
  onUnmounted(() => {
    console.log("页面销毁前断开连接------");
    destroyConnection();
  });
  return { data, connection };
}

export default useMqtt;
