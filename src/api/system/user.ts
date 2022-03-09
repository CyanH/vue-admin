import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

interface addData {

}

interface delData {

}

interface editData {

}

interface userData {

}

interface passData {
  oldPass: string,
  newPass: string
  confirmPass: string
}

interface emailData {
  pass: string,
  email: string,
  code: string
}

export function add(data: addData) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function del(ids: delData) {
  return request({
    url: 'api/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data: editData) {
  return request({
    url: 'api/users',
    method: 'put',
    data
  })
}

export function editUser(data: userData) {
  return request({
    url: 'api/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user: passData) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(form: emailData) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export default { add, edit, del }