import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import bcrypt from 'bcryptjs';
import { createDefaultEvaluationPrompts } from '../services/evaluationPromptService.js';

const { User, Company, MarketingUser } = db;

// Sign up function
export const signup = async (req, res) => {
  const { email, password, firstName, lastName, companyId } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      companyId: companyId || null,
    });

    const createdUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const signupCompany = async (req, res) => {
  let company = null;
  let isNewCompany = false;
  
  try {
    if (req.body.companyId) {
      company = await Company.findOne({
        where: { nationalId: req.body.companyId },
      });
      if (!company) {
        company = await Company.create({
          name: req.body.companyName,
          nationalId: req.body.companyId,
        });
        isNewCompany = true;
      }
    } else {
      company = await Company.create({
        name: req.body.firstName + ' ' + req.body.lastName,
        nationalId: req.body.email,
      });
      isNewCompany = true;
    }
    
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      companyId: company.id,
      membershipId: 1,
    });

    // Create default evaluation prompts for new companies
    if (isNewCompany) {
      try {
        await createDefaultEvaluationPrompts(company.id);
        console.log(`Created default evaluation prompts for new company: ${company.id}`);
      } catch (error) {
        console.error('Failed to create default evaluation prompts:', error);
        // Don't fail the signup process if evaluation prompts fail
      }
    }

    const createdUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1y',
    });

    res.status(201).json({createdUser, token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastLoginAt = new Date();

    await user.save();
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    console.log(user);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1y',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const registerEmail = async (req, res) => {
  const { email } = req.body;

  try {
    await MarketingUser.create({
      email,
    });

    res.status(201).json({ message: 'Email registered' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to register email' });
  }
}