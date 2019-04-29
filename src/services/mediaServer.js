const request = require('request')

module.exports = class MediaServer {
    constructor(conf) {
        this.host = conf.host
    }

    getNewUrl(type, oldUrl, callback) {
        let option = {}
        option["json"] = {
            url: oldUrl
        }
        let url = this.host + '/' + type
        request.post(url, option, (error, response, body) => {
            if (!body || !body.url) {
                callback(false)
                return
            }
            callback(body.url)
        })
    }
}


