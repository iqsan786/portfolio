import { z } from 'zod';
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.string().trim().email('Please enter a valid email.').max(255),
  organization: z.string().trim().min(2, 'Please enter your organization.').max(150),
  audience: z.enum(['Enterprise', 'Startup Founder', 'Investor']),
  scope: z.string().min(1).max(100), budget: z.string().min(1).max(100),
  message: z.string().trim().min(20, 'Please add at least 20 characters of detail.').max(5000),
  website: z.string().max(0).optional(),
});