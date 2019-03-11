import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


import axios from 'axios'

const store = new Vuex.Store({
    // 全局变量
    state: {
        shouldUpdateActivityList: true,
        activityList: [],
        activityClassList: []
    },
    // 修改全局变量必须通过mutations中的方法
    // mutations只能采用同步方法
    mutations: {
        shouldUpdateActivityList(state, payload) {
            state.shouldUpdateActivityList = payload
        },
        setActivityList(state, payload) {
            state.activityList = payload
        },
        setActivityClassList(state, payload) {
            state.activityClassList = payload
        }
    },
    // 异步方法用actions
    // actions不能直接修改全局变量，需要调用commit方法来触发mutation中的方法
    actions: {
        getRDActivityList(context, vmWIMTList) {
            return new Promise((resolve, reject) => {
                axios.request({
                        method: 'get',
                        url: '/getActivityList'
                    })
                    .then(res => {
                        context.commit('setActivityList', res.data)
                        resolve(res.data)
                    })
                    .catch(e => {
                        reject(e)
                    })
            })
        },
        getRDActivityClassList(context, vmWIMTList) {
            return new Promise((resolve, reject) => {
              if(context.state.activityClassList.length > 0){
                resolve(context.state.activityClassList)
              }else{
                axios.request({
                        method: 'get',
                        url: '/getActivityClassList'
                    })
                    .then(res => {
                        context.commit('setActivityClassList', res.data.results)
                        resolve(res.data.results)
                    })
                    .catch(e => {
                        reject(e)
                    })
              }
            })
        },
        getRDActivityRound({}, {ActivityRoundDate}){
          return new Promise((resolve, reject) => {
            axios.request({
              url: '/getActivityRound',
              method: 'get',
              params: {
                ActivityRoundDate
              }
            })
              .then(res => {
                if(res.data.code === 0){
                  resolve(res.data.results)
                }else{
                  reject(res.data)
                }
              })
              .catch(e => {
                reject(e)
              })
          })
        }
    }
})

export default store
