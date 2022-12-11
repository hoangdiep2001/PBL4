const express = require('express')
const router = express.Router()
//const verifyToken = require('../middleware/auth')

const Post = require('../models/Post')

// @route GET api/posts
// @desc Get posts
// @access Private
router.get('/:id', async (req, res) => {
	try {
		const posts = await Post.find({ user: req.params.id })
		res.json(posts)
	} catch (error) {
		console.log(error) 
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
router.get('/Detail/:id', async (req, res) => {
	postUpdateCondition = { _id: req.params.id }
	try {
		const posts = await Post.findById(req.params.id )
		res.json(posts )
	} catch (error) {
		console.log(error) 
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
//const postUpdateCondition = { _id: req.params.id, user: req.userId }

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/:id', async (req, res) => {
	const { title, description, url, status } = req.body

	// Simple validation
	if (!title)
		return res
			.status(400)
			.json({ success: false, message: 'Title is required' })

	try {
		const newPost = new Post({
			title,
			description,
			url: url.startsWith('https://') ? url : `https://${url}`,
			status: status || 'TO LEARN',
			user: req.params.id
		})

		await newPost.save()

		res.json({ success: true, message: 'Happy learning!', post: newPost })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route PUT api/posts
// @desc Update post
// @access Private
router.put('/:userId/:id', async (req, res) => {
	const { title, description, url, status } = req.body

	// Simple validation
	if (!title)
		return res
			.status(400)
			.json({ success: false, message: 'Title is required' })

	try {
		let updatedPost = {
			title,
			description: description || '',
			url: (url.startsWith('https://') ? url : `https://${url}`) || '',
			status: status || 'TO LEARN'
		}

		const postUpdateCondition = { _id: req.params.id, user: req.params.userId }

		updatedPost = await Post.findOneAndUpdate(
			postUpdateCondition,
			updatedPost,
			{ new: true }
		)

		// User not authorised to update post or post not found
		if (!updatedPost)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({
			success: true,
			message: 'OK!',
			post: updatedPost
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:userId/:id', async (req, res) => {
	try {
		const postDeleteCondition = { _id: req.params.id, user: req.params.userId }
		const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

		// User not authorised or post not found
		if (!deletedPost)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({ success: true, post: deletedPost })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router
