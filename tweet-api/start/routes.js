'use strict'
const Route = use('Route')

//cadastrar
Route.post('/signup', 'UserController.store')

//logar
Route.post('/login', 'SessionController.store')

//mostrar / alterar os dados
Route.group(() => {
  Route.get('/me', 'UserController.show')
  Route.put('/update_profile', 'UserController.update')
}).prefix('account').middleware(['auth:jwt'])

//mudar a senha
Route.put('/change_password', 'ChangePasswordController.update').middleware(['auth:jwt'])

//mostrar as informações do usuario
Route.get(':username', "UserController.showProfile")

//mostrar usuarios que podem ser seguidos
Route.group(() => {
  Route.get('/users_to_follow', 'UserController.usersToFollow')
}).prefix('users').middleware(['auth:jwt'])

//seguir um usuario
Route.post('/follow/:id', 'UserController.follow').middleware(['auth:jwt'])

//deixar de seguir um usuario
Route.delete('/unfollow/:id', 'UserController.unFollow').middleware(['auth:jwt'])

//mostrar os tweets
Route.get('/timeline', 'UserController.timeline').middleware(['auth:jwt'])

//publicando um tweet
Route.post('tweet', 'TweetController.tweet').middleware(['auth:jwt'])

//buscando um unico tweet
Route.get('/tweets/:id', 'TweetController.show').middleware(['auth:jwt'])

//responsendo um tweet
Route.post('/tweets/reply/:id', 'TweetController.reply').middleware(['auth:jwt'])

//favoritando um tweet
Route.group(() => {
  Route.post('/create', 'FavoriteController.favorite')
}).prefix('favorites').middleware(['auth:jwt'])

//desfavoritando um tweet
Route.delete('/destroy/:id', 'FavoriteController.unFavorite').middleware(['auth:jwt'])


//excluindo um tweet
Route.delete('/tweets/destroy/:id', 'TweetController.destroy').middleware(['auth:jwt'])
//exemplo de middleware
// Route.get('login', 'SessionController.show).middleware(['auth:jwt'])