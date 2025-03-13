export interface Category {
  id: string
  label: string
}

export interface Article {
  id: number
  title: string
  description: string
  time: string
  imgSrc: string
  imgDescription: string
  category: string
}
