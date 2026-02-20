const destinations = [
    {
        id: 1,
        name: "Осло, Норвегия",
        type: "Город",
        budget: "Высокий",
        duration: "4-7 дней",
        price: "от 105 000₽",
        rating: 4.4,
        reviews: 15234,
        image: "https://cdn.prod.website-files.com/64bd3d84d95372adf59c2acd/668c25dbb8066c9603d3e4b4__THE%20GOODS%2048%20Hours%20in%20Oslo%20Guide%20VisitOSLO%20(3)-p-1080.webp",
        description: "Столица Норвегии, окруженная фьордами и лесами. Город, где современная архитектура сочетается с суровой скандинавской природой.",
        fullDescription: "Осло — город контрастов, где современное искусство соседствует с викингским прошлым. Посетите знаменитый Оперный театр, спроектированный так, что по его крыше можно гулять, музей кораблей викингов и парк скульптур Вигеланда. Осло окружен лесами и фьордами — от центра города всего 20 минут на транспорте, и вы уже на лоне природы. Это идеальное место для тех, кто хочет совместить городскую культуру с активным отдыхом.",
        attractions: [
            {
                name: "Оперный театр",
                description: "Архитектурная достопримечательность с покатой крышей, на которую можно подняться",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/OsloOpera_20080605-1.jpg/960px-OsloOpera_20080605-1.jpg"
            },
            {
                name: "Парк скульптур Вигеланда",
                description: "Уникальный парк с более чем 200 скульптурами работы Густава Вигеланда",
                image: "https://upload.wikimedia.org/wikipedia/commons/7/76/Oslo%2C_Vigeland_Park%2C_Great_Fountain_%283%29.jpg"
            },
            {
                name: "Музей кораблей викингов",
                description: "Древние драккары и артефакты эпохи викингов",
                image: "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_6897159a8c292c3cc1c49a29_68971c72285c7b766b69405a/scale_1200"
            },
            {
                name: "Крепость Акерсхус",
                description: "Средневековая крепость с видом на фьорд",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/OSLO-NO-02_05_ubt.jpeg/1200px-OSLO-NO-02_05_ubt.jpeg"
            }
        ],
        tags: ["фьорды", "музеи", "архитектура", "викинги"],
        bestSeason: "Май-сентябрь",
        language: "Норвежский",
        currency: "Норвежская крона",
        timezone: "UTC+1"
    },
    {
        id: 2,
        name: "Копенгаген, Дания",
        type: "Город",
        budget: "Средний",
        duration: "4-7 дней",
        price: "от 80 000₽",
        rating: 4.7,
        reviews: 27890,
        image: "https://a.d-cd.net/37dec11s-1920.jpg",
        description: "Самый уютный город Скандинавии с красочными набережными, королевскими дворцами и атмосферой хюгге.",
        fullDescription: "Копенгаген — город велосипедов, сказок Андерсена и гастрономических удовольствий. Здесь находится знаменитая статуя Русалочки, парк развлечений Тиволи (второй старейший в мире) и свободный город Христиания. Нюхавн — живописная гавань с разноцветными домиками — открыточный вид Дании. В Копенгагене более 20 мишленовских ресторанов, включая легендарный Noma, так что это рай для гурманов.",
        attractions: [
            {
                name: "Нюхавн",
                description: "Знаменитая гавань с разноцветными домиками XVII века",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Nyhavn%2C_Copenhagen%2C_20220618_1728_7354.jpg/1200px-Nyhavn%2C_Copenhagen%2C_20220618_1728_7354.jpg"
            },
            {
                name: "Парк Тиволи",
                description: "Один из старейших парков развлечений в мире",
                image: "https://s.yimg.com/ny/api/res/1.2/D3eyZq3fCBS0fyrBBqJKHQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD04Mjg7Y2Y9d2VicA--/https://media.zenfs.com/en-US/homerun/time_72/86ffc4ad0ea78512e84268e52e7a6096"
            },
            {
                name: "Замок Кронборг",
                description: "Замок, где разворачивалось действие «Гамлета» Шекспира",
                image: "https://files.guidedanmark.org/files/382/335597_DJI_0170-large_1.jpg"
            }
        ],
        tags: ["гастрономия", "архитектура", "Андерсен"],
        bestSeason: "Май-август",
        language: "Датский",
        currency: "Датская крона",
        timezone: "UTC+1"
    },
    {
        id: 3,
        name: "Норвежские фьорды",
        type: "Природа",
        budget: "Высокий",
        duration: "8+ дней",
        price: "от 120 000₽",
        rating: 5.0,
        reviews: 18765,
        image: "https://media.audleytravel.com/-/media/images/home/europe/norway/itineraries/ss_1057350350_sognefjord_3000x1000.jpg?q=79&w=1920&h=685",
        description: "Величественные фьорды Норвегии — одно из самых живописных мест на планете. Глубокие синие воды, окруженные зелеными скалами.",
        fullDescription: "Норвежские фьорды — это природное чудо света. Гейрангер-фьорд и Нэрёй-фьорд входят в список ЮНЕСКО. Здесь можно увидеть водопады, низвергающиеся с километровых скал (Семь сестер, Жених), крошечные фермы, прилепившиеся к утесам, и кристально чистую голубую воду. Фьорды прекрасны в любое время года: летом — зелень и круизы, весной — бурные водопады, осенью — золотые леса, зимой — заснеженные вершины.",
        attractions: [
            {
                name: "Гейрангер-фьорд",
                description: "Самый известный фьорд Норвегии, объект ЮНЕСКО",
                image: "https://s.yimg.com/ny/api/res/1.2/PsO3xottUmHloohby3uzsw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzU7Y2Y9d2VicA--/https://media.zenfs.com/en/explore_252/9eb527fe313d040a049058ecfeabf306"
            },
            {
                name: "Водопад Семь сестер",
                description: "Знаменитый каскадный водопад в Гейрангер-фьорде",
                image: "https://img2.kapital.kz/IppXwCLdgLA/el:true/rs:fit:1010:581/dpr:1.5/f:webp/czM6Ly9rYXBpdGFsLXN0YXRpYy9pbWcvYy84LzAvMS81Lzk5NTUwMjQyODRjMTJiZjU3MmUyZDY3NmJjOC5qcGc"
            },
            {
                name: "Скала Прекестулен",
                description: "Знаменитый утес с плоской вершиной на высоте 604 метра",
                image: "https://a.d-cd.net/66a1de5s-1920.jpg"
            },
            {
                name: "Фломская железная дорога",
                description: "Одна из самых живописных железных дорог в мире",
                image: "https://b8.cc.icdn.ru/d/draimannax/5/66164775uLu.jpg"
            }
        ],
        tags: ["фьорды", "водопады", "ЮНЕСКО"],
        bestSeason: "Май-сентябрь",
        language: "Норвежский",
        currency: "Норвежская крона",
        timezone: "UTC+1"
    },
    {
        id: 4,
        name: "Остров Шпицберген",
        type: "Природа",
        budget: "Высокий",
        duration: "4-7 дней",
        price: "от 250 000₽",
        rating: 4.8,
        reviews: 2628,
        image: "https://avatars.mds.yandex.net/i?id=5759e033cca658574ea262f1c3f57bed_l-4316934-images-thumbs&n=13",
        description: "Суровый арктический архипелаг с белыми медведями, ледниками и полярной ночью. Край земли.",
        fullDescription: "Шпицберген — уникальное место за полярным кругом, где правит арктическая природа. Здесь больше белых медведей, чем людей (около 3000 против 2500). Летом — полярный день, зимой — полярная ночь с северным сиянием. Можно увидеть гигантские ледники, откалывающиеся айсберги, китов, моржей и песцов. Поселок Баренцбург — настоящее русское поселение в Норвегии с советской символикой. Это место для настоящих искателей приключений.",
        attractions: [
            {
                name: "Ледник Норденшельда",
                description: "Огромный ледник, спускающийся в море",
                image: "https://i.pinimg.com/736x/6c/72/61/6c7261de3dacdf92054ded57904171df.jpg"
            },
            {
                name: "Поселок Баренцбург",
                description: "Российское шахтерское поселение с уникальной атмосферой",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Barentsburg_view.jpg/1280px-Barentsburg_view.jpg"
            },
            {
                name: "Северное сияние",
                description: "Одно из лучших мест для наблюдения авроры",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Aurora_over_Svalbard.jpg/1200px-Aurora_over_Svalbard.jpg"
            },
        ],
        tags: ["арктика", "ледники", "полярная ночь"],
        bestSeason: "Июнь-август, февраль-март",
        language: "Норвежский, русский",
        currency: "Норвежская крона",
        timezone: "UTC+1"
    },
    {
        id: 5,
        name: "Стокгольм, Швеция",
        type: "Город",
        budget: "Средний",
        duration: "4-7 дней",
        price: "от 75 000₽",
        rating: 4.8,
        reviews: 31456,
        image: "https://www.eurotraveler.ru/wp-content/uploads/2009/12/stockholm-stortorget-min.jpg",
        description: "Столица Скандинавии, раскинувшаяся на 14 островах. Город с королевским дворцом, музеем АВВА и уютными улочками.",
        fullDescription: "Стокгольм называют «Северной Венецией» за его расположение на островах. Старый город (Гамла Стан) с королевским дворцом и узкими мостовыми переносит в средневековье. Современный Стокгольм — это дизайн, мода и инновации. Обязательно посетите музей АВВА (интерактивный музей легендарной группы), музей Васа (единственный в мире сохранившийся корабль XVII века) и прогуляйтесь по современному району Сёдермальм с его хипстерскими кафе и потрясающими видами на город.",
        attractions: [
            {
                name: "Гамла Стан",
                description: "Старый город с королевским дворцом и самой узкой улочкой",
                image: "https://live.staticflickr.com/7346/9304475607_70d484f5ee_b.jpg"
            },
            {
                name: "Музей Васа",
                description: "Единственный в мире музей, где выставлен корабль XVII века",
                image: "https://i.pinimg.com/736x/df/3a/2a/df3a2a66989c47b6b8786062eb8a61a9.jpg"
            },
            {
                name: "Музей АВВА",
                description: "Интерактивный музей легендарной шведской группы",
                image: "https://cdn5.vedomosti.ru/image/2015/12/nj7bp/original-uhz.jpg"
            },
            {
                name: "Юргорден",
                description: "Остров-музей с парками и аттракционами",
                image: "https://images.squarespace-cdn.com/content/v1/5bb4da05af468351abbb6cda/1582633678808-DTH5L5QXM3EIF1JQ494N/Юргорден_1.jpg?format=2500w"
            }
        ],
        tags: ["музеи", "архитектура", "викинги"],
        bestSeason: "Май-сентябрь",
        language: "Шведский",
        currency: "Шведская крона",
        timezone: "UTC+1"
    },
    {
        id: 5,
        name: "Рига, Латвия",
        type: "Город",
        budget: "Низкий",
        duration: "1-3 дня",
        price: "от 35 000₽",
        rating: 4.6,
        reviews: 23456,
        image: "https://35photo.pro/photos_main/172/864411.jpg",
        description: "Жемчужина Балтии с богатой историей, ар-нуво архитектурой и уютным Старым городом.",
        fullDescription: "Рига — крупнейший город Прибалтики с уникальным архитектурным наследием. Старый город (Вецрига) с узкими мощенными улочками, Домским собором и средневековыми церквями внесен в список ЮНЕСКО. Особого внимания заслуживает рижский модерн — здесь находится одна из лучших коллекций здайний в стиле ар-нуво в Европе. Это также родина знаменитых рижских бальзамов и уютных кафе. Отдых в Риге доступен по цене и идеально подходит для романтического уикенда.",
        attractions: [
            {
                name: "Старый город",
                description: "Средневековый центр Риги с Домским собором и церковью Святого Петра",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Vecrīga_Historic_Centre_of_Riga_Aug_2019_004.jpg/960px-Vecrīga_Historic_Centre_of_Riga_Aug_2019_004.jpg"
            },
            {
                name: "Домский собор",
                description: "Главный собор Риги с знаменитым органом",
                image: "https://avatars.mds.yandex.net/i?id=88ee9e526287a91b8b4be693a7d15f0f_l-5235948-images-thumbs&n=13"
            },
            {
                name: "Улица Альберта",
                description: "Средоточие рижского модерна, уникальные здания в стиле ар-нуво",
                image: "https://img5.arrivo.ru/1679/38/67195/6/panoramio.com-Harris_Pilgrims.jpg"
            },
            {
                name: "Рижский замок",
                description: "Резиденция президента Латвии с богатой историей",
                image: "https://avatars.mds.yandex.net/get-altay/1705560/2a00000170da9d286818b4b9b8730c682d14/orig"
            }
        ],
        tags: ["архитектура", "история", "модерн", "балтика"],
        bestSeason: "Май-сентябрь",
        language: "Латышский",
        currency: "Евро",
        timezone: "UTC+2"
    },
    {
        id: 7,
        name: "Хельсинки, Финляндия",
        type: "Город",
        budget: "Низкий",
        duration: "1-3 дня",
        price: "от 45 000₽",
        rating: 4.5,
        reviews: 19876,
        image: "https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/650418/V9bsdUrFNO24w0wSzFJzUQ.jpg",
        description: "Элегантная столица Финляндии, где скандинавский дизайн встречается с русским наследием.",
        fullDescription: "Хельсинки — город архитектурных контрастов. Здесь соседствуют неоклассический Сенатская площадь (спроектированная как копия Петербурга) и современный район Катаянокка с дизайнерскими бутиками. Обязательно посетите крепость Суоменлинна (морская крепость XVIII века, объект ЮНЕСКО), Успенский собор (крупнейший православный собор в Северной Европе) и прогуляйтесь по рыночной площади с её лотками с лососем и ягодами. Хельсинки — идеальная точка для парома в Таллин или Стокгольм.",
        attractions: [
            {
                name: "Сенатская площадь",
                description: "Центральная площадь с Кафедральным собором",
                image: "https://avatars.mds.yandex.net/i?id=5d5c364d2486a9d3286eb7ed394ef9bde73cc400-9599239-images-thumbs&n=13"
            },
            {
                name: "Крепость Суоменлинна",
                description: "Морская крепость XVIII века, объект ЮНЕСКО",
                image: "https://avatars.mds.yandex.net/i?id=9160c17536b001f88cfca178103a9ab0_l-5634817-images-thumbs&n=13"
            },
            {
                name: "Рыночная площадь",
                description: "Традиционный рынок с финскими деликатесами",
                image: "https://avatars.mds.yandex.net/i?id=d88e1024619d5cc9fc35983ffcfb3f3f_l-8498011-images-thumbs&n=13"
            }
        ],
        tags: ["архитектура", "сауна", "море", "рынок"],
        bestSeason: "Июнь-август",
        language: "Финский",
        currency: "Евро",
        timezone: "UTC+2"
    },
    {
        id: 8,
        name: "Деревня Йоулупукки, Финляндия",
        type: "Смешанный",
        budget: "Средний",
        duration: "1-3 дня",
        price: "от 60 000₽",
        rating: 5.0,
        reviews: 32456,
        image: "https://i.pinimg.com/originals/23/8e/f6/238ef636f700db7c50f7bc86a7f531d0.jpg",
        description: "Официальная резиденция Санта-Клауса за полярным кругом. Волшебное место для детей и взрослых.",
        fullDescription: "Деревня Йоулупукки находится в городе Рованиеми, прямо на полярном круге. Это главная резиденция финского Санта-Клауса. Здесь можно встретить самого Йоулупукки, пересечь линию полярного круга, отправить открытку с официальным штампом из почтового отделения Санты, прокатиться на оленьих или собачьих упряжках. Круглый год здесь царит новогодняя атмосфера, а зимой можно увидеть северное сияние. Идеальное место для семейного отдыха.",
        attractions: [
            {
                name: "Офис Санта-Клауса",
                description: "Личная резиденция, где Йоулупукки принимает гостей круглый год",
                image: "https://www.softtour.by/images/stories/site/new_year/Litva/lit3.jpg"
            },
            {
                name: "Полярный круг",
                description: "Линия полярного круга проходит прямо через деревню",
                image: "https://avatars.mds.yandex.net/get-altay/16243748/2a000001992e893c06f5c14eff5af5b1062a/orig"
            },
            {
                name: "Парк Санта-Парк",
                description: "Подземный рождественский парк развлечений",
                image: "https://cms.enjourney.ru/upload/Jana/Finland/Attraction/Joulupukin-Pajakyla1.jpg"
            }
        ],
        tags: ["санта", "рождество", "Лапландия"],
        bestSeason: "Декабрь-январь",
        language: "Финский, английский, русский",
        currency: "Евро",
        timezone: "UTC+2"
    },
];