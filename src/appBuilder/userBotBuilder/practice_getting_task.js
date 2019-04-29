module.exports = {
    get_next_task_in_lesson: get_next_task_in_lesson,
    go_to_practice_lessons: go_to_practice_lessons,
    get_en_text: get_en_text,
    save_task: save_task,
    get_audio_and_save: get_audio_and_save
}

const instances = require('../../instances')
const serv = instances.server
c = console.log

function get_next_task_in_lesson(user) {
    if (user.task)
        _get_sound_state(user)
    else
        _get_new_task(user)
}

function go_to_practice_lessons(user, nextStep) {
    delete user.curNumLesson
    delete user.task
    user.state = 'practice_lessons'
    nextStep(user)
}


function get_en_text(user, nextStep) {
    user.task.en_text = user.input.body
    nextStep(user)
}

function save_task(user, nextStep) {
    let lesson_id = user.lessons[user.curNumLesson].id
    let data = {
        "key": user.key,
        "homework_id": lesson_id,
        "task_id": user.task.scheme.task.id,
        "question": user.task.en_text
    }
    if (user.task.audio)
        data['audio'] = user.task.audio
    serv.postHomeworkTask(data, (response) => {
        delete user.task
        user.addMessage('✅Сохранено')
        nextStep(user)
    })
}

function get_audio_and_save(user, nextStep) {
    if (!user.task.en_text)
        nextStep(user)
    else {
        user.task.audio = user.input.body
        save_task(user, nextStep)
    }
}


function _get_sound_state(user) {
    user.addKeyboard([['Пропустить озвучку'], ['⬅️']])
    user.done('📣Озвучь предложение (больше баллов)')
}

function _get_new_task(user) {
    let lesson_id = user.lessons[user.curNumLesson].id
    serv.getHomeworkById({ key: user.key, id: lesson_id }, (res) => {
        if (res.schemes.length) {

            let schemes = []
            for (let scheme of res.schemes)
                if (scheme.count - scheme.attempts_count + scheme.rejected > 0)
                    schemes.push(scheme)
            let task = { scheme: schemes[Math.floor(Math.random() * schemes.length)] }
            if (task.scheme) {
                user.task = task
                user.addKeyboard([['⬅️']])
                user.addMessage(user.task.scheme.task.description)
                if (user.task.scheme.task.image)
                    user.addImage(user.task.scheme.task.image)
                user.done()
                return
            }
        }
        delete user.curNumLesson
        if (user.state == 'practice_lessons')
            user.done('Задания этого урока выполнены')
        else {
            user.addMessage('Все задания урока выполнены 🙌')
            user.state = 'main'
            user.Fsx()
        }

    })
}