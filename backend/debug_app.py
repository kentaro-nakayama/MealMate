import traceback

from flask import Flask

app = Flask(__name__)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def debug(path):
    try:
        import main  # noqa: F401

        return f"OK: {main.app!r}"
    except Exception:
        return traceback.format_exc(), 500, {"Content-Type": "text/plain"}
