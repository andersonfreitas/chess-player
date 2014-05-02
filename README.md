# Requisitos do EP

    10 [X] Peças em OBJ carregadas corretamente
    10 [X] PGN carregado e interpretado corretamente
     5 [X] Tabuleiro exibido corretamente (espessura, cores e quadrados)
    10 [X] Peças instanciadas e posicionadas (inicialmente) corretamente
     5 [X] Perspectiva e viewport atualizados ao redimensionar a janela
    10 [X] Troca de Projeções oferecida e executada corretamente
     5 [X] Cena centralizada no viewport
    10 [ ] Movimentação da câmera executado corretamente
     7 [X] Movimentação das peças gradual e correta.
     5 [X] Peças desaparecem corretamente
     5 [ ] Zoom In/Out executado corretamente
     5 [X] Pausar/Continuar o jogo desenvolvido e executado corretamente
     5 [X] Reiniciar o jogo desenvolvido e executado corretamente
     3 [X] Arquivo LEIAME.TXT criado com conteúdo satisfatório e correto
     5 [X] Projeto entregue corretamente no PACA e compactado
    60 TOTAL

## Falta
     5 [.] Zoom In/Out executado corretamente
    10 [.] Movimentação da câmera executado corretamente

    [ ] Interpretar as jogadas com + e #, O-O e o-o-o

# Tarefas

    [X] Estrutura de classes básicas para o projeto
    [X] GUI para controlar a cena
    [X] Iluminação simples
    [ ] Implementar modelo Blinn-phong no vertex shader (smooth)
    [X] Desenhar um tabuleiro
        [ ] Mapear a textura em um cubo
        [ ] Desenhar base do tabuleiro com espessura
    [X] Ajustar orientação das peças (ex.: os cavalos devem se encarar!)
    [X] Cena sempre centralizada no viewport
    [X] Reajustes ao redimensionar a janela
    [ ] Trackball virtual
    [ ] Zoom
    [ ] Carregar PGN (http://en.wikipedia.org/wiki/Portable_Game_Notation)
        [ ] de forma com que todas as jogadas já estejam na memória
        [ ] botão next/prev. automatico.
    [X] Instanciar as peças de acordo com o setup inicial
    [X] Animar a movimentação das peças

## Compilação do .coffee

    coffee -w -c .

    https://github.com/FrenchYann/Chess3D/
    http://dl.dropboxusercontent.com/u/23551572/javascript/webGL/Chess3D/index.html

