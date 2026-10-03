import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
async function walk(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      files.map((f) =>
        f.isDirectory() ? walk(path.join(dir, f.name)) : path.join(dir, f.name),
      ),
    )
  ).flat();
}
const files = (await walk("raw messy data")).filter((f) => f.endsWith(".md"));
const sources = new Map();
for (const file of files) {
  const text = (await fs.readFile(file, "utf8"))
    .replaceAll("\\_", "_")
    .replaceAll("https://", "\nhttps://");
  for (const match of text.matchAll(
    /https:\/\/[^\s"<>]+?\.(?:jpeg|jpg|png|webp|gif|svg|mp4|mov)(?:\?[^\s)"<>]*)?/gi,
  )) {
    const url = match[0];
    if (!sources.has(url)) sources.set(url, []);
    sources.get(url).push(file);
  }
}
await fs.mkdir("public/media/source", { recursive: true });
const manifest = await Promise.all(
  [...sources].map(async ([url, sources]) => {
    const name =
      crypto.createHash("sha256").update(url).digest("hex").slice(0, 12) +
      path.extname(new URL(url).pathname);
    const local = "/media/source/" + name;
    try {
      const res = await fetch(url);
      if (!res.ok) throw Error(String(res.status));
      await fs.writeFile(
        "public" + local,
        Buffer.from(await res.arrayBuffer()),
      );
      return { url, local, sources: [...new Set(sources)] };
    } catch (e) {
      return { url, error: String(e), sources: [...new Set(sources)] };
    }
  }),
);
await fs.writeFile(
  "docs/media-manifest.json",
  JSON.stringify(manifest, null, 2),
);
console.log(
  JSON.stringify(
    manifest.map(({ url, local, error }) => ({ url, local, error })),
    null,
    2,
  ),
);
