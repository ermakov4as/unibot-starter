module.exports = {
    get_lessons_list: get_lessons_list,
    go_to_thread_list: go_to_thread_list,
    choose_lesson: choose_lesson
}

const instances = require('../../instances')
const Threads = require('./chk_Threads')
const serv = instances.server

function get_lessons_list(user) {
    
    let t = new Threads(user.trds.data)
    if (!t.lessons(user.trds.data[user.trds.thread_num].name).length) {
        user.addMessage('Практика потока проверена👍')
        user.state = 'chk'
        user.Fsx()
        return
    }
    let keyboard = t.lessons(user.trds.data[user.trds.thread_num].name).r3()
    keyboard.push(['⬅️'])
    user.addKeyboard(keyboard)
    user.done('Укажите урок')
}

function go_to_thread_list(user, nextStep) {
    user.state = 'chk'
    delete user.trds.thread_num
    nextStep(user)
}

function choose_lesson(user, nextStep) {
    let t = new Threads(user.trds.data)
    user.tasks = t.tasks(user.trds.data[user.trds.thread_num].name, user.input.body.replace(/\[.*\]/, ''))
    user.state = 'chk_put_mark'
    nextStep(user)
}