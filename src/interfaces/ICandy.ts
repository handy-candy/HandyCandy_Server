export interface ICandy {
  id: number;
  name: string;
  shopping_link: string;
  candy_image_url: string;
  reward_planned_at: Date;
  message: string;
  reward_completed_at: Date;
  user_id: number;
  category_id: number;
  created_at: Date;
}
