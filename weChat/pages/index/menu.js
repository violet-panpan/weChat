//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');



var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        wxUserInfo:{},
        user:{},
        articleList:[],
        articleTypeID:1,
        page:{
            index: 1,
            count: 10
        }
    },
    bindUncheck:function (e) {
        this.setData({
            articleTypeID:e.currentTarget.dataset.typeid
        })
        this.getArticleList()
    },
    bindCheck:function (e) {
        this.setData({
            articleTypeID:e.currentTarget.dataset.typeid
        })
        this.getArticleList()
    },
    //事件处理函数
    bindPatrol: function () {
        wx.navigateTo({
            url: '../index/patrol'
        })
    },
    bindPatrolList: function () {
        wx.navigateTo({
            url: '../index/patrolList'
        })
    },
    bindPlace: function () {
        wx.navigateTo({
            url: '../index/place'
        })
    },
    bindSubstanceInfo: function () {
        wx.navigateTo({
            url: '../index/info'
        })
    },
    bindSubstanceUpdateChoose: function () {
        wx.navigateTo({
            url: '../index/updateChoose'
        })
    },
    bindWarnUpdate: function () {
        wx.navigateTo({
            url: '../index/warn'
        })
    },
    bindGPS: function () {
        wx.navigateTo({
            url: '../index/gps'
        })
    },
    bindWarnCheck:function () {
        wx.navigateTo({
            url: '../index/warnCheck'
        })
    },
    bindMessage: function () {
        wx.navigateTo({
            url: '../index/message'
        })
    },
    bindOtherFunction: function () {
        wx.navigateTo({
            url: '../index/other'
        })
    },
    bindOtherFunction: function () {
        wx.navigateTo({
            url: '../index/other'
        })
    },
    bindBandFunction:function () {
        wx.navigateTo({
            url: '../index/member'
        })
    },
    bindWarnMylist:function () {
        wx.navigateTo({
            url: '../index/warnMyList'
        })
    },
    bindGoToDetail:function (e) {
        wx.navigateTo({
            url: '../index/articleDetail' + '?id=' + e.currentTarget.dataset.id
        })
    },
    bindQrcode:function () {
        let that = this;

        wx.getLocation({
            type: 'gcj02',
            success: function (loaction) {
                wx.scanCode({
                    success: (res) => {
                        if(res.hasOwnProperty('path') && res.path.length > 0) {
                            app.request({
                                url: config.service.moduleUrl + '/patrol/createOnePatrol',
                                data:{
                                    placeID:parseInt(res.path.substring(18)),
                                    longitude:loaction.longitude,
                                    latitude:loaction.latitude
                                },
                                method: 'POST',
                                login: false,
                                success(result) {
                                    if(result.data.code != 1) {
                                        wx.navigateTo({
                                            url: '../index/msg' + '?' + 'delta=' + 1 + '&msg=' + result.data.msg
                                        })
                                        return;
                                    }
                                    wx.navigateTo({
                                        url: '../index/msg' + '?' + 'delta=' + 1 + '&msg=' + "地点“" + result.data.content.onePatrol.placeName + "”开始检查"
                                    })
                                }
                            });

                        }
                    }
                })
            }
        })
    },
    getArticleList:function () {
        var that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/article/getArticleList',
            data:{
                typeID:this.data.articleTypeID,
                page:this.data.page
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if(result.data.code !=1 ) {
                    return;
                }
                that.setData({
                    articleList:result.data.content.articleList
                })
            }
        });
    },
    getUserInfo:function () {
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
    getWxUserInfo: function () {
        let that = this
        //调用登录接口
        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        that.setData({
                            wxUserInfo: res.userInfo
                        })
                    }
                })
            }
        })
    },
    onLoad: function () {
        this.getArticleList();
        this.getWxUserInfo()
        this.getUserInfo();
        //this.mapCtx = wx.createMapContext('myMap')
        //console.log(config.service.rootUrl + '/minapp/work/getWorkList');

        /*if (wx.showLoading) {
            wx.showLoading({
                title: '加载中',
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }*/
    }
})
