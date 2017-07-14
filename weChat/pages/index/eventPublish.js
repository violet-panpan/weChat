//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        beginDate: '',
        endDate: '',
        beginDateCurrent: '',
        endDateCurrent: '',
        typeList: [],
        typeIndex: 0,
        placeList: [],
        placeIndex:0,
        textDescription:'',
        copyUser: [],
        workDetail:{},
        workID:0,
        roleID:0
    },
    bindBeginDateChange: function (e) {
        let beginDate = this.data.beginDate;
        this.setData({
            beginDate: e.detail.value
        });
        if (Date.parse(this.data.beginDate) > Date.parse(this.data.endDate)) {
            wx.showModal({
                title: '提示',
                content: '开始时间必须小于结束时间',
                showCancel: false
            })
            this.setData({
                beginDate: beginDate
            });
            return;
        }
        if (Date.parse(this.data.beginDate) <= (Date.parse(new Date()) * 1 - 86400000)) {
            wx.showModal({
                title: '提示',
                content: '开始时间必须开始于今天',
                showCancel: false
            })
            this.setData({
                beginDate: beginDate
            });
            return;
        }
    },
    bindEndDateChange: function (e) {
        let endDate = this.data.endDate;
        this.setData({
            endDate: e.detail.value
        });
        if (Date.parse(this.data.beginDate) > Date.parse(this.data.endDate)) {
            wx.showModal({
                title: '提示',
                content: '开始时间必须小于结束时间',
                showCancel: false
            })
            this.setData({
                endDate: endDate
            });
            return;
        }
    },
    bindGoCheckUser: function () {
        wx.navigateTo({
            url: '../index/warnDepartment' + '?' + 'from=' + 2,
        })
    },
    bindRangeChange: function (e) {
        this.setData({
            contentIndex: e.detail.value
        })
    },
    bindInput: function (e) {
        this.setData({
            textDescription: e.detail.value
        })
    },
    bindTypeChange: function (e) {
        this.setData({
            typeIndex: e.detail.value
        });
        this.getPlaceList();
    },
    bindPlaceChange: function (e) {
        this.setData({
            placeIndex: e.detail.value
        });
    },
    bindGoCheckUser:function () {
        wx.navigateTo({
            url: '../index/warnDepartment' + '?' + 'from=' + 2,
        })
    },
    getTypeList: function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/type/getTypeList',
            data: {},
            method: 'POST',
            login: true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                that.setData({
                    typeList: result.data.content.typeList,
                });
                that.getPlaceList();
            }
        });
    },
    getPlaceList:function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/place/getPlaceList',
            data: {
                typeID:this.data.typeList[this.data.typeIndex].typeID,
                placeID:0
            },
            method: 'POST',
            login: true,
            success(result) {
                if (result.data.code != 1) {
                    that.setData({
                        placeList: [],
                        placeIndex:0
                    });
                    return;
                }
                /*result.data.content.placeList.splice(0, 0 , {
                    placeID:0,
                    placeName:'所有地点'
                });*/
                that.setData({
                    placeList: result.data.content.placeList,
                    placeIndex:0
                });
            }
        });
    },
    getWorkDetail:function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/work/getWorkDetail',
            data: {
                workID:this.data.workID
            },
            method: 'POST',
            login: true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                /*result.data.content.placeList.splice(0, 0 , {
                 placeID:0,
                 placeName:'所有地点'
                 });*/
                that.setData({
                    workDetail: result.data.content.workDetail
                });
            }
        });
    },
    takeEvent:function () {
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
                                //groupIcon:'6_8',
                                longitude:loaction.longitude,
                                latitude:loaction.latitude
                            },
                            method: 'POST',
                            login: false,
                            success(result) {
                                console.log(result);
                                return;
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
    submitEvent:function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/work/launchWork',
            data: {
                typeID:this.data.typeList[this.data.typeIndex].typeID,
                placeID:this.data.placeList[this.data.placeIndex].placeID,
                userID:this.data.copyUser[0].userID,
                title:this.data.textDescription,
                begintime:this.data.beginDate,
                endtime:this.data.endDate
            },
            method: 'POST',
            login: true,
            success(result) {
                if (result.data.code != 1) {
                    that.setData({
                        placeList: [{
                            placeID:0,
                            placeName:'所有地点'
                        }],
                        placeIndex:0
                    });
                    return;
                }
            }
        });
    },
    onShow: function () {
        let that = this;
        let now = new Date();
        let month = now.getMonth() * 1 + 1;
        if (month < 10) {
            month = '0' + month;
        }
        let beginDate = now.getFullYear() + '-' + month + '-' + now.getDate();
        //let tomorrw = new Date(Date.parse(new Date()) + 86400000);
        //let endDate = tomorrw.getFullYear() + '-' + (tomorrw.getMonth() * 1 + 1) +  '-' + tomorrw.getDate();
        //console.log(Date.parse(new Date()) + 86400000);
        this.setData({
            beginDate: beginDate,
            endDate: beginDate,
            beginDate: beginDate,
            endDate: beginDate,
            date: beginDate
        });

        //checkUser
        try {
            let copyUser = wx.getStorageSync('copyUser');
            if (copyUser) {
                this.setData({
                    copyUser:copyUser
                })
            }
        } catch (e) {}

        this.getTypeList();
    },
    onLoad:function (option) {
        if(option.hasOwnProperty('id')) {
            this.setData({
                workID:option.id
            });
            this.getWorkDetail();
        }

        this.setData({
            roleID:app.globalData.userInfo.roleID
        });
    }
})
