# backend/auth.py
# Lógica de autenticación — registro, login y verificación de tokens

import bcrypt
import jwt
import sqlite3
import re
from datetime import datetime, timedelta, timezone
from database import get_connection

# Clave secreta para firmar los tokens JWT
# En producción esto debería estar en una variable de entorno
JWT_SECRET  = "fixture_mundial_2026_secret_key"
JWT_EXPIRES = 24  # horas


# ─────────────────────────────────────────
# VALIDACIONES
# ─────────────────────────────────────────

def validar_username(username):
    """
    El username solo puede tener letras, números y guión bajo.
    Mínimo 3 caracteres, máximo 20.
    Previene inyección de comandos.
    """
    if not username or not isinstance(username, str):
        return False, "El nombre de usuario es requerido."
    if len(username) < 3 or len(username) > 20:
        return False, "El nombre de usuario debe tener entre 3 y 20 caracteres."
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "El nombre de usuario solo puede contener letras, números y guión bajo."
    return True, None


def validar_email(email):
    """
    Valida formato de email.
    Previene inyección de comandos.
    """
    if not email or not isinstance(email, str):
        return False, "El email es requerido."
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return False, "El formato del email no es válido."
    if len(email) > 100:
        return False, "El email es demasiado largo."
    return True, None


def validar_password(password):
    """
    La contraseña debe tener mínimo 8 caracteres,
    al menos una mayúscula, una minúscula y un número.
    """
    if not password or not isinstance(password, str):
        return False, "La contraseña es requerida."
    if len(password) < 8:
        return False, "La contraseña debe tener al menos 8 caracteres."
    if not re.search(r'[A-Z]', password):
        return False, "La contraseña debe tener al menos una mayúscula."
    if not re.search(r'[a-z]', password):
        return False, "La contraseña debe tener al menos una minúscula."
    if not re.search(r'[0-9]', password):
        return False, "La contraseña debe tener al menos un número."
    return True, None


# ─────────────────────────────────────────
# REGISTRO
# ─────────────────────────────────────────

def registrar_usuario(username, email, password):
    """
    Registra un nuevo usuario en la base de datos.
    Valida todos los campos y hashea la contraseña con bcrypt.
    Retorna (True, mensaje) o (False, error).
    """
    # Validar campos
    ok, error = validar_username(username)
    if not ok:
        return False, error

    ok, error = validar_email(email)
    if not ok:
        return False, error

    ok, error = validar_password(password)
    if not ok:
        return False, error

    # Hashear contraseña con bcrypt
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Insertar en la base de datos usando parámetros (previene SQL injection)
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO usuarios (username, email, password)
            VALUES (?, ?, ?)
        """, (username, email, password_hash.decode("utf-8")))
        conn.commit()
        return True, "Usuario registrado correctamente."
    except sqlite3.IntegrityError as e:
        if "username" in str(e):
            return False, "El nombre de usuario ya está en uso."
        if "email" in str(e):
            return False, "El email ya está registrado."
        return False, "Error al registrar el usuario."
    finally:
        conn.close()


# ─────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────

def login_usuario(username, password):
    """
    Verifica las credenciales del usuario.
    Si son correctas genera y retorna un token JWT.
    Retorna (True, token) o (False, error).
    """
    if not username or not password:
        return False, "Usuario y contraseña son requeridos."

    # Buscar usuario en la base de datos
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username, email, password
            FROM usuarios WHERE username = ?
        """, (username,))
        usuario = cursor.fetchone()
    finally:
        conn.close()

    if not usuario:
        return False, "Usuario o contraseña incorrectos."

    # Verificar contraseña con bcrypt
    password_correcto = bcrypt.checkpw(
        password.encode("utf-8"),
        usuario["password"].encode("utf-8")
    )

    if not password_correcto:
        return False, "Usuario o contraseña incorrectos."

    # Generar token JWT
    token = jwt.encode({
        "user_id":  usuario["id"],
        "username": usuario["username"],
        "email":    usuario["email"],
        "exp":      datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES)
    }, JWT_SECRET, algorithm="HS256")

    return True, token


# ─────────────────────────────────────────
# VERIFICACIÓN DE TOKEN
# ─────────────────────────────────────────

def verificar_token(token):
    """
    Verifica que el token JWT sea válido y no haya expirado.
    Retorna (True, payload) o (False, error).
    """
    if not token:
        return False, "Token no proporcionado."

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, "La sesión ha expirado. Iniciá sesión nuevamente."
    except jwt.InvalidTokenError:
        return False, "Token inválido."