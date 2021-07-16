import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { categoryDto, newCategoryDto, userDto } from '../dto/category.dto';
import { CategoryService } from '../services';



export const allCategory = async (req: Request, res: Response) => {
    const allCategory_dto: userDto = {
        user_id: req.body.user.id,
        };

        const result = await CategoryService.allCategory(allCategory_dto);

        res.status(200).json({ result: result });
};

export const deleteCategory = async (req: Request, res: Response) => {
    const deleteCategory_dto: categoryDto = {
        user_id: req.body.user.id,
        category_id: req.params.id,
    };  

    const result = await CategoryService.deleteCategory(deleteCategory_dto);
    
    res.status(200).json({ result: result });
};

export const addCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const addCategory_dto: newCategoryDto = {
        user_id: req.body.user.id,
        category_id: req.params.id,
        name: req.body.name,
        category_image_url: req.body.category_image_url
    };  
    const result = await CategoryService.addCategory(addCategory_dto);

    res.status(200).json({ result: result });
};

export const modifyCategory = async (req: Request, res: Response) => {
    const modifyCategory_dto: newCategoryDto = {
        user_id: req.body.user.id,
        category_id: req.params.id,
        name: req.body.name,
        category_image_url: req.body.category_image_url
    };  
    const result = await CategoryService.modifyCategory(modifyCategory_dto);

    res.status(200).json({ result: result });
};

export const detailCategory = async (req: Request, res: Response) => {
    const detailCategory_dto: categoryDto = {
        user_id: req.body.user.id,
        category_id: req.params.id,
      };
    
      const result = await CategoryService.detailCategory(detailCategory_dto);
    
      res.status(200).json({ result: result });
};
