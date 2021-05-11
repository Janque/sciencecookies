const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.setCalConfig = functions.region('us-central1').https.onRequest((req, res) => {
    db.collection('config').doc('calTypes').set({
        es: [{
            label: "Conjunción Solar",
            multipleTxt: 1,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Ninguno",
                    val: "00",
                }, {
                    label: "Superior",
                    val: "01",
                }, {
                    label: "Inferior",
                    val: "12",
                }]
            }, {
                label: "Cuerpo",
                type: "text"
            }, {
                label: "Separación (gradºmin')",
                type: "text",
                placeholder: "0º0\'"
            }],
            text: [
                "$1$ parecerá muy cerca del sol en el cielo, ya que estará al otro lado del Sistema Solar. En su mayor acercamiento, estará a $2$.",
                "$1$ parecerá muy cerca del sol en el cielo, ya que estará entre la Tierra y el Sol. En su mayor acercamiento, estará a $2$."
            ],
            titleTxt: [
                "$1$ en conjunción solar",
                "$1$ en conjunción solar superior",
                "$1$ en conjunción solar inferior"
            ]
        }, {
            label: "Conjunción / Acercamiento de dos cuerpos",
            val: 1,
            multipleTxt: 1,
            options: [{
                label: "Cuerpo 1",
                type: "text"
            }, {
                label: "Cuerpo 2",
                type: "text"
            }, {
                label: "Separación (gradºmin')",
                type: "text",
                placeholder: "0º0\'"
            }],
            text: [
                "$0$ y $1$ compartirán la misma ascensión recta, con $0$ pasando a $3$ al sur de $1$.",
                "$0$ y $1$ pasarán a solo $3$ uno del otro en el cielo."
            ],
            titleTxt: [
                "Conjunción de $0$ y $1$",
                "Acercamiento de $0$ y $1$"
            ]
        }, {
            label: "Fase lunar",
            multipleTxt: 1,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Luna Nueva",
                    val: "00",
                }, {
                    label: "Cuarto Creciente",
                    val: "11",
                }, {
                    label: "Luna Llena",
                    val: "22",
                }, {
                    label: "Cuarto mMnguante",
                    val: "33",
                }, {
                    label: "Superluna",
                    val: "44",
                }]
            }],
            text: [
                "La Luna pasará cerca del Sol y se perderá en su brillo por unos días.",
                "Durante esta fase La Luna aparece iluminada casi exactamente a la mitad, y será prominente en el cielo del amanecer.",
                "La Luna estará casi directamente al lado opuesto del Sol en el cielo y aparecerá completamente iluminada.",
                "Durante su última fase La Luna aparece iluminada casi exactamente a la mitad, y será prominente en el cielo del amanecer.",
                "Debido a la cercanía de eventos de La Luna Llena y La Luna en Perigeo, este mes la Luna llena parecerá más grande de lo normal.",
            ],
            titleTxt: [
                "Luna Nueva",
                "Luna en Cuarto Creciente",
                "Luna Llena",
                "Luna en Cuarto Creciente",
                "Superluna"
            ]
        }, {
            label: "M / NGC / IC / otro en buena posición / oposición",
            multipleTxt: 1,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Buena posición",
                    val: "00",
                }, {
                    label: "Oposición",
                    val: "11",
                }]
            }, {
                label: "Nombre corto",
                type: "text"
            }, {
                label: "Nombre largo",
                type: "text"
            }, {
                label: "Constelación",
                type: "text"
            }],
            text: [
                "$2$ estará en buena posición en el cielo en la constelación de $3$ y alcanzará su punto más alto alrededor de la media noche.",
                "$2$ alcanzará la oposición en la constelación de $3$ y será visible la mayor parte de la noche, ya que estará del lado opuesto al Sol."
            ],
            titleTxt: [
                "$1$ en buena posición",
                "$1$ alcanza la oposición"
            ]
        }, {
            label: "Apogeo",
            multipleTxt: 1,
            options: [{
                label: "Cuerpo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "La Luna",
                    val: "00",
                }, {
                    label: "Otro",
                    val: "11",
                }],
                valForSub: "11",
                sub: [{
                    label: "Nombre corto",
                    type: "text"
                }, {
                    label: "Nombre largo",
                    type: "text"
                }, {
                    label: "Distancia (UA)",
                    type: "number"
                }]
            }],
            text: [
                "La Luna alcanzará el punto de su órbita más lejano a la Tierra. Durante este periodo parecerá más pequeña que otros días.",
                "$0-1$ alcanzará el punto de su órbita más lejano a la Tierra. Estará a una distancia de $0-2$ UA."
            ],
            titleTxt: [
                "La Luna en apogeo",
                "$0-0$ en apogeo"
            ]
        }, {
            label: "Perigeo",
            multipleTxt: 1,
            options: [{
                label: "Cuerpo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "La Luna",
                    val: "00",
                }, {
                    label: "Otro",
                    val: "11",
                }],
                valForSub: "11",
                sub: [{
                    label: "Nombre corto",
                    type: "text"
                }, {
                    label: "Nombre largo",
                    type: "text"
                }, {
                    label: "Distancia (UA)",
                    type: "number"
                }]
            }],
            text: [
                "La Luna alcanzará el punto de su órbita más cercano a la Tierra. Durante este periodo parecerá más grande que otros días.",
                "$0-1$ alcanzará el punto de su órbita más cercano a la Tierra, a una distancia de $0-2$ UA."
            ],
            titleTxt: [
                "La Luna en perigeo",
                "$0-0$ en perigeo"
            ]
        }, {
            label: "Afelio / Perihelio",
            multipleTxt: 1,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Afelio",
                    val: "00",
                }, {
                    label: "Perihelio",
                    val: "11",
                }],
            }, {
                label: "Nombre corto",
                type: "text"
            }, {
                label: "Nombre largo",
                type: "text"
            }, {
                label: "Distancia (UA)",
                type: "number"
            }],
            text: [
                "$2$ alcanzará el punto de su órbita más lejano al Sol, a una distancia de $3$ UA.",
                "$2$ alcanzará el punto de su órbita más cercano al Sol, a una distancia de $3$ UA."
            ],
            titleTxt: [
                "$1$ en afelio",
                "$1$ en perihelio"
            ]
        }, {
            label: "Movimiento retrógrada",
            multipleTxt: 1,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Entra",
                    val: "00",
                }, {
                    label: "Termina",
                    val: "11",
                }],
            }, {
                label: "Planeta",
                type: "text"
            }],
            text: [
                "$1$ detendrá su usual movimiento en dirección este a través de las constelaciones y comenzará a moverse hacia el oeste.<br>Este cambio de dirección es un fenómeno debido al cambio de perspectiva por la posición de La Tierra y los planetas exteriores. Ocurre unos meses antes de alcanzar la oposición.",
                "$1$ detendrá su movimiento en dirección oeste a través de las constelaciones y comenzará a moverse de nuevo hacia el este.<br>Este cambio de dirección es un fenómeno debido al cambio de perspectiva por la posición de La Tierra y los planetas exteriores. Ocurre unos meses después de pasar la oposición."
            ],
            titleTxt: [
                "$1$ entra en movimiento retrograda",
                "$1$ termina su movimiento retrograda"
            ]
        }, {
            label: "Eclipse",
            multipleTxt: 1,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Lunar",
                    val: "00",
                }, {
                    label: "Solar",
                    val: "11",
                }]
            }, {
                label: "Subtipo",
                type: "select",
                options: [{
                    label: "Total",
                    val: "total",
                }, {
                    label: "Parcial",
                    val: "parcial",
                }, {
                    label: "Penumbral",
                    val: "penumbral",
                }, {
                    label: "Anular",
                    val: "anular",
                }, {
                    label: "Híbrido",
                    val: "híbrido total / anular",
                }],
            }, {
                label: "Zonas",
                type: "text",
            }],
            text: [
                "La Luna pasará por la sombra de La Tierra creando un eclipse lunar $0$. Será visible desde $1$.",
                "La Luna pasará entre La Tierra y el Sol creando un eclipse solar $0$. Será visible desde $1$."
            ],
            titleTxt: [
                "Eclipse lunar $0$",
                "Eclipse solar $0$"
            ]
        }, {
            label: "Equinoccio / solsticio",
            multipleTxt: 1,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Equinoccio de Marzo",
                    val: "00",
                }, {
                    label: "Solsticio de Junio",
                    val: "11",
                }, {
                    label: "Equinoccio de Septiembre",
                    val: "22",
                }, {
                    label: "Solsticio de Diciembre",
                    val: "33",
                }]
            }],
            text: [
                "El equinoccio de marzo marca el primer día de primavera para el hemisferio norte y el primer día de otoño para el hemisferio sur. El día y la noche duran casi exactamente 12 horas.",
                "El solsticio de junio marca el primer día de verano para el hemisferio norte y el primer día de invierno para el hemisferio sur. El 20 de junio será el día más largo de 2021 en el hemisferio norte y el más corto en el hemisferio sur.",
                "El equinoccio de septiembre marca el primer día de otoño para el hemisferio norte y el primer día de primavera para el hemisferio sur. El día y la noche duran casi exactamente 12 horas.",
                "El solsticio de diciembre marca el primer día de invierno para el hemisferio norte y el primer día de verano para el hemisferio sur. El 21 de diciembre será el día más corto de 2021 en el hemisferio norte y el más largo en el hemisferio sur."
            ],
            titleTxt: [
                "Equinoccio de Marzo",
                "Solsticio de Junio",
                "Equinoccio de Septiembre",
                "Solsticio de Diciembre"
            ]
        }],
        //****************
        en: [{
            label: "Solar Conjunction",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "None",
                    val: "00",
                }, {
                    label: "Superior",
                    val: "01",
                }, {
                    label: "Inferior",
                    val: "12",
                }]
            }, {
                label: "Cuerpo",
                type: "text"
            }, {
                label: "Separación (gradºmin')",
                type: "text",
                placeholder: "0º0\'"
            }],
            text: [
                "$1$ will pass very close to the Sun in the sky since it will be in the opposite side of the Sun. At closest approach, it will appear at a separation of only $2$ from the Sun.",
                "$1$ will pass very close to the Sun in the sky as its orbit carries it between the Sun and Earth. At closest approach, it will appear at a separation of only $2$ from the Sun."
            ],
            titleTxt: [
                "$1$ at solar conjunction",
                "$1$ at solar superior conjunction",
                "$1$ at solar inferior conjunction"
            ]
        }, {
            label: "Conjunction / Close aproach of two bodies",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Conjunction",
                    val: "00",
                }, {
                    label: "Close aproach",
                    val: "11",
                }]
            }, {
                label: "Body 1",
                type: "text"
            }, {
                label: "Body 2",
                type: "text"
            }, {
                label: "Separation (degºmin')",
                type: "text",
                placeholder: "0º0\'"
            }],
            text: [
                "$1$ and $2$ will share the same right ascension, with $1$ passing $3$ to the south of $2$.",
                "$1$ and $2$ will make a close approach, passing within $3$ of each other in the sky."
            ],
            titleTxt: [
                "Conjunction of $1$ and $2$",
                "Close approach of $1$ and $2$"
            ]
        }, {
            label: "Lunar phase",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "New Moon",
                    val: "00",
                }, {
                    label: "Moon at First Quarter",
                    val: "11",
                }, {
                    label: "Full Moon",
                    val: "22",
                }, {
                    label: "Moon at Last Quarter",
                    val: "33",
                }, {
                    label: "Supermoon",
                    val: "44",
                }]
            }],
            text: [
                "The Moon will pass close to the Sun and become lost in the its glare for a few days.",
                "The Moon will pass first quarter phase, during this time it appears almost exactly half illuminated.",
                "The Moon will be almost exactly on the other side of the Sun and will appear fully illuminated.",
                "The Moon will pass last quarter phase, during this time it appears almost exactly half illuminated.",
                "Due to the closeness of the Full Moon and the Moon at Perigee events, this month the Full Moon will appear larger than normal.",
            ],
            titleTxt: [
                "New Moon",
                "Moon at First Quarter",
                "Full Moon",
                "Moon at Last Quarter",
                "Supermoon"
            ]
        }, {
            label: "M/NGC/IC/other well placed / opposition",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Well placed",
                    val: "00",
                }, {
                    label: "Opposition",
                    val: "11",
                }]
            }, {
                label: "Short name",
                type: "text"
            }, {
                label: "Long name",
                type: "text"
            }, {
                label: "Constellation",
                type: "text"
            }],
            text: [
                "$2$ will be well placed, high in the sky. It will reach its highest point in the sky in the constellation of $3$ at around midnight local time.",
                "$2$ will reach opposition and will be visible for much of the night, when it lies opposite to the Sun in the sky in the constellation of $3$."
            ],
            titleTxt: [
                "$1$ well placed",
                "$1$ reaches opposition"
            ]
        }, {
            label: "Apogee",
            multipleTxt: 1,
            options: [{
                label: "Body",
                selTxt: true,
                type: "select",
                options: [{
                    label: "The Moon",
                    val: "00",
                }, {
                    label: "Other",
                    val: "11",
                }],
                valForSub: "11",
                sub: [{
                    label: "Short name",
                    type: "text"
                }, {
                    label: "Long name",
                    type: "text"
                }, {
                    label: "Distance (AU)",
                    type: "number"
                }]
            }],
            text: [
                "The Moon will reach the furthest point along its orbit to the Earth and will appear slightly smaller than at other times.",
                "$0-1$ will reach the furthest point along its orbit to the Earth, at a distance of $0-2$ AU."
            ],
            titleTxt: [
                "Moon at apogee",
                "$0-0$ at apogee"
            ]
        }, {
            label: "Perigee",
            val: 5,
            multipleTxt: 1,
            options: [{
                label: "Body",
                selTxt: true,
                type: "select",
                options: [{
                    label: "The Moon",
                    val: "00",
                }, {
                    label: "Other",
                    val: "11",
                }],
                valForSub: "11",
                sub: [{
                    label: "Short name",
                    type: "text"
                }, {
                    label: "Long name",
                    type: "text"
                }, {
                    label: "Distance (AU)",
                    type: "number"
                }]
            }],
            text: [
                "The Moon will reach the closest point along its orbit to the Earth and will appear slightly larger than at other times.",
                "$0-1$ will make its closest approach to the Earth, at a distance of $0-2$ AU."
            ],
            titleTxt: [
                "The Moon at perigee",
                "$0-0$ at perigeoe"
            ]
        }, {
            label: "Aphelion / Perihelion",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Aphelion",
                    val: "00",
                }, {
                    label: "Perihelion",
                    val: "11",
                }],
            }, {
                label: "Short name",
                type: "text"
            }, {
                label: "Long name",
                type: "text"
            }, {
                label: "Distance (AU)",
                type: "number"
            }],
            text: [
                "$2$ will reach the furthest point along its orbit to the Sun, at a distance of $3$ AU",
                "$2$ will reach the closest point along its orbit to the Sun, at a distance of $3$ AU."
            ],
            titleTxt: [
                "$1$ at aphelion",
                "$1$ at perihelion"
            ]
        }, {
            label: "Retrograde motion",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Enters",
                    val: "00",
                }, {
                    label: "Ends",
                    val: "11",
                }],
            }, {
                label: "Planet",
                type: "text"
            }],
            text: [
                "$1$ will enter retrograde motion, halting its usual eastward movement through the constellations, and turning to move westwards instead.<br>This reversal of direction is a phenomenon cuased the change of perspective due to Earth's and the outer planet's position. It occurs a few months before they reach opposition.",
                "$1$ will reach the end of its retrograde motion, ending its westward movement through the constellations and returning to more usual eastward motion instead.<br>This reversal of direction is a phenomenon cuased the change of perspective due to Earth's and the outer planet's position. It occurs a few months after they pass opposition."
            ],
            titleTxt: [
                "$1$ enters retrograde motion",
                "$1$ ends retrograde motion"
            ]
        }, {
            label: "Eclipse",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Lunar",
                    val: "00",
                }, {
                    label: "Solar",
                    val: "11",
                }]
            }, {
                label: "Subtype",
                type: "select",
                options: [{
                    label: "Total",
                    val: " total",
                }, {
                    label: "Partial",
                    val: " partial",
                }, {
                    label: "Penumbral",
                    val: " penumbral",
                }, {
                    label: "Annular",
                    val: "n annular",
                }, {
                    label: "Hybrid",
                    val: " hybrid total / annular",
                }],
            }, {
                label: "Zones",
                type: "text",
            }],
            text: [
                "The Moon will pass through the Earth's shadow, creating a$0$ lunar eclipse. It will be visible from $1$.",
                "The Moon will pass in front of the Sun, creating a$0$ solar eclipse. It will be visible from $1$."
            ],
            titleTxt: [
                "$0L$ Lunar eclipse",
                "$0L$ Solar eclipse"
            ]
        }, {
            label: "Equinox / solstice",
            multipleTxt: 1,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "March Equinox",
                    val: "00",
                }, {
                    label: "June Solstice",
                    val: "11",
                }, {
                    label: "September Equinox",
                    val: "22",
                }, {
                    label: "December Solstice",
                    val: "33",
                }]
            }],
            text: [
                "The March equinox marks the first day of spring for the northern hemisphere and the first day of autumn for the southern hemisphere. Day and night last almost exactly 12 hours.",
                "The June solstice marks the first day of summer for the Northern Hemisphere and the first day of winter for the Southern Hemisphere. June 20 will be the longest day of 2021 in the Northern Hemisphere and the shortest in the Southern Hemisphere. ",
                "The September equinox marks the first day of autumn for the northern hemisphere and the first day of spring for the southern hemisphere. Day and night last almost exactly 12 hours.",
                "The December solstice marks the first day of winter for the Northern Hemisphere and the first day of summer for the Southern Hemisphere. December 21 will be the shortest day of 2021 in the Northern Hemisphere and the longest in the Southern Hemisphere."
            ],
            titleTxt: [
                "March Equinox",
                "June Solstice",
                "September Equinox",
                "December Solstice"
            ]
        }]
    }).then(() => {
        console.log('Success!');
        res.send('Success!');
        return null;
    }).catch(err => {
        console.log(err)
        res.send(err);
        return null;
    });
});
exports.formatDB = functions.region('us-central1').https.onRequest((req, res) => {
    return db.collection('galletas').get().then(snap => {
        const promises = [];
        snap.forEach(doc => {
            promises.push(db.collection('galletasCont').doc(doc.id).get().then(doc2 => {
                let fixedCats = [];
                let tCats = ['astronomia', 'biologia', 'curiosidades', 'fisica', 'tecnologia']
                tCats.forEach(cat => {
                    if (doc.data().cats.includes(cat)) fixedCats.push(cat);
                })
                return db.collection('cookies/langs/es').doc(doc.id).set({
                    authors: doc2.data().authors,
                    cont: doc2.data().cont,
                    media: doc2.data().media,
                    picUrl: doc2.data().picUrl,
                    title: doc.data().title,
                    description: doc2.data().description,
                    file: doc2.data().file,
                    owner: doc2.data().owner,
                    java: doc2.data().java,
                    revised: {},
                    notify: false,
                    public: doc2.data().public,
                    beenPublic: doc2.data().beenPublic,
                    dledit: false,
                    created: doc2.data().created,
                    ledit: doc2.data().ledit,
                    published: doc2.data().published,
                    pop: doc.data().pop,
                    likes: doc.data().likes,
                    favs: doc.data().favs,
                    url: doc.data().url + '/',
                    fixedCats: fixedCats,
                    cats: doc.data().cats,
                    translations: {
                        es: doc.data().url + '/'
                    },
                    old: true
                })/*.then(() => {
                    return db.collection('cookies/langs/en').doc(doc.id).update({
                        authors: doc2.data().authors,
                        cont: [
                            {
                                type: "head",
                                title: doc2.data().title,
                                author: doc2.data().authors
                            },
                            {
                                type: "ref",
                                ref: []
                            }
                        ],
                        media: doc2.data().media,
                        picUrl: doc2.data().picUrl,
                        title: doc.data().title,
                        description: doc2.data().description,
                        file: doc2.data().file,
                        owner: doc2.data().owner,
                        java: doc2.data().java,
                        revised: {},
                        notify: false,
                        public: doc2.data().public,
                        beenPublic: doc2.data().beenPublic,
                        dledit: false,
                        created: doc2.data().created,
                        ledit: doc2.data().ledit,
                        published: doc2.data().published,
                        pop: doc.data().pop,
                        likes: doc.data().likes,
                        favs: doc.data().favs,
                        url: doc.data().url.replace('galletas', 'cookies') + '/',
                        fixedCats: fixedCats,
                        cats: doc.data().cats,
                        translations: {
                            es: doc.data().url.replace('galletas', 'cookies') + '/'
                        },
                        old: true
                    });
                });*/
            }));
        });
        return Promise.all(promises);
    }).then(() => {
        console.log("Successful");
        res.send('Successful');
        return;
    }).catch(err => {
        console.log(err);
        res.send(err);
        return;
    });
});
exports.formatDBC = functions.region('us-central1').https.onRequest((req, res) => {
    return db.collection('calendarios').get().then(snap => {
        const promises = [];
        snap.forEach(doc => {
            promises.push(db.collection('calendars/langs/es').doc(doc.id).set({
                events: doc.data().events,
                published: doc.data().date,
                description: doc.data().description,
                descriptionShort: doc.data().descriptionShort,
                finished: doc.data().finished,
                pastDue: doc.data().pastDue,
                picUrl: doc.data().picUrl,
                picAlt: doc.data().picAlt,
                picCapt: doc.data().picCapt,
                public: doc.data().public,
                sentMail: doc.data().sentMail,
                revised: doc.data().revised,
                title: doc.data().title,
                url: doc.data().url + '/',
                nextCal: doc.data().nextCal + '/',
                priorCal: doc.data().priorCal + '/',
                weeks: doc.data().weeks,
                translations: {
                    es: doc.data().url + '/'
                },
                old: true
            }).then(() => {
                return db.collection('calendars/langs/en').doc(doc.id).set({
                    events: doc.data().events,
                    published: doc.data().date,
                    description: doc.data().description,
                    descriptionShort: doc.data().descriptionShort,
                    finished: doc.data().finished,
                    pastDue: doc.data().pastDue,
                    picUrl: doc.data().picUrl,
                    picAlt: doc.data().picAlt,
                    picCapt: doc.data().picCapt,
                    public: doc.data().public,
                    sentMail: doc.data().sentMail,
                    revised: doc.data().revised,
                    title: doc.data().title,
                    url: doc.data().url.replace('calendario-astronomico', 'astronomic-calendar') + '/',
                    nextCal: doc.data().nextCal.replace('calendario-astronomico', 'astronomic-calendar') + '/',
                    priorCal: doc.data().priorCal.replace('calendario-astronomico', 'astronomic-calendar') + '/',
                    weeks: doc.data().weeks,
                    translations: {
                        es: doc.data().url + '/'
                    },
                    old: true
                });
            }));
        });
        return Promise.all(promises);
    }).then(() => {
        console.log("Successful");
        res.send('Successful');
        return;
    }).catch(err => {
        console.log(err);
        res.send(err);
        return;
    });
});

//Comment in a Cookie
exports.addComment = functions.region('us-east1').https.onCall((data) => {
    let comCount, comList, comFrm;
    return db.collection('usersPublic').doc(data.authKey).get().then(doc => {
        let block = doc.data().block;
        if (block - admin.firestore.Timestamp.now() > 0) {
            return {
                res: -2,
                blc: block,
            };
        }
        else {
            return db.collection('galletas').doc(data.id).collection('coms').doc('1').get();
        }
    }).then(doc => {
        if (doc.res == -2) return doc;
        if (doc.exists) {
            comList = doc.data().coms;
            comCount = doc.data().comCount;
        } else {
            comCount = 0;
            comList = [];
        }
        comFrm = {
            from: data.from,
            pic: data.pic,
            authKey: data.authKey,
            id: 0,
            likes: 0,
            text: data.text,
        };
        if (data.to == -1) {
            comFrm.reps = [];
            comFrm.id = comList.length;
            comList.push(comFrm);
        } else {
            comFrm.id = comList[data.to].reps.length;
            comList[data.to].reps.push(comFrm);
        }
        comCount++;
        return db.collection('galletas').doc(data.id).collection('coms').doc('1').set({
            coms: comList,
            comCount: comCount,
        });
    }).then(some => {
        console.log(some);
        if (some != null && some.res == -2) return some;
        if (data.to == -1) {
            return {
                res: 0,
                pos: comList.length - 1,
                com: comFrm,
            };
        } else {
            return {
                res: 1,
                pos: data.to,
                com: comFrm,
            };
        }
    }).catch(err => {
        console.log(err);
        return { res: -1 };
    });
});