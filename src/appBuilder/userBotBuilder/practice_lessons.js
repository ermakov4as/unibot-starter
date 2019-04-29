module.exports = {
    get_lessons: get_lessons,
    go_to_main: go_to_main,
    go_to_practice_getting_task: go_to_practice_getting_task
}

const instances = require('../../instances')
const serv = instances.server
c = console.log

function get_lessons(user) {
    serv.getHomeworkList({ key: user.key }, (lessons) => {
        if (lessons) {
            lessons.sort((a, b) => a.lesson_name > b.lesson_name ? 1 : -1)
            user.lessons = lessons
            let keyboard = _get_lessons_keyboard(lessons)
            keyboard.push(['⬅️'])
            user.addKeyboard(keyboard)
            user.done(`Выберите урок`)
        }
    })
}

function go_to_main(user, nextStep) {
    delete user.listOfLessons
    user.state = 'main'
    nextStep(user)
}

function go_to_practice_getting_task(user, nextStep) {
    user.curNumLesson = Number(user.input.body.split(' ')[1])-1
    user.state = 'practice_getting_task'
    nextStep(user)
}

function _get_lessons_keyboard(lessons) {
    let result = []
    for (let l of lessons) {
        let count = l.done == l.required ? '✅' : `(${l.required-l.done})`
        let name = /Урок \d*/.exec(l.lesson_name)[0]
        result.push(`${name} ${count}`)
    }
    return result.r3()
}