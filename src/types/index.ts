
export interface Product {
  added: string
  normal: string
  percent: string
  sale: boolean
  store: string
  title: string
  link: string
}


export interface ProductCategory {
  products: Product[]
}

export const createProductCategory = (): ProductCategory => ({
  products: []
})
