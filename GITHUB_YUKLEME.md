# YARIŞ LİSTESİ SİTESİNİ GITHUB'A YÜKLEME

## En kolay yöntem: GitHub sitesi üzerinden

1. [github.com](https://github.com) adresinde oturum açın.
2. Sağ üstteki **+** menüsünden **New repository** seçeneğine basın.
3. Repository name alanına `yaris-liste` yazın.
4. Görünürlüğü **Private** seçin. Site herkese açık olsa bile kaynak kodunun özel kalması için bu seçenek daha uygundur.
5. **Add a README**, `.gitignore` ve lisans seçeneklerini işaretlemeyin; proje bunları zaten içeriyor.
6. **Create repository** düğmesine basın.
7. Açılan boş depo sayfasında **uploading an existing file** bağlantısını seçin.
8. Proje klasöründeki bütün dosya ve klasörleri yükleme alanına sürükleyin. `.github`, `.openai` gibi noktayla başlayan klasörlerin de yüklendiğini kontrol edin.
9. Commit message alanına `İlk site sürümü` yazın ve **Commit changes** düğmesine basın.

Not: GitHub'ın web arayüzü çok sayıda veya büyük dosyada yüklemeyi reddederse aşağıdaki komut yöntemini kullanın.

## Komutla yükleme

Bilgisayarınızda Git kurulu olmalıdır. GitHub'da boş `yaris-liste` deposunu oluşturduktan sonra proje klasöründe Terminal veya PowerShell açıp aşağıdaki komutları çalıştırın:

```bash
git init
git add .
git commit -m "İlk site sürümü"
git branch -M main
git remote add github https://github.com/GITHUB_KULLANICI_ADINIZ/yaris-liste.git
git push -u github main
```

`GITHUB_KULLANICI_ADINIZ` bölümünü kendi GitHub kullanıcı adınızla değiştirin. GitHub parola isterse hesap parolası yerine Personal Access Token veya GitHub'ın tarayıcıyla oturum açma yöntemini kullanın.

## GitHub'dan Cloudflare Pages'a bağlama

1. Cloudflare panelinde **Workers & Pages** bölümüne girin.
2. **Create application > Pages > Connect to Git** yolunu izleyin.
3. GitHub hesabınızı bağlayıp `yaris-liste` deposunu seçin.
4. Production branch olarak `main` seçin.
5. Build command alanına `npm run build` yazın.
6. Build output directory alanına `dist` yazın.
7. **Save and Deploy** düğmesine basın.

Cloudflare ilk yayın sonunda `yaris-liste.pages.dev` benzeri bir adres oluşturur. Daha sonra **Custom domains** bölümünden `yaris.bilir.net.tr` eklenebilir.

## Güncelleme gönderme

Sitede daha sonra değişiklik yaptığınızda proje klasöründe şunları çalıştırın:

```bash
git add .
git commit -m "Site güncellendi"
git push github main
```

Cloudflare Pages, GitHub'a gönderilen her yeni sürümü otomatik olarak yayımlar.
