import { initializeApp } from 'firebase-admin/app';
initializeApp();

import * as functions from 'firebase-functions';
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
const firestore = getFirestore();

import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId({ length: 8 });

//Config setups
export const setCalConfig = functions.region('us-central1').https.onRequest((req, res) => {
    firestore.collection('config').doc('calTypes').set({
        visOpts: {
            es: ["Visible a simple vista", "Visible con binoculares", "Visible con un telescopio pequeño", "Visible con un telescopio de 4 pulgadas", "Visible con un telescopio grande", "No observable"],
            en: ["Visible to the naked eye", "Visible with binoculars", "Visible with a small telescope", "Visible with a 4 inch telescope", "Visible with a large telescope", "Not observable"]
        },
        es: [{
            label: "HTML",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Título",
                type: "text"
            }, {
                translatable: true,
                label: "Descripción",
                type: "textarea",
            }],
            text: ["$1$"],
            titleTxt: ["$0$"]
        }, {
            label: "Conjunción Solar",
            multipleTxt: true,
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
                translatable: true,
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
            ],
            defaultVis: 5
        }, {
            label: "Conjunción / Acercamiento de dos cuerpos",
            val: 1,
            multipleTxt: true,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Conjunción",
                    val: "00",
                }, {
                    label: "Acercamiento",
                    val: "11",
                }],
                valForSub: "00",
                sub: [{
                    label: "Dirección",
                    type: "select",
                    options: [{
                        label: "Norte",
                        val: "norte",
                    }, {
                        label: "Sur",
                        val: "sur",
                    }]
                }]
            }, {
                translatable: true,
                label: "Cuerpo 1",
                type: "text"
            }, {
                translatable: true,
                label: "Cuerpo 2",
                type: "text"
            }, {
                label: "Separación (gradºmin')",
                type: "text",
                placeholder: "0º0\'"
            }],
            text: [
                "$1$ y $2$ compartirán la misma ascensión recta, con $1$ pasando a $3$ al $0-0$ de $2$.",
                "$1$ y $2$ pasarán a solo $3$ uno del otro en el cielo."
            ],
            titleTxt: [
                "Conjunción de $1$ y $2$",
                "Acercamiento de $1$ y $2$"
            ]
        }, {
            label: "Fase lunar",
            multipleTxt: true,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Luna Nueva",
                    val: "00",
                    defaultVis: 5
                }, {
                    label: "Cuarto Creciente",
                    val: "11",
                }, {
                    label: "Luna Llena",
                    val: "22",
                }, {
                    label: "Cuarto Menguante",
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
                "Luna en Cuarto Menguante",
                "Superluna"
            ]
        }, {
            label: "M / NGC / IC / otro en buena posición / oposición",
            multipleTxt: true,
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
                translatable: true,
                label: "Nombre corto",
                type: "text"
            }, {
                translatable: true,
                label: "Nombre largo",
                type: "text"
            }, {
                translatable: true,
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
            multipleTxt: true,
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
                    translatable: true,
                    label: "Nombre corto",
                    type: "text"
                }, {
                    translatable: true,
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
            multipleTxt: true,
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
                    translatable: true,
                    label: "Nombre corto",
                    type: "text"
                }, {
                    translatable: true,
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
            multipleTxt: true,
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
                translatable: true,
                label: "Nombre corto",
                type: "text"
            }, {
                translatable: true,
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
            ],
            defaultVis: 5
        }, {
            label: "Movimiento retrógrada",
            multipleTxt: true,
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
                type: "select",
                options: [{
                    label: "Júpiter",
                    val: "Júpiter",
                }, {
                    label: "Saturno",
                    val: "Saturno",
                }, {
                    label: "Urano",
                    val: "Urano",
                    defaultVis: 1
                }, {
                    label: "Neptuno",
                    val: "Neptuno",
                    defaultVis: 2
                }],
            }],
            text: [
                "$1$ detendrá su usual movimiento en dirección este a través de las constelaciones y comenzará a moverse hacia el oeste.<br>Este cambio de dirección es un fenómeno debido al cambio de perspectiva por la posición de La Tierra y los planetas exteriores. Ocurre unos meses antes de alcanzar la oposición.",
                "$1$ detendrá su movimiento en dirección oeste a través de las constelaciones y comenzará a moverse de nuevo hacia el este.<br>Este cambio de dirección es un fenómeno debido al cambio de perspectiva por la posición de La Tierra y los planetas exteriores. Ocurre unos meses después de pasar la oposición."
            ],
            titleTxt: [
                "$1$ entra en movimiento retrógrada",
                "$1$ termina su movimiento retrógrada"
            ]
        }, {
            label: "Eclipse",
            multipleTxt: true,
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
                translatable: true,
                label: "Zonas",
                type: "text",
            }],
            text: [
                "La Luna pasará por la sombra de La Tierra creando un eclipse lunar $1$. Será visible desde $2$.",
                "La Luna pasará entre La Tierra y el Sol creando un eclipse solar $1$. Será visible desde $2$."
            ],
            titleTxt: [
                "Eclipse lunar $1$",
                "Eclipse solar $1$"
            ]
        }, {
            label: "Equinoccio / solsticio",
            multipleTxt: true,
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
            ],
            defaultVis: 5
        }, {
            label: "Lluvia de estrellas",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Nombre",
                type: "text"
            }, {
                translatable: true,
                label: "Inicio",
                type: "text"
            }, {
                translatable: true,
                label: "Fin",
                type: "text"
            }, {
                translatable: true,
                label: "Pico",
                type: "text"
            }, {
                translatable: true,
                label: "Constelación",
                type: "text"
            }],
            text: ["La lluvia de estrellas $0$ del $g-year$ estará activa del $1$ al $2$ y alcanzará su pico el $3$. Se observarán mejor alrededor de la constelación de $4$."],
            titleTxt: ["Lluvia de estrellas $0$ $g-year$"]
        }, {
            label: "Ocultamiento lunar",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Cuerpo",
                type: "text"
            }, {
                translatable: true,
                label: "Zonas",
                type: "text",
            }],
            text: ["La Luna pasará enfrente de $0$ ocultándolo para $1$. Debido a la cercanía de la Luna a la Tierra, un ocultamiento no es visible desde todo el mundo."],
            titleTxt: ["Ocultamiento lunar de $0$"]
        }, {
            label: "Alcanza su brillo máximo",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Cuerpo",
                type: "text"
            }, {
                label: "Distancia del sol (UA)",
                type: "number"
            }, {
                label: "Distancia de la Tierra (UA)",
                type: "number"
            }],
            text: ["$0$ alcanzará su brillo máximo. Estará a una distancia de $1$ UA del Sol, y a una distancia de $2$ UA de la Tierra."],
            titleTxt: ["$0$ alcanza su brillo máximo"]
        }, {
            label: "Cuerpo en",
            multipleTxt: true,
            options: [{
                label: "Tipo",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Dicotomía",
                    val: "00",
                }, {
                    label: "Mayor elongación oeste",
                    val: "11",
                }, {
                    label: "Mayor elongación este",
                    val: "22",
                }, {
                    label: "Brillo máximo",
                    val: "33",
                }, {
                    label: "Mayor altitud en el cielo",
                    val: "44",
                }]
            }, {
                translatable: true,
                label: "Cuerpo",
                type: "text"
            }, {
                translatable: true,
                label: "Aparición",
                type: "text"
            }, {
                label: "Tiempo",
                type: "select",
                options: [{
                    label: "Matutino",
                    val: "matutin",
                }, {
                    label: "Vespertino",
                    val: "vespertin",
                }]
            }, {
                label: "Magnitud",
                type: "number"
            }],
            text: [
                "$1$ alcanzará su fase media en su aparición $3$a de $2$. Estará brillando con magnitud $4$.",
                "$1$ alcanzará su mayor separación del Sol en su aparición $3$a de $2$. Estará brillando con magnitud $4$.",
                "$1$ alcanzará su mayor separación del Sol en su aparición $3$a de $2$. Estará brillando con magnitud $4$.",
                "$1$ alcanzará su brillo máximo en su aparición $3$a de $2$. Estará brillando con magnitud $4$.",
                "$1$ alcanzará su mayor altitud en el cielo en su aparición $3$a de $2$. Estará brillando con magnitud $4$."
            ],
            titleTxt: [
                "$1$ en dicotomía",
                "$1$ en mayor elongación oeste",
                "$1$ en mayor elongación este",
                "$1$ en brillo máximo",
                "$1$ en su mayor altitud en el cielo $3$o"
            ]
        }],
        //****************
        en: [{
            label: "HTML",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Title",
                type: "text"
            }, {
                translatable: true,
                label: "Description",
                type: "textarea",
            }],
            text: ["$1$"],
            titleTxt: ["$0$"]
        }, {
            label: "Solar Conjunction",
            multipleTxt: true,
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
                translatable: true,
                label: "Body",
                type: "text"
            }, {
                label: "Separation (degºmin')",
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
            ],
            defaultVis: 5
        }, {
            label: "Conjunction / Close aproach of two bodies",
            multipleTxt: true,
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
                }],
                valForSub: "00",
                sub: [{
                    label: "Direction",
                    type: "select",
                    options: [{
                        label: "North",
                        val: "north",
                    }, {
                        label: "South",
                        val: "south",
                    }]
                }]
            }, {
                translatable: true,
                label: "Body 1",
                type: "text"
            }, {
                translatable: true,
                label: "Body 2",
                type: "text"
            }, {
                label: "Separation (degºmin')",
                type: "text",
                placeholder: "0º0\'"
            }],
            text: [
                "$1$ and $2$ will share the same right ascension, with $1$ passing $3$ to the $0-0$ of $2$.",
                "$1$ and $2$ will make a close approach, passing within $3$ of each other in the sky."
            ],
            titleTxt: [
                "Conjunction of $1$ and $2$",
                "Close approach of $1$ and $2$"
            ]
        }, {
            label: "Lunar phase",
            multipleTxt: true,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "New Moon",
                    val: "00",
                    defaultVis: 5
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
            multipleTxt: true,
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
                translatable: true,
                label: "Short name",
                type: "text"
            }, {
                translatable: true,
                label: "Long name",
                type: "text"
            }, {
                translatable: true,
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
            multipleTxt: true,
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
                    translatable: true,
                    label: "Short name",
                    type: "text"
                }, {
                    translatable: true,
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
            multipleTxt: true,
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
                    translatable: true,
                    label: "Short name",
                    type: "text"
                }, {
                    translatable: true,
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
            multipleTxt: true,
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
                translatable: true,
                label: "Short name",
                type: "text"
            }, {
                translatable: true,
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
            ],
            defaultVis: 5
        }, {
            label: "Retrograde motion",
            multipleTxt: true,
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
                type: "select",
                options: [{
                    label: "Jupiter",
                    val: "Jupiter",
                }, {
                    label: "Saturn",
                    val: "Saturn",
                }, {
                    label: "Uranus",
                    val: "Uranus",
                    defaultVis: 1
                }, {
                    label: "Neptune",
                    val: "Neptune",
                    defaultVis: 2
                }],
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
            multipleTxt: true,
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
                translatable: true,
                label: "Zones",
                type: "text",
            }],
            text: [
                "The Moon will pass through the Earth's shadow, creating a$1$ lunar eclipse. It will be visible from $2$.",
                "The Moon will pass in front of the Sun, creating a$1$ solar eclipse. It will be visible from $2$."
            ],
            titleTxt: [
                "$1L$ Lunar eclipse",
                "$1L$ Solar eclipse"
            ]
        }, {
            label: "Equinox / solstice",
            multipleTxt: true,
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
            ],
            defaultVis: 5
        }, {
            label: "Meteor shower",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Name",
                type: "text"
            }, {
                translatable: true,
                label: "beginning",
                type: "text"
            }, {
                translatable: true,
                label: "End",
                type: "text"
            }, {
                translatable: true,
                label: "Peak",
                type: "text"
            }, {
                translatable: true,
                label: "Constellation",
                type: "text"
            }],
            text: ["The $0$ meteor shower $g-year$ will be active from $1$ to $2$, producing its peak rate of meteors around $3$. It will be best seen around the constellation of $4$."],
            titleTxt: ["$0$ meteor shower $g-year$"]
        }, {
            label: "Lunar occultation",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Body",
                type: "text"
            }, {
                translatable: true,
                label: "Zones",
                type: "text",
            }],
            text: ["The Moon will pass in front of $0$, creating a lunar occultation visible from $1$. Due to the closeness of the Moon to the Earth, a lunar occultation is not visible all the world."],
            titleTxt: ["Lunar occultation of $0$"]
        }, {
            label: "Reaches its brightest",
            multipleTxt: false,
            options: [{
                translatable: true,
                label: "Body",
                type: "text"
            }, {
                label: "Distance from the Sun (AU)",
                type: "number"
            }, {
                label: "Distance from Earth (AU)",
                type: "number"
            }],
            text: ["$0$ will reach its brightest. It will lie at a distance of $1$ AU from the Sun, and at a distance of $2$ AU from the Earth."],
            titleTxt: ["$0$ reaches its brightest"]
        }, {
            label: "Body at",
            multipleTxt: true,
            options: [{
                label: "Type",
                selTxt: true,
                type: "select",
                options: [{
                    label: "Dichotomy",
                    val: "00",
                }, {
                    label: "Greatest elongation west",
                    val: "11",
                }, {
                    label: "Greatest elongation east",
                    val: "22",
                }, {
                    label: "Greatest brightness",
                    val: "33",
                }, {
                    label: "Highest altitude in evening sky",
                    val: "44",
                }]
            }, {
                translatable: true,
                label: "Body",
                type: "text"
            }, {
                translatable: true,
                label: "Aparition",
                type: "text"
            }, {
                label: "Time",
                type: "select",
                options: [{
                    label: "Morning",
                    val: "morning",
                }, {
                    label: "Evening",
                    val: "evening",
                }]
            }, {
                label: "Magnitude",
                type: "number"
            }],
            text: [
                "$1$ will reach half phase in its $2$ $3$ apparition. It will be shining brightly at mag $4$.",
                "$1$ will reach its greatest separation from the Sun in its $2$ $3$ apparition. It will be shining brightly at mag $4$.",
                "$1$ will reach its greatest separation from the Sun in its $2$ $3$ apparition. It will be shining brightly at mag $4$.",
                "$1$ will reach its greatest brightness in its $2$ $3$ apparition. It will be shining brightly at mag $4$.",
                "$1$ will reach its highest point in the sky in its $2$ $3$ apparition. It will be shining brightly at mag $4$."
            ],
            titleTxt: [
                "$1$ at dichotomy",
                "$1$ at greatest elongation west",
                "$1$ at greatest elongation east",
                "$1$ at greatest brightness",
                "$1$ at highest altitude in $3$ sky"
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

export const setupTranslationReplacements = functions.region('us-central1').https.onRequest((req, res) => {
    firestore.collection('config').doc('postTrans').set({
        words: {
            es: {
                en: {
                    Aquarium: "Aquarius"
                }
            },
            en: {
                es: {

                }
            },
            nolang: {
                " / ": "/"
            }
        }
    }).then(() => {
        res.send('Successful');
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});


//Not often used

//New cookie field - fileTranslations
async function ft_step1() {
    const snap = await firestore.collection('cookies/langs/es').get();
    snap.forEach(async doc => {
        const den = await firestore.collection('cookies/langs/en').doc(doc.id).get();
        let fileTranslations = {
            es: doc.data().file,
            en: den.data().file
        }
        await firestore.collection('cookies/langs/es').doc(doc.id).update({
            fileTranslations: fileTranslations
        });
        await firestore.collection('cookies/langs/en').doc(doc.id).update({
            fileTranslations: fileTranslations
        });
    });
}
async function ft_step2() {
    const snap = await firestore.collection('cookies/langs/es').get();
    snap.forEach(async doc => {
        await firestore.collection('cookies/langs/es').doc(doc.id).update({
            translations: FieldValue.delete(),
            file: FieldValue.delete(),
            url: FieldValue.delete()
        });
        await firestore.collection('cookies/langs/en').doc(doc.id).update({
            translations: FieldValue.delete(),
            file: FieldValue.delete(),
            url: FieldValue.delete()
        });
    });
}
async function ft_step3() {
    const snap = await firestore.collection('cookies/langs/es').get();
    snap.forEach(async doc => {
        let dat = doc.data();
        const snapEn = await firestore.collection('cookies/langs/en').doc(doc.id).get();
        let den = snapEn.data();
        dat.cont.forEach((sect, i) => {
            let sectKey = sect.key;
            if (!sectKey) {
                sectKey = i + Math.floor(Date.now() / 1000);
            }
            dat.cont[i].key = sectKey;
            den.cont[i].key = sectKey;
            if (dat.cont[i].type == 'medSimple' && dat.cont[i].width.slice(-1) == '%') {
                dat.cont[i].width = dat.cont[i].width.slice(0, -1);
            }
        });
        dat.media.forEach((media, i) => {
            let mediaKey = media.key;
            if (!mediaKey) {
                mediaKey = i + Math.floor(Date.now() / 1000);
            }
            dat.media[i].key = mediaKey;
        })
        await firestore.collection('cookies/langs/es').doc(doc.id).update({
            cont: dat.cont,
            media: dat.media
        });
        await firestore.collection('cookies/langs/en').doc(doc.id).update({
            cont: den.cont,
            media: dat.media
        });
    });
}
async function ft_step4() {
    const snap = await firestore.collection('calendars/langs/es').get();
    snap.forEach(async doc => {
        await firestore.collection('calendars/langs/es').doc(doc.id).update({
            translations: FieldValue.delete(),
            url: FieldValue.delete()
        });
        await firestore.collection('calendars/langs/en').doc(doc.id).update({
            translations: FieldValue.delete(),
            url: FieldValue.delete()
        });
    });
}
async function ft_step5() {
    await firestore.collection('config').doc('authors').set({
        authors: [' Andrea Garma', ' Javier Pantoja', ' Paulina Vargas']
    });
}
export const urlTranslations = functions.region('us-central1').https.onRequest(async (req, res) => {
    try {
        console.log("Step 1");
        await ft_step1();
        console.log("Step 2");
        await ft_step2();
        console.log("Step 3");
        await ft_step3();
        console.log("Step 4");
        await ft_step4();
        console.log("Step 5");
        await ft_step5();

        console.log("Successful");
        res.send('Success!');
        return;
    } catch (err) {
        console.log(err);
        res.send(err);
        return;
    }
});

export const mergeUsers = functions.region('us-central1').https.onRequest((req, res) => {
    return firestore.collection('users').get().then(snap => {
        const promises = [];
        snap.forEach(doc => {
            promises.push(firestore.collection('users').doc(doc.id).update({
                shortID: uid()
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

export const formatDBCtemp = functions.region('us-central1').https.onRequest((req, res) => {
    return firestore.collection('calendars/langs/es').doc("202107").get().then(doc => {
        let events = {};
        for (const [key, event] of Object.entries(doc.data().events)) {
            events[key] = {
                date: event.date.es,
                horario: event.horario,
                description: event.description,
                name: event.name,
                visibilidad: event.visibilidad,
            };
        }
        return firestore.collection('calendarios').doc("202107").set({
            events: events,
            date: doc.data().published,
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
            url: doc.data().url,
            nextCal: doc.data().nextCal,
            priorCal: doc.data().priorCal,
            weeks: doc.data().weeks,
        });
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