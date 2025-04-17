// French stopwords (extended list with common agricultural and medical terms to exclude)
export default [
  // Common French stopwords
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 
  'donc', 'or', 'ni', 'car', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 
  'ils', 'elles', 'ce', 'cet', 'cette', 'ces', 'mon', 'ton', 'son', 
  'notre', 'votre', 'leur', 'en', 'dans', 'sur', 'sous', 'par', 'pour', 
  'avec', 'sans', 'vers', 'chez', 'depuis', 'pendant', 'avant', 'après', 
  'très', 'trop', 'assez', 'peu', 'plus', 'moins', 'si', 'aussi', 'alors', 
  'donc', 'cependant', 'néanmoins', 'malgré', 'quand', 'quant', 'comment', 
  'pourquoi', 'qui', 'que', 'quoi', 'dont', 'où',
  
  // Verbs and forms
  'est', 'sont', 'était', 'été', 'être', 'avoir', 'eu', 'faire', 'fait',
  'fais', 'font', 'dit', 'dire', 'suis', 'sera', 'serai', 'étant', 'soit',
  'peuvent', 'peut', 'peu', 'avait', 'avais', 'avons', 'avez', 'ont', 'ait',
  
  // Numbers and time-related
  'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'fois', 'jour', 'jours', 'mois', 'ans', 'année', 'années', 'temps', 'heure', 'heures',
  
  // Conjunctions and connections
  'comme', 'ainsi', 'afin', 'alors', 'au-delà', 'aussi', 'aussitôt', 'autant', 'car',
  'cela', 'ces', 'ceux', 'chaque', 'ci', 'ceci', 'cela', 'cependant', 'certain',
  'chacun', 'comme',
  
  // Articles, prepositions, and determiners
  'au', 'aux', 'cette', 'ce', 'celui', 'celle', 'celles', 'ceux', 'chaque', 'chez',
  
  // Words specific to our domain but that don't add meaning
  'quelque', 'quelques', 'souvent', 'parfois', 'jamais', 'toujours',
  'plus', 'moins', 'toute', 'tous', 'tout', 'toutes', 'plusieurs', 'autre', 'autres',
  'aucun', 'aucune', 'beaucoup',
  
  // Others
  'là', 'voilà', 'non', 'oui', 'pas', 'peu', 'plupart', 'presque', 'quand',
  'que', 'quel', 'quelle', 'quelles', 'quels', 'qui', 'quoi',
  'tant', 'tellement', 'tel', 'telle', 'tels', 'telles', 'tout', 'toute',
  'tous', 'toutes', 'très', 'trop', 'voire', 'vu'
];