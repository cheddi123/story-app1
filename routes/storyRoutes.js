const express = require('express');
const router = express.Router();
const { ensureAuthenticated ,ensureGuest} = require('../validators/auth');
const Story = require('../models/StoryModel');
const Comment = require('../models/CommentModel');

//GET public stories
router.get('/', (req, res) => {
	Story.find({ status: 'public' })
	     .sort({ storyDate: -1 })
		 .populate('user')
		.then(stories => {
			res.render('story/viewStory', { stories });
		});
});

//Show A Single Story

router.get('/show/:id', (req, res) => {
	Story.findById(req.params.id)
		.populate('user')
		.populate('comments')
		.then(story => {
		
			res.render('story/singleStory', { story });
		})
		.catch(err => {
			
			res.redirect("/login");
		});
});

// GET A story FORM
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('story/addStory');
});

// Edit A story
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Story.findById(req.params.id).then(story => {
		res.render('story/editStory', { story });
	});
});

// Update a Story Form
router.put('/:id',ensureAuthenticated,  (req, res) => {
	Story.findById(req.params.id, (err, story) => {
		if (err) {
			return console.log(err);
		} else {
			if (req.body.allowComments) {
				req.body.allowComments = true;
			} else {
				req.body.allowComments = false;
			}

			(story.title = req.body.title),
				(story.storybody = req.body.storybody),
				(story.status = req.body.status),
				(story.allowComments = req.body.allowComments),
				story.save().then(story => {
					req.flash("success", "Successfully Updated story")
					res.redirect(`/dashboard`);
				});
		}
	});
});

// DELETE a story

router.delete('/:id',ensureAuthenticated, (req, res) => {
	Story.findByIdAndDelete(req.params.id, err => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/dashboard');
		}
	});
});

// DELETE A COMMENT
router.delete('/:id/comment/:comment_id',ensureAuthenticated, (req, res) => {
	Story.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.comment_id } }, (err, story) => {
		if (err) {
			res.status(500).send('Internal Error');
		} else {
			Comment.findByIdAndDelete(req.params.comment_id, err => {
				if (err) {
					return res.redirect('back');
				} else {
					return res.redirect('/stories/show/' + req.params.id);
				}
			});
		}
	});
});

// POST A comment
router.post('/comment/:id',ensureAuthenticated, (req, res) => {
	Story.findById(req.params.id, (err, story) => {
		if (err) {
			console.log(err);
			res.redirect('/stories');
		} else {
			Comment.create(req.body, (err, newComment) => {
				newComment.id = req.user.id;
				newComment.username = req.user.google.firstname || req.user.local.firstname;

				// save the comment
				newComment.save();
				story.comments.unshift(newComment);
				story.save();
				res.redirect(`/stories/show/${story.id}`);
			});
		}
	}).then(story => {});
});

// POST a story
router.post('/', ensureAuthenticated, (req, res) => {
	if (req.body.allowComments) {
		req.body.allowComments = true;
	} else {
		req.body.allowComments = false;
	}
	const newStory = {
		title: req.body.title,
		storybody: req.body.storybody,
		status: req.body.status,
		allowComments: req.body.allowComments,
		user: req.user.id,
	};

	new Story(newStory).save().then(story => {
		res.redirect('/dashboard');
	});
});

// List ALL PUBLCI Stories from a User
router.get('/user/:user_id', (req, res) => {
	Story.find({ user: req.params.user_id, status: 'public' })
		.populate('user')
		.then(stories => {
			res.render('story/viewStory', { stories });
		})
		.catch(err => {
			res.send('NO PUBLIC STORIES FROM YOU');
		});
});

module.exports = router;
