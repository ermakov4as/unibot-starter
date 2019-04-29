const c = console.log

module.exports = class Threads {
    constructor(data) {
        this.d = data
    }
    threads() {
        let res = []
        for (let thread of this.d) {
            let o = {
                name: thread.name,
                count: 0
            }
            for (let lesson of thread.lessons)
                for (let task of lesson.tasks)
                    for (let attempt of task.attempts)
                        if (attempt && !attempt.checked)
                            o.count++
            if (o.count)
                res.push(o.name + `[${o.count}]`)
        }
        return res
    }
    threadNum(name) {
        for (let i in this.d)
            if (this.d[i].name == name)
                return i
        return -1
    }
    lessons(threadName) {
        for (let thread of this.d) {
            if (thread.name == threadName) {
                let res = []
                for (let lesson of thread.lessons) {
                    let o = {
                        name: lesson.name,
                        count: 0
                    }
                    for (let task of lesson.tasks)
                        for (let attempt of task.attempts)
                            if (attempt && !attempt.checked)
                                o.count++
                    if (o.count)
                        res.push(o.name + `[${o.count}]`)
                }
                return res
            }
        }
        return []
    }
    tasks(threadName, lessonName) {
        for (let thread of this.d)
            if (thread.name == threadName)
                for (let lesson of thread.lessons)
                    if (lesson.name == lessonName) {
                        let res = []
                        for (let task of lesson.tasks)
                            for (let attempt of task.attempts)
                                if (attempt && !attempt.checked) {
                                    res.push({
                                        id: attempt.id,
                                        desc: task.description,
                                        image: task.image_url,
                                        hlebName: attempt.name,
                                        en: attempt.question,
                                        aen: attempt.question_audio,
                                    })
                                }
                        return res
                    }
        return []
    }
    killAttempt(id) {
        for (let thread of this.d)
            for (let lesson of thread.lessons)
                for (let task of lesson.tasks)
                    for (let i in task.attempts)
                        if (task.attempts[i] && task.attempts[i].id == id) {
                            delete task.attempts[i]
                        }
    }
}
