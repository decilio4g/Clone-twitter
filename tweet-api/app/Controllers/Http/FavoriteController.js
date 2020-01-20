'use strict'
const Favorite = use('App/Models/Favorite')

class FavoriteController {
  async favorite({ request, auth, response }) {
    const user = auth.current.user
    const { tweetId } = request.all()

    const favorite = await Favorite.findOrCreate(
      { user_id: user.id, tweet_id: tweetId },
      { user_id: user.id, tweet_id: tweetId }
    )

    return response.status(201).json({ message: 'success', data: favorite })
  }

  async unFavorite({ params, auth, response }) {
    const user = auth.current.user

    await Favorite.query()
      .where('user_id', user.id)
      .where('tweet_id', params.id)
      .delete()

    return response.status(200).json({ message: 'succecss', data: null })
  }

  async destroy({ auth, params, response }) {
    const user = auth.current.user

    const tweet = await tweet.query()
      .where('user_id', user.id)
      .where('id', params.id)
      .firstOrFail()

    await tweet.delete()

    return response.status(201).json({ message: 'success', data: null })
  }
}

module.exports = FavoriteController
