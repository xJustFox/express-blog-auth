const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
let posts = require('../db/postsDB.json');
const { writeJSON } = require('../utils.js');

const updatePosts = (newPosts) => {
    writeJSON('postsDB', newPosts);
    posts = newPosts;
};

const deleteFile = (fileName) => {
    const filePath = path.join(__dirname, '../public', fileName);
    fs.unlinkSync(filePath);
};

const getSlug = (title) => {
    const baseSlug = slugify(title, {
        replacement: '-',
        lower: true,
        locale: 'it',
        trim: true
    });
    let slug = baseSlug;
    let counter = 1;


    while (posts.find(p => p.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug
}

//index controller for the route /posts
const index = (req, res) => {
    res.format({
        html: () => {
            let html = `<main>
                            <a href="/"><button>Back Home</button></a>`;
            posts.forEach(({ title, content, image, tags, slug }) => {
                html += `<article style="margin: 30px 0;">
                            <h1>${title}</h1>
                            <image style="width: 20%;" src="${image.filename ? image.filename : image}" alt="">
                            <ul style="display: flex; list-style: none outside none; margin: 0; padding: 0;">
                                ${tags.map(tag => `<li style="margin-right: 5px;">#${tag.toLowerCase().replaceAll(' ', '-')}</li>`).join(' ')}
                            </ul>
                            <p>${content}</p>
                            <a href="/posts/${slug}"><button>Show More</button></a>
                            <hr>
                        </article>`
            });

            res.send(html);
        },
        json: () => {
            res.json({
                data: posts,
                count: posts.length
            })
        }
    })
};

//show controller for the route /posts/:slug where :slug is a dynamic parameter passed throug the url
const show = (req, res) => {
    const foundPost = posts.find(post => post.slug === req.params.slug);
    if (foundPost) {
        foundPost.image_download_url = `${req.protocol}://${req.headers.host}/posts/${foundPost.slug}/download`;

        res.format({
            html: (req, res) => {
                const html = `<main>
                                    <a href="/posts"><button>Back Posts</button></a>
                                    <article style="margin: 30px 0;">
                                        <h1>${foundPost.title}</h1>
                                        <image style="width: 20%;" src="../${foundPost.image}" alt=""> <br>
                                        <ul style="display: flex; list-style: none outside none; margin: 0; padding: 0;">
                                            ${foundPost.tags.map(tag => `<li style="margin-right: 5px;">#${tag.toLowerCase().replaceAll(' ', '-')}</li>`).join('')}
                                        </ul>
                                        <p>${foundPost.content}</p>
                                        <a href="${foundPost.image_download_url}"><button>Download Image</button></a>
                                        <hr>
                                    </article>
                                </main>`
                res.send(html)
            },
            json: () => {
                res.json(foundPost)
            },

            default: () => {
                res.status(406).send('Not Acceptable')
            }
        });
    } else {
        res.status(404).json({
            error: "Not Found",
            description: `Post whit slug: ${req.params.slug} not found`
        })
    }
};

//downloadImage to download the single post imag
const downloadImage = (req, res) => {
    const foundPost = posts.find(post => post.slug === req.params.slug)

    if (foundPost) {
        if (foundPost.image != "") {
            const filePath = path.join(__dirname, `../public/${foundPost.image}`)
            res.download(filePath);
        } else {
            res.status(404).json({
                error: "Not Found",
                description: `Image not found`
            })
        }
    } else {
        res.status(404).json({
            error: "Not Found",
            description: `Post whit slug: ${req.params.slug} not exist`
        })
    }
};

//store controller for create and add new posts
const store = (req, res) => {

    if ( req.is('multipart/form-data')) {
        const { title, content, tags } = req.body;
        const image = req.file;

        if (!title || !content || !tags || !image) {
            image?.filename && deleteFile(image.filename);
            res.status(400).send("Some data is missing.");
            return;
        } else if (!image || !image.mimetype.includes('image')) {
            image?.filename && deleteFile(image.filename);
            res.status(400).send('Image is missing or is not an image file.');
            return;
        }

        let newPost = { title, slug: getSlug(title), content, image, tags };

        updatePosts([...posts, newPost]);

        res.format({
            html: () => {
                res.redirect('/posts');
            },
            json: () => {
                res.json({
                    data: newPost,
                    count: 1
                });
            },

            default: () => {
                res.status(415).send('Not Acceptable')
            }
        })

    } else {
        res.status(415).send('Content-Type Not Acceptable');
    }
};

//destroy controller for delete posts by slug
const destroy = (req, res) => {
    const post = posts.find(p => p.slug === req.params.slug);

    if (post.image.filename) deleteFile(post.image.filename);

    const newPosts = posts.filter(p => p.slug !== req.params.slug);

    updatePosts(newPosts);

    res.format({
        html: (req, res) => {
            res.redirect('/posts');
        },

        default: () => {
            res.status(200).send('post deleted');
        }
    });
};

module.exports = {
    index,
    show,
    downloadImage,
    store,
    destroy
}