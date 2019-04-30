const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const Markup = require('telegraf/markup')
const conf = require('./../../../config/config')
const MediaServer = require('./../../services/mediaServer')
const medServ = new MediaServer(conf.services.mediaServer)

const c = console.log

module.exports = class _Telegram {
    constructor(token, adapterName, unibot, host, mediaServerFiles) {
        this.adapter = adapterName
        this.tlg = new Telegraf(token)
        this.telegram = new Telegram(token)

        this.unibot = unibot
        this.token = token
        this.host = host
        this.mediaServerFiles = mediaServerFiles
    }

    run() {
        this.tlg.on('message', (ctx) => {
            getInput(ctx.update)
        })

        this.tlg.action(/.*/, (ctx) => {
            getInput(ctx.update)
        })

        const getInput = (update) => {
            let input = {}
            if ('message' in update) {
                let input = {
                    'local_id': '' + update.message.from.id,
                    'adapter': this.adapter,
                    'message_id': '' + update.message.message_id
                }
                //ЕСЛИ ФАЙЛЫ
                if ('photo' in update.message) {
                    input['type'] = 'image'
                    input['file_id'] = '' + update.message.photo[update.message.photo.length - 1].file_id
                } else if ('video_note' in update.message) {
                    input['type'] = 'video'
                    input['file_id'] = '' + update.message.video_note.file_id
                } else if ('voice' in update.message) {
                    input['type'] = 'audio'
                    input['file_id'] = '' + update.message.voice.file_id
                } else if ('document' in update.message) {
                    input['type'] = 'file'
                    input['file_id'] = '' + update.message.document.file_id
                }
                if ('text' in update.message) {
                    if (update.message.entities && update.message.entities.filter(ent => ent.type === 'bot_command').length)
                        input['type'] = 'command'
                    else
                        input['type'] = 'text'
                    input['body'] = update.message.text
                    this.unibot.applyInput(input)
                } else {
                    this.telegram.getFileLink(input['file_id']).then((url) => {
                        input['body'] = url
                        this.unibot.applyInput(input)
                    })
                }

            } else if ('callback_query' in update && 'data' in update.callback_query) {
                input = {
                    'local_id': '' + update.callback_query.from.id,
                    'adapter': adapter,
                    'message_id': false,
                    'type': 'button',
                    'body': update.callback_query.data
                }
                this.unibot.applyInput(input)
            }
        }

        this.tlg.launch()
    }

    delete(chat_id, message_id, callback) {
        this.telegram.deleteMessage(chat_id, message_id).then(res => callback(res))
    }


    sendOutputs(outResult, callback) {
        if (!outResult.outputs.length && outResult.keyboard) {
            outResult.outputs = [{ 'type': 'text', 'body': ' ' }] // Нельзя отправить пустое сообщение отправляем пробел вместе с клавой
        }
        this.recursiveSending(outResult)
    }

    recursiveSending(outResult) {
        //Старт рекурсии
        if (!this.outResultAnswer) {
            this.outResultAnswer = JSON.parse(JSON.stringify(outResult)) // {...outResult}
            this.outResultAnswer.outputs = []
        }
        //Конец рекурсии
        if (outResult.outputs.length == 0)
            return
        //Шаг рекурсии
        let output = outResult.outputs.shift()
        this.outResultAnswer.outputs.push(output)
        if (output.type == 'text')
            this.telegram.sendMessage(outResult.local_id, output.body, this.addKeyboard(outResult.keyboard))
                .then((res) => {
                    output['message_id'] = res.message_id
                    this.recursiveSending(outResult)
                })
        else if (output.type == 'image') {
            if (output.body.indexOf(this.token) == -1) {
                medServ.getNewUrl('image', output.body, (newUrl) => {
                    output.body = newUrl
                    this.telegram.sendPhoto(outResult.local_id, output.body, this.addKeyboard(outResult.keyboard))
                        .then((res) => {
                            output['message_id'] = res.message_id
                            output['file_id'] = res.photo[res.photo.length - 1].file_id
                            this.recursiveSending(outResult)
                        })
                })
            } else {
                this.telegram.sendPhoto(outResult.local_id, output.file_id ? output.file_id : output.body, this.addKeyboard(outResult.keyboard))
                    .then((res) => {
                        output['message_id'] = res.message_id
                        output['file_id'] = res.photo[res.photo.length - 1].file_id
                        this.recursiveSending(outResult)
                    })
            }
        }
        else if (output.type == 'audio') {
            // ОШИБКА ЗДЕСЬ
            // if (hook) {
            //     const r = request(output.body)
            //     const tempFilePath = __dirname + '/temp_media/Voice_message.ogg'
            //     r.pipe(fs.createWriteStream(tempFilePath))
            //     this.telegram.sendVoice(outResult.local_id, {
            //         source: tempFilePath
            //     })
            //         .then((res) => {
            //             output['message_id'] = res.message_id
            //             this.recursiveSending(outResult)
            //         })
            // } else {
            this.telegram.sendVoice(outResult.local_id, output.file_id ? output.file_id : output.body)
                .then((res) => {
                    output['message_id'] = res.message_id
                    this.recursiveSending(outResult)
                })
            // }
        }
        else if (output.type == 'video')
            this.telegram.sendVideo(outResult.local_id, output.file_id ? output.file_id : output.body)
                .then((res) => {
                    output['message_id'] = res.message_id
                    //TO DO FILE ID
                    this.recursiveSending(outResult)
                })
        else if (output.type == 'file')
            this.telegram.sendDocument(outResult.local_id, output.file_id ? output.file_id : output.body)
                .then((res) => {
                    output['message_id'] = res.message_id
                    //TO DO FILE ID
                    this.recursiveSending(outResult)
                })
    }

    addKeyboard(keyboard) {
        if (keyboard)
            return Telegraf.Extra.markdown().markup((m) => m.keyboard(keyboard).resize())
        else
            return Telegraf.Extra.markdown().markup((m) => m.removeKeyboard(true))
    }
}