const botoesAlfabeto = document.querySelector(".botoes");
const palavraAdivinharConteudo = document.querySelector(".palavra-adivinhar");
const imagem = document.querySelector("img");
const dicaConteudo = document.querySelector(".dica");
const telaInicial = document.getElementById("tela_inicial");
const telaJogo = document.getElementById("tela_de_jogo");
const btnIniciar = document.getElementById("botao_iniciar");
const btnMostrarDica = document.getElementById("botao_dica");
const temaConteudo = document.querySelector(".tema");
const somAcerto = document.getElementById("som_acerto");
const somErro = document.getElementById("som_erro");

const palavras_e_temas = {
    "Frutas": [
        { palavra: "Maça", dica: "Fruta vermelha que dá em árvores" },
        { palavra: "Banana", dica: "Fruta amarela e curva" },
        { palavra: "Limão", dica: "Fruta verde e azeda" },
        { palavra: "Uva", dica: "Fruta roxa que nasce em cacho" },
        { palavra: "Laranja", dica: "Fruta de cor laranja" }
    ],
    "Animais": [
        { palavra: "Elefante", dica: "Animal de grande porte com tromba longa" },
        { palavra: "Cachorro", dica: "Animal de estimação" },
        { palavra: "Tubarão", dica: "Animal de grande porte que vive no oceano e possui uma barbatana" },
        { palavra: "Tartaruga", dica: "Animal de médio porte conhecido por andar devagar" },
        { palavra: "Girafa", dica: "Animal alto, com pescoço longo" }
    ],
    "Objetos": [
        { palavra: "Computador", dica: "Dispositivo eletrônico de mesa" },
        { palavra: "Faca", dica: "Usado para cortar coisas" },
        { palavra: "Sofá", dica: "Usado para se sentar" },
        { palavra: "Mesa", dica: "Usado para colocar objetos encima" },
        { palavra: "Celular", dica: "Dispositivo de comunicação e interação social" }
    ],
    "Veículos": [
        { palavra: "Bicicleta", dica: "Veículo de duas rodas" },
        { palavra: "Carro", dica: "Veículo de quatro rodas" },
        { palavra: "Barco", dica: "Usado para se locomover pelos mares" },
        { palavra: "cavalo", dica: "Animal usado para se locomover nas antiguidades" },
        { palavra: "Avião", dica: "Meio de transporte aéreo" }
    ],
    "Países": [
        { palavra: "Brasil", dica: "Maior País da América do sul" },
        { palavra: "Vaticano", dica: "Menor País do mundo" },
        { palavra: "Italia", dica: "País conhecido pelas ótimas pizzas" },
        { palavra: "México", dica: "País conhecido pelas comidas apimentadas" },
        { palavra: "Rússia", dica: "Maior País do mundo" }
    ],
    "Times": [
      { palavra: "RealMadrid", dica: "Maior campeão da UEFA Champions League" },
      { palavra: "ManchesterUnited", dica: "Maior campeão Inglês" },
      { palavra: "Independiente", dica: "Maior campeão da Conmebol Libertadores" },
      { palavra: "Corinthians", dica: "Maior campeão Mundial FIFA das Américas" },
      { palavra: "AlHilal", dica: "Maior campeão Arabe" }
  ]
};

function palavra_e_tema() {
    const temas = Object.keys(palavras_e_temas);
    const tema = temas[Math.floor(Math.random() * temas.length)];
    const palavras = palavras_e_temas[tema];
    const indice = Math.floor(Math.random() * palavras.length);
    return { tema, ...palavras[indice] };
}

btnIniciar.onclick = () => iniciar();
btnMostrarDica.onclick = () => mostrarDica();
let indiceImagem;
let palavraCorreta; // Variável para armazenar a palavra correta

function iniciar() {
    telaInicial.style.display = "none";
    telaJogo.style.display = "flex";
    novaRodada();
}

function novaRodada() {
    indiceImagem = 1;
    imagem.src = `img/img1.png`;
    dicaConteudo.style.display = "none";
    dicaConteudo.textContent = "";
    temaConteudo.textContent = "";
    document.getElementById('mensagemFeedback').textContent = '';

    gerarSecaoAdivinhacao();
    gerarBotoes();
}

function gerarSecaoAdivinhacao() {
    palavraAdivinharConteudo.textContent = "";

    const { tema, palavra, dica } = palavra_e_tema();
    temaConteudo.textContent = `Tema: ${tema}`;
    const palavraSemAcento = palavra
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    Array.from(palavraSemAcento).forEach((letra) => {
        const span = document.createElement("span");

        span.textContent = "_";
        span.setAttribute("palavra", letra.toUpperCase());
        palavraAdivinharConteudo.appendChild(span);
    });

    btnMostrarDica.dataset.dica = dica;
    palavraCorreta = palavra;
}

function mostrarDica() {
    dicaConteudo.textContent = `${btnMostrarDica.dataset.dica}`;
    dicaConteudo.style.display = "block";
}

function respostaErrada() {
    indiceImagem++;
    imagem.src = `img/img${indiceImagem}.png`;

    if (indiceImagem === 7) {
        setTimeout(() => {
            somErro.play();
            document.getElementById('mensagemFeedback').textContent = `Incorreto! A palavra certa era ${palavraCorreta}`;
            document.getElementById('mensagemFeedback').style.color = "#FF0000";
            setTimeout(() => {
                document.getElementById('mensagemFeedback').textContent = '';
                novaRodada();
            }, 4500);
        }, 100);
    }
}

function verificarLetra(letra, btn) {
    const arr = document.querySelectorAll(`[palavra="${letra}"]`);

    if (!arr.length) {
        respostaErrada();
        btn.classList.add("errado");
    } else {
        btn.classList.add("correto");
    }

    arr.forEach((e) => {
        e.textContent = letra;
    });

    const spans = document.querySelectorAll(`.palavra-adivinhar span`);
    const venceu = !Array.from(spans).find((span) => span.textContent === "_");

    if (venceu) {
        somAcerto.play();
        iniciarConfetes();
        document.getElementById('mensagemFeedback').textContent = `Correto! A palavra era ${palavraCorreta}`;
        document.getElementById('mensagemFeedback').style.color = "#32cd32";
        setTimeout(() => {
            document.getElementById('mensagemFeedback').textContent = '';
            novaRodada();
        }, 4000);
    }
}

function gerarBotoes() {
    botoesAlfabeto.textContent = "";

    const letrasLinha1 = "ABCDEFGHIJKLM".split("");
    const letrasLinha2 = "NOPQRSTUVWXYZ".split("");

    const criarBotoes = (letras) => {
        letras.forEach((letra) => {
            const btn = document.createElement("button");
            btn.textContent = letra;
            btn.onclick = () => {
                btn.disabled = true;
                verificarLetra(letra, btn);
            };
            botoesAlfabeto.appendChild(btn);
        });
    };

    criarBotoes(letrasLinha1);
    const br = document.createElement("br");
    botoesAlfabeto.appendChild(br);
    criarBotoes(letrasLinha2);
}

function iniciarConfetes() {
    var duration = 15 * 210;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            clearInterval(interval);
        }
        var particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
    }, 250);
}