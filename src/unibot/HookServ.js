const express = require("express");

module.exports = class HookServ {
    constructor(conf, unibot) {
        this.unibot = unibot
        this.port = conf.hookPort

        this.gets = {}
        this.posts = {}

        this.web = express()
        this.web.use(express.json())
        return this
    }

    getHook(path, callback) {
        this.web.get(path, (req, res) => {
            let data = req.params
            res.status(200)
            res.end()
            this.unibot.applyHookInput(data, callback)
        })
        return this
    }

    postHook(path, callback) {
        this.web.post(path, (req, res) => {
            let data = req.body
            let id = req.params.id
            data['id'] = id
            res.status(200)
            res.end()
            this.unibot.applyHookInput(data, callback)
        })
        return this
    }

    getHookAnswer(path, callback) {
        this.web.get(path, (req, res) => {
            let data = req.params
            callback(data.id, data, res)
        })
        return this
    }

    postHookAnswer(path, callback) {
        this.web.post(path, (req, res) => {
            let data = req.body
            let id = req.params.id
            data['id'] = id
            callback(id, data, res)
        })
        return this
    }

    start() {
        this.web.listen(this.port, () => console.log(`HookServ запущен на порту ${this.port}!`))
    }
}


// ///////////////////////////////////////////////////////////////////////////
// //////////////                   HOOKS                       //////////////
// ///////////////////////////////////////////////////////////////////////////
// curatorBot.hookServ().
//     postHook('/recive-msg/:id', (user, data, nextStep) => {
//         if (data.input.type == 'text') {
//             user.addMessage(`😳${data.name} (${data.user_id}): ${data.input.body}`)
//             nextStep(user)
//             return
//         }
//     }).
//     postHook('/alarm-url/:id', (user, data, nextStep) => {
//         user.addMessage(`Обрати внимание на действия пользователя ${data.msg}`)
//         nextStep(user)
//     }).
//     start()