module.exports = {
    save_msg_and_send_notify_to_curator: save_msg_and_send_notify_to_curator,
    checking_new_messages: checking_new_messages
}

const curBot = require('../../instances').curatorBot
const cbb = require('../curatorBotBuilder')
const c = console.log

const DELAY_FROM_NEW_MSG = 5 //В секундах

function checking_new_messages(user, nextStep) {
    if (user.newMsg) {
        let now = new Date().getTime()
        if (_newMsgsFromCurator(user) && user.ntf && ((now - user.ntf.lastAction) > DELAY_FROM_NEW_MSG * 1000)) {
            _show_new_msgs(user)
            user.state = 'main'
            user.newMsg = false
            nextStep(user)
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

function _show_new_msgs(user) {
    let new_msgs = _get_new_msgs(user)
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