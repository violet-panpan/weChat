//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

//获取应用实例
var app = getApp()
Page({
    data: {
        warnID:0,
        warnDetail:{
            title:'',
            placeName:'',
            contentName:'',
            textDescription:'',
            voiceDescription:'',
            photo:'',
            name:'',
            updateTime:0,
            checkUserMsg:{
                roleID:0,
                userID:0,
                checkName:'',
                status:0,
                statusText:'',
                checkUpdateTime:''
            },
            copyUserMsg:{
                copyName:''
            }
        },
        roleID:0,
        note:''
    },
    //事件处理函数
    bindDealWarn: function () {
        app.request({
            url: config.service.moduleUrl + '/warn/dealWarn',
            data:{
                warnID: this.data.warnID
            },
            method: 'POST',
            login: true,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
            }
        });
    },
    bindOfferWarn:function () {
        app.request({
            url: config.service.moduleUrl + '/warn/offerWarn',
            data:{
                warnID: this.data.warnID,
                note:"这是一个来自巡检负责人的提议"
            },
            method: 'POST',
            login: true,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
            }
        });
    },
    bindSubmitWarn:function () {
        app.request({
            url: config.service.moduleUrl + '/warn/submitWarn',
            data:{
                warnID: this.data.warnID,
                note:"这是一个来自巡检负责人的上报"
            },
            method: 'POST',
            login: true,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
            }
        });
    },
    bindAgreeWarn:function () {
        app.request({
            url: config.service.moduleUrl + '/warn/agreeWarn',
            data:{
                warnID: this.data.warnID
            },
            method: 'POST',
            login: true,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
            }
        });
    },
    getWarnDetail:function (warnID) {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/warn/getWarnDetail',
            data:{
                warnID:warnID
            },
            method: 'POST',
            login: false,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
                that.setData({
                    warnDetail:result.data.content.warnDetail
                });
            }
        });
    },

    onLoad: function (option) {
        this.setData({
            warnID:option.id,
            roleID:app.globalData.userInfo.roleID
        })


        this.getWarnDetail(option.id);
    }
})
