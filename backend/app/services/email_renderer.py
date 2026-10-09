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


# --- Plantilla TEKO ----------------------------------------------------------
# Maquetación con tablas y estilos en línea: cabecera azul noche con el logo y
# la ocasión, titular con una palabra en itálica serif, cuerpo blanco, firma
# y pie fuera de la tarjeta. Sin degradados ni sombras.

SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif"
SERIF = "Georgia,'Times New Roman',serif"
INK = "#101828"
BODY_COLOR = "#4b5565"
SOFT = "#6a7282"
RULE = "#e4e8ef"
PAGE = "#eef1f6"
NIGHT = "#0a0e1a"
CYAN_LINE = "#1ec4ff"
ASSETS = "https://teko.do/email"
WORDMARK = "teko."

TABLE = 'role="presentation" cellpadding="0" cellspacing="0" border="0"'

HEAD_STYLE = (
    "<style>body{margin:0;padding:0;-webkit-text-size-adjust:100%;}"
    "@media (max-width:620px){.w100{width:100%!important;}"
    ".px{padding-left:24px!important;padding-right:24px!important;}"
    ".h1{font-size:29px!important;line-height:35px!important;}}</style>"
)


# Logos de TEKO con letras blancas: sobre una cabecera clara no se ven.
WHITE_LOGOS = ("/LogoTeko.png", "/teko-logo-white.png")


def header_logo(logo_url: str | None, header_background: str) -> str | None:
    """Cambia el logo blanco de TEKO por la versión a color si la cabecera es clara."""
    if logo_url and not _is_dark(header_background) and logo_url.split("?")[0].endswith(WHITE_LOGOS):
        return f"{ASSETS}/teko-logo.png"
    return logo_url


def _is_dark(hex_color: str) -> bool:
    """Oscuro si el texto blanco se lee encima con contraste 4.5:1."""
    return 1.05 / (_relative_luminance(hex_color) + 0.05) >= 4.5


def _links(template) -> list[dict]:
    raw = getattr(template, "social_links", None) or []
    return [item if isinstance(item, dict) else item.model_dump() for item in raw]


def _text(template, field: str) -> str:
    return (getattr(template, field, None) or "").strip()


def _card(template) -> dict | None:
    if getattr(template, "signature_style", "texto") == "texto":
        return None
    raw = getattr(template, "signature_card", None)
    if raw is None:
        return None
    if not isinstance(raw, dict):
        raw = raw.model_dump()
    card = {key: (value or "").strip() for key, value in raw.items()}
    return card if card.get("name") else None


def _italic_word(raw: str, color: str) -> str:
    """Escapa el texto y convierte *palabra* en itálica serif."""
    return ITALIC_RE.sub(
        f'<span style="font-family:{SERIF};font-style:italic;font-weight:normal;color:{color};letter-spacing:0;">\\1</span>',
        html.escape(raw),
    )


def _spacer(height: int) -> str:
    return f'<div style="height:{height}px;line-height:{height}px;font-size:0;">&nbsp;</div>'


def _button(label: str, url: str, background: str, color: str) -> str:
    return (
        f'<table {TABLE}><tr><td bgcolor="{background}" style="border-radius:999px;mso-padding-alt:14px 30px;">'
        f'<a href="{html.escape(url)}" style="display:block;padding:14px 30px;font-family:{SANS};font-size:14px;'
        f'line-height:20px;font-weight:700;color:{color};text-decoration:none;border-radius:999px;white-space:nowrap;">'
        f"{html.escape(label)}</a></td></tr></table>"
    )


def _display_url(url: str) -> str:
    return re.sub(r"^https?://(www\.)?", "", url).rstrip("/")


def _contact_rows(card: dict, label_color: str, value_color: str, link_color: str, with_address: bool) -> str:
    cell = f"padding:2px 0;font-family:{SANS};"
    rows = []
    entries = [
        ("T", html.escape(card.get("phone", ""))),
        ("E", card.get("email") and f'<a href="mailto:{html.escape(card["email"])}" style="color:{link_color};text-decoration:none;">{html.escape(card["email"])}</a>'),
        ("W", card.get("website") and f'<a href="{html.escape(card["website"])}" style="color:{link_color};text-decoration:none;">{html.escape(_display_url(card["website"]))}</a>'),
    ]
    if with_address:
        entries.append(("D", html.escape(card.get("address", ""))))
    for letter, value in entries:
        if not value:
            continue
        rows.append(
            f'<tr><td width="20" style="{cell}font-size:10px;line-height:18px;font-weight:700;letter-spacing:1px;color:{label_color};">{letter}</td>'
            f'<td style="{cell}font-size:13px;line-height:18px;color:{value_color};">{value}</td></tr>'
        )
    return f"<table {TABLE}>{''.join(rows)}</table>" if rows else ""


def _signature_text(signature: str) -> str:
    lines = [line.strip() for line in signature.strip().split("\n") if line.strip()]
    if not lines:
        return ""
    closing = ""
    # "Un saludo," va como despedida; lo que sigue es quien firma.
    if len(lines) > 1 and lines[0].endswith(","):
        closing = (
            f'<p style="margin:0 0 16px;font-family:{SANS};font-size:15px;line-height:24px;color:{BODY_COLOR};">'
            f"{html.escape(lines[0])}</p>"
        )
        lines = lines[1:]
    rest = "".join(f"<br>{html.escape(line)}" for line in lines[1:])
    return (
        f"{closing}<table {TABLE} width=\"100%\"><tr>"
        f'<td width="44" valign="middle"><img src="{ASSETS}/teko-mark.png" width="34" height="36" alt="TEKO" '
        f'style="display:block;border:0;width:34px;height:36px;"></td>'
        f'<td valign="middle" style="font-family:{SANS};font-size:14px;line-height:20px;color:{SOFT};">'
        f'<strong style="color:{INK};">{html.escape(lines[0])}</strong>{rest}</td></tr></table>'
    )


def _signature_full(card: dict, accent: str, band: str, links: list[dict]) -> str:
    title = (
        f'<p style="margin:2px 0 12px;font-family:{SERIF};font-style:italic;font-size:15px;line-height:20px;color:{accent};">{html.escape(card["title"])}</p>'
        if card.get("title") else '<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>'
    )
    strip = ""
    if card.get("tagline") or links:
        socials = "&nbsp;&nbsp;&nbsp;".join(
            f'<a href="{html.escape(link["url"])}" style="color:#a1a8b3;text-decoration:none;">{html.escape(link["label"])}</a>'
            for link in links[:4]
        )
        strip = (
            f'<tr><td colspan="3" style="padding-top:20px;"><table {TABLE} width="100%" bgcolor="{band}" '
            f'style="background-color:{band};border-radius:12px;"><tr>'
            f'<td valign="middle" style="padding:16px 20px;font-family:{SANS};font-size:15px;line-height:20px;font-weight:700;color:#ffffff;">'
            f"{_italic_word(card.get('tagline', ''), '#bfe9ff')}</td>"
            f'<td align="right" valign="middle" style="padding:16px 20px;font-family:{SANS};font-size:10px;line-height:16px;'
            f'font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">{socials}</td>'
            f"</tr></table></td></tr>"
        )
    return (
        f'<table {TABLE} width="100%"><tr>'
        f'<td width="148" valign="middle" style="padding:4px 24px 4px 0;"><img src="{ASSETS}/teko-logo.png" width="124" height="36" alt="TEKO" '
        f'style="display:block;border:0;width:124px;height:36px;"></td>'
        f'<td width="1" bgcolor="{RULE}" style="width:1px;background-color:{RULE};font-size:0;line-height:0;">&nbsp;</td>'
        f'<td valign="top" style="padding:4px 0 4px 24px;">'
        f'<p style="margin:0;font-family:{SANS};font-size:17px;line-height:22px;font-weight:700;letter-spacing:-0.2px;color:{INK};">{html.escape(card["name"])}</p>'
        f"{title}{_contact_rows(card, accent, SOFT, INK, with_address=True)}</td></tr>"
        f"{strip}</table>"
    )


def _signature_dark(card: dict, band: str, links: list[dict]) -> str:
    title = (
        f'<p style="margin:2px 0 0;font-family:{SERIF};font-style:italic;font-size:15px;line-height:20px;color:#bfe9ff;">{html.escape(card["title"])}</p>'
        if card.get("title") else ""
    )
    socials = "<br>".join(
        f'<a href="{html.escape(link["url"])}" style="font-family:{SANS};font-size:12px;line-height:18px;font-weight:700;color:#bfe9ff;text-decoration:none;">{html.escape(link["label"])}</a>'
        for link in links[:3]
    )
    return (
        f'<table {TABLE} width="100%" bgcolor="{band}" style="background-color:{band};border-radius:16px;">'
        f'<tr><td style="padding:26px 28px 20px;"><table {TABLE} width="100%"><tr><td valign="top">'
        f'<p style="margin:0;font-family:{SANS};font-size:18px;line-height:24px;font-weight:700;color:#ffffff;">{html.escape(card["name"])}</p>{title}</td>'
        f'<td align="right" valign="top"><img src="{ASSETS}/teko-logo-white.png" width="110" height="32" alt="TEKO" '
        f'style="display:block;border:0;width:110px;height:32px;"></td></tr></table></td></tr>'
        f'<tr><td style="padding:0 28px;"><table {TABLE} width="100%"><tr><td height="1" bgcolor="#232a3a" '
        f'style="height:1px;background-color:#232a3a;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>'
        f'<tr><td style="padding:18px 28px 24px;"><table {TABLE} width="100%"><tr>'
        f'<td valign="top">{_contact_rows(card, CYAN_LINE, "#c3cad6", "#ffffff", with_address=False)}</td>'
        f'<td align="right" valign="bottom">{socials}</td></tr></table></td></tr></table>'
    )


def _signature_compact(card: dict, accent: str) -> str:
    title = (
        f'&nbsp;&nbsp;<span style="font-family:{SERIF};font-style:italic;color:{accent};">{html.escape(card["title"])}</span>'
        if card.get("title") else ""
    )
    contact = []
    if card.get("email"):
        contact.append(f'<a href="mailto:{html.escape(card["email"])}" style="color:{SOFT};text-decoration:none;">{html.escape(card["email"])}</a>')
    if card.get("phone"):
        contact.append(html.escape(card["phone"]))
    if card.get("website"):
        contact.append(f'<a href="{html.escape(card["website"])}" style="color:{INK};font-weight:700;text-decoration:none;">{html.escape(_display_url(card["website"]))}</a>')
    second = f"<br>{'&nbsp;&nbsp;&nbsp;'.join(contact)}" if contact else ""
    return (
        f"<table {TABLE}><tr>"
        f'<td valign="middle" style="padding-right:14px;"><img src="{ASSETS}/teko-mark.png" width="38" height="40" alt="TEKO" '
        f'style="display:block;border:0;width:38px;height:40px;"></td>'
        f'<td valign="middle" style="padding-left:14px;border-left:2px solid {CYAN_LINE};font-family:{SANS};font-size:13px;line-height:20px;color:{SOFT};">'
        f'<strong style="color:{INK};font-size:14px;">{html.escape(card["name"])}</strong>{title}{second}</td>'
        f"</tr></table>"
    )


def _signature_block(template, accent: str, band: str) -> str:
    card = _card(template)
    if card is None:
        return _signature_text(_text(template, "signature"))
    style = getattr(template, "signature_style", "texto")
    if style == "oscura":
        return _signature_dark(card, band, _links(template))
    if style == "compacta":
        return _signature_compact(card, accent)
    return _signature_full(card, accent, band, _links(template))


def _signature_plain(template) -> str:
    card = _card(template)
    if card is None:
        return _text(template, "signature")
    keys = ("name", "title", "phone", "email", "website", "address")
    return "\n".join(card[key] for key in keys if card.get(key))


def _footer(template) -> str:
    links = _links(template)
    footer_text = _text(template, "footer_text")
    if not links and not footer_text:
        return ""
    nav = "&nbsp;&nbsp;&nbsp;&nbsp;".join(
        f'<a href="{html.escape(link["url"])}" style="color:{SOFT};text-decoration:none;">{html.escape(link["label"])}</a>'
        for link in links
    )
    legal = ""
    if footer_text:
        lines = "<br>".join(_inline(line, SOFT) for line in footer_text.split("\n") if line.strip())
        legal = (
            f'<tr><td colspan="2" style="padding-top:12px;font-family:{SANS};font-size:12px;line-height:19px;color:{SOFT};">{lines}</td></tr>'
        )
    return (
        f'<tr><td class="px" style="padding:32px 48px 8px;"><table {TABLE} width="100%"><tr>'
        f'<td valign="top" style="font-family:{SANS};font-size:15px;line-height:20px;color:{INK};font-weight:700;">{WORDMARK}</td>'
        f'<td align="right" valign="top" style="font-family:{SANS};font-size:12px;line-height:20px;">{nav}</td>'
        f"</tr>{legal}</table></td></tr>"
    )


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
    header = template.header_background
    dark = _is_dark(header)
    band = header if dark else NIGHT
    palette = {
        "label": "#a1a8b3" if dark else SOFT,
        "kicker": "#8fd8ff" if dark else link_color,
        "headline": "#ffffff" if dark else INK,
        "italic": "#bfe9ff" if dark else link_color,
        "button_bg": "#ffffff" if dark else link_color,
        "button_fg": INK if dark else "#ffffff",
    }

    occasion = _text(template, "occasion")
    kicker = _text(template, "kicker")
    headline = _text(template, "headline")
    button_label = _text(template, "button_label")
    button_url = _text(template, "button_url")
    has_button = bool(button_label and button_url)
    has_hero = bool(kicker or headline or has_button)

    logo_url = header_logo(template.logo_url, header)
    if logo_url:
        logo = (
            f'<img src="{html.escape(logo_url)}" width="124" alt="{html.escape(template.name)}" '
            f'style="display:block;border:0;outline:none;width:124px;max-width:160px;height:auto;">'
        )
    else:
        logo = (
            f'<span style="font-family:{SANS};font-size:18px;line-height:24px;font-weight:700;letter-spacing:-0.3px;'
            f'color:{palette["headline"]};">{html.escape(template.name)}</span>'
        )
    label_cell = (
        f'<td align="right" valign="middle" style="font-family:{SANS};font-size:11px;line-height:16px;letter-spacing:1.4px;'
        f'text-transform:uppercase;color:{palette["label"]};">{html.escape(occasion)}</td>'
        if occasion else ""
    )
    rows = [
        f'<tr><td class="px" bgcolor="{header}" style="padding:32px 48px {8 if has_hero else 32}px;background-color:{header};'
        f'border-radius:16px 16px 0 0;"><table {TABLE} width="100%"><tr><td valign="middle">{logo}</td>{label_cell}</tr></table></td></tr>'
    ]

    if has_hero:
        hero = []
        if kicker:
            hero.append(
                f'<p style="margin:0 0 16px;font-family:{SANS};font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.6px;'
                f'text-transform:uppercase;color:{palette["kicker"]};">{html.escape(kicker)}</p>'
            )
        if headline:
            hero.append(
                f'<h1 class="h1" style="margin:0;font-family:{SANS};font-size:36px;line-height:42px;mso-line-height-rule:exactly;'
                f'font-weight:700;letter-spacing:-0.8px;color:{palette["headline"]};">{_italic_word(headline, palette["italic"])}</h1>'
            )
        if has_button:
            if hero:
                hero.append(_spacer(28))
            hero.append(_button(button_label, button_url, palette["button_bg"], palette["button_fg"]))
        rows.append(
            f'<tr><td class="px" bgcolor="{header}" style="padding:40px 48px 48px;background-color:{header};">{"".join(hero)}</td></tr>'
        )

    signature = _signature_block(template, link_color, band)
    content = body_to_html(body, link_color).replace("<strong>", f'<strong style="color:{INK};">')
    body_radius = "" if signature else "border-radius:0 0 16px 16px;"
    if not dark:
        body_radius += f"border-top:1px solid {RULE};"
    rows.append(
        f'<tr><td class="px" bgcolor="#ffffff" style="padding:40px 48px {8 if signature else 24}px;background-color:#ffffff;{body_radius}'
        f'font-family:{SANS};font-size:15px;line-height:24px;color:{BODY_COLOR};">{content}</td></tr>'
    )
    if signature:
        rows.append(
            f'<tr><td class="px" bgcolor="#ffffff" style="padding:24px 48px 40px;background-color:#ffffff;border-radius:0 0 16px 16px;">'
            f"{signature}</td></tr>"
        )
    rows.append(_footer(template))

    document = (
        '<!doctype html><html lang="es"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">'
        f"<title>{title}</title>{HEAD_STYLE}</head>"
        f'<body style="margin:0;padding:0;background-color:{PAGE};">'
        f"{_preheader(body)}"
        f'<table {TABLE} width="100%" bgcolor="{PAGE}" style="background-color:{PAGE};"><tr><td align="center" style="padding:32px 12px 40px;">'
        f'<!--[if mso]><table {TABLE} width="600"><tr><td><![endif]-->'
        f'<table {TABLE} class="w100" width="600" style="width:600px;max-width:600px;">'
        f"{''.join(rows)}"
        f"</table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></body></html>"
    )

    text_parts = [plain_body]
    signature_plain = _signature_plain(template)
    if signature_plain:
        text_parts.append(signature_plain)
    footer_lines = [f'{item["label"]}: {item["url"]}' for item in _links(template)]
    if _text(template, "footer_text"):
        footer_lines.append(_text(template, "footer_text"))
    if footer_lines:
        text_parts.append("--\n" + "\n".join(footer_lines))
    if has_button:
        text_parts.insert(1, f"{button_label}: {button_url}")

    return document, "\n\n".join(text_parts)
