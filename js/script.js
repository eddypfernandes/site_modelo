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
/**/
// ===============================
// FADE IN / FADE OUT GERAL
// ===============================

// Função para adicionar fade in na abertura da página
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = 0;
    document.body.style.transition = "opacity 0.8s ease-in-out";
    requestAnimationFrame(() => {
        document.body.style.opacity = 1;
    });
});

// Função para adicionar fade out antes de sair da página
function fadeOutAndRedirect(url) {
    document.body.style.opacity = 0;
    setTimeout(() => {
        if(url) {
            window.location.href = url; // redireciona para o link
        }
    }, 800); // duração do fade out
}

// Adiciona evento de clique em todos os links internos
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        if(href && !href.startsWith("#")) { // ignora âncoras
            e.preventDefault();
            fadeOutAndRedirect(href);
        }
    });
});

// Evento de unload / sair da página (opcional)
window.addEventListener("beforeunload", (e) => {
    document.body.style.opacity = 0;
});


/**/
/*==================================
PORTFOLIO CAROUSEL
==================================*/
document.addEventListener("DOMContentLoaded", () => {

    const carousel = document.querySelector("#portfolioCarousel");
    if (!carousel) return;

    const inner = carousel.querySelector(".carousel-inner");
    const indicators = carousel.querySelector(".carousel-indicators");

    const MAX_BUTTONS = 5;

    let slides = Array.from(inner.querySelectorAll(".carousel-item"));

    // Ordem inversa: mais recentes primeiro
    slides.reverse();

    const recentes = slides.slice(0, MAX_BUTTONS);
    const extras = slides.slice(MAX_BUTTONS);

    // Limpa carousel principal
    inner.innerHTML = "";
    indicators.innerHTML = "";

    // Insere slides recentes
    recentes.forEach((slide, idx) => {
        slide.classList.remove("active");
        if (idx === 0) slide.classList.add("active");
        inner.appendChild(slide);
    });

    // Cria indicadores
    recentes.forEach((_, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.bsTarget = "#portfolioCarousel";
        btn.dataset.bsSlideTo = idx;
        if (idx === 0) btn.classList.add("active");
        indicators.appendChild(btn);
    });

    /*==================================
    MODAL + CAROUSEL EXTRAS (CRIADO UMA VEZ)
    ==================================*/
    let extrasModal = null;
    let extrasCarouselInstance = null;

    if (extras.length > 0) {

        // Botão "+"
        const plusButton = document.createElement("button");
        plusButton.type = "button";
        plusButton.textContent = "+";
        plusButton.classList.add("btn-extras", "ms-2");
        indicators.appendChild(plusButton);

        // Cria modal uma única vez
        extrasModal = document.createElement("div");
        extrasModal.className = "modal fade";
        extrasModal.tabIndex = -1;

        extrasModal.innerHTML = `
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content bg-dark text-white p-3">
                    <div class="modal-header">
                        <h6 class="modal-title text-uppercase">Outros projetos (${extras.length})</h6>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="carouselExtras" class="carousel slide">
                            <div class="carousel-inner"></div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExtras" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExtras" data-bs-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(extrasModal);

        // Insere slides extras (clonados)
        const innerExtras = extrasModal.querySelector(".carousel-inner");

        extras.forEach((slide, idx) => {
            const clone = slide.cloneNode(true);
            clone.classList.toggle("active", idx === 0);
            innerExtras.appendChild(clone);
        });

        // Inicializa carousel dos extras UMA VEZ
        extrasCarouselInstance = new bootstrap.Carousel(
    extrasModal.querySelector("#carouselExtras"),
    {
        interval: 4000,
        ride: "carousel",
        touch: true,
        keyboard: true
    }
);

        // Clique no "+"
        plusButton.addEventListener("click", () => {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(extrasModal);
            extrasCarouselInstance.to(0);
            modalInstance.show();
        });
    }

    // Atualiza indicador ativo no carousel principal
    carousel.addEventListener("slide.bs.carousel", e => {
        const buttons = indicators.querySelectorAll("button:not(.btn-extras)");
        buttons.forEach(btn => btn.classList.remove("active"));
        if (buttons[e.to]) buttons[e.to].classList.add("active");
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

