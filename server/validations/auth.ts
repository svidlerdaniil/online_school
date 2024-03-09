import {ValidationChain, body} from "express-validator";

export const registerValidator: ValidationChain[] = [
    body('phoneNumber').isMobilePhone("ru-RU"),
    body('password').isLength({min: 3}),
    body('name').isLength({min: 3}),
    body('surname').optional().isLength({min: 3}),
    body('address').optional().isLength({min: 5}),
]
