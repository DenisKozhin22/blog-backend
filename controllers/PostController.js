import PostModel from '../models/Post.js'

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					console.log(error)
					return res.status(500).json({
						message: 'Не удалось вернуть статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Статься не найдена',
					})
				}

				res.json(doc)
			},
		).populate('user')
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getPostComments = async (req, res) => {
	try {
		const postId = req.params.id

		const post = await PostModel.findOne({ _id: postId })

		res.json(post.comments)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить комментарии',
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user').exec()

		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статью',
		})
	}
}
export const getPostsByTag = async (req, res) => {
	try {
		const posts = await PostModel.find()
		const postsByTag = posts.filter(post => {
			if (post.tags.find(tag => tag === req.params.tag)) {
				return post
			}
		})
		res.json(postsByTag)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить стати по тегам',
		})
	}
}

export const getAllDesc = async (req, res) => {
	try {
		const posts = await PostModel.find().sort({ viewsCount: 'desc' })
		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(','),
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(error)
					return res.status(500).json({
						message: 'Не удалось удалить статью',
					})
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Статься не найдена',
					})
				}

				res.json({
					success: true,
				})
			},
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.body.user,
				tags: req.body.tags.split(','),
			},
		)

		res.json({
			success: true,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось изменить статью',
		})
	}
}
export const commentPost = async (req, res) => {
	try {
		const postId = req.params.id

		const postComments = await PostModel.findOne({ _id: postId })
		postComments.comments.push(req.body.comments)

		console.log(postComments)
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				comments: postComments.comments,
			},
		)
		// console.log(req.body.comments)
		res.json({
			comments: req.body.comments,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось добавить комментарий',
		})
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).sort({ createdAt: -1 }).exec()

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5)

		res.json(tags)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить теги',
		})
	}
}
export const getLastComments = async (req, res) => {
	try {
		const posts = await PostModel.find().sort({ date: -1 }).limit(5).exec()

		const comments = posts
			.map(obj => obj.comments)
			.flat()
			.slice(0, 5)

		res.json(comments)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить теги',
		})
	}
}
