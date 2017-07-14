//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        user: {
            mobile: "",
            mobileCode: "",
            jobNumber: "",
            trueName: ""
        },
        userInfo:{},
        articleTypeID:1,
        page:{
            index: 1,
            count: 10
        },
        work:{
            workID:0
        }
    },
    bindEventCancel:function () {
        wx.showModal({
            title: '提示',
            confirmText:'忽略',
            cancelText:'不忽略',
            content: '是否忽略该事件？',
            success: function(res) {
                if (res.confirm) {

                }
            }
        })
    },
    bindEventDo:function (e) {
        if(e.currentTarget.dataset.module == 1) {
            wx.navigateTo({
                url: '../index/eventPublish?id=' + e.currentTarget.dataset.id
            })
        }
        else if(e.currentTarget.dataset.module == 2){
            /*wx.navigateTo({
                url: '../index/eventPublish?id=' + e.currentTarget.dataset.id
            })*/
        }
    },
    bindQrcode:function () {
        let that = this;

        wx.getLocation({
            type: 'gcj02',
            success: function (loaction) {
                wx.scanCode({
                    complete:function (res)  {
                        if(res.hasOwnProperty('path') && res.path.length > 0) {
                            app.request({
                                url: config.service.moduleUrl + '/patrol/createOnePatrol',
                                data:{
                                    groupIcon:res.path.substring(18),
                                    //groupIcon:'7_5',
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
                                        url: '../index/patrolDetailContentList' + '?' + 'patrolID=' + result.data.content.onePatrol.patrolID
                                    })
                                    /*wx.navigateTo({
                                        url: '../index/msg' + '?' + 'delta=' + 1 + '&msg=' + "地点“" + result.data.content.onePatrol.placeName + "”开始检查"
                                    })*/
                                }
                            });
                        }
                    },
                    fail:function (res) {
                        console.log(res);
                    }
                })
            }
        })
    },
    bindPatrolList: function () {
        wx.navigateTo({
            url: '../index/patrolList'
        })
    },
    bindWarn: function () {
        wx.navigateTo({
            url: '../index/warn'
        })
    },
    bindWarnCheck:function () {
        wx.navigateTo({
            url: '../index/warnCheck'
        })
    },
    bindEvent:function () {
        wx.navigateTo({
            url: '../index/eventList'
        })
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
    getDealMust:function () {
        var that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/patrol/getDealMust',
            data:{},
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if(result.data.code !=1 ) {
                    return;
                }
                that.setData({
                    work:result.data.content.work
                })
            }
        });
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
    bindGoToDetail:function (e) {
        wx.navigateTo({
            url: '../index/articleDetail' + '?id=' + e.currentTarget.dataset.id
        })
    },
    bindGoToDetail:function (e) {
        wx.navigateTo({
            url: '../index/articleDetail' + '?id=' + e.currentTarget.dataset.id
        })
    },

    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        /*app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })*/

        this.setData({
            roleID:app.globalData.userInfo.roleID
        });
        this.getArticleList();
        this.getDealMust();
    }
})
