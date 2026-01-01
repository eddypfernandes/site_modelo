/*==================================

CAROUSEL HOME (blocos de informação)

==================================*/
document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll(".block"); // Seleciona todos os blocos do carousel
    const dots = document.querySelectorAll(".dot-nav"); // Seleciona todos os dots de navegação
    let index = 0;                                     // Índice do bloco ativo
    let timer;                                         // Timer para autoloop

    // Função para mostrar um bloco específico
    function showBlock(i, direction = null) {
        // Limpa timer anterior
        if (timer) clearTimeout(timer);

        // Esconde todos os blocos e remove classes de animação
        blocks.forEach(b => {
            b.style.display = "none";
            b.classList.remove("fade-in", "fade-out", "slide-in-left", "slide-in-right");
        });

        const current = blocks[i];
        current.style.display = "block";

        if (direction) {
            // Slide in se foi clique manual
            current.classList.add(direction === "right" ? "slide-in-right" : "slide-in-left");
        } else {
            // Fade in para autoloop
            current.classList.add("fade-in");
        }

        // Atualiza dots
        dots.forEach(d => d.classList.remove("active"));
        dots[i].classList.add("active");

        // Próximo bloco automático com fade out
        timer = setTimeout(() => {
            // Fade out antes de passar para o próximo
            current.classList.remove("fade-in"); // Efeito de entrada
            current.classList.add("fade-out"); // Efeito de saída

            timer = setTimeout(() => {
                index = (i + 1) % blocks.length; // Próximo bloco
                showBlock(index);               // Chama recursivamente
            }, 2000); // duração do fade out (2s)
        }, 8000); // duração de leitura do bloco (8s)
    }

    // Inicializa o carousel
    showBlock(index);

    // Eventos de clique nos dots
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const clickedIndex = parseInt(dot.dataset.index);
            if (clickedIndex === index) return; // se clicar no mesmo dot, ignora

            const direction = clickedIndex > index ? "right" : "left";
            index = clickedIndex;             // atualiza índice para autoloop
            showBlock(index, direction);      // exibe o bloco com slide in
        });
    });
});
/*=============

BOTÃO 'VOLTAR AO TOPO'

===============*/
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  // GARANTE estado inicial
  btn.classList.remove("show");

  function toggleButton() {
    if (window.scrollY > 200) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }

  // Avalia ao carregar
  toggleButton();

  // Avalia ao rolar
  window.addEventListener("scroll", toggleButton, { passive: true });

  // Clique suave
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/*=============

BOTÃO 'VOLTAR AO TOPO'

===============*/
document.addEventListener('DOMContentLoaded', function () {

    const trilho = document.querySelector('.portfolio-slides');
    const slides = document.querySelectorAll('.portfolio-slide');
    const dots   = document.querySelectorAll('.portfolio-nav button');

    let indiceAtual = 0;
    let totalSlides = slides.length;
    let intervalo;

    function mostrarSlide(indice) {
        trilho.style.transform = `translateX(-${indice * 100}%)`;

        dots.forEach(btn => btn.classList.remove('ativo'));
        if (dots[indice]) dots[indice].classList.add('ativo');

        indiceAtual = indice;
    }

    function proximoSlide() {
        let proximo = indiceAtual + 1;
        if (proximo >= totalSlides) proximo = 0;
        mostrarSlide(proximo);
    }

    function iniciarAutoplay() {
        intervalo = setInterval(proximoSlide, 5000);
    }

    function pararAutoplay() {
        clearInterval(intervalo);
    }

    dots.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            pararAutoplay();
            mostrarSlide(index);
            iniciarAutoplay();
        });
    });

    mostrarSlide(0);
    iniciarAutoplay();
});