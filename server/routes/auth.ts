import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../db.ts';
import type { UserRecord } from '../db.ts';
import {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  setAuthCookie,
  verifyAuthToken,
} from '../auth.ts';
import { validatePasswordStrength } from '../utils/helpers.ts';

const router = Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toPublicUser(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photoUrl: user.photoUrl,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}

router.get('/me', (req, res) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  const decoded = token ? verifyAuthToken(token) : null;
  if (!decoded) {
    res.json({ user: null });
    return;
  }

  const user = db
    .prepare('SELECT id, name, email, photoUrl, provider, createdAt FROM users WHERE email = ?')
    .get(decoded.email) as Omit<UserRecord, 'passwordHash'> | undefined;

  res.json({ user: user ?? null });
});

router.post('/register', (req, res) => {
  const { name, email, photoUrl, password } = req.body ?? {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanPhoto = typeof photoUrl === 'string' ? photoUrl.trim() : '';

  if (cleanName.length < 2) {
    res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
    return;
  }
  if (!EMAIL_PATTERN.test(cleanEmail)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  const passwordIssue = validatePasswordStrength(password);
  if (passwordIssue) {
    res.status(400).json({ error: passwordIssue });
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    return;
  }

  const id = `usr_${crypto.randomUUID().slice(0, 12)}`;
  const passwordHash = bcrypt.hashSync(password, 10);
  const createdAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO users (id, name, email, passwordHash, photoUrl, provider, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, cleanName, cleanEmail, passwordHash, cleanPhoto, 'credentials', createdAt);

  res.status(201).json({
    message: 'Account created successfully. Please log in with your credentials.',
    user: { id, name: cleanName, email: cleanEmail, photoUrl: cleanPhoto },
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!cleanEmail || typeof password !== 'string' || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as
    | UserRecord
    | undefined;

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    return;
  }

  setAuthCookie(res, req, {
    id: user.id,
    email: user.email,
    name: user.name,
    photoUrl: user.photoUrl,
  });

  res.json({ user: toPublicUser(user) });
});

router.post('/google', (req, res) => {
  const { email, name, photoUrl } = req.body ?? {};
  const cleanEmail =
    typeof email === 'string' && email.trim()
      ? email.trim().toLowerCase()
      : 'alex@studiospace.io';
  const cleanName = typeof name === 'string' && name.trim() ? name.trim() : 'Alex Mercer';
  const cleanPhoto = typeof photoUrl === 'string' ? photoUrl.trim() : '';

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as
    | UserRecord
    | undefined;

  if (!user) {
    const id = `usr_google_${crypto.randomUUID().slice(0, 10)}`;
    const createdAt = new Date().toISOString();
    const randomHash = bcrypt.hashSync(crypto.randomBytes(24).toString('hex'), 10);

    db.prepare(
      `INSERT INTO users (id, name, email, passwordHash, photoUrl, provider, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, cleanName, cleanEmail, randomHash, cleanPhoto, 'google', createdAt);

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRecord;
  }

  setAuthCookie(res, req, {
    id: user.id,
    email: user.email,
    name: user.name,
    photoUrl: user.photoUrl,
  });

  res.json({ user: toPublicUser(user) });
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res, req);
  res.json({ message: 'Signed out successfully.' });
});

export default router;
