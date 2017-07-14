//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


//获取应用实例
var app = getApp()
Page({
    data: {
        reportList:[]
    },
    getReportList: function () {
        var that = this;
        app.request({
            // 要请求的地址
            url: config.service.rootUrl + '/minapp/report/getReportList',
            data: {},
            method: 'POST',
            login: false,
            show: true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                that.setData({
                    reportList:result.data.content.reportList
                });
            }
        });
    },
    onLoad: function () {
        this.getReportList();
    }
})
