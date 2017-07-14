//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');



var app = getApp()
Page({
    data: {
        placeContentList:[],
        typeName:''
    },
    getOnePatrolPlaceContent:function (patrolID) {
        var that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/patrol/getOnePatrolPlaceContent',
            data: {
                patrolID:patrolID
            },
            method: 'POST',
            login: false,
            show:true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                /*result.data.content.patrolList.forEach(function(item) {
                 item.userName = item.userName.join(',');
                 });*/
                that.setData({
                    placeContentList: result.data.content.placeContentList,
                    typeName: result.data.content.typeName
                });
            }
        });
    },
    bindGoback:function () {
        wx.navigateBack();
    },
    onLoad: function (option) {
        var that = this;
        console.log(option);
        this.getOnePatrolPlaceContent(option.patrolID);
        //console.log(option);
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
