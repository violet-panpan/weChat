//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        userInfo: {
            mobile: "",
            mobileCode: "",
            jobNumber: "",
            trueName: ""
        },
        wxUserInfo: {}
    },
    //事件处理函数
    bindBind: function () {
        wx.navigateTo({
            url: '../index/msg'
        })
    },
    bindWarn: function () {
        wx.navigateTo({
            url: '../index/warn'
        })
    },
    bindInputTrueName: function(e) {
        var userInfo = this.data.userInfo;
        userInfo.trueName = e.detail.value;
        this.setData({
            userInfo: userInfo
        })
    },
    bindInputMobile: function(e) {
        var userInfo = this.data.userInfo;
        userInfo.mobile = e.detail.value;
        this.setData({
            userInfo: userInfo
        })
    },
    bindInputMobileCode: function(e) {
        var userInfo = this.data.userInfo;
        userInfo.mobileCode = e.detail.value;
        this.setData({
            user: userInfo
        })
    },
    bindInputJobNumber: function(e) {
        var userInfo = this.data.userInfo;
        userInfo.jobNumber = e.detail.value;
        console.log(userInfo);
        this.setData({
            user: userInfo
        })
    },
    bindBandUser: function () {
      this.bandUser();
    },
    bandUser:function () {
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/user/register',
            data:{
                mobile: this.data.userInfo.mobile,
                mobileCode: this.data.userInfo.mobileCode,
                jobNumber: this.data.userInfo.jobNumber,
                trueName: this.data.userInfo.trueName
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if(result.data.code !=1 ) {
                    wx.showModal({
                        title: '提示',
                        content: result.data.msg,
                        showCancel:false,
                        success: function(res) {
                            if (res.confirm) {
                                console.log('知道了')
                            }
                        }
                    })
                    return;
                }

                wx.redirectTo({
                    url: '../member/login'
                })
            }
        });
    },
    sendMessageForBandUser:function () {
        app.request({
            // 要请求的地址
            url: config.service.rootUrl + '/minapp/user/sendMessageForBandUser',
            data:{
                mobile:this.data.userInfo.mobile
            },
            method: 'POST',
            login: true,
            show: true,
            success(result) {
                if(result.data.code !=1 ) {
                    wx.showModal({
                        title: '提示',
                        content: result.data.msg,
                        showCancel:false,
                        success: function(res) {
                            if (res.confirm) {
                                console.log('知道了')
                            }
                        }
                    })
                    return;
                }
                wx.showToast({
                    title: '短信已发送',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail(error) {
                /*console.log('request fail', error);
                result.content;*/
            },
            complete() {
                /*console.log('request complete');
                result.content;*/
            }
        });
    },
    onLoad: function () {

    }
})
