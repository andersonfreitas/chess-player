class Move
  constructor: (@piece = 'P', @color, @from, @to, @promotion, @result, @str) ->

window.Move = Move

class PgnParser

  constructor: (@file) ->

  parse: ->
    @moves = []
    moves = @file.match /(([NBRQK])?([a-h]?[1-8]?)?x?([a-h][1-8])(=[NBRQK])?([+#])?)\-(([NBRQK])?([a-h]?[1-8]?)?x?([a-h][1-8])(=[NBRQK])?([+#])?)/g

    console.log moves

    _.each moves, (move) ->
      @moves.push new Move(from, to)


window.PgnParser = PgnParser
