import { getCategoriesModel } from '../models/categoriesModel.js'

export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesModel()
    res.status(200).json(categories)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
