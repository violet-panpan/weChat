//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        wxUserInfo:{},
        userInfo:{}
    },
    //事件处理函数
    bindLogout: function () {
        app.request({
            // 要请求的地址
            url: config.service.rootUrl + '/minapp/user/logout',
            data:{},
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

                //删除缓存
                try {
                    wx.removeStorageSync('userInfo')
                } catch (e) {
                    // Do something when catch error
                }

                try {
                    wx.reLaunch({
                        url: '../member/login'
                    })
                }
                catch(e) {
                    wx.switchTab({
                        url: '../member/login'
                    })
                }
            }
        });
    },
    bindLanya:function () {
        wx.navigateTo({
            url: '../member/lanya'
        })
    },
    updateBeat:function () {
        wx.showToast({
            title: '已经是最新版本了',
            icon: 'success',
            duration: 2000
        })
    },
    clearBeat:function () {
        wx.showToast({
            title: '缓存已被清空',
            icon: 'success',
            duration: 2000
        })
    },
    getUserInfo:function () {
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
    getWxUserInfo:function () {
        this.setData({
            wxUserInfo: app.globalData.wxUserInfo
        })
    },
    onLoad: function () {
        this.getUserInfo();
        this.getWxUserInfo();
    }
})
