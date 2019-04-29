module.exports = {
    getting_messages: getting_messages,
    save_msg_and_send_notify_to_curator: save_msg_and_send_notify_to_curator,
    go_to_main: go_to_main,
    checking_new_messages: checking_new_messages
}

const t4 = require('./../../instances').time4
const curBot = require('../../instances').curatorBot
const cbb = require('../curatorBotBuilder')
const c = console.log

const DELAY_FROM_NEW_MSG = 3 //В секундах

function checking_new_messages(user, nextStep) {
    if (!user.newMsg) {
        let now = new Date().getTime()
        if (_newMsgsFromCurator(user) && user.ntf && ((now - user.ntf.lastAction) > DELAY_FROM_NEW_MSG * 1000)) {
            user.newMsg = true
            if (user.state == 'main') {
                user.addMessage('Новое сообщение от куратора')
                nextStep(user)
            } else if (user.state != 'dialog') {
                user.send('Новое сообщение от куратора')
                user.save()
            }
        }
    }
}

function _newMsgsFromCurator(user) {
    if (user.messages)
        for (msg of user.messages)
            if (msg.new && msg.curator)
                return true
    return false
}

function getting_messages(user) {
    if (t4.today() > 1)
        user.addKeyboard([
            ['⬅️']
        ])
    else
        user.removeKeyboard()
    if (user.justReg) {
        delete user.justReg
        user.done()
        return
    }
    _show_new_msgs(user)
    user.done()
}

function save_msg_and_send_notify_to_curator(user) {
    if (user.input.type == 'text') {
        user.input.body = user.input.body.replaceAll('_', '\\_')
        user.input.body = user.input.body.replaceAll('\\\*', '\\*')
        user.input.body = user.input.body.replaceAll('`', '\\`')
        user.input.body = user.input.body.replaceAll('\\\[', '\\[')
        user.input.body = user.input.body.replaceAll('\\\]', '\]')
    }
    user.messages.push({
        type: user.input.type,
        body: user.input.body,
        datetime: new Date().getTime(),
        new: true
    })
    user.save()
    curBot.applyToEveryOne(cbb.dialogs.recivedMsgFromUser(user.id, user.input.type, user.input.body))
}


function go_to_main(user, nextStep) {
    user.state = 'main'
    nextStep(user)
}

function _show_new_msgs(user) {
    let new_msgs = _get_new_msgs(user)
    if (!new_msgs.length && !user.outputs.length) {
        user.addMessage('Чем могу помочь?')
        return
    } else {
        if (!user.outputs.length)
            user.addMessage('Непрочитанные сообщения:\n')
        for (let msg of new_msgs) {
            if (msg.type == 'text') {
                let chunk = msg.body
                msg.body = user.insertAttrs(msg.body)
                if (msg.body)
                    user.addMessage(msg.body)
                else
                    console.error(`\n\n\nERROR:\nПользователь ${user.name} (${user.id}) не получил сообщение: «${chunk}», потому что нет каких-то аттрибутов\n\n\n`)
            }
            if (msg.type == 'audio')
                user.addAudio(msg.body)
            if (msg.type == 'video')
                user.addVideo(msg.body)
            if (msg.type == 'image')
                user.addImage(msg.body)
            if (msg.type == 'file')
                user.addFile(msg.body)
        }
    }
}

function _get_new_msgs(user) {
    let res = []
    for (msg of user.messages) {
        if (msg.new && msg.curator) {
            delete msg.new
            res.push(JSON.parse(JSON.stringify(msg)))
        }

    }
    return res
}