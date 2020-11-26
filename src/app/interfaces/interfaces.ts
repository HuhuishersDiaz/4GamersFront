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
    username ?: string,
    imguser ? : string
    copas ? : number,
    rango ? : string
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


export interface DetalleFase {
    ok: boolean;
    encuentro: Encuentro;
    detalle: Detalle[];
  }
  
export  interface Detalle {
    idResEncuentro: number;
    fkEncuentro: number;
    fkInscripcion: number;
    isWinner: boolean;
    img?: any;
    fecha: string;
  }
  
 export  interface Encuentro {
    IdEncuentro: number;
    fkInscripcionAnfitrion: number;
    fkInscripcionRival: number;
    fkFase: number;
    fecha: string;
    Status: boolean;
  }

export interface FaseTorneo {
    fkTorneo: string;
    idFase: string;
    imgFase: string;
    numTokens: number;
    activa?: boolean;
    status?: string;
  }

  export interface encCamp {
    idEncuentro ?: number;
    fkCampeonato ?: number;
    fkFase ?: number;
    fkAnfitrion ?: number;
    fkRival ?: number;
    status ?: number;
    fecha ?: Date;
    nombreanfitrion ?: string;
    imgAnfitrion ?: string;
    nombrerival ?: string;
    imgRival ?: string;
}


export interface  infoVersus{
    Apuesta ?: number
    Fecha?: string,
    finaliza?: number,
    fkAnfitrion?: number,
    fkJuego?: number,
    fkRival?: number,
    idVersus?: number,
    reglas?: string,
    status?: number
}



export interface torneoModel {
    idTorneo: number;
    CosEntrada: number;
    imgPrecentacion: string;
    img: string;
    monPremio: number;
    numJugadores: number;
    descripcion: string;
    inicio: number;
    fin: number;
    inscripciones: number;
}
export interface CampeonatoModel {
    idCampeonato: number;
    CosEntrada: number;
    imgPrecentacion: string;
    imgLogo: string;
    monPremio: number;
    numJugadores: number;
    descripcion: string;
    inicio: number;
    fin: number;
    inscripciones: number;
}