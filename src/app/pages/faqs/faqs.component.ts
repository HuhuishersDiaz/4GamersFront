import {
    Component, OnInit
}
from '@angular/core';

@Component({ selector: 'app-faqs', templateUrl: './faqs.component.html', styleUrls: ['./faqs.component.css'] }) export class FaqsComponent implements OnInit {

    faqs: any[] = [{pregunta: "¿Qué es 4Gamers?", respuesta : "4Gamers es una plataforma diseñada especialmente para poder participar en campeonatos y/o torneos de videojuegos."}, {pregunta: "¿Cómo consigo Tokens?", respuesta : `Existen 3 maneras de conseguir Tokens: Puedes ir a nuestra tienda y comprar la cantidad de Tokens que necesites. Participando de torneos y campeonatos podrás ganar más Tokens. 4Gamers tiene torneos gratis donde también puedes conseguir más Tokens.`}, { pregunta: "¿Es seguro comprar Tokens?", respuesta : "4Gamers utiliza una pasarela de pago conocida en el mercado E-commerce para garantizar la protección de tus datos al momento de realizar una transacción." }, {pregunta: "¿Cómo me inscribo en un torneo?", respuesta : "Para participar en un torneo o campeonato, lo único que necesitas es contar con la cantidad de Tokens necesarios para poder cubrir la inscripción."} ,{pregunta: "¿Cómo participo en un torneo?", respuesta : "Una vez que hayas pagado tu ingreso al torneo, solo deberás solicitar al sistema que te asigne un rival con la opción “buscar rival” y luego jugar. Una vez que se dé el resultado de la partida, deberás seleccionar victoria o derrota."} ,{pregunta: "¿Qué es una disputa?", respuesta : "Una disputa se da cuando dos persona seleccionan victoria y lo reportan como su resultado final." } ,{pregunta: "¿Qué pasa si mi partida va a disputa?", respuesta : "Cuando tu partida se va a disputa, esta será resuelta por los administradores de la página quienes evaluarán el resultado de la partida. Los administradores revisarán las imágenes que el usuario haya cargado como sustento y determinarán quien es el ganador real de la partida." }, {pregunta: "¿Qué pasa si no estoy conforme con la resolución de la disputa?", respuesta : "Cuando no estés de acuerdo con la resolución de una partida, deberás enviar un correo a contacto@4gamers.com.pe; contándonos que fue lo que pasó. Nosotros evaluaremos la situación nuevamente y se abrirá un caso para poder resolver el problema." }, {pregunta: "¿Por qué no puedo jugar todos los Vs que quiero?", respuesta : "La página tiene una limitante, la cual solo te permite ganar un máximo de 50 Tokens por día en la modalidad de Vs." }, {pregunta: "¿Cómo retiro mi dinero?", respuesta : "En caso desees canjear los Tokens que hayas ganado por dinero, deberás entrar a la opción de COBRAR que se encuentra al final de la página de Home y continuar con el proceso." } ];
    constructor() {}

    ngOnInit():void {}


}
