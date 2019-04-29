module.exports = {
    get_threads: get_threads,
    go_home: go_home,
    choose_thread: choose_thread
}

const instances = require('../../instances')
const Threads = require('./chk_Threads')
const serv = instances.server

function get_threads(user) {
    serv.getHomeworkForCurator({ key: user.key }, (response) => {
        user.trds = { data: response }
        let t = new Threads(user.trds.data)
        let keyboard = t.threads().r3()
        user.addKeyboard(keyboard)
        if (!t.threads().length) {
            user.addMessage('Все потоки проверены🙌')
            delete user.trds
            user.state = 'main'
            user.Fsx()
        } else {
            keyboard.push(['⬅️'])
            user.done('Поток:')
        }
    })
}

function go_home(user, nextStep) {
    user.state = 'main'
    delete user.trds
    nextStep(user)
}

function choose_thread(user, nextStep) {
    let t = new Threads(user.trds.data)
    let thread_num = t.threadNum(user.input.body.replace(/\[.*\]/, ''))
    if (thread_num + 1) {
        user.trds.thread_num = thread_num
        user.state = 'chk_lesson_list'
    }
    nextStep(user)
}
