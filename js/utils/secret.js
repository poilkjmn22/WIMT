/*
 * @Author: zhangchuanzhong
 * @Date: 2021-04-20 11:29:32
 * @LastEditors: zhangchuanzhong
 * @LastEditTime: 2021-04-20 11:30:12
 * @Description: 加密解密
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import CryptoJS from 'crypto-js'

export default class Secret {
  // 加密
  static encrypt(word, key) {
    const encKey = CryptoJS.enc.Utf8.parse(key)
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, encKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
  }

  // 解密
  static decrypt(word, key) {
    const encKey = CryptoJS.enc.Utf8.parse(key)
    const decrypt = CryptoJS.AES.decrypt(word, encKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  }
}
