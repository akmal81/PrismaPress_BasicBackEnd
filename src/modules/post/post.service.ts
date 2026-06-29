import { Result } from "pg"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostload } from "./post.interface"
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"

const createPostIntoDb = async (payload: ICreatePostPayload, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result
}




const getAllPostFromDb = async () => {
    const allPost = await prisma.post.findMany(
        {
            include: {
                author: {
                    omit: {
                        password: true
                    }
                },
                comments: true
            }
        }
    );
    return allPost
}


// promise .all 
const getPostStatsFromDb = async () => {


    const transactionResult = await prisma.$transaction(
        async (tx) => {
            const [
                totalpost,
                totalPublishPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalCount,
                totalApprovedComments,
                totalRejectComments,
                totalPostsViewsAgg
            ] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
                await tx.post.count({ where: { status: PostStatus.DRAFT } }),
                await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
                await tx.comment.count(),
                await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
                await tx.comment.count({ where: { status: CommentStatus.REJECT } }),
                await tx.post.aggregate({ _sum: { views: true } })

            ])
            return {
                totalpost,
                totalPublishPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalCount,
                totalApprovedComments,
                totalRejectComments,
                totalViews:totalPostsViewsAgg._sum.views
            }

        }
    )

    return transactionResult
}

/* const getPostStatsFromDb = async () => {
return transactionResult
}


const transactionResult = await prisma.$transaction(
    async (tx) => {
        const totalPosts = await tx.post.count();

        const totalPublishPosts = await tx.post.count({
            where: {
                status: PostStatus.PUBLISHED
            }
        })

        const totalDraftPosts = await tx.post.count({
            where: {
                status: PostStatus.DRAFT
            }
        })

        const totalArchivedPosts = await tx.post.count({
            where: {
                status: PostStatus.ARCHIVED
            }
        })

        const totalComments = await tx.comment.count()

        const totalApprovedComments = await tx.comment.count({
            where: {
                status: CommentStatus.APPROVED
            }
        })
        const totalRejectComments = await tx.comment.count({
            where: {
                status: CommentStatus.REJECT
            }
        })

        // Not good approach 
        // const allPost = await tx.post.findMany();
        // let totalPostViews = 0;

        // allPost.forEach((post)=>{
        //     totalPostViews = totalPostViews + post.views
        // })

        // good Approach

        const totalPostViewsAggregate = await tx.post.aggregate({
            _sum:{
                views:true
            }
        })
        const totalPostViews = totalPostViewsAggregate._sum.views
        return {
            totalPosts,
            totalPublishPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalComments,
            totalApprovedComments,
            totalRejectComments,
            totalPostViews,
            // totalPostViewsAggregate
        }
    }
)

return transactionResult
} */

// * start get my Post

const getMyPostsFromDb = async (authorId: string) => {

    const result = await prisma.post.findMany(
        {
            where: {
                authorId: authorId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                comments: true,
                author: {
                    omit: { password: true }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            },

        }
    )
    return result
}
// * End get my Post

// * start get  Post by id

// ? basic prisma query
/* const getPostByIdFromDb = async (postId: string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views: {
                increment: 1
            }
        },
        include: {
            author:{
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return updatedPost

} */

// ? get  Post by id basic prisma query use of transaction

const getPostByIdFromDb = async (postId: string) => {

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: true
                }
            })

            // throw new Error("Fake Error");


            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                }
            })
            return post
        }
    )
    return transactionResult
}







const updatePostIntoDb = async (postId: string, payload: IUpdatePostload, authorId: string, isAdmin: boolean) => {


    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post");

    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }

    })
    return result

}



const deletePostFromdb = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post");

    }

    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })

    return result

}



export const postService = {
    getAllPostFromDb,
    getPostStatsFromDb,
    getMyPostsFromDb,
    getPostByIdFromDb,
    createPostIntoDb,
    updatePostIntoDb,
    deletePostFromdb
}