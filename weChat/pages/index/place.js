//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');



var app = getApp()
Page({
    data: {
        mapCtx: {},
        location: {
            longitude: 0,
            latitude: 0
        },
        rangeIndex:0,
        rangeList:[
          200,500,1000,2000,5000,10000
        ],
        placeList: [],
        markers: []
    },
    getPlaceByLocation: function (range) {
        let that = this;
        var param = {
            longitude: this.data.location.longitude,
            latitude: this.data.location.latitude,
            range:range
        };


        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.setData({
                    location: {
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                })

                app.request({
                    // 要请求的地址
                    url: config.service.moduleUrl + '/place/getPlaceByLocation',
                    data: param,
                    method: 'POST',
                    login: true,
                    show:true,
                    success(result) {
                        if (result.data.code != 1) {
                            return;
                        }
                        that.setData({
                            placeList: result.data.content.placeList
                        });

                        let markers = [];
                        for (let i in that.data.placeList) {
                            let iconPath = '';
                            if(that.data.placeList[i].substanceID == 15) {
                                iconPath = '../../resources/min_xiaohuosuan.png';
                            }
                            else {
                                iconPath = '../../resources/min_shuiyuan.png';
                            }
                            markers.push({
                                longitude: that.data.placeList[i].longitude,
                                latitude: that.data.placeList[i].latitude,
                                title: that.data.placeList[i].substance.substanceName + '：' + that.data.placeList[i].placeName + '，' + that.data.placeList[i].distance,
                                iconPath:iconPath,
                                height:10,
                                width:10
                            })
                        }

                        that.setData({
                            markers: markers
                        });

                    }
                });
            }
        })



    },
    bindRangeChange:function (e) {
        this.setData({
            rangeIndex: e.detail.value
        })
        this.getPlaceByLocation(this.data.rangeList[e.detail.value]);
    },
    onLoad: function () {
        let that = this;
        this.mapCtx = wx.createMapContext('myMap');
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.setData({
                    location: {
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                })
                that.getPlaceByLocation(200);
            }
        })
    }
})
