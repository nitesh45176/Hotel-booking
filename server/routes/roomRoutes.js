import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { createRoom, getOwnerRooms, getRooms, toggleAvailability } from '../controllers/roomController.js';

const rooomRouter = express.Router();

rooomRouter.post('/', protect, upload.array("images", 4), createRoom);
rooomRouter.get('/', getRooms);
rooomRouter.get('/owner', protect, getOwnerRooms);
rooomRouter.post('/toggle-availability', protect, toggleAvailability);

export default rooomRouter;
