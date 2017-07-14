//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      mapCtx:{},
      polyline:[
          {
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
          }
      ]
  },
  onLoad: function () {
      this.mapCtx = wx.createMapContext('myMap');

  }
})
