import { Router } from 'express'
import { getSeasons } from '../src/controllers/seasonController.js'

const router = Router()

router.get('/seasons',getSeasons)

export default router

