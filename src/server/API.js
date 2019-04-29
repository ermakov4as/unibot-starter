module.exports = {
    "autorize": {
        "type": "POST",
        "path": "/users/unibot/auth/",
        "data": {
            "token": "p5zevm"
        },
        "response": {
            "key": "5a9deec7f50be240074e6ba5215190bb4c6428d0",
        }
    },
    "getInfoUser": {
        "type": "GET",
        "path": "/users/unibot/info/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": {
            "id": 56,
            "name": "Славик"
        }
    },
    "getHomeworkList": {
        "type": "GET",
        "path": "/homework/homework-list/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": [
            {
                "id": 157,
                "lesson_name": "Урок 2. Существительное",
                "expiration_date": "2019-03-03T06:00:00Z"
            },
            {
                "id": 158,
                "lesson_name": "Урок 1. Личные местоимения",
                "expiration_date": "2019-01-03T06:00:00Z"
            }
        ]
    },
    "getHomeworkById": {
        "type": "GET",
        "path": "/homework/homework/<lesson_id>/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": {
            "id": 158,
            "schemes": [
                {
                    "task": {
                        "id": 26,
                        "image": "https://almanac-media.s3.amazonaws.com/media/public/images/Screen_Shot_2019-03-12_at_09.48.06.png",
                        "description": "Здеся описание"
                    },
                    "count": 1,
                    "attempts_count": 0,
                    "rejected": 0
                },
                {
                    "task": {
                        "id": 28,
                        "image": "https://almanac-media.s3.amazonaws.com/media/public/images/Screen_Shot_2019-03-12_at_09.48.06.png",
                        "description": "Картошка мурашка короче НЕ"
                    },
                    "count": 1,
                    "attempts_count": 0,
                    "rejected": 0
                }
            ]
        }
    },
    "postHomeworkTask": {
        "type": "POST",
        "path": "/homework/homework/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "data": {
            "homework_id": 158,
            "task_id": 28,
            "question": "No pain no gain",
            "audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3"
        }
    },
    "getDictInfo": {
        "type": "GET",
        "path": "/dictionary/states-info/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": [{
            name: 'text',
            count: 209,
            question_count: 209,
            answer_count: 209,
            question_audio_count: 209,
            answer_audio_count: 6,
            voice_requests: 0,
            analysis_requests: 0
        },
        {
            name: 'sound',
            count: 95,
            question_count: 95,
            answer_count: 95,
            question_audio_count: 95,
            answer_audio_count: 59,
            voice_requests: 0,
            analysis_requests: 0
        },
        {
            name: 'reversed',
            count: 54,
            question_count: 54,
            answer_count: 54,
            question_audio_count: 54,
            answer_audio_count: 53,
            voice_requests: 0,
            analysis_requests: 0
        },
        {
            name: 'done',
            count: 28,
            question_count: 28,
            answer_count: 28,
            question_audio_count: 28,
            answer_audio_count: 24,
            voice_requests: 0,
            analysis_requests: 0
        }]
    },
    "getDictRandom": {
        "type": "GET",
        "path": "/dictionary/random/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": {
            "id": 391,
            "profile": "saiptonx@gmail.com",
            "question": "They were men who had lived by my code, but had not known how great a virtue it represented. ",
            "question_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/391_en.mp3",
            "answer": "Это были люди, которые жили по моему кодексу, но не знали, насколько велика его добродетель.",
            "answer_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/391_ru.mp3",
            "comment": null,
            "learning_state": "text",
            "analysis_state": "none",
            "voice_state": "google"
        }
    },
    "getDictByType": {
        "type": "GET",
        "path": "/dictionary/states/<type>/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": {
            "id": 391,
            "profile": "saiptonx@gmail.com",
            "question": "They were men who had lived by my code, but had not known how great a virtue it represented. ",
            "question_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/391_en.mp3",
            "answer": "Это были люди, которые жили по моему кодексу, но не знали, насколько велика его добродетель.",
            "answer_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/391_ru.mp3",
            "comment": null,
            "learning_state": "text",
            "analysis_state": "none",
            "voice_state": "google"
        }
    },
    "getGenerateAAM": {
        "type": "GET",
        "path": "/dictionary/get_audio_file/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": {
            "url": 'pat/to/file'
        }
    },
    "getSelfVoiceArray": {
        "type": "GET",
        "path": "/dictionary/bot/voice/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "response": [
            {
                "id": 240,
                "dict_unit": {
                    "id": 397,
                    "profile": "saiptonx@gmail.com",
                    "question": "If that which you claim to perceive does not exist, what you possess is not consciousness. ",
                    "question_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/397_en.mp3",
                    "answer": "Если то, что вы утверждаете, что воспринимаете, не существует, то, чем вы обладаете, не является сознанием.",
                    "answer_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/397_ru.mp3",
                    "comment": null,
                    "learning_state": "text",
                    "analysis_state": "none",
                    "voice_state": "self"
                },
                "performer": null,
                "created": "2019-03-17T07:35:05.330409Z",
                "finished": null,
                "target": "self"
            }
        ]
    },
    "postDict": {
        "type": "POST",
        "path": "/dictionary/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "data": {
            "question": "New sentences",
            "question_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3",
            "answer": "Новое предложение",
            "answer_audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3"
        }
    },
    "putSelfVoice": {
        "type": "PUT",
        "path": "/dictionary/bot/voice/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "data": {
            "id": 241,
            "field": "question",
            "audio": "https://almanac-media.s3.amazonaws.com/media/public/audios/audio45330352026.mp3"
        }
    },
    "putNextStateDict": {
        "type": "PUT",
        "path": "/dictionary/forward/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "data": {
            "id": 241
        }
    },
    "gostAudio": {
        "type": "POST",
        "path": "",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "data": {
            order: [{
                type: 'question',
                delay: 2
            }, {
                type: 'question',
                delay: 1
            }, {
                type: 'answer',
                delay: 1
            }, {
                type: 'question',
                delay: 2
            }],
            state: 'reversed',
            generation: [14, 42, 53, 563, 32] // ИЛИ число, что означает, что рандомно указанне количество.
        },
        "response": {
            "url": "path/to/mp3"
        }
    },
    "postAddPhrases": {
        "type": "POST",
        "path": "/dictionary/add_from_lesson/",
        "headers": {
            "autorization": "Bearer 5a9deec7f50be240074e6ba5215190bb4c6428d0"
        },
        "data": {
            "lesson_num": 2
        }
    },
    ////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////               БОТ КУРАТОРА                ////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////

    "registration": {
        "type": "POST",
        "path": "/staff/register_user/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "data": {
            "email": "TEST121@yandex.ru", // required
            "password": "343434", //required
            "thread_id": 7, //required
            "nickname": "TEST" //optional
        },
        "response": {
            "homework_attempts": 23
        }
    },

    "getCuratorInfo": {
        "type": "GET",
        "path": "/staff/curator_bot/info/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "response": {
            "homework_attempts": 23,
            "analysis_requests": 22,
            "voice_requests": 17
        }
    },
    'getAnalysisRequests': {
        "type": "GET",
        "path": "/staff/curator_bot/analysis_requests/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "response": [
            {
                "id": 3,
                "dict_unit": {
                    "id": 60,
                    "profile": "usertest3@gmail.com",
                    "question": "No pain no gain",
                    "question_audio": null,
                    "answer": "Без боли нет успеха",
                    "answer_audio": null,
                    "comment": null,
                    "learning_state": "text",
                    "analysis_state": "none",
                    "voice_state": "none"
                },
                "performer": null,
                "created": "2019-01-29T16:22:37.708243Z",
                "finished": null
            }
        ]
    },
    'putAnalysisRequests': {
        "type": "PUT",
        "path": "/staff/curator_bot/analysis_requests/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "data": {
            'id': 21,
            'text': 'какой-то разбор'
        },
        "response": {
            "id": 3,
            "dict_unit": {
                "id": 60,
                "profile": "usertest3@gmail.com",
                "question": "No pain no gain",
                "question_audio": null,
                "answer": "Без боли нет успеха",
                "answer_audio": null,
                "comment": null,
                "learning_state": "text",
                "analysis_state": "none",
                "voice_state": "none"
            },
            "performer": null,
            "created": "2019-01-29T16:22:37.708243Z",
            "finished": null
        }
    },
    'getVoiceRequests': {
        "type": "GET",
        "path": "/staff/curator_bot/voice_requests/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "response": [
            {
                "id": 20,
                "dict_unit": {
                    "id": 60,
                    "profile": "usertest3@gmail.com",
                    "question": "No pain no gain",
                    "question_audio": null,
                    "answer": "Без боли нет успеха",
                    "answer_audio": null,
                    "comment": null,
                    "learning_state": "text",
                    "analysis_state": "none",
                    "voice_state": "none"
                },
                "performer": null,
                "created": "2019-01-29T16:22:41.190463Z",
                "finished": null,
                "target": "curator"
            }
        ]
    },
    'getVoiceRequestsAAM': {
        "type": "GET",
        "path": "/staff/recorder/example_list/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "response": []
    },
    'putVoiceRequestAAM': {
        "type": "POST",
        "path": "/staff/recorder/example/",
        "data": {
            "queue_id": 12,
            "audio": "path/to/file"
        },
        "headers": {
            "autorization": "Bearer + key"
        },
        "response": []
    },
    'getHomeworkForCurator': {
        "type": "GET",
        "path": "/staff/curator/attempt_list/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "response": [
            {
                "name": "Тестовый поток",
                "lessons": [
                    {
                        "name": "Урок 1. Объекты",
                        "tasks": [
                            {
                                "image_url": "https://almanac-media.s3.amazonaws.com/media/public/images/Screen_Shot_2018-12-28_at_23.17.46.png",
                                "description": "хуй пизда залупа сыр",
                                "attempts": [
                                    {
                                        "id": 303,
                                        "name": "brat-iliya@yandex.ru",
                                        "question": "test question",
                                        "question_audio": null,
                                        "answer": "Тестовый ответ",
                                        "answer_audio": null,
                                        "accepted": false,
                                        "checked": false,
                                        "result": 0,
                                        "comment": null,
                                        "date_created": "2019-03-11T22:32:14.657779Z"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'putHomework': {
        "type": "PUT",
        "path": "/staff/curator/%D1%81heck_attempt/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "data": {
            "id": 303,
            "result": 0,
            "comment": ""
        }
    },
    'putVoiceRequest': {
        "type": "PUT",
        "path": "/staff/curator_bot/voice_requests/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "data": {
            "id": "Number именно реквесита",
            "field": "question/answer",
            "audio": "path/to/file"
        }
    },
    'putRename': {
        "type": "PUT",
        "path": "/staff/rename_user/",
        "headers": {
            "autorization": "Bearer + key"
        },
        "data": {
            "id": "Number именно реквесита",
            "nickname": "question/answer"
        }
    }
}