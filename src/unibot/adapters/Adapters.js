const express = require("express")
const fs = require("fs")
const path = require('path')
const Telegram = require('./Telegram')

module.exports = class Adapters {
    constructor(conf, unibot) {
        this.unibot = unibot;
        this.adapters = {}
        if ('tg' in conf.adapters)
            this.adapters.tg = new Telegram(conf.adapters.tg, 'tg', unibot, conf.host, conf.mediaPort);
        if ('vk' in conf.adapters)
            this.adapters.vk = new Telegram(conf.adapters.vk, 'vk', unibot, conf.host, conf.mediaPort);
        this.web = express();
        this.web.use(express.json());
        this.port = conf.mediaPort
        return this
    }

    run() {
        for (let i in this.adapters)
            this.adapters[i].run()
        
        // this.web.get('/image/:file', (req, res) => {
        //     const media_path = __dirname + '/temp_media/image'
        //     const fullPath = path.join(media_path, req.params.file)
        //     res.type(req.params.file.slice((req.params.file.lastIndexOf(".") - 1 >>> 0) + 2))
        //     res.sendFile(fullPath)
        // })

        // this.web.listen(this.port, '0.0.0.0', () => console.log(`Медиа сервер запущен на порту ${this.port}!`))
    }

    applyOutResult(adapter, outResult, callback) {
        // Удаляем сообщения, если clearMessages не пустой
        if (outResult.clearMessages && outResult.clearMessages.length) {
            const clearMessages = [];
            outResult.clearMessages.forEach(message_id => {
                this.adapters[adapter].delete(Number(outResult.local_id),
                    Number(message_id),
                    (res => {
                        if (res)
                            clearMessages.push(message_id)
                    }))
            });
            outResult.clearMessages = clearMessages;
        }
        // Отправляем данные пользователю в соответсвующий адаптер из outResult (описан в ALL.js => outResult)
        this.adapters[adapter].sendOutputs(outResult, callback)
    }
}
