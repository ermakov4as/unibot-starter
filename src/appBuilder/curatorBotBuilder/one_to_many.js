module.exports = {
    show_tips_and_redy_to_mailing: show_tips_and_redy_to_mailing,
    go_home: go_home,
    send_to_everyone: send_to_everyone
}

const send_message_to_user_by_id = require('./dialogs_current').send_message_to_user_by_id
const userBot = require('./../../instances').userBot
const c = console.log

function show_tips_and_redy_to_mailing(user) {
    user.addKeyboard([['⬅️']])
    user.done('!!!ЭТО СООБЩЕНИЕ БУДЕТ ОТПРАВЛЕНО ВСЕМ ПОЛЬЗВАТЕЛЯМ!!!')
}

function go_home(user, nextStep) {
    user.state = 'main'
    nextStep(user)
}

function send_to_everyone(user, nextStep) {
    userBot.getUsersInfo(['id', 'key'], (clients) => {
        for (client of clients)
            if (client.key)
                send_message_to_user_by_id(user, client.id)
    })
}