const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf
            fetch('/card/remove/' + id, {
                method: 'delete',
                headers: {
                    "X-XSRF-TOKEN": csrf
                }
            })
            .then(res => res.json())
            .then(card => {
                if (card.tables.length) {
                    const html = card.tables.map(t => {
                        return `
                            <tr>
                                <td>${t.title}</td>
                                <td>${t.count}</td>
                                <td>
                                    <button class="btn btn-small cyan lighten-1 js-remove" data-id="${t.id}">Удалить</button>
                                </td>
                            </tr>
                        `
                    }).join('')
                    $card.querySelector('tbody').innerHTML = html
                    $card.querySelector('.price').innerHTML = toCurrency(card.price)
                } else {
                    $card.innerHTML = '<p>Корзина пуста</p>'
                }
            })
        }
    })
}

const $reservation = document.querySelector('#reservation')
if ($reservation) {
    $reservation.addEventListener('click', event => {
        if (event.target.classList.contains('reservation-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf
            const targetDate = event.target.dataset.date
            const date = {
                date: targetDate.toString()
            }
            fetch('/control/remove/' + id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrf
                },
                body: JSON.stringify(date)
            })
            .then(res => res.json())
            .then(reservation => {
                if (reservation.length) {
                    const html = reservation.map(r => {
                        return `
                            <tr>
                                <td>${r.name}</td>
                                <td>${r.quantity}</td>
                                <td>${r.tableId.title}</td>
                                <td>${r.time}</td>
                                <td>
                                    <button class="btn btn-small cyan lighten-1 reservation-remove" data-id="${r.id}"">Удалить</button>
                                </td>
                            </tr>
                        `
                    }).join('')
                    $reservation.querySelector('tbody').innerHTML = html
                } else {
                    $reservation.innerHTML = '<p>На сегодня бронирования нет</p>'
                }
            })
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'))

document.addEventListener('DOMContentLoaded', function() {
    M.Modal.init(document.querySelectorAll('.modalBooking'))
    M.Datepicker.init(document.querySelectorAll('.datepicker'), {
        defaultDate: Date.now(),
        maxDate: new Date(),
        format: 'dd.mm.yyyy',
        i18n: {
            done: 'далее',
            cancel: 'отмена',
            months: [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь'
            ],
            monthsShort: [
                'Янв',
                'Февр',
                'Март',
                'Апр',
                'Май',
                'Июнь',
                'Июль',
                'Авг',
                'Сент',
                'Окт',
                'Нояб',
                'Дек'
            ],
            weekdays: [
                'Воскресенье',
                'Понедельник',
                'Вторник',
                'Среда',
                'Четверг',
                'Пятница',
                'Суббота'
            ],
            weekdaysShort: [
                'Вс',
                'Пн',
                'Вт',
                'Ср',
                'Чт',
                'Пт',
                'Сб'
            ],
            weekdaysAbbrev: ['В','П','В','С','Ч','П','С']
        }
    })
    M.Timepicker.init(document.querySelectorAll('.timepicker'), {
        showClearBtn: true,
        twelveHour: false,
        defaultTime: 'now',
        i18n: {
            clear: 'очистить',
            done: 'далее',
            cancel: 'отмена'
        }
    });
});
