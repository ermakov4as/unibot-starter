const Adapters = require('./adapters')
const State = require('./State')
const User = require('./User')
const HookServ = require('./HookServ')

const DB = require('./DB')

const c = console.log

const GLOBAL_STATE = '_GLOBAL_'

module.exports = class UniBot {
    constructor(conf) {
        this.conf = conf
        this.data = conf.data
        this.adapters = new Adapters(this.conf, this)
        this.db = new DB(this.conf)
        this.states = {}
        this.states[GLOBAL_STATE] = new State(GLOBAL_STATE)
    }

    addState(stateName) {
        this.states[stateName] = new State(stateName)
        return this.states[stateName]
    }
    setGlobalHandler() {
        return this.states[GLOBAL_STATE]
    }

    applyInput(input) {
        this.db.getUserData(input.local_id, input.adapter, (userData) => {
            let user = new User(userData, this, input)
            this.states[GLOBAL_STATE].Fsx(user, (user) => {
                this.applyHsx(user, (user) => {
                    if (user.state in this.states) {
                        this.states[user.state].Fsx(user)
                    }
                })
            })
        })
    }

    applyHsx(user, nextStep) {
        let state_name = this.isGlobalInput(user.input) ? GLOBAL_STATE : user.state
        if (!state_name) {
            nextStep(user)
            return
        }
        let byBody = false
        let byType = false
        for (let action of this.states[state_name].actions) {
            if (action.type == user.input.type) {
                let isEqualString = typeof action.body == 'string' && action.body == user.input.body
                let isFitRegExp = (action.body instanceof RegExp) && !!action.body.exec(user.input.body)
                if (isEqualString || isFitRegExp)
                    byBody = action.Hsx
            }
            if (action.type == user.input.type && action.body === true) {
                byType = action.Hsx
            }
        }
        let Hsx = byBody || byType || ((user, nextStep) => nextStep(user))
        Hsx(user, (user) => nextStep(user))
    }

    getUserById(user_id, callback) {
        this.db.getUserDataById(user_id, data => callback(new User(data, this, false)))
    }

    setIntervalAction(seconds, Hsx) {
        seconds = seconds * 1000
        setInterval(() => {
            this.applyToEveryOne(Hsx)
        }, seconds)
    }

    applyToEveryOne(Hsx) {
        this.db.getDataOfAllUsers((users) => {
            for (let userData of users) {
                let user = new User(userData, this, false)
                Hsx(user, (user) => {
                    if (user.state in this.states) {
                        this.states[user.state].Fsx(user)
                    }
                })
            }
        })
    }

    //Отправляем аутпут на адаптер и получаем id-шники сообщений и файлов
    sendMessages(adapter_name, local_id, outputs, keyboard) {
        let outputsResult = {
            local_id: local_id,
            outputs: outputs,
        }
        if (keyboard)
            outputsResult['keyboard'] = keyboard
        this.db.applyIDtoFiles(adapter_name, outputs, (outputs) => {
            outputsResult.outputs = outputs
            outputsResult.outputs = this._cutLongMessages(outputs, 4096)
            this.adapters.applyOutResult(adapter_name, outputsResult, (res) => {
                if (res) {
                    this.db.saveMediaId(adapter_name, res.outputs)
                }
            })
        })
    }
    _cutLongMessages(outputs, maxLength) {
        let res = []
        for (let o of outputs)
            if (o.type == 'text' && o.body.length > maxLength) {
                let sentences = o.body.split('\n')
                let newMsg = ''
                for (let s of sentences) {
                    if ((newMsg.length + s.length + 1 < maxLength))
                        newMsg += s + '\n'
                    else if (newMsg) {
                        res.push({ type: 'text', body: newMsg })
                        newMsg = ''
                    }
                }
                res.push({ type: 'text', body: newMsg })
            }
            else
                res.push(o)
        return res
    }

    getUsersInfo(attrs, callback) {
        this.db.getUsersInfo(attrs, (users) => {
            callback(users)
        })
    }

    isGlobalInput(input) {
        for (let action of this.states[GLOBAL_STATE].actions)
            if (action.type == input.type && (action.body == input.body || action.body === true))
                return true
        return false
    }

    run() {
        this.adapters.run()
    }

    //Hook Module
    // hookServ() {
    //     return new HookServ(this.conf, this)
    // }


    // getStateDefault() {
    //     for (let i in this.states) {
    //         if (this.states[i].default)
    //             return this.states[i].name
    //     }
    // }


    // applyHookInput(data, hookHsx) {
    //     this.db.getUserDataById(data.id, (userData) => {
    //         let user = new User(userData, this)
    //         hookHsx(user, data, (user) => {
    //             user.nextState = user.nextState || user.currentState
    //             let Fsx = this.getFsx(user)
    //             Fsx(user, (user) => {
    //                 if (user.STOP)
    //                     return
    //                 this.sendOutResult(user, (user) => {
    //                     this.db.saveFullUser(user)
    //                 })
    //             })

    //         })

    //     })


    // }

}
