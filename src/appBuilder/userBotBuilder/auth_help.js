module.exports = {
    show_btn_autorize_if_first_time: show_btn_autorize_if_first_time,
    go_to_autorization: go_to_autorization,
    go_to_main: go_to_main
}

const c = console.log

function show_btn_autorize_if_first_time(user) {
    if(user.helpMe){
        delete user.helpMe
        if(user.key)
            user.addKeyboard([['⬅️']])
        user.done('Чем могу помочь?')
        return
    }
    if (!user.firstTime)
        user.addKeyboard([['Авторизация 🔑']])
    user.done()
}

function go_to_autorization(user, nextStep) {
    user.state = 'auth_autorization'
    nextStep(user)
}

function go_to_main(user, nextStep){
    user.state = 'main'
    nextStep(user)
}