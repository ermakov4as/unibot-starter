module.exports = {
    set_poll: set_poll,
    recive_poll_by_steps: recive_poll_by_steps
}
const c = console.log

function set_poll(user) {
    if (!user.first_messages) {
        user.first_messages = [
            'Как я могу к тебе обращаться?',
            `<name>, расскажи в двух-трех словах, для чего бы тебе мог пригодиться английский язык`,
            'Приходилось ли ранее учить язык и какие есть результаты?',
            'В какое время тебе будет удобнее всего заниматься?'
        ]
        user.num_answer = 0
        user.removeKeyboard()
    }
    let msg = user.first_messages[user.num_answer]
    msg = user.insertAttrs(msg)
    user.messages.push({
        type: 'text',
        body: msg,
        datetime: new Date().getTime(),
        curator: 'AUTO'
    })
    user.done(msg)
}
function recive_poll_by_steps(user, nextStep) {
    if (user.num_answer == 0)
        user.name = user.input.body
    user.num_answer++
    if (!user.first_messages[user.num_answer]) {
        delete user.first_messages
        delete user.num_answer
        user.firstTime = true
        user.state = 'auth_help'
        user.addMessage('Благодарю за ответы! Отпишусь немного позже👌')
    }
    nextStep(user)
}