const dummy = (blogs) => {
    return 1
}   

const totalLikes = (blogs) => {

    if(blogs.length === 0) return 0

    return blogs.reduce((prev, cur) => {
        return prev + cur.likes
    }, 0)
}

const favoriteBlog = (blogs) => {

    if(blogs.length === 0) return null

    const res = blogs.reduce((prev, cur) => {

        if(cur.likes > prev.likes) {
            return cur
        } else {
            return prev
        }
    }, {likes: 0})

    return {
        author: res.author,
        title: res.title,
        likes: res.likes
    }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) return null

    // returns the autor who has the largest amout of blogs + blogs num
    const authors = blogs.map(blog => {
        return {author: blog.author}
    })

    const res = {}

    for(const author of authors) {
        if(!res[author.author]) {
            res[author.author] = 1
        } else {
            res[author.author] = res[author.author] + 1
        }

    }

    let mostBlogs = 0
    let authorMostBlogs = {}

    for (const [key, value] of Object.entries(res)) {
        if(value > mostBlogs) {
            mostBlogs = value
            authorMostBlogs = {author: key, blogs: value}
        } 
      }

    return authorMostBlogs
   

}

const mostLikes = (blogs) => {
    if(blogs.length === 0) return null
    const res = {}
   
    for(const blog of blogs) {
        if(!res[blog.author]) {
            res[blog.author] = blog.likes
        } else {
            res[blog.author] = res[blog.author] + blog.likes
        }
    }

    let mostLikes = 0
    let authorMostLikes = {}

    for (const [key, value] of Object.entries(res)) {
        if(value > mostLikes) {
            mostLikes = value
            authorMostLikes = {author: key, likes: value}
        } 
      }


    return authorMostLikes

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}