const keys = require('../keys')

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
            <h1>Добро пожаловать в нашу кальянную: Белый Дым</h1>
            <p>Вы успешно прошли регистрацию.</p>  
            <p>Ваш логин - ${email}!</p>  
            <hr />
            <a href="${keys.BASE_URL}">Кальянная: Белый Дым</a>       
        `
    }
}