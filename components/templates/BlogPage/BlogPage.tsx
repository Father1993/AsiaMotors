import React from 'react'
import PostsPage from './PostsPage/PostsPage'

const BlogPage = () => {
    return (
        <div className="container">
            <h1 className="font-bold text-4xl mt-16">Блог</h1>
            <div>
                <PostsPage />
            </div>
        </div>
    )
}

export default BlogPage
