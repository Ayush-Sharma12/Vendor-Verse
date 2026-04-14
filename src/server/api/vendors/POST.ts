import type { Request, Response } from 'express';
import { addVendor } from '../../../lib/vendorStore.js';

export default async function handler(req: Request, res: Response) {
  try {
    const {
      vendor_name, what_they_sell, location, hours, category,
      upi_id, whatsapp_number, registered_by, photo_url,
    } = req.body;

    if (!vendor_name || !what_they_sell || !location || !hours || !category || !registered_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const vendor = addVendor({
      vendor_name, what_they_sell, location, hours, category,
      upi_id, whatsapp_number, registered_by,
      ...(photo_url ? { photo_url } : {}),
    });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add vendor', message: String(error) });
  }
}
