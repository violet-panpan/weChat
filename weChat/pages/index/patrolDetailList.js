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
        patrolDetailList:[],
        actualNumber:0,
        totalNumber:0,
        updateTime:'',
        mapCtx:{},
        mapCenterPoint: {
            latitude: 0,
            longitude: 0
        },
        polyline:[
            /*{
                points:[
                    {
                        latitude:29.305580,
                        longitude:120.074690
                    },
                    {
                        latitude:29.307975,
                        longitude:120.074548
                    },
                    {
                        latitude:29.306132,
                        longitude:120.071533
                    },
                    {
                        latitude:29.308078,
                        longitude:120.071661
                    },
                    {
                        latitude:29.294521,
                        longitude:120.074837
                    },
                    {
                        latitude:29.296823,
                        longitude:120.084901
                    },
                    {
                        latitude:29.299442,
                        longitude:120.088549
                    },{
                        latitude:29.300790,
                        longitude:120.091177
                    }
                ],
                color:"#FF0000DD",
                width:2,
                dottedLine:false
            }*/
        ]
    },
    bindGoPatrolDetailContentList:function (e) {
        if(e.currentTarget.dataset.status == 0) {
            return;
        }
        if(e.currentTarget.dataset.status == 2) {
            return;
        }
        wx.navigateTo({
            url: '../index/patrolDetailContentList' + '?' + 'patrolID=' + e.currentTarget.dataset.patrolID
        })
    },
    getOnePatrolList:function (typeID, patrolIcon) {
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
                /*result.data.content.patrolList.forEach(function(item) {
                    item.userName = item.userName.join(',');
                });*/


                Date.prototype.format = function(format) {
                    var date = {
                        "M+": this.getMonth() + 1,
                        "d+": this.getDate(),
                        "h+": this.getHours(),
                        "m+": this.getMinutes(),
                        "s+": this.getSeconds(),
                        "q+": Math.floor((this.getMonth() + 3) / 3),
                        "S+": this.getMilliseconds()
                    };
                    if (/(y+)/i.test(format)) {
                        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                    }
                    for (var k in date) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                        }
                    }
                    return format;
                }

                let onePatrolList = result.data.content.onePatrolList;
                let points = [];
                let polyline = [{
                    points:[],
                    color:"#FF0000DD",
                    width:2,
                    dottedLine:false
                }];
                let mapCenterPoint = {};
                onePatrolList.forEach(function (item) {
                    if(item.hasOwnProperty('addtime')) {
                        let datetime = new Date(Date.parse(item.addtime));

                        //datetime = datetime.toLocaleTimeString();
                        //console.log(datetime);
                        item.date = datetime.format('MM-dd');
                        item.time = datetime.format('h:m');
                    }
                    else {
                        item.date = '';
                        item.time = '';
                    }
                    points.push({
                        latitude:item.latitude,
                        longitude:item.longitude
                    });
                    mapCenterPoint.latitude = item.latitude;
                    mapCenterPoint.longitude = item.longitude;
                })
                polyline[0].points = points;
                that.setData({
                    patrolDetailList: onePatrolList,
                    actualNumber: result.data.content.actualNumber,
                    totalNumber: result.data.content.totalNumber,
                    updateTime: result.data.content.updateTime,
                    polyline:polyline,
                    mapCenterPoint:mapCenterPoint
                });
            }
        });
    },

    bindGPS: function () {
        wx.navigateTo({
            url: '../index/gps'
        })
    },
    /*getPatrolList:function() {
        var that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/patrol/getPatrolList',
            data: {},
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
    onLoad: function (option) {
        var that = this;
        this.getOnePatrolList(option.typeID, option.patrolIcon);

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
