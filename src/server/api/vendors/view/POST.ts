import type { Request, Response } from 'express';
import { incrementVendorViews } from '../../../../lib/vendorStore.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { id } = req.body ?? {};
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing vendor id' });
    }

    const vendor = incrementVendorViews(id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record view', message: String(error) });
  }
}
