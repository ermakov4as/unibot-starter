module.exports = {
    show_msg_and_you_are_first_time_or_not: show_msg_and_you_are_first_time_or_not,
    btn_Im_registered: btn_Im_registered,
    btn_first_time: btn_first_time
}

function show_msg_and_you_are_first_time_or_not(user, nextStep) {
    user.addMessage('Привет! Уже зарегистрирован(а) или первый раз?')
    user.addKeyboard([['Первый раз', 'Зарегистрирован(а)']])
    user.done()
}
function btn_Im_registered(user, nextStep) {
    user.state = 'auth_autorization'
    nextStep(user)
}
function btn_first_time(user, nextStep) {
    user.removeKeyboard()
    user.send('К сожалению, этот поток уже запущен.. Но могу записать тебя в следующий👌 Как мне к тебе обращаться?')
    user.state = 'auth_help'
    nextStep(user)
}