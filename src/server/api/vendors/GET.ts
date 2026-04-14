import type { Request, Response } from 'express';
import { getVendors, incrementVendorViews } from '../../../lib/vendorStore.js';

export default async function handler(req: Request, res: Response) {
  try {
    const viewId = (req.query?.viewId as string | undefined) ?? undefined;
    if (typeof viewId === 'string' && viewId.trim()) {
      incrementVendorViews(viewId.trim());
    }
    const vendors = getVendors();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors', message: String(error) });
  }
}
