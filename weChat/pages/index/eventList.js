//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        workList:[],
        type:1,
        roleID:0,
        nolistMessage:'加载中...'
    },

    /** 巡检人 **/
    bindGetUndealTemporaryWorkList:function () {
        this.setData({
            type:1
        })
        this.getWarnList('getUndealTemporaryWorkList')
    },
    bindGetTemporaryWorkList:function () {
        this.setData({
            type:2
        })
        this.getWarnList('getTemporaryWorkList')
    },


    /** 巡检负责人 **/
    bindGetUndealTemporaryWorkList1:function () {
        this.setData({
            type:1
        })
        this.getWarnList('getUndealTemporaryWorkList')
    },
    bindGetTemporaryWorkList1:function () {
        this.setData({
            type:2
        })
        this.getWarnList('getTemporaryWorkList')
    },


    /** 总负责人 **/
    bindGetUndealTemporaryWorkList2:function () {
        this.setData({
            type:1
        })
        this.getWarnList('getUndealTemporaryWorkList')
    },
    bindGetTemporaryWorkList2:function () {
        this.setData({
            type:2
        })
        this.getWarnList('getTemporaryWorkList')
    },
    getWarnList:function (action) {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/work/' + action,
            data:{},
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    if(result.data.code == -2) {
                        that.setData({
                            workList: [],
                            nolistMessage:result.data.msg
                        });
                    }
                    return;
                }
                that.setData({
                    workList:result.data.content.workList
                });
            }
        });
    },
    bindGoDetail:function (e) {
        wx.navigateTo({
            url: '../index/eventPublish?id=' + e.currentTarget.dataset.id
        })
    },
    bindEventPublish:function () {
        wx.navigateTo({
            url: '../index/eventPublish'
        })
    },
    onLoad: function () {
        this.setData({
            roleID:app.globalData.userInfo.roleID
        });
        if(this.data.roleID == 1) {
            this.bindGetUndealTemporaryWorkList();
        }
        else if(this.data.roleID == 2) {
            this.bindGetUndealTemporaryWorkList1();
        }
        else if(this.data.roleID == 3){
            this.bindGetUndealTemporaryWorkLis2();
        }
    }
})
