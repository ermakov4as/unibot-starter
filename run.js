const instances = require('./src/instances')
const userBot = instances.userBot
const curatorBot = instances.curatorBot

const ubb = require('./src/appBuilder/userBotBuilder')
const cbb = require('./src/appBuilder/curatorBotBuilder')

const c = console.log

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
//////////////                                               //////////////
//////////////              БОТ ПОЛЬЗОВАТЕЛЯ                 //////////////
//////////////                                               //////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

userBot.setIntervalAction(3, ubb.dict_regular_notification.check_last_action_and_send_phrase_from_dict)
userBot.setIntervalAction(2, ubb.dialog.checking_new_messages)

userBot.setGlobalHandler()
    .addFsx(ubb.global.set_last_action_and_ckeck_notify_settings)
    .onCommand('/logout', ubb.global.clean_and_say_bye)
    .onCommand('/start', ubb.global.start)
    .onCommand('/help', ubb.global.go_to_dialog)
    .onButton('🚪', (user) => { user.apply('command', '/start') })

///////////////////////////////////////////////////////////////////////////
//////////////                  AUTORIZATION                 //////////////
///////////////////////////////////////////////////////////////////////////
userBot.addState('auth_first')
    .addFsx(ubb.auth_first.show_msg_and_you_are_first_time_or_not)
    .onButton('Зарегистрирован(а)', ubb.auth_first.btn_Im_registered)
    .onButton('Первый раз', (user, nextStep) => {
        ubb.dialog.save_msg_and_send_notify_to_curator(user)
        ubb.auth_first.btn_first_time(user, nextStep)
    })

userBot.addState('auth_opinion')
    .addFsx(ubb.auth_opinion.set_poll)
    .onText((user, nextStep) => {
        ubb.dialog.save_msg_and_send_notify_to_curator(user)
        ubb.auth_opinion.recive_poll_by_steps(user, nextStep)
    })

userBot.addState('auth_autorization')
    .addFsx(ubb.auth_autorization.show_msg_and_btn_help)
    .onButton('Помощь', ubb.auth_autorization.go_to_help)
    .onText(ubb.auth_autorization.ckeck_token_in_input)

userBot.addState('auth_help')
    .addFsx(ubb.auth_help.show_btn_autorize_if_first_time)
    .onButton('Авторизация 🔑', ubb.auth_help.go_to_autorization)
    .onButton('⬅️', ubb.auth_help.go_to_main)
    .onText(ubb.dialog.save_msg_and_send_notify_to_curator)
    .onImage(ubb.dialog.save_msg_and_send_notify_to_curator)

///////////////////////////////////////////////////////////////////////////
//////////////                       MAIN                    //////////////
///////////////////////////////////////////////////////////////////////////

userBot.addState('main')
    .addFsx(ubb.main.show_practice_dict_and_dialog)
    .onButton('Оповещения 🔔', ubb.dict_main.go_to('dict_ntfSet'))
    .onButton('Тренажёр 🚀', ubb.main.go_to_dict_tren) // TODO: внутри
    //.onButton('Аудирование 🎧', ubb.dict_main.go_to('dict_aam')) // TODO: внутри
    .onButton('Аудирование 🎧', ubb.dict_aam.generate_aam)
    .onButton(/Справка ℹ 💬.*/, ubb.main.go_to_help) // TODO: dialog state - убрать лишнее

///////////////////////////////////////////////////////////////////////////
//////////////              Словарь. Тренировка 🚀           //////////////
///////////////////////////////////////////////////////////////////////////

userBot.addState('dict_tren')
    .addFsx(ubb.dict_tren.get_status_of_my_dict)
    .onButton('⬅️', ubb.dict_main.go_to('main'))
    .onButton('🇬🇧📖', ubb.dict_tren.set_type_and_go_to_dict_tren_checking('text'))
    .onButton('🇬🇧🎧', ubb.dict_tren.set_type_and_go_to_dict_tren_checking('sound'))
    .onButton('🇷🇺=>🇬🇧', ubb.dict_tren.set_type_and_go_to_dict_tren_checking('reversed'))
    .onButton('🎲', ubb.dict_tren.set_type_and_go_to_dict_tren_checking())

userBot.addState('dict_tren_checking')
    .addFsx(ubb.dict_tren_checking.can_you_do_it)
    .onButton('ℹ', ubb.dict_tren_checking.show_geometric_scheme)
    .onButton('❌ Нет', ubb.dict_tren_checking.remeber_phrase(false))
    .onButton('✅ Да', ubb.dict_tren_checking.remeber_phrase(true))
    .onButton('⬅️', ubb.dict_tren_checking.go_to_dict_tren)

userBot.addState('dict_tren_checking_confirm') // TODO:
    .addFsx(ubb.dict_tren_checking_confirm.were_you_right)
    .onButton('ℹ', ubb.dict_tren_checking_confirm.show_geometric_scheme)
    .onButton('❌ Нет', ubb.dict_tren_checking_confirm.remeber_phrase_confirm(false))
    .onButton('✅ Да', ubb.dict_tren_checking_confirm.remeber_phrase_confirm(true))
    .onButton('⬅️', ubb.dict_tren_checking_confirm.go_to_dict_tren)

///////////////////////////////////////////////////////////////////////////
//////////////              Словарь. Оповещения 🔔           //////////////
///////////////////////////////////////////////////////////////////////////

userBot.addState('dict_ntfSet').addFsx(ubb.dict_ntfSet.show_settings)
    .onButton('⬅️', ubb.dict_ntfSet.go_to_main)
    .onButton('🔔', ubb.dict_ntfSet.switch_power)
    .onButton('🔕', ubb.dict_ntfSet.switch_power)
    .onText(ubb.dict_ntfSet.define_attr_and_go_to_set_it)

userBot.addState('dict_ntfSet_setAttr')
    .addFsx(ubb.dict_ntfSet_setAttr.getting_value)
    .onButton('⬅️', ubb.dict_ntfSet_setAttr.go_to_dict_ntfSet)
    .onText(ubb.dict_ntfSet_setAttr.write_value)

// ///////////////////////////////////////////////////////////////////////////
// //////////////                Диалог. Диалог 💬              //////////////
// /////////////////////////////////////////////////////////////////////////// // TODO:

userBot.addState('dialog')
    .addFsx(ubb.dialog.getting_messages)
    .onText(ubb.dialog.save_msg_and_send_notify_to_curator)
    .onButton('⬅️', ubb.dialog.go_to_main)
    .onImage(ubb.dialog.save_msg_and_send_notify_to_curator)
    .onAudio(ubb.dialog.save_msg_and_send_notify_to_curator)
    .onVideo(ubb.dialog.save_msg_and_send_notify_to_curator)
    .onFile(ubb.dialog.save_msg_and_send_notify_to_curator)



/////////////////////////////////////////////////////////////////////////// //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
//////////////                                               //////////////
//////////////                БОТ КУРАТОРА                   //////////////
//////////////                                               //////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

curatorBot.setIntervalAction(3, cbb.dialogs.check_new_msgs)

curatorBot.setGlobalHandler()
    .addFsx(cbb.global.set_last_action)
    .onCommand('/logout', cbb.global.delete_user)
    .onCommand('/start', cbb.global.start)
    .onButton('🚪', user => user.apply('command', '/start'))


curatorBot.addState('auth')
    .addFsx(cbb.auth.give_me_token)
    .onText(cbb.auth.curator_auth)

curatorBot.addState('main')
    .addFsx(cbb.main.get_all_tasks_and_update_dialogs)
    .onButton('🔄', cbb.main.update)
    .onButton(/Практика.*/, cbb.main.go_to('chk'))
    .onButton(/Разбор.*/, cbb.main.go_to('to_parse'))
    .onButton(/Озвучка.*/, cbb.main.go_to('to_sound_choose'))
    .onButton('🗞', cbb.main.go_to('one_to_many'))
    .onButton(/💬.*/, cbb.main.go_to('dialogs'))

///////////////////////////////////////////////////////////////////////////
//////////////                   Озвучка 📣                  //////////////
///////////////////////////////////////////////////////////////////////////
/*curatorBot.addState('to_sound_choose')
    .addFsx(cbb.to_sound_choose.choose_type)
    .onButton('⬅️', cbb.to_sound_choose.go_to('main'))*/
//.onButton(/Примеры уроков.*/, cbb.to_sound_choose.go_to('to_sound_examples'))
//.onButton(/Словарь пользователей.*/, cbb.to_sound_choose.go_to('to_sound_user_dict'))

/*/////////////Словаря пользователя
curatorBot.addState('to_sound_user_dict')
    .addFsx(cbb.to_sound_user_dict.get_all_sound_tasks)
    .onButton('⬅️', cbb.to_sound_user_dict.go_home)
    .onAudio(cbb.to_sound_user_dict.go_to_commit_audio)

curatorBot.addState('to_sound_user_dict_commit')
    .addFsx(cbb.to_sound_user_dict_commit.are_you_sure)
    .onButton('❌', cbb.to_sound_user_dict_commit.no)
    .onButton('✅', cbb.to_sound_user_dict_commit.yes)

/////////////Примеры уроков
curatorBot.addState('to_sound_examples')
    .addFsx(cbb.to_sound_examples.get_sound_tasks)
    .onAudio(cbb.to_sound_examples.go_to_commit_audio)
    .onButton('⬅️', cbb.to_sound_examples.clear_and_go_to_main)

curatorBot.addState('to_sound_examples_commit')
    .addFsx(cbb.to_sound_examples_commit.are_you_sure)
    .onButton('❌', cbb.to_sound_examples_commit.no)
    .onButton('✅', cbb.to_sound_examples_commit.yes)*/

// ///////////////////////////////////////////////////////////////////////////
// //////////////                  Рассылка 🗞                  //////////////
// ///////////////////////////////////////////////////////////////////////////
curatorBot.addState('one_to_many')
    .addFsx(cbb.one_to_many.show_tips_and_redy_to_mailing)
    .onButton('⬅️', cbb.one_to_many.go_home)
    .onText(cbb.i_am_god.if_there_is_command_make_something(cbb.one_to_many.send_to_everyone, 'TOEVERYONE'))
    .onImage(cbb.dialogs_current.send_message)

///////////////////////////////////////////////////////////////////////////
//////////////                   Диалоги                     //////////////
///////////////////////////////////////////////////////////////////////////
curatorBot.addState('dialogs')
    .addFsx(cbb.dialogs.show_users_list)
    .onButton('⬅️', cbb.dialogs.go_to_main)
    .onButton('<', cbb.dialogs.shift_left)
    .onButton('>', cbb.dialogs.shift_right)
    .onButton(/.*:.*/, cbb.dialogs.choose_user)

curatorBot.addState('dialogs_current')
    .addFsx(cbb.dialogs_current.get_history)
    .onButton('⬅️', cbb.dialogs_current.go_to_users_list)
    .onText(cbb.i_am_god.if_there_is_command_make_something(cbb.dialogs_current.send_message))
    .onImage(cbb.dialogs_current.send_message)

// ///////////////////////////////////////////////////////////////////////////
// //////////////              Разбор фраз словаря              //////////////
// ///////////////////////////////////////////////////////////////////////////
curatorBot.addState('to_parse')
    .addFsx(cbb.to_parse.get_everything_for_sounding)
    .onButton('⬅️', cbb.to_parse.go_home)
    .onText(cbb.to_parse.get_ru_en_or_comment)

// ///////////////////////////////////////////////////////////////////////////
// //////////////              Проверка практики                //////////////
// ///////////////////////////////////////////////////////////////////////////
curatorBot.addState('chk')
    .addFsx(cbb.chk.get_threads)
    .onButton('⬅️', cbb.chk.go_home)
    .onText(cbb.chk.choose_thread)

curatorBot.addState('chk_lesson_list')
    .addFsx(cbb.chk_lesson_list.get_lessons_list)
    .onButton('⬅️', cbb.chk_lesson_list.go_to_thread_list)
    .onText(cbb.chk_lesson_list.choose_lesson)

curatorBot.addState('chk_put_mark')
    .addFsx(cbb.chk_put_mark.show_next_task)
    .onButton('⬅️', cbb.chk_put_mark.go_to_lessons_list)
    .onText(cbb.chk_put_mark.get_mark)

curatorBot.addState('chk_put_comment')
    .addFsx(cbb.chk_put_comment.give_comment_or_save)
    .onButton('⬅️', cbb.chk_put_comment.go_to_put_mark)
    .onText(cbb.chk_put_comment.recive_comment)
    .onButton('✅', cbb.chk_put_comment.save_task)



///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
//////////////                                               //////////////
//////////////                      Полетели                 //////////////
//////////////                                               //////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

userBot.run()
curatorBot.run()