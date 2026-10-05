## Пример страницы на UI-kit: раздел настроек, кнопки и метки. CI собирает его `nim js`, чтобы
## nim/tugen_uikit.nim не отставал от компилятора. Открыть в браузере: example/index.html
import std/dom
import tugen_uikit

let root = document.getElementById("app")
mount(document.body)

root.add section("Игра",
  row("Тема", "Как в системе, светлая или тёмная",
    segmented([("system", "Системная"), ("light", "Светлая"), ("dark", "Тёмная")], "system",
      proc(value: string) =
        setTheme(case value
          of "light": ctLight
          of "dark": ctDark
          else: ctSystem)), wide = true),
  row("Музыка", "Фоновая музыка в лаунчере", toggle(true, "Музыка")),
  row("Память", "Сколько памяти отдать игре", slider(4096, 1024, 16384, "Память")),
  row("Аргументы JVM", "", textField("-XX:+UseG1GC", mono = true), wide = true))

root.add inline(
  button("Играть", bvPlay),
  button("Открыть папку", bvSecondary, bsSm),
  pill("1.21.4", ptGreen),
  pill("Pay2Win", ptRed))

root.add checkRow("Fabric API", "Нужен большинству модов", true)
root.add emptyState("<svg viewBox=\"0 0 16 16\"><circle cx=\"8\" cy=\"8\" r=\"6\"/></svg>",
  "Скины — скоро", "Раздел появится в следующих версиях")
root.add skeleton("240px", "12px", rounded = true)
