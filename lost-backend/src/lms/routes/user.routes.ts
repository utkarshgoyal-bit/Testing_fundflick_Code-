import { Router } from 'express';
import { UserController } from '../controller/user.controller';
const postgresRouter = Router();

postgresRouter.get('/', UserController.getAllUsers);
postgresRouter.get('/:id', UserController.getUserById);
postgresRouter.post('/', UserController.createUser);
postgresRouter.put('/:id', UserController.updateUser);
postgresRouter.delete('/:id', UserController.deleteUser);

export default postgresRouter;
