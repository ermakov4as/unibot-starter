module.exports = {
    show_users_list: show_users_list,
    go_to_main: go_to_main,
    choose_user: choose_user,
    check_new_msgs: check_new_msgs,
    recivedMsgFromUser: recivedMsgFromUser,
    shift_left: shift_left,
    shift_right: shift_right
}

const TIMEOUT_AFTER_LAST_ACTION = 20
const instances = require('../../instances')
const userBot = instances.userBot
const c = console.log
const USERS_ON_ONE_PAGE = 9

function recivedMsgFromUser(id, type, body) {
    return (user) => {
        if (user.currentUser && user.currentUser.id == id) {
            _cleareNewFromAllMessagesByUserId(user.currentUser.id)
            _sendMsgByType(user, type, body)
        } else {
            user.newMsg = true
            user.save()
        }
    }
}

function check_new_msgs(user) {
    let now = new Date().getTime()
    if (user.waiting && user.newMsg && ((now - user.lastAction) > TIMEOUT_AFTER_LAST_ACTION * 1000)) {
        user.waiting = false
        user.newMsg = false
        user.unreadMsgs = true
        user.done('Новое сообщение от пользователя')
    }
}

function show_users_list(user, nextStep) {
    if (!user.groups)
        userBot.getUsersInfo(['id', 'name', 'messages'], (infoUsers) => {
            user.unreadMsgs = false
            let newMessages = infoUsers.filter(us => {
                for (let msg of us.messages)
                    if (!msg.curator && msg.new) {
                        us.new = true
                        return true
                    }
                return false
            })
            let oldMessages = infoUsers.filter(us => {
                for (let msg of us.messages)
                    if (!msg.curator && msg.new)
                        return false
                return true
            })
            newMessages.sort((b, a) => {
                if (!a.messages.length || !b.messages.length)
                    return -1
                return a.messages[a.messages.length - 1].datetime - b.messages[b.messages.length - 1].datetime
            })
            oldMessages.sort((b, a) => {
                if (!a.messages.length || !b.messages.length)
                    return -1
                return a.messages[a.messages.length - 1].datetime - b.messages[b.messages.length - 1].datetime
            })
            let total = newMessages.concat(oldMessages)
            user.groups = []
            let groupNum = 0
            let i = 0
            while (i < total.length) {
                if (!user.groups[groupNum])
                    user.groups[groupNum] = []
                user.groups[groupNum].push(total[i])
                i++
                if (i % USERS_ON_ONE_PAGE == 0)
                    groupNum++
            }
            user.curGroup = 0
            _show_dialogs_list(user)
        })
    else
        _show_dialogs_list(user)
}
function _show_dialogs_list(user) {
    let keyboard = []
    if (!user.groups.length) {
        user.send('Нет ни одного пользователя')
        return
    }
    for (let o of user.groups[user.curGroup]) {
        if (user.currentUser && user.currentUser.id == o.id) {
            delete o.new
            delete user.currentUser
        }
        keyboard.push(`${o.id}:${o.new ? '🔴 ' : ''} ${o.name ? o.name : '🙂'}`)
    }

    keyboard = keyboard.r3()
    if (user.curGroup == 0 && !user.groups[user.curGroup + 1])
        keyboard.push(['⬅️'])
    else if (user.curGroup == 0)
        keyboard.push(['⬅️', '>'])
    else if (user.curGroup == user.groups.length - 1)
        keyboard.push(['<', '⬅️'])
    else
        keyboard.push(['<', '⬅️', '>'])
    user.addKeyboard(keyboard)
    user.done(`${user.curGroup + 1}/${user.groups.length}`)
}

function go_to_main(user, nextStep) {
    user.state = 'main'
    delete user.groups
    delete user.curGroup
    nextStep(user)
}

function shift_left(user, nextStep) {
    if (user.curGroup != 0)
        user.curGroup--
    nextStep(user)
}

function shift_right(user, nextStep) {
    if (user.curGroup < user.groups.length - 1)
        user.curGroup++
    nextStep(user)
}

function choose_user(user, nextStep) {
    user.state = 'current_dialog'
    user.currentUser = {
        id: user.input.body.split(':')[0],
        name: user.input.body.split(':')[1].replace('🔴 ', '')
    }
    userBot.getUserById(user.currentUser.id, (client) => {
        let history = JSON.parse(JSON.stringify(client.messages))
        for (let msg of client.messages)
            if (!msg.curator)
                delete msg.new

        client.save()
        user.addMessage('История:')
        let text = ''
        for (let msg of history) {
            let neww = msg.new ? '🔴 ' : ''
            let avatar = msg.curator ? `🎓 ${msg.curator}:` : '🙂:'
            if (msg.type == 'text') {
                let usersData = client.insertAttrs(msg.body)
                msg.body = usersData ? usersData : msg.body
                text += neww + avatar + ' ' + msg.body + '\n'
            }
            if (msg.type == 'image' && !msg.new)
                text += neww + avatar + ' 🏞\n'
            if (msg.type == 'audio' && !msg.new)
                text += neww + avatar + ' ▶️\n'
            if (msg.type != 'text' && msg.new) {
                user.addMessage(text)
                text = ''
                _sendMedia(user, msg.type, msg.body)
            }
        }
        if (text)
            user.addMessage(text)
        user.addKeyboard([['⬅️']])
        user.state = 'dialogs_current'
        user.done()
        nextStep(user)
    })
}
function _sendMedia(user, type, body) {
    if (type == 'image')
        user.addImage(body)
    if (type == 'audio')
        user.addAudio(body)

}


function _cleareNewFromAllMessagesByUserId(id) {
    userBot.getUserById(id, (client) => {
        for (let msg of client.messages)
            delete msg.new
        client.save()
    })
}

function _sendMsgByType(user, type, body) {
    if (type == 'text')
        user.send(body) //TO DO добавить другие типы
    if (type == 'audio')
        user.sendAudio(body)
    if (type == 'image')
        user.sendImage(body)
}