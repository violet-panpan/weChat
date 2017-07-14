//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');



var app = getApp()
Page({
    data: {
        patrolList:[],
        typeList:[],
        conditionBox:false,
        currentTypeID:0,
        nolistMessage:'加载中...'
    },
    //事件处理函数
    bindOk: function () {
        wx.navigateTo({
            url: '../index/msg'
        })
    },
    bindWarn: function () {
        wx.navigateTo({
            url: '../index/warn'
        })
    },
    bindOpenMap: function () {
        wx.navigateTo({
            url: '../index/map'
        })
    },
    bindGoPatrolDetailList:function (e) {
        wx.navigateTo({
            url: '../index/patrolDetailList' + '?' + 'typeID=' + e.currentTarget.dataset.typeID + '&patrolIcon=' + e.currentTarget.dataset.patrolIcon
        })
    },
    bindChangeType:function (e) {
        this.setData({
            currentTypeID: e.currentTarget.dataset.id
        });
        this.getPatrolList();
    },
    bindChangeModule:function () {
        this.setData({
            currentTypeID: 0
        });
        this.getWorkList();
    },
    bindConditionBox:function () {
        this.setData({
            conditionBox:true
        })
    },
    getTypeList:function () {
        let that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/type/getTypeList',
            data: {},
            method: 'POST',
            login: false,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                that.setData({
                    typeList: result.data.content.typeList,
                    currentTypeID:result.data.content.typeList[0].typeID
                });

                that.getPatrolList();
            }
        });
    },
    getWorkList:function () {
        let that = this;
        let beginDate =  (new Date()).toLocaleDateString();
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/patrol/getWorkList',
            data: {
                'beginDate':beginDate
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                that.setData({
                    patrolList: result.data.content.patrolList
                });
            }
        });
    },
    /*getOnePatrolList:function (typeID, patrolIcon) {
        var that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/patrol/getOnePatrolList',
            data: {
                typeID:typeID,
                patrolIcon:patrolIcon
            },
            method: 'POST',
            login: false,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                result.data.content.patrolList.forEach(function(item) {
                    item.userName = item.userName.join(',');
                });
                that.setData({
                    patrolList: result.data.content.patrolList
                });
            }
        });
    },*/
    getPatrolList:function() {
        let that = this;
        let beginDate =  (new Date()).toLocaleDateString();
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/patrol/getPatrolList',
            data: {
                'beginDate':beginDate,
                'typeID':this.data.currentTypeID
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    if(result.data.code == -2) {
                        that.setData({
                            patrolList: [],
                            nolistMessage:result.data.msg
                        });
                    }
                    return;
                }
                result.data.content.patrolList.forEach(function(item) {
                    item.userName = item.userName.join(',');
                });
                that.setData({
                    patrolList: result.data.content.patrolList
                });
            }
        });
    },
    onLoad: function () {
        var that = this

        this.getTypeList();
      /*wx.getLocation({
       type: 'gcj02', //返回可以用于wx.openLocation的经纬度
       success: function(res) {
       var latitude = res.latitude
       var longitude = res.longitude
       wx.openLocation({
       latitude: latitude,
       longitude: longitude,
       scale: 28
       })
       }
       })*/
    }
})
