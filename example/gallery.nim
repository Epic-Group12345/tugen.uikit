## Витрина UI-kit для веба без React: все элементы nim/tugen_uikit.nim на одной странице.
## CI собирает её `nim js`, как и settings.nim. Открыть в браузере: example/gallery.html
import std/dom
import tugen_uikit

const
  # Простые иконки 16×16: kit не навязывает набор, иконка — разметка SVG
  plusSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M7.25 3h1.5v4.25H13v1.5H8.75V13h-1.5V8.75H3v-1.5h4.25z\"/></svg>"
  playSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M4 2.5v11l9-5.5z\"/></svg>"
  trashSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M6 2h4l.5 1H13v1.5H3V3h2.5zM4 5.5h8l-.6 8.5H4.6z\"/></svg>"
  dotsSvg = "<svg viewBox=\"0 0 16 16\"><circle cx=\"3.5\" cy=\"8\" r=\"1.5\"/><circle cx=\"8\" cy=\"8\" r=\"1.5\"/><circle cx=\"12.5\" cy=\"8\" r=\"1.5\"/></svg>"
  searchSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M7 2a5 5 0 0 1 3.9 8.1l3.5 3.5-1.1 1.1-3.5-3.5A5 5 0 1 1 7 2zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z\"/></svg>"
  infoSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M8 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM7.25 7v4.5h1.5V7zm0-2.5V6h1.5V4.5z\"/></svg>"
  boldSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M4 2.5h4.5a3 3 0 0 1 2 5.25A3.25 3.25 0 0 1 9 13.5H4zm2 2v2.5h2.5a1.25 1.25 0 0 0 0-2.5zm0 4.5v2.5h3a1.25 1.25 0 0 0 0-2.5z\"/></svg>"
  gridSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M2 2h5v5H2zm7 0h5v5H9zM2 9h5v5H2zm7 0h5v5H9z\"/></svg>"
  homeSvg = "<svg viewBox=\"0 0 16 16\"><path d=\"M8 1.5l6.5 5.5V14.5H10V10H6v4.5H1.5V7z\"/></svg>"

proc group(title: string, children: varargs[Element]): Element =
  ## Раздел витрины: подпись и карточка с отступом 16 (контейнер правила радиусов xl + 16 → 0)
  result = el("section", "tg-section")
  let box = el("div", "tg-card")
  box.style.padding = "16px"
  box.style.display = "flex"
  box.style.flexDirection = "column"
  box.style.gap = "16px"
  for child in children:
    box.add child
  result.add el("h2", "tg-section__title", title), box

proc stack(children: varargs[Element]): Element =
  result = el("div")
  result.style.display = "flex"
  result.style.flexDirection = "column"
  result.style.gap = "8px"
  for child in children:
    result.add child

proc caption(content: string): Element =
  text(content, ttMuted, "xs")

let root = document.getElementById("app")
mount(document.body)

root.add inline(
  text("TUGEN UI-kit", size = "xl", bold = true),
  segmented([("system", "Системная"), ("light", "Светлая"), ("dark", "Тёмная")], "system",
    proc(value: string) =
      setTheme(case value
        of "light": ctLight
        of "dark": ctDark
        else: ctSystem), rounded = true))

# Кнопки и клавиши
root.add group("Кнопки",
  inline(
    button("Главное", iconSvg = plusSvg),
    button("Нейтральная", bvSecondary),
    button("Играть", bvPlay, iconSvg = playSvg),
    button("Без фона", bvGhost),
    button("С рамкой", bvOutline),
    button("Удалить", bvDanger, iconSvg = trashSvg)),
  inline(
    button("Маленькая", bvSecondary, bsSm),
    button("Обычная", bvSecondary),
    button("Большая", bvPrimary, bsLg),
    iconButton(dotsSvg, "Ещё"),
    iconButton(trashSvg, "Удалить", itDanger)),
  inline(
    toggleButton("Закрепить", pressed = true),
    toggleButton("", iconSvg = boldSvg, accessibleLabel = "Жирный"),
    toggleGroup([("left", "Слева"), ("center", "По центру"), ("right", "Справа")], ["center"],
      multiple = false, label = "Выравнивание"),
    kbdCombo(["Ctrl", "K"]),
    kbd("Esc")))

# Формы
root.add group("Формы",
  field("Название сборки", inputField("Выживание с друзьями", "Название"),
    description = "Видно в списке сборок"),
  field("Поиск модов", inputField("", "Sodium, Iris…", leadingSvg = searchSvg,
    trailing = button("Найти", bvSecondary, bsSm))),
  field("Адрес сервера", inputField("mc.example", "Адрес", mono = true),
    error = "Сервер не отвечает"),
  field("Версия", select([("1.21.4", "1.21.4"), ("1.20.1", "1.20.1"), ("1.16.5", "1.16.5")],
    "", placeholder = "Выберите версию", label = "Версия")),
  field("Музыка", switch(true, "Музыка"), description = "Фоновая музыка в лаунчере",
    horizontal = true),
  inline(checkbox(true, "Выбрать всё", indeterminate = true), caption("Выбрано не всё"),
    checkbox(true, "Выбрано"), checkbox(false, "Не выбрано")),
  radioGroup([("fabric", "Fabric", "Лёгкий, быстро обновляется"),
              ("forge", "Forge", "Большинство старых модов"),
              ("vanilla", "Без модов", "")], "fabric", "Загрузчик"),
  segmented([("low", "Низкая"), ("mid", "Средняя"), ("high", "Высокая")], "mid", rounded = true))

# Окна
var confirmDialog, infoDialog, filters, bottomPanel: Modal
confirmDialog = dialog("Удалить сборку?", "Миры и настройки сборки «Выживание» пропадут " &
  "навсегда. Скриншоты останутся в папке игры.",
  footer = @[
    button("Отмена", bvSecondary, onClick = proc() = confirmDialog.close()),
    button("Удалить", bvDanger, onClick = proc() =
      confirmDialog.close()
      toast("Сборка удалена", tone = atNeutral, actionLabel = "Вернуть"))],
  closeLabel = "", dismissable = false)
infoDialog = dialog("Новая сборка", "Сборка — отдельная папка игры со своими модами.",
  body = stack(
    field("Название", inputField("", "Название")),
    field("Версия", select([("1.21.4", "1.21.4"), ("1.20.1", "1.20.1")], "1.21.4", label = "Версия"))),
  footer = @[
    button("Отмена", bvSecondary, onClick = proc() = infoDialog.close()),
    button("Создать", onClick = proc() =
      infoDialog.close()
      toast("Сборка создана", "Можно добавлять моды", atSuccess, infoSvg))])
filters = sheet("Фильтры", "Что показывать в каталоге модов",
  body = stack(checkRow("Только для Fabric", "", true), checkRow("Совместимые с 1.21.4", "", false)),
  footer = @[button("Сбросить", bvGhost, onClick = proc() = filters.close()),
             button("Готово", onClick = proc() = filters.close())])
bottomPanel = sheet("Загрузки", "Две загрузки идут", body = stack(
  progress(40, label = "Sodium"), progress(indeterminate = true, label = "Iris")), side = ssBottom)

let contextArea = el("div", "tg-surface--neutral")
contextArea.style.padding = "24px"
contextArea.style.textAlign = "center"
contextArea.add text("Правая кнопка мыши — контекстное меню", ttMuted)
contextMenu(contextArea, [
  menuItem("Открыть", shortcut = "Enter"),
  menuItem("Переименовать", shortcut = "F2"),
  menuSeparator(),
  menuItem("Удалить", destructive = true, iconSvg = trashSvg)])

root.add group("Окна",
  inline(
    button("Диалог", onClick = proc() = infoDialog.open()),
    button("Подтверждение", bvDanger, onClick = proc() = confirmDialog.open()),
    button("Панель справа", bvSecondary, onClick = proc() = filters.open()),
    button("Панель снизу", bvSecondary, onClick = proc() = bottomPanel.open())),
  inline(
    dropdownMenu(button("Меню", bvSecondary), [
      menuLabel("Сборка"),
      menuItem("Открыть папку", iconSvg = gridSvg, shortcut = "Ctrl+O"),
      menuItem("Дублировать", inset = true),
      menuCheck("Показывать скрытые", true),
      menuSeparator(),
      menuItem("Удалить", destructive = true, iconSvg = trashSvg)]),
    popover(button("Подробнее", bvOutline),
      popoverBody("Fabric 0.16.9", "Загрузчик модов для 1.21.4",
        popoverRow("Модов", "42"), popoverRow("Размер", "318 МБ"))),
    hoverCard(button("Наведите", bvGhost),
      popoverBody("Steve", "В игре: Выживание с друзьями")),
    tooltip(iconButton(infoSvg, "Справка"), "Подсказка появляется через 500 мс"),
    button("Уведомление", bvSecondary, onClick = proc() =
      toast("Загрузка завершена", "Sodium 0.6.0 установлен", atSuccess, infoSvg)),
    button("Ошибка", bvSecondary, onClick = proc() =
      toast("Не удалось скачать", "Проверьте подключение", atDanger, infoSvg,
        actionLabel = "Повторить"))),
  contextArea)

# Вкладки и раскрывающиеся блоки
root.add group("Вкладки",
  tabs([tab("mods", "Моды", text("42 мода, 3 отключены", ttSecondary)),
        tab("worlds", "Миры", text("2 мира", ttSecondary)),
        tab("shots", "Скриншоты", text("Пока пусто", ttSecondary))], "mods", label = "Разделы"),
  tabs([tab("all", "Все", text("Все сборки", ttSecondary)),
        tab("fav", "Избранные", text("Избранные сборки", ttSecondary)),
        tab("recent", "Недавние", text("Недавние сборки", ttSecondary))], "all", tvUnderline),
  tabs([tab("home", "Главная", text("Главная страница", ttSecondary), homeSvg),
        tab("builds", "Сборки", text("Список сборок", ttSecondary), gridSvg),
        tab("info", "О программе", text("Версия 0.1.0", ttSecondary), infoSvg)], "builds",
       tvVertical))

root.add group("Раскрывающиеся блоки",
  accordion([("Что такое сборка?", text("Отдельная папка игры: версия, загрузчик, моды и миры.", ttSecondary)),
             ("Где хранятся миры?", text("В папке saves внутри сборки.", ttSecondary)),
             ("Можно ли перенести сборку?", text("Да: экспорт в архив в меню сборки.", ttSecondary))],
            openIndex = 0),
  accordion([("Память", text("Сколько памяти отдать игре.", ttSecondary)),
             ("Аргументы JVM", text("Для опытных игроков.", ttSecondary))], card = true),
  collapsible("Дополнительно", text("Скрытые настройки сборки.", ttSecondary), iconSvg = gridSvg))

# Отображение
let nested = surface(skOverlay, "2", false,
  surface(skNeutral, "", true, text("Плашка в карточке: радиус 12 − 8 = 4")))
nested.style.maxWidth = "320px"
root.add group("Отображение",
  stack(caption("Прогресс"), progress(64), progress(30, tone = prPlay),
        progress(80, tone = prWarning), progress(indeterminate = true)),
  inline(
    avatar("Алексей Смирнов", size = avSm), avatar("Мария Иванова", status = avOnline),
    avatar("Steve", size = avLg, status = avAway), avatar("Alex", shape = avRounded, status = avBusy),
    avatar("Notch", size = avLg, shape = avRounded, ring = true, status = avOffline),
    avatarGroup(["Аня", "Борис", "Вера", "Глеб", "Дина"], max = 3)),
  alert("Доступно обновление", "Лаунчер 0.2.0 исправляет загрузку модов.", atInfo, infoSvg,
    button("Обновить", bvSecondary, bsSm)),
  alert("Сборка готова", "", atSuccess, infoSvg),
  alert("Мало памяти", "Игре выделено 2 ГБ — моды могут не загрузиться.", atWarning, infoSvg),
  alert("Ошибка запуска", "Java не найдена.", atDanger, infoSvg),
  alert("Подсказка", "Нейтральное сообщение без тона.", atNeutral),
  inline(text("Слева"), divider(vertical = true), text("Справа"), divider(vertical = true),
    pill("Fabric", ptViolet)),
  nested)
