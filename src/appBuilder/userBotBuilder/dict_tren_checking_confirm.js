module.exports = {
    were_you_right,
    go_to_dict_tren,
    remeber_phrase_confirm,
    show_geometric_scheme
}

const instances = require('../../instances')
const serv = instances.server
const c = console.log

function were_you_right(user) {
    if (!user.trainDict) {
        user.state = 'main'
        user.Fsx()
        return
    }
    _were_you_right_output(user)
}

function _were_you_right_output(user) {
    user.addKeyboard([['ℹ', '❌ Нет', '✅ Да'], ['⬅️']])
    user.done('Всё верно?')
}


function remeber_phrase_confirm(doYouKnow) {
    if (doYouKnow)
        return (user, nextStep) => {
            if (!user.trainDict) {
                user.state = 'main'
                user.Fsx()
                return
            }
            let phrase = user.trainDict.phrase
            serv.putNextStateDict({ "key": user.key, "id_unit": phrase.id }, (res) => {
                user.addMessage(`Перенес на следующую стадию 👍`)
                if (user.ntf.fromNotify)
                    user.state = 'main'
                else {
                    user.ntf.fromNotify = false
                    user.state = 'dict_tren_checking'
                }
                nextStep(user)
            })
        }
    else
        return (user, nextStep) => {
            if (user.ntf.fromNotify)
                user.state = 'main'
            else {
                user.ntf.fromNotify = false
                user.state = 'dict_tren_checking'
            }
            nextStep(user)
        }
}

function go_to_dict_tren(user, nextStep) {
    user.state = 'dict_tren'
    delete user.trainDict
    nextStep(user)
}

function show_geometric_scheme(user, nextStep) {
    let phrase = user.trainDict.phrase
    let req = {
        "id": user.id,
        "key": user.key,
        "id_unit": phrase.id
    }
    serv.getGeometricScheme(req, res => {
        if (res) {
            let img = res.img
            user.addImage(img)
            user.send()
        }
    })
}