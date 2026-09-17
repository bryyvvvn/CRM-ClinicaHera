"""Extract MediLink endpoint JS request + JSON response examples."""

from __future__ import annotations

import re
from pathlib import Path

SRC = Path(
    r"C:\Users\pizar\.cursor\projects\c-Users-pizar-Documents-GitHub-CRM-ClinicaHera\agent-tools\bc97b2a9-31fd-4fb7-a747-1393c1c05182.txt"
)
OUT = Path(r"c:\Users\pizar\Documents\GitHub\CRM-ClinicaHera\docs\medilink-endpoints.md")

HEADING_RE = re.compile(r"^## `([A-Z]+)`\s+(.+?)\s*$", re.M)
FENCE_RE = re.compile(r"```(\w+)\n(.*?)```", re.S)


def first_paragraph(text: str) -> str:
    lines: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            if lines:
                break
            continue
        if line.startswith(">") or line.startswith("```") or line.startswith("|") or line.startswith("#"):
            break
        lines.append(line)
    return " ".join(lines)


def pick_blocks(section: str) -> tuple[str | None, str | None]:
    js_block = None
    json_block = None
    php_block = None
    for lang, body in FENCE_RE.findall(section):
        key = lang.lower()
        code = body.strip()
        if key in {"javascript", "js"} and js_block is None:
            js_block = code
        elif key == "json" and json_block is None:
            json_block = code
        elif key == "php" and php_block is None:
            php_block = code
    return js_block or php_block, json_block


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    matches = list(HEADING_RE.finditer(text))
    parts: list[str] = [
        "# MediLink API — endpoints (ejemplos)",
        "",
        "Fuente: https://api.medilink2.healthatom.com/docs/",
        "Base: `https://api.medilink2.healthatom.com/api/v5`",
        "Auth: `Authorization: Token <access_token>`",
        "",
        "Solo ejemplos de entrada (JS) y salida (JSON). Sin tablas de la doc oficial.",
        "",
        f"Total extraído: {len(matches)} endpoints.",
        "",
    ]

    for i, match in enumerate(matches):
        method, path = match.group(1), match.group(2).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        section = text[start:end]
        desc = first_paragraph(section)
        request, response = pick_blocks(section)

        parts.append(f"## `{method}` {path}")
        parts.append("")
        if desc:
            parts.append(desc)
            parts.append("")
        parts.append("### Entrada")
        parts.append("")
        if request:
            lang = "javascript" if "settings" in request or "var " in request else "php"
            parts.append(f"```{lang}")
            parts.append(request)
            parts.append("```")
        else:
            parts.append("_Sin ejemplo de solicitud en la doc._")
        parts.append("")
        parts.append("### Salida")
        parts.append("")
        if response:
            parts.append("```json")
            parts.append(response)
            parts.append("```")
        else:
            parts.append("_Sin ejemplo de respuesta JSON en la doc._")
        parts.append("")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(f"Wrote {OUT} ({len(matches)} endpoints)")


if __name__ == "__main__":
    main()
