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
        typeUrl:config.service.rootUrl + '/resource/xiaohuosuan.jpg',
        location:{
            longitude:0,
            latitude:0
        },
        place:{},
        placeList:{},
        placeNameList:[]
    },
    bindChangePlace: function () {
        let that = this;
        wx.showActionSheet({
            itemList: this.data.placeNameList,
            success: function(res) {
                that.setData({
                    place:that.data.placeList[res.tapIndex]
                });
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },
    //事件处理函数
    bindSubmit: function () {

        wx.showActionSheet({
            itemList: ['正常', '上报异常'],
            success: function(res) {
                if(res.tapIndex == 0) {
                    wx.navigateTo({
                        url: '../index/msg?' + 'delta=2'
                    })
                }
                else if(res.tapIndex == 0) {
                    wx.navigateTo({
                        url: '../index/warn'
                    })
                }

            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },
    bindWarn: function () {
        wx.navigateTo({
            url: '../index/warn'
        })
    },
    bindOpenProp:function () {
        let params = '';
        let substanceProp = this.data.place.substance.substanceProp;
        for(let i in substanceProp) {
            params = params + substanceProp[i].label + ':' + substanceProp[i].fieldValue + ' \n ';
        }
        wx.showModal({
            title: '项目参数',
            content: params,
            showCancel:false,
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    bindChooseLocation:function () {
        wx.navigateTo({
            url: '../index/updateChoose?' + 'page=' + 'patrol'
        })
    },
    bindOpenMap: function () {
        wx.navigateTo({
            url: '../index/map'
        })
    },
    bindRefreshLocation:function () {
        let that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                that.setData({
                    location:{
                        longitude:res.longitude,
                        latitude:res.latitude
                    }
                })
                that.getPlaceByLocation();
            }
        })
    },
    getPlaceByLocation:function () {
        let that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/place/getPlaceByLocation',
            data:{
                longitude:this.data.location.longitude,
                latitude:this.data.location.latitude
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if(result.data.code !=1 ) {
                    return;
                }

                let placeNameList = [];
                let newPlaceList = [];
                for(let i in result.data.content.placeList) {
                    //项目数最大不能超过6
                    if(i < 3) {
                        placeNameList.push(result.data.content.placeList[i].placeName)
                        newPlaceList.push(result.data.content.placeList[i]);
                    }
                }
                that.setData({
                    placeList : newPlaceList,
                    place:newPlaceList[0],
                    placeNameList:placeNameList
                });
            }
        });
    },
    /*getPlaceByLocation:function () {
        let that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/place/getPlaceByLocation',
            data:{
                longitude:this.data.location.longitude,
                latitude:this.data.location.latitude
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if(result.data.code !=1 ) {
                    return;
                }
                that.setData({
                    placeList : result.data.content.placeList,
                    place:result.data.content.placeList[0]
                });
            }
        });
    },*/
    onLoad: function (options) {
        let that = this;

        //如果当前传过来一个坐标，则我们不要自己获取坐标，已传过来的为准
        if(options.hasOwnProperty('longitude') && options.hasOwnProperty('latitude')) {
            that.setData({
                location:{
                    longitude:options.longitude,
                    latitude:options.latitude
                }
            })
            that.getPlaceByLocation();
        }

        //如果当前没有传过来坐标，则我们需要获取位置
        else {
            wx.getLocation({
                type: 'gcj02',
                success: function(res) {
                    that.setData({
                        location:{
                            longitude:res.longitude,
                            latitude:res.latitude
                        }
                    })
                    that.getPlaceByLocation();
                }
            })
        }
    }
})
