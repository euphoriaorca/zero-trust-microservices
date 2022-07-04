import { body } from 'express-validator';
import { Validator } from './Validator';
import { NotificationEventDto } from '../../interfaces';

export const validateEventReceive = () => {
  return Validator.validate([
    body('type', 'Provide a valid event type. See docs').custom((type: any) => type in NotificationEventDto.TypeEnum),
    body('userType', 'Provide a valid user type. See docs').optional().custom((type: any) => type in NotificationEventDto.UserTypeEnum),
  ]);
};
