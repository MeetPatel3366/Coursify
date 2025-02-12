import {Router} from "express";

const router=new Router();

router.get('/',getAllCourses);

router.get('/:id',getLecturesByCourseId);

export default router;