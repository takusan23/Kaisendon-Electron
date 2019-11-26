//JSおんりー

//追加するタイムラインの名前の配列。
var nameList = []

document.getElementById('add').onclick = () => {

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
    //すでにある？
    var pos = nameList.indexOf(name)
    if (pos != -1) {
        //新規作成
        //配列に追加
        list.push(item)
    } else {
        //上書き
        list[pos] = item
    }

    //LocalStorageに保存
    var json = JSON.stringify(list)
    localStorage.setItem('timelines', json)

    //できたらウィンドウ閉じる
    var panel = document.getElementById('editpanel')
    panel.style.display = 'none'


}

function getTimelineList() {
    var list = []
    var json = localStorage.getItem('timelines')
    if (json != null) {
        var timelineList = JSON.parse(json)
        for (let index = 0; index < timelineList.length; index++) {
            const item = timelineList[index];
            nameList.push(item.name)
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