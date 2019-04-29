module.exports = {
    give_comment_or_save: give_comment_or_save,
    go_to_put_mark: go_to_put_mark,
    recive_comment: recive_comment,
    save_task: save_task
}

const instances = require('../../instances')
const Threads = require('./chk_Threads')
const serv = instances.server

function give_comment_or_save(user) {
    user.addKeyboard([['⬅️', '✅']])
    user.done(`Ваша оценка: ${user.tasks[0].mark}\nМожете оставить свой комментарий`)
}

function go_to_put_mark(user, nextStep) {
    user.state = 'chk_put_mark'
    delete user.tasks[0].comment
    delete user.tasks[0].mark
    nextStep(user)
}

function recive_comment(user, nextStep) {
    user.tasks[0].comment = user.input.body
    user.send('Принято')
}

function save_task(user, nextStep) {
    let data = {
        id_attempt: user.tasks[0].id,
        mark: user.tasks[0].mark,
        key: user.key,
        comment: user.tasks[0].comment ? user.tasks[0].comment : ''
    }
    serv.putHomework(data, (response) => {
        let t = new Threads(user.trds.data)
        t.killAttempt(user.tasks[0].id)
        user.trds.data = t.d
        user.tasks.shift()
        user.state = 'chk_put_mark'
        nextStep(user)
    })

}