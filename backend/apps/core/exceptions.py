class UnBookException(Exception):
    """Exceção base do ecossistema UnBook."""
    status_code: int = 400
    message: str = "Ocorreu um erro na requisição."

    def __init__(self, message: str | None = None, status_code: int | None = None):
        if message:
            self.message = message
        if status_code:
            self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(UnBookException):
    status_code = 404
    message = "Recurso não encontrado."


class ConflictException(UnBookException):
    status_code = 409
    message = "Conflito com o estado atual do recurso."


class UnauthorizedException(UnBookException):
    status_code = 401
    message = "Não autorizado."


class ForbiddenException(UnBookException):
    status_code = 403
    message = "Acesso proibido."
