# module 20

Module Summary: 
1. Project Planning To Completion
2. Brainstrom, Requirement Analysis, ERD Design
3. Project Setup + Prisma And Db Comment
4. Prisma Schema & Model
5. Multi File Prisma Schema Technique
6. Prisma Migration & Client Generation
7. Server & App Setup, Demo API Check and DB Check
8. User Register Route / api / users / register
9. Route, Controller, Service, Brackdown
10. Controller Only Handler the request and response
11. Service Handles Core Business logice and Database communications and quries of CRUD
12. Try-catch block inside controller
13. Controller handles and catches the Errors with try catch block

14. Password hashing


# Module 21

1. Optimizing Route Controller Service Pattern
2. CatchAsync Function(try-catch block)
3. Higher order function
4. Cleaning the controller layer
5. Send Response Function
6. Completing Route Controller Service Pattern
7. Making rest of the apis using same pattern
8. Login Api Implemented
9. Password Hashing
10. User exist check & user status check
11. Login response access token and refresh token provided using JWT
12. Setting the access token and refresh token in the browser cookie
13. Get My profile or /me api implement
14. Getting access token from cookie and Vefifying the token with jwt and decode the token

15. Completing Get My Profile / me api
16. Auth MiddleWare to check Role Implemented 

17. Optimizing and cleaning the auth middleware with  exist check, getting token from cookie/ authorization as Bearer or just tokenuser

18. Implemented update user profile / my-profile api
19. auth middleware integrated with / myprofile api

# Module 22

1. Refresh Token -> new Access Token
2. Post and Comment model defne
3. Implement Post Apis
    createpost
    update
    delete, get all post, get single post
4. Completing all Post Rlated apis
5. Transaction And Rollback
6. Get post by id api => applied transaction
7. Get post stats -> post related numerical data for admin
8. Total views of all the post togeter
9. Prisma Aggregatin concept
10. _sum -> all post all views added
11. Promis.all() = > clean approch for writing queries

# Module 23
1. Comment Apis
2. Filtering, Searching, Pagination, Sorting
3. Data Finding Method -2 types
    -Exact Match = Filtering
    -eg: ? title = "Ronaldo"
    - Partial Match = Searching
    -?searching = "Ron"
    -title -> contents -> tags
4. Pagination ?page =1 & limit =10
    -limit = take
    -page = skip = (page-1) * limit
5. Sorting ? sortby = title & sortOrder = asc/desc
    sortBy & sortOrder = orderBy
    OrderBy => sortBy :sotOrder (asc/desc)
6. Response data & meta
    meta => page, limit, total, totalPages
7. Filtering, Searching, pagination sorting
    -hardcoded value
    -Dynamically From api request query => req.query/posts?title = "cron"
8. Middlewares
    not found Route
    Global error handler
        -error response from catchAsync
        -global error handler
9. Prisma Specific Errors Handle
    -5 types Error category from prisma
    -Error codes From prisma(P1000, P1001, P2025)
    -Combining Error categories & error codes from prisma to enhance global error handler



