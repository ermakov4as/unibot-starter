module.exports = {
    show_next_task: show_next_task,
    go_to_lessons_list: go_to_lessons_list,
    get_mark: get_mark
}

const instances = require('../../instances')
const Threads = require('./chk_Threads')
const serv = instances.server

function show_next_task(user, nextStep) {
    if (!user.tasks.length) {
        user.addMessage('Практика урока проверена👍')
        user.state = 'chk_lesson_list'
        user.Fsx()
        return
    }
    let t = new Threads(user.trds.data)
    user.addMessage(`Пользователь: ${user.tasks[0].hlebName}\nЗадание: ${user.tasks[0].desc}`)
    if (user.tasks[0].image)
        user.addImage(user.tasks[0].image)
    user.addMessage(`Построенное предложение:\n${user.tasks[0].en}`)
    if (user.tasks[0].aen)
        user.addAudio(user.tasks[0].aen)
    else
        user.addMessage(`Озвучки нет`)
    user.addKeyboard([['1', '2', '3', '4', '5'], ['6', '7', '8', '9', '10'], ['⬅️']])
    user.done('Оцените работу')
}

function go_to_lessons_list(user, nextStep) {
    user.state = 'chk_lesson_list'
    delete user.tasks
    nextStep(user)
}

function get_mark(user, nextStep) {
    if (Number.isInteger(parseInt(user.input.body))) {
        user.tasks[0].mark = parseInt(user.input.body)
        user.state = 'chk_put_comment'
    }
    nextStep(user)
}
