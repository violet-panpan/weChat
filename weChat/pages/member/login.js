//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        wxUserInfo: {},
        userInfo:{},
    },
    //事件处理函数
    bindBand: function () {
        wx.navigateTo({
            url: '../member/band'
        })
    },
    bindWarn: function () {
        wx.navigateTo({
            url: '../index/warn'
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
            userInfo: userInfo
        })
    },
    bindLogin: function () {
      this.login();
    },
    login:function () {
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/user/login',
            data:{
                mobile: this.data.userInfo.mobile,
                mobileCode: this.data.userInfo.mobileCode
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    wx.showModal({
                        title: '提示',
                        content: result.data.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {

                            }
                        }
                    })
                    return;
                }


                if (result.data.content.userInfo.status == 0) {
                    wx.redirectTo({
                        url: '../index/msg?' + 'icon=weui-icon-warn&' + 'msg=正在审核'
                    })
                    return;
                }
                try {
                    wx.setStorageSync('userInfo', result.data.content.userInfo)
                }
                catch (e) {

                }
                app.globalData.userInfo = result.data.content.userInfo;
                try {
                    wx.reLaunch({
                        url: '../index/index'
                    })
                }
                catch(e) {
                    wx.switchTab({
                        url: '../index/index'
                    })
                }
            }
        });
    },
    sendMessageForUserLogin:function () {
        app.request({
            // 要请求的地址
            url: config.service.rootUrl + '/minapp/user/sendMessageForUserLogin',
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
        var that = this;
        //this.getUserInfo();
        //调用应用实例的方法获取全局数据
        /*app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })*/
    }
})
