## UI-kit TUGEN для веба на Nim (`nim js`, std/dom): строит элементы с классами из
## css/tugen.css, того же вида, что компоненты React Native. Подключение в tugen.webservices:
## `import tugen_uikit` с `--path:node_modules/@tugen/uikit/nim`, CSS — `import '@tugen/uikit/css'`.

import std/dom

type
  ButtonVariant* = enum
    ## primary — одно главное действие на экране, secondary — нейтральная,
    ## play — зелёная, только запуск игры
    bvPrimary = "primary", bvSecondary = "secondary", bvPlay = "play"
  ButtonSize* = enum
    bsMd = "md", bsSm = "sm"
  IconTone* = enum
    itDefault = "default", itDanger = "danger", itSuccess = "success"
  PillTone* = enum
    ptNeutral = "neutral", ptAmber = "amber", ptGreen = "green", ptRed = "red",
    ptViolet = "violet", ptDanger = "danger"
  TextTone* = enum
    ttDefault = "default", ttSecondary = "secondary", ttMuted = "muted", ttFaint = "faint",
    ttInfo = "info", ttSuccess = "success", ttDanger = "danger", ttWarning = "warning",
    ttSpecial = "special"
  ColorTheme* = enum
    ## ctSystem — как в системе (prefers-color-scheme)
    ctSystem = "system", ctLight = "light", ctDark = "dark"

proc el*(tag: string, class = "", text = ""): Element =
  ## Элемент с классами и текстом
  result = document.createElement(tag.cstring)
  if class.len > 0:
    result.setAttribute("class", class.cstring)
  if text.len > 0:
    result.textContent = text.cstring

proc add*(parent: Element, children: varargs[Element]): Element {.discardable.} =
  for child in children:
    if child != nil:
      parent.appendChild(child)
  parent

proc setTheme*(theme: ColorTheme) =
  ## Тема страницы: data-theme на <html>; ctSystem снимает его — тема как в системе
  let html = document.documentElement
  if theme == ctSystem:
    html.removeAttribute("data-theme")
  else:
    html.setAttribute("data-theme", cstring($theme))

proc mount*(root: Element) =
  ## Основа страницы TUGEN: фон, шрифт и цвет текста
  root.classList.add("tg-root")

proc text*(content: string, tone = ttDefault, size = "sm", bold = false): Element =
  var class = "tg-text tg-text--" & size
  if tone != ttDefault:
    class.add " tg-text--" & $tone
  if bold:
    class.add " tg-text--bold"
  el("span", class, content)

proc icon(svg: string): Element =
  ## SVG иконки разметкой: цвет — currentColor, как у соседнего текста
  result = el("span")
  result.setAttribute("aria-hidden", "true")
  result.style.display = "inline-flex"
  result.innerHTML = svg.cstring

proc button*(label: string, variant = bvPrimary, size = bsMd, iconSvg = "",
             onClick: proc() = nil): Element =
  var class = "tg-button"
  if variant != bvPrimary:
    class.add " tg-button--" & $variant
  if size == bsSm:
    class.add " tg-button--sm"
  result = el("button", class)
  result.setAttribute("type", "button")
  if iconSvg.len > 0:
    result.add icon(iconSvg)
  result.add el("span", "", label)
  if onClick != nil:
    result.addEventListener("click", proc(e: Event) = onClick())

proc iconButton*(iconSvg, label: string, tone = itDefault, onClick: proc() = nil): Element =
  ## Квадратная кнопка-иконка: label — для экранного диктора
  var class = "tg-icon-button"
  if tone != itDefault:
    class.add " tg-icon-button--" & $tone
  result = el("button", class)
  result.setAttribute("type", "button")
  result.setAttribute("aria-label", label.cstring)
  result.add icon(iconSvg)
  if onClick != nil:
    result.addEventListener("click", proc(e: Event) = onClick())

proc toggle*(checked: bool, label: string, onChange: proc(value: bool) = nil): Element =
  result = el("input", "tg-toggle")
  result.setAttribute("type", "checkbox")
  result.setAttribute("role", "switch")
  result.setAttribute("aria-label", label.cstring)
  let input = InputElement(result)
  input.checked = checked
  if onChange != nil:
    result.addEventListener("change", proc(e: Event) = onChange(input.checked))

proc checkRow*(label: string, description = "", checked = false,
               onChange: proc(value: bool) = nil): Element =
  ## Флажок с подписью и пояснением: нажимается вся строка
  result = el("label", "tg-check-row")
  let box = el("input", "tg-checkbox")
  box.setAttribute("type", "checkbox")
  let input = InputElement(box)
  input.checked = checked
  if onChange != nil:
    box.addEventListener("change", proc(e: Event) = onChange(input.checked))
  let body = el("span", "tg-row__text")
  body.add text(label)
  if description.len > 0:
    body.add el("span", "tg-row__description", description)
  result.add box, body

proc textField*(value = "", placeholder = "", mono = false, invalid = false,
                onInput: proc(value: string) = nil): Element =
  result = el("input", if mono: "tg-field tg-field--mono" else: "tg-field")
  let input = InputElement(result)
  input.value = value.cstring
  if placeholder.len > 0:
    result.setAttribute("placeholder", placeholder.cstring)
    result.setAttribute("aria-label", placeholder.cstring)
  if invalid:
    result.setAttribute("aria-invalid", "true")
  if onInput != nil:
    result.addEventListener("input", proc(e: Event) = onInput($input.value))

proc pickSegment(group, current: Element, picked: string,
                 onChange: proc(value: string)): proc(e: Event) =
  ## Обработчик нажатия отдельной процедурой: замыкание в теле цикла делило бы переменные
  ## между всеми итерациями
  result = proc(e: Event) =
    for other in group.children:
      other.setAttribute("aria-checked", cstring(if other == current: "true" else: "false"))
    if onChange != nil:
      onChange(picked)

proc segmented*(options: openArray[(string, string)], value: string,
                onChange: proc(value: string) = nil): Element =
  ## Выбор одного варианта: options — пары (значение, подпись)
  result = el("div", "tg-segmented")
  result.setAttribute("role", "radiogroup")
  for (optionValue, label) in options:
    let segment = el("button", "tg-segment", label)
    segment.setAttribute("type", "button")
    segment.setAttribute("role", "radio")
    segment.setAttribute("aria-checked", cstring(if optionValue == value: "true" else: "false"))
    segment.addEventListener("click", pickSegment(result, segment, optionValue, onChange))
    result.add segment

proc slider*(value: float, min = 0.0, max = 100.0, label = "",
             onChange: proc(value: float) = nil): Element =
  result = el("input", "tg-slider")
  result.setAttribute("type", "range")
  result.setAttribute("min", cstring($min))
  result.setAttribute("max", cstring($max))
  result.setAttribute("step", "any")
  if label.len > 0:
    result.setAttribute("aria-label", label.cstring)
  let input = InputElement(result)
  input.value = cstring($value)
  if onChange != nil:
    result.addEventListener("input", proc(e: Event) = onChange(input.valueAsNumber))

proc pill*(label: string, tone = ptNeutral): Element =
  el("span", "tg-pill tg-pill--" & $tone, label)

proc inline*(children: varargs[Element]): Element =
  ## Ряд элементов с промежутком: кнопки, метки
  result = el("div", "tg-inline")
  for child in children:
    result.add child

proc divider*(): Element =
  el("div", "tg-divider")

proc card*(rows: varargs[Element]): Element =
  ## Карточка со строками через разделитель
  result = el("div", "tg-card")
  for i, row in rows:
    if i > 0:
      result.add divider()
    result.add row

proc row*(title: string, description = "", controls: Element = nil, wide = false): Element =
  ## Строка карточки: подпись слева, элементы управления справа одной ширины
  result = el("div", "tg-row")
  let body = el("div", "tg-row__text")
  body.add text(title)
  if description.len > 0:
    body.add el("span", "tg-row__description", description)
  result.add body
  if controls != nil:
    let slot = el("div", if wide: "tg-row__controls tg-row__controls--wide" else: "tg-row__controls")
    slot.add controls
    result.add slot

proc section*(title: string, rows: varargs[Element]): Element =
  ## Раздел: подпись заглавными и под ней карточка
  result = el("section", "tg-section")
  result.add el("h2", "tg-section__title", title), card(rows)

proc emptyState*(iconSvg, title, description: string, action: Element = nil): Element =
  result = el("div", "tg-empty")
  let badge = el("div", "tg-empty__icon")
  badge.add icon(iconSvg)
  result.add badge, el("p", "tg-empty__title", title), el("p", "tg-empty__text", description), action

proc skeleton*(width, height: string, rounded = false): Element =
  ## Заглушка загрузки: размер — под то, что появится на этом месте
  result = el("div", "tg-skeleton")
  result.style.width = width.cstring
  result.style.height = height.cstring
  if rounded:
    result.style.borderRadius = "9999px"
