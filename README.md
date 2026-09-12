# Yarış Listesi Dönüştürücü

## GitHub'a yükleme

Bu projenin GitHub'a aktarılması ve ardından Cloudflare Pages üzerinde yayımlanması için Türkçe adım adım rehber: [GITHUB_YUKLEME.md](GITHUB_YUKLEME.md)

The live site serves the `dist` directory. PDF text and table boundaries are read locally in the browser with PDF.js loaded from jsDelivr. No external AI connections or document uploads are used. Scanned PDFs need a text layer.

Club labels preserve their numeric suffixes, spaces and punctuation, with Turkish uppercase applied. FERDİ 06 and FERDİ-6 remain distinct and are never expanded to inferred club names.

Validation: supplied 15-row PDF, 40 CM height, FERDİ variants in CSV/TXT, DOM references and asset paths. Reference participant data is not shipped with the site.

Original React source at the root also uses the same local parser; the deployed entrypoint is `dist/index.html`. The equestrian banner was generated for this site. PDF.js is loaded from the pinned `pdfjs-dist` CDN release, so the repository does not need to store its large vendor bundle.
