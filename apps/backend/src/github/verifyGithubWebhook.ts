import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const verifyGithubWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;

    if (!signature) {
      return res.status(401).send('Unauthorized, missing signature');
    }

    // Calculate the expected signature using GitHub Webhook Secret and Request body
    const hmac = crypto.createHmac(
      'sha256',
      process.env.GITHUB_WEBHOOK_SECRET!
    );
    const digest =
      'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    // Securely compare the strings to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );

    if (!isValid) {
      return res.status(401).send('Unauthorized, invalid signature');
    }

    console.log('Webhook verified');
    next();
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
};
