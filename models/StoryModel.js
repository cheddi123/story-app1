const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
	title: { type: String, required: true },
	storybody: { type: String, required: true },
	status: { type: String, default: 'public' },
	allowComments: { type: Boolean,default:true},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'comment',
		}
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},

	storyDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('story', StorySchema,"stories");


