c = console.log


module.exports = class User {
    constructor(data, bot, input) {
        this.bot = bot
        for (let i in data)
            this[i] = data[i]
        this.input = input
        this.outputs = []
        this.attrs = {
            meta: ['bot', 'input', 'outputs', 'attrs', 'keyboard'],
            main: ['id', '__id', 'name', 'local_id', 'adapter_name', 'state']
        }
    }

    clean() {
        let saved_attrs = this.attrs.meta.concat(this.attrs.main)
        delete this.state
        for (let i in this)
            if (!(saved_attrs.indexOf(i) + 1))
                delete this[i]
    }

    delete() {
        this.bot.db.deleteUser(this.id)
        for (let i in this)
            delete this[i]
    }

    save() {
        let user = {}
        for (let i in this)
            if (!(this.attrs.meta.indexOf(i) + 1))
                user[i] = this[i]
        this.bot.db.saveUser(user)
    }

    send(msg) {
        if (this.keyboard === undefined)
            this.keyboard = [[]]
        if (msg)
            this.addMessage(msg)
        if (this.outputs.length) {
            this.bot.sendMessages(this.adapter_name, this.local_id, this.outputs, this.keyboard)
        }
        this.outputs = []
    }

    done(msg) {
        if (msg)
            this.addMessage(msg)
        this.send()
        this.save()
    }

    Fsx() {
        this.bot.states[this.state].Fsx(this)
    }

    addImage(body) {
        this.outputs.push({
            type: 'image',
            body: body
        })
    }
    sendImage(body) {
        this.addImage(body)
        this.bot.sendMessages(this.adapter_name, this.local_id, this.outputs, this.keyboard)
        this.outputs = []
    }

    addMessage(msg) {
        msg = msg.replaceAll('_', '\\_') //Против пидораса Телеграма
        if (msg)
            this.outputs.push({
                type: 'text',
                body: msg
            })
    }

    insertAttrs(msg) {
        if (msg)
            while (true) {
                let a = msg.indexOf('<') + 1
                let b = msg.indexOf('>')
                if (a && b + 1) {
                    let attr = msg.substring(a, b)
                    if (attr in this)
                        msg = msg.replace(`<${attr}>`, this[attr])
                    else
                        return false
                } else
                    break
            }
        return msg
    }

    addKeyboard(keyboard) {
        this.keyboard = keyboard
    }
    removeKeyboard() {
        this.keyboard = false
    }

    apply(type, body) {
        let input = {
            local_id: this.local_id,
            adapter: this.adapter_name,
            type: type,
            body: body
        }
        this.bot.applyInput(input)
    }

    addAudio(body) {
        this.outputs.push({
            type: 'audio',
            body: body
        })
    }
    sendAudio(body) {
        this.addAudio(body)
        this.bot.sendMessages(this.adapter_name, this.local_id, this.outputs, this.keyboard)
        this.outputs = []
    }

    ///////////////
    ///////////////
    ///////////////
    ///////////////

    addVideo(msg, file_id) {
        this.outputs.push({
            type: 'video',
            body: msg,
            file_id: file_id
        })
    }

    addFile(msg, file_id) {
        this.outputs.push({
            type: 'file',
            body: msg,
            file_id: file_id
        })
    }



    stop() {
        this.STOP = true
    }

    data() {
        let data = {}
        for (let i in this) {
            if (i != 'unibot')
                data[i] = this[i]
        }
        return data
    }

}