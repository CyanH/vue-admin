import request from '@/utils/request'

export interface LoginData {
  username: string;
  password: string;
  code: string,
  uuid: string
}

export function login(data: LoginData) {
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}


export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

export function logOut() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  })
}
