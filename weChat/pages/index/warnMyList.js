//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        warnList:[],
    },
    bindSelectUser:function (e) {
        wx.navigator({
            id:e.currentTarget.dataset.id
        });
    },
    bindGoWarnList:function () {
        /*wx.navigateTo({
            url: '../index/msg' + '?' + 'delta=' + 1 + '&msg=' + result.data.msg
        })*/
    },
    getPatrolUserWarnList:function (departmentID) {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/warn/getPatrolUserWarnList',
            data:{
            },
            method: 'POST',
            login: false,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
                that.setData({
                    warnList:result.data.content.warnList
                });
            }
        });
    },
    onLoad: function () {
        this.getPatrolUserWarnList();

    }
})
