/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const PostsController = () => import('#controllers/posts_controller')

// Pages
router.get('/', [PostsController, 'index'])
router.get('/write', [PostsController, 'write'])
router.get('/posts/:id', [PostsController, 'show'])

// API
router.post('/api/posts', [PostsController, 'store'])
router.get('/api/posts/search', [PostsController, 'search'])
