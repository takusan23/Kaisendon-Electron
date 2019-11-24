//Electron API
var electron = require('electron').remote

document.getElementById('add').addEventListener('click', () => {

    //TL名前
    var name = document.getElementById('name').value
    //アカウントのいち。LocalStorageと同じ位置。
    var accountPos = document.getElementById('account_select').selectedIndex
    //インスタンス名、アクセストークン取得
    var instance = getInstance(accountPos)
    var token = getToken(accountPos)
    //読み込むTL
    var load = document.getElementById('load').value

    //オプション
    var streaming = document.getElementById('streaming').checked
    var img = document.getElementById('img').checked
    var gif = document.getElementById('gif').checked

    //オブジェクトへ
    var item = {
        'name': name,
        'instance': instance,
        'token': token,
        'load': load,
        'streaming': streaming,
        'img': img,
        'gif': gif
    }

    //LocalStorageから読み込む
    var list = getTimelineList()
    list.push(item)
    //LocalStorageに保存
    var json = JSON.stringify(list)
    localStorage.setItem('timelines', json)

    //できたらウィンドウ閉じる
    setTimeout(() => {
        var browser = electron.getCurrentWindow()
        browser.close()
    }, 1000)

})

function getTimelineList() {
    var list = []
    var json = localStorage.getItem('timelines')
    if (json != null) {
        var timelineList = JSON.parse(json)
        for (let index = 0; index < timelineList.length; index++) {
            const item = timelineList[index];
            list.push(item)
        }
    }
    return list
}

function getInstance(pos) {
    var accounts = localStorage.getItem('accounts')
    if (accounts != null) {
        accounts = JSON.parse(accounts)
        const obj = accounts[pos];
        return obj.instance
    }
}

function getToken(pos) {
    var accounts = localStorage.getItem('accounts')
    if (accounts != null) {
        accounts = JSON.parse(accounts)
        const obj = accounts[pos];
        return obj.token
    }
}