module.exports = {
    show_practice_dict_and_dialog,
    go_to_practice_lessons,
    go_to_dialog,
    get_info,
    go_to_dict_tren
}

const c = console.log

function show_practice_dict_and_dialog(user) {
    if (!user.outputs.length)
        user.addMessage('Главная')
    user.addKeyboard([['Тренажёр 🚀', 'Аудирование 🎧'], ['Привычка 🔔', 'Справка ℹ️']])
    user.done()
}

function go_to_practice_lessons(user, nextStep) {
    user.state = 'practice_lessons'
    nextStep(user)
}

function go_to_dialog(user, nextStep) {
    user.newMsg = false
    user.state = 'dialog'
    nextStep(user)
}

function get_info(user, nextStep) {
    user.send('Это справка. Читайте. Читайте внимательно. Но если всё равно непонятно - пишите прямо здесь.')
}

function go_to_dict_tren(user, nextStep) {
    user.state = 'dict_tren'
    nextStep(user)
}