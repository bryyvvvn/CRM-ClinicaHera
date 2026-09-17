# MediLink API — endpoints (ejemplos)

Fuente: https://api.medilink2.healthatom.com/docs/
Base: `https://api.medilink2.healthatom.com/api/v5`
Auth: `Authorization: Token <access_token>`

Solo ejemplos de entrada (JS) y salida (JSON). Sin tablas de la doc oficial.

Total extraído: 172 endpoints.

## `GET` sucursales/{id_sucursal}/profesionales/{id_profesional}/agendas

Muestra la disponibilidad de agenda de un profesional para un rango de fechas y sucursal.

### Entrada

```javascript
var id_profesional = 31;
var id_sucursal = 1;
var params      =   {
                        "fecha_inicio"      : {"eq":"2018-05-02"},
                        "fecha_fin"         : {"eq":"2018-05-04"},
                        "mostrar_detalles"  : {"eq":"0"}
                    }

var settings    =   {
                        "url"       :   "https://api.medilink2.healthatom.com/api/v5/sucursales/"+id_sucursal+"/profesionales/"+id_profesional+"/agendas",
                        "method"    :   "GET",
                        "data"      :   "q="+JSON.stringify(params),
                        "headers"   :   {
                                            "Authorization": "Token "+token
                                        }
                    }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "fechas": {
            "2018-05-02": {
                "horas": {
                    "06:30": {
                        "sillones": {
                            "1": {
                                "tipo": "Bloqueo",
                                "comentario": "Tramites",
                                "bloque": "1/4",
                                "duracion_total": 60,
                                "inicio": "06:30:00",
                                "fin": "07:30:00"
                            },
                            "Sobrecupo": true
                        }
                    },
                    "06:45": {
                        "sillones": {
                            "1": {
                                "tipo": "Bloqueo",
                                "comentario": "Tramites",
                                "bloque": "2/4",
                                "duracion_total": 60,
                                "inicio": "06:30:00",
                                "fin": "07:30:00"
                            },
                            "Sobrecupo": true
                        }
                    },
                    "07:00": {
                        "sillones": {
                            "1": {
                                "tipo": "Bloqueo",
                                "comentario": "Tramites",
                                "bloque": "3/4",
                                "duracion_total": 60,
                                "inicio": "06:30:00",
                                "fin": "07:30:00"
                            },
                            "Sobrecupo": true
                        }
                    },
                    "07:15": {
                        "sillones": {
                            "1": {
                                "tipo": "Bloqueo",
                                "comentario": "Tramites",
                                "bloque": "4/4",
                                "duracion_total": 60,
                                "inicio": "06:30:00",
                                "fin": "07:30:00"
                            },
                            "Sobrecupo": true
                        }
                    },
                    "07:30": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "07:45": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "08:00": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "08:15": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "08:30": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "08:45": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:00": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:15": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:30": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:45": {
                        "sillones": {
                            "1": true,
                            "Sobrecupo": true
                        }
                    }
                }
            },
            "2018-05-03": {
                "horas": {
                    "08:00": {
                        "sillones": {
                            "1": {
                                "tipo": "Cita",
                                "id_cita": 631,
                                "id_paciente": 17,
                                "nombre_paciente": "Juan",
                                "apellidos_paciente": "Castro Garcia",
                                "comentario": "",
                                "bloque": "1/2",
                                "duracion_total": 30,
                                "inicio": "08:00:00",
                                "fin": "08:30:00"
                            },
                            "2": true,
                            "Sobrecupo": true
                        }
                    },
                    "08:15": {
                        "sillones": {
                            "1": {
                                "tipo": "Cita",
                                "id_cita": 631,
                                "id_paciente": 17,
                                "nombre_paciente": "Juan",
                                "apellidos_paciente": "Castro Garcia",
                                "comentario": "",
                                "bloque": "2/2",
                                "duracion_total": 30,
                                "inicio": "08:00:00",
                                "fin": "08:30:00"
                            },
                            "2": true,
                            "Sobrecupo": true
                        }
                    },
                    "08:30": {
                        "sillones": {
                            "1": true,
                            "2": true,
                            "Sobrecupo": true
                        }
                    },
                    "08:45": {
                        "sillones": {
                            "1": true,
                            "2": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:00": {
                        "sillones": {
                            "1": true,
                            "2": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:15": {
                        "sillones": {
                            "1": true,
                            "2": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:30": {
                        "sillones": {
                            "1": true,
                            "2": true,
                            "Sobrecupo": true
                        }
                    },
                    "09:45": {
                        "sillones": {
                            "1": true,
                            "2": true,
                            "Sobrecupo": true
                        }
                    }
                }
            },
            "2018-05-04": []
        }
    }
}
```

## `GET` agendas

Muestra la disponibilidad de agenda de los profesionales de una sucursal en específico en un fecha puntual.

### Entrada

```javascript
var params      = {
    'id_sucursal': 1,
    'fecha': '2022-01-08',
    'duracion': 15,
    'id_profesional': 626,
};
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/agendas/",
    "method"    : "GET",
    "data"      : "q=" + JSON.stringify(params)
    "headers"   : {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "09:15",
            "hora_fin": "09:30",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "09:30",
            "hora_fin": "09:45",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "09:45",
            "hora_fin": "10:00",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "10:00",
            "hora_fin": "10:15",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "10:15",
            "hora_fin": "10:30",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "10:30",
            "hora_fin": "10:45",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "10:45",
            "hora_fin": "11:00",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "11:00",
            "hora_fin": "11:15",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "11:15",
            "hora_fin": "11:30",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        },
        {
            "id_paciente": 0,
            "nombre_paciente": "",
            "hora_inicio": "11:30",
            "hora_fin": "11:45",
            "duracion": 15,
            "id_profesional": 626,
            "nombre_profesional": "Pedro Gonzalez",
            "fecha": "08/01/2022",
            "id_recurso": 1
        }
    ]
}
```

## `POST` /aranceles

Permite crear un arancel. Un arancel solo necesita tener un nombre para ser creado.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/aranceles/",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data": {
        "nombre" : "Arancel prueba"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 9,
        "nombre": "Arancel prueba",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/aranceles/9",
                "method": "GET"
            },
            {
                "rel": "categorias",
                "href": "https://api.medilink2.healthatom.com/api/v1/aranceles/9/categorias",
                "method": "GET"
            }
        ]
    }
}
```

## `POST` /aranceles/{id_arancel}/categorias

Permite crear la asociación entre un arancel y una categoría

### Entrada

```javascript
var id_arancel = 2;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/aranceles/"+id_arancel+"/categorias",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "id_categoria" : "217"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id_arancel": 4,
        "id_categoria": 170,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/aranceles/4/categorias/170",
                "method": "GET"
            },
            {
                "rel": "prestaciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/aranceles/4/categorias/170/prestaciones",
                "method": "GET"
            }
        ]
    }
}
```

## `POST` /aranceles/{id_arancel}/categorias/{id_categoria}/prestaciones

Permite crear una prestación y asociarla al id_arancel e id_categoria respectivos

### Entrada

```javascript
var id_arancel = 2;
var id_categoria   = 170;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/aranceles/"+id_arancel+"/categorias/"+id_categoria+"/prestaciones",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "id_categoria" : "217"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 6942,
        "nombre": "prestacion test andres",
        "codigo": "500540",
        "id_arancel": 4,
        "nombre_arancel": "coca cola",
        "id_categoria": 217,
        "nombre_categoria": "Quiero frenillos, Estudio preliminar de Ortodoncia",
        "id_tipo": 1,
        "tipo": "Acción Clínica",
        "precio": 1,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6942",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /aranceles/{id_arancel}

Permite editar el nombre de un arancel y habilitarlo/deshabilitarlo.

### Entrada

```javascript
var id_arancel      = 9;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/aranceles/"+id_arancel,
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"        : "Arancel test",
        "habilitado"    : 0
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 9,
        "nombre": "Arancel test",
        "habilitado": 0,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/aranceles/9",
                "method": "GET"
            },
            {
                "rel": "categorias",
                "href": "https://api.medilink2.healthatom.com/api/v1/aranceles/9/categorias",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /aranceles/{id_arancel}/prestaciones/{codigo_prestacion}

Permite hacer update de manera masiva a las prestaciones que posean el id_arancel y código de la prestación

### Entrada

```javascript
var id_arancel      = 9;
var codigo_prestacion = 50050;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/aranceles/"+id_arancel+"/prestaciones/"+codigo_prestacion,
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"        : "Arancel test",
        'precio'        : 12,
        "habilitado"    : 0
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 6927,
            "nombre": "Update Massivo",
            "codigo": "500540",
            "id_arancel": 1,
            "nombre_arancel": "pato pato",
            "id_categoria": 217,
            "nombre_categoria": "Quiero frenillos, Estudio preliminar de Ortodoncia",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 10000,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6927",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 6926,
            "nombre": "Update Massivo",
            "codigo": "500540",
            "id_arancel": 1,
            "nombre_arancel": "pato pato",
            "id_categoria": 217,
            "nombre_categoria": "Quiero frenillos, Estudio preliminar de Ortodoncia",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 10000,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6926",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 6925,
            "nombre": "Update Massivo",
            "codigo": "500540",
            "id_arancel": 1,
            "nombre_arancel": "pato pato",
            "id_categoria": 217,
            "nombre_categoria": "Quiero frenillos, Estudio preliminar de Ortodoncia",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 10000,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6925",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 6924,
            "nombre": "Update Massivo",
            "codigo": "500540",
            "id_arancel": 1,
            "nombre_arancel": "pato pato",
            "id_categoria": 217,
            "nombre_categoria": "Quiero frenillos, Estudio preliminar de Ortodoncia",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 10000,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6924",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 6923,
            "nombre": "Update Massivo",
            "codigo": "500540",
            "id_arancel": 1,
            "nombre_arancel": "pato pato",
            "id_categoria": 217,
            "nombre_categoria": "Quiero frenillos, Estudio preliminar de Ortodoncia",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 10000,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6923",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 6922,
            "nombre": "Update Massivo",
            "codigo": "500540",
            "id_arancel": 1,
            "nombre_arancel": "pato pato",
            "id_categoria": 217,
            "nombre_categoria": "Quiero frenillos, Estudio preliminar de Ortodoncia",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 10000,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6922",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /aranceles

Muestra el listado de todos los aranceles de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/aranceles",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 2,
            "nombre": "Arancel Escolar",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/2",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/2/categorias",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "Arancel Adulto",
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/1",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/1/categorias",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 0,
            "nombre": "Arancel Base",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/0",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/0/categorias",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /aranceles/{id_arancel}

Muestra la información de un arancel en específico.

### Entrada

```javascript
var id_arancel = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/aranceles/"+id_arancel,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "nombre": "Arancel Escolar",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/2",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/aranceles/2/categorias",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /aranceles/{id_arancel}/categorias

Muestra el listado de todos las categorias de prestación asociadas al arancel.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_arancel = 1;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/aranceles/"+id_arancel+"/categorias",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 192,
            "nombre": "PRÓTESIS FIJA",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192/prestaciones",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 193,
            "nombre": "PRÓTESIS REMOVIBLE",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/193",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/193/prestaciones",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 194,
            "nombre": "PERIODONCIA",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/194",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/194/prestaciones",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /aranceles/{id_arancel}/categorias/{id_categoria}

Muestra la información de una categoria especifica del arancel.

### Entrada

```javascript
var id_arancel      = 1;
var id_categoria    = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/aranceles/"+id_arancel+"/categorias/"+id_categoria,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 192,
        "nombre": "PRÓTESIS FIJA",
        "id_tipo": 1,
        "tipo": "Acción Clínica",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192/prestaciones",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /aranceles/{id_arancel}/categorias/{id_categoria}/prestaciones

Muestra el listado de todas las prestaciones pertenecientes al arancel y categoria definidos.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_arancel      = 0;
var id_categoria    = 2;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/aranceles/"+id_arancel+"/categorias/"+id_categoria+"/prestaciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "Exodoncia tercer molar",
            "id_arancel": 0,
            "arancel": "Arancel base",
            "id_categoria": 2,
            "categoria": "General",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 55000,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/prestaciones/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Examén inicial",
            "id_arancel": 0,
            "arancel": "Arancel base",
            "id_categoria": 2,
            "categoria": "General",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 1000,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/prestaciones/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /atenciones

Muestra la información de todas las atenciones de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/atenciones/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 25144,
            "nombre": "Diagnóstico",
            "tipo_atencion": "Plan de tratamiento",
            "id_convenio": 0,
            "nombre_convenio": "",
            "fecha": "2018-05-17",
            "finalizado": 0,
            "bloqueado": 0,
            "id_paciente": 45705,
            "nombre_paciente": "Juan Ramirez",
            "id_profesional": 30,
            "nombre_profesional": "Alberto Gonzalez",
            "id_sucursal": 1,
            "nombre_sucursal": "Centro de Diagnóstico",
            "total": 186420,
            "abonado": 43020,
            "abono_libre": 0,
            "asignado_realizado": 0,
            "asignado_sin_realizar": 43020,
            "total_realizado": 0,
            "deuda": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "http://apimed.loc/api/v5/atenciones/25144",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "http://apimed.loc/api/v5/atenciones/25144/detalles",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "http://apimed.loc/api/v5/atenciones/25144/citas",
                    "method": "GET"
                },
                {
                    "rel": "evoluciones",
                    "href": "http://apimed.loc/api/v5/atenciones/25144/evoluciones",
                    "method": "GET"
                },
                {
                    "rel": "fichas",
                    "href": "http://apimed.loc/api/v5/atenciones/25144/fichas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 25143,
            "nombre": "Consulta traumatología",
            "tipo_atencion": "Consulta",
            "id_convenio": 1,
            "nombre_convenio": "Empresas",
            "fecha": "2018-05-16",
            "finalizado": 0,
            "bloqueado": 0,
            "id_paciente": 30224,
            "nombre_paciente": "Alejandra Lopez",
            "id_profesional": 33,
            "nombre_profesional": "Esteban Ahumada",
            "id_sucursal": 2,
            "nombre_sucursal": "Centro trauma",
            "total": 0,
            "abonado": 0,
            "abono_libre": 0,
            "asignado_realizado": 0,
            "asignado_sin_realizar": 0,
            "total_realizado": 0,
            "deuda": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "http://apimed.loc/api/v5/atenciones/25143",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "http://apimed.loc/api/v5/atenciones/25143/detalles",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "http://apimed.loc/api/v5/atenciones/25143/citas",
                    "method": "GET"
                },
                {
                    "rel": "evoluciones",
                    "href": "http://apimed.loc/api/v5/atenciones/25143/evoluciones",
                    "method": "GET"
                },
                {
                    "rel": "fichas",
                    "href": "http://apimed.loc/api/v5/atenciones/25143/fichas",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /atenciones/{id_atencion}

Muestra la información de un atencion en específico.

### Entrada

```javascript
var id_atencion  = 25143;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/atenciones/"+id_atencion,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 25143,
        "nombre": "Consulta traumatología",
        "tipo_atencion": "Consulta",
        "id_convenio": 1,
        "nombre_convenio": "Empresas",
        "fecha": "2018-05-16",
        "finalizado": 0,
        "bloqueado": 0,
        "id_paciente": 30224,
        "nombre_paciente": "Alejandra Lopez",
        "id_profesional": 33,
        "nombre_profesional": "Esteban Ahumada",
        "id_sucursal": 2,
        "nombre_sucursal": "Centro trauma",
        "total": 0,
        "abonado": 0,
        "abono_libre": 0,
        "asignado_realizado": 0,
        "asignado_sin_realizar": 0,
        "total_realizado": 0,
        "deuda": 0,
        "links": [
            {
                "rel": "self",
                "href": "http://apimed.loc/api/v5/atenciones/25143",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "http://apimed.loc/api/v5/atenciones/25143/detalles",
                "method": "GET"
            },
            {
                "rel": "citas",
                "href": "http://apimed.loc/api/v5/atenciones/25143/citas",
                "method": "GET"
            },
            {
                "rel": "evoluciones",
                "href": "http://apimed.loc/api/v5/atenciones/25143/evoluciones",
                "method": "GET"
            },
            {
                "rel": "fichas",
                "href": "http://apimed.loc/api/v5/atenciones/25143/fichas",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /atenciones/{id_atencion}/citas

Muestra el listado de todas las citas asociadas a un atencion en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_atencion = 6;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/atenciones/"+id_atencion+"/citas",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 4,
            "id_paciente": 1,
            "nombre_paciente": "Juan Lopez",
            "id_estado": 1,
            "estado_cita": "Anulado",
            "id_atencion": 6,
            "fecha": "2016-06-24",
            "hora_inicio": "09:15:00",
            "hora_fin": "09:30:00",
            "duracion": 15,
            "id_profesional": 3,
            "nombre_profesional": "Fernanda Risopatrón",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-25 13:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/4",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 5,
            "id_paciente": 1,
            "nombre_paciente": "Juan Lopez",
            "id_estado": 7,
            "estado_cita": "No confirmado",
            "id_atencion": 6,
            "fecha": "2016-06-23",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:15:00",
            "duracion": 15,
            "id_profesional": 3,
            "nombre_profesional": "Fernanda Risopatrón",
            "id_sucursal": 2,
            "nombre_sucursal": "SUR",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-25 15:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/5",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /atenciones/{id_atencion}/detalles

Muestra el detalle de un atencion en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_atencion = 6;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/atenciones/"+id_atencion+"/detalles",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 261,
            "id_atencion": 6,
            "id_prestacion": 4733,
            "id_cargo": 1,
            "nombre_prestacion": "Endodoncia En Molar Inferior No Vital Sin Lesion",
            "tipo_prestacion": "Acción Clínica",
            "id_usuario_creador": 1,
            "nombre_creador": "Administrador",
            "fecha_creacion": "2016-08-03 17:29:06",
            "realizado": 1,
            "liquidado": 0,
            "id_profesional_realizador": 3,
            "profesional_realizador": "Fernanda Risopatrón",
            "fecha_realizacion": "2016-08-03",
            "subtotal": 232500,
            "descuento_usuario": 0,
            "descuento_convenio": 0,
            "descuento_total": 0,
            "pagado": 10000,
            "total": 232500,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/atenciones/6/detalles/261",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 262,
            "id_atencion": 6,
            "id_cargo": 1,
            "id_prestacion": 4733,
            "nombre_prestacion": "Endodoncia En Molar Inferior No Vital Sin Lesion",
            "tipo_prestacion": "Acción Clínica",
            "id_usuario_creador": 1,
            "nombre_creador": "Administrador",
            "fecha_creacion": "2016-08-03 17:29:06",
            "realizado": 0,
            "liquidado": 0,
            "id_profesional_realizador": 0,
            "profesional_realizador": "",
            "fecha_realizacion": "",
            "subtotal": 232500,
            "descuento_usuario": 0,
            "descuento_convenio": 0,
            "descuento_total": 0,
            "pagado": 0,
            "total": 232500,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/atenciones/6/detalles/262",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /atenciones/{id_atencion}/evoluciones

Muestra el listado de evoluciones por atencion.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_atencion = 482;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/atenciones/"+id_atencion+"/evoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 284,
            "id_atencion": 482,
            "nombre_atencion": "prueba",
            "id_paciente": 58,
            "nombre_paciente": "Felipe Molina",
            "id_profesional": 3,
            "nombre_profesional": "Fernanda Risopatrón",
            "id_usuario": 2,
            "nombre_usuario": "Soporte Engenis",
            "fecha": "2018-02-20 17:39:50",
            "datos": "Acción realizada: Restauraciones Resina (Clase I) Una Cara Pieza 13\n\nasdfghj",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.loc/api/v5/evoluciones/284",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /atenciones/{id_atencion}/fichas

Muestra la ficha correspondiente a la atencion.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_atencion = 2046;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/atenciones/"+id_atencion+"/fichas",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 1,
        "nombre_ficha": "Registro general",
        "id_especialidad": 1,
        "especialidad": "General",
        "id_paciente": 43760,
        "nombre_paciente": "Juan Soto",
        "campos": [
            {
                "id_campo": 1,
                "nombre_campo": "Peso",
                "posicion": 1,
                "valor": "65",
                "timestamp": "2018-02-23 10:45:23",
                "links": [
                    {
                        "rel": "self",
                        "href": "http://apimed.loc/api/v5/atenciones/2046/fichas/1/campos/1",
                        "method": "GET"
                    }
                ]
            },
            {
                "id_campo": 2,
                "nombre_campo": "Altura",
                "posicion": 2,
                "valor": "171",
                "timestamp": "2018-02-23 10:45:23",
                "links": [
                    {
                        "rel": "self",
                        "href": "http://apimed.loc/api/v5/atenciones/2046/fichas/1/campos/2",
                        "method": "GET"
                    }
                ]
            }
        ]
    }
}
```

## `GET` /atenciones/{id_atencion}/fichas/{id_ficha}/campos

Muestra los campos de una ficha y todos sus valores históricos.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_atencion = 2046;
var id_ficha    = 1;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/atenciones/"+id_atencion+"/fichas/"+id_ficha+"/campos",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "1": {
            "id": 1,
            "nombre_campo": "Peso",
            "posicion": 1,
            "valores": [
                {
                    "id_atencion": 2046,
                    "fecha": "2016-04-20 16:32:25",
                    "valor": "60"
                },
                {
                    "id_atencion": 2046,
                    "fecha": "2018-02-23 10:45:23",
                    "valor": "65"
                }
            ]
        },
        "2": {
            "id": 2,
            "nombre_campo": "Altura",
            "posicion": 2,
            "valores": [
                {
                    "id_atencion": 2046,
                    "fecha": "2016-04-20 16:32:25",
                    "valor": "163"
                },
                {
                    "id_atencion": 2046,
                    "fecha": "2018-02-23 10:45:23",
                    "valor": "171"
                }
            ]
        }
    }
}
```

## `GET` /atenciones/tipos

Muestra el listado de todos los tipos de atención.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/atenciones/tipos",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 0,
            "nombre": "Consulta"
        },
        {
            "id": 1,
            "nombre": "Procedimiento"
        },
        {
            "id": 2,
            "nombre": "Examen"
        },
        {
            "id": 3,
            "nombre": "Licencia"
        },
        {
            "id": 4,
            "nombre": "Urgencia"
        },
        {
            "id": 5,
            "nombre": "Hospitalización"
        },
        {
            "id": 6,
            "nombre": "Interconsulta"
        },
        {
            "id": 7,
            "nombre": "Plan de tratamiento"
        }
    ]
}
```

## `GET` /atenciones/tipos/{id_tipo}

Muestra la información de un tipo de atención en particular

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_tipo     = 1;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/atenciones/tipos/"+id_tipo,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 1,
        "nombre": "Procedimiento"
    }
}
```

## `GET` /bancos

Muestra la información de todos las bancos de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/bancos/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 3,
            "nombre": "Banco Itaú",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/bancos/3",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Banco Santander",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/bancos/2",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "Banco de Chile",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/bancos/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /bancos/{id_banco}

Muestra la información de un banco específico.

### Entrada

```javascript
var id_banco    = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/bancos/"+id_banco,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "nombre": "Banco Santander",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/bancos/2",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /cajas

Muestra el listado de todas las cajas de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/cajas",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 45,
            "id_sucursal": 1,
            "id_usuario_admin": 38,
            "fecha_apertura": "2017-11-30 14:33:26",
            "fecha_cierre": "2017-12-02 09:30:24",
            "saldo_anterior": 0,
            "abono_inicial": 0,
            "saldo_inicial": 0,
            "gastos": 2000,
            "acumulado": 800000,
            "saldo_total": 798000,
            "saldo_cierre": 0,
            "estado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/cajas/45",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 44,
            "id_sucursal": 1,
            "id_usuario_admin": 47,
            "fecha_apertura": "2017-10-26 14:31:58",
            "fecha_cierre": "",
            "saldo_anterior": 0,
            "abono_inicial": 0,
            "saldo_inicial": 0,
            "gastos": 400,
            "acumulado": 2743037,
            "saldo_total": 2742637,
            "saldo_cierre": 0,
            "estado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/cajas/44",
                    "method": "GET"
                }
            ]
        },
    ]
}
```

## `GET` /cajas/{id_caja}

Muestra la información de una caja en específico.

### Entrada

```javascript
var id_caja     = 45;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/cajas/"+id_caja,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 45,
        "id_sucursal": 1,
        "id_usuario_admin": 38,
        "fecha_apertura": "2017-11-30 14:33:26",
        "fecha_cierre": "2017-12-02 09:30:24",
        "saldo_anterior": 0,
        "abono_inicial": 0,
        "saldo_inicial": 0,
        "gastos": 2000,
        "acumulado": 800000,
        "saldo_total": 798000,
        "saldo_cierre": 0,
        "estado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/cajas/45",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /cajas/{id_caja}/pagos

Muestra el listado de todos los pagos de una caja en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_caja  = 44;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/cajas/"+id_caja+"/pagos",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
  "data": [
      {
          "id": 904,
          "id_cliente": 28,
          "nombre_cliente": "Alberto Espinoza",
          "id_paciente": 28,
          "nombre_paciente": "Alberto Espinoza",
          "monto_pago": 495750,
          "medio_pago": "Efectivo",
          "nombre_banco": "",
          "fecha_recepcion": "2017-12-18",
          "fecha_vencimiento": "2017-12-18",
          "numero_referencia": "1345678",
          "fecha_creacion": "2017-12-18 15:30:00",
          "id_caja": 44,
          "id_sucursal": 1,
          "nombre_sucursal": "NORTE",
          "links": [
              {
                  "rel": "self",
                  "href": "https://api.medilink2.healthatom.com/api/v5/pagos/904",
                  "method": "GET"
              }
          ]
      },
      {
            "id": 845,
            "id_cliente": 81,
            "nombre_cliente": "Juan Pérez González",
            "id_paciente": 89,
            "nombre_paciente": "Carlos Pérez Soto",
            "monto_pago": 100000,
            "medio_pago": "Efectivo",
            "nombre_banco": "",
            "fecha_recepcion": "2017-11-24",
            "fecha_vencimiento": "2017-11-24",
            "numero_referencia": "1345678",
            "fecha_creacion": "2017-11-24 12:00:00",
            "id_caja": 44,
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagos/845",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /cajas/{id_caja}/devoluciones

Muestra el listado de todas las devoluciones de la caja.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_caja  = 44;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/cajas/"+id_caja+"/devoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 784,
            "id_pago_asociado": 781,
            "id_cliente": 9,
            "nombre_cliente": "Eduardo Perez",
            "id_paciente": 9,
            "nombre_paciente": "Eduardo Perez",
            "monto_pago": 90000,
            "medio_pago": "Cheque",
            "nombre_banco": "",
            "fecha_creacion": "2017-10-23 15:45:00",
            "id_caja": 40,
            "id_sucursal": 2,
            "nombre_sucursal": "SUR"
        },
        {
            "id": 783,
            "id_pago_asociado": 782,
            "id_cliente": 9,
            "nombre_cliente": "Eduardo Perez",
            "id_paciente": 9,
            "nombre_paciente": "Eduardo Perez",
            "monto_pago": 90000,
            "medio_pago": "Efectivo",
            "nombre_banco": "",
            "fecha_creacion": "2017-10-23 08:15:00",
            "id_caja": 40,
            "id_sucursal": 2,
            "nombre_sucursal": "SUR"
        }
    ]
}
```

## `GET` /camposAdicionales

Muestra la información de todos los campos adicionales que pueden tener los pacientes de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "links": {
        "current": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales?cursor=NUMnd4...fQ=="
    },
    "data": [
        {
            "id": 2,
            "nombre": "Diagnosticador",
            "codigo": "diagnosticador",
            "tipo": "Selección",
            "tipo_interno": "selection",
            "opciones": [
                {
                    "id": 1,
                    "name": "Médico 1"
                }
            ],
            "fecha_creacion": "2019-09-05 17:04:09",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/2",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "Agente",
            "codigo": "agente",
            "tipo": "Texto",
            "tipo_interno": "text",
            "opciones": "",
            "fecha_creacion": "2019-05-29 11:21:53",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /camposAdicionales/{id_campo}

Muestra la información de un campo adicional en específico, que pueden tener los pacientes de la clínica.

### Entrada

```javascript
var id_campo    = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/"+id_campo,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "nombre": "Diagnosticador",
        "codigo": "diagnosticador",
        "tipo": "Selección",
        "tipo_interno": "selection",
        "opciones": [
            {
                "id": 1,
                "name": "Médico 1"
            }
        ],
        "fecha_creacion": "2019-09-05 17:04:09",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/2",
                "method": "GET"
            }
        ]
    }
}
```

## `POST` /categorias

Permite crear una categoria de arancel.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/categorias/",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"    : "Categoria prueba",
        "id_tipo"   : 1
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 10,
        "nombre": "Categoria prueba",
        "id_tipo": 1,
        "tipo": "Acción clínica",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/categorias/10",
                "method": "GET"
            },
            {
                "rel": "prestaciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/categorias/10/prestaciones",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /categorias/{id_categoria}

Permite editar una categoria de arancel.

### Entrada

```javascript
var id_categoria    = 10;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/categorias/"+id_categoria,
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"    : "Categoria test",
        "habilitado"   : 1
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 10,
        "nombre": "Categoria test",
        "id_tipo": 3,
        "tipo": "Otros",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/categorias/10",
                "method": "GET"
            },
            {
                "rel": "prestaciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/categorias/10/prestaciones",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /categorias

Muestra el listado de todos las categorias de prestación de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/categorias",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 192,
            "nombre": "PRÓTESIS FIJA",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192/prestaciones",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 193,
            "nombre": "PRÓTESIS REMOVIBLE",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/193",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/193/prestaciones",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 194,
            "nombre": "PERIODONCIA",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/194",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/categorias/194/prestaciones",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /categorias/{id_categoria}

Muestra la información de una categoria en específico.

### Entrada

```javascript
var id_categoria = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/categorias/"+id_categoria,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 192,
        "nombre": "PRÓTESIS FIJA",
        "id_tipo": 1,
        "tipo": "Acción Clínica",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/categorias/192/prestaciones",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /categorias/{id_categoria}/prestaciones

Muestra el listado de todas las prestaciones pertenecientes a la categoria definida.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_categoria    = 2;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/categorias/"+id_categoria+"/prestaciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "Exodoncia tercer molar",
            "id_arancel": 0,
            "arancel": "Arancel base",
            "id_categoria": 2,
            "categoria": "General",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 55000,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/prestaciones/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Examén inicial",
            "id_arancel": 1,
            "arancel": "Arancel Extendido",
            "id_categoria": 2,
            "categoria": "General",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 1000,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/prestaciones/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `POST` /citas/

Permite agendar citas a pacientes.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/citas/",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "id_profesional"    : 2,
        "id_sucursal"       : 1,
        "id_estado"         : 7,
        "id_sillon"        : 1,
        "id_paciente"       : 2,
        "id_atencion"       : 2,
        "fecha"             : "2018-11-02",
        "hora_inicio"       : "09:00",
        "duracion"          : 30,
        "comentario"        : "Control general",
        "videoconsulta"     : 1
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 754,
        "id_paciente": 2,
        "nombre_paciente": "Fernanda Risopatrón",
        "id_estado": 7,
        "estado_cita": "No confirmado",
        "estado_anulacion": 0,
        "id_atencion": 2,
        "nombre_tratamiento": "Exodoncia",
        "id_profesional": 2,
        "nombre_profesional": "Daniel Vergara",
        "id_sucursal": 1,
        "nombre_sucursal": "NORTE",
        "id_sillon": 1,
        "nombre_sillon": "Sillon 1",
        "fecha": "2018-11-02",
        "hora_inicio": "09:00:00",
        "hora_fin": "09:30:00",
        "duracion": 30,
        "comentarios": "Control exodoncia",
        "fecha_actualizacion": "2018-11-05 17:09:01",
        "links": [
            {
                "rel": "self",
                "href": "http://api.medilink2.healthatom.com/api/v5/citas/754",
                "method": "GET"
            },
            {
                "rel": "pacientes",
                "href": "http://api.medilink2.healthatom.com/api/v5/pacientes/2",
                "method": "GET"
            },
            {
                "rel": "atenciones",
                "href": "http://api.medilink2.healthatom.com/api/v5/atenciones/2",
                "method": "GET"
            },
        ]
    }
}
```

## `PUT` /citas/{id_cita}

Permite modificar el estado, duración y comentario de una cita.

### Entrada

```javascript
var id_cita     = 4;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/citas/"+id_cita,
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "id_estado":7,
        "duracion":15,
        "comentario":"Este es un comentario",
        "citas_relacionadas":1
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 4,
        "id_paciente": 1,
        "nombre_paciente": "Juan Lopez",
        "id_estado":7,
        "estado_cita": "No confirmado",
        "id_atencion": 6,
        "fecha": "2016-06-24",
        "hora_inicio": "09:15:00",
        "hora_fin": "09:30:00",
        "duracion": 15,
        "id_profesional": 3,
        "nombre_profesional": "Fernanda Risopatrón",
        "id_sucursal": 1,
        "nombre_sucursal": "NORTE",
        "id_sillon": 1,
        "comentarios": "Este es un comentario",
        "fecha_actualizacion": "2016-06-27 10:09:01",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/citas/4",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /citas

Muestra el listado de todas las citas de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/citas",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 4,
            "id_paciente": 1,
            "nombre_paciente": "Juan Lopez",
            "id_estado": 1,
            "estado_cita": "Anulado",
            "id_atencion": 6,
            "fecha": "2016-06-24",
            "hora_inicio": "09:15:00",
            "hora_fin": "09:30:00",
            "duracion": 15,
            "id_profesional": 3,
            "nombre_profesional": "Fernanda Risopatrón",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-27 10:09:01",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/4",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 5,
            "id_paciente": 1,
            "nombre_paciente": "Juan Lopez",
            "id_estado": 7,
            "estado_cita": "No confirmado",
            "id_atencion": 6,
            "fecha": "2016-06-23",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:15:00",
            "duracion": 15,
            "id_profesional": 3,
            "nombre_profesional": "Fernanda Risopatrón",
            "id_sucursal": 2,
            "nombre_sucursal": "SUR",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-27 10:09:01",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/5",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /citas/{id_cita}

Muestra la información de una cita en específico.

### Entrada

```javascript
var id_cita     = 4;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/citas/"+id_cita,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 4,
        "id_paciente": 1,
        "nombre_paciente": "Juan Lopez",
        "id_estado": 1,
        "estado_cita": "Anulado",
        "id_atencion": 6,
        "fecha": "2016-06-24",
        "hora_inicio": "09:15:00",
        "hora_fin": "09:30:00",
        "duracion": 15,
        "id_profesional": 3,
        "nombre_profesional": "Fernanda Risopatrón",
        "id_sucursal": 1,
        "nombre_sucursal": "NORTE",
        "id_sillon": 1,
        "comentarios": "",
        "fecha_actualizacion": "2016-06-25 13:24:02",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/citas/4",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /citas/{id_cita}/estados

Muestra el historial de los estados por los que se ha actualizado la cita, en orden descendiente del último al primero.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/citas/{id_cita}/estados",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "links": {
        "current": "http://api-dentalink.test/api/v1/citas/1/estados?cursor=NUl2Mnd4Q3oyNDdQeyJwYWdlIjowLCJsaW1pdCI6NTAsInF1ZXJ5IjpbXX0="
    },
    "data": [
        {
            "id": 1,
            "id_cita": 1,
            "id_estado_cita": 7,
            "nombre_estado_cita": "No confirmado",
            "comentarios": "",
            "id_usuario": 12786,
            "nombre_usuario": "Agenda",
            "fecha": "2024-10-08 02:55:36"
        }
    ]
}
```

## `GET` /configuraciones

Muestra la información correspondiente a los parámetros de configuración.

### Entrada

```javascript
var params      = {
    "parametro": {"eq": "timezone"}
};
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/configuraciones/",
    "method"    : "GET",
    "data"      : "q=" + JSON.stringify(params)
    "headers"   : {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "parametro": "timezone",
        "valor": "America/Argentina/Buenos_Aires"
    }
}
```

## `POST` /convenios

Permite crear un convenio y su empresa asociada.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios",
    "method"    : "POST",
    "headers"   : {
        "Authorization": "Token " + token
    },
    "data":{
        "nombre"                  : "Funcionarios",
        "nombre_empresa"          : "Medilink",
        "contacto_empresa"        : "Juan",
        "direccion_empresa"       : "Badajoz 45",
        "comuna_empresa"          : "Las Condes",
        "ciudad_empresa"          : "Santiago",
        "mail_empresa"            : "contacto@empresa.cl",
        "telefono_empresa_1"      : "5345467545",
        "telefono_empresa_2"      : "3534234334",
        "id_arancel"              : 2,
        "descuento"               : 50,
        "ajuste"                  : 100,
        "descuentos_por_planilla" : 1,
        "descuentos_laboratorios" : 1,
        "observacion"             : "Convenio funcionarios",
        "rut_empresa"             : "2-7",
        "descuentos_otros"        : 0
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 15,
        "nombre": "Funcionarios",
        "id_empresa": 214,
        "nombre_empresa": "Medilink",
        "contacto_empresa": "Juan",
        "rut_empresa": "2-7",
        "telefono_empresa_1": "5345467545",
        "telefono_empresa_2": "3534234334",
        "direccion_empresa": "Badajoz 45",
        "comuna_empresa": "Las Condes",
        "ciudad_empresa": "Santiago",
        "mail_empresa": "contacto@empresa.cl",
        "fecha_afiliacion": "2018-11-14",
        "id_arancel": 2,
        "nombre_arancel": "Medilink",
        "observacion": "Convenio funcionarios",
        "descuento": 50,
        "ajuste": 100,
        "descuentos_por_planilla": 1,
        "descuentos_laboratorios": 1,
        "descuentos_otros": 0,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/15",
                "method": "GET"
            },
            {
                "rel": "detalles",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/15/categorias",
                "method": "GET"
            },
            {
                "rel": "sucursales",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/15/sucursales",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /convenios/{id_convenio}

Permite editar un convenio y su empresa asociada.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio = 15;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio,
    "method"    : "PUT",
    "headers"   : {
        "Authorization": "Token " + token
    },
    "data":{
        "habilitado" : 0
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 15,
        "nombre": "Funcionarios",
        "id_empresa": 214,
        "nombre_empresa": "Medilink",
        "contacto_empresa": "Juan",
        "rut_empresa": "2-7",
        "telefono_empresa_1": "5345467545",
        "telefono_empresa_2": "3534234334",
        "direccion_empresa": "Badajoz 45",
        "comuna_empresa": "Las Condes",
        "ciudad_empresa": "Santiago",
        "mail_empresa": "contacto@empresa.cl",
        "fecha_afiliacion": "2018-11-14",
        "id_arancel": 2,
        "nombre_arancel": "Medilink",
        "observacion": "Convenio funcionarios",
        "descuento": 50,
        "ajuste": 100,
        "descuentos_por_planilla": 1,
        "descuentos_laboratorios": 1,
        "descuentos_otros": 0,
        "habilitado": 0,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/15",
                "method": "GET"
            },
            {
                "rel": "detalles",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/15/categorias",
                "method": "GET"
            },
            {
                "rel": "sucursales",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/15/sucursales",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /convenios

Muestra el listado de todos los convenios de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 8,
            "nombre": "Funcionarios",
            "id_empresa": 137,
            "nombre_empresa": "Medilink",
            "contacto_empresa": "Juan Perez",
            "rut_empresa": "1-9",
            "telefono_empresa_1": "232239970",
            "telefono_empresa_2": "929492221",
            "direccion_empresa": "Badajoz 45",
            "comuna_empresa": "Las Condes",
            "ciudad_empresa": "Santiago",
            "mail_empresa": "convenio@ejemplo.com",
            "fecha_afiliacion": "2017-06-09",
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "observacion": "",
            "descuento": 50,
            "ajuste": 100,
            "descuentos_por_planilla": 0,
            "descuentos_laboratorios": 1,
            "descuentos_otros": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/8",
                    "method": "GET"
                },
                {
                    "rel": "detalles",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/8/categorias",
                    "method": "GET"
                },
                {
                    "rel": "sucursales",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/8/sucursales",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 7,
            "nombre": "Familia",
            "id_empresa": 99,
            "nombre_empresa": "Centro Medilink",
            "contacto_empresa": "Ana Lopez",
            "rut_empresa": "2-7",
            "telefono_empresa_1": "2342346566",
            "telefono_empresa_2": "1267567563",
            "direccion_empresa": "Apoquindo 6410",
            "comuna_empresa": "Las Condes",
            "ciudad_empresa": "Santiago",
            "mail_empresa": "centro@ejemplo.com",
            "fecha_afiliacion": "2017-06-09",
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "observacion": "",
            "descuento": 20,
            "ajuste": 100,
            "descuentos_por_planilla": 0,
            "descuentos_laboratorios": 0,
            "descuentos_otros": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7",
                    "method": "GET"
                },
                {
                    "rel": "detalles",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7/categorias",
                    "method": "GET"
                },
                {
                    "rel": "sucursales",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7/sucursales",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /convenios/{id_convenio}

Muestra la información un convenio en específico de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio = 7;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 7,
        "nombre": "Familia",
        "id_empresa": 99,
        "nombre_empresa": "Centro Medilink",
        "contacto_empresa": "Ana Lopez",
        "rut_empresa": "2-7",
        "telefono_empresa_1": "2342346566",
        "telefono_empresa_2": "1267567563",
        "direccion_empresa": "Apoquindo 6410",
        "comuna_empresa": "Las Condes",
        "ciudad_empresa": "Santiago",
        "mail_empresa": "centro@ejemplo.com",
        "fecha_afiliacion": "2017-06-09",
        "id_arancel": 0,
        "nombre_arancel": "Arancel base",
        "observacion": "",
        "descuento": 20,
        "ajuste": 100,
        "descuentos_por_planilla": 0,
        "descuentos_laboratorios": 0,
        "descuentos_otros": 0,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7",
                "method": "GET"
            },
            {
                "rel": "detalles",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7/categorias",
                "method": "GET"
            },
            {
                "rel": "sucursales",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7/sucursales",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /convenios/{id_convenio}/categorias

Muestra los descuentos por categoria asociados al convenio.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio = 4;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/categorias",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 163,
            "nombre_categoria": "ACCIONES DE CIRUGIA BUCAL Y MAXILOFACIAL",
            "descuento": 10,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/categorias/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 165,
            "nombre_categoria": "Ortodoncia",
            "descuento": 20,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/categorias/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /convenios/{id_convenio}/categorias/{id_categoria}

Muestra el descuento de una categoria asociada al convenio.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio     = 4;
var id_categoria    = 163;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/categorias/"+id_categoria,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 163,
        "nombre_categoria": "ACCIONES DE CIRUGIA BUCAL Y MAXILOFACIAL",
        "descuento": 10,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/categorias/1",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /convenios/{id_convenio}/sucursales

Muestra los descuentos y ajustes específicos del convenio en sucursales.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio = 2;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/sucursales",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "links": {
        "current": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales?cursor=NUl2Mnd4Q3oyNDdQeyJwYWdlIjowLCJsaW1pdCI6IjUwIiwicXVlcnkiOltdfQ=="
    },
    "data": [
        {
            "id": 2,
            "nombre_sucursal": "SUR",
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "descuento": 25.5,
            "ajuste": 100,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/2",
                    "method": "GET"
                },
                {
                    "rel": "categorias",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/2/categorias",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre_sucursal": "NORTE",
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "descuento": 45,
            "ajuste": 100,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/1",
                    "method": "GET"
                },
                {
                    "rel": "categorias",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/1/categorias",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /convenios/{id_convenio}/sucursales/{id_sucursal}

Muestra los descuentos y ajustes específicos del convenio en una sucursal.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio = 2;
var id_sucursal = 1;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/sucursales/"+id_sucursal,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 1,
        "nombre_sucursal": "NORTE",
        "id_arancel": 0,
        "nombre_arancel": "Arancel base",
        "descuento": 45,
        "ajuste": 100,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/1",
                "method": "GET"
            },
            {
                "rel": "categorias",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/1/categorias",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /convenios/{id_convenio}/sucursales/{id_sucursal}/categorias

Muestra los descuentos específicos del convenio para categorias en la sucursal.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio = 2;
var id_sucursal = 1;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/sucursales/"+id_sucursal+"/categorias",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 162,
            "nombre_categoria": "General",
            "descuento": 85.5,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/2/categorias/162",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /convenios/{id_convenio}/sucursales/{id_sucursal}/categorias/{id_categoria}

Muestra los descuentos específicos del convenio para una categoria en la sucursal.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio     = 2;
var id_sucursal     = 1;
var id_categoria    = 162;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/sucursales/"+id_sucursal+"/categorias/"+id_categoria,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 162,
        "nombre_categoria": "General",
        "descuento": 85.5,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/2/sucursales/2/categorias/162",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /convenios/{id_convenio}/cuotas

Muestra el listado de cuotas de descuentos por planilla asociadas al convenio.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_convenio     = 4;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/cuotas",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 2,
            "id_paciente": 54,
            "nombre_paciente": "LUIS CASTILLO NARANJO",
            "nombres_social_paciente":"LUISIN",
            "id_tratamiento": 6,
            "nombre_tratamiento": "Prueba Descuento Planilla",
            "id_convenio": 4,
            "nombre_convenio": "GOB-MIN",
            "id_descuento_planilla": 1,
            "fecha_creacion": "2018-06-13",
            "numero_cuota": 2,
            "fecha_vencimiento": "2018-05-04",
            "pagado": 0,
            "por_pagar": 30525,
            "total": 30525,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/cuotas/2",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "id_paciente": 54,
            "nombre_paciente": "LUIS CASTILLO NARANJO",
            "nombre_social_paciente":"LUISIN",
            "id_tratamiento": 6,
            "nombre_tratamiento": "Prueba Descuento Planilla",
            "id_convenio": 4,
            "nombre_convenio": "GOB-MIN",
            "id_descuento_planilla": 1,
            "fecha_creacion": "2018-06-13",
            "numero_cuota": 1,
            "fecha_vencimiento": "2018-04-04",
            "pagado": 30525,
            "por_pagar": 0,
            "total": 30525,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/cuotas/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /convenios/{id_convenio}/cuotas/{id_cuota}

Muestra una cuota de descuento por planilla.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_convenio     = 4;
var id_cuota        = 1;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/cuotas/"+id_cuota,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 1,
        "id_paciente": 54,
        "nombre_paciente": "LUIS CASTILLO NARANJO",
        "nombre_social_paciente":"LUISIN",
        "id_tratamiento": 6,
        "nombre_tratamiento": "Prueba Descuento Planilla",
        "id_convenio": 4,
        "nombre_convenio": "GOB-MIN",
        "id_descuento_planilla": 1,
        "fecha_creacion": "2018-06-13",
        "numero_cuota": 1,
        "fecha_vencimiento": "2018-04-04",
        "pagado": 30525,
        "por_pagar": 0,
        "total": 30525,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/cuotas/1",
                "method": "GET"
            }
        ]
    }
}
```

## `POST` /convenios/{id_convenio}/pagos

Permite pagar deudas convenios por paciente.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio = 4;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/pagos",
    "method"    : "POST",
    "headers"   : {
        "Authorization": "Token " + token
    },
    "data":{
        "id_paciente": 1226,
        "id_medio_pago": 0,
        "monto_pago": 80000,
        "abonar_proximos":1,
        "id_sucursal":1
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 35,
        "id_convenio": 4,
        "nombre_convenio": "GOB-MIN",
        "nombre_empresa": "Ministerio de Gobierno",
        "id_paciente": 1226,
        "nombre_paciente": "AARON  DANIEL SALINAS FERNANDEZ",
        "nombre_social_paciente": "ANDIEL",
        "monto_pago": 80000,
        "id_medio_pago": 0,
        "medio_pago": "Efectivo",
        "id_banco": "",
        "nombre_banco": "",
        "fecha_recepcion": "2019-04-12",
        "fecha_vencimiento": "2019-04-12",
        "fecha_creacion": "2019-04-12 15:56:15",
        "numero_referencia": "",
        "rut_emisor": "",
        "id_sucursal": 1,
        "nombre_sucursal": "Sandbox API",
        "folio": "",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/pagos/35",
                "method": "GET"
            }
        ]
    }
}
```

## `DELETE` /convenios/{id_convenio}/pagos/{id_pago}

Permite eliminar un pago de convenio.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_convenio     = 4;
var id_pago         = 35;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/pagos/"+id_pago,
    "method"    : "DELETE",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

_Sin ejemplo de respuesta JSON en la doc._

## `GET` /convenios/{id_convenio}/pagos

Muestra el listado de pagos de descuentos por planilla asociadas al convenio.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_convenio     = 4;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/convenios/"+id_convenio+"/pagos",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 35,
            "id_convenio": 4,
            "nombre_convenio": "GOB-MIN",
            "nombre_empresa": "Ministerio de Gobierno",
            "id_paciente": 1226,
            "nombre_paciente": "AARON  DANIEL SALINAS FERNANDEZ",
            "nombre_social_paciente":"ANDIEL",
            "monto_pago": 80000,
            "id_medio_pago": 0,
            "medio_pago": "Efectivo",
            "id_banco": "",
            "nombre_banco": "",
            "fecha_recepcion": "2019-04-12",
            "fecha_vencimiento": "2019-04-12",
            "fecha_creacion": "2019-04-12 15:56:15",
            "numero_referencia": "",
            "rut_emisor": "",
            "id_sucursal": 1,
            "nombre_sucursal": "Sandbox API",
            "folio_boleta": "",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/pagos/35",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 34,
            "id_convenio": 4,
            "nombre_convenio": "GOB-MIN",
            "nombre_empresa": "Ministerio de Gobierno",
            "id_paciente": 1226,
            "nombre_paciente": "AARON  DANIEL SALINAS FERNANDEZ",
            "nombre_social_paciente":"ANDIEL",
            "monto_pago": 80000,
            "id_medio_pago": 0,
            "medio_pago": "Efectivo",
            "id_banco": "",
            "nombre_banco": "",
            "fecha_recepcion": "2019-04-15",
            "fecha_vencimiento": "2019-04-15",
            "fecha_creacion": "2019-04-15 14:16:16",
            "numero_referencia": "",
            "rut_emisor": "",
            "id_sucursal": 1,
            "nombre_sucursal": "Sandbox API",
            "folio_boleta": "",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/4/pagos/34",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /documentosClinicos

Muestra el listado de todos los documentos clínicos.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/documentosClinicos/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 14,
            "id_tipo_documento": 25,
            "nombre_documento": "Alta Tratamiento Paciente",
            "id_paciente": 11505,
            "nombre_paciente": "Maria Morales ",
            "nombre_social_paciente": "",
            "id_profesional": 4,
            "nombre_profesional": "Rosa Lopez",
            "id_usuario": 7,
            "nombre_usuario": "Soporte Engenis",
            "id_sucursal": 1,
            "nombre_sucursal": "Norte",
            "fecha": "2022-12-29 14:51:14",
            "habilitado": 1,
            "datos": [
                {
                    "campo": "Edad",
                    "valor": "23"
                },
                {
                    "campo": "Diagnóstico ",
                    "valor": "Desdentada parcial Caries"
                },
                {
                    "campo": "Tratamiento",
                    "valor": "Restauraciones Prótesis"
                },
                {
                    "campo": "Indicaciones ",
                    "valor": "Limpiezas con Dr. Aguilera "
                },
                {
                    "campo": "Control y Seguimiento ",
                    "valor": "Control en 1 año"
                }
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/documentosClinicos/14",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 15,
            "id_tipo_documento": 24,
            "nombre_documento": "Plantilla Registro de criterios mínimos",
            "id_paciente": 2342,
            "nombre_paciente": "Luna Villasmil",
            "nombre_social_paciente": "",
            "id_profesional": 8,
            "nombre_profesional": "Cindy Flores",
            "id_usuario": 11,
            "nombre_usuario": "Cindy Flores",
            "id_sucursal": 1,
            "nombre_sucursal": "Norte",
            "fecha": "2022-12-23 20:18:50",
            "habilitado": 1,
            "datos": [
                {
                    "campo": "title",
                    "valor": "Plantilla Registro de criterios mínimos"
                },
                {
                    "campo": "text",
                    "valor": "Motivo de consulta:\nAnamnesis:\nAntecedentes de alergia y patologías relevantes:\nAntecedentes de medicamentos:\nAntecedentes socioeconómicos, culturales y religiosos:\nRed de apoyo adecuada. No presenta conflictos culturales ni religiosos:\nExamen intraoral de la especialidad:\nDiagnóstico: \nPlan de tratamiento e interconsulta:\n"
                }
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/documentosClinicos/15",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /documentosClinicos/{id_documento}

Muestra la información del documento clínico específico.

### Entrada

```javascript
var id_documento    = 33;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/documentosClinicos/"+id_documento,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 33,
        "id_tipo_documento": 25,
        "nombre_documento": "Alta Tratamiento Paciente",
        "id_paciente": 2094,
        "nombre_paciente": "TRINA RODRIGUEZ",
        "nombre_social_paciente": "",
        "id_profesional": 6,
        "nombre_profesional": "Camilo Navarro",
        "id_usuario": 9,
        "nombre_usuario": "Marisol Frorez",
        "id_sucursal": 1,
        "nombre_sucursal": "Norte",
        "fecha": "2022-12-21 13:43:20",
        "habilitado": 1,
        "datos": [
            {
                "campo": "Edad",
                "valor": "30 años"
            },
            {
                "campo": "Diagnóstico ",
                "valor": "Gingivitis en periodonto disminuido"
            },
            {
                "campo": "Tratamiento",
                "valor": "Terapia periodontal de soporte"
            },
            {
                "campo": "Indicaciones ",
                "valor": "control placa bacteriana"
            },
            {
                "campo": "Control y Seguimiento ",
                "valor": "indico TPS cada 6 meses Mayo 2023"
            }
        ],
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/documentosClinicos/33",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /documentosClinicos/tipos

Se listan los tipos de documentos clínicos existentes.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/documentosClinicos/tipos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_tipo_documento": 27,
            "nombre": "Consentimiento Informado para Endodoncia  (Denegación o Revocación)",
            "habilitado": 1
        },
        {
            "id_tipo_documento": 24,
            "nombre": "Plantilla Registro de criterios mínimos",
            "habilitado": 1
        },
        {
            "id_tipo_documento": 23,
            "nombre": "Consentimiento Informado Generico",
            "habilitado": 0
        },
        {
            "id_tipo_documento": 22,
            "nombre": "Consentimiento endodoncia ",
            "habilitado": 0
        },
        {
            "id_tipo_documento": 19,
            "nombre": "Post-Blanqueamiento",
            "habilitado": 1
        },
        {
            "id_tipo_documento": 13,
            "nombre": "Historia Clínica",
            "habilitado": 1
        },
        {
            "id_tipo_documento": 12,
            "nombre": "Ficha General",
            "habilitado": 1
        }
    ]
}
```

## `GET` /documentosClinicos/tipos/{id_tipo_documento}

Muestra la información de un tipo documento clínico específico.

### Entrada

```javascript
var id_tipo_documento    = 12;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/documentosClinicos/tipos/"+id_tipo_documento,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id_tipo_documento": 12,
        "nombre": "Alta Tratamiento Paciente",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/documentosClinicos/tipos/12",
                "method": "GET"
            }
        ]   
    }
}
```

## `GET` /documentosTributarios

A este endpoint solo pueden acceder las clínicas que tengan la nueva facturación electrónica. Muestra la información de todos los documentos tributarios ingresados en la clínica. Estos documentos pueden ser:

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 32,
            "folio_documento": 386,
            "rut": "11111111-1",
            "id_receptor": 89,
            "tipo_receptor": "Paciente",
            "nombre_receptor": "Juan Pérez González",
            "id_sucursal": 0,
            "id_emisor": 2,
            "nombre_emisor": "Bsale",
            "razon_social_emisor": "Medilink",
            "inicio_rango": 1,
            "fin_rango": 100000,
            "id_tipo_documento": 3,
            "tipo_documento": "Boleta exenta",
            "fecha_emision": "2017-09-27 07:27:40",
            "total_boleta": 1,
            "referencias": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/32",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/32/referencias",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 31,
            "folio_documento": 384,
            "rut": "1-9",
            "id_receptor": 2,
            "tipo_receptor": "Paciente",
            "nombre_receptor": "María González",
            "id_sucursal": 0,
            "id_emisor": 2,
            "nombre_emisor": "Bsale",
            "razon_social_emisor": "Medilink",
            "inicio_rango": 1,
            "fin_rango": 100000,
            "id_tipo_documento": 3,
            "tipo_documento": "Boleta exenta",
            "fecha_emision": "2017-09-20 23:10:52",
            "total_boleta": 1,
            "referencias": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/31",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/31/referencias",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /documentosTributarios/{id_documento}

Muestra la información de una boleta en específico.

### Entrada

```javascript
var id_documento    = 32;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/"+id_documento,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 32,
        "folio_documento": 386,
        "rut": "11111111-1",
        "id_receptor": 89,
        "tipo_receptor": "Paciente",
        "nombre_receptor": "Juan Pérez González",
        "id_sucursal": 0,
        "id_emisor": 2,
        "nombre_emisor": "Bsale",
        "razon_social_emisor": "Medilink",
        "inicio_rango": 1,
        "fin_rango": 100000,
        "id_tipo_documento": 3,
        "tipo_documento": "Boleta exenta",
        "fecha_emision": "2017-09-27 07:27:40",
        "total_boleta": 1,
        "referencias": 0,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/32",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/32/referencias",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /documentosTributarios/{id_documento}/referencias

A este endpoint solo pueden acceder las clínicas que tengan la nueva facturación electrónica. Muestra la información de todos los documentos tributarios asociados a uno en especifico. Por ejemplo si se desea saber qué notas de créditos están asociadas a una boleta en especifico.

### Entrada

```javascript
var id_documento    = 12;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/"+id_documento+"/referencias",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "links": {
        "current": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/12/referencias?cursor=NUl2Mnd4Q3oyNDdQey...cnkiOltdfQ=="
    },
    "data": [
        {
           "id": 32,
           "folio_documento": 386,
           "rut": "11111111-1",
           "id_receptor": 89,
           "tipo_receptor": "Paciente",
           "nombre_receptor": "Juan Pérez González",
           "id_sucursal": 1,
           "id_emisor": 2,
           "nombre_emisor": "Bsale",
           "razon_social_emisor": "Medilink",
           "inicio_rango": 1,
           "fin_rango": 100000,
           "id_tipo_documento": 2,
           "tipo_documento": "Nota de Credito",
           "fecha_emision": "2017-09-27 07:27:40",
           "total_boleta": 1,
           "referencias": 1,
           "links": [
                {
                   "rel": "self",
                   "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/32",
                   "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/documentosTributarios/32/referencias",
                    "method": "GET"
                }
           ]
       }
    ]
}
```

## `GET` /empresas

Muestra la información de todas las empresas.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/empresas/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "Empresa A",
            "contacto": "Juan Perez",
            "telefono_1": "23443212",
            "telefono_2": "93423434",
            "ciudad": "Santiago",
            "comuna": "Santiago",
            "direccion": "Merced 327",
            "mail": "empresaa@mail.com",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://apimed.loc/api/v5/empresas/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Empresa B",
            "contacto": "Ramon Lopez",
            "telefono_1": "893849394",
            "telefono_2": "342346728",
            "ciudad": "Buin",
            "comuna": "Buin",
            "direccion": "Alameda 234",
            "mail": "empresab@mail.com",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://apimed.loc/api/v5/empresas/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /empresas/{id_empresa}

Muestra la información de una empresa.

### Entrada

```javascript
var id_empresa    = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/empresas/"+id_empresa,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 1,
        "nombre": "Empresa A",
        "contacto": "Juan Perez",
        "telefono_1": "23443212",
        "telefono_2": "93423434",
        "ciudad": "Santiago",
        "comuna": "Santiago",
        "direccion": "Merced 327",
        "mail": "empresaa@mail.com",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "http://apimed.loc/api/v5/empresas/1",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /empresas/{id_empresa}/convenios

Muestra el listado de todos los convenios de la empresa (solo 1 convenio por empresa por el momento).

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_empresa = 1;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/empresas/"+id_empresa+"/convenios",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "Convenio A",
            "id_empresa": 1,
            "nombre_empresa": "Empresa A",
            "observacion": "",
            "descuento": 0.3,
            "fecha": "2016-06-13 15:31:04",
            "descuentos_por_planilla": 1,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/convenios/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /encuestas/satisfaccion/atributos

Muestra los resultados de la encuesta de satisfacción agrupandolos por atributos, se puede filtrar la información por fecha (mes y año), sucursal y/o profesional.

### Entrada

```javascript
var params      =   {
                        "fecha"      : {"eq":"2020-03-20"},
                        "id_sucursal"       : {"eq":1},
                        "id_profesional"       : {"eq":8}
                    }

var settings    =   {
                        "url"       :   "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos",
                        "method"    :   "GET",
                        "data"      :   "q="+JSON.stringify(params),
                        "headers"   :   {
                                            "Authorization": "Token "+token
                                        }
                    }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 9,
            "nombre": "Agendamiento",
            "suma_resultados": 3,
            "cant_respuestas": 2,
            "puntaje": 1.5,
            "detalles": [
                {
                    "resultado": 2,
                    "cantidad": 1
                },
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/9/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Calidad Atención Clínica",
            "suma_resultados": 0,
            "cant_respuestas": 0,
            "puntaje": 0,
            "detalles": [],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/2/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 5,
            "nombre": "Cordialidad del personal",
            "suma_resultados": 1,
            "cant_respuestas": 1,
            "puntaje": 1,
            "detalles": [
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/5/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 4,
            "nombre": "Orden y Limpieza",
            "suma_resultados": 0,
            "cant_respuestas": 0,
            "puntaje": 0,
            "detalles": [],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/4/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 10,
            "nombre": "Precio",
            "suma_resultados": 3,
            "cant_respuestas": 2,
            "puntaje": 1.5,
            "detalles": [
                {
                    "resultado": 2,
                    "cantidad": 1
                },
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/10/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 7,
            "nombre": "Recomendabilidad",
            "suma_resultados": 1,
            "cant_respuestas": 1,
            "puntaje": 1,
            "detalles": [
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/7/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 8,
            "nombre": "Retornabilidad",
            "suma_resultados": 1,
            "cant_respuestas": 1,
            "puntaje": 1,
            "detalles": [
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/8/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 3,
            "nombre": "Satisfacción General",
            "suma_resultados": 1,
            "cant_respuestas": 1,
            "puntaje": 1,
            "detalles": [
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/3/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 6,
            "nombre": "Servicio Post-venta",
            "suma_resultados": 0,
            "cant_respuestas": 0,
            "puntaje": 0,
            "detalles": [],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/6/preguntas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "Tiempo de Atención",
            "suma_resultados": 0,
            "cant_respuestas": 0,
            "puntaje": 0,
            "detalles": [],
            "link": [
                {
                    "rel": "preguntas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/1/preguntas",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /encuestas/satisfaccion/atributos/{id_atributo}/preguntas

Muestra los resultados de la encuesta de satisfacción agrupandolos por atributos y preguntas, se puede filtrar la información por fecha (mes y año), sucursal y/o profesional.

### Entrada

```javascript
var params      =   {
                        "fecha"      : {"eq":"2020-03-20"},
                        "id_sucursal"       : {"eq":1},
                        "id_profesional"       : {"eq":8}
                    }

var id_atributo = 10
var settings    =   {
                        "url"       :   "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/atributos/"+id_atributo+"/preguntas",
                        "method"    :   "GET",
                        "data"      :   "q="+JSON.stringify(params),
                        "headers"   :   {
                                            "Authorization": "Token "+token
                                        }
                    }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 15,
            "nombre": "Fue fácil conseguir una cita que calzara con mis necesidades",
            "id_atributo": 9,
            "suma_resultados": 1,
            "cant_respuestas": 1,
            "puntaje": 1,
            "detalles": [
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "respuestas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/preguntas/15/respuestas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 16,
            "nombre": "Fue fácil contactar (telefónicamente o vía e-mail) a la clínica",
            "id_atributo": 9,
            "suma_resultados": 0,
            "cant_respuestas": 0,
            "puntaje": 0,
            "detalles": [],
            "link": [
                {
                    "rel": "respuestas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/preguntas/16/respuestas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 17,
            "nombre": "Me contactaron oportunamente para confirmar mi asistencia",
            "id_atributo": 9,
            "suma_resultados": 2,
            "cant_respuestas": 1,
            "puntaje": 2,
            "detalles": [
                {
                    "resultado": 2,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "respuestas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/preguntas/17/respuestas",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /encuestas/satisfaccion/preguntas/{id_pregunta}/respuestas

Muestra los resultados de la encuesta de satisfacción, se puede filtrar la información por fecha (mes y año), sucursal y/o profesional.

### Entrada

```javascript
var params      =   {
                        "fecha"      : {"eq":"2020-03-20"},
                        "id_sucursal"       : {"eq":1},
                        "id_profesional"       : {"eq":8}
                    }

var id_pregunta = 10
var settings    =   {
                        "url"       :   "https://api.medilink2.healthatom.com/api/v5/encuestas/satisfaccion/preguntas/"+id_pregunta+"/respuestas",
                        "method"    :   "GET",
                        "data"      :   "q="+JSON.stringify(params),
                        "headers"   :   {
                                            "Authorization": "Token "+token
                                        }
                    }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 35,
            "profesional": "Carla Prueba",
            "id_paciente": 155,
            "paciente": "Luis Quezada",
            "id_pregunta": 18,
            "pregunta": "Los precios cobrados por la clínica se acomodan a mi presupuesto",
            "id_atributo": 10,
            "resultado": 1,
            "fecha_respuesta": "2019-03-19 15:39:21"
        }
    ]
}
```

## `GET` /encuestas/nps/profesionales

Muestra los resultados de la encuesta NPS agrupados por profesionales, se puede filtrar la información por fecha (mes y año), sucursal y/o profesional.

### Entrada

```javascript
var params      =   {
                        "fecha"      : {"eq":"2020-03-20"},
                        "id_sucursal"       : {"eq":1},
                        "id_profesional"       : {"eq":8}
                    }

var settings    =   {
                        "url"       :   "https://api.medilink2.healthatom.com/api/v5/encuestas/nps/profesionales",
                        "method"    :   "GET",
                        "data"      :   "q="+JSON.stringify(params),
                        "headers"   :   {
                                            "Authorization": "Token "+token
                                        }
                    }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 0,
            "profesional": "General",
            "puntaje": -28,
            "cant_promotores": 2,
            "puntaje_promotores": 28,
            "cant_neutros": 1,
            "puntaje_neutros": 14,
            "cant_detractores": 4,
            "puntaje_detractores": 57
        },
        {
            "id": 31,
            "profesional": "Luis Quezada S.",
            "puntaje": -50,
            "cant_promotores": 0,
            "puntaje_promotores": 0,
            "cant_neutros": 1,
            "puntaje_neutros": 50,
            "cant_detractores": 1,
            "puntaje_detractores": 50
        },
        {
            "id": 33,
            "profesional": "Pablo Espinoza Reyes",
            "puntaje": 0,
            "cant_promotores": 2,
            "puntaje_promotores": 50,
            "cant_neutros": 0,
            "puntaje_neutros": 0,
            "cant_detractores": 2,
            "puntaje_detractores": 50
        },
        {
            "id": 40,
            "profesional": "Pamela Jara Diaz",
            "puntaje": -100,
            "cant_promotores": 0,
            "puntaje_promotores": 0,
            "cant_neutros": 0,
            "puntaje_neutros": 0,
            "cant_detractores": 1,
            "puntaje_detractores": 100
        }
    ]
}
```

## `GET` /encuestas/nps/preguntas

Muestra los resultados de la encuesta NPS agrupados por preguntas, se puede filtrar la información por fecha (mes y año), sucursal y/o profesional.

### Entrada

```javascript
var params      =   {
                        "fecha"      : {"eq":"2020-03-20"},
                        "id_sucursal"       : {"eq":1},
                        "id_profesional"       : {"eq":8}
                    }

var id_atributo = 10
var settings    =   {
                        "url"       :   "https://api.medilink2.healthatom.com/api/v5/encuestas/nps/preguntas",
                        "method"    :   "GET",
                        "data"      :   "q="+JSON.stringify(params),
                        "headers"   :   {
                                            "Authorization": "Token "+token
                                        }
                    }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 20,
            "nombre": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "cant_respuestas": 7,
            "puntaje": -28,
            "cant_promotores": 2,
            "puntaje_promotores": 28,
            "cant_neutros": 1,
            "puntaje_neutros": 14,
            "cant_detractores": 4,
            "puntaje_detractores": 57,
            "detalles": [
                {
                    "resultado": 10,
                    "cantidad": 2
                },
                {
                    "resultado": 7,
                    "cantidad": 1
                },
                {
                    "resultado": 6,
                    "cantidad": 1
                },
                {
                    "resultado": 4,
                    "cantidad": 2
                },
                {
                    "resultado": 3,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "respuestas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/nps/preguntas/20/respuestas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 21,
            "nombre": "¿Como calificaría la infraestructura y limpieza?",
            "id_atributo": 11,
            "cant_respuestas": 5,
            "puntaje": -20,
            "cant_promotores": 1,
            "puntaje_promotores": 20,
            "cant_neutros": 2,
            "puntaje_neutros": 40,
            "cant_detractores": 2,
            "puntaje_detractores": 40,
            "detalles": [
                {
                    "resultado": 9,
                    "cantidad": 1
                },
                {
                    "resultado": 8,
                    "cantidad": 1
                },
                {
                    "resultado": 7,
                    "cantidad": 1
                },
                {
                    "resultado": 6,
                    "cantidad": 1
                },
                {
                    "resultado": 3,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "respuestas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/nps/preguntas/21/respuestas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 22,
            "nombre": "¿Como calificaría la atención en recepción?",
            "id_atributo": 11,
            "cant_respuestas": 5,
            "puntaje": -40,
            "cant_promotores": 0,
            "puntaje_promotores": 0,
            "cant_neutros": 3,
            "puntaje_neutros": 60,
            "cant_detractores": 2,
            "puntaje_detractores": 40,
            "detalles": [
                {
                    "resultado": 7,
                    "cantidad": 3
                },
                {
                    "resultado": 4,
                    "cantidad": 1
                },
                {
                    "resultado": 1,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "respuestas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/nps/preguntas/22/respuestas",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 23,
            "nombre": "¿Como calificaría la atención del profesional que lo atendió?",
            "id_atributo": 11,
            "cant_respuestas": 5,
            "puntaje": 20,
            "cant_promotores": 2,
            "puntaje_promotores": 40,
            "cant_neutros": 2,
            "puntaje_neutros": 40,
            "cant_detractores": 1,
            "puntaje_detractores": 20,
            "detalles": [
                {
                    "resultado": 10,
                    "cantidad": 1
                },
                {
                    "resultado": 9,
                    "cantidad": 1
                },
                {
                    "resultado": 7,
                    "cantidad": 2
                },
                {
                    "resultado": 5,
                    "cantidad": 1
                }
            ],
            "link": [
                {
                    "rel": "respuestas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/encuestas/nps/preguntas/23/respuestas",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /encuestas/nps/preguntas/{id_pregunta}/respuestas

Muestra los resultados de la encuesta NPS, se puede filtrar la información por fecha (mes y año), sucursal y/o profesional.

### Entrada

```javascript
var params      =   {
                        "fecha"      : {"eq":"2020-03-20"},
                        "id_sucursal"       : {"eq":1},
                        "id_profesional"       : {"eq":8}
                    }

var id_pregunta = 20
var settings    =   {
                        "url"       :   "https://api.medilink2.healthatom.com/api/v5/nps/preguntas/"+id_pregunta+"/respuestas",
                        "method"    :   "GET",
                        "data"      :   "q="+JSON.stringify(params),
                        "headers"   :   {
                                            "Authorization": "Token "+token
                                        }
                    }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 31,
            "profesional": "Luis Quezada S.",
            "id_paciente": 58,
            "paciente": "LUIS Morgado",
            "id_pregunta": 20,
            "pregunta": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "resultado": 7,
            "fecha_respuesta": "2019-01-11 19:01:39"
        },
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 31,
            "profesional": "Luis Quezada S.",
            "id_paciente": 155,
            "paciente": "Luis Quezada",
            "id_pregunta": 20,
            "pregunta": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "resultado": 3,
            "fecha_respuesta": "2018-12-27 18:58:56"
        },
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 33,
            "profesional": "Pablo Espinoza Reyes",
            "id_paciente": 3,
            "paciente": "Daniel Vergara",
            "id_pregunta": 20,
            "pregunta": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "resultado": 4,
            "fecha_respuesta": "2018-11-26 19:42:08"
        },
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 33,
            "profesional": "Pablo Espinoza Reyes",
            "id_paciente": 67,
            "paciente": "prueba 3 prueba",
            "id_pregunta": 20,
            "pregunta": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "resultado": 10,
            "fecha_respuesta": "2018-11-26 19:38:22"
        },
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 33,
            "profesional": "Pablo Espinoza Reyes",
            "id_paciente": 197,
            "paciente": "PEDRO MOLINA GUTIERREZ",
            "id_pregunta": 20,
            "pregunta": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "resultado": 6,
            "fecha_respuesta": "2018-11-27 14:00:24"
        },
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 33,
            "profesional": "Pablo Espinoza Reyes",
            "id_paciente": 198,
            "paciente": "Aida Carmona Espinoza",
            "id_pregunta": 20,
            "pregunta": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "resultado": 10,
            "fecha_respuesta": "2018-12-03 11:53:36"
        },
        {
            "id_sucursal": 1,
            "sucursal": "NORTE",
            "id_profesional": 40,
            "profesional": "Pamela Jara Diaz",
            "id_paciente": 155,
            "paciente": "Luis Quezada",
            "id_pregunta": 20,
            "pregunta": "¿Que tan probable es que recomiende nuestra clínica a un amigo o familiar?",
            "id_atributo": 11,
            "resultado": 4,
            "fecha_respuesta": "2019-01-28 18:41:28"
        }
    ]
}
```

## `POST` /especialidades

Permite crear una especialidad. Una especialidad solo necesita tener un nombre para ser creada.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/especialidades/",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre" : "Especialidad prueba"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 9,
        "nombre": "Especialidad prueba",
        "id_tipo_sucursal": 2,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/especialidades/9",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /especialidades/{id_especialidad}

Permite editar el nombre de una especialidad y habilitarla/deshabilitarla. Una vez creada una especialidad, no se puede cambiar su tipo de sucursal.

### Entrada

```javascript
var id_especialidad      = 9;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/especialidades/"+id_especialidad,
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"        : "Especialidad test",
        "habilitado"    : 0
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 9,
        "nombre": "Especialidad test",
        "habilitado": 0,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/especialidades/9",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /especialidades

Muestra el listado de todas las especialidades de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/especialidades",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 2,
            "nombre": "Ortodoncia",
            "id_tipo_sucursal": 1,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/especialidades/2",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "General",
            "id_tipo_sucursal": 2,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/especialidades/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /especialidades/{id_especialidad}

Muestra la información de una especialidad específica.

### Entrada

```javascript
var id_especialidad = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/especialidades/"+id_especialidad,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "nombre": "Ortodoncia",
        "id_tipo_sucursal": 1,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/especialidades/2",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /especialidades/{id_especialidad}/motivos

Muestra la información de los motivos de atención por especialidad

### Entrada

```javascript
var id_especialidad = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/especialidades/"+id_especialidad+"/motivos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_especialidad": 1,
            "nombre_motivos_atencion": "consulta curiosidad",
            "id_motivos_atencion_especialidad": 16
        },
        {
            "id_especialidad": 1,
            "nombre_motivos_atencion": "Control",
            "id_motivos_atencion_especialidad": 21
        },
        {
            "id_especialidad": 1,
            "nombre_motivos_atencion": "6",
            "id_motivos_atencion_especialidad": 25
        }
    ]
}
```

## `GET` /especialidades/{id_especialidad}/proxima

Retorna un listado con las 10 horas más próximas ordenadas temporalmente

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/especialidades/"+id_especialidad+"/proxima",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
  "data": [
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:30:00",
      "duracion": 5,
      "hora_inicio": "10:25",
      "id_profesional": 68,
      "nombre_profesional": "Nathaly Tirado",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:30:00",
      "duracion": 5,
      "hora_inicio": "10:25",
      "id_profesional": 56,
      "nombre_profesional": "Ignacio Silva",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:45:00",
      "duracion": 15,
      "hora_inicio": "10:30",
      "id_profesional": 43,
      "nombre_profesional": "Pablo Lobos",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:35:00",
      "duracion": 5,
      "hora_inicio": "10:30",
      "id_profesional": 56,
      "nombre_profesional": "Ignacio Silva",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "11:00:00",
      "duracion": 30,
      "hora_inicio": "10:30",
      "id_profesional": 59,
      "nombre_profesional": "wh test",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:45:00",
      "duracion": 15,
      "hora_inicio": "10:30",
      "id_profesional": 61,
      "nombre_profesional": "Testing Soporte",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:45:00",
      "duracion": 15,
      "hora_inicio": "10:30",
      "id_profesional": 45,
      "nombre_profesional": "Prueba Medilink Prueba",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:35:00",
      "duracion": 5,
      "hora_inicio": "10:30",
      "id_profesional": 68,
      "nombre_profesional": "Nathaly Tirado",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:45:00",
      "duracion": 15,
      "hora_inicio": "10:30",
      "id_profesional": 11,
      "nombre_profesional": "Karina Abarzúa Solari",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    },
    {
      "id_paciente": 0,
      "nombre_paciente": "",
      "hora_fin": "10:45:00",
      "duracion": 15,
      "hora_inicio": "10:30",
      "id_profesional": 69,
      "nombre_profesional": "Patricia  Catalán",
      "fecha": "04\/01\/2021",
      "id_recurso": 1
    }
  ]
}
```

## `GET` /especialidades/{id_especialidad}/rangoProxima

Muestra la información de una especialidad específica.

### Entrada

```javascript
var id_especialidad = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/especialidades/"+id_especialidad,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "nombre": "KINESIOLOGIA",
        "habilitada": 1,
        "links": [
            {
                "rel": "self",
                "href": "http://api.medilink2.healthatom.com/api/v5/especialidades/2",
                "method": "GET"
            }
        ]
    },
}
```

## `POST` /citas/estados

Permite crear un estado de cita.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/citas/estados/",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"    : "Confirmado",
        "color"     : "#ba7958",
        "anulacion" : 0  
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 28,
        "nombre": "Confirmado",
        "color": "#ba7958",
        "reservado": 0,
        "anulacion": 0,
        "uso_interno": 0,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/citas/estados/28",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /citas/estados/{id_estado}

Permite modificar un estado de cita.

### Entrada

```javascript
var id_estado       = 28;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/citas/estados/"+id_estado,
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "habilitado" : 0
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 28,
        "nombre": "Confirmado",
        "color": "#ba7958",
        "reservado": 0,
        "anulacion": 0,
        "uso_interno": 0,
        "habilitado": 0,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/citas/estados/28",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /citas/estados

Muestra el listado de todos los estados de cita.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/citas/estados",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 3,
            "nombre": "Confirmado por teléfono",
            "color": "#87bce4",
            "reservado": 1,
            "anulacion": 0,
            "uso_interno": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/citas/estados/3",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Atendido",
            "color": "#e8e8e8",
            "reservado": 1,
            "anulacion": 0,
            "uso_interno": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/citas/estados/2",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "Anulado",
            "color": "#f5b6a1",
            "reservado": 1,
            "anulacion": 1,
            "uso_interno": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/citas/estados/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /citas/estados/{id_estado}

Muestra la información de un estado de cita en particular

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_estado   = 7;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/citas/estados/"+id_estado,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 7,
        "nombre": "No confirmado",
        "color": "#87bce4",
        "reservado": 1,
        "anulacion": 0,
        "uso_interno": 0,
        "habilitado": 1
    }
}
```

## `GET` /evoluciones

Muestra el listado de todas las evoluciones de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/evoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 284,
            "id_tratamiento": 482,
            "nombre_tratamiento": "prueba",
            "id_paciente": 58,
            "nombre_paciente": "Felipe Molina",
            "id_profesional": 3,
            "nombre_profesional": "Fernanda Risopatrón",
            "id_usuario": 2,
            "nombre_usuario": "Soporte Engenis",
            "fecha": "2018-02-20 17:39:50",
            "datos": "Acción realizada: Restauraciones Resina (Clase I) Una Cara Pieza 13\n\nasdfghj",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.loc/api/v5/evoluciones/284",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 283,
            "id_tratamiento": 471,
            "nombre_tratamiento": "prueba",
            "id_paciente": 166,
            "nombre_paciente": "Luis Quezada",
            "id_profesional": 17,
            "nombre_profesional": "Carmen Juan Molina",
            "id_usuario": 1,
            "nombre_usuario": "Administrador",
            "fecha": "2018-02-12 10:49:30",
            "datos": "Acción realizada: Restauraciones Resina (Clase II) Tres Caras Pieza 6\n\nwerftgy",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.loc/api/v5/evoluciones/283",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /evoluciones/{id_evolucion}

Muestra la información de una evolucion específica.

### Entrada

```javascript
var id_evolucion    =   284;
var settings        =   {
                            "url": "https://api.medilink2.healthatom.com/api/v5/evoluciones/"+id_evolucion,
                            "method": "GET",
                            "headers": {
                                "Authorization": "Token "+token
                            }
                        }

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 284,
        "id_tratamiento": 482,
        "nombre_tratamiento": "prueba",
        "id_paciente": 58,
        "nombre_paciente": "Felipe Molina",
        "id_profesional": 3,
        "nombre_profesional": "Fernanda Risopatrón",
        "id_usuario": 2,
        "nombre_usuario": "Soporte Engenis",
        "fecha": "2018-02-20 17:39:50",
        "datos": "Acción realizada: Restauraciones Resina (Clase I) Una Cara Pieza 13\n\nasdfghj",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "http://api.loc/api/v5/evoluciones/284",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /horarios

Muestra todos los horarios de los profesionales de la clínica.

### Entrada

```javascript
var params      =   {
                        "id_profesional"      : {"eq": 1}
                    };
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/horarios/",
    "method": "GET",
    "data"      :   "q="+JSON.stringify(params),
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_profesional": 1,
            "id_sucursal": 2,
            "intervalo": 15,  
            "dias": [
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 7,
                    "nombre_dia": "Domingo",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 2,
                    "id_box": 1,
                    "dia": 6,
                    "nombre_dia": "Sábado",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 5,
                    "nombre_dia": "Viernes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 4,
                    "nombre_dia": "Jueves",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 3,
                    "nombre_dia": "Miércoles",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 3,
                    "id_box": 1,
                    "dia": 2,
                    "nombre_dia": "Martes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 2,
                    "id_box": 1,
                    "dia": 1,
                    "nombre_dia": "Lunes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "20:00:00",
                    "hora_inicio_break": "13:00:00",
                    "hora_fin_break": "14:00:00"
                }
            ]
        }
    ]
}
```

## `GET` /horariosespeciales

Muestra todos los horarios especiales de los profesional de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/horariosespeciales/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 34,
            "id_profesional": 33,
            "id_sucursal": 1,
            "id_box": 1,
            "fecha": "2018-05-16",
            "intervalo": 15,
            "hora_inicio": "08:00:00",
            "hora_fin": "13:00:00",
            "hora_inicio_break": "08:00:00",
            "hora_fin_break": "08:00:00",
            "sillones": 1
        },
        {
            "id": 33,
            "id_profesional": 17,
            "id_sucursal": 3,
            "id_box": 1,
            "fecha": "2018-03-29",
            "intervalo": 15,
            "hora_inicio": "09:00:00",
            "hora_fin": "14:00:00",
            "hora_inicio_break": "09:00:00",
            "hora_fin_break": "09:00:00",
            "sillones": 1
        }
    ]
}
```

## `GET` /horariosbloqueados

Muestra todos los bloqueos de horario de los profesional de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/horariosbloqueados/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 94,
            "id_profesional": 31,
            "id_sucursal": 1,
            "id_sillon": 1,
            "fecha": "2018-06-07",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:30:00",
        },
        {
            "id": 93,
            "id_profesional": 31,
            "id_sucursal": 1,
            "id_sillon": 2,
            "fecha": "2018-06-01",
            "hora_inicio": "10:45:00",
            "hora_fin": "11:00:00",
        }
    ]
}
```

## `POST` /horariosbloqueados

Crea uno o más bloqueos de horario para un profesional en una sucursal.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/horariosbloqueados",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "id_profesional"    : 31,
        "id_sucursal"       : 1,
        "id_sillon"         : 1,
        "fecha"             : "2018-06-07",
        "hora_inicio"       : "08:00:00",
        "hora_fin"          : "08:30:00"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 94,
            "id_profesional": 31,
            "id_sucursal": 1,
            "id_sillon": 1,
            "fecha": "2018-06-07",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:30:00"
        }
    ]
}
```

## `GET` /horariosdisponibles

Muestra todos los bloques de horario disponibles de profesionales de una sucursal de la clínica.

### Entrada

```javascript
var params      =   {
                        "ids_profesional[]": 8,
                        "ids_profesional[]": 13,
                        "ids_profesional[]": 24,
                        "id_sucursal": 62,
                        "fecha_inicio": "2022-03-17",
                        "fecha_fin": "2022-03-18"
                    };
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/horariosdisponibles/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token,
        "Content-Type": "application/json"
    },
    "data": (params)
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "8": {
            "2022-03-17": [
                {
                    "hora_inicio": "06:00:00",
                    "hora_fin": "06:30:00",
                    "intervalo": 30
                },
                {
                    "hora_inicio": "06:30:00",
                    "hora_fin": "07:00:00",
                    "intervalo": 30
                },
                {
                    "hora_inicio": "17:30:00",
                    "hora_fin": "18:00:00",
                    "intervalo": 30
                }
            ],
            "2022-03-18": []
        }
    }
}
```

## `GET` /laboratorios

Muestra el listado de todos los laboratorios de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/laboratorios",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "Laboratorio de Prueba",
            "detalle": " ",
            "telefono": "876543987",
            "direccion": "Orinoco 90",
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/laboratorios/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Laboratorio Medilink",
            "detalle": " ",
            "telefono": "987654",
            "direccion": "Los Militares 4777",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/laboratorios/2",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 3,
            "nombre": "Laboratorio Medilink",
            "detalle": " ",
            "telefono": "",
            "direccion": "",
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/laboratorios/3",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /laboratorios/{id_laboratorio}

Muestra la información de un laboratorio en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_laboratorio  = 2;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/laboratorios/"+id_laboratorio,
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "nombre": "Laboratorio Medilink",
        "detalle": " ",
        "telefono": "987654",
        "direccion": "Los Militares 4777",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/laboratorios/2",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /laboratorios/{id_laboratorio}/prestaciones

Muestra el listado de todas las prestaciones asociadas a un laboratorio en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_laboratorio  = 2;
var settings        = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/laboratorios/" + id_laboratorio + "/prestaciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 5452,
            "nombre": "Corona Soporte (LAB)",
            "id_arancel": 0,
            "arancel": "Arancel base",
            "id_categoria": 17,
            "categoria": "Laboratorios",
            "id_tipo": 2,
            "tipo": "Laboratorio",
            "precio": 0,
            "precio_laboratorio": 0,
            "costo": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/prestaciones/5452",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 5257,
            "nombre": "placa de contención (LAB)",
            "id_arancel": 0,
            "arancel": "Arancel base",
            "id_categoria": 17,
            "categoria": "Laboratorios",
            "id_tipo": 2,
            "tipo": "Laboratorio",
            "precio": 0,
            "precio_laboratorio": 0,
            "costo": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/prestaciones/5257",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /liquidaciones

Muestra la información de las liquidaciones (honorarios) de todos los profesionales de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/liquidaciones",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 196,
            "id_profesional": 2,
            "id_sucursal": 1,
            "fecha_inicio": "2018-04-18 21:00:00",
            "fecha_termino": "",
            "monto": 0,
            "activa": 1
        },
        {
            "id": 193,
            "id_profesional": 3,
            "id_sucursal": 1,
            "fecha_inicio": "2018-03-26 21:00:00",
            "fecha_termino": "2018-04-18 21:00:00",
            "monto": 54300,
            "activa": 0
        }
    ]
}
```

## `GET` /liquidaciones/{id_liquidacion}

Muestra la información de una liquidacion (honorario) en específico.

### Entrada

```javascript
var id_liquidacion  = 196;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/liquidaciones/"+id_liquidacion,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 196,
        "id_profesional": 2,
        "id_sucursal": 1,
        "fecha_inicio": "2018-04-18 21:00:00",
        "fecha_termino": "",
        "monto": 0,
        "activa": 1
    }
}
```

## `GET` /liquidaciones/{id_liquidacion}/detalles

Muestra los detalles de una liquidacion (honorario) en específico.

### Entrada

```javascript
var id_liquidacion  = 271;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/liquidaciones/"+id_liquidacion+"/detalles",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 524,
            "id_liquidacion": 271,
            "id_prestacion": 4847,
            "nombre_prestacion": "Restauraciones Resina (Clase II) Dos Cara",
            "id_tratamiento": 665,
            "nombre_tratamiento": "RESINAS",
            "id_paciente": 155,
            "nombre_paciente": "Soporte Prueba",
            "fecha": "2018-10-25",
            "pieza": "21:v,d,p,m,o",
            "monto": 725,
            "medio_pago": "Efectivo",
            "total": 723.66,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/liquidaciones/271/detalles/524",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 523,
            "id_liquidacion": 271,
            "id_prestacion": 4847,
            "nombre_prestacion": "Restauraciones Resina (Clase II) Dos Cara",
            "id_tratamiento": 665,
            "nombre_tratamiento": "RESINAS",
            "id_paciente": 155,
            "nombre_paciente": "Soporte Prueba",
            "fecha": "2018-10-25",
            "pieza": "22:v,d,p,m,o",
            "monto": 19575,
            "medio_pago": "Efectivo",
            "total": 18596.25,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/liquidaciones/271/detalles/523",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /liquidaciones/{id_liquidacion}/detalles/{id_detalle}

Muestra un detalle de liquidacion.

### Entrada

```javascript
var id_liquidacion  = 271;
var id_detalle      = 524;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/liquidaciones/"+id_liquidacion+"/detalles/"+id_detalle,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 524,
        "id_liquidacion": 271,
        "id_prestacion": 4847,
        "nombre_prestacion": "Restauraciones Resina (Clase II) Dos Cara",
        "id_tratamiento": 665,
        "nombre_tratamiento": "RESINAS",
        "id_paciente": 155,
        "nombre_paciente": "Soporte Prueba",
        "fecha": "2018-10-25",
        "pieza": "21:v,d,p,m,o",
        "monto": 725,
        "medio_pago": "Efectivo",
        "total": 723.66,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/liquidaciones/271/detalles/524",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /liquidacionesDetalles/resumenPorMes

Muestra un listado con resumen de los últimos doce meses de las liquidaciones (honorarios) de un profesional

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/liquidacionesDetalles/resumenPorMes",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "fecha": "2021-01",
            "monto": 2191200
        },
        {
            "fecha": "2021-02",
            "monto": 2707900
        },
        {
            "fecha": "2021-03",
            "monto": 1882800
        },
        {
            "fecha": "2021-04",
            "monto": 1864200
        },
        {
            "fecha": "2021-05",
            "monto": 2670700
        },
        {
            "fecha": "2021-06",
            "monto": 1239800
        },
        {
            "fecha": "2021-07",
            "monto": 3117500
        },
        {
            "fecha": "2021-08",
            "monto": 2207500
        },
        {
            "fecha": "2021-09",
            "monto": 2101600
        },
        {
            "fecha": "2021-10",
            "monto": 2803860
        }
    ]
}
```

## `GET` /liquidacionesDetalles

Muestra el detalles o las prestaciones de las liquidaciones de un profesional.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/liquidacionesDetalles",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 695599,
            "id_liquidacion": 37968,
            "id_sucursal": 6,
            "nombre_sucursal": "Nuñoa",
            "id_profesional": 4,
            "nombre_profesional": "Maria Perez",
            "id_paciente": 174823,
            "nombre_paciente": "Julia Vargas",
            "id_tratamiento": 792455,
            "nombre_tratamiento": "regeneración ósea guiada pieza9",
            "id_prestacion": 25832,
            "nombre_prestacion": "Control mensual",
            "medio_pago": "Tarjeta de débito",
            "fecha": "2021-11-29",
            "monto": 0,
            "total": 0,
            "estado_liquidacion": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/liquidaciones/37968/detalles/695599",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 695598,
            "id_liquidacion": 37968,
            "id_sucursal": 6,
            "nombre_sucursal": "Nuñoa",
            "id_profesional": 4,
            "nombre_profesional": "Maria Perez",
            "id_paciente": 174823,
            "nombre_paciente": "Julia Vargas",
            "id_tratamiento": 792455,
            "nombre_tratamiento": "regeneración ósea guiada pieza9",
            "id_prestacion": 26394,
            "nombre_prestacion": "26281 - MEMBRANA 3BIOMEC 15 X 22 (Origen Intestino de Porcino)",
            "medio_pago": "Tarjeta de débito",
            "fecha": "2021-11-29",
            "monto": 0,
            "total": 0,
            "estado_liquidacion": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/liquidaciones/37968/detalles/695598",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /liquidacionesDetalles/{id_liquidacion}/desglose

Muestra el detalles o las prestaciones de las liquidaciones de un profesional.

### Entrada

```javascript
var id_liquidacion  = 695598;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/liquidacionesDetalles/"+id_liquidacion+"/desglose",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 695598,
            "id_liquidacion": 37968,
            "id_detalle_presupuesto": 2470939,
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "id_categoria": 350,
            "nombre_categoria": "GMI",
            "id_prestacion": 26394,
            "nombre_prestacion": "26281 - MEMBRANA 3BIOMEC 15 X 22 (Origen Intestino de Porcino)",
            "costo_laboratorio": 0,
            "monto_sin_descuentos": 0,
            "descuento_honorarios": 0,
            "descuento_caja_honorarios": 0,
            "total_a_pagar": 0,
            "pagado_prestacion": 0,
            "fecha": "2021-11-29",
            "tipo_liquidacion": 2,
            "porcentaje_total": 0,
            "porcentaje_clinica": 0.01,
            "estado_contrato": 1,
            "pagar_valor_original": 0
        }
    ]
}
```

## `GET` /medios

Muestra la información de todos los medios de pago de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/medios/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 0,
            "nombre": "Efectivo",
            "descuento": 0,
            "modificable": 0,
            "multiples_pagos": 0,
            "permite_devolucion": 1,
            "interno": 0,
            "facturable": 1,
            "habilitado": 1
        },
        {
            "id": 1,
            "nombre": "Cheque",
            "descuento": 0,
            "modificable": 0,
            "multiples_pagos": 0,
            "permite_devolucion": 1,
            "interno": 0,
            "facturable": 1,
            "habilitado": 1
        },
        {
            "id": 2,
            "nombre": "Tarjeta de débito",
            "descuento": 0,
            "modificable": 0,
            "multiples_pagos": 0,
            "permite_devolucion": 0,
            "interno": 0,
            "facturable": 1,
            "habilitado": 1
        },
        {
            "id": 3,
            "nombre": "Tarjeta de crédito",
            "descuento": 0,
            "modificable": 0,
            "multiples_pagos": 0,
            "permite_devolucion": 0,
            "interno": 0,
            "facturable": 1,
            "habilitado": 1
        }
    ]
}
```

## `GET` /medios/{id_medio}

Muestra la información de un medio de pago especifico.

### Entrada

```javascript
var id_medio    = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/medios/"+id_medio,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 1,
        "nombre": "Cheque",
        "descuento": 0,
        "modificable": 0,
        "multiples_pagos": 0,
        "permite_devolucion": 1,
        "interno": 0,
        "facturable": 1,
        "habilitado": 1
    }
}
```

## `GET` /motivosAtencionEspecialidad

Muestra el listado de los motivos de atención por especialidad

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/motivosAtencionEspecialidad",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 24,
            "id_especialidad": 7,
            "nombre_especialidad": "Odontopediatria",
            "id_motivo_atencion": 10,
            "nombre_motivo_atencion": "Tratamiento Operatoria",
            "duracion": 15,
            "color": "#FF1493",
            "agenda_online": 0,
            "id_cups": 0,
            "habilitado": 1
        },
        {
            "id": 13,
            "id_especialidad": 5,
            "nombre_especialidad": "Periodoncia",
            "id_motivo_atencion": 12,
            "nombre_motivo_atencion": "Control periodontal",
            "duracion": 15,
            "color": "#7CFC00",
            "agenda_online": 0,
            "id_cups": 0,
            "habilitado": 1
        },
        {
            "id": 16,
            "id_especialidad": 3,
            "nombre_especialidad": "Rehabilitación oral",
            "id_motivo_atencion": 13,
            "nombre_motivo_atencion": "Seguimiento",
            "duracion": 5,
            "color": "#DC143C",
            "agenda_online": 0,
            "id_cups": 0,
            "habilitado": 1
        },
    ]
}
```

## `GET` /pacientes

Muestra el listado de todos los pacientes de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/pacientes",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "rut": "1-9",
            "tipo_documento":0,
            "nombre": "Juan",
            "nombre_social": "Camila",
            "apellidos": "Pérez",
            "fecha_nacimiento": "1985-01-01",
            "fecha_afiliacion" : "2018-02-02",
            "telefono": "212345678",
            "celular": "12345678",
            "ciudad": "Santiago",
            "comuna": "Vitacura",
            "direccion": "",
            "email": "guillermo@test.com",
            "sexo": "M",
            "id_genero": 1,
            "numero_ficha": "234567",
            "observaciones":"",
            "tiene_cargas": 1,
            "es_carga": 0,
            "fecha_deshabilitacion": "",
            "id_usuario_deshabilitacion": "",
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/apoderados",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/archivos",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/cargas",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/citas",
                    "method": "GET"
                },
                {
                    "rel": "convenios",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/convenios",
                    "method": "GET"
                },
                {
                    "rel": "devoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/devoluciones",
                    "method": "GET"
                },
                {
                    "rel": "evoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/evoluciones",
                    "method": "GET"
                },
                {
                    "rel": "pagos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/pagos",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/tratamientos",
                    "method": "GET"
                },
                {
                    "rel": "adicionales",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/adicionales",
                    "method": "GET"
                },
                {
                    "rel": "recetas",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/recetas",
                    "method": "GET"
                },
                {
                    "rel": "notificacionesGes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/notificacionesGes",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "rut": "2-7",
            "tipo_documento":0,
            "nombre": "Daniel",
            "nombre_social": "",
            "apellidos": "Rojas",
            "fecha_nacimiento": "0000-00-00",
            "fecha_afiliacion" : "2018-02-02",
            "telefono": "123456789",
            "celular": "4387483",
            "ciudad": "Santiago",
            "comuna": "Santiago",
            "direccion": "",
            "email": "daniel@test.com",
            "sexo": "M",
            "id_genero": 1,
            "numero_ficha": "7654",
            "observaciones":"",
            "tiene_cargas": 0,
            "es_carga": 1,
            "fecha_deshabilitacion": "",
            "id_usuario_deshabilitacion": "",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/apoderados",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/archivos",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/cargas",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/citas",
                    "method": "GET"
                },
                {
                    "rel": "convenios",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/convenios",
                    "method": "GET"
                },
                {
                    "rel": "devoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/devoluciones",
                    "method": "GET"
                },
                {
                    "rel": "evoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/evoluciones",
                    "method": "GET"
                },
                {
                    "rel": "pagos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/pagos",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/tratamientos",
                    "method": "GET"
                },
                {
                    "rel": "adicionales",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/adicionales",
                    "method": "GET"
                },
                {
                    "rel": "recetas",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/recetas",
                    "method": "GET"
                },
                {
                    "rel": "notificacionesGes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/notificacionesGes",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}

Muestra la información de un paciente en específico.

### Entrada

```javascript
var id_paciente = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "rut": "2-7",
        "tipo_documento":0,
        "nombre": "Daniel",
        "nombre_social": "Camila",
        "apellidos": "Rojas",
        "fecha_nacimiento": "1987-01-01",
        "fecha_afiliacion" : "2018-02-02",
        "telefono": "123456789",
        "celular": "4387483",
        "ciudad": "Santiago",
        "comuna": "Santiago",
        "direccion": "",
        "email": "daniel@test.com",
        "sexo": "M",
        "id_genero": 1,
        "numero_ficha": "7654",
        "observaciones":"",
        "tiene_cargas": 0,
        "es_carga": 1,
        "fecha_deshabilitacion": "",
        "id_usuario_deshabilitacion": "",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/apoderados",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/archivos",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/cargas",
                "method": "GET"
            },
            {
                "rel": "citas",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/citas",
                "method": "GET"
            },
            {
                "rel": "convenios",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/convenios",
                "method": "GET"
            },
            {
                "rel": "devoluciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/devoluciones",
                "method": "GET"
            },
            {
                "rel": "evoluciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/evoluciones",
                "method": "GET"
            },
            {
                "rel": "pagos",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/pagos",
                "method": "GET"
            },
            {
                "rel": "tratamientos",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/tratamientos",
                "method": "GET"
            },
            {
                "rel": "adicionales",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/adicionales",
                "method": "GET"
            },
            {
                "rel": "recetas",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/recetas",
                "method": "GET"
            },
            {
                "rel": "notificacionesGes",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/notificacionesGes",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /pacientes/{id_paciente}

Permite modificar uno o más datos personales de un paciente.

### Entrada

```javascript
var id_paciente     = 2;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente,
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre" : "Juan Andrés"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "rut": "2-7",
        "tipo_documento":0,
        "nombre": "Juan Andrés",
        "nombre_social": "",
        "apellidos": "Rojas",
        "fecha_nacimiento": "1987-01-01",
        "fecha_afiliacion" : "2018-02-02",
        "telefono": "123456789",
        "celular": "4387483",
        "ciudad": "Santiago",
        "comuna": "Santiago",
        "direccion": "",
        "email": "daniel@test.com",
        "sexo": "M",
        "id_genero": 1,
        "numero_ficha": "7654",
        "observaciones":"",
        "tiene_cargas": 0,
        "es_carga": 1,
        "fecha_deshabilitacion": "",
        "id_usuario_deshabilitacion": "",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/apoderados",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/archivos",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/cargas",
                "method": "GET"
            },
            {
                "rel": "citas",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/citas",
                "method": "GET"
            },
            {
                "rel": "convenios",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/convenios",
                "method": "GET"
            },
            {
                "rel": "devoluciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/devoluciones",
                "method": "GET"
            },
            {
                "rel": "evoluciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/evoluciones",
                "method": "GET"
            },
            {
                "rel": "pagos",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/pagos",
                "method": "GET"
            },
            {
                "rel": "tratamientos",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/tratamientos",
                "method": "GET"
            },
            {
                "rel": "adicionales",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/adicionales",
                "method": "GET"
            },
            {
                "rel": "recetas",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/recetas",
                "method": "GET"
            },
            {
                "rel": "notificacionesGes",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/2/notificacionesGes",
                "method": "GET"
            }
        ]
    }
}
```

## `POST` /pacientes

Permite crear un paciente. Los datos minimos para poder crear un paciente son nombre y apellidos.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"            : "Alberto",
        "apellidos"         : "Jara",
        "sexo"              : "M",
        "fecha_nacimiento"  : "1963-02-12",
        "rut"               : "1-9"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 3243,
        "rut": "1-9",
        "tipo_documento":0,
        "nombre": "Alberto",
        "nombre_social": "",
        "apellidos": "Jara",
        "fecha_nacimiento": "1963-02-12",
        "fecha_afiliacion" : "2018-02-02",
        "telefono": "",
        "celular": "",
        "ciudad": "",
        "comuna": "",
        "direccion": "",
        "email": "",
        "sexo": "M",
        "id_genero": 1,
        "numero_ficha": "",
        "observaciones":"",
        "tiene_cargas": 0,
        "es_carga": 1,
        "fecha_deshabilitacion": "",
        "id_usuario_deshabilitacion": "",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/apoderados",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/archivos",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/cargas",
                "method": "GET"
            },
            {
                "rel": "citas",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/citas",
                "method": "GET"
            },
            {
                "rel": "convenios",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/convenios",
                "method": "GET"
            },
            {
                "rel": "devoluciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/devoluciones",
                "method": "GET"
            },
            {
                "rel": "evoluciones",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/evoluciones",
                "method": "GET"
            },
            {
                "rel": "pagos",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/pagos",
                "method": "GET"
            },
            {
                "rel": "tratamientos",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/tratamientos",
                "method": "GET"
            },
            {
                "rel": "adicionales",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/adicionales",
                "method": "GET"
            },
            {
                "rel": "recetas",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/recetas",
                "method": "GET"
            },
            {
                "rel": "notificacionesGes",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/3243/notificacionesGes",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /pacientes/{id_paciente}/apoderados

Muestra al (los) apoderado(s) de un paciente en específico.

### Entrada

```javascript
var id_paciente = 12;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/apoderados",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 15,
            "rut": "1234-5",
            "tipo_documento":0,
            "nombre": "Juan",
            "nombre_social": "Paula",
            "apellidos": "Garcia",
            "fecha_nacimiento": "1963-04-10",
            "fecha_afiliacion": "2017-10-18",
            "telefono": "765432",
            "celular": "12345678",
            "ciudad": "Santiago",
            "comuna": "Las Condes",
            "direccion": "Badajoz 45",
            "email": "ejemplo@gemail.com",
            "sexo": "M",
            "numero_ficha": "",
            "observaciones":"",
            "tiene_cargas": 1,
            "es_carga": 0,
            "fecha_deshabilitacion": "",
            "id_usuario_deshabilitacion": "",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/apoderados",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/archivos",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/cargas",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/citas",
                    "method": "GET"
                },
                {
                    "rel": "convenios",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/convenios",
                    "method": "GET"
                },
                {
                    "rel": "devoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/devoluciones",
                    "method": "GET"
                },
                {
                    "rel": "evoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/evoluciones",
                    "method": "GET"
                },
                {
                    "rel": "pagos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/pagos",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/1/tratamientos",
                    "method": "GET"
                },
                {
                    "rel": "adicionales",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/adicionales",
                    "method": "GET"
                },
                {
                    "rel": "recetas",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/recetas",
                    "method": "GET"
                },
                {
                    "rel": "notificacionesGes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/15/notificacionesGes",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/archivos

Muestra las imagenes, documentos y archivos subidos a la plataforma, asociados a un paciente en específico.

### Entrada

```javascript
var id_paciente = 12;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/archivos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "1.jpg",
            "titulo": "Radiografia 1",
            "observaciones": "",
            "fecha_creacion": "2012-05-18 12:02:38",
            "id_paciente": 12,
            "id_tratamiento": 0,
            "urls": {
                "original": "https://medilink2.s3.amazonaws.com/clinicatest12345/1.jpg?X-Amz-Content-Sha256=...",
                "med": "https://medilink2.s3.amazonaws.com/clinicatest12345/med/1.jpg?X-Amz-Content-Sha256=...",
                "tmb": "https://medilink2.s3.amazonaws.com/clinicatest12345/tmb/1.jpg?X-Amz-Content-Sha256=..."
            },
            "estado": 1,
            "fecha_deshabilitacion": ""
        },
        {
            "id": 2,
            "nombre": "p1.pdf",
            "titulo": "Tratamiento",
            "observaciones": "",
            "fecha_creacion": "2012-05-18 12:01:48",
            "id_paciente": 12,
            "id_tratamiento": 0,
            "urls": {},
            "estado": 0,
            "fecha_deshabilitacion": "2018-01-01 09:00:00"
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/atenciones

Muestra la información de todas las atenciones del paciente.

### Entrada

```javascript
var id_paciente = 45705;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/pacientes/"+id_paciente+"/atenciones",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 25144,
            "nombre": "Diagnóstico",
            "tipo_atencion": "Plan de tratamiento",
            "id_convenio": 0,
            "nombre_convenio": "",
            "fecha": "2018-05-17",
            "finalizado": 0,
            "bloqueado": 0,
            "id_paciente": 45705,
            "nombre_paciente": "Juan Ramirez",
            "id_profesional": 30,
            "nombre_profesional": "Alberto Gonzalez",
            "id_sucursal": 1,
            "nombre_sucursal": "Centro de Diagnóstico",
            "total": 186420,
            "abonado": 43020,
            "abono_libre": 0,
            "asignado_realizado": 0,
            "asignado_sin_realizar": 43020,
            "total_realizado": 0,
            "deuda": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/atenciones/25144",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/atenciones/25144/detalles",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/atenciones/25144/citas",
                    "method": "GET"
                },
                {
                    "rel": "evoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v5/atenciones/25144/evoluciones",
                    "method": "GET"
                },
                {
                    "rel": "fichas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/atenciones/25144/fichas",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/cargas

Muestra la(s) cargas(s) asociadas a un paciente en específico.

### Entrada

```javascript
var id_paciente = 8;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/cargas",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 20,
            "rut": "11111111-1",
            "tipo_documento":0,
            "nombre": "María",
            "nombre_social": "",
            "apellidos": "González",
            "fecha_nacimiento": "1900-01-01",
            "fecha_afiliacion": "2015-10-29",
            "telefono": "23423423",
            "celular": "234234234",
            "ciudad": "Santiago",
            "comuna": "",
            "direccion": "",
            "email": "paciente@ejemplo.com",
            "sexo": "F",
            "numero_ficha": "",
            "observaciones":"",
            "tiene_cargas": 0,
            "es_carga": 1,
            "fecha_deshabilitacion": "",
            "id_usuario_deshabilitacion": "",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/apoderados",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/archivos",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/cargas",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/citas",
                    "method": "GET"
                },
                {
                    "rel": "convenios",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/convenios",
                    "method": "GET"
                },
                {
                    "rel": "devoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/devoluciones",
                    "method": "GET"
                },
                {
                    "rel": "evoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/evoluciones",
                    "method": "GET"
                },
                {
                    "rel": "pagos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/pagos",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/tratamientos",
                    "method": "GET"
                },
                {
                    "rel": "adicionales",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/20/adicionales",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `POST` /pacientes/{id_apoderado}/cargas

Permite asociar cargas a un paciente (apoderado).

### Entrada

```javascript
var id_apoderado    = 89;
var id_carga        = 2;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_apoderado+"/cargas",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "id_carga" : id_carga
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id_apoderado" : 89,
        "id_carga" : 2
    }
}
```

## `DELETE` /pacientes/{id_apoderado}/cargas/{id_carga}

Permite desasociar cargas de un paciente (apoderado).

### Entrada

```javascript
var id_apoderado    = 89;
var id_carga        = 2;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_apoderado+"/cargas/"+id_apoderado,
    "method": "DELETE",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

_Sin ejemplo de respuesta JSON en la doc._

## `GET` /pacientes/{id_paciente}/citas

Muestra la información de las citas que tiene o ha tenido un paciente en específico.

### Entrada

```javascript
var id_paciente = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/pacientes/"+id_paciente+"/citas",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 4,
            "id_paciente": 1,
            "nombre_paciente": "Juan Lopez",
            "id_estado": 1,
            "estado_cita": "Anulado",
            "id_atencion": 6,
            "fecha": "2016-06-24",
            "hora_inicio": "09:15:00",
            "hora_fin": "09:30:00",
            "duracion": 15,
            "id_profesional": 3,
            "nombre_profesional": "Ana García",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-25 13:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/4",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 5,
            "id_paciente": 1,
            "nombre_paciente": "Juan Lopez",
            "id_estado": 7,
            "estado_cita": "No confirmado",
            "id_atencion": 6,
            "fecha": "2016-06-23",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:15:00",
            "duracion": 15,
            "id_profesional": 3,
            "nombre_profesional": "Ana García",
            "id_sucursal": 2,
            "nombre_sucursal": "SUR",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-25 13:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/5",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/convenios

Muestra la información de los convenios que tiene o ha tenido un paciente en específico.

### Entrada

```javascript
var id_paciente = 89;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/convenios",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 7,
            "nombre": "Familia",
            "id_empresa": 99,
            "nombre_empresa": "Centro Medilink",
            "contacto_empresa": "Ana Lopez",
            "rut_empresa": "2-7",
            "telefono_empresa_1": "2342346566",
            "telefono_empresa_2": "1267567563",
            "direccion_empresa": "Apoquindo 6410",
            "comuna_empresa": "Las Condes",
            "ciudad_empresa": "Santiago",
            "email_empresa": "centro@ejemplo.com",
            "fecha_afiliacion": "2017-06-09",
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "observacion": "",
            "descuento": 20,
            "ajuste": 100,
            "descuentos_por_planilla": 0,
            "descuentos_laboratorios": 0,
            "descuentos_otros": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7",
                    "method": "GET"
                },
                {
                    "rel": "detalles",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7/categorias",
                    "method": "GET"
                },
                {
                    "rel": "sucursales",
                    "href": "https://api.medilink2.healthatom.com/api/v1/convenios/7/sucursales",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `POST` /pacientes/{id_paciente}/convenios

Permite asociar un convenio a un paciente. Al asociar un convenio nuevo, se eliminan las asociaciones de convenios activas del paciente, dejando solo el nuevo convenio.

### Entrada

```javascript
var id_paciente = 89;
var id_convenio = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/convenios",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "id_convenio" : id_convenio
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id_paciente" : 89,
        "id_convenio" : 2
    }
}
```

## `DELETE` /pacientes/{id_paciente}/convenios/{id_convenio}

Permite desasociar un convenio de un paciente.

### Entrada

```javascript
var id_paciente = 89;
var id_convenio = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/convenios/"+id_convenio,
    "method": "DELETE",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

_Sin ejemplo de respuesta JSON en la doc._

## `GET` /pacientes/{id_paciente}/devoluciones

Muestra el listado de todas las devoluciones de un paciente en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_paciente  = 9;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/devoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 784,
            "id_pago_asociado": 781,
            "id_cliente":9,
            "nombre_cliente": "Eduardo Aguila",
            "id_paciente": 9,
            "nombre_paciente": "Eduardo Aguila",
            "nombre_social_paciente": "Eduarda Aguila",
            "monto_pago": 90000,
            "medio_pago": "Cheque",
            "nombre_banco": "",
            "fecha_creacion": "2017-10-23 18:05:12",
            "id_caja": 40,
            "id_sucursal": 2,
            "nombre_sucursal": "SUR"
        },
        {
            "id": 783,
            "id_pago_asociado": 782,
            "id_cliente":9,
            "nombre_cliente": "Eduardo Aguila",
            "id_paciente": 9,
            "nombre_paciente": "Eduardo Aguila",
            "nombre_social_paciente": "Eduarda Aguila",
            "monto_pago": 90000,
            "medio_pago": "Efectivo",
            "nombre_banco": "",
            "fecha_creacion": "2017-10-23 21:34:12",
            "id_caja": 40,
            "id_sucursal": 2,
            "nombre_sucursal": "SUR"
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/evoluciones

Muestra el listado de evoluciones por paciente.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_paciente = 58;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/pacientes/"+id_paciente+"/evoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 284,
            "id_atencion": 482,
            "nombre_tratamiento": "prueba",
            "id_paciente": 58,
            "nombre_paciente": "Felipe Molina",
            "id_profesional": 3,
            "nombre_profesional": "Ana García",
            "id_usuario": 2,
            "nombre_usuario": "Soporte Engenis",
            "fecha": "2018-02-20 17:39:50",
            "datos": "Acción realizada: Restauraciones Resina (Clase I) Una Cara Pieza 13\n\nasdfghj",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.loc/api/v5/evoluciones/284",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/pagos

Muestra la información de los pagos que ha realizado un paciente en específico.

### Entrada

```javascript
var id_paciente = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/pagos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "id_cliente":2,
            "nombre_cliente": "Daniel Meruane",
            "id_paciente": 2,
            "nombre_paciente": "Daniel Meruane",
            "nombre_social_paciente": "Daniela Meruane",
            "monto_pago": 75000,
            "medio_pago": "Efectivo",
            "nombre_banco": "Banco Itaú",
            "fecha_recepcion": "2016-09-29",
            "fecha_vencimiento": "2016-11-21",
            "fecha_creacion": "2016-09-29 11:00:54",
            "id_caja": 32,
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "folio_boleta": 13566,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 5,
            "id_cliente": 103,
            "nombre_cliente": "María López Fernández",
            "id_paciente": 2,
            "nombre_paciente": "Daniel Meruane Valenzuela",
            "nombre_social_paciente": "Daniela Meruane",
            "monto_pago": 150000,
            "medio_pago": "Cheque",
            "nombre_banco": "Banco Santander",
            "fecha_recepcion": "2016-10-26",
            "fecha_vencimiento": "2016-11-10",
            "fecha_creacion": "2016-10-26 14:23:12",
            "id_caja": 32,
            "id_sucursal": 2,
            "nombre_sucursal": "SUR",
            "folio_boleta": 23423,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/5",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/adicionales

Muestra toda la información de campos adicionales que tenga el paciente configurado.

### Entrada

```javascript
var id_paciente     = 1;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/adicionales",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "nombre": "Agente",
            "codigo": "agente",
            "tipo": "Texto",
            "tipo_interno": "text",
            "valor": "texto ejemplo",
            "fecha_asociado": "2019-09-09 16:57:06",
            "id_usuario_asociador": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/1",
                    "method": "GET"
                }
            ]
        },
        {
            "nombre": "Diagnosticador",
            "codigo": "diagnosticador",
            "tipo": "Selección",
            "tipo_interno": "selection",
            "valor": {
                "id": 1,
                "name": "Raquel Weissman"
            },
            "fecha_asociado": "2019-09-09 16:57:26",
            "id_usuario_asociador": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `PUT` /pacientes/{id_paciente}/adicionales

Permite crear/actualizar campos adicionales de un paciente.

### Entrada

```javascript
var id_paciente     = 1;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/adicionales",
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data": {
        "codigo_campo_adicional_1": valor_campo_adicional_1,
        "codigo_campo_adicional_2": valor_campo_adicional_2,
        "codigo_campo_adicional_3": valor_campo_adicional_3
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "nombre": "Agente",
            "codigo": "agente",
            "tipo": "Texto",
            "tipo_interno": "text",
            "valor": "texto ejemplo",
            "fecha_asociado": "2019-09-09 16:57:06",
            "id_usuario_asociador": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/1",
                    "method": "GET"
                }
            ]
        },
        {
            "nombre": "Diagnosticador",
            "codigo": "diagnosticador",
            "tipo": "Selección",
            "tipo_interno": "selection",
            "valor": {
                "id": 1,
                "name": "Raquel Weissman"
            },
            "fecha_asociado": "2019-09-09 16:57:26",
            "id_usuario_asociador": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/camposAdicionales/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/recetas

Muestra todas las recetas de un paciente

### Entrada

```javascript
var id_paciente     = 255;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/recetas",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
       {
            "id": 72,
            "detalles": "receta prueba 2",
            "habilitado": true,
            "id_tratamiento": 948,
            "tratamiento": "Nuevo plan de tratamiento",
            "id_paciente": 255,
            "paciente": "Manuel Rivera",
            "nombre_social_paciente": "",
            "id_creador": 2,
            "creador": "Soporte Engenis",
            "fecha_creacion": "2020-10-08 15:24:10",
            "id_eliminador": 0,
            "eliminador": "",
            "fecha_eliminacion": "",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/recetas/72",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/tratamientos/948",
                    "method": "GET"
                },
                {
                    "rel": "pacientes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/255",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 71,
            "detalles": "receta prueba 1",
            "habilitado": false,
            "id_tratamiento": 948,
            "tratamiento": "Nuevo plan de tratamiento",
            "id_paciente": 255,
            "paciente": "Manuel Rivera",
            "nombre_social_paciente": "",
            "id_creador": 2,
            "creador": "Soporte Engenis",
            "fecha_creacion": "2020-10-08 15:23:50",
            "id_eliminador": 2,
            "eliminador": "Soporte Engenis",
            "fecha_eliminacion": "2020-10-08 09:24:10",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/recetas/71",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/tratamientos/948",
                    "method": "GET"
                },
                {
                    "rel": "pacientes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/255",
                    "method": "GET"
                }
            ]
        },
    ]
}
```

## `GET` /pacientes/{id_paciente}/notificacionesGes

Muestra las notificaciones GES de un paciente

### Entrada

```javascript
var id_paciente     = 9837508;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pacientes/"+id_paciente+"/notificacionesGes",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 4,
            "id_caso_ges": 1,
            "caso_ges": "Caso ges 1",
            "id_tratamiento": 1235675,
            "id_paciente": 9837508,
            "paciente": "Paciente 1",
            "nombre_social_paciente": "",
            "id_notificador": 12575,
            "notificador": "Usuario Notificador",
            "fecha_creacion": "2019-12-31 13:13:38",
            "anulado": 0,
            "id_anulador": 0,
            "anulador": "",
            "fecha_anulacion": "",
            "motivo_anulacion": "",
            "id_presupuesto_ges_eliminado": 0,
            "formulario": {
                "fecha": "31/12/2019",
                "hora": "10:12",
                "nombre_prestador": "Prestador 1",
                "direccion_prestador": "Calle 1234",
                "ciudad_prestador": "Santiago",
                "nombre_notificador": "Usuario Notificador",
                "rut_notificador": "12345678-9",
                "nombre_paciente": "Paciente 1",
                "rut_paciente": "12345678-9",
                "telefono_paciente": "987654321",
                "celular_paciente": "987654321",
                "mail_paciente": "mail@correo.com",
                "aseguradora": "Isapre",
                "direccion_paciente": "Calle 1234",
                "comuna_paciente": "Santiago",
                "status": "confirmacion_diagnostica",
                "diagnostico": "diagnostico",
                "id_presupuesto": "1235675",
                "caso_ges": 1
            },
            "link": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/notificacionesGes/4",
                    "method": "GET"
                },
                {
                    "rel": "pacientes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/9837508",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/tratamientos/1235675",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pacientes/{id_paciente}/antecedentesmedicos

Retorna la información actualizada de los antecedentes médicos del paciente junto a los datos del paciente.

### Entrada

```javascript
var id_paciente = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/pacientes/"+id_paciente+"/antecedentesmedicos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {   "id": 5,
            "id_paciente": 2,
            "nombre_paciente": "Irma Florez",
            "nombre_social_paciente": "",
            "nombre_tipo": "Alertas médicas",
            "nombre_antecedente": "Alergia látex",
            "activo": true,
            "comentario": "",
            "fecha": "2022-12-29 13:54:12",
            "id_usuario": "550",
            "nombre_usuario": "MARIA PEREZ",
            "id_profesional": 557,
            "nombre_profesional": "Dr(a). MARIA PEREZ",
            "id_sucursal": "1",
            "nombre_sucursal": "Sucursal Principal"
        },
        {
            "id": 6,
            "id_paciente": 2,
            "nombre_paciente": "Irma Florez",
            "nombre_social_paciente": "",
            "nombre_tipo": "Alertas médicas",
            "nombre_antecedente": "Alergia Sedante",
            "activo": true,
            "comentario": "Cambiando el comentario",
            "fecha": "2022-12-29 13:54:12",
            "id_usuario": "550",
            "nombre_usuario": "MARIA PEREZ",
            "id_profesional": 557,
            "nombre_profesional": "Dr(a). MARIA PEREZ",
            "id_sucursal": "1",
            "nombre_sucursal": "Sucursal Principal"
        },
        {

            "id": 10,
            "id_paciente": 2,
            "nombre_paciente": "Irma Florez",
            "nombre_social_paciente": "",
            "nombre_tipo": "Medicamentos",
            "nombre_antecedente": "Aspirina",
            "activo": false,
            "comentario": "",
            "fecha": "2022-12-29 13:54:12",
            "id_usuario": "550",
            "nombre_usuario": "MARIA PEREZ",
            "id_profesional": 557,
            "nombre_profesional": "Dr(a). MARIA PEREZ",
            "id_sucursal": "1",
            "nombre_sucursal": "Sucursal Principal"
        },
    ]
}
```

## `GET` /pacientes/{id_paciente}/historialantecedentesmedicos

Retorna el historial de cambios de los antecedentes médicos del paciente.

### Entrada

```javascript
var id_paciente = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v2/pacientes/"+id_paciente+"/historialantecedentesmedicos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id_paciente": "1111",
        "nombre_paciente": "Paciente Real",
        "historial": [
            {   "id_actualizacion": 244,
                "fecha_actualizacion": "2022-07-15 12:09:28",
                "usuario_actualizacion": {
                    "id": 1,
                    "nombre": "Administrador"
                },
                "sucursal_actualizacion": {
                    "id": 1,
                    "nombre": "Sucursal Principal"
                },
                "antecedentes": [
                    {
                        "id_tipo": 1,
                        "nombre_tipo": "Alertas médicas",
                        "valores": [
                            {
                                "id_campo": 1,
                                "nombre_campo": "Alergia látex",
                                "campo_habilitado": 1,
                                "valor": 0
                            },
                            {
                                "id_campo": 2,
                                "nombre_campo": "Alergia Sedante",
                                "campo_habilitado": 1,
                                "valor": 0
                            }
                        ],
                        "detalle": ""
                    }
                ]
            }
        ]
    }
}
```

## `GET` /pagos

Muestra la información de todos los pagos ingresados en la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pagos/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 10,
            "id_pagador": 73,
            "nombre_pagador": "Juan Perez",
            "tipo_pagador": "Paciente",
            "id_paciente": 2,
            "nombre_paciente": "Matias Donoso",
            "nombre_social_paciente": "Mat",
            "monto_pago": 75000,
            "id_medio_pago":0,
            "medio_pago": "Efectivo",
            "id_banco": "",
            "nombre_banco": "",
            "fecha_recepcion": "2016-09-29",
            "fecha_vencimiento": "2016-11-21",
            "fecha_creacion": "2016-09-29 11:00:54",
            "rut_emisor": "",
            "numero_referencia": "",
            "id_caja" : 40,
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "folio": 1234,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/10",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 11,
            "id_pagador": 3,
            "nombre_pagador": "Guillermo Morales",
            "tipo_pagador": "Paciente",
            "id_paciente": 3,
            "nombre_paciente": "Guillermo Morales",
            "nombre_social_paciente": "",
            "monto_pago": 150000,
            "id_medio_pago": 1,
            "medio_pago": "Cheque",
            "id_banco":2,
            "nombre_banco": "Banco Santander",
            "fecha_recepcion": "2016-10-26",
            "fecha_vencimiento": "2016-11-10",
            "fecha_creacion": "2016-10-26 14:23:12",
            "rut_emisor": "1-9",
            "numero_referencia": "43543",
            "id_caja" : 41,
            "id_sucursal": 2,
            "nombre_sucursal": "SUR",
            "folio": 1236,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/11",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pagos/{id_pago}

Muestra la información de un pago en específico.

### Entrada

```javascript
var id_pago     = 10;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pagos/"+id_pago,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 10,
        "id_pagador": 1039,
        "nombre_pagador": "Engenis SpA",
        "tipo_pagador": "Empresa",
        "id_paciente": 2,
        "nombre_paciente": "Daniel Vergara Robles",
        "nombre_social_paciente": "",
        "monto_pago": 75000,
        "id_medio_pago": 0,
        "medio_pago": "Efectivo",
        "id_banco":"",
        "nombre_banco": "",
        "fecha_recepcion": "2016-09-29",
        "fecha_vencimiento": "2016-11-21",
        "fecha_creacion": "2016-09-29 11:00:54",
        "rut_emisor": "",
        "numero_referencia": "",
        "id_caja" : 40,
        "id_sucursal": 1,
        "nombre_sucursal": "NORTE",
        "folio": 4321,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pagos/10",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /pagos/devoluciones

Muestra el listado de todas las devoluciones de la clínica. Una devolución es un pago de tipo "Devolución" con monto negativo y un pago asociado (referenciado por `id_pago_asociado`).

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pagos/devoluciones",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 39,
            "id_pago_asociado": 37,
            "id_pagador": 1226,
            "nombre_pagador": "AARON DANIEL SALINAS FERNANDEZ",
            "tipo_pagador": "Paciente",
            "id_paciente": 1226,
            "nombre_paciente": "AARON DANIEL SALINAS FERNANDEZ",
            "monto_pago": -25000,
            "id_medio_pago": 0,
            "medio_pago": "Efectivo",
            "nombre_banco": "",
            "fecha_recepcion": "2026-05-15",
            "numero_referencia": "",
            "id_caja": 1,
            "id_sucursal": 1,
            "nombre_sucursal": "Sandbox API",
            "id_usuario_devolucion": 5,
            "nombre_usuario_devolucion": "Juan Pérez",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/devoluciones/39",
                    "method": "GET"
                },
                {
                    "rel": "pago_asociado",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/37",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 38,
            "id_pago_asociado": 37,
            "id_pagador": 1226,
            "nombre_pagador": "AARON DANIEL SALINAS FERNANDEZ",
            "tipo_pagador": "Paciente",
            "id_paciente": 1226,
            "nombre_paciente": "AARON DANIEL SALINAS FERNANDEZ",
            "monto_pago": -20000,
            "id_medio_pago": 1,
            "medio_pago": "Cheque",
            "nombre_banco": "",
            "fecha_recepcion": "2026-05-14",
            "numero_referencia": "",
            "id_caja": 0,
            "id_sucursal": 1,
            "nombre_sucursal": "Sandbox API",
            "id_usuario_devolucion": 5,
            "nombre_usuario_devolucion": "Juan Pérez",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/devoluciones/38",
                    "method": "GET"
                },
                {
                    "rel": "pago_asociado",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pagos/37",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pagos/devoluciones/{id_devolucion}

Muestra la información de una devolución en específico.

### Entrada

```javascript
var id_devolucion = 39;
var settings      = {
    "url": "https://api.medilink2.healthatom.com/api/v1/pagos/devoluciones/"+id_devolucion,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 39,
        "id_pago_asociado": 37,
        "id_pagador": 1226,
        "nombre_pagador": "AARON DANIEL SALINAS FERNANDEZ",
        "tipo_pagador": "Paciente",
        "id_paciente": 1226,
        "nombre_paciente": "AARON DANIEL SALINAS FERNANDEZ",
        "monto_pago": -25000,
        "id_medio_pago": 0,
        "medio_pago": "Efectivo",
        "nombre_banco": "",
        "fecha_recepcion": "2026-05-15",
        "numero_referencia": "",
        "id_caja": 1,
        "id_sucursal": 1,
        "nombre_sucursal": "Sandbox API",
        "id_usuario_devolucion": 5,
        "nombre_usuario_devolucion": "Juan Pérez",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/pagos/devoluciones/39",
                "method": "GET"
            },
            {
                "rel": "pago_asociado",
                "href": "https://api.medilink2.healthatom.com/api/v1/pagos/37",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /pagos/{id_pago}/devoluciones

Muestra el listado de todas las devoluciones de un pago en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_pago  = 9;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/pagos/"+id_pago+"/devoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 39,
            "id_pago_asociado": 37,
            "id_pagador": 1226,
            "nombre_pagador": "AARON  DANIEL SALINAS FERNANDEZ",
            "tipo_pagador": "Paciente",
            "id_paciente": 1226,
            "nombre_paciente": "AARON  DANIEL SALINAS FERNANDEZ",
            "nombre_social_paciente":"ANDIEL",
            "monto_pago": 25000,
            "id_medio_pago": 0,
            "id_banco": 0,
            "medio_pago": "Efectivo",
            "nombre_banco": "",
            "fecha_recepcion": "2019-06-25",
            "fecha_vencimiento": "2019-06-25",
            "fecha_creacion": "2019-06-25 10:50:24",
            "rut_emisor": "",
            "numero_referencia": "",
            "id_caja": 1,
            "id_sucursal": 1,
            "nombre_sucursal": "Sandbox API",
            "folio": ""
        },
        {
            "id": 38,
            "id_pago_asociado": 37,
            "id_pagador": 1226,
            "nombre_pagador": "AARON  DANIEL SALINAS FERNANDEZ",
            "tipo_pagador": "Paciente",
            "id_paciente": 1226,
            "nombre_paciente": "AARON  DANIEL SALINAS FERNANDEZ",
            "nombre_social_paciente": "",
            "monto_pago": 20000,
            "id_medio_pago": 1,
            "id_banco": 0,
            "medio_pago": "Cheque",
            "nombre_banco": "",
            "fecha_recepcion": "2019-06-25",
            "fecha_vencimiento": "2019-06-25",
            "fecha_creacion": "2019-06-25 10:45:57",
            "rut_emisor": "",
            "numero_referencia": "",
            "id_caja": 0,
            "id_sucursal": 1,
            "nombre_sucursal": "Sandbox API",
            "folio": ""
        }
    ]
}
```

## `GET` /pagos/{id_pago}/boletas

Muestra el listado de todas las boletas asociadas a un pago en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_pago  = 9;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/pagos/"+id_pago+"/boletas",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 12345,
            "folio_documento": 224324,
            "rut": "1-9",
            "id_receptor": 245,
            "tipo_receptor": "Paciente",
            "nombre_receptor": "Andres Fletcher",
            "id_sucursal": 1,
            "id_emisor": 1,
            "nombre_emisor": "Clinica Medilink",
            "razon_social_emisor": "Clinica Medilink SPA",
            "inicio_rango": 1,
            "fin_rango": 100,
            "id_tipo_documento": 3,
            "tipo_documento": "Boleta exenta",
            "fecha_emision": "2018-03-20 12:00:01",
            "total_boleta": 2132,
            "referencias": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.medilink2.healthatom.com/api/v1/documentosTributarios/59546",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "http://api.medilink2.healthatom.com/api/v1/documentosTributarios/59546/referencias",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pagosEliminados

Muestra la información de todos los pagos eliminados de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/pagosEliminados/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1028,
            "id_pagador": 172,
            "nombre_pagador": "DANIELA GARCIA",
            "tipo_pagador": "Paciente",
            "id_paciente": 172,
            "nombre_paciente": "DANIELA GARCIA",
            "monto_pago": 200000,
            "id_medio_pago": 2,
            "medio_pago": "Tarjeta de débito",
            "nombre_banco": "",
            "fecha_recepcion": "2018-04-11",
            "fecha_vencimiento": "2018-04-11",
            "numero_referencia": "1345678",
            "fecha_creacion": "2018-04-11 17:58:34",
            "id_caja": 0,
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "folio_boleta": 23423,
            "fecha_eliminacion": "2018-04-11 02:59:23",
            "comentarios": "ok",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagosEliminados/1028",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1026,
            "id_pagador": 171,
            "nombre_pagador": "JUAN PEREZ",
            "tipo_pagador": "Paciente",
            "id_paciente": 171,
            "nombre_paciente": "JUAN PEREZ",
            "monto_pago": 50000,
            "id_medio_pago": 7,
            "medio_pago": "Efectivo",
            "nombre_banco": "",
            "fecha_recepcion": "2018-04-10",
            "fecha_vencimiento": "2018-04-10",
            "numero_referencia": "1345678",
            "fecha_creacion": "2018-04-10 17:56:44",
            "id_caja": 0,
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "folio_boleta": 234232,
            "fecha_eliminacion": "2018-04-10 02:58:20",
            "comentarios": "OK",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagosEliminados/1026",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /pagosEliminados/{id_pago_eliminado}

Muestra la información de un pago eliminado en específico.

### Entrada

```javascript
var id_pago_eliminado = 1028;
var settings          = {
    "url": "https://api.medilink2.healthatom.com/api/v5/pagosEliminados/"+id_pago_eliminado,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 1028,
        "id_pagador": 172,
        "nombre_pagador": "DANIELA GARCIA",
        "tipo_pagador": "Paciente",
        "id_paciente": 172,
        "nombre_paciente": "DANIELA GARCIA",
        "monto_pago": 200000,
        "id_medio_pago": 2,
        "medio_pago": "Tarjeta de débito",
        "nombre_banco": "",
        "fecha_recepcion": "2018-04-11",
        "fecha_vencimiento": "2018-04-11",
        "numero_referencia": "1345678",
        "fecha_creacion": "2018-04-11 17:58:34",
        "id_caja": 0,
        "id_sucursal": 1,
        "nombre_sucursal": "NORTE",
        "folio_boleta": 2142,
        "fecha_eliminacion": "2018-04-11 02:59:23",
        "comentarios": "ok",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/pagosEliminados/1028",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /pagosEliminados/{id_pago}/boletas

Muestra el listado de todas las boletas asociadas a un pago eliminado en específico.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_pago  = 9;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/pagosEliminados/"+id_pago+"/boletas",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 12345,
            "folio_documento": 224324,
            "rut": "1-9",
            "id_receptor": 245,
            "tipo_receptor": "Paciente",
            "nombre_receptor": "Andres Fletcher",
            "id_sucursal": 1,
            "id_emisor": 1,
            "nombre_emisor": "Clinica Medilink",
            "razon_social_emisor": "Clinica Medilink SPA",
            "inicio_rango": 1,
            "fin_rango": 100,
            "id_tipo_documento": 3,
            "tipo_documento": "Boleta exenta",
            "fecha_emision": "2018-03-20 12:00:01",
            "total_boleta": 2132,
            "referencias": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.medilink2.healthatom.com/api/v5/documentosTributarios/59546",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "http://api.medilink2.healthatom.com/api/v5/documentosTributarios/59546/referencias",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /permisos

Muestra el listado de todos los permisos de usuario.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/permisos",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 74,
            "nivel": "/agendaonline/validar",
            "nombre": "Validar citas en agenda online",
            "categoria": "Agenda",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/permisos/74",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 73,
            "nivel": "/tratamientos/desrealizarPrestacionGarantia",
            "nombre": "Permite desrealizar por garantía una prestación ya liquidada",
            "categoria": "Tratamientos",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/permisos/73",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 72,
            "nivel": "/tratamientos/contralor",
            "nombre": "Dar de alta las prestaciones realizadas.",
            "categoria": "Administración",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/permisos/72",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /permisos/{id_permiso}

Muestra la información de un permiso específico.

### Entrada

```javascript
var id_permiso = 72;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/permisos/"+id_permiso,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 72,
        "nivel": "/tratamientos/contralor",
        "nombre": "Dar de alta las prestaciones realizadas.",
        "categoria": "Administración",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/permisos/72",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /recetas

Muestra el listado de recetas

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/recetas",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
       {
            "id": 57,
            "detalles": "prúeba",
            "habilitado": true,
            "id_tratamiento": 1186,
            "nombre_tratamiento": "Ejemeplo de PDT",
            "id_paciente": 56,
            "paciente": "Edgar Pistoweiss",
            "nombre_social_paciente": "",
            "id_creador": 2,
            "creador": "Soporte Engenis",
            "fecha_creacion": "2020-09-28 22:54:00",
            "id_eliminador": 0,
            "eliminador": "",
            "fecha_eliminacion": "",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/recetas/57",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/tratamientos/1186",
                    "method": "GET"
                },
                {
                    "rel": "pacientes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/56",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 56,
            "detalles": "prúeba",
            "habilitado": false,
            "id_tratamiento": 1186,
            "nombre_tratamiento": "Ejemeplo de PDT",
            "id_paciente": 56,
            "paciente": "Edgar Pistoweiss",
            "nombre_social_paciente": "",
            "id_creador": 2,
            "creador": "Soporte Engenis",
            "fecha_creacion": "2020-09-28 22:53:46",
            "id_eliminador": 2,
            "eliminador": "Soporte Engenis",
            "fecha_eliminacion": "2020-09-28 16:54:00",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/recetas/56",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/tratamientos/1186",
                    "method": "GET"
                },
                {
                    "rel": "pacientes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/56",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 55,
            "detalles": "<p>500mg de Ibuprofeno, dependiendo del dolor.</p><p>250mg Amoxicilina cada 8hrs x 5 días.</p><p>Terminar completamente tratamiento.</p><p><br></p><p>( Se puede modificar, pero esto NO afecta la plantilla original )</p>",
            "habilitado": true,
            "id_tratamiento": 1196,
            "nombre_tratamiento": "Nuevo plan de tratamiento",
            "id_paciente": 295,
            "paciente": "MANUEL COHEN",
            "nombre_social_paciente": "MANUELA COHEN",
            "id_creador": 2,
            "creador": "Soporte Engenis",
            "fecha_creacion": "2020-09-22 16:24:29",
            "id_eliminador": 0,
            "eliminador": "",
            "fecha_eliminacion": "",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/recetas/55",
                    "method": "GET"
                },
                {
                    "rel": "tratamientos",
                    "href": "https://api.medilink2.healthatom.com/api/v1/tratamientos/1196",
                    "method": "GET"
                },
                {
                    "rel": "pacientes",
                    "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/295",
                    "method": "GET"
                }
            ]
        },
    ]
}
```

## `GET` /recetas/{id_receta}

Muestra el detalle de una receta

### Entrada

```javascript
var id_receta     = 71;
var settings      = {
    "url": "https://api.medilink2.healthatom.com/api/v1/recetas/"+id_receta,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 71,
        "detalles": "noooo",
        "habilitado": false,
        "id_tratamiento": 948,
        "nombre_tratamiento": "Nuevo plan de tratamiento",
        "id_paciente": 255,
        "paciente": "Manuel Rivera",
        "nombre_social_paciente": "",
        "id_creador": 2,
        "creador": "Soporte Engenis",
        "fecha_creacion": "2020-10-08 15:23:50",
        "id_eliminador": 2,
        "eliminador": "Soporte Engenis",
        "fecha_eliminacion": "2020-10-08 09:24:10",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/recetas/71",
                "method": "GET"
            },
            {
                "rel": "tratamientos",
                "href": "https://api.medilink2.healthatom.com/api/v1/tratamientos/948",
                "method": "GET"
            },
            {
                "rel": "pacientes",
                "href": "https://api.medilink2.healthatom.com/api/v1/pacientes/255",
                "method": "GET"
            }
        ]
    }
}
```

## `POST` /prestaciones

Permite crear una prestación.

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/prestaciones/",
    "method": "POST",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"        : "Prestación prueba",
        "id_tipo"       : 1,
        "id_arancel"    : 0,
        "id_categoria"  : 176,
        "precio"        : 5000
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 6215,
        "nombre": "Prestación prueba",
        "codigo" : "",
        "id_arancel": 0,
        "nombre_arancel": "Arancel base",
        "id_categoria": 176,
        "nombre_categoria": "Pruebas",
        "id_tipo": 1,
        "tipo": "Acción Clínica",
        "precio": 5000,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6215",
                "method": "GET"
            }
        ]
    }
}
```

## `PUT` /prestaciones/{id_prestacion}

Permite editar una prestación.

### Entrada

```javascript
var id_prestacion   = 6215;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/prestaciones/"+id_prestacion,
    "method": "PUT",
    "headers": {
        "Authorization": "Token "+token
    },
    "data":{
        "nombre"    : "Prestación modificada",
        "codigo"    : "AV102",
        "precio"    : 19000
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 6215,
        "nombre": "Prestación modificada",
        "codigo" : "AV102",
        "id_arancel": 0,
        "nombre_arancel": "Arancel base",
        "id_categoria": 176,
        "nombre_categoria": "Pruebas",
        "id_tipo": 1,
        "tipo": "Acción Clínica",
        "precio": 19000,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/6215",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /prestaciones

Muestra el listado de todas las prestaciones de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/prestaciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "Exodoncia tercer molar",
            "codigo": "AV102",
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "id_categoria": 1,
            "nombre_categoria": "Extracción",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 55000,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Examén inicial",
            "codigo": "",
            "id_arancel": 0,
            "nombre_arancel": "Arancel base",
            "id_categoria": 2,
            "nombre_categoria": "Diagnostico",
            "id_tipo": 1,
            "tipo": "Acción Clínica",
            "precio": 1000,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /prestaciones/{id_prestacion}

Muestra la información de una prestación en específico.

### Entrada

```javascript
var id_prestacion = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/prestaciones/"+id_prestacion,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data":{
        "id": 2,
        "nombre": "Examén inicial",
        "codigo" : "",
        "id_arancel": 0,
        "nombre_arancel": "Arancel base",
        "id_categoria": 2,
        "nombre_categoria": "Diagnostico",
        "id_tipo": 1,
        "tipo": "Acción Clínica",
        "precio": 1000,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/2",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /prestaciones/tipos

Muestra el listado de tipos de prestación.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v1/prestaciones/tipos/",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 4,
            "nombre": "Producto",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/tipos/4",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 3,
            "nombre": "Otros",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/tipos/3",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Laboratorio",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/tipos/2",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "Acción Clínica",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/prestaciones/tipos/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /previsiones

Muestra el listado de todas las previsiones de salud de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/previsiones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "links": {
        "current": "https://api.medilink2.healthatom.com/api/v5/previsiones?cursor=NUl2Mnd4Q3oyNDdQeyJwYWdlIjowLCJsaW1pdCI6IjUwIiwicXVlcnkiOltdfQ=="
    },
    "data": [
        {
            "id": 16,
            "nombre": "Isapre Nº1",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/previsiones/16",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/previsiones/16/bonos",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 15,
            "nombre": "Isapre Nº2",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/previsiones/15",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/previsiones/15/bonos",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /previsiones/{id_prevision}

Muestra la información de una previsión en específico.

### Entrada

```javascript
var id_prevision    = 16;
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v5/previsiones/"+id_prevision,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 16,
        "nombre": "Isapre Nº1",
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/previsiones/16",
                "method": "GET"
            },
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/previsiones/16/bonos",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /previsiones/{id_prevision}/bonos

Muestra la información todos bonos asociados a una previsión en especifico.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/previsiones/"+$id_prevision+"/bonos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "links": {
        "current": "https://api.medilink2.healthatom.com/api/v5/previsiones/16/bonos?cursor=NUl2Mnd4Q3oyNDdQeyJwYWdlIjowLCJsaW1pdCI6IjUwIiwicXVlcnkiOltdfQ=="
    },
    "data": [
        {
            "id": 7101,
            "id_pagador": 2900,
            "nombre_pagador": "Andres Fletcher",
            "tipo_pagador": "Paciente",
            "id_paciente": 2900,
            "nombre_paciente": "Andres Fletcher",
            "monto_pago": 10000,
            "id_medio_pago": 14,
            "medio_pago": "Bonificación Previsión",
            "nombre_banco": "Isapre Nº1",
            "fecha_recepcion": "2019-02-07",
            "fecha_vencimiento": "2019-02-07",
            "numero_referencia": "1345678",
            "fecha_creacion": "2019-02-07 14:40:55",
            "id_caja": 508,
            "id_sucursal": 1,
            "nombre_sucursal": "Sucursal Nº1",
            "folio_boleta": [
                213123
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagos/7101",
                    "method": "GET"
                },
                {
                    "rel": "boletas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagos/7101/boletas",
                    "method": "GET"
                },
                {
                    "rel": "devoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagos/7101/devoluciones",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 7102,
            "id_pagador": 2901,
            "nombre_pagador": "Matias Miller",
            "tipo_pagador": "Paciente",
            "id_paciente": 2901,
            "nombre_paciente": "Matias Miller",
            "monto_pago": 20000,
            "id_medio_pago": 14,
            "medio_pago": "Bonificación Previsión",
            "nombre_banco": "Isapre Nº1",
            "fecha_recepcion": "2019-02-10",
            "fecha_vencimiento": "2019-02-10",
            "numero_referencia": "1345678",
            "fecha_creacion": "2019-02-10 14:40:55",
            "id_caja": 508,
            "id_sucursal": 2,
            "nombre_sucursal": "Sucursal Nº2",
            "folio_boleta": [
                75675
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagos/7101",
                    "method": "GET"
                },
                {
                    "rel": "boletas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagos/7101/boletas",
                    "method": "GET"
                },
                {
                    "rel": "devoluciones",
                    "href": "https://api.medilink2.healthatom.com/api/v5/pagos/7101/devoluciones",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /reportes/produccion

Muestra el listado de las prestaciones realizadas con su respectiva información asociada

### Entrada

```javascript
var settings        = {
    "url": "https://api.medilink2.healthatom.com/api/v1/reportes/produccion?id_sucursal=1&fecha_inicio=2017-09-28&fecha_fin=2019-10-27",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}
$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
  "data": [
    {
      "id_sucursal": 1,
      "id_tratamiento": 388,
      "nombre_tratamiento": "Corona metal porcelana",
      "id_detalle_tratamiento": 1530,
      "fecha_realizacion": "2017-09-28",
      "id_prestacion": 5202,
      "codigo_prestacion": "",
      "nombre_prestacion": "Corona Metal Porcelana (LAB)",
      "id_profesional": 15,
      "nombre_completo_profesional": "Especialidad Especialidad",
      "id_paciente": 19,
      "monto": 12000
    },
    {
      "id_sucursal": 1,
      "id_tratamiento": 299,
      "nombre_tratamiento": "resinas",
      "id_detalle_tratamiento": 1058,
      "fecha_realizacion": "2017-09-29",
      "id_prestacion": 4850,
      "codigo_prestacion": "",
      "nombre_prestacion": "Restauraciones Resina (Clase III) Tres Caras",
      "id_profesional": 3,
      "nombre_completo_profesional": "Fernanda Risopatrón",
      "id_paciente": 114,
      "monto": 6000
    },
    {
      "id_sucursal": 1,
      "id_tratamiento": 299,
      "nombre_tratamiento": "resinas",
      "id_detalle_tratamiento": 1057,
      "fecha_realizacion": "2017-09-29",
      "id_prestacion": 4850,
      "codigo_prestacion": "",
      "nombre_prestacion": "Restauraciones Resina (Clase III) Tres Caras",
      "id_profesional": 3,
      "nombre_completo_profesional": "Fernanda Risopatrón",
      "id_paciente": 114,
      "monto": 8900
    }
  ]
}
```

## `GET` v5/profesionales

Muestra el listado de todos los profesionales de la clínica.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/profesionales",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "rut": "1-9",
            "nombre": "Api",
            "apellidos": "Test",
            "celular": "12345678",
            "telefono": "2123456789",
            "ciudad": "Santiago",
            "comuna": "Santiago",
            "direccion": "Badajoz 45",
            "email": "ejemplo@test.com",
            "id_especialidad": 3,
            "especialidad": "Endodoncia",
            "agenda_online": 1,
            "intervalo": 30,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/1",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/1/citas",
                    "method": "GET"
                },
                {
                    "rel": "contratos",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/1/contratos",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "rut": "2-7",
            "nombre": "Andrés",
            "apellidos": "Fletcher",
            "celular": "12345678",
            "telefono": "2123456789",
            "ciudad": "Santiago",
            "comuna": "Las Condes",
            "direccion": "Rosario Norte 555, Of. 2102",
            "email": "andres@test.com",
            "id_especialidad": 1,
            "especialidad": "General",
            "agenda_online": 1,
            "intervalo": 5,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/2",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/2/citas",
                    "method": "GET"
                },
                {
                    "rel": "contratos",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/2/contratos",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v5/profesionales/{id_profesional}

Muestra la información de un profesional en específico.

### Entrada

```javascript
var id_profesional = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "rut": "2-7",
        "nombre": "Andrés",
        "apellidos": "Fletcher",
        "celular": "12345678",
        "telefono": "2123456789",
        "ciudad": "Santiago",
        "comuna": "Las Condes",
        "direccion": "Rosario Norte 555, Of. 2102",
        "email": "andres@test.com",
        "id_especialidad": 1,
        "especialidad": "General",
        "agenda_online": 0,
        "intervalo": 5,
        "habilitado": 0,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/2",
                "method": "GET"
            },
            {
                "rel": "citas",
                "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/2/citas",
                "method": "GET"
            },
            {
                "rel": "contratos",
                "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/2/contratos",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` v5/profesionales/{id_profesional}/citas

Muestra las citas asociadas a un profesional en específico.

### Entrada

```javascript
var id_profesional = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional+"/citas",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 593,
            "id_paciente": 161,
            "nombre_paciente": "Juan Perez",
            "id_estado": 7,
            "estado_cita": "No confirmado",
            "id_tratamiento": 442,
            "fecha": "2018-01-09",
            "hora_inicio": "11:00:00",
            "hora_fin": "11:30:00",
            "duracion": 30,
            "id_profesional": 2,
            "nombre_profesional": "Andres Fletcher",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "id_sillon": 1,
            "comentarios": "asdasd",
            "fecha_actualizacion": "2016-06-25 13:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/593",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 585,
            "id_paciente": 160,
            "nombre_paciente": "Roberto Garcia",
            "id_estado": 7,
            "estado_cita": "No confirmado",
            "id_tratamiento": 439,
            "fecha": "2017-12-26",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:15:00",
            "duracion": 15,
            "id_profesional": 2,
            "nombre_profesional": "Andres Fletcher",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-25 13:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/585",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v5/profesionales/{id_profesional}/contratos

Muestra la información de los contratos asociados a un profesional en específico.

### Entrada

```javascript
var id_profesional = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional+"/contratos",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 4,
            "id_profesional": 2,
            "nombre_profesional": "Daniel Vergara",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "tipo_contrato": "Por prestación realizada y pagada",
            "descto_medio_pago": 0,
            "porcentaje": 80,
            "forma_pago": "Solo liquidar las acciones que se encuentran realizadas y pagadas por el paciente",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/contratos/4",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 15,
            "id_profesional": 2,
            "nombre_profesional": "Daniel Vergara",
            "id_sucursal": 2,
            "nombre_sucursal": "SUR",
            "tipo_contrato": "Por prestación realizada y pagada",
            "descto_medio_pago": 0,
            "porcentaje": 70,
            "forma_pago": "Solo liquidar las acciones que se encuentran realizadas y pagadas por el paciente",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/contratos/15",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v5/profesionales/{id_profesional}/evoluciones

Muestra el listado de evoluciones por profesional.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_profesional = 3;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional+"/evoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 284,
            "id_tratamiento": 482,
            "nombre_tratamiento": "prueba",
            "id_paciente": 58,
            "nombre_paciente": "Felipe Molina",
            "id_profesional": 3,
            "nombre_profesional": "Ana García",
            "id_usuario": 2,
            "nombre_usuario": "Soporte Engenis",
            "fecha": "2018-02-20 17:39:50",
            "datos": "Acción realizada: Restauraciones Resina (Clase I) Una Cara Pieza 13\n\nasdfghj",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.loc/api/v5/evoluciones/284",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v5/profesionales/{id_profesional}/motivosAtencion

Muestra el listado de los motivos de atención por profesional.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_profesional = 1;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional+"/motivosAtencion",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "links": {
        "current": "https://api.medilink2.healthatom.com/api/v5/profesionales/1/motivosAtencion?cursor=NUl2Mnd4Q3oyNDdQeyJwYWdlIjowLCJsaW1pdCI6NTAsInF1ZXJ5IjpbXX0="
    },
    "data": [
        {
            "id": 4,
            "id_especialidad": 1,
            "nombre_especialidad": "Medicina General",
            "id_motivo_atencion": 1,
            "nombre_motivo_atencion": "Control ",
            "duracion": 60,
            "color": "#ffff00",
            "agenda_online": 0,
            "id_cups": 0,
            "habilitado": 0,
            "links": [
                {
                    "rel": "related",
                    "href": "https://api.medilink2.healthatom.com/api/v5/especialidades/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 30,
            "id_especialidad": 1,
            "nombre_especialidad": "Medicina General",
            "id_motivo_atencion": 1,
            "nombre_motivo_atencion": "Control ",
            "duracion": 30,
            "color": "#ffe599",
            "agenda_online": 1,
            "id_cups": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "related",
                    "href": "https://api.medilink2.healthatom.com/api/v5/especialidades/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v5/profesional/{id_profesional}/horarios

Muestra todos los horarios de un profesional en específico.

### Entrada

```javascript
var id_profesional = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional+"/horarios/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_profesional": 1,
            "id_sucursal": 2,
            "intervalo": 15,
            "sillones": 1,
            "dias": [
                {
                    "id_box": 1,
                    "dia": 7,
                    "nombre_dia": "Domingo",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "id_box": 1,
                    "dia": 6,
                    "nombre_dia": "Sábado",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "id_box": 1,
                    "dia": 5,
                    "nombre_dia": "Viernes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "id_box": 1,
                    "dia": 4,
                    "nombre_dia": "Jueves",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "id_box": 1,
                    "dia": 3,
                    "nombre_dia": "Miércoles",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "id_box": 1,
                    "dia": 2,
                    "nombre_dia": "Martes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "id_box": 1,
                    "dia": 1,
                    "nombre_dia": "Lunes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "20:00:00",
                    "hora_inicio_break": "13:00:00",
                    "hora_fin_break": "14:00:00"
                }
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/1/horarios",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/2/horarios",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v5/profesionales/{id_profesional}/horariosespeciales

Muestra los horarios especiales de un profesional.

### Entrada

```javascript
var id_profesional = 33;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional+"/horariosespeciales/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 34,
            "id_profesional": 33,
            "id_sucursal": 1,
            "fecha": "2018-05-16",
            "intervalo": 15,
            "hora_inicio": "08:00:00",
            "hora_fin": "13:00:00",
            "hora_inicio_break": "08:00:00",
            "hora_fin_break": "08:00:00",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/33/horariosespeciales/34",
                    "method": "GET"
                },
                {
                    "rel": "sillones",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/33/horariosespeciales/34/sillones",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v5/profesionales/{id_profesional}/horariosbloqueados

Muestra los bloqueos de horario de un profesional.

### Entrada

```javascript
var id_profesional = 31;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/profesionales/"+id_profesional+"/horariosbloqueados/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 94,
            "id_profesional": 31,
            "id_sucursal": 1,
            "fecha": "2018-06-07",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:30:00",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/31/horariosbloqueados/94",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 93,
            "id_profesional": 31,
            "id_sucursal": 1,
            "fecha": "2018-06-01",
            "hora_inicio": "10:45:00",
            "hora_fin": "11:00:00",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/31/horariosbloqueados/93",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v6/profesionales

Version 2 del endpoint GET profesionales. Muestra el listado de todos los profesionales de la clínica e indica si un profesional es del tipo recurso o no.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v6/profesionales",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 51,
            "rut": "1-9",
            "nombre": "Carlos",
            "apellidos": "Perez",
            "celular": "912345678",
            "telefono": "",
            "ciudad": "Viña del Mar",
            "comuna": "Viña del Mar",
            "direccion": "Viña del Mar",
            "email": "profesional1@ejemplo.com",
            "id_especialidad": 1,
            "especialidad": "General",
            "agenda_online": 1,
            "es_recurso": 1,
            "intervalo": 5,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v6/profesionales/51",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 50,
            "rut": "1-5",
            "nombre": "Ana",
            "apellidos": "García",
            "celular": "991259125",
            "telefono": "00000",
            "ciudad": "Santiago",
            "comuna": "San Miguel",
            "direccion": "Guardia Marina Riquelme 4861",
            "email": "profesional2@ejemplo.com",
            "id_especialidad": 1,
            "especialidad": "General",
            "agenda_online": 1,
            "es_recurso": 0,
            "intervalo": 5,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v6/profesionales/50",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` v6/profesionales/{id_profesional}

Version 2 del endpoint GET profesionales/{id_profesional}. Muestra la información de un profesional en específico.

### Entrada

```javascript
var id_profesional = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v6/profesionales/"+id_profesional,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
            "id": 51,
            "rut": "1-9",
            "nombre": "Carlos",
            "apellidos": "Perez",
            "celular": "912345678",
            "telefono": "",
            "ciudad": "Viña del Mar",
            "comuna": "Viña del Mar",
            "direccion": "Viña del Mar",
            "email": "profesional1@ejemplo.com",
            "id_especialidad": 1,
            "especialidad": "General",
            "agenda_online": 1,
            "es_recurso": 1,
            "intervalo": 5,
            "habilitado": 0,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v6/profesionales/51",
                    "method": "GET"
                }
            ]
        }
}
```

## `GET` /sillones

Muestra la información sobre todos los sillones de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sillones/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "Sillón 1",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sillones/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "Sillón 2",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sillones/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /sillones/{id_sillon}

Muestra la información de un sillon en específico.

### Entrada

```javascript
var id_sillon = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sillones/"+id_sillon,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 1,
        "nombre": "Sillon 1",
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/sillones/1",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /sucursales

Muestra la información todos las sucursales de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sucursales/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "nombre": "NORTE",
            "telefono": "1234567",
            "ciudad": "Santiago",
            "comuna": "Las Condes",
            "direccion": "Orinoco 90.",
            "habilitada": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/1",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 2,
            "nombre": "SUR",
            "telefono": "34567890",
            "ciudad": "SANTIAGO",
            "comuna": "LAS CONDES",
            "direccion": "Las Camelias 257",
            "habilitada": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/2",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /sucursales/{id_sucursal}

Muestra la información de una sucursal en específico.

### Entrada

```javascript
var id_sucursal = 2;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sucursales/"+id_sucursal,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 2,
        "nombre": "SUR",
        "telefono": "34567890",
        "ciudad": "SANTIAGO",
        "comuna": "LAS CONDES",
        "direccion": "Las Camelias 257",
        "habilitada": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/2",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /sucursales/{id_sucursal}/boxes

Muestra el listado de boxes asociadas a una sucursal.

### Entrada

```javascript
var id_sucursal = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v1/sucursales/"+id_sucursal+"/boxes",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 1,
            "id_sucursal": 1,
            "nombre": "1",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v1/boxes/1",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /sucursales/{id_sucursal}/cajas

Muestra el listado de cajas asociadas a una sucursal en específico.

### Entrada

```javascript
var id_sucursal = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sucursales/"+id_sucursal+"/cajas",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 45,
            "id_sucursal": 1,
            "id_usuario_admin": 38,
            "fecha_apertura": "2017-11-30 14:33:26",
            "fecha_cierre": "2017-12-02 09:30:24",
            "saldo_anterior": 0,
            "abono_inicial": 0,
            "saldo_inicial": 0,
            "gastos": 2000,
            "acumulado": 800000,
            "saldo_total": 798000,
            "saldo_cierre": 0,
            "estado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/cajas/45",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 44,
            "id_sucursal": 1,
            "id_usuario_admin": 47,
            "fecha_apertura": "2017-10-26 14:31:58",
            "fecha_cierre": "",
            "saldo_anterior": 0,
            "abono_inicial": 0,
            "saldo_inicial": 0,
            "gastos": 400,
            "acumulado": 2743037,
            "saldo_total": 2742637,
            "saldo_cierre": 0,
            "estado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/cajas/44",
                    "method": "GET"
                }
            ]
        },
    ]
}
```

## `GET` /sucursales/{id_sucursal}/citas

Muestra el listado de citas asociadas a una sucursal en específico.

### Entrada

```javascript
var id_sucursal = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sucursales/"+id_sucursal+"/citas",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 593,
            "id_paciente": 161,
            "nombre_paciente": "Juan Perez",
            "id_estado": 7,
            "estado_cita": "No confirmado",
            "id_tratamiento": 442,
            "fecha": "2018-01-09",
            "hora_inicio": "11:00:00",
            "hora_fin": "11:30:00",
            "duracion": 30,
            "id_profesional": 2,
            "nombre_profesional": "Andres Fletcher",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "id_sillon": 1,
            "comentarios": "asdasd",
            "fecha_actualizacion": "2016-06-25 13:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/593",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 585,
            "id_paciente": 160,
            "nombre_paciente": "Roberto Garcia",
            "id_estado": 7,
            "estado_cita": "No confirmado",
            "id_tratamiento": 439,
            "fecha": "2017-12-26",
            "hora_inicio": "08:00:00",
            "hora_fin": "08:15:00",
            "duracion": 15,
            "id_profesional": 2,
            "nombre_profesional": "Andres Fletcher",
            "id_sucursal": 1,
            "nombre_sucursal": "NORTE",
            "id_sillon": 1,
            "comentarios": "",
            "fecha_actualizacion": "2016-06-25 13:24:02",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/citas/585",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /sucursales/{id_sucursal}/usuarios

Muestra el listado de usuarios asociados a una sucursal en específico.

### Entrada

```javascript
var id_sucursal = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sucursales/"+id_sucursal+"/usuarios",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 56,
            "nombre": "Profesional prueba",
            "usuario": "profesionalprueba",
            "rut": "1-9",
            "id_sucursal": 1,
            "email": "prueba@test.com",
            "telefono": "123456789",
            "celular": "12367890",
            "es_profesional": 1,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/usuarios/56",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 55,
            "nombre": "Paciente",
            "usuario": "paciente",
            "rut": "2-7",
            "id_sucursal": 1,
            "email": "paciente@test.com",
            "telefono": "23456789",
            "celular": "789065432",
            "es_profesional": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/usuarios/55",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /sucursales/{id_sucursal}/horarios

Muestra todos los horarios de una sucursal en específico.

### Entrada

```javascript
var id_sucursal = 1;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/sucursales/"+id_sucursal+"/horarios/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id_profesional": 123,
            "id_sucursal": 1,
            "intervalo": 15,
            "dias": [
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 7,
                    "nombre_dia": "Domingo",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 6,
                    "nombre_dia": "Sábado",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 5,
                    "nombre_dia": "Viernes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 4,
                    "nombre_dia": "Jueves",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 3,
                    "nombre_dia": "Miércoles",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 2,
                    "nombre_dia": "Martes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 1,
                    "nombre_dia": "Lunes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "20:00:00",
                    "hora_inicio_break": "13:00:00",
                    "hora_fin_break": "14:00:00"
                }
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/123/horarios",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/1/horarios",
                    "method": "GET"
                }
            ]
        },
        {
            "id_profesional": 224,
            "id_sucursal": 1,
            "intervalo": 10,
            "dias": [
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 7,
                    "nombre_dia": "Domingo",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 6,
                    "nombre_dia": "Sábado",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 5,
                    "nombre_dia": "Viernes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 4,
                    "nombre_dia": "Jueves",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 3,
                    "nombre_dia": "Miércoles",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 2,
                    "nombre_dia": "Martes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "08:00:00",
                    "hora_inicio_break": "08:00:00",
                    "hora_fin_break": "08:00:00"
                },
                {
                    "sillones": 1,
                    "id_box": 1,
                    "dia": 1,
                    "nombre_dia": "Lunes",
                    "hora_inicio": "08:00:00",
                    "hora_fin": "20:00:00",
                    "hora_inicio_break": "13:00:00",
                    "hora_fin_break": "14:00:00"
                }
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/profesionales/224/horarios",
                    "method": "GET"
                },
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/1/horarios",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /usuarios

Muestra la información todos los usuarios de la clínica.

### Entrada

```javascript
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/usuarios/",
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 56,
            "nombre": "Juan",
            "usuario": "Lagos",
            "rut": "1-9",
            "id_sucursal": 1,
            "email": "prueba@test.com",
            "telefono": "123456789",
            "celular": "12367890",
            "es_profesional": 1,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/usuarios/56",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 55,
            "nombre": "Paciente",
            "usuario": "paciente",
            "rut": "2-7",
            "id_sucursal": 1,
            "email": "paciente@test.com",
            "telefono": "23456789",
            "celular": "789065432",
            "es_profesional": 0,
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/usuarios/55",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /usuarios/{id_usuario}

Muestra la información todos los usuarios de la clínica.

### Entrada

```javascript
var id_usuario  = 56;
var settings    = {
    "url": "https://api.medilink2.healthatom.com/api/v5/usuarios/"+id_usuario,
    "method": "GET",
    "headers": {
        "Authorization": "Token "+token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": {
        "id": 56,
        "nombre": "Juan",
        "usuario": "Lagos",
        "rut": "1-9",
        "id_sucursal": 1,
        "email": "prueba@test.com",
        "telefono": "123456789",
        "celular": "12367890",
        "es_profesional": 1,
        "habilitado": 1,
        "links": [
            {
                "rel": "self",
                "href": "https://api.medilink2.healthatom.com/api/v5/usuarios/56",
                "method": "GET"
            }
        ]
    }
}
```

## `GET` /usuarios/{id_usuarios}/evoluciones

Muestra el listado de las evoluciones por usuario.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.

var id_usuario = 2;
var settings = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/usuarios/"+id_usuario+"/evoluciones",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 284,
            "id_tratamiento": 482,
            "nombre_tratamiento": "prueba",
            "id_paciente": 58,
            "nombre_paciente": "Felipe Molina",
            "id_profesional": 3,
            "nombre_profesional": "Fernanda Risopatrón",
            "id_usuario": 2,
            "nombre_usuario": "Soporte Engenis",
            "fecha": "2018-02-20 17:39:50",
            "datos": "Acción realizada: Restauraciones Resina (Clase I) Una Cara Pieza 13\n\nasdfghj",
            "habilitado": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "http://api.loc/api/v5/evoluciones/284",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /usuarios/{id_usuario}/sucursales

Muestra el listado de todas las sucursales a las que tiene acceso el usuario.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_usuario  = 1;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/usuarios/"+id_usuario+"/sucursales",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 2,
            "nombre": "SUR",
            "telefono": "34567890",
            "ciudad": "SANTIAGO",
            "comuna": "LAS CONDES",
            "direccion": "Las Camelias 257",
            "habilitada": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/2",
                    "method": "GET"
                },
                {
                    "rel": "cajas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/2/cajas",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/2/citas",
                    "method": "GET"
                },
                {
                    "rel": "usuarios",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/2/usuarios",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 1,
            "nombre": "NORTE",
            "telefono": "1234567",
            "ciudad": "Santiago",
            "comuna": "Las Condes",
            "direccion": "Orinoco 90",
            "habilitada": 1,
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/1",
                    "method": "GET"
                },
                {
                    "rel": "cajas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/1/cajas",
                    "method": "GET"
                },
                {
                    "rel": "citas",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/1/citas",
                    "method": "GET"
                },
                {
                    "rel": "usuarios",
                    "href": "https://api.medilink2.healthatom.com/api/v5/sucursales/1/usuarios",
                    "method": "GET"
                }
            ]
        }
    ]
}
```

## `GET` /usuarios/{id_usuario}/permisos

Muestra el listado de todos los permisos de un usuario.

### Entrada

```javascript
// Se define la variable token que contiene el access_token
// obtenido en el proceso de autenticación.
var id_usuario  = 1;
var settings    = {
    "url"       : "https://api.medilink2.healthatom.com/api/v5/usuarios/"+id_usuario+"/permisos",
    "method"    : "GET",
    "headers"   : {
        "Authorization": "Token " + token
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});
```

### Salida

```json
{
    "data": [
        {
            "id": 74,
            "nivel": "/agendaonline/validar",
            "nombre": "Validar citas en agenda online",
            "categoria": "Agenda",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/permisos/74",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 73,
            "nivel": "/tratamientos/desrealizarPrestacionGarantia",
            "nombre": "Permite desrealizar por garantía una prestación ya liquidada",
            "categoria": "Tratamientos",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/permisos/73",
                    "method": "GET"
                }
            ]
        },
        {
            "id": 72,
            "nivel": "/tratamientos/contralor",
            "nombre": "Dar de alta las prestaciones realizadas.",
            "categoria": "Administración",
            "links": [
                {
                    "rel": "self",
                    "href": "https://api.medilink2.healthatom.com/api/v5/permisos/72",
                    "method": "GET"
                }
            ]
        }
    ]
}
```
