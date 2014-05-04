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

      check = false
      if to.match(/\+/)
        check = true
        to = to.replace '+', ''

      mate = false
      if to.match(/\#/)
        mate = true
        to = to.replace '#', ''
      @moves.push { from: from, to: to, check: check, mate: mate }

window.PgnParser = PgnParser
