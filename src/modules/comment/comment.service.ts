import { prisma } from "../../lib/prisma"
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface"

const createComments = async (authorId: string, paylaod: ICreateCommentPayload) => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {

            await tx.post.findUniqueOrThrow({
                where: {
                    id: paylaod.postId
                }
            });

            const comment = await tx.comment.create({
                data: { ...paylaod, authorId }
            })
            return comment
        }
    )
    return transactionResult;
};


const getCommentsByAuthor = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            },
            // user:true
        }
    })
    return comments
}
const getCommentByPostId = async (postId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            postId
        },
        // orderBy: { createdAt: "desc" },
        // include: {
        //     post: {
        //         select: {
        //             id: true,
        //             title: true
        //         }
        //     },
        // user:true
        // }
    })
    return comments
}
const updateComment = async (
    commentId: string,
    data: IUpdateCommentPayload,
    authorId: string) => {


        // await Promise.all[]
const comment = await prisma.$transaction(
    async(tx)=>{
        await tx.comment.findUniqueOrThrow({
    where:{
        id:commentId,
        authorId
    }

    }
);

const comment = await tx.comment.update({
    where:{
        id:commentId,
        authorId
    },
    data
})

return comment

})


return comment

}
const deleteComment = async () => { }
const moderateComment = async () => { }




export const commentService = {
    getCommentsByAuthor,
    getCommentByPostId,
    createComments,
    updateComment,
    deleteComment,
    moderateComment
}