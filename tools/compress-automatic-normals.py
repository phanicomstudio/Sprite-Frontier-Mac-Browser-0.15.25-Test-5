"""November 1, 2026: losslessly compress only this build's generated relief art.

Original artwork and normal PNGs remain untouched. Pillow/WebP is a development
dependency only; the game ships decoded normal relief, never Python tooling.
"""
from pathlib import Path
import json
from PIL import Image


def compress():
    """Read the generated manifest, verify RGBA-equivalent lossless WebP files,
    then replace only its generated lit-PNG references and remove those verified
    generated PNGs. All paths must stay inside the dedicated generated folder.
    Raises on image mismatch/path escape before deleting the affected PNG.
    """
    root = Path(__file__).resolve().parent.parent
    generated = (root / 'assets/automatic-normals').resolve()
    manifest_path = generated / 'manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    before = after = 0
    for record in manifest['entries'].values():
        source = (root / record['lit']).resolve()
        if not source.is_relative_to(generated):
            raise ValueError('Relief image escaped the generated directory')
        if source.suffix == '.webp':
            continue
        target = source.with_suffix('.webp')
        with Image.open(source) as image:
            rgba = image.convert('RGBA')
            rgba.save(target, 'WEBP', lossless=True, method=4, exact=True)
            with Image.open(target) as decoded:
                if decoded.size != rgba.size or decoded.convert('RGBA').tobytes() != rgba.tobytes():
                    raise ValueError('Lossless relief verification failed: ' + source.name)
        before += source.stat().st_size
        after += target.stat().st_size
        record['lit'] = target.relative_to(root).as_posix()
        record['compression'] = 'webp-lossless-rgba-verified'
        metadata = generated / (source.name.removesuffix('.lit.png') + '.json')
        metadata.write_text(json.dumps(record, indent=2), encoding='utf-8')
        source.unlink()
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    (root / 'src/automatic-normal-manifest.js').write_text(
        '/* Generated offline normal/relief index; lossless RGBA verified. */\n'
        'window.FrontierAutomaticNormalManifest=' + json.dumps(manifest) + ';\n', encoding='utf-8')
    print('Lossless relief compression:', before, '->', after, 'bytes')


if __name__ == '__main__':
    compress()
