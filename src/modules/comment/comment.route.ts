import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleswares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    '/',
    auth(Role.ADMIN, Role.USER, Role.AUTHOR), 
    commentController.createComments
);

router.get(
    '/author/:authorId', 
    commentController.getCommentsByAuthor
);

// router.get(
//     '/:postId', 
//     // commentController.getCommentByPostId
// );

router.get(
    '/:postId',
    commentController.getCommentByPostId
);
router.patch(
    '/:commentId',
    auth(Role.ADMIN, Role.USER, Role.AUTHOR), 
    commentController.updateComment
)
router.delete(
    '/:commentId',
    auth(Role.ADMIN, Role.USER), 
    commentController.deleteComment
);

router.patch('/:commentId',auth(Role.ADMIN),commentController.moderateComment)


export const commentRoutes = router;