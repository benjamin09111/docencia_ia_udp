// Nómina oficial real de estudiantes Canvas UDP
export interface StudentRosterItem {
  canvas_id: number;
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  seccionId: string;
  codigo?: string;
}

export const INITIAL_STUDENTS_ROSTER: StudentRosterItem[] = [
  {
    "canvas_id": 41613,
    "rut": "20.41.613-7",
    "nombres": "MARTÍN DE JESÚS",
    "apellidos": "ALIAGA ROJAS",
    "email": "martin.aliaga2@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 10206,
    "rut": "20.10.206-1",
    "nombres": "SEBASTIÁN IGNACIO",
    "apellidos": "ALONZO OYARZÚN",
    "email": "sebastian.alonzo@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 42009,
    "rut": "20.42.9-7",
    "nombres": "BENJAMÍN ANDRÉS",
    "apellidos": "ARGÜELLES MARTÍN",
    "email": "benjamin.arguelles@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41401,
    "rut": "20.41.401-2",
    "nombres": "DIEGO IGNACIO",
    "apellidos": "BANDA GÁLVEZ",
    "email": "diego.banda@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 3151,
    "rut": "20.3.151-2",
    "nombres": "VICENTE JOSÉ",
    "apellidos": "CASTRO DE LA PRIDA",
    "email": "vicente.castro_d@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 29380,
    "rut": "20.29.380-5",
    "nombres": "JAIRO BASTIÁN",
    "apellidos": "CHACANA TORIBIO",
    "email": "jairo.chacana@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41367,
    "rut": "20.41.367-4",
    "nombres": "EDUARDO ARIEL",
    "apellidos": "ESCALONA LAMIG",
    "email": "eduardo.escalona1@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 47765,
    "rut": "20.47.765-3",
    "nombres": "DIEGO ANDRÉS",
    "apellidos": "ESCOBAR GONZÁLEZ",
    "email": "diego.escobar1@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 29224,
    "rut": "20.29.224-2",
    "nombres": "ÁLVARO SEBASTIÁN",
    "apellidos": "GUERRERO HORMAZÁBAL",
    "email": "alvaro.guerrero2@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 29242,
    "rut": "20.29.242-2",
    "nombres": "SEBASTIAN",
    "apellidos": "GULFO SERNA",
    "email": "sebastian.gulfo@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 12892,
    "rut": "20.12.892-5",
    "nombres": "IGNACIO ANDRÉS",
    "apellidos": "GUTIÉRREZ MOSQUEIRA",
    "email": "ignacio.gutierrez1@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 42253,
    "rut": "20.42.253-8",
    "nombres": "DONOVAN ANDRÉS",
    "apellidos": "ITURRA VALDIVIA",
    "email": "donovan.iturra@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 29309,
    "rut": "20.29.309-6",
    "nombres": "BASTIÁN ALONSO",
    "apellidos": "LOBOS FERNÁNDEZ",
    "email": "bastian.lobos1@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41835,
    "rut": "20.41.835-4",
    "nombres": "ALEX IGNACIO",
    "apellidos": "MARAMBIO LEYTON",
    "email": "alex.marambio@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 29290,
    "rut": "20.29.290-5",
    "nombres": "IGNACIO ENRIQUE",
    "apellidos": "MARTÍNEZ VERGARA",
    "email": "ignacio.martinez2@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 1281,
    "rut": "20.1.281-4",
    "nombres": "IGNACIO ALEJANDRO",
    "apellidos": "ORELLANA ARRUÉ",
    "email": "ignacio.orellana_a@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 3159,
    "rut": "20.3.159-1",
    "nombres": "BASTIÁN IGNACIO",
    "apellidos": "ORTIZ DE ZÁRATE VERGARA",
    "email": "bastian.ortizdezarate_v@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41370,
    "rut": "20.41.370-7",
    "nombres": "DIEGO ANDRES",
    "apellidos": "PEÑA Y LILLO RUIZ",
    "email": "diego.penaylillo@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 42225,
    "rut": "20.42.225-7",
    "nombres": "DIEGO PAULO VICENTE",
    "apellidos": "PÉREZ CARRASCO",
    "email": "diego.perez6@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41882,
    "rut": "20.41.882-6",
    "nombres": "AGUSTÍN NAIM",
    "apellidos": "PIZARRO ARIAS",
    "email": "agustin.pizarro@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41864,
    "rut": "20.41.864-6",
    "nombres": "AARON SAMUEL",
    "apellidos": "POZAS OYARCE",
    "email": "aaron.pozas@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 42788,
    "rut": "20.42.788-3",
    "nombres": "MARTÍN GABRIEL",
    "apellidos": "RAMOS MOLINA",
    "email": "martin.ramos1@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 3188,
    "rut": "20.3.188-3",
    "nombres": "MATÍAS IGNACIO",
    "apellidos": "RIVERA SÁEZ",
    "email": "matias.rivera_s@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 42236,
    "rut": "20.42.236-9",
    "nombres": "DIEGO NICOLÁS",
    "apellidos": "SALAZAR DÍAZ",
    "email": "diego.salazar2@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 29239,
    "rut": "20.29.239-8",
    "nombres": "ALEJANDRO JAVIER",
    "apellidos": "SALDÍAS CISTERNAS",
    "email": "alejandro.saldias_c@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 42615,
    "rut": "20.42.615-1",
    "nombres": "JOAQUÍN IGNACIO",
    "apellidos": "SILVA SÁNCHEZ",
    "email": "joaquin.silva@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 29266,
    "rut": "20.29.266-8",
    "nombres": "MATÍAS IGNACIO",
    "apellidos": "VÁSQUEZ POBLETE",
    "email": "matias.vasquez1@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41860,
    "rut": "20.41.860-2",
    "nombres": "ALONSO",
    "apellidos": "VERA LARACH",
    "email": "alonso.vera@mail.udp.cl",
    "seccionId": "sec_1",
    "codigo": "CIT3203_CA01"
  },
  {
    "canvas_id": 41579,
    "rut": "20.41.579-9",
    "nombres": "LUCAS ANTONIO",
    "apellidos": "ABELLO CASTILLO",
    "email": "lucas.abello@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 29445,
    "rut": "20.29.445-7",
    "nombres": "JUAN JOSÉ",
    "apellidos": "CORTÉS RODRÍGUEZ",
    "email": "juan.cortes2@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41623,
    "rut": "20.41.623-8",
    "nombres": "MATÍAS JESÚS",
    "apellidos": "DÍAZ LLANCAN",
    "email": "matias.diaz2@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41329,
    "rut": "20.41.329-2",
    "nombres": "DAMIÁN IGNACIO",
    "apellidos": "ELIZONDO ÁLVAREZ",
    "email": "damian.elizondo@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41700,
    "rut": "20.41.700-4",
    "nombres": "RAFAEL IGNACIO",
    "apellidos": "ENCINA MUÑOZ",
    "email": "rafael.encina@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 42062,
    "rut": "20.42.062-6",
    "nombres": "BRUNO MATÍAS",
    "apellidos": "FIGUEROA GONZÁLEZ",
    "email": "bruno.figueroa@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 42515,
    "rut": "20.42.515-9",
    "nombres": "ISIDORA ANTONIA",
    "apellidos": "GONZALEZ MANZANO",
    "email": "isidora.gonzalez4@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 47744,
    "rut": "20.47.744-9",
    "nombres": "BENJAMÍN JESÚS",
    "apellidos": "GUTIÉRREZ GUAJARDO",
    "email": "benjamin.gutierrez2@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41658,
    "rut": "20.41.658-7",
    "nombres": "MAXIMILIANO GILBERTO",
    "apellidos": "JUAREZ ALFARO",
    "email": "maximiliano.juarez@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41784,
    "rut": "20.41.784-7",
    "nombres": "TOMÁS IGNACIO",
    "apellidos": "LEÓN SEPÚLVEDA",
    "email": "tomas.leon1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 32246,
    "rut": "20.32.246-9",
    "nombres": "THOMAS SAMIR",
    "apellidos": "MUÑOZ ABUFÓN",
    "email": "thomas.munoz1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41563,
    "rut": "20.41.563-2",
    "nombres": "LEANDRO ALBERTO",
    "apellidos": "NORAMBUENA PAINE",
    "email": "leandro.norambuena@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41499,
    "rut": "20.41.499-1",
    "nombres": "JAVIER ALEJANDRO",
    "apellidos": "OBERTO REYES",
    "email": "javier.oberto@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 43012,
    "rut": "20.43.012-2",
    "nombres": "RICHARD DAVID",
    "apellidos": "OLGUÍN CONCHA",
    "email": "richard.olguin@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41423,
    "rut": "20.41.423-6",
    "nombres": "FELIPE ALONSO",
    "apellidos": "ORMAZÁBAL ALLENDES",
    "email": "felipe.ormazabal1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 42941,
    "rut": "20.42.941-3",
    "nombres": "NATALIA GERMAINE",
    "apellidos": "ORTEGA GALLARDO",
    "email": "natalia.ortega1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 43128,
    "rut": "20.43.128-1",
    "nombres": "SEBASTIÁN ANTONIO",
    "apellidos": "PARADA GALLEGUILLOS",
    "email": "sebastian.parada1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 42116,
    "rut": "20.42.116-6",
    "nombres": "BENJAMÍN ALFREDO",
    "apellidos": "POLANCO DÍAZ",
    "email": "benjamin.polanco@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41285,
    "rut": "20.41.285-3",
    "nombres": "CAMILO ANTONIO",
    "apellidos": "RÍOS TENDERINI",
    "email": "camilo.rios1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 42175,
    "rut": "20.42.175-2",
    "nombres": "CRISTÓBAL ANDRÉ",
    "apellidos": "RODRÍGUEZ ÁLVAREZ",
    "email": "cristobal.rodriguez2@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41476,
    "rut": "20.41.476-5",
    "nombres": "HUGO ANDRÉS",
    "apellidos": "ROJAS ZÁRATE",
    "email": "hugo.rojas1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41559,
    "rut": "20.41.559-7",
    "nombres": "LAURA ANTONELLA",
    "apellidos": "ROMERO CIMMARUSTI",
    "email": "laura.romero@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41503,
    "rut": "20.41.503-5",
    "nombres": "JAVIERA DANIELA MARTINA",
    "apellidos": "SEPÚLVEDA VERA",
    "email": "javiera.sepulveda5@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41722,
    "rut": "20.41.722-8",
    "nombres": "SERGIO ALBERTO",
    "apellidos": "SOTO CUEVAS",
    "email": "sergio.soto1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 42239,
    "rut": "20.42.239-3",
    "nombres": "DIEGO IGNACIO",
    "apellidos": "TAPIA CANAVAL",
    "email": "diego.tapia6@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41640,
    "rut": "20.41.640-7",
    "nombres": "MATÍAS RAFAEL",
    "apellidos": "TOBAR SILVA",
    "email": "matias.tobar@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 42263,
    "rut": "20.42.263-9",
    "nombres": "EDUARDO MAXIMILIANO",
    "apellidos": "VALENZUELA BRICEÑO",
    "email": "eduardo.valenzuela1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 9400,
    "rut": "20.94.000-5",
    "nombres": "SAMUEL ESTEBAN",
    "apellidos": "VÁSQUEZ PALMA",
    "email": "samuel.vasquez@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 59423,
    "rut": "20.59.423-6",
    "nombres": "LUCAS",
    "apellidos": "VICUÑA FUENZALIDA",
    "email": "lucas.vicuna1@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41689,
    "rut": "20.41.689-2",
    "nombres": "RENATO ANTONIO",
    "apellidos": "YÁÑEZ RIVEROS",
    "email": "renato.yanez2@mail.udp.cl",
    "seccionId": "sec_2",
    "codigo": "CIT3203_CA02"
  },
  {
    "canvas_id": 41980,
    "rut": "20.41.980-5",
    "nombres": "BENJAMÍN PATRICIO",
    "apellidos": "ACEITUNO LLAVE",
    "email": "benjamin.aceituno@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 42818,
    "rut": "20.42.818-6",
    "nombres": "MARTÍN IGNACIO",
    "apellidos": "AGUILERA GÓMEZ",
    "email": "martin.aguilera@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 21204,
    "rut": "20.21.204-1",
    "nombres": "SAMUEL RICARDO",
    "apellidos": "ANGULO CARREÑO",
    "email": "samuel.angulo_c@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 42034,
    "rut": "20.42.34-5",
    "nombres": "BRANCO AGUSTÍN",
    "apellidos": "BUROTTO VÁSQUEZ",
    "email": "branco.burotto@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 29313,
    "rut": "20.29.313-1",
    "nombres": "ESTRELLA CATALINA",
    "apellidos": "BUSTOS AILLAPÁN",
    "email": "estrella.bustos@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 41404,
    "rut": "20.41.404-5",
    "nombres": "DIEGO CLEMENTE",
    "apellidos": "CAÑA CACHARUCO",
    "email": "diego.cana@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 29458,
    "rut": "20.29.458-2",
    "nombres": "GUSTAVO ADOLFO",
    "apellidos": "CASTRO ACOSTA",
    "email": "gustavo.castro1@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 50774,
    "rut": "20.50.774-6",
    "nombres": "VICENTE MARTIN",
    "apellidos": "DIAZ HORMAZABAL",
    "email": "vicente.diaz5@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 3249,
    "rut": "20.3.249-1",
    "nombres": "FRANCISCO ANTONIO",
    "apellidos": "FERNÁNDEZ VEAS",
    "email": "francisco.fernandez_v@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 41703,
    "rut": "20.41.703-7",
    "nombres": "RAFAEL ENRIQUE",
    "apellidos": "FUENTES MADRID",
    "email": "rafael.fuentes@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 4008,
    "rut": "20.4.8-4",
    "nombres": "GONZALO ABRAHAM",
    "apellidos": "GAETE FAÚNDEZ",
    "email": "gonzalo.gaete1@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 43223,
    "rut": "20.43.223-6",
    "nombres": "VALENTINA ANAÍS",
    "apellidos": "GARCÍA GARAY",
    "email": "valentina.garcia3@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 13503,
    "rut": "20.13.503-4",
    "nombres": "MATÍAS NICOLÁS",
    "apellidos": "HERRERA RAMÍREZ",
    "email": "matias.herrera2@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 41402,
    "rut": "20.41.402-3",
    "nombres": "DANTE GIOACCHINO",
    "apellidos": "HORTUVIA ARIAS",
    "email": "dante.hortuvia@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 29355,
    "rut": "20.29.355-7",
    "nombres": "CARLOS ANDRÉS",
    "apellidos": "JARA GEBHARD",
    "email": "carlos.jara1@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 16170,
    "rut": "20.16.170-7",
    "nombres": "ALEJANDRO ANDRÉS",
    "apellidos": "LAGOS CORDERO",
    "email": "alejandro.lagos@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 43212,
    "rut": "20.43.212-4",
    "nombres": "VICENTE JUSCELINO",
    "apellidos": "LEIVA BELLO",
    "email": "vicente.leiva2@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 29284,
    "rut": "20.29.284-8",
    "nombres": "FERNANDO ESTEBAN",
    "apellidos": "LLANCAO LONCOMIL",
    "email": "fernando.llancao@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 42218,
    "rut": "20.42.218-9",
    "nombres": "DIEGO RICHARD",
    "apellidos": "MENA GONZÁLEZ",
    "email": "diego.mena2@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 29301,
    "rut": "20.29.301-7",
    "nombres": "FELIPE ANDRÉS",
    "apellidos": "MORA MENESES",
    "email": "felipe.mora_m@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 42221,
    "rut": "20.42.221-3",
    "nombres": "DIEGO ESTEBAN",
    "apellidos": "MUÑOZ BARRA",
    "email": "diego.munoz11@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 16143,
    "rut": "20.16.143-7",
    "nombres": "JOSÉ TOMÁS",
    "apellidos": "OLAVE TORREALBA",
    "email": "jose.olave@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 1229,
    "rut": "20.1.229-6",
    "nombres": "KARLA ANDREA",
    "apellidos": "PARRA TOLOSA",
    "email": "karla.parra@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 42450,
    "rut": "20.42.450-7",
    "nombres": "IGNACIO JESÚS",
    "apellidos": "PASTÉN JARA",
    "email": "ignacio.pasten@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 1067,
    "rut": "20.1.67-6",
    "nombres": "NICOLÁS OSVALDO",
    "apellidos": "RAMÍREZ ARTEAGA",
    "email": "nicolas.ramirez_a@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 21207,
    "rut": "20.21.207-4",
    "nombres": "VÍCTOR IGNACIO",
    "apellidos": "RODRÍGUEZ PINILLA",
    "email": "victor.rodriguez_p@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 41422,
    "rut": "20.41.422-5",
    "nombres": "FERNANDA MADISSON",
    "apellidos": "VALENCIA CABEZAS",
    "email": "fernanda.valencia@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 43089,
    "rut": "20.43.89-7",
    "nombres": "SHI HAO",
    "apellidos": "ZHANG CHEN",
    "email": "shi.zhang@mail.udp.cl",
    "seccionId": "sec_3",
    "codigo": "CIT3203_CA03"
  },
  {
    "canvas_id": 32769,
    "rut": "20.32.769-1",
    "nombres": "CAMILO JAVIER",
    "apellidos": "ADONIS ROJAS",
    "email": "camilo.adonis@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 51710,
    "rut": "20.51.710-6",
    "nombres": "IGNACIO EDUARDO",
    "apellidos": "ANTIGUAY SANTANA",
    "email": "ignacio.antiguay@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 41401,
    "rut": "20.41.401-2",
    "nombres": "DIEGO IGNACIO",
    "apellidos": "BANDA GÁLVEZ",
    "email": "diego.banda@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 51769,
    "rut": "20.51.769-2",
    "nombres": "ISIDORA ANDREA",
    "apellidos": "BRAVO ORTIZ",
    "email": "isidora.bravo2@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 41952,
    "rut": "20.41.952-4",
    "nombres": "ARIEL ALONSO",
    "apellidos": "CÁCERES SATORRES",
    "email": "ariel.caceres@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 41540,
    "rut": "20.41.540-6",
    "nombres": "JUAN PABLO",
    "apellidos": "CARO CORNEJO",
    "email": "juan.caro2@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 19919,
    "rut": "20.19.919-3",
    "nombres": "DANIEL CRISTÓBAL",
    "apellidos": "CONCHA ARRIAGADA",
    "email": "daniel.concha_a@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 42350,
    "rut": "20.42.350-6",
    "nombres": "FELIPE ANDRÉS",
    "apellidos": "CUEVAS SILVA",
    "email": "felipe.cuevas1@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 42355,
    "rut": "20.42.355-2",
    "nombres": "FELIPE IGNACIO",
    "apellidos": "FARFÁN ALVARADO",
    "email": "felipe.farfan1@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 41667,
    "rut": "20.41.667-7",
    "nombres": "NICOLAS HERNAN",
    "apellidos": "GAETE FLORES",
    "email": "nicolas.gaete2@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 42226,
    "rut": "20.42.226-8",
    "nombres": "DARELL IGNACIO",
    "apellidos": "GUTIÉRREZ ITURRA",
    "email": "darell.gutierrez@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 51812,
    "rut": "20.51.812-9",
    "nombres": "BENJAMÍN ALEXIS",
    "apellidos": "GUZMÁN NORAMBUENA",
    "email": "benjamin.guzman3@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 51820,
    "rut": "20.51.820-8",
    "nombres": "BENJAMÍN IGNACIO",
    "apellidos": "JIMENEZ NÚÑEZ",
    "email": "benjamin.jimenez4@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 43117,
    "rut": "20.43.117-8",
    "nombres": "SEBASTIÁN ISAÍAS",
    "apellidos": "NAVARRETE RECABAL",
    "email": "sebastian.navarrete@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 51894,
    "rut": "20.51.894-1",
    "nombres": "MAXIMILIANO ISMAEL",
    "apellidos": "PALMA TORRES",
    "email": "maximiliano.palma@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 51993,
    "rut": "20.51.993-1",
    "nombres": "OSEAS ESTEBAN AMOS",
    "apellidos": "POVEDA HUERTA",
    "email": "oseas.poveda@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 41719,
    "rut": "20.41.719-5",
    "nombres": "SEBASTIÁN ALONSO",
    "apellidos": "REYES GÓMEZ",
    "email": "sebastian.reyes4@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 63774,
    "rut": "20.63.774-1",
    "nombres": "CRISTOBAL",
    "apellidos": "RIVERA GUZMAN",
    "email": "cristobal.rivera2@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 42236,
    "rut": "20.42.236-9",
    "nombres": "DIEGO NICOLÁS",
    "apellidos": "SALAZAR DÍAZ",
    "email": "diego.salazar2@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 41503,
    "rut": "20.41.503-5",
    "nombres": "JAVIERA DANIELA MARTINA",
    "apellidos": "SEPÚLVEDA VERA",
    "email": "javiera.sepulveda5@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 41422,
    "rut": "20.41.422-5",
    "nombres": "FERNANDA MADISSON",
    "apellidos": "VALENCIA CABEZAS",
    "email": "fernanda.valencia@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 42940,
    "rut": "20.42.940-2",
    "nombres": "NICOLÁS ANTONIO",
    "apellidos": "VERGARA ESCALANTE",
    "email": "nicolas.vergara2@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  },
  {
    "canvas_id": 42246,
    "rut": "20.42.246-1",
    "nombres": "DIEGO",
    "apellidos": "VILLAGRÁN CABRERA",
    "email": "diego.villagran1@mail.udp.cl",
    "seccionId": "sec_arq_emergentes",
    "codigo": "CIT3100_CA02"
  }
];
