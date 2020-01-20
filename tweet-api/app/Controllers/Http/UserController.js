'use strict'
const User = use('App/Models/User')
const Tweet = use('App/Models/Tweet')

class UserController {
  async show({ auth, response }) {
    const user = await User.query()
      .where('id', auth.current.user.id)
      .with('tweets', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .with('following')
      .with('followers')
      .with('favorites')
      .with('favorites.tweet', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .firstOrFail()

    return response.status(200).json({
      message: 'concluido', data: user
    })
  }

  async showProfile({ params, response }) {
    try {
      const user = await User.query()
        .where('username', params.username)
        .with('tweets', builder => {
          builder.with('user')
          builder.with('favorites')
          builder.with('replies')
        })
        .with('following')
        .with('followers')
        .with('favorites')
        .with('favorites.tweet', builder => {
          builder.with('user')
          builder.with('favorites')
          builder.with('replies')
        })
        .firstOrFail()

      return response.status(200).json({ message: 'sucesso', data: user })
    } catch (err) {
      return response.status(400).json({ error: { message: 'algo não deu certo, tente novamente mais tarde' } })
    }
  }

  async usersToFollow({ auth, response }) {
    const user = auth.current.user
    const usersAlreadyFollowing = await user.following().ids()

    const usersToFollow = await User.query()
      .whereNot('id', user.id)
      .whereNotIn('id', usersAlreadyFollowing)
      .pick(3)

    return response.status(200).json({ message: 'sucesso', data: usersToFollow })
  }

  async follow({ request, auth, response }) {
    const user = auth.current.user
    const { user_id } = request.all()

    await user.following().attach(user_id)

    return response.status(200).json({ message: 'success', data: null })
  }

  async store({ request, auth, response }) {
    const userData = request.only(['name', 'username', 'email', 'password'])

    try {
      const user = await User.create(userData)
      const token = await auth.generate(user)

      return response.status(200).json({ message: 'Usuario cadastrado!', data: token })
    } catch (err) {
      return response.status(400).json({
        error: { message: 'algo deu errado, tente novamente' }
      })
    }
  }

  async update({ request, auth, response }) {
    try {
      const user = auth.current.user
      const userUpdated = request.only(['name', 'username', 'email', 'location', 'bio', 'website_url'])

      user.merge(userUpdated)
      user.save()

      return user
    } catch (err) {
      return response.status(401).json({ error: { message: 'algo deu errado, tente mais tarde' } })
    }
  }

  async unFollow({ params, auth, response }) {
    const user = auth.current.user

    await user.following().detach(params.id)

    return response.status(200).json({ message: 'success', data: null })
  }

  async timeline({ auth, response }) {
    const user = await User.find(auth.current.user.id)

    const followersIds = await user.following().ids()

    followersIds.push(user.id)

    const tweets = await Tweet.query()
      .whereIn('user_id', followersIds)
      .with('user')
      .with('favorites')
      .with('replies')
      .fetch()

    return response.status(200).json({ message: 'success', data: tweets })
  }
}

module.exports = UserController
