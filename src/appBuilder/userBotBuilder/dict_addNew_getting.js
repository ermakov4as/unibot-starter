module.exports = {
    field_defenition: field_defenition,
    go_to_dict_addNew: go_to_dict_addNew,
    get_field: get_field
}

function field_defenition(user) {
    user.addKeyboard([['⬅️']])
    if (user.newPrhase.type == 'en')
        if (!user.newPrhase.en)
            user.done('🇬🇧 Введите фразу на английском')
        else
            user.done(`📣🇬🇧 Озвучьте: «${user.newPrhase.en}»`)

    if (user.newPrhase.type == 'ru')
        if (!user.newPrhase.ru)
            user.done('🇷🇺 Введите фразу на русском')
        else
            user.done(`📣🇷🇺 Озвучьте: «${user.newPrhase.ru}»`)

}

function go_to_dict_addNew(user, nextStep) {
    user.state = 'dict_addNew'
    nextStep(user)
}

function get_field(user, nextStep) {
    if (user.newPrhase.type == 'en')
        if (user.newPrhase.en)
            user.newPrhase.aen = user.input.body
        else
            user.newPrhase.en = user.input.body
    if (user.newPrhase.type == 'ru')
        if (user.newPrhase.ru)
            user.newPrhase.aru = user.input.body
        else
            user.newPrhase.ru = user.input.body
    user.state = 'dict_addNew'
    nextStep(user)
}
