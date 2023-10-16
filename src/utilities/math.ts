export const getMean = (elements: number[]): number => {
  const result = elements.reduce((sum, value) => sum + value) / elements.length

  return Number(result.toFixed(2))
}

export const getStandardDeviation = (elements: number[]): number => {
  const n = elements.length
  const mean = getMean(elements)

  const result = Math.sqrt(elements.map(x => Math.pow(x - mean, 2))
    .reduce((a, b) => a + b) / n)
  
  return Number(result.toFixed(2))
}