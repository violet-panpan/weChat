//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        placeContentList:[],
        contentIndex:0,
        thumbs:[],
        thumbsForDatabase:[],
        userList:[],
        option:{
            from:0
        },
        selectUserStorageName:''
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
            delta: 2
        })
    },
    getDepartmentUserList:function (departmentID) {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/department/getOneDepartmentUserList',
            data:{
                departmentID:departmentID
            },
            method: 'POST',
            login: false,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }

                let userList = wx.getStorageSync(that.data.selectUserStorageName);
                if(!userList) {
                    userList = [];
                }
                result.data.content.departmentUserList.forEach(function (item) {
                    item.selected = false;
                    userList.forEach(function (_item) {
                        if(_item.userID == item.userID) {
                            item.selected = true;
                        }
                    })
                });
                that.setData({
                    userList:result.data.content.departmentUserList
                });
            }
        });
    },
    onLoad: function (option) {
        let that = this;
        this.setData({
            option:option
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
        this.getDepartmentUserList(option.id);

    }
})
