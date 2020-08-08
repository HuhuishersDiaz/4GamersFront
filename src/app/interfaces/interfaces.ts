export interface Juego {
    idJuego: number;
    Nombre: string;
    fkPlataforma: number;
    imgLogo: string;
    imgPortada: string;
    imgPrecentacion: string;
}

export interface User {
    _id: string;
    nombre: string;
    username?: any;
    email: string;
}

export interface res {
    juego: Juego;
    apuesta: number;
    user: User;
}


export interface Recordset {}

export interface Output {}

export interface Info {
    recordsets: any[][];
    recordset: Recordset[];
    output: Output;
    rowsAffected: number[];
}

export interface respuesta {
    ok: boolean;
    info: Info;
}

export interface versusModel {
    idversus: number;
    apuesta: number;
    nombre: string;
    username: string;
    idpersona: number;
    idjuego: number;
    juego: string;
    imglogo: string;
}


export interface infouser {
    idpersona ?: number,
    idplataforma ?: string,
    nombre ?: string,
    plataforma ?: string,
    username ?: string
}

export interface inscripcion {
    Lugar: String,
    fecha: Date,
    fkPersona: number,
    fkTorneo: number,
    idInscripcion: number,
    status: boolean
}
export interface paquete{
  Costo?: number,
fecha?: Date,
idToken?: number,
imgPrecentacion?: string,
numTokens?: number,
}
