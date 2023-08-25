export interface Analytics {
  squealId: string; //id dello squeal
  // Date di raccolta statistiche (e.g. ogni 3 ore aggiungo la data in cui viene effettuata la raccolta statistiche)
  dates?: Date[];
  // numero di visualizzazione in una determinata data
  // visuals[0] sarà il numero di visualizzazione nella data dates[0]
  visuals?: number[];
  // numero di reazioni positive in una determinata data
  // positiveReactions[0] sarà il numero di reazioni positive nella data dates[0]
  positiveReactions?: number[];
  // numero di reazioni negative in una determinata data
  // negativeReactions[0] sarà il numero di reazioni negative nella data dates[0]
  negativeReactions?: number[];
  author: string; //id dell'autore dello squeal
}
