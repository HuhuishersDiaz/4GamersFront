export class User{

    constructor(
            public _id : String ,
            public nombre : String ,
            public username : String ,
            public email : String ,
            public password : String ,
            public confirma : String ,
            public socketID : String ,
            public dni : String ,
            ){
    }
}

export class Login{

    constructor(
            public email : String ,
            public password : String ,
            ){
    }
}