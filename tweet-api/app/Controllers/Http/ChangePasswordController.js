'use strict'
const Hash = use('Hash')
const User = use('App/Models/User')

class ChangePasswordController {
  async update({ request, auth, response }) {
    const user = auth.current.user

    console.log(user)

    const { password, newPassword } = request.all()
    const verifyPassword = await Hash.verify(password, user.password)

    if (!verifyPassword) {
      return response.status(401).json({ error: { message: 'as senhas não se batem, tente novamente' } })
    }

    user.password = await Hash.make(newPassword)
    await user.save()

    return response.status(200).json({ message: 'Senha alterada com Sucesso' })
  }
}

module.exports = ChangePasswordController
