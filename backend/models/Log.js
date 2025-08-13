import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_login',
      'user_logout',
      'user_created',
      'user_updated',
      'user_deleted',
      'content_created',
      'content_updated',
      'content_deleted',
      'role_changed',
      'logs_viewed',
      'content_list_viewed',
      'user_list_viewed'
    ]
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
logSchema.index({ createdAt: -1 });
logSchema.index({ actorId: 1, createdAt: -1 });
logSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('Log', logSchema);
