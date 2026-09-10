import assert from "node:assert/strict"
import { readFile, readdir, stat } from "node:fs/promises"
import test from "node:test"
import { parse } from "parse5"

const output = new URL("../dist/", import.meta.url)
const homepage = parse(await readFile(new URL("index.html", output), "utf8"))
const notFound = parse(await readFile(new URL("404.html", output), "utf8"))

function elements(node, tag) {
  return [
    ...(node.tagName === tag ? [node] : []),
    ...(node.childNodes ?? []).flatMap(child => elements(child, tag)),
  ]
}

function attribute(node, name) {
  return node.attrs?.find(attr => attr.name === name)?.value
}

function content(node) {
  return node.nodeName === "#text"
    ? node.value
    : (node.childNodes ?? []).map(content).join("")
}

function metadata(page, name) {
  const matches = elements(page, "meta").filter(
    node =>
      attribute(node, "name") === name || attribute(node, "property") === name,
  )
  assert.equal(matches.length, 1, `Expected one ${name} meta tag`)
  return attribute(matches[0], "content")
}

test("homepage retains the profile and all four apps as static HTML", () => {
  assert.equal(attribute(elements(homepage, "html")[0], "lang"), "ja")
  assert.deepEqual(elements(homepage, "h1").map(content), ["堀江 良"])
  assert.match(
    content(homepage),
    /神戸でスマホアプリの会社を経営。個人開発から起業。/,
  )
  assert.deepEqual(elements(homepage, "h3").map(content), [
    "ピアノあそび",
    "ソングブック",
    "メロディ",
    "リズムあそび",
  ])
  assert.equal(elements(homepage, "article").length, 4)
})

test("every original video remains embedded, with only the hero loaded eagerly", () => {
  const frames = elements(homepage, "iframe")
  const sources = frames.map(frame => new URL(attribute(frame, "src")))
  assert.deepEqual(
    sources.map(url => url.pathname),
    [
      "/embed/oER4EpHfKws",
      "/embed/NGQeiAIIBng",
      "/embed/mf0p0TTOVuA",
      "/embed/6-GNhXMREck",
      "/embed/vXNWCKwZHg4",
      "/embed/1YuEkZuV0ng",
      "/embed/4DKr46fzFHg",
    ],
  )
  for (const [index, frame] of frames.entries()) {
    assert.equal(sources[index].origin, "https://www.youtube.com")
    assert.ok(attribute(frame, "title"))
    assert.equal(attribute(frame, "loading"), index === 0 ? "eager" : "lazy")
    assert.equal(attribute(frame, "allowfullscreen"), "")
    assert.equal(
      attribute(frame, "referrerpolicy"),
      "strict-origin-when-cross-origin",
    )
  }
  assert.equal(sources[0].searchParams.get("autoplay"), "0")
  assert.equal(sources[0].searchParams.get("loop"), "1")
  assert.equal(sources[0].searchParams.get("playlist"), "oER4EpHfKws")
})

test("company, channel, and social links retain their destinations and accessible names", () => {
  const external = elements(homepage, "a").filter(
    node => attribute(node, "target") === "_blank",
  )
  assert.deepEqual(
    external.map(node => attribute(node, "href")),
    [
      "https://www.genit.jp/",
      "https://www.youtube.com/channel/UCHlwtjvxbWa4rihfwIAl06Q",
      "https://twitter.com/ryohorie3",
      "https://www.facebook.com/ryo.horie5",
    ],
  )
  for (const link of external) {
    assert.match(attribute(link, "rel"), /noopener/)
    assert.ok(content(link).trim() || attribute(link, "aria-label"))
  }
})

test("SEO tags use the production origin and the existing OGP image", async () => {
  const title = "堀江 良 - 音楽アプリ開発者・株式会社GENIT代表"
  assert.deepEqual(elements(homepage, "title").map(content), [title])
  assert.equal(metadata(homepage, "og:title"), title)
  assert.equal(metadata(homepage, "twitter:title"), title)
  assert.equal(
    metadata(homepage, "description"),
    "株式会社GENIT代表 堀江 良のプロフィールサイトです。音楽アプリ開発者・ジャズミュージシャン。",
  )
  assert.equal(
    metadata(homepage, "og:description"),
    metadata(homepage, "description"),
  )
  assert.equal(
    metadata(homepage, "twitter:description"),
    metadata(homepage, "description"),
  )
  assert.equal(metadata(homepage, "og:url"), "https://ryohorie.com/")
  assert.equal(metadata(homepage, "twitter:card"), "summary_large_image")
  const canonical = elements(homepage, "link").filter(
    node => attribute(node, "rel") === "canonical",
  )
  assert.equal(canonical.length, 1)
  assert.equal(attribute(canonical[0], "href"), "https://ryohorie.com/")
  const imageUrl = "https://ryohorie.com/images/ogp.jpeg"
  assert.equal(metadata(homepage, "og:image"), imageUrl)
  assert.equal(metadata(homepage, "twitter:image"), imageUrl)
  assert.ok((await stat(new URL("images/ogp.jpeg", output))).size > 0)
})

test("all local image and stylesheet references resolve in the build", async () => {
  for (const page of [homepage, notFound]) {
    const paths = [
      ...elements(page, "img").map(node => attribute(node, "src")),
      ...elements(page, "link")
        .filter(node => attribute(node, "rel") === "stylesheet")
        .map(node => attribute(node, "href")),
    ]
    for (const path of paths) {
      assert.ok(path.startsWith("/") && !path.startsWith("//"))
      assert.ok((await stat(new URL(path.slice(1), output))).size > 0, path)
    }
  }
  for (const name of await readdir(
    new URL("../public/images/", import.meta.url),
  )) {
    assert.deepEqual(
      await readFile(new URL(`images/${name}`, output)),
      await readFile(new URL(`../public/images/${name}`, import.meta.url)),
      `Asset changed: ${name}`,
    )
  }
})

test("the static site ships without framework JavaScript", async () => {
  for (const page of [homepage, notFound]) {
    assert.equal(elements(page, "script").length, 0)
    assert.equal(elements(page, "astro-island").length, 0)
  }
  const files = await readdir(output, { recursive: true })
  assert.deepEqual(
    files.filter(file => /\.(m?js)$/.test(file)),
    [],
  )
})

test("Firebase serves the Astro build, including a Japanese 404 with a home link", async () => {
  const firebase = JSON.parse(
    await readFile(new URL("../firebase.json", import.meta.url), "utf8"),
  )
  assert.equal(firebase.hosting.public, "dist")
  assert.equal(firebase.hosting.rewrites, undefined)
  assert.equal(attribute(elements(notFound, "html")[0], "lang"), "ja")
  assert.match(
    content(elements(notFound, "h1")[0]),
    /404.*ページが見つかりません/,
  )
  assert.equal(metadata(notFound, "robots"), "noindex")
  assert.ok(
    elements(notFound, "a").some(
      node =>
        attribute(node, "href") === "/" &&
        content(node) === "トップページに戻る",
    ),
  )
  const files = await readdir(output, { recursive: true })
  assert.deepEqual(files.filter(file => file.endsWith(".html")).sort(), [
    "404.html",
    "index.html",
  ])
  for (const file of files.filter(file => file.endsWith(".html"))) {
    assert.doesNotMatch(
      await readFile(new URL(file, output), "utf8"),
      /gatsby/i,
    )
  }
})
