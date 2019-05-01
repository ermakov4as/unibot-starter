const request = require('request')
const API = require('./API')
c = console.log

module.exports = class Server {
    constructor(host) {
        this.host = host
    }

    autorize(data, callback) {
        let thisAction = 'autorize'
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'data': { "token": data.token },
            'error': "Регистрация пользователя не прошла."
        }, callback)
    }

    getInfoUser(data, callback) {
        this._stdGetFunc('getInfoUser', data.key, "Ошбика при получении информации о пользователе.", callback)
    }

    getHomeworkList(data, callback) {
        this._stdGetFunc('getHomeworkList', data.key, "Ошбика при получении списка уроков домашнего задания.", callback)
    }

    getSelfVoiceArray(data, callback) {
        this._stdGetFunc('getSelfVoiceArray', data.key, "Ошбика при получении файлика для самоозвучивания.", callback)
    }

    getDictByType(data, callback) {
        let thisAction = 'getDictByType'
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'params': { 'type': data.type },
            'key': data.key,
            'error': `Ошбика при получении типа «${data.type}» объекта словаря.`
        }, callback)
    }

    getHomeworkById(data, callback) {
        let thisAction = 'getHomeworkById'
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'params': { 'lesson_id': data.id },
            'key': data.key,
            'error': "Ошбика при получении домашнего задания по id."
        }, callback)
    }

    postHomeworkTask(data, callback) {
        let thisAction = 'postHomeworkTask'
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'data': {
                "homework_id": data.homework_id,
                "task_id": data.task_id,
                "question": data.question,
                "audio": data.audio
            },
            'key': data.key,
            'error': "Ошбика ошибка сохранения домашнего задания."
        }, callback)
    }

    postDict(data, callback) {
        let thisAction = 'postDict'
        let d = {
            "question": data.question,
            "question_audio": data.question_audio,
            "answer": data.answer,
            "answer_audio": data.answer_audio
        }
        if (data.toParse)
            d['analysis_state'] = 'requested'
        if (data.toSound)
            d['voice_state'] = 'requested'
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'data': d,
            'key': data.key,
            'error': "Ошбика ошибка сохранения домашнего задания."
        }, callback)
    }

    postAddPhrases(data, callback) {
        this._giveMeServerPleaseResult({
            'action': 'postAddPhrases',
            'data': { 'lesson_num': data.lesson_num },
            'key': data.key,
            'error': "Ошбика ошибка сохранения домашнего задания."
        }, callback)
    }

    getGenerateAAM(data, callback) {
        let option = {}
        if (data.key) {
            option['auth'] = { "bearer": data.key }
        }
        let req = {
            state: data.type,
            generation: data.count,
            order: []
        }
        for (let state of data.order) {
            if ('en' in state)
                req.order.push({
                    type: 'question',
                    delay: state.en
                })
            else
                req.order.push({
                    type: 'answer',
                    delay: state.ru
                })
        }
        option['json'] = req
        let path = API['getGenerateAAM'].path
        request.get(this.host + path, option, (error, response, body) => {
            if (200 == response.statusCode)
                callback(body.url)
            else{
                c(`server response error (${response.statusCode})`)
                c('Option:' + JSON.stringify(option, false, 2))
                c('Body response:' + JSON.stringify(body, false, 2))
                callback(false)
            }
                
        })
    }

    putSelfVoice(data, callback) {
        let thisAction = 'putSelfVoice'
        let req = { id: data.id }
        if (data.field == 'en')
            req['question_audio'] = data.audio
        else if (data.field == 'ru')
            req['answer_audio'] = data.audio
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'data': req,
            'key': data.key,
            'error': "Ошбика ошибка сохранения самоозвученного предложения."
        }, callback)
    }

    putNextStateDict(data, callback) {
        let thisAction = 'putNextStateDict'
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'data': {
                "id": data.id_unit,
            },
            'key': data.key,
            'error': "Ошбика putNextStateDict."
        }, callback)
    }

    getDictInfo(data, callback) {
        this._stdGetFunc('getDictInfo', data.key, "Ошбика при получении информации о словаре пользователя.", callback)
    }

    getDictRandom(data, callback) {
        this._stdGetFunc('getDictRandom', data.key, "Ошбика при получении рандомного предложения из словаря.", callback)
    }

    getGeometricScheme(data, callback) { // TODO:
        callback({ img: 'https://almanac-media.s3.amazonaws.com/media/public/images/Screen_Shot_2019-03-12_at_09.05.48.png' })
    }

    /*getAAM(data, callback) { // TODO:
        //callback({ img: 'https://almanac-media.s3.amazonaws.com/media/public/images/Screen_Shot_2019-03-12_at_09.05.48.png' })
    }*/

    ////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////               БОТ КУРАТОРА                ////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////

    registration(data, callback) {
        let thisAction = 'registration'
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'data': data,
            'key': data.key,
            'error': "registration"
        }, callback)
    }

    getCuratorInfo(data, callback) {
        this._stdGetFunc('getCuratorInfo', data.key, "Нахуй ненужное поле", callback)
    }

    getAnalysisRequests(data, callback) {
        this._stdGetFunc('getAnalysisRequests', data.key, "Нахуй ненужное поле", callback)
    }

    getVoiceRequests(data, callback) {
        this._stdGetFunc('getVoiceRequests', data.key, "Нахуй ненужное поле", callback)
    }
    getVoiceRequestsAAM(data, callback) {
        this._stdGetFunc('getVoiceRequestsAAM', data.key, "Нахуй ненужное поле", callback)
    }

    getHomeworkForCurator(data, callback) {
        this._stdGetFunc('getHomeworkForCurator', data.key, "Нахуй ненужное поле", callback)
    }

    putVoiceRequestAAM(data, callback) {
        this._giveMeServerPleaseResult({
            'action': 'putVoiceRequestAAM',
            'data': {
                "queue_id": data.queue_id,
                "audio": data.audio
            },
            'key': data.key,
            'error': "asdfsdfasdfasdf."
        }, callback)
    }

    putHomework(data, callback) {
        this._giveMeServerPleaseResult({
            'action': 'putHomework',
            'data': {
                "id": data.id_attempt,
                "result": data.mark,
                "comment": data.comment
            },
            'key': data.key,
            'error': "asdfsdfasdfasdf."
        }, callback)
    }

    putAnalysisRequests(data, callback) {
        let req = {
            id: data.id,
            comment: data.comment
        }
        if (data.en)
            req.question = data.en
        if (data.ru)
            req.answer = data.ru
        if (data.aen)
            req.question_audio = data.aen
        if (data.aru)
            req.answer_audio = data.aru
        this._giveMeServerPleaseResult({
            'action': 'putAnalysisRequests',
            'data': req,
            'key': data.key,
            'error': "Ошбика putNextStateDict."
        }, callback)
    }

    putVoiceRequest(data, callback) {
        this._giveMeServerPleaseResult({
            'action': 'putVoiceRequest',
            'data': {
                "id": data.id_request,
                "field": data.field,
                "audio": data.audio
            },
            'key': data.key,
            'error': "Ошбика putNextStateDict."
        }, callback)
    }

    putRename(data, callback) {
        this._giveMeServerPleaseResult({
            'action': 'putRename',
            'data': {
                "id": data.id,
                "nickname": data.globalName
            },
            'key': data.key,
            'error': "Ошбика putNextStateDict."
        }, callback)
    }

    /////////////////////////////////////////////////////////////////////////////
    ///////////                 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ               ///////////
    /////////////////////////////////////////////////////////////////////////////
    _stdGetFunc(thisAction, key, err, callback) {
        this._giveMeServerPleaseResult({
            'action': thisAction,
            'key': key,
            'error': err
        }, callback)
    }

    _giveMeServerPleaseResult(settings, callback) {
        //////////////////////////////////////////////////////////////////////////////////////
        // params = {                                                                       //
        //     'action': 'autorize',                    Название функции для связи с API    //
        //     'key': 'sdfwiornv8w9f8h3w8hf8w9h',       Если автризован                     //
        //     'data': { "attr": value },              Передаваемые данные(post, put)       //
        //     'params': {                              параметры, заменяемые в url         //
        //         'lesson_id': 'номер передаем'                                            //
        //     },                                                                           //
        //     'error': "Регистрация пользователя не прошла"                                //
        // }                                                                                //
        //////////////////////////////////////////////////////////////////////////////////////
        let option = {}
            //Если авторизация пройдена (есть свойство key)
        if (settings.key) {
            option['auth'] = { "bearer": settings.key }
        }
        //Если есть свойство params, значит надо в пути заменить ключевые слова на конкретные занчения
        let path = API[settings.action].path
        if (settings.params) {
            for (let param in settings.params) {
                path = path.replace(`<${param}>`, settings.params[param])
            }
        }
        if (API[settings.action].type == "GET") {
            option["json"] = true
            request.get(this.host + path, option, (error, response, body) => {
                if (200 == response.statusCode)
                    callback(body)
                else {
                    c(API[settings.action].type + ':' + this.host + path)
                    c('JSON:' + JSON.stringify(option.json, false, 2))
                    c('response:' + JSON.stringify(response, false, 2))
                    callback(false)
                }
            })
        }
        if (API[settings.action].type == "POST") {
            //Установили передаваемые параметры
            option["json"] = settings.data
            request.post(this.host + path, option, (error, response, body) => {
                if (200 == response.statusCode)
                    callback(body)
                else {
                    c(body)
                    c(API[settings.action].type + ':' + this.host + path)
                    c('JSON:' + JSON.stringify(option.json, false, 2))
                    callback(false)
                }

            })
        }
        if (API[settings.action].type == "PUT") {
            //Установили передаваемые параметры
            option["json"] = settings.data
            request.put(this.host + path, option, (error, response, body) => {
                if (200 == response.statusCode)
                    callback(body)
                else {
                    c(body)
                    c(API[settings.action].type + ':' + this.host + path)
                    c('JSON:' + JSON.stringify(option.json, false, 2))
                    callback(false)
                }
            })
        }
    }

}

/////////////////////////////////////////////////////////////////
/////                   ПРИМЕРЫ                             /////
/////////////////////////////////////////////////////////////////
// key = '5a9deec7f50be240074e6ba5215190bb4c6428d0'
// serv.putNextStateDict({
//         "key": key,
//         "id_unit": 241,
//     },
//     (response) => {
//         c.d(response)
// })

// serv.putSelfVoice({
//         "key": key,
//         "id": 241,
//         "field": "question",
//         "audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3"
//     },
//     (response) => {
//         c.d(response)
// })

// serv.postDict({
//     "key": key,
//     "question": "New sentences",
//     "question_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3",
//     "answer": "Новое предложение",
//     "answer_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3"
// },
//     (response) => {
//         c.d(response)
//     }
// )

// serv.getNextSelfVoice({ key: key }, (response) => {
//     c.d(response)
// })

// ["text","sound","reversed","done"]
// serv.getDictByType({ key: key, type: 'text' }, (response) => {
//     c.d(response)
// })

// serv.getDictRandom({ key: key }, (response) => {
//     c.d(response)
// })

// serv.getDictInfo({ key: key }, (response) => {
//     c.d(response)
// })

// serv.postHomeworkTask({
//         "key": key,
//         "homework_id": 158,
//         "task_id": 28,
//         "question": "No pain no gain",
//         "audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3"
//     },
//     (response) => {
//         c.d(response)
//     }
// )

// serv.getHomeworkById({ key: key, id: 158 }, (response) => {
//     c.d(response)
// })

// serv.getHomeworkList({ key: key }, (response) => {
//     c.d(response)
// })
// serv.getInfoUser({ key: key }, (response) => {
//     c.d(response)
// })
// serv.autorize({ token: 'i99u6h' }, (response) => {
//     c.d(response)
// })