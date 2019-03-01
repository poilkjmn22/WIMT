import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import chartHelper from '../helper/chartHelper'

import axios from 'axios'
import DateTime from 'luxon/src/datetime'
const AJAX_STATE = require('../../json/ajax-state')

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
                axios.request({
                        method: 'get',
                        url: '/getActivityClassList'
                    })
                    .then(res => {
                        context.commit('setActivityClassList', res.data.results)
                        resolve(res.data)
                    })
                    .catch(e => {
                        reject(e)
                    })
            })
        },
        async getRDAllActivityListAndActivityClassList({
            dispatch,
            state,
            commit
        }, vmWIMTList) {
            vmWIMTList.getRemoteDataAjaxState = AJAX_STATE.PENDDING
            await dispatch('getRDActivityList', vmWIMTList)
            await dispatch('getRDActivityClassList', vmWIMTList)
            vmWIMTList.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
            let {
                activityList,
                activityClassList
            } = state
            chartHelper.drawChart('highcharts', vmWIMTList.$refs.WIMTChartBox, {
                activityList,
                activityClassList
            })
            commit('shouldUpdateActivityList', false)
        },
        deleteActivity({
            dispatch
        }, {
            row,
            vmWIMTList
        }) {
            return new Promise((resolve, reject) => {
                axios.request({
                        method: 'delete',
                        url: '/deleteActivity',
                        data: {
                            ActivityRoundDate: DateTime.fromISO(row.ActivityRoundDate).toFormat('yyyy-MM-dd')
                        }
                    })
                    .then(res => {
                        if (res.data.code === 0) {
                            dispatch('getRDAllActivityListAndActivityClassList', vmWIMTList)
                            resolve(res.data)
                        } else {
                            reject(res.data)
                        }
                    })
                    .catch(e => {
                        reject({
                            code: -1,
                            message: '未知错误！'
                        })
                    })
            })
        }
    }
})

export default store
