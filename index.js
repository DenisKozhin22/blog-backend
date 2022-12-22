import express from 'express'
import fs from 'fs'
import multer from 'multer'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation } from './validation.js'
import checkAuth from './utils/checkAuth.js'
import { login, redister, getMe } from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import cors from 'cors'

mongoose
	.connect(process.env.MONGODB_URL)
	// .connect(
	// 	'mongodb+srv://admin:DK22092002@cluster0.td2fcmq.mongodb.net/blog?retryWrites=true&w=majority',
	// )
	.then(() => {
		console.log('DB OK')
	})
	.catch(err => {
		console.log('DB ERR', err)
	})

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.post('/auth/register', registerValidation, handleValidationErrors, redister)
app.get('/auth/me', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts-by-tag/:tag', PostController.getPostsByTag)
app.get('/posts-desc', PostController.getAllDesc)
app.get('/posts/tags', PostController.getLastTags)
app.get('/comments', PostController.getLastComments)
app.get('/posts/:id/comments', PostController.getPostComments)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update,
)
app.patch('/posts/:id/comments', checkAuth, handleValidationErrors, PostController.commentPost)

app.listen(process.env.PORT || 4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server OK')
})
