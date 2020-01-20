'use strict'
const Tweet = use('App/Models/Tweet')
const Reply = use('App/Models/Reply')

class TweetController {
  async show({ params, response }) {
    try {
      const tweet = await Tweet.query()
        .where('id', params.id)
        .with('user')
        .with('replies')
        .with('replies.user')
        .with('favorites')
        .firstOrfail()

      return response.status(201).json({ message: 'success', data: tweet })
    } catch (err) {
      return response.status(401).json({ error: { message: 'tweet não encontrado' } })
    }
  }

  async tweet({ request, auth, response }) {
    const user = auth.current.user
    const { tweet } = request.all()
    const tweet = await Tweet.create({
      user_id: user.id,
      tweet: tweet
    })

    await tweet.loadMany(['user', 'favorites', 'replies'])

    return response.status(201).json({ message: 'tweet postado', data: tweet })
  }

  async reply({ request, auth, params, response }) {
    const user = auth.current.user
    const tweet = await Tweet.find(params.id)
    const { reply } = request.all()

    const reply = await Reply.create({
      user_id: user.id,
      tweet_id: tweet.id,
      reply: reply
    })

    await reply.load('user')
    return response.status(201).json({ message: 'success', data: reply })

  }
}

module.exports = TweetController
