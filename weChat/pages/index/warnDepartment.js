//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        placeContentList: [],
        contentIndex: 0,
        thumbs: [],
        thumbsForDatabase: [],
        departmentList: [],
        userList:[],
        option: {
            from: 0
        },
        selectUserStorageName:''
    },
    bindGoWarnUserList: function (e) {
        wx.navigateTo({
            url: '../index/warnUserList' + '?' + 'id=' + e.currentTarget.dataset.id + '&from=' + this.data.option.from
        })
    },
    bindUploadFile: function () {
        let that = this;
        wx.chooseImage({
            count: 3, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    thumbs: res.tempFilePaths
                });


                let thumbsForDatabase = [];
                res.tempFilePaths.forEach(function (item, index) {
                    wx.uploadFile({
                        url: config.service.moduleUrl + '/upload/upload', //仅为示例，非真实的接口地址
                        filePath: item,
                        name: 'file',
                        formData: {},
                        success: function (_res) {
                            let data = JSON.parse(_res.data);
                            thumbsForDatabase.push(data.content.imgUrl);
                            console.log(index);
                            if (index == res.tempFilePaths.length - 1) {
                                that.setData({
                                    thumbsForDatabase: thumbsForDatabase
                                });
                            }
                        }
                    })
                });
            }
        })
    },
    bindOk: function (e) {
        var delta = e.target.dataset.delta;
        wx.navigateTo({
            url: '../index/msg' + '?' + 'delta=' + delta,
        })
    },
    bindAudio: function () {
        let that = this;
        let warnForm = this.data.warnForm;
        wx.startRecord({
            success: function (res) {
                warnForm.voiceDescription = res.tempFilePath;
                that.setData({
                    warnForm: warnForm
                })


                //上传服务器
                wx.uploadFile({
                    url: config.service.moduleUrl + '/upload/upload', //仅为示例，非真实的接口地址
                    filePath: res.tempFilePath,
                    name: 'file',
                    formData: {},
                    success: function (res) {
                        /*let data = JSON.parse(res.data);
                         thumbs.push(data.content.imgUrl);*/
                    }
                })


            },
            fail: function (res) {
                //录音失败
                console.log(res);
            }
        })
    },
    bindPlayAudio: function () {
        let that = this;
        wx.playVoice({
            filePath: that.data.warnForm.voiceDescription,
            complete: function () {

            }
        })
    },
    bindEndAudio: function () {
        wx.stopRecord();
    },
    bindRangeChange: function (e) {
        this.setData({
            contentIndex: e.detail.value
        })
    },
    bindInput: function (e) {
        let warnForm = this.data.warnForm;
        warnForm.textDescription = e.detail.value;
        this.setData({
            warnForm: warnForm
        })
    },
    submitPatrol: function () {
        let that = this;
        let contentID = this.data.placeContentList.length ? this.data.placeContentList[this.data.contentIndex].contentID : 0;

        let warnForm = {
            contentID: contentID,
            textDescription: that.data.warnForm.textDescription,
            voiceDescription: that.data.warnForm.voiceDescription,
            photoList: that.data.thumbsForDatabase
        };

        console.log(warnForm);
        app.request({
            url: config.service.moduleUrl + '/patrol/submitPatrol',
            data: warnForm,
            method: 'POST',
            login: false,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                that.setData({
                    placeContentList: result.data.content.placeContentList
                });
            }
        });
    },
    getDepartmentList: function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/department/getDepartmentList',
            data: {},
            method: 'POST',
            login: true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }
                that.setData({
                    departmentList: result.data.content.departmentList
                });
            }
        });
    },
    getUsualUserList: function () {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/department/getUsualUserList',
            data: {},
            method: 'POST',
            login: true,
            success(result) {
                if (result.data.code != 1) {
                    return;
                }

                let userList = wx.getStorageSync(that.data.selectUserStorageName);
                if(!userList) {
                    userList = [];
                }

                result.data.content.userList.forEach(function (item) {
                    item.selected = false;
                    userList.forEach(function (_item) {
                        if(_item.userID == item.userID) {
                            item.selected = true;
                        }
                    })
                });
                that.setData({
                    userList:result.data.content.userList
                });
            }
        });
    },
    bindSelectUser:function (e) {
        let userList = this.data.userList;
        userList.forEach(function (item) {
            if(e.currentTarget.dataset.id == item.userID) {
                item.selected = !item.selected;
            }
        });

        this.setData({
            userList:userList
        });
    },
    bindfinish:function () {
        let userList = [];
        this.data.userList.forEach(function (item) {
            if(item.selected) {
                userList.push(item);
            }
        });
        wx.setStorageSync(this.data.selectUserStorageName, userList);

        wx.navigateBack({
            delta: 1
        })
    },
    onLoad: function (option) {
        let that = this;
        this.setData({
            option: option
        });

        if(this.data.option.from == 1) {
            this.setData({
                selectUserStorageName: 'checkUser'
            });
        }
        else if(this.data.option.from == 2) {
            this.setData({
                selectUserStorageName: 'copyUser'
            });
        }

        //调用应用实例的方法获取全局数据
        this.getDepartmentList();
        this.getUsualUserList();
    }
})
