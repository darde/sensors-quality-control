export type ReadingProps = {
  device: string,
  timestamp: string,
  value: number
}

export type ReferenceProps = {
  temperature: number
  humidity: number
  monoxide: number
}

export type LogProps = {
  reference: ReferenceProps,
  readings: {
    temperature: ReadingProps[],
    humidity: ReadingProps[],
    monoxide: ReadingProps,
  }
}


