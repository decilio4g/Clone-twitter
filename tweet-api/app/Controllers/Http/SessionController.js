'use strict'

class SessionController {
  async store({ request, auth, response }) {
    try {
      const { email, password } = request.all()
      const token = await auth.attempt(email, password)

      return response.status(200).json({ message: 'Usuário logado', data: token })
    } catch (err) {
      console.log(err)
      return response.status(400).json({ error: { message: 'algo deu errado, confirme seus dados' } })
    }
  }
}

module.exports = SessionController
