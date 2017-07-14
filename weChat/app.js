var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config');
var locationIndex = 0;


App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl);

        let that = this;

        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        that.globalData.wxUserInfo = res.userInfo;
                        //2、用户登录
                        that.getUserInfo();
                    },
                    fail:function (res) {
                        that.goToDoor();
                    }
                });
            },
            fail:function () {
                that.goToDoor();
            }
        })
    },
    showLoad: function () {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        })
    },
    hideLoad: function () {
        wx.hideToast()
    },
    request:function (o) {
        var that = this;
        if (o.hasOwnProperty('show') && o.show) {
            this.showLoad();
        }

        qcloud.request({
            // 要请求的地址
            url: o.url,
            data: o.data,
            method: o.method,
            login: o.login,
            success(result) {
                if (o.hasOwnProperty('show') && o.show) {
                    that.hideLoad();
                }
                if (result.data.code == -1001) {
                    wx.reLaunch({
                        url: '/pages/member/login'
                    })
                    return;
                }
                else if (result.data.code == -1002) {
                    wx.reLaunch({
                        url: '/pages/index/msg?' + 'icon=weui-icon-warn&' + 'msg=正在审核'
                    })
                    return
                }
                o.success(result);
            },
            fail:function (result) {
                //比如登录错误神马的
                wx.showModal({
                    title: '提示',
                    content: result.errMsg,
                    showCancel:false
                })
            }
        });
    },
    //跳转到未授权页面
    goToDoor: function(){
        wx.showModal({
            title: '提示',
            content: '请删除该小程序，再次访问请点击授权',
            showCancel:false,
            success:function () {
                wx.reLaunch({
                    url: '/pages/index/door'
                })
            }
        })
    },
    //跳转到登录页
    goToLogin:function () {
        wx.showModal({
            title: '提示',
            content: '请先登录',
            showCancel:false,
            success:function () {
                wx.redirectTo({
                    url: '/pages/member/login'
                })
            }
        })
    },
    //得到用户信息
    getUserInfo: function () {
        try {
            let userInfo = wx.getStorageSync('userInfo');
            if (userInfo) {
                this.globalData.userInfo = userInfo;
                wx.reLaunch({
                    url: '/pages/index/index'
                })
                return;
            }
            this.goToLogin();
        } catch (e) {
            this.goToLogin();
        }
    },
    globalData: {
        wxUserInfo: null,
        userInfo:{}
    }
})