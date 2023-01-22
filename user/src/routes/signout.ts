import express, { Request, Response } from 'express';

const router = express.Router();

// setting session property to null 
router.post('/api/users/signout', (req: Request, res: Response) => {
  req.session=null;
  res.status(200).send({message:'Signed out successfully'});
});

export { router as signoutRouter };
