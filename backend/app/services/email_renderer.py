"""Convierte el texto de un correo en HTML apto para clientes de correo.

El cuerpo admite un formato mínimo: párrafos separados por línea en blanco,
**negrita**, *cursiva*, listas con "- " y enlaces que se detectan solos.
Todo el texto se escapa antes de insertarse, así que nada de lo escrito
puede inyectar HTML.
"""

import html
import re

URL_RE = re.compile(r"https?://[^\s<>\"']+")
BOLD_RE = re.compile(r"\*\*(\S(?:.*?\S)?)\*\*")
ITALIC_RE = re.compile(r"(?<![*\w])\*(\S(?:.*?\S)?)\*(?![*\w])")
LIST_ITEM_RE = re.compile(r"^\s*[-•]\s+")

FONT_STACK = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
TEXT_COLOR = "#1d2128"
MUTED_COLOR = "#5b6271"


def _relative_luminance(hex_color: str) -> float:
    channels = []
    for i in (1, 3, 5):
        c = int(hex_color[i:i + 2], 16) / 255
        channels.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    r, g, b = channels
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def readable_on_white(hex_color: str) -> str:
    """Oscurece el acento hasta que se lea sobre blanco (contraste 4.5:1)."""
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (1, 3, 5))
    for _ in range(40):
        candidate = f"#{r:02x}{g:02x}{b:02x}"
        if 1.05 / (_relative_luminance(candidate) + 0.05) >= 4.5:
            return candidate
        r, g, b = int(r * 0.92), int(g * 0.92), int(b * 0.92)
    return "#0b5c80"


def _format_inline(escaped: str) -> str:
    escaped = BOLD_RE.sub(r"<strong>\1</strong>", escaped)
    return ITALIC_RE.sub(r"<em>\1</em>", escaped)


def _inline(raw: str, link_color: str) -> str:
    parts: list[str] = []
    position = 0
    for match in URL_RE.finditer(raw):
        url = match.group(0)
        trailing = ""
        while url and url[-1] in ".,;:!?)":
            trailing = url[-1] + trailing
            url = url[:-1]
        parts.append(_format_inline(html.escape(raw[position:match.start()])))
        safe_url = html.escape(url)
        parts.append(f'<a href="{safe_url}" style="color:{link_color};text-decoration:underline">{safe_url}</a>')
        parts.append(html.escape(trailing))
        position = match.end()
    parts.append(_format_inline(html.escape(raw[position:])))
    return "".join(parts)


def body_to_html(body: str, link_color: str) -> str:
    blocks = [block for block in re.split(r"\n\s*\n", body.strip()) if block.strip()]
    rendered: list[str] = []
    for block in blocks:
        lines = [line for line in block.split("\n") if line.strip()]
        if lines and all(LIST_ITEM_RE.match(line) for line in lines):
            items = "".join(
                f'<li style="margin:0 0 6px">{_inline(LIST_ITEM_RE.sub("", line), link_color)}</li>'
                for line in lines
            )
            rendered.append(f'<ul style="margin:0 0 16px;padding:0 0 0 22px">{items}</ul>')
        else:
            content = "<br>".join(_inline(line, link_color) for line in lines)
            rendered.append(f'<p style="margin:0 0 16px">{content}</p>')
    return "".join(rendered)


def body_to_text(body: str) -> str:
    text = BOLD_RE.sub(r"\1", body.strip())
    return ITALIC_RE.sub(r"\1", text)


def _preheader(body: str) -> str:
    preview = " ".join(body_to_text(body).split())[:140]
    return (
        f'<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">'
        f"{html.escape(preview)}</div>"
    )


def _social_links(template, link_color: str) -> str:
    links = [
        f'<a href="{html.escape(item["url"])}" style="color:{link_color};text-decoration:none;font-weight:600">'
        f'{html.escape(item["label"])}</a>'
        for item in _links(template)
    ]
    if not links:
        return ""
    separator = f'<span style="color:#c4c8d0;padding:0 8px">·</span>'
    return f'<p style="margin:0 0 10px;font-size:13px">{separator.join(links)}</p>'


def _links(template) -> list[dict]:
    raw = getattr(template, "social_links", None) or []
    return [item if isinstance(item, dict) else item.model_dump() for item in raw]


def render_email(*, body: str, subject: str | None, template) -> tuple[str, str]:
    """Devuelve (html, texto plano) del correo, con o sin plantilla."""
    title = html.escape(subject or "")
    plain_body = body_to_text(body)

    if template is None:
        content = body_to_html(body, "#0b6fa8")
        document = (
            f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title></head>'
            f'<body style="margin:0;padding:24px;font-family:{FONT_STACK};font-size:15px;line-height:1.65;color:{TEXT_COLOR}">'
            f"{_preheader(body)}{content}</body></html>"
        )
        return document, plain_body

    link_color = readable_on_white(template.accent_color)
    content = body_to_html(body, link_color)

    logo = ""
    if template.logo_url:
        logo = (
            f'<img src="{html.escape(template.logo_url)}" alt="{html.escape(template.name)}" width="128" '
            f'style="display:block;width:128px;max-width:160px;height:auto;border:0;outline:none">'
        )
    else:
        logo = f'<span style="color:#f2f3f5;font-size:18px;font-weight:700;letter-spacing:-0.02em">{html.escape(template.name)}</span>'

    signature = ""
    if template.signature:
        lines = "<br>".join(html.escape(line) for line in template.signature.strip().split("\n"))
        signature = f'<p style="margin:28px 0 0;color:{MUTED_COLOR}">{lines}</p>'

    footer_text = ""
    if template.footer_text:
        footer_text = f'<p style="margin:0;font-size:12px;line-height:1.6;color:#8a909c">{html.escape(template.footer_text)}</p>'

    footer = ""
    social = _social_links(template, link_color)
    if social or footer_text:
        footer = (
            f'<tr><td style="padding:22px 36px 26px;background:#f7f8fa;border-top:1px solid #e6e8ec">'
            f"{social}{footer_text}</td></tr>"
        )

    document = (
        f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">'
        f"<title>{title}</title></head>"
        f'<body style="margin:0;padding:0;background:#eef0f3">'
        f"{_preheader(body)}"
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f3">'
        f'<tr><td align="center" style="padding:32px 12px">'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:{FONT_STACK}">'
        f'<tr><td style="padding:26px 36px;background:{template.header_background}">{logo}</td></tr>'
        f'<tr><td style="padding:36px;font-size:15px;line-height:1.65;color:{TEXT_COLOR}">{content}{signature}</td></tr>'
        f"{footer}"
        f"</table></td></tr></table></body></html>"
    )

    text_parts = [plain_body]
    if template.signature:
        text_parts.append(template.signature.strip())
    footer_lines = [f'{item["label"]}: {item["url"]}' for item in _links(template)]
    if template.footer_text:
        footer_lines.append(template.footer_text)
    if footer_lines:
        text_parts.append("--\n" + "\n".join(footer_lines))

    return document, "\n\n".join(text_parts)
