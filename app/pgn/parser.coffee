class PgnParser

  constructor: (@file) ->
    @cleanFile

  cleanFile: ->
    @file = @file
      .replace(/\{([^\}]*)\}/g, '') # removendo comentários
      .replace(/\[([^\]]*)\]/g, '') # removendo comentários
      .replace(/\(([^\)]*)\)/g, '') # removendo metadata
      .replace(/\$\d+/g,'')
      .replace(/\d+\.{1,3}/g,'')    # removendo jogadas
      .replace(/\s+/g,' ')          # multiplos espaços
      .trim()
      .replace(/(0-1)$/g,'')        # resultado final
      .replace(/(1-0)$/g,'')        # resultado final
      .replace(/(1\/2-1\/2)$/g,'')  # resultado final
      .replace(/(\*)$/g,'')         # resultado final
      .trim()
      .split(' ')

  parse: ->
    moves = {}



window.PgnParser = PgnParser
