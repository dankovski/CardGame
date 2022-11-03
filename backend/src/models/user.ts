import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { sendActivationLink } from '../services/mailSender.js';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value: string) {
      if (!value) {
        throw new Error('name can not be empty')
      }
      else if (value.length < 6) {
        throw new Error('username is too short')
      }
      else if (value.trim().includes(' ')) {
        throw new Error('username can not include spaces')
      }
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      var re = /\S+@\S+\.\S+/;
      if(!re.test(value)){
        throw new Error('invalid email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Banned'],
    default: 'Pending',
    required: true
  },
  activationCode: {
    type: String,
    unique: false,
    required: true
  },
  avatarUrl: {
    type: String
  },
  dateCreated: {
    type: Date
  },
  dateUpdated: {
    type: Date
  }
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.get('password'), 10);
    this.set('password', hash);
    this.set('dateCreated', new Date());
    this.set('dateUpdated', new Date())
    return next();
   } catch (error) {
     return next(error);
    }
  })
  
  userSchema.post('save', async function() {
    this.set('dateUpdated', new Date())
    sendActivationLink(this.get('email'), this.get('activationCode'),this.get('username'))
  })
  
  
  const User = mongoose.model('User', userSchema);


export default User;