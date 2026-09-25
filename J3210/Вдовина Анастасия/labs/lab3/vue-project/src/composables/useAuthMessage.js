const MESSAGES = {
  'Incorrect password': 'Неверный email или пароль.',
  'Cannot find user': 'Пользователь с таким email не найден.',
  'Email already exists': 'Пользователь с таким email уже зарегистрирован.',
  'Email format is invalid': 'Проверьте формат email.',
  'Password is too short': 'Пароль слишком короткий.',
}

export function useAuthMessage() {
  function authMessage(error, fallback) {
    if (!error.response) {
      return 'Сервер недоступен. Проверьте, что он запущен (npm run api).'
    }

    return MESSAGES[error.response.data] || fallback
  }

  return { authMessage }
}
