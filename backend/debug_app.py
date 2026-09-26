import os
import re
import traceback

from flask import Flask

app = Flask(__name__)


def mask(url: str) -> str:
    return re.sub(r"://[^@]+@", "://***:***@", url)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def debug(path):
    raw = os.getenv("DATABASE_URL", "<not set>")
    lines = [f"raw DATABASE_URL scheme+host: {mask(raw)}"]
    lines.append(f"keys with DATABASE in name: {[k for k in os.environ if 'DATABASE' in k or 'POSTGRES' in k]}")
    try:
        import main  # noqa: F401

        lines.append(f"OK: {main.app!r}")
        return "\n".join(lines)
    except Exception:
        lines.append(traceback.format_exc())
        return "\n".join(lines), 500, {"Content-Type": "text/plain"}
