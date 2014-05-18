# MAC5744 / 2014
## EP1

**Importante:** dadas as atuais restrições de segurança dos navegadores, muitas vezes arquivos externos carregados via `XMLHttpRequest` não funcionam. Portanto, a aplicação pode ser visualizada sem problemas no link abaixo:

[http://andersonfreitas.s3-website-sa-east-1.amazonaws.com/MAC5744/chess-player/](http://andersonfreitas.s3-website-sa-east-1.amazonaws.com/MAC5744/chess-player/)

## Autores

 - Anderson Meirelles Freitas
 - Lucy Mansilla

## Instruções de uso

Ao abrir o jogo, imediatamente é carregado um arquivo PGN exemplo.

Utilize o mouse para controlar a rotação da cena. Com o botão direito é possível controlar o zoom.

No canto inferior esquerdo há um "log" com as movimentações feitas de acordo com o arquivo PGN.

No canto superior direito existem algumas opções que alteram o estado do jogo, são elas:

- **Game:**
    - **pgn:** Opção para carregar um arquivo PGN no formato "hyphenated long algebraic notation"
    - **reload:** Reposiciona as peças e reinicia as jogadas do arquivo PGN carregado.
    - **autoplay:** Habilita a animação das jogadas automaticamente
    - **next:** Caso o autoplay esteja desabilitado, é possível ir passo-a-passo nas jogadas com essa função
- **Scene:**
    - **projection:** Alterna entre a projeção perspectiva e orthográfica
    - **wireframe:** Alterna entre triangulos e linhas
    - **lightning:** Ativa/desativa a iluminação nos shaders
    - **diffuseLight:** Cor da luz diffusa incidente na cena
    - **zoom:** Fator que reposiciona o parametro `eye` na função `lookAt`
- **Animation:**
    - **duration:** Tempo (em ms) em que deve ocorrer a interpolação da movimentação
    - **delay:** Quando o `autoplay` está ativado, é o intervalo entre uma movimentação e outra

## Sobre o desenvolvimento

A aplicação foi dividida em diversas classes JavaScript (OOP). A classe `BaseObject` representa qualquer objeto renderizável, e na classe principal da aplicação `ChessPlayer` é mantido um simples *object graph* onde chamamos o método `render()` de cada objeto instanciado.

A animação da movimentação das peças é feita usando uma curva quadrática, onde os parametros $x$, $y$ e $z$ são interpolados com a função `lerp()`:

$$lerp(a, b, t) = a + t(b - a)$$

### Estrutura do projeto

Abaixo a árvore da pasta principal gerada com o comando `tree`:

    ├── README.md                      # este arquivo
    ├── app                            # pasta principal com os objetos da applicação
    │   ├── BaseObject.js
    │   ├── Board.js                   # tabuleiro
    │   ├── BoardCube.js               # base do tabuleiro
    │   ├── ChessPiece.js              # representa uma peça no tabuleiro. Responsável por carregar o arquivo OBJ correspondente.
    │   ├── GameState.js               # mantém o estado do jogo carregado do PGN
    │   ├── TrackBall.js               # movimentação da câmera
    │   └── pgn                        # parser de PGN
    │       ├── parser.coffee          # código fonte do parser em CoffeeScript
    │       └── parser.js              # arquivo .js compilado via 'coffee -w -c .'
    ├── app.js
    ├── assets                         # arquivos carregados pela aplicação
    │   ├── app.css
    │   ├── images
    │   ├── obj                        # arquivos OBJ
    │   │   ├── bispo.obj
    │   │   ├── cavalo.obj
    │   │   ├── cube.obj
    │   │   ├── peao.obj
    │   │   ├── rainha.obj
    │   │   ├── rei.obj
    │   │   └── torre.obj
    │   ├── pgn                        # arquivos PGN de exemplo
    │   │   ├── MacKenzie-hlan.pgn
    │   │   ├── MacKenzie.pgn
    │   │   ├── ep1.pgn
    │   │   └── london.pgn
    │   └── shaders                    # shaders da aplicação
    │       ├── shader.fsh
    │       └── shader.vsh
    ├── chess-player.js                # classe principal
    ├── index.html
    ├── js                             # bibliotecas externas
    │   ├── coffee-script.js
    │   ├── dat.gui.min.js
    │   ├── gl-matrix-min.js
    │   ├── jquery-1.11.0.min.js
    │   ├── jquery-1.11.0.min.map
    │   ├── requestAnimationFrame.js
    │   ├── stats.min.js
    │   ├── underscore-min.js
    │   └── underscore-min.map
    ├── utils.js                       # classe com utilitários
    └── webgl.js                       # classe para iniciar o WebGL


## Bibliotecas externas

 - **[dat-gui](http://code.google.com/p/dat-gui/)**
Usado para criar os controles interativos da aplicação.
 - **[glMatrix](http://glmatrix.net)**
Biblioteca com operações para se trabalhar com matrizes, vetores e quaternions.
 - **[jQuery](http://jquery.com)**
Utilitário para acessar o DOM do HTML. Usado para criar o console das jogadas do PGN.
 - **[requestAnimationFrame](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)**
Polyfill para que a função `requestAnimationFrame` funcione em diversos browsers.
 - **[stats.js](https://github.com/mrdoob/stats.js)**
Métricas de desempenho da renderização (em fps/ms/Hz).
 - **[underscore.js](http://underscorejs.org)**
Provem diversos helpers para a linguagem javascript inspirado de linguagens funcionais. Traz funções como `map`, `reduce`, `each`, etc.

## Requisitos do EP

    10 [X] Peças em OBJ carregadas corretamente
    10 [X] PGN carregado e interpretado corretamente
     5 [X] Tabuleiro exibido corretamente (espessura, cores e quadrados)
    10 [X] Peças instanciadas e posicionadas (inicialmente) corretamente
     5 [X] Perspectiva e viewport atualizados ao redimensionar a janela
    10 [X] Troca de Projeções oferecida e executada corretamente
     5 [X] Cena centralizada no viewport
    10 [X] Movimentação da câmera executado corretamente
     7 [X] Movimentação das peças gradual e correta.
     5 [X] Peças desaparecem corretamente
     5 [X] Zoom In/Out executado corretamente
     5 [X] Pausar/Continuar o jogo desenvolvido e executado corretamente
     5 [X] Reiniciar o jogo desenvolvido e executado corretamente
     3 [X] Arquivo LEIAME.TXT criado com conteúdo satisfatório e correto
     5 [X] Projeto entregue corretamente no PACA e compactado

### Limitações

 - O arquivo PGN pode conter vários jogos. Por enquanto apenas o primeiro é considerado.

### Tasks

- [ ] a bigger project
  - [ ] first subtask #1234
  - [ ] follow up subtask #4321
  - [ ] final subtask cc @mention
- [ ] a separate task
