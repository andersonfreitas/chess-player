class PgnParser

  # detectando a forma mais completa do h-LAN
  OPERATOR = ///
    (
      # origem
      ([NBRQK])?        # nomes de peças válidas
      ([a-h]?[1-8]?)?   # coordenadas no tabuleiro
      x?                # peça capturada
      ([a-h][1-8])      # coordenadas no tabuleiro
      (=[NBRQK])?
      ([+#])?
    )
    \-
      # destino
      ([NBRQK])?        # nomes de peças válidas
      ([a-h]?[1-8]?)?   # coordenadas no tabuleiro
      x?                # peça capturada
      ([a-h][1-8])      # coordenadas no tabuleiro
      (=[NBRQK])?
      ([+#])?
    ///g

  constructor: (@file) ->
    @moves = []

  parse: ->
    moves = @file.match OPERATOR

    _.each moves, (move) =>
      [from, to] = move.split('-')
      @moves.push { from: from, to: to }

    console.log @moves

window.PgnParser = PgnParser
