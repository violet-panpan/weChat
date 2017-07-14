var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        userInfo: {},
        substanceList: [],
        substancePropList:[],
        substanceIndex:0,
        location:{
            longitude:0,
            latitude:0
        },
        placeForm:{
            placeID:0,
            placeName:'',
            longitude:'',
            latitude:'',
            substance:{
                substanceID:0,
                substanceName:'',
                substanceProp:[]
            }
        }
    },
    //事件处理函数
    bindSubmit: function () {
        this.updatePlace();
    },
    bindInputPlaceName:function (e) {
        let placeForm = this.data.placeForm;
        placeForm.placeName = e.detail.value
        this.setData({
            placeForm:placeForm
        })
    },
    bindInputField:function (e) {
        let substancePropList = this.data.substancePropList;
        substancePropList[e.target.dataset.index].fieldValue = e.detail.value;
        this.setData({
            substancePropList:substancePropList
        })
    },
    bingMapClick: function (e) {
      console.log(e);
    },
    bindSubstancePickerChange: function(e) {
        this.setData({
            substanceIndex: e.detail.value
        })
        this.getSubstancePropListById(this.data.substanceList[e.detail.value].substanceID);
    },
    getAreaList:function () {
        let that = this;
        this.$http.post(store.state.config.apiUrlRoot + "area/getAreaList", {parentID: 1282}).then(
            function (response) {
                var data = response.body;
                if (data.code != 1) {
                    that.areaList = [];
                    return;
                }
                that.areaList = data.content.areaList;
            }, function (response) {

            });
    },
    updatePlace:function () {
        let that = this;
        let placeForm = that.data.placeForm;
        placeForm.substance.substanceID = that.data.substanceList[that.data.substanceIndex].substanceID;
        placeForm.substance.substanceProp = that.data.substancePropList;
        placeForm.longitude = that.data.location.longitude;
        placeForm.latitude = that.data.location.latitude;

        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/place/updatePlace',
            data:placeForm,
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if(result.data.code !=1 ) {
                    wx.showModal({
                        title: '提示',
                        content: result.data.msg,
                        success: function(res) {

                        }
                    })
                    return;
                }
                wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 2000
                })
                wx.navigateTo({
                    url: 'msg?delta=2'
                })
            }
        });
    },
    getSubstancePropListById:function (substanceID) {
        let that = this;
        app.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/substance/getSubstancePropListById',
            data:{
                substanceID:substanceID
            },
            method: 'POST',
            login: true,
            show:true,
            success(result) {
                if(result.data.code !=1 ) {
                    return;
                }
                that.data.substancePropList = [];
                that.setData({
                    substancePropList : result.data.content.substancePropList
                });
            }
        });
    },
    getSubstanceList:function () {
        let that = this;
        app.showLoad();
        qcloud.request({
            // 要请求的地址
            url: config.service.moduleUrl + '/substance/getSubstanceList',
            data:{},
            method: 'POST',
            login: false,
            success(result) {
                if(result.data.code !=1 ) {
                    return;
                }
                that.setData({
                    substanceList : result.data.content.substanceList
                });
                that.getSubstancePropListById(result.data.content.substanceList[0].substanceID);
            },
            complete() {
                app.hideLoad()
            }
        });

    },
    onLoad: function (options) {
        let that = this;
        this.getSubstanceList();
        //如果当前传过来一个坐标，则我们不要自己获取坐标，已传过来的为准
        if(options.hasOwnProperty('longitude') && options.hasOwnProperty('latitude')) {
            that.setData({
                location:{
                    longitude:options.longitude,
                    latitude:options.latitude
                }
            })
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
                }
            })
        }
    }
})
