//index.js
//获取应用实例
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');


var app = getApp()
Page({
    data: {
        articleDetail:{
            title:'',
            typeName:'',
            introduce:'',
            photo:'',
            author:'',
            updateTime:0,
            hit:0,
            contentList:[]
        }
    },
    getArticleDetail:function (id) {
        let that = this;
        app.request({
            url: config.service.moduleUrl + '/article/getArticleDetail',
            data:{
                articleID:id
            },
            method: 'POST',
            login: false,
            success(result) {
                if(result.data.code != 1) {
                    return;
                }
                that.setData({
                    articleDetail:result.data.content.articleDetail
                });
            }
        });
    },
    onLoad: function (option) {
        this.getArticleDetail(option.id);
    }
})
