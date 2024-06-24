import { Request, Response } from 'express';
import { handleIdentifyRequest } from '../services/contactService';

export const identifyContact = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber } = req.body;
        const result = await handleIdentifyRequest(email, phoneNumber);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
