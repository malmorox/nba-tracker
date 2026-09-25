"""
Caché persistente basada en SQLite.

Uso:
    from app.core.cache import cache

    data = cache.get("my_key")
    if data is None:
        data = fetch_something()
        cache.set("my_key", data, ttl=3600)
"""

import json
import sqlite3
import time
from pathlib import Path
from typing import Any

from app.core.config import settings


class SqliteCache:
    def __init__(self, db_path: Path) -> None:
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self._path = str(db_path)
        self._init_db()

    def _init_db(self) -> None:
        conn = sqlite3.connect(self._path)
        try:
            conn.execute(
                "CREATE TABLE IF NOT EXISTS cache ("
                "key TEXT PRIMARY KEY, "
                "value TEXT NOT NULL, "
                "expires_at REAL NOT NULL)"
            )
            conn.commit()
        finally:
            conn.close()

    def get(self, key: str) -> Any | None:
        """Devuelve el valor cacheado o None si no existe / expiró."""
        conn = sqlite3.connect(self._path)
        try:
            row = conn.execute(
                "SELECT value, expires_at FROM cache WHERE key = ?", (key,)
            ).fetchone()
        finally:
            conn.close()

        if row is None:
            return None
        if time.time() > row[1]:
            self.delete(key)
            return None
        return json.loads(row[0])

    def set(self, key: str, value: Any, ttl: int) -> None:
        """Guarda un valor con tiempo de vida en segundos."""
        serialized = json.dumps(value, ensure_ascii=False)
        expires_at = time.time() + ttl
        conn = sqlite3.connect(self._path)
        try:
            conn.execute(
                "INSERT OR REPLACE INTO cache (key, value, expires_at) VALUES (?, ?, ?)",
                (key, serialized, expires_at),
            )
            conn.commit()
        finally:
            conn.close()

    def delete(self, key: str) -> None:
        conn = sqlite3.connect(self._path)
        try:
            conn.execute("DELETE FROM cache WHERE key = ?", (key,))
            conn.commit()
        finally:
            conn.close()


cache = SqliteCache(settings.cache_db_path)
