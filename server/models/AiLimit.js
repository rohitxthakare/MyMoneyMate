import mongoose from 'mongoose';

const aiLimitSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
            unique: true,
        },

        limit: {
            type: Number,
            default: 0,
        }
    }
);

const AiLimit = mongoose.model('AiLimit', aiLimitSchema);

export default AiLimit;
