module.exports = {
    get_history: get_history,
    go_to_users_list: go_to_users_list,
    send_message: send_message,
    send_message_to_user_by_id: send_message_to_user_by_id
}

const instances = require('../../instances')
const userBot = instances.userBot
const curBot = instances.curatorBot
const c = console.log

let SENDED = false

function get_history(user) {
    SENDED = false
    if (user.input.type != 'text' || user.input.type != 'image') {
        user.addMessage('Можно отправлять только текст или картинки')
        return
    }
}

function go_to_users_list(user, nextStep) {
    user.state = 'dialogs'
    nextStep(user)
}

function send_message(user) {
    send_message_to_user_by_id(user, user.currentUser.id)
}

function send_message_to_user_by_id(curator, user_id) {
    userBot.getUserById(user_id, (client) => {
        let msg = curator.input.body
        if (curator.input.type == 'text')
            msg = _telegtamFormat(msg)
        if (curator.input.type == 'text') {
            let chunk = msg
            msg = client.insertAttrs(msg)
            if (!msg && !SENDED) {
                curator.send(`Пользователь ${client.name} (${client.id}) не получил сообщение: «${chunk}», потому что нет каких-то аттрибутов\nВозможно таких людей больше! (сообщение не отправлено)`)
                SENDED = true
                return
            }
        }
        let newMsg = {
            type: curator.input.type,
            body: msg,
            datetime: new Date().getTime(),
            curator: curator.name
        }
        if (client.state == 'main')
            send_by_type(client, curator.input.type, msg)
        else
            client.newMsg = newMsg['new'] = true
        client.messages.push(newMsg)
        client.save()
        curBot.applyToEveryOne((otherCurator) => {
            if (otherCurator.id != curator.id && otherCurator.state == 'dialogs_current' && otherCurator.currentUser.id == client.id) {
                if (curator.input.type == 'text')
                    otherCurator.send('🎓 ' + curator.name + ': ' + msg)
                else {
                    otherCurator.addMessage('🎓 ' + curator.name + ': ')
                    send_by_type(otherCurator, curator.input.type, msg)
                }
            }
        })
    })
}


function send_by_type(user, type, body) {
    if (type == 'text')
        user.send(body)
    if (type == 'image') {
        user.sendImage(body)
    }
}


function _telegtamFormat(str) {
    // if ((str.split('_').length - 1) % 2)
    //     str = str.replaceAll('_', '\\_')
    if ((str.split('*').length - 1) % 2)
        str = str.replaceAll('\\\*', '\\*')
    if ((str.split('`').length - 1) % 2)
        str = str.replaceAll('`', '\\`')
    if (!((str.split(']').length == 2) && (str.split('[').length == 2) && str.indexOf('[') < str.indexOf(']'))) {
        str = str.replaceAll('\\\[', '\\[')
        str = str.replaceAll('\\\]', '\]')
    }
    return str
}