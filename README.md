# mertyavuz.com.tr — Portfolyo Sitesi

Bu klasör, tamamen statik (sunucu tarafında hiçbir şeye ihtiyaç duymayan)
HTML/CSS/JS ile hazırlanmış portfolyo sitendir. Herhangi bir paylaşımlı
hosting (cPanel vb.) üzerinde çalışır, ekstra kurulum gerekmez.

## Klasör yapısı

```
mertyavuz-portfolyo/
├── index.html              → Sitenin tamamı (tek sayfa)
├── css/style.css           → Görsel tasarım
├── js/script.js            → Dil değişimi, mobil menü, proje kartlarını çizme
├── js/projects-data.js     → PROJELERİNİ BURADAN EKLİYORSUN (aşağıya bak)
└── assets/
    ├── favicon.svg         → Sekme ikonu
    ├── Mert-Yavuz-CV.pdf   → "CV İndir" butonunun bağlandığı dosya
    └── projects/           → Proje görsellerini buraya koyacaksın
```

## Yeni bir proje nasıl eklenir?

1. `js/projects-data.js` dosyasını bir metin editörüyle aç (Not Defteri,
   VS Code, ya da hangisi elinin altındaysa).
2. Dosyanın içindeki ÖRNEK bloğunu kopyala (ya da örneği referans alıp
   yeni bir tane yaz), `projects = [ ... ]` listesinin içine yapıştır.
3. Alanları doldur:
   - `title_tr` / `title_en` → Proje adı (TR ve EN)
   - `description_tr` / `description_en` → 1-2 cümlelik açıklama
   - `tags` → Kullandığın teknolojiler, örn: `["Unity", "C#"]`
   - `image` → (opsiyonel) `assets/projects/` klasörüne koyduğun görselin
     yolu, örn: `"assets/projects/park-ustasi.png"`. Görselin yoksa bu
     satırı tamamen silebilirsin.
   - `link` → (opsiyonel) canlı/yayındaki proje linki
   - `github` → (opsiyonel) kaynak kod linki
   - `date` → örn. `"2026"`
4. Dosyayı kaydet. `index.html`'i tarayıcıda açtığında (ya da siteyi
   güncellediğinde) yeni proje otomatik olarak kart olarak görünecek.
   Hiçbir HTML dosyasına dokunmana gerek yok.

Bir proje kaldırmak istersen, ilgili `{ ... }` bloğunu tamamen silmen
yeterli.

İstersen bana ("Claude"a) da yeni bir proje anlatabilirsin — sohbette
projeyi tarif etmen yeterli, `projects-data.js` dosyasını senin için ben
güncelleyip teslim ederim.

## Siteyi kendi bilgisayarında nasıl önizlersin?

`index.html` dosyasına çift tıklayıp doğrudan tarayıcıda açabilirsin —
başka bir şeye gerek yok.

## mertyavuz.com.tr'ye nasıl yüklersin?

Hosting sağlayıcına göre değişir ama genel akış şöyle:

1. Hosting panelinde (çoğunlukla cPanel) **Dosya Yöneticisi**'ni
   (File Manager) aç, ya da bir FTP programı (FileZilla gibi) ile
   sunucuna bağlan.
2. `public_html` klasörüne (bazı sağlayıcılarda `www` veya
   `httpdocs` olabilir) gir.
3. Bu klasördeki **tüm dosya ve alt klasörleri** (`index.html`, `css/`,
   `js/`, `assets/`) oraya yükle.
4. Birkaç dakika içinde https://mertyavuz.com.tr adresinden site
   yayında olur.

## Ne yapıldı, ne yapılmadı

- İçerik: "Hakkımda", "Yetenekler", "Deneyim" ve "Eğitim" bölümleri
  paylaştığın CV'den dolduruldu. "Projeler" bölümü şu an boş — yukarıdaki
  adımlarla dilediğin zaman ekleyebilirsin.
- Site TR/EN dil değiştirme butonuyla geliyor (sağ üstte).
- Sosyal medya / GitHub / LinkedIn linki eklemedim çünkü bana
  paylaşmadın — istersen söyle, `index.html`'deki iletişim bölümüne
  ekleyebilirim (ya da sen de aynı bölümdeki `contact-card` bloklarından
  birini kopyalayıp kendin ekleyebilirsin).
