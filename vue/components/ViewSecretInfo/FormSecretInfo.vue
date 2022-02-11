<!--
 * @Filename: Do not edit
 * @Autor: huanghua
 * @Date: 2021-06-23 16:04:22
 * @LastEditTime: 2022-02-10 14:09:27
 * @LastEditors: fangqi
 * @Description: 查看脱敏信息
 * @Copyright: Copyright(c) 2019 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <AtgDialog footer width="400px" title="身份确认" :isRequesting="isRequesting" @close="closeWindow" @submit="submit('form')">
    <el-form label-position="right" class="win-form" :model="formModel" :rules="rules" ref="form" @submit.native.prevent>
      <el-form-item prop="password" label="请输入您的密码以确认身份">
        <el-input
          type="password"
          prefix-icon="iconfont iconpwdlogin"
          v-model="formModel.password"
          :maxlength="16"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
    </el-form>
  </AtgDialog>
</template>
<script>
import { getSecretCode } from '@/apis/login'
import Secret from '@/utils/secret'

const trigger = ['change', 'blur']
export default {
  data() {
    return {
      formModel: {
        password: ''
      },
      isRequesting: false
    }
  },
  props: {
    secretInfo: Object,
    apiViewSecretInfo: Function
  },
  created() {
    this.rules = {
      password: [{ message: '请输入密码', required: true, trigger }]
    }
  },
  methods: {
    closeWindow() {
      this.$emit('update:show', false)
    },
    showDecryptInfo(decryptInfo) {
      this.$emit('update:show', false)
      this.$emit('view-secret-info', decryptInfo)
    },
    async submit(formName) {
      try {
        await this.$refs[formName].validate()
        this.isRequesting = true
        const { result } = await getSecretCode()
        const { secretCode, secretKey } = result
        const { result: valid } = await this.apiViewSecretInfo({
          secretKey,
          password: Secret.encrypt(this.formModel.password, secretCode),
          ...this.secretInfo
        })
        if (valid) {
          this.showDecryptInfo(valid)
        }
      } catch (e) {
        console.error(e)
      }
      this.isRequesting = false
    }
  }
}
</script>
<style lang="scss" scoped>
.code-box {
  display: flex;
  align-items: center;
  /deep/.el-input {
    flex: 1;
    height: 38px !important;
  }
  /deep/ .el-input__inner {
    flex: 1;
    height: 38px !important;
  }
  .code {
    flex-shrink: 0;
    width: 90px;
    height: 38px;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
