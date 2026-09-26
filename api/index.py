import traceback

try:
    from backend.main import app
except Exception:
    from flask import Flask

    app = Flask(__name__)
    _tb = traceback.format_exc()

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def debug_error(path):
        return _tb, 500, {"Content-Type": "text/plain"}
