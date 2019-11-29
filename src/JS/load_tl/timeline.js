var token = ""
var instance = ""
var api = ""
var gif = ""
var streaming = ""
var img = ""

var webSocket

function loadTimeline(json, index) {

    token = json.token
    instance = json.instance
    api = json.load
    streaming = json.streaming
    img = json.img
    gif = json.gif

    //編集画面
    setEditPanel(json)

    document.getElementById('timeline_edit').style.display = 'block'

    if (webSocket != null) {
        webSocket.close()
    }

    //TLのdiv
    var timelineDiv = document.getElementById('timeline')

    //TLくるくる
    timelineDiv.innerHTML = ''
    var div = document.createElement('div')
    div.className = 'progress'
    div.style.width = '50%'
    div.style.margin = '0 auto'
    var progress = document.createElement('div')
    progress.className = 'indeterminate'
    div.append(progress)
    timelineDiv.append(div)

    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://${instance}${getURL(api)}&access_token=${token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            timelineDiv.innerHTML = ''
            //中に入れるやつ
            var data = JSON.parse(this.responseText)
            for (let index = 0; index < data.length; index++) {

                const item = data[index];
                timelineDiv.append(timelineCard(item, json))

            }
        } else {
            M.toast({ html: `取得に失敗しました ${xmlHttp.status}` })
        }
    }
    xmlHttp.send();


    //ストリーミングAPI
    if (!streaming) {
        console.log(`wss://${instance}${getWebSocektURL(api)}&access_token=${token}`)
        webSocket = new WebSocket(`wss://${instance}${getWebSocektURL(api)}&access_token=${token}`);

        // 接続を開く
        webSocket.addEventListener('open', function (event) {
            M.toast({ html: `リアルタイム更新を始めます` })
        });

        // メッセージを待ち受ける
        webSocket.addEventListener('message', function (event) {
            var json = JSON.parse(event.data)
            if (json.payload != null) {
                var item = JSON.parse(json.payload)
                timelineDiv.prepend(timelineCard(item, json))
            }
        });
    }

    //自分のでーた
    getMyAccount()

}



function getMyAccount() {
    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `https://${instance}/api/v1/accounts/verify_credentials?access_token=${token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            //中に入れるやつ
            var data = JSON.parse(this.responseText)

            document.getElementById('header_name').innerHTML = `
                ${data.display_name}<br>
                @${data.acct}<br>
                @${instance}<br>
            `
            if (!img) {
                if (gif) {
                    document.getElementById('header_avatar').src = data.avatar_static
                } else {
                    document.getElementById('header_avatar').src = data.avatar
                }
            } else {
                document.getElementById('header_name').style.marginLeft = '0'
            }
        }
    }
    xmlHttp.send();
}

function getWebSocektURL(link) {
    var url = ""
    switch (link) {
        case 'home':
            url = "/api/v1/streaming/?stream=user";
            break;
        case 'notification':
            url = "/api/v1/streaming/?stream=user:notification";
            break;
        case 'local':
            url = "/api/v1/streaming/?stream=public:local";
            break;
        case 'public':
            url = "/api/v1/streaming/?stream=public";
            break;
    }
    return url
}

function timelineCard(json, setting) {

    var content = ""
    var name = ""
    var avatar = ""
    var id = ""

    //通知とタイムラインでは内容が変わるので
    if (setting.load == 'notification') {
        if ('status' in json) {
            content = json.status.content
            id = json.status.id
        }
        name = json.type + '/' + json.account.display_name + ' / @' + json.account.acct
        if (setting.gif) {
            avatar = json.account.avatar
        } else {
            avatar = json.account.avatar_static
        }
    } else {
        content = json.content
        id = json.id
        name = json.account.display_name + ' / ' + json.account.acct
        if (setting.gif) {
            avatar = json.account.avatar
        } else {
            avatar = json.account.avatar_static
        }
    }

    //色とか
    var color = "blue lighten-1"
    if (document.getElementById('darkmode_switch').checked) {
        color = "blue darken-4"
    } else {
        color = "blue lighten-1"
    }

    //Card作る。
    var parentDiv = document.createElement('div')
    parentDiv.className = 'space'
    var cardDiv = document.createElement('div')
    cardDiv.className = `card-panel ${color}`
    cardDiv.style.padding = '5px'
    cardDiv.style.margin = '2px'
    cardDiv.style.minHeight = '50px'
    //画像非表示時はPaddingいらん
    if (!img) { cardDiv.style.paddingLeft = '45px' }
    cardDiv.style.position = 'relative'

    //テキスト
    var textDiv = document.createElement('div')
    textDiv.style.padding = '2px'

    //アイコン
    if (!img) {
        var avatarImg = document.createElement('img')
        avatarImg.style.width = '40px'
        avatarImg.style.margin = '2px'
        avatarImg.style.position = 'absolute'
        avatarImg.style.left = '0'
        avatarImg.src = avatar
        textDiv.append(avatarImg)
    }

    var contentSpan = document.createElement('span')
    contentSpan.style.color = '#ffffff'
    contentSpan.innerHTML = content

    var accountSpan = document.createElement('span')
    accountSpan.style.color = '#ffffff'
    accountSpan.innerHTML = name

    //入れる
    textDiv.append(accountSpan)
    textDiv.append(contentSpan)


    //ファボアイコンとか
    var favIcon = document.createElement('i')
    favIcon.onclick = function () {
        favToot(id)
    }
    favIcon.className = 'material-icons white-text'
    favIcon.innerHTML = 'star_border'
    favIcon.style.cursor = 'pointer'
    favIcon.style.cursor = 'hand'
    favIcon.style.marginRight = '10%'

    var btIcon = document.createElement('i')
    btIcon.onclick = function () {
        btToot(id)
    }
    btIcon.className = 'material-icons white-text'
    btIcon.innerHTML = 'repeat'
    btIcon.style.cursor = 'pointer'
    btIcon.style.cursor = 'hand'
    btIcon.style.marginRight = '10%'

    var openIcon = document.createElement('i')
    openIcon.onclick = function () {
        openBrowser(json, instance)//electron.jsに書いてある
    }
    openIcon.className = 'material-icons white-text'
    openIcon.innerHTML = 'open_in_browser'
    openIcon.style.cursor = 'pointer'
    openIcon.style.cursor = 'hand'
    openIcon.style.marginRight = '10%'

    var iconDiv = document.createElement('div')
    iconDiv.append(favIcon)
    iconDiv.append(btIcon)
    iconDiv.append(openIcon)

    cardDiv.append(textDiv)
    cardDiv.append(iconDiv)

    parentDiv.append(cardDiv)

    return parentDiv
}

function favToot(id) {
    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `https://${instance}/api/v1/statuses/${id}/favourite?access_token=${token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            M.toast({ html: `ふぁぼりました` })
        }
    }
    xmlHttp.send();
}

function btToot(id) {
    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `https://${instance}/api/v1/statuses/${id}/reblog?access_token=${token}`);
    xmlHttp.onload = function () {
        if (this.status == 200) {
            M.toast({ html: `ブーストしました` })
        }
    }
    xmlHttp.send();
}

function getURL(load) {
    var url = ""
    switch (load) {
        case 'home':
            url = "/api/v1/timelines/home?limit=40";
            break;
        case 'notification':
            url = "/api/v1/notifications?limit=40";
            break;
        case 'local':
            url = "/api/v1/timelines/public?limit=40&local=true";
            break;
        case 'public':
            url = "/api/v1/timelines/public?limit=40";
            break;
    }
    return url
}

document.getElementById('post').onclick = function () {
    //投稿
    var toot_text = document.getElementById('toot_text').value
    //API叩く
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `https://${instance}/api/v1/statuses/?access_token=${token}`);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xmlHttp.onload = function () {
        if (this.status == 200) {
            M.toast({ html: `投稿しました` })
        }
    }
    xmlHttp.send("status=" + encodeURIComponent(toot_text));

    document.getElementById('toot_text').value = ""
}

function initMultiColumn() {
    var multi_column = document.getElementById('multi_column_div')
    multi_column.innerHTML = ''

    //Card作成
    var parentDiv = document.createElement('div')
    parentDiv.className = 'col s12 m5 multicolumn_tl'
    var cardDiv = document.createElement('div')
    cardDiv.className = 'card-panel teal'

    //Timeline
    var timelineList = getTimelineList()
    for (let index = 0; index < timelineList.length; index++) {
        const json = timelineList[index];
        var timelineList = getTImelin
        var span = document.createElement('span')
        span.innerHTML = json.name
        parentDiv.append(cardDiv)
        multi_column.append(parentDiv)
    }
}


function getTimelineList() {
    timelineList = []
    nameList = []
    var json = localStorage.getItem('timelines')
    if (json != null) {
        var list = JSON.parse(json)
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            nameList.push(item.name)
            timelineList.push(item)
        }
    }
    return timelineList
}