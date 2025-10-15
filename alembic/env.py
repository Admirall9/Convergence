from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

from src.core.settings import settings
from src.db.base import Base
from src.db.models import gov as _gov  # noqa: F401 - legacy models used by endpoints
from src.db.models import citizen as _citizen  # noqa: F401
from src.db.models import rbac as _rbac  # noqa: F401
from src.db.models import security as _security  # noqa: F401 - new domain models
from src.db.models import government as _government  # noqa: F401
from src.db.models import reviews as _reviews  # noqa: F401
from src.db.models import legal as _legal  # noqa: F401
from src.db.models import economy as _economy  # noqa: F401
from src.db.models import awareness as _awareness  # noqa: F401
from src.db.models import ai as _ai  # noqa: F401
from src.db.models import system as _system  # noqa: F401


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = settings.sqlalchemy_url
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"})

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        {"sqlalchemy.url": settings.sqlalchemy_url},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()


