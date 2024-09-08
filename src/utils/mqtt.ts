import type { MqttClient, OnMessageCallback } from 'mqtt';
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import md5 from 'js-md5';
import { localStg } from '@/utils/storage';
class MQTT {
  url: string; // mqtt地址
  topic: string; //订阅地址
  client!: MqttClient;
  constructor(topic: string) {
    this.topic = '';
    // 虽然是mqtt但是在客户端这里必须采用websock的链接方式
    this.url = '';
  }

  //初始化mqtt
  init() {
    const { hostname, protocol } = location
    let router=md5('/index')
    const ip = hostname === 'localhost'?'43.138.140.98':hostname // 修复代理带端口的问题
    const options = {
      connectTimeout: 5000,      //连接超时时间
      clientId: localStg.get("sessionToken") || '',  //clientId不能重复，这里可以随机生成
      // username: '4d867367b4',         //用户名
      // password: uni.getStorageSync("dgsessionToken") || '',         //密码
      username: localStg.get("userobjectId") || '',
      password: localStg.get("sessionToken") || '',
      router: router,
      isSSL: protocol === 'https:',
      port: protocol == 'http:' ? 8083 : 8084,
      clean: false
    };
    const head = options.isSSL ? 'wss' : 'ws'
    this.url = `${head}://${ip}:${options.port}/mqtt`,


    this.client = mqtt.connect(this.url, options);
    this.client.on('error', (error: any) => {
      console.log(error);
    });
    this.client.on('reconnect', (error: Error) => {
      console.log(error);
    });
  }
  //取消订阅
  unsubscribes() {
    this.client.unsubscribe(this.topic, (error: Error) => {
      if (!error) {
        console.log(this.topic, '取消订阅成功');
      } else {
        console.log(this.topic, '取消订阅失败');
      }
    });
  }
  //连接
  link() {
    this.client.on('connect', () => {
      this.client.subscribe(this.topic, (error: any) => {
        if (!error) {
          console.log('订阅成功');
        } else {
          console.log('订阅失败');
        }
      });
    });
  }
  //收到的消息
  get(callback: OnMessageCallback) {
    this.client.on('message', callback);
  }
  //结束链接
  over() {
    this.client.end();
  }
}
export default MQTT;

