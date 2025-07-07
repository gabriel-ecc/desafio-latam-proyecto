import getSeasonsModel from '../models/seasonsModel.js'

export const getSeasons = async (res) => {
  try {
    const seasons = await getSeasonsModel()
    res.status(200).json(seasons)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
