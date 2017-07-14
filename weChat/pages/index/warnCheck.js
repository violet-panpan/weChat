//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        warnList:[],
        type:1,
        roleID:0,
        nolistMessage:'加载中...'
    },

    /** 巡检人 **/
    bindGetHadSubmitWarnList:function () {
        this.setData({
            type:1
        })
        this.getWarnList('getHadSubmitWarnList')
    },
    bindGetUnDealWarnList:function () {
        this.setData({
            type:2
        })
        this.getWarnList('getUnDealWarnList')
    },
    bindGetHadDealWarnList:function () {
        this.setData({
            type:3
        })
        this.getWarnList('getHadDealWarnList')
    },


    /** 巡检负责人 **/
    bindGetUnOfferWarnList:function () {
        this.setData({
            type:1
        })
        this.getWarnList('getUnOfferWarnList')
    },
    bindGetHadOfferWarnList:function () {
        this.setData({
            type:2
        })
        this.getWarnList('getHadOfferWarnList')
    },
    bindGetHadSubmitWarnList2:function () {
        this.setData({
            type:3
        })
        this.getWarnList('getHadSubmitWarnListFrom')
    },
    bindGetHadDealWarnList2:function () {
        this.setData({
            type:4
        })
        this.getWarnList('getHadDealWarnList')
    },


    /** 总负责人 **/
    bindGetUnOfferWarnList3:function () {
        this.setData({
            type:1
        })
        this.getWarnList('getUnOfferWarnList')
    },
    bindGetHadOfferWarnList3:function () {
        this.setData({
            type:2
        })
        this.getWarnList('getHadOfferWarnList')
    },
    bindGetDealingWarnList:function () {
        this.setData({
            type:3
        })
        this.getWarnList('getDealingWarnList')
    },
    bindGetHadDealWarnList3:function () {
        this.setData({
            type:4
        })
        this.getWarnList('getHadDealWarnList')
    },

    getWarnList:function (action) {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/warn/' + action,
            data:{},
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    if(result.data.code == -2) {
                        that.setData({
                            warnList: [],
                            nolistMessage:result.data.msg
                        });
                    }
                    return;
                }
                that.setData({
                    warnList:result.data.content.warnList
                });
            }
        });
    },
    /*getUncheckWarnList:function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/warn/getUncheckWarnList',
            data:{
            },
            method: 'POST',
            login: true,
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
    getDealwithList:function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/warn/getDealwithList',
            data:{},
            method: 'POST',
            login: true,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
                that.setData({
                    warnList:result.data.content.warnList
                });
            }
        });
    },*/
    bindGoWarnDetail:function (e) {
        wx.navigateTo({
            url: '../index/warnDetail?id=' + e.currentTarget.dataset.id
        })
    },
    onLoad: function () {
        this.setData({
            roleID:app.globalData.userInfo.roleID
        });
        if(this.data.roleID == 1) {
            this.bindGetHadSubmitWarnList();
        }
        else if(this.data.roleID == 2) {
            this.bindGetUnOfferWarnList();
        }
        else if(this.data.roleID == 3){
            this.bindGetUnOfferWarnList3();
        }
    }
})
