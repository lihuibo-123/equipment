import {request} from "@/service/request";

export function getProducts() {
  return new Promise((resolve, reject) => {
    request({
      url: 'iotapi/classes/Product',
      method: 'get',
    }).then(res=>{
      resolve(res)
    }).catch(err=> {
      reject(err)
    })
  })
}

export function getDLinkJson(type: string,subType: string) {
  return new Promise((resolve, reject) => {
    request({
      url: `iotapi/dlinkjson?type=${type}&subType=${subType}`,
      method: 'get',
    }).then(res=>{
      resolve(res)
    }).catch(err=> {
      reject(err)
    })
  })
}

export function postView(data:any) {
  return new Promise((resolve, reject) => {
    request({
      url: `iotapi/classes/View`,
      method: 'post',
      data: data
    }).then(res=>{
      resolve(res)
    }).catch(err=> {
      reject(err)
    })
  })
}

export function deleteColFromViewByObjectId(objectId:string) {
  return new Promise((resolve, reject) => {
    request({
      url: `iotapi/classes/View/${objectId}`,
      method: 'delete',
    }).then(res=>{
      resolve(res)
    }).catch(err=> {
      reject(err)
    })
  })
}
