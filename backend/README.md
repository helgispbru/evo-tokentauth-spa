## Бэкенд для приложения

Считаем, что у нас есть установленная и работающая evo cms версии 3, в которой пакет называется `Main` (значение по-умолчанию).

Чтобы отвечать на запросы из примера приложения нужно добавить в соответствующие файлы код из репозитория:

1. добавить в `/core/custom/routes.php` новые роуты (см. пример)

Добавляются endpoints без дополнительных проверок:

- `/api/auth/login` обслуживает вход на сайт, принимает логин/пароль, выдаёт токены при успешном входе
- `/api/auth/logout` обслуживает выход
- `/api/auth/refreshtoken` обслуживает обновление токена, принимает refresh token, выдаёт access token

Добавляются endpoints с дополнительными проверками:

- `/api/heartbeat` отвечает на запросы

2. создать контроллер в `/core/custom/packages/main/Controllers/ApiController.php`

3. создать middleware в `/core/custom/packages/main/middleware/CheckToken.php`

После этого если создать нового пользователя, то можно будет делать вход с логином/паролем, а затем запросы из примера приложения.
