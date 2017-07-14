function showLoad(wx) {
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 5000
    })
}

function hideLoad(wx) {
    wx.hideToast()
}

module.exports = {
    showLoad: showLoad,
    hideLoad: hideLoad
}
