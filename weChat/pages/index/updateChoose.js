var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        location:{
            longitude:0,
            latitude:0
        },
        markers:[],
        clientXY:{
            clientX:0,
            clientY:0
        },
        page:''
    },
    bindtouchend:function () {
        this.setData({
            clientXY: {
                clientX: 0,
                clientY: 0
            }
        })
    },
    bindmove:function (e) {
        //console.log(e);
        if(this.data.clientXY.clientX==0 && this.data.clientXY.clientY == 0) {
            this.setData({
                clientXY: {
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                }
            })
            return;
        }



        let x = e.touches[0].clientX - this.data.clientXY.clientX;
        let y = e.touches[0].clientY - this.data.clientXY.clientY;

        this.setData({
            clientXY: {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            }
        })

        console.log(x + ',' + y);
        let location = this.data.location;
        location.longitude = location.longitude * 1 + (x / 100000).toFixed(5) * 1;
        location.latitude = location.latitude * 1 - (y / 100000).toFixed(5) * 1;
        console.log(location);
        this.setData({
            location:location
        });
        this.changeMarker();
        //e.touchs
    },
    bindTop:function (e) {
        console.log(e);
        let location = this.data.location;
        location.latitude += 0.00001;
        this.setData({
            location:location
        });
        this.changeMarker();
    },
    bindBottom:function () {
        let location = this.data.location;
        location.latitude -= 0.00001;
        this.setData({
            location:location
        });
        this.changeMarker();
    },
    bindLeft:function () {
        let location = this.data.location;
        location.longitude -= 0.00001;
        this.setData({
            location:location
        });
        this.changeMarker();
    },
    bindRight:function () {
        let location = this.data.location;
        location.longitude += 0.00001;
        this.setData({
            location:location
        });
        this.changeMarker();
    },
    bindGoBack:function () {
        wx.redirectTo({
            url: '../index/' + this.data.page + '?' + 'longitude=' + this.data.location.longitude + '&' + 'latitude=' + this.data.location.latitude
        })
    },
    changeMarker:function () {
        var markers = [];
        markers.push({
            longitude: this.data.location.longitude,
            latitude: this.data.location.latitude,
            /*iconPath:'../../resources/148-pin-blue.png',
            height:28,
            width:20*/
        })
        this.setData({
            markers: markers
        })
    },
    onLoad: function (options) {
        let that = this;
        if (options.hasOwnProperty('page')) {
            this.setData({
                page: options.page
            });
        }
        else {
            this.setData({
                page: 'update'
            });
        }
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                that.setData({
                    location:{
                        longitude:res.longitude,
                        latitude:res.latitude
                    }
                })


                let markers = [];
                markers.push({
                    longitude: that.data.location.longitude,
                    latitude: that.data.location.latitude
                })
                that.setData({
                    markers: markers
                })
            }
        })
    }
})
