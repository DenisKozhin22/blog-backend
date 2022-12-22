import mongoose from 'mongoose'

const PostShema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
			unique: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			require: true,
		},
		comments: {
			type: Array,
			default: [],
		},
		// createdAt: {
		// 	type: Date,
		// 	$dateToString:   { format: "%Y-%m-%d", date: "$UserMessagePostDate" },
		// },
		imageUrl: String,
	},
	{
		timestamps: true,
	},
)
mongoose.set('strictQuery', true)
export default mongoose.model('Post', PostShema)
