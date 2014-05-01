class Move
  constructor: (@piece = 'P', @color, @from, @to, @promotion, @result, @str) ->

window.Move = Move

class PgnParser

  constructor: (@file) ->

  parse: ->
    @moves = []
    moves = @file.match /(([a-h][1-8])([+#])?)-(([a-h][1-8])([+#])?)/g

    console.log moves

    _.each moves, (move) ->
      @moves.push new Move(from, to)


window.PgnParser = PgnParser
