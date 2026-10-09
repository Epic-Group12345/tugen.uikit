## UI-kit TUGEN для веба на Nim (`nim js`, std/dom): строит элементы с классами из
## css/tugen.css, того же вида, что компоненты React Native. Подключение в tugen.webservices:
## `import tugen_uikit` с `--path:node_modules/@tugen/uikit/nim`, CSS — `import '@tugen/uikit/css'`.

import std/dom

type
  ButtonVariant* = enum
    ## primary — одно главное действие на экране, secondary — нейтральная,
    ## play — зелёная, только запуск игры; ghost — без фона (панели инструментов),
    ## outline — с рамкой, danger — красная, необратимое действие
    bvPrimary = "primary", bvSecondary = "secondary", bvPlay = "play", bvGhost = "ghost",
    bvOutline = "outline", bvDanger = "danger"
  ButtonSize* = enum
    bsMd = "md", bsSm = "sm", bsLg = "lg"
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
  if size != bsMd:
    class.add " tg-button--" & $size
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
                onChange: proc(value: string) = nil, rounded = false): Element =
  ## Выбор одного варианта: options — пары (значение, подпись). rounded — дорожка
  ## со скруглением lg и сегменты md вместо капсулы
  result = el("div", if rounded: "tg-segmented tg-segmented--rounded" else: "tg-segmented")
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

proc divider*(vertical = false): Element =
  ## Линия между строками; vertical — черта между элементами ряда
  result = el("div", if vertical: "tg-divider tg-divider--vertical" else: "tg-divider")
  result.setAttribute("role", "separator")
  if vertical:
    result.setAttribute("aria-orientation", "vertical")

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

# ---------------------------------------------------------------------------------------------
# Общее для окон, меню и форм

proc setStyleVar(e: Element, name, value: cstring) {.importjs: "#.style.setProperty(#, #)".}
proc containsNode(parent, child: Element): bool {.importjs: "(#).contains(#)".}
proc targetOf(e: Event): Element {.importjs: "#.target".}
proc keyOf(e: Event): cstring {.importjs: "#.key".}
proc clientXOf(e: Event): int {.importjs: "#.clientX".}
proc clientYOf(e: Event): int {.importjs: "#.clientY".}
proc setIndeterminate(e: Element, value: bool) {.importjs: "#.indeterminate = #".}
proc nowMs(): float {.importjs: "Date.now()".}
proc initialsOf(name: cstring): cstring {.importjs:
  "(#).split(/\\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')".}

var idCounter = 0

proc nextId(prefix: string): string =
  ## Уникальный id для связей доступности: aria-controls, aria-describedby, for
  inc idCounter
  prefix & "-" & $idCounter

proc ensureId(e: Element, prefix: string): string =
  ## id элемента; нет своего — выдать новый. getAttribute без атрибута — null, а не ""
  if e.hasAttribute("id"):
    result = $e.getAttribute("id")
  if result.len == 0:
    result = nextId(prefix)
    e.setAttribute("id", result.cstring)

const crossSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M4 4l8 8M12 4l-8 8\" fill=\"none\" " &
  "stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg>"

const focusableSelector = "button:not(:disabled), [href], input:not(:disabled), " &
  "select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])"

type
  Layer = ref object
    ## Открытый слой: окно, меню, подсказка. Escape и нажатие мимо закрывают верхний
    close: proc()
    root: Element     ## само окно
    anchor: Element   ## кнопка, которая его открыла: нажатие по ней — не «мимо»
    outside: bool     ## закрывать нажатием мимо (у модального окна это делает затемнение)

var layers: seq[Layer]
var layersReady = false

proc onLayerKey(e: Event) =
  if layers.len > 0 and $keyOf(e) == "Escape":
    e.preventDefault()
    layers[^1].close()

proc onLayerPointer(e: Event) =
  if layers.len == 0:
    return
  let top = layers[^1]
  let target = targetOf(e)
  if top.outside and not containsNode(top.root, target) and
      (top.anchor == nil or not containsNode(top.anchor, target)):
    top.close()

proc pushLayer(layer: Layer) =
  ## Один обработчик на документ на все слои: закрывается только верхний, как в RN
  ## (useDismissLayer) — меню в диалоге закрывается раньше диалога
  if not layersReady:
    layersReady = true
    document.addEventListener("keydown", onLayerKey)
    document.addEventListener("pointerdown", onLayerPointer)
  layers.add layer

proc popLayer(layer: Layer) =
  let i = layers.find(layer)
  if i >= 0:
    layers.delete(i)

proc focusFirst(container: Element) =
  let first = container.querySelector(focusableSelector.cstring)
  if first != nil:
    first.focus()

# ---------------------------------------------------------------------------------------------
# Окна у кнопки: меню, выпадающий список, popover, карточка при наведении

type
  Popup* = ref object
    ## Окно у кнопки: anchor — обёртка (position: relative), окно встаёт под ней
    anchor*, trigger*, content*: Element
    isOpen*: bool
    layer: Layer
    onOpenChange: proc(open: bool)

proc place(p: Popup) =
  ## Простая раскладка: под кнопкой, над ней — если снизу нет места; прижать к правому краю
  ## якоря, если окно выходит за окно браузера
  p.content.classList.remove("tg-floating--top")
  p.content.classList.remove("tg-floating--end")
  let box = p.content.getBoundingClientRect()
  let anchorBox = p.anchor.getBoundingClientRect()
  if box.bottom > window.innerHeight.float and anchorBox.top > box.height + 8:
    p.content.classList.add("tg-floating--top")
  if box.right > window.innerWidth.float:
    p.content.classList.add("tg-floating--end")

proc close*(p: Popup) =
  if not p.isOpen:
    return
  p.isOpen = false
  popLayer(p.layer)
  p.anchor.removeChild(p.content)
  p.trigger.setAttribute("aria-expanded", "false")
  if p.onOpenChange != nil:
    p.onOpenChange(false)

proc open*(p: Popup, focus = true) =
  if p.isOpen:
    return
  p.isOpen = true
  p.anchor.appendChild(p.content)
  p.place()
  p.trigger.setAttribute("aria-expanded", "true")
  pushLayer(p.layer)
  if focus:
    focusFirst(p.content)
  if p.onOpenChange != nil:
    p.onOpenChange(true)

proc toggle*(p: Popup) =
  if p.isOpen: p.close() else: p.open()

proc popup(trigger, content: Element, stretch = false): Popup =
  ## Обёртка-якорь вокруг кнопки и окно, которое в ней появляется
  let p = Popup(trigger: trigger, content: content)
  p.anchor = el("div", if stretch: "tg-anchor tg-anchor--block" else: "tg-anchor")
  p.anchor.add trigger
  content.classList.add("tg-floating")
  if stretch:
    content.classList.add("tg-floating--stretch")
  trigger.setAttribute("aria-expanded", "false")
  p.layer = Layer(root: content, anchor: p.anchor, outside: true)
  p.layer.close = proc() =
    p.close()
    p.trigger.focus()
  p

type
  MenuEntryKind = enum
    mekItem, mekCheck, mekLabel, mekSeparator
  MenuEntry* = object
    ## Строка меню: пункт, пункт-флажок, подпись группы или линия
    kind: MenuEntryKind
    label, iconSvg, shortcut: string
    checked, destructive, disabled, inset: bool
    onSelect: proc()
    onCheck: proc(value: bool)

proc menuItem*(label: string, onSelect: proc() = nil, iconSvg = "", shortcut = "",
               destructive = false, disabled = false, inset = false): MenuEntry =
  ## Пункт меню: destructive — красный (удалить), inset — отступ под иконку соседей
  MenuEntry(kind: mekItem, label: label, onSelect: onSelect, iconSvg: iconSvg,
            shortcut: shortcut, destructive: destructive, disabled: disabled, inset: inset)

proc menuCheck*(label: string, checked: bool, onChange: proc(value: bool) = nil,
                shortcut = ""): MenuEntry =
  ## Пункт-флажок: галочка справа
  MenuEntry(kind: mekCheck, label: label, checked: checked, onCheck: onChange,
            shortcut: shortcut)

proc menuLabel*(label: string): MenuEntry =
  MenuEntry(kind: mekLabel, label: label)

proc menuSeparator*(): MenuEntry =
  MenuEntry(kind: mekSeparator)

proc menuRow(entry: MenuEntry, onDone: proc()): Element =
  ## Отдельной процедурой: замыкание в теле цикла делило бы переменные между итерациями
  case entry.kind
  of mekSeparator:
    result = el("div", "tg-menu__separator")
    result.setAttribute("role", "separator")
  of mekLabel:
    result = el("div", "tg-menu__label", entry.label)
  of mekItem, mekCheck:
    var class = "tg-menu__item"
    if entry.destructive:
      class.add " tg-menu__item--destructive"
    if entry.inset and entry.iconSvg.len == 0:
      class.add " tg-menu__item--inset"
    let item = el("button", class)
    result = item
    item.setAttribute("type", "button")
    item.setAttribute("tabindex", "-1")
    if entry.disabled:
      item.setAttribute("disabled", "")
    if entry.iconSvg.len > 0:
      item.add icon(entry.iconSvg)
    item.add el("span", "tg-menu__text", entry.label)
    if entry.shortcut.len > 0:
      item.add el("span", "tg-menu__shortcut", entry.shortcut)
    if entry.kind == mekCheck:
      item.setAttribute("role", "menuitemcheckbox")
      item.setAttribute("aria-checked", cstring(if entry.checked: "true" else: "false"))
      let check = el("span", "tg-menu__check")
      check.setAttribute("aria-hidden", "true")
      check.style.visibility = cstring(if entry.checked: "visible" else: "hidden")
      item.add check
      item.addEventListener("click", proc(e: Event) =
        let now = $item.getAttribute("aria-checked") != "true"
        item.setAttribute("aria-checked", cstring(if now: "true" else: "false"))
        check.style.visibility = cstring(if now: "visible" else: "hidden")
        if entry.onCheck != nil:
          entry.onCheck(now)
        if onDone != nil:
          onDone())
    else:
      item.setAttribute("role", "menuitem")
      item.addEventListener("click", proc(e: Event) =
        if entry.onSelect != nil:
          entry.onSelect()
        if onDone != nil:
          onDone())

proc menuItems(menu: Element): seq[Element] =
  for item in menu.querySelectorAll(".tg-menu__item:not(:disabled)"):
    result.add item

proc menuKeys(menu: Element): proc(e: Event) =
  ## Стрелки, Home и End переводят фокус между пунктами
  result = proc(e: Event) =
    let items = menuItems(menu)
    if items.len == 0:
      return
    var current = items.find(document.activeElement)
    case $keyOf(e)
    of "ArrowDown": current = (current + 1) mod items.len
    of "ArrowUp": current = (if current <= 0: items.len - 1 else: current - 1)
    of "Home": current = 0
    of "End": current = items.len - 1
    else: return
    e.preventDefault()
    items[current].focus()

proc menu*(entries: openArray[MenuEntry], onDone: proc() = nil): Element =
  ## Окно меню без поведения открытия: внутри — строки menuItem / menuCheck / menuLabel /
  ## menuSeparator. onDone — после выбора пункта (закрыть окно)
  result = el("div", "tg-menu")
  result.setAttribute("role", "menu")
  for entry in entries:
    result.add menuRow(entry, onDone)
  result.addEventListener("keydown", menuKeys(result))

proc dropdownMenu*(trigger: Element, entries: openArray[MenuEntry]): Element =
  ## Меню у кнопки: нажатие открывает и закрывает, выбор пункта, Escape и нажатие мимо —
  ## закрывают. trigger — любая кнопка (button, iconButton)
  var p: Popup
  let content = menu(entries, proc() = p.close())
  p = popup(trigger, content)
  trigger.setAttribute("aria-haspopup", "menu")
  trigger.addEventListener("click", proc(e: Event) = p.toggle())
  p.anchor

proc contextMenu*(target: Element, entries: openArray[MenuEntry]) =
  ## Меню по правой кнопке: встаёт у курсора и не выходит за окно браузера
  let items = @entries
  var layer: Layer
  var current: Element
  let closeMenu = proc() =
    if current != nil:
      popLayer(layer)
      document.body.removeChild(current)
      current = nil
  target.addEventListener("contextmenu", proc(e: Event) =
    e.preventDefault()
    closeMenu()
    let m = menu(items, closeMenu)
    m.classList.add("tg-floating")
    m.classList.add("tg-floating--fixed")
    document.body.appendChild(m)
    let box = m.getBoundingClientRect()
    let x = min(clientXOf(e), window.innerWidth - int(box.width) - 8)
    let y = min(clientYOf(e), window.innerHeight - int(box.height) - 8)
    m.style.left = cstring($max(8, x) & "px")
    m.style.top = cstring($max(8, y) & "px")
    current = m
    layer = Layer(root: m, outside: true, close: closeMenu)
    pushLayer(layer)
    focusFirst(m))

proc selectOption(valueLabel: Element, items: seq[Element], index: int,
                  picked, label: string, onChange: proc(value: string),
                  done: proc()): proc(e: Event) =
  ## Обработчик выбора отдельной процедурой: замыкание в теле цикла делило бы переменные
  result = proc(e: Event) =
    valueLabel.textContent = label.cstring
    valueLabel.classList.remove("tg-select__value--placeholder")
    for i, item in items:
      let on = i == index
      item.setAttribute("aria-selected", cstring(if on: "true" else: "false"))
      item.querySelector(".tg-menu__check").style.visibility =
        cstring(if on: "visible" else: "hidden")
    done()
    if onChange != nil:
      onChange(picked)

proc select*(options: openArray[(string, string)], value: string, placeholder = "",
             label = "", onChange: proc(value: string) = nil): Element =
  ## Выпадающий список: options — пары (значение, подпись), выбранный — с галочкой.
  ## Растягивается на ширину родителя, меню — по ширине кнопки
  let trigger = el("button", "tg-select")
  trigger.setAttribute("type", "button")
  trigger.setAttribute("aria-haspopup", "listbox")
  if label.len > 0:
    trigger.setAttribute("aria-label", label.cstring)
  let valueLabel = el("span", "tg-select__value tg-select__value--placeholder", placeholder)
  trigger.add valueLabel, el("span", "tg-chevron")
  let content = el("div", "tg-menu")
  content.setAttribute("role", "listbox")
  var items: seq[Element]
  for (optionValue, optionLabel) in options:
    let on = optionValue == value
    let item = el("button", "tg-menu__item")
    item.setAttribute("type", "button")
    item.setAttribute("tabindex", "-1")
    item.setAttribute("role", "option")
    item.setAttribute("aria-selected", cstring(if on: "true" else: "false"))
    item.add el("span", "tg-menu__text", optionLabel)
    let check = el("span", "tg-menu__check")
    check.setAttribute("aria-hidden", "true")
    check.style.visibility = cstring(if on: "visible" else: "hidden")
    item.add check
    items.add item
    content.add item
    if on:
      valueLabel.textContent = optionLabel.cstring
      valueLabel.classList.remove("tg-select__value--placeholder")
  content.addEventListener("keydown", menuKeys(content))
  let p = popup(trigger, content, stretch = true)
  let done = proc() =
    p.close()
    trigger.focus()
  for i, (optionValue, optionLabel) in options:
    items[i].addEventListener("click",
      selectOption(valueLabel, items, i, optionValue, optionLabel, onChange, done))
  trigger.addEventListener("click", proc(e: Event) = p.toggle())
  p.anchor

proc popoverBody*(title: string, description = "", rows: varargs[Element]): Element =
  ## Текстовая часть окна: заголовок и абзац с отступом от края
  result = el("div", "tg-popover__body")
  if title.len > 0:
    result.add el("p", "tg-popover__title", title)
  if description.len > 0:
    result.add el("p", "tg-popover__text", description)
  for row in rows:
    result.add row

proc popoverRow*(label, value: string): Element =
  ## Строка «подпись — значение» в popoverBody
  result = el("div", "tg-popover__row")
  result.add el("span", "", label), el("span", "", value)

proc popover*(trigger: Element, children: varargs[Element]): Element =
  ## Окно по нажатию: карточка с подробностями, небольшая форма. Внутри — popoverBody,
  ## кнопки и плашки (радиус по правилу: 12 − 4 = 8)
  let content = el("div", "tg-popover")
  content.setAttribute("role", "dialog")
  for child in children:
    content.add child
  let p = popup(trigger, content)
  trigger.setAttribute("aria-haspopup", "dialog")
  trigger.addEventListener("click", proc(e: Event) = p.toggle())
  p.anchor

proc hoverCard*(trigger: Element, children: varargs[Element]): Element =
  ## Карточка при наведении: профиль игрока, подробности сборки. Открывается с задержкой,
  ## закрывается не сразу — чтобы до неё можно было довести курсор
  let content = el("div", "tg-popover")
  for child in children:
    content.add child
  let p = popup(trigger, content)
  var timer: TimeOut
  let schedule = proc(open: bool) =
    if timer != nil:
      clearTimeout(timer)
    let fire = proc() =
      if open: p.open(focus = false) else: p.close()
    timer = setTimeout(fire, if open: 500 else: 300)
  p.anchor.addEventListener("mouseenter", proc(e: Event) = schedule(true))
  p.anchor.addEventListener("mouseleave", proc(e: Event) = schedule(false))
  trigger.addEventListener("focusin", proc(e: Event) = schedule(true))
  trigger.addEventListener("focusout", proc(e: Event) = schedule(false))
  p.anchor

proc tooltip*(target: Element, text: string, bottom = false): Element =
  ## Подсказка при наведении и фокусе: через 500 мс, как TOOLTIP_DELAY в RN. Возвращает
  ## обёртку — её и вставляйте вместо target
  result = el("span", "tg-anchor")
  result.add target
  let tip = el("span", if bottom: "tg-tooltip tg-tooltip--bottom" else: "tg-tooltip", text)
  tip.setAttribute("role", "tooltip")
  let id = nextId("tg-tooltip")
  tip.setAttribute("id", id.cstring)
  target.setAttribute("aria-describedby", id.cstring)
  let anchor = result
  var timer: TimeOut
  var shown = false
  let hide = proc() =
    if timer != nil:
      clearTimeout(timer)
      timer = nil
    if shown:
      shown = false
      anchor.removeChild(tip)
  let show = proc(delay: int) =
    if shown or timer != nil:
      return
    let fire = proc() =
      timer = nil
      shown = true
      anchor.appendChild(tip)
    timer = setTimeout(fire, delay)
  result.addEventListener("mouseenter", proc(e: Event) = show(500))
  result.addEventListener("mouseleave", proc(e: Event) = hide())
  result.addEventListener("pointerdown", proc(e: Event) = hide())
  target.addEventListener("focusin", proc(e: Event) = show(0))
  target.addEventListener("focusout", proc(e: Event) = hide())
  target.addEventListener("keydown", proc(e: Event) =
    if $keyOf(e) == "Escape": hide())

# ---------------------------------------------------------------------------------------------
# Модальные окна: диалог и панель

type
  SheetSide* = enum
    ssRight = "right", ssLeft = "left", ssBottom = "bottom"
  Modal* = ref object
    ## Модальное окно: open / close. backdrop — затемнение, window — само окно
    backdrop*, window*: Element
    isOpen*: bool
    dismissable: bool
    layer: Layer
    returnFocus: Element
    onClose: proc()

proc close*(m: Modal) =
  if not m.isOpen:
    return
  m.isOpen = false
  popLayer(m.layer)
  document.body.removeChild(m.backdrop)
  if m.returnFocus != nil:
    m.returnFocus.focus()
  if m.onClose != nil:
    m.onClose()

proc open*(m: Modal) =
  if m.isOpen:
    return
  m.isOpen = true
  m.returnFocus = document.activeElement
  document.body.appendChild(m.backdrop)
  pushLayer(m.layer)
  focusFirst(m.window)

proc trapFocus(m: Modal): proc(e: Event) =
  ## Tab не выходит из окна: с последнего элемента — на первый и обратно
  result = proc(e: Event) =
    if $keyOf(e) != "Tab":
      return
    let all = m.window.querySelectorAll(focusableSelector.cstring)
    if all.len == 0:
      return
    let first = all[0]
    let last = all[all.len - 1]
    if KeyboardEvent(e).shiftKey and document.activeElement == first:
      e.preventDefault()
      last.focus()
    elif not KeyboardEvent(e).shiftKey and document.activeElement == last:
      e.preventDefault()
      first.focus()

proc modal(window: Element, title: string, description: string, closeLabel: string,
           dismissable: bool, onClose: proc(), backdropClass = "tg-backdrop"): Modal =
  let m = Modal(window: window, dismissable: dismissable, onClose: onClose)
  m.backdrop = el("div", backdropClass)
  m.backdrop.add window
  window.setAttribute("role", cstring(if dismissable: "dialog" else: "alertdialog"))
  window.setAttribute("aria-modal", "true")
  m.layer = Layer(root: window, outside: false, close: proc() = m.close())
  # Нажатие по затемнению мимо окна закрывает его; у окна подтверждения — нет
  m.backdrop.addEventListener("click", proc(e: Event) =
    if m.dismissable and targetOf(e) == m.backdrop:
      m.close())
  m.backdrop.addEventListener("keydown", trapFocus(m))
  m

proc modalHeader(window: Element, class, title, description: string) =
  let header = el("div", class)
  let titleEl = el("h2", "tg-dialog__title", title)
  titleEl.setAttribute("id", nextId("tg-title").cstring)
  window.setAttribute("aria-labelledby", titleEl.getAttribute("id"))
  header.add titleEl
  if description.len > 0:
    let text = el("p", "tg-dialog__description", description)
    text.setAttribute("id", nextId("tg-description").cstring)
    window.setAttribute("aria-describedby", text.getAttribute("id"))
    header.add text
  window.add header

proc dialog*(title: string, description = "", body: Element = nil,
             footer: seq[Element] = @[], closeLabel = "Закрыть", dismissable = true,
             onClose: proc() = nil): Modal =
  ## Диалог по центру окна: заголовок, пояснение, содержимое и кнопки справа внизу.
  ## Escape закрывает, нажатие по затемнению — тоже, если dismissable (у подтверждения
  ## удаления — false). Кнопки в окне получают радиус по правилу: 16 − 8 = 8
  let window = el("div", "tg-dialog")
  var m: Modal
  modalHeader(window, if closeLabel.len > 0: "tg-dialog__header tg-dialog__header--close"
                      else: "tg-dialog__header", title, description)
  if body != nil:
    let wrap = el("div", "tg-dialog__body")
    wrap.add body
    window.add wrap
  if footer.len > 0:
    let row = el("div", "tg-dialog__footer")
    for b in footer:
      row.add b
    window.add row
  if closeLabel.len > 0:
    let corner = el("div", "tg-dialog__close")
    corner.add iconButton(crossSvg, closeLabel, onClick = proc() = m.close())
    window.add corner
  m = modal(window, title, description, closeLabel, dismissable, onClose)
  m

proc sheet*(title: string, description = "", body: Element = nil,
            footer: seq[Element] = @[], side = ssRight, closeLabel = "Закрыть",
            onClose: proc() = nil): Modal =
  ## Панель у края окна: фильтры, подробности. Скруглена со стороны окна (2xl + 8)
  let window = el("div", "tg-sheet tg-sheet--" & $side)
  var m: Modal
  modalHeader(window, "tg-sheet__header", title, description)
  if body != nil:
    let wrap = el("div", "tg-dialog__body")
    wrap.add body
    window.add wrap
  if footer.len > 0:
    let row = el("div", "tg-sheet__footer")
    for b in footer:
      row.add b
    window.add row
  if closeLabel.len > 0:
    let corner = el("div", "tg-dialog__close")
    corner.add iconButton(crossSvg, closeLabel, onClick = proc() = m.close())
    window.add corner
  m = modal(window, title, description, closeLabel, true, onClose,
            "tg-backdrop tg-backdrop--sheet")
  m

# ---------------------------------------------------------------------------------------------
# Вкладки, аккордеон, раскрывающийся блок

type
  TabsVariant* = enum
    ## segmented — дорожка с сегментами, underline — полоса под выбранной,
    ## vertical — боковой столбик, как вкладки лаунчера
    tvSegmented = "segmented", tvUnderline = "underline", tvVertical = "vertical"
  TabItem* = object
    value, label, iconSvg: string
    content: Element

proc tab*(value, label: string, content: Element, iconSvg = ""): TabItem =
  TabItem(value: value, label: label, content: content, iconSvg: iconSvg)

proc pickTab(triggers, panels: seq[Element], index: int, value: string,
             onChange: proc(value: string)): proc() =
  result = proc() =
    for i, t in triggers:
      let on = i == index
      t.setAttribute("aria-selected", cstring(if on: "true" else: "false"))
      t.setAttribute("tabindex", cstring(if on: "0" else: "-1"))
      if on:
        panels[i].removeAttribute("hidden")
      else:
        panels[i].setAttribute("hidden", "")
    if onChange != nil:
      onChange(value)

proc tabKeys(triggers: seq[Element], vertical: bool): proc(e: Event) =
  ## Стрелки переводят фокус и выбор по кругу, Home и End — к первой и последней
  result = proc(e: Event) =
    let current = triggers.find(document.activeElement)
    if current < 0:
      return
    var next = current
    let key = $keyOf(e)
    if key == (if vertical: "ArrowDown" else: "ArrowRight"):
      next = (current + 1) mod triggers.len
    elif key == (if vertical: "ArrowUp" else: "ArrowLeft"):
      next = (current + triggers.len - 1) mod triggers.len
    elif key == "Home":
      next = 0
    elif key == "End":
      next = triggers.len - 1
    else:
      return
    e.preventDefault()
    triggers[next].focus()
    triggers[next].click()

proc tabs*(items: openArray[TabItem], value: string, variant = tvSegmented, fill = false,
           label = "", onChange: proc(value: string) = nil): Element =
  ## Вкладки: список (дорожка lg + 2 → вкладки md) и панели; видна панель выбранной
  result = el("div", if variant == tvVertical: "tg-tabs tg-tabs--vertical" else: "tg-tabs")
  var listClass = "tg-tabs__list"
  if variant != tvSegmented:
    listClass.add " tg-tabs__list--" & $variant
  if fill and variant != tvVertical:
    listClass.add " tg-tabs__list--fill"
  let list = el("div", listClass)
  list.setAttribute("role", "tablist")
  if label.len > 0:
    list.setAttribute("aria-label", label.cstring)
  if variant == tvVertical:
    list.setAttribute("aria-orientation", "vertical")
  result.add list
  var triggers, panels: seq[Element]
  for item in items:
    let trigger = el("button", if variant == tvVertical: "tg-tabs__trigger tg-tabs__trigger--vertical"
                               else: "tg-tabs__trigger")
    trigger.setAttribute("type", "button")
    trigger.setAttribute("role", "tab")
    if item.iconSvg.len > 0:
      if variant == tvVertical:
        let plate = el("span", "tg-tabs__plate")
        plate.add icon(item.iconSvg)
        trigger.add plate
      else:
        trigger.add icon(item.iconSvg)
    trigger.add el("span", "", item.label)
    let panel = el("div", "tg-tabs__panel")
    panel.setAttribute("role", "tabpanel")
    if item.content != nil:
      panel.add item.content
    let triggerId = nextId("tg-tab")
    let panelId = nextId("tg-tabpanel")
    trigger.setAttribute("id", triggerId.cstring)
    trigger.setAttribute("aria-controls", panelId.cstring)
    panel.setAttribute("id", panelId.cstring)
    panel.setAttribute("aria-labelledby", triggerId.cstring)
    list.add trigger
    result.add panel
    triggers.add trigger
    panels.add panel
  for i, item in items:
    let pick = pickTab(triggers, panels, i, item.value, onChange)
    triggers[i].addEventListener("click", proc(e: Event) = pick())
    let on = item.value == value
    triggers[i].setAttribute("aria-selected", cstring(if on: "true" else: "false"))
    triggers[i].setAttribute("tabindex", cstring(if on: "0" else: "-1"))
    if not on:
      panels[i].setAttribute("hidden", "")
  list.addEventListener("keydown", tabKeys(triggers, variant == tvVertical))

proc disclosure(title, iconSvg: string, open: bool, content: Element,
                onToggle: proc(open: bool)): Element =
  ## Строка-кнопка раскрытия: подпись, иконка и шеврон, который поворачивается на 180°
  result = el("button", "tg-disclosure")
  result.setAttribute("type", "button")
  result.setAttribute("aria-expanded", cstring(if open: "true" else: "false"))
  result.setAttribute("aria-controls", ensureId(content, "tg-disclosure").cstring)
  if iconSvg.len > 0:
    result.add icon(iconSvg)
  result.add el("span", "tg-disclosure__label", title)
  let chevron = el("span", "tg-disclosure__chevron")
  chevron.setAttribute("aria-hidden", "true")
  result.add chevron
  if not open:
    content.setAttribute("hidden", "")
  let button = result
  result.addEventListener("click", proc(e: Event) =
    let now = $button.getAttribute("aria-expanded") != "true"
    button.setAttribute("aria-expanded", cstring(if now: "true" else: "false"))
    if now: content.removeAttribute("hidden") else: content.setAttribute("hidden", "")
    if onToggle != nil:
      onToggle(now))

proc collapsible*(title: string, content: Element, open = false, iconSvg = "",
                  onToggle: proc(open: bool) = nil): Element =
  ## Раскрывающийся блок: строка-кнопка и содержимое под ней
  result = el("div", "tg-collapsible")
  let body = el("div", "tg-collapsible__content")
  body.add content
  result.add disclosure(title, iconSvg, open, body, onToggle), body

proc accordionToggle(root, item: Element, multiple: bool): proc(open: bool) =
  ## Без multiple раскрыт один пункт: остальные сворачиваются
  result = proc(open: bool) =
    if open and not multiple:
      for other in root.querySelectorAll(":scope > .tg-accordion__item > h3 > .tg-disclosure"):
        if not containsNode(item, other) and $other.getAttribute("aria-expanded") == "true":
          other.click()

proc accordion*(items: openArray[(string, Element)], card = false, multiple = false,
                openIndex = -1): Element =
  ## Аккордеон: пары (заголовок, содержимое). card — в карточке xl + 4, строки lg;
  ## иначе — строки с линией между ними
  result = el("div", if card: "tg-accordion tg-accordion--card" else: "tg-accordion")
  for i, (title, content) in items:
    let item = el("div", "tg-accordion__item")
    let body = el("div", "tg-accordion__content")
    body.setAttribute("role", "region")
    body.add content
    let heading = el("h3")
    heading.style.margin = "0"
    heading.style.font = "inherit"
    heading.add disclosure(title, "", i == openIndex, body, accordionToggle(result, item, multiple))
    item.add heading, body
    result.add item

# ---------------------------------------------------------------------------------------------
# Формы: флажок, радиокнопки, переключатели, подпись и поле

proc switch*(checked: bool, label: string, onChange: proc(value: bool) = nil): Element =
  ## Переключатель «вкл / выкл» — то же, что toggle (Switch в RN)
  toggle(checked, label, onChange)

proc checkbox*(checked: bool, label: string, indeterminate = false,
               onChange: proc(value: bool) = nil): Element =
  ## Флажок без строки: в таблице, у заголовка списка. indeterminate — «выбрано не всё»
  result = el("input", "tg-checkbox")
  result.setAttribute("type", "checkbox")
  result.setAttribute("aria-label", label.cstring)
  result.style.marginTop = "0"
  let input = InputElement(result)
  input.checked = checked
  if indeterminate:
    setIndeterminate(result, true)
  if onChange != nil:
    result.addEventListener("change", proc(e: Event) = onChange(input.checked))

proc radioRow(name, value, label, description: string, checked: bool,
              onChange: proc(value: string)): Element =
  result = el("label", "tg-check-row")
  let radio = el("input", "tg-radio")
  radio.setAttribute("type", "radio")
  radio.setAttribute("name", name.cstring)
  radio.setAttribute("value", value.cstring)
  InputElement(radio).checked = checked
  if onChange != nil:
    radio.addEventListener("change", proc(e: Event) = onChange(value))
  let body = el("span", "tg-row__text")
  body.add text(label)
  if description.len > 0:
    body.add el("span", "tg-row__description", description)
  result.add radio, body

proc radioGroup*(options: openArray[(string, string, string)], value: string, label = "",
                 onChange: proc(value: string) = nil): Element =
  ## Один вариант из нескольких: тройки (значение, подпись, пояснение), нажимается вся строка
  result = el("div", "tg-radio-group")
  result.setAttribute("role", "radiogroup")
  if label.len > 0:
    result.setAttribute("aria-label", label.cstring)
  let name = nextId("tg-radio")
  for (optionValue, optionLabel, description) in options:
    result.add radioRow(name, optionValue, optionLabel, description, optionValue == value, onChange)

proc radioGroup*(options: openArray[(string, string)], value: string, label = "",
                 onChange: proc(value: string) = nil): Element =
  ## Варианты без пояснений: пары (значение, подпись)
  var full: seq[(string, string, string)]
  for (optionValue, optionLabel) in options:
    full.add (optionValue, optionLabel, "")
  radioGroup(full, value, label, onChange)

proc toggleButton*(label: string, pressed = false, iconSvg = "", accessibleLabel = "",
                   onChange: proc(pressed: bool) = nil): Element =
  ## Кнопка с состоянием «нажата»: жирный шрифт, закреп. Пустой label — только иконка,
  ## подпись для диктора — accessibleLabel
  result = el("button", if label.len > 0: "tg-toggle-button"
                        else: "tg-toggle-button tg-toggle-button--icon")
  result.setAttribute("type", "button")
  result.setAttribute("aria-pressed", cstring(if pressed: "true" else: "false"))
  if accessibleLabel.len > 0:
    result.setAttribute("aria-label", accessibleLabel.cstring)
  if iconSvg.len > 0:
    result.add icon(iconSvg)
  if label.len > 0:
    result.add el("span", "", label)
  let button = result
  result.addEventListener("click", proc(e: Event) =
    let now = $button.getAttribute("aria-pressed") != "true"
    button.setAttribute("aria-pressed", cstring(if now: "true" else: "false"))
    if onChange != nil:
      onChange(now))

proc pressSegment(group, segment: Element, multiple: bool,
                  onChange: proc(values: seq[string])): proc(e: Event) =
  result = proc(e: Event) =
    let now = $segment.getAttribute("aria-pressed") != "true"
    if not multiple:
      for other in group.children:
        other.setAttribute("aria-pressed", "false")
    segment.setAttribute("aria-pressed", cstring(if now: "true" else: "false"))
    if onChange != nil:
      var values: seq[string]
      for other in group.children:
        if $other.getAttribute("aria-pressed") == "true":
          values.add $other.getAttribute("data-value")
      onChange(values)

proc toggleGroup*(options: openArray[(string, string)], values: openArray[string],
                  multiple = true, rounded = true, label = "",
                  onChange: proc(values: seq[string]) = nil): Element =
  ## Группа кнопок-переключателей на дорожке: выравнивание, стиль текста. multiple — можно
  ## нажать несколько; без него — одна или ни одной. rounded — дорожка lg, кнопки md (8 − 2)
  result = el("div", if rounded: "tg-segmented tg-segmented--rounded tg-segmented--inline"
                     else: "tg-segmented tg-segmented--inline")
  result.setAttribute("role", "group")
  if label.len > 0:
    result.setAttribute("aria-label", label.cstring)
  for (optionValue, optionLabel) in options:
    let segment = el("button", "tg-segment", optionLabel)
    segment.setAttribute("type", "button")
    segment.setAttribute("data-value", optionValue.cstring)
    segment.setAttribute("aria-pressed", cstring(if optionValue in values: "true" else: "false"))
    segment.addEventListener("click", pressSegment(result, segment, multiple, onChange))
    result.add segment

proc formLabel*(content: string, forId = "", disabled = false): Element =
  ## Подпись поля или переключателя (Label): нажатие отдаётся связанному элементу
  result = el("label", "tg-label", content)
  if forId.len > 0:
    result.setAttribute("for", forId.cstring)
  if disabled:
    result.setAttribute("aria-disabled", "true")

proc field*(label: string, control: Element, description = "", error = "",
            horizontal = false): Element =
  ## Поле формы: подпись, элемент, пояснение и ошибка. Связи доступности (for,
  ## aria-describedby, aria-invalid) ставит само. horizontal — подпись слева, элемент справа
  # У поля с иконкой или кнопкой подписывается сам input внутри
  var target = control
  if control.classList.contains("tg-input"):
    let inner = control.querySelector(".tg-input__control")
    if inner != nil:
      target = inner
  let id = ensureId(target, "tg-control")
  var describedBy: seq[string]
  result = el("div", if horizontal: "tg-form-field tg-form-field--horizontal" else: "tg-form-field")
  let labelEl = formLabel(label, id)
  var descriptionEl, errorEl: Element
  if description.len > 0:
    descriptionEl = el("p", "tg-form-field__description", description)
    let did = nextId("tg-description")
    descriptionEl.setAttribute("id", did.cstring)
    describedBy.add did
  if error.len > 0:
    errorEl = el("p", "tg-form-field__error", error)
    let eid = nextId("tg-error")
    errorEl.setAttribute("id", eid.cstring)
    errorEl.setAttribute("aria-live", "polite")
    describedBy.add eid
    target.setAttribute("aria-invalid", "true")
    control.setAttribute("aria-invalid", "true")
  if describedBy.len > 0:
    var joined = ""
    for i, part in describedBy:
      if i > 0:
        joined.add " "
      joined.add part
    target.setAttribute("aria-describedby", joined.cstring)
  if horizontal:
    let column = el("div", "tg-form-field__text")
    column.add labelEl, descriptionEl, errorEl
    result.add column, control
  else:
    result.add labelEl, control, descriptionEl, errorEl

proc inputField*(value = "", placeholder = "", leadingSvg = "", trailing: Element = nil,
                 mono = false, invalid = false, onInput: proc(value: string) = nil): Element =
  ## Поле ввода с иконкой слева и кнопкой справа (TextField leading / trailing). С кнопкой
  ## поле — контейнер lg + 2: кнопка внутри получает md
  result = el("div", if trailing != nil: "tg-input tg-input--trailing" else: "tg-input")
  let input = el("input", if mono: "tg-input__control tg-input__control--mono"
                          else: "tg-input__control")
  InputElement(input).value = value.cstring
  if placeholder.len > 0:
    input.setAttribute("placeholder", placeholder.cstring)
    input.setAttribute("aria-label", placeholder.cstring)
  if invalid:
    result.setAttribute("aria-invalid", "true")
    input.setAttribute("aria-invalid", "true")
  if onInput != nil:
    input.addEventListener("input", proc(e: Event) = onInput($InputElement(input).value))
  let start = el("div", "tg-input__start")
  if leadingSvg.len > 0:
    let lead = el("span", "tg-input__icon")
    lead.add icon(leadingSvg)
    start.add lead
  start.add input
  result.add start
  if trailing != nil:
    result.add trailing
  # Нажатие по иконке или отступу ставит курсор в поле, как в RN
  let box = result
  result.addEventListener("pointerdown", proc(e: Event) =
    let t = targetOf(e)
    if t != input and (trailing == nil or not containsNode(trailing, t)):
      e.preventDefault()
      input.focus())
  discard box

# ---------------------------------------------------------------------------------------------
# Отображение: прогресс, аватар, сообщение, уведомление, клавиши, поверхности

type
  ProgressTone* = enum
    prAccent = "accent", prPlay = "play", prWarning = "warning", prDanger = "danger"
  AvatarSize* = enum
    avSm = "sm", avMd = "md", avLg = "lg"
  AvatarShape* = enum
    avCircle = "circle", avRounded = "rounded"
  AvatarStatus* = enum
    avNoStatus = "", avOnline = "online", avAway = "away", avBusy = "busy", avOffline = "offline"
  AlertTone* = enum
    atInfo = "info", atSuccess = "success", atWarning = "warning", atDanger = "danger",
    atNeutral = "neutral"
  SurfaceKind* = enum
    skWindow = "window", skPage = "page", skCard = "card", skOverlay = "overlay",
    skNeutral = "neutral"

proc setProgress*(bar: Element, value: float, max = 100.0) =
  ## Новое значение полосы: заливка доезжает сдвигом
  let share = if max > 0: clamp(value / max, 0.0, 1.0) else: 0.0
  bar.setAttribute("aria-valuenow", cstring($value))
  setStyleVar(bar, "--tg-progress", cstring($(share * 100)))

proc progress*(value = 0.0, max = 100.0, tone = prAccent, indeterminate = false,
               label = ""): Element =
  ## Полоса прогресса: загрузка, установка. indeterminate — бегунок без значения
  var class = "tg-progress"
  if tone != prAccent:
    class.add " tg-progress--" & $tone
  if indeterminate:
    class.add " tg-progress--indeterminate"
  result = el("div", class)
  result.setAttribute("role", "progressbar")
  result.setAttribute("aria-valuemin", "0")
  result.setAttribute("aria-valuemax", cstring($max))
  if label.len > 0:
    result.setAttribute("aria-label", label.cstring)
  result.add el("div", "tg-progress__fill")
  if indeterminate:
    result.setAttribute("aria-busy", "true")
  else:
    setProgress(result, value, max)

proc avatarClass(size: AvatarSize, shape: AvatarShape, ring: bool): string =
  result = "tg-avatar"
  if size != avMd:
    result.add " tg-avatar--" & $size
  if shape == avRounded:
    result.add " tg-avatar--rounded"
  if ring:
    result.add " tg-avatar--ring"

proc avatar*(alt: string, src = "", size = avMd, shape = avCircle, status = avNoStatus,
             ring = false): Element =
  ## Аватар: картинка, а без неё (или пока она не загрузилась) — инициалы. ring — обводка
  ## цветом страницы, радиус её = радиус аватара + 2
  result = el("span", avatarClass(size, shape, ring))
  let box = el("span", "tg-avatar__box")
  box.setAttribute("role", "img")
  box.setAttribute("aria-label", alt.cstring)
  let initials = el("span")
  initials.textContent = initialsOf(alt.cstring)
  initials.setAttribute("aria-hidden", "true")
  box.add initials
  if src.len > 0:
    let img = el("img")
    img.setAttribute("alt", "")
    img.setAttribute("src", src.cstring)
    img.style.display = "none"
    img.addEventListener("load", proc(e: Event) =
      img.style.display = "block"
      initials.style.display = "none")
    box.add img
  result.add box
  if status != avNoStatus:
    let dot = el("span", "tg-avatar__status tg-avatar__status--" & $status)
    dot.setAttribute("aria-label", cstring($status))
    result.add dot

proc avatarGroup*(names: openArray[string], max = 0, size = avMd,
                  shape = avCircle): Element =
  ## Аватары внахлёст: участники сервера, друзья в игре. max — сколько показать, остальные
  ## — плашкой «+N»
  result = el("span", "tg-avatar-group")
  let shown = if max > 0: min(max, names.len) else: names.len
  for i in 0 ..< shown:
    result.add avatar(names[i], size = size, shape = shape, ring = true)
  if names.len > shown:
    let rest = el("span", avatarClass(size, shape, true))
    rest.add el("span", "tg-avatar__box", "+" & $(names.len - shown))
    result.add rest

proc alert*(title: string, description = "", tone = atInfo, iconSvg = "",
            action: Element = nil): Element =
  ## Сообщение на странице: xl + 4, кнопки справа получают lg. Ошибку и предупреждение
  ## диктор зачитывает сразу
  result = el("div", "tg-alert tg-alert--" & $tone)
  result.setAttribute("role", cstring(if tone in {atDanger, atWarning}: "alert" else: "status"))
  let body = el("div", "tg-alert__body")
  if iconSvg.len > 0:
    let badge = el("span", "tg-alert__icon")
    badge.add icon(iconSvg)
    body.add badge
  let column = el("div", "tg-alert__text")
  if title.len > 0:
    column.add el("p", "tg-alert__title", title)
  if description.len > 0:
    column.add el("p", "tg-alert__description", description)
  body.add column
  result.add body
  if action != nil:
    let actions = el("div", "tg-alert__actions")
    actions.add action
    result.add actions

var toaster: Element

proc dismissToast(item: Element) =
  ## Закрыть с исчезновением: класс --closing, потом убрать из стопки
  if item.classList.contains("tg-toast--closing"):
    return
  item.classList.add("tg-toast--closing")
  let remove = proc() =
    if item.parentNode != nil:
      item.parentNode.removeChild(item)
  discard setTimeout(remove, 180)

proc toast*(title: string, description = "", tone = atNeutral, iconSvg = "",
            duration = 4000, actionLabel = "", onAction: proc() = nil,
            closeLabel = "Закрыть", center = false) =
  ## Уведомление в стопке внизу справа (center — по центру). Закрывается само через
  ## duration мс (0 — не закрывается); пока курсор над ним, отсчёт стоит
  if toaster == nil:
    toaster = el("div", "tg-toaster")
    document.body.appendChild(toaster)
  if center: toaster.classList.add("tg-toaster--center")
  else: toaster.classList.remove("tg-toaster--center")
  let item = el("div", "tg-toast" & (if tone != atNeutral: " tg-toast--" & $tone else: ""))
  item.setAttribute("role", cstring(if tone == atDanger: "alert" else: "status"))
  item.setAttribute("aria-live", "polite")
  if iconSvg.len > 0:
    let badge = el("span", "tg-toast__icon")
    badge.add icon(iconSvg)
    item.add badge
  let body = el("div", "tg-toast__body")
  body.add el("p", "tg-toast__title", title)
  if description.len > 0:
    body.add el("p", "tg-toast__description", description)
  item.add body
  if actionLabel.len > 0:
    item.add button(actionLabel, bvSecondary, bsSm, onClick = proc() =
      if onAction != nil:
        onAction()
      dismissToast(item))
  let closeButton = el("button", "tg-toast__close")
  closeButton.setAttribute("type", "button")
  closeButton.setAttribute("aria-label", closeLabel.cstring)
  closeButton.addEventListener("click", proc(e: Event) = dismissToast(item))
  item.add closeButton
  toaster.appendChild(item)
  if duration > 0:
    var remaining = duration
    var started = 0.0
    var timer: TimeOut
    let run = proc() =
      started = nowMs()
      let fire = proc() = dismissToast(item)
      timer = setTimeout(fire, remaining)
    item.addEventListener("mouseenter", proc(e: Event) =
      clearTimeout(timer)
      remaining = max(0, remaining - int(nowMs() - started)))
    item.addEventListener("mouseleave", proc(e: Event) = run())
    run()

proc kbd*(key: string): Element =
  ## Клавиша в подсказке: Esc, Ctrl
  el("kbd", "tg-kbd", key)

proc kbdCombo*(keys: openArray[string], separator = "+"): Element =
  ## Сочетание клавиш: Ctrl + K
  result = el("span", "tg-kbd-combo")
  var spoken = ""
  for i, key in keys:
    if i > 0:
      result.add el("span", "", separator)
      spoken.add " " & separator & " "
    result.add kbd(key)
    spoken.add key
  result.setAttribute("aria-label", spoken.cstring)

proc surface*(kind = skCard, padding = "", nested = false,
              children: varargs[Element]): Element =
  ## Поверхность: padding ("1", "2", "0.5"…) делает её контейнером правила радиусов,
  ## nested — радиус по правилу из ближайшего контейнера, а не свой
  var class = case kind
    of skCard: "tg-card"
    of skOverlay: "tg-overlay"
    else: "tg-surface--" & $kind
  if padding.len > 0:
    var step = padding
    for c in step.mitems:
      if c == '.':
        c = '_'
    class.add " tg-pad--" & step
  if nested:
    class.add " tg-nested"
  result = el("div", class)
  for child in children:
    result.add child
