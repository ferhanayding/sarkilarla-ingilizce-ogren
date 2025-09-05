export type LyricLine = {
  t: string | null; // satırın başladığı saniye (örn: 12.5)
  en: string; // İngilizce orijinal
  tr: string; // Türkçe anlamı (elle)
  ph: string; // Türkçe okunuş (fenotip) (elle)
};

export type Song = {
  slug: string; // /song/[slug]
  title: string; // şarkı adı
  artist: string; // sanatçı
  youtubeId: string; // YouTube video ID (örn: "kXYiU_JCYtU")
  lines: LyricLine[]; // zamanlı satırlar
  tags?: string[]; // arama için opsiyonel etiketler
};

export const SONGS: Song[] = [
  {
    slug: "nothing-else-matters",
    title: "Nothing Else Matters",
    artist: "Metallica",
    youtubeId: "tAGnKpE4NCI",
    lines: [
      {
        t: "0.0",
        en: "So close, no matter how far...",
        ph: "so klouz, no metır hav far",
        tr: "Ne kadar uzak olsak da çok yakınız",
      },
      {
        t: "1.6",
        en: "Couldn't be much more from the heart",
        ph: "kudınt bi maç mor from dı hart",
        tr: "Daha kalpten olamazdı",
      },
      {
        t: "1.11",
        en: "Forever trusting who we are",
        ph: "forevır çırasting hu wi ar",
        tr: "Kim olduğumuza sonsuz güvenerek",
      },
      {
        t: "1.15",
        en: "And nothing else matters",
        ph: "end nating els metırz",
        tr: "Ve gerisi önemsiz",
      },
      {
        t: "1.23",
        en: "Never opened myself this way",
        ph: "Never opend myself tis vey",
        tr: "Ne yaptıkları umurumda olmadı",
      },

      {
        t: "1.28",
        en: "Life is ours, we live it our way",
        tr: "Hayat bizim, onu kendi yolumuzla yaşarız",
        ph: "Layf iz aorz, vi liv it aur vey",
      },
      {
        t: "1.33",
        en: "All these words, I don't just say",
        tr: "Bu sözlerin hepsi, sadece söylemiyorum",
        ph: "Ol diz vördz, ay dont cast sey",
      },
      {
        t: "1.38",
        en: "And nothing else matters",
        tr: "Ve başka hiçbir şey önemli değil",
        ph: "End nathing els metırz",
      },

      {
        t: "1.46",
        en: "Trust I seek and I find in you",
        tr: "Güven ararım ve sende bulurum",
        ph: "Trast ay siik end ay faynd in yu",
      },
      {
        t: "1.51",
        en: "Every day for us something new",
        tr: "Bizim için her gün yeni bir şey",
        ph: "Evri dey for as samthing nyu",
      },
      {
        t: "1.57",
        en: "Open mind for a different view",
        tr: "Farklı bir bakış için açık bir zihin",
        ph: "Opın maynd for a difrınt vyu",
      },
      {
        t: "2.01",
        en: "And nothing else matters",
        tr: "Ve başka hiçbir şey önemli değil",
        ph: "End nathing els metırz",
      },

      {
        t: "2.09",
        en: "Never cared for what they do",
        tr: "Ne yaptıkları hiç umurumda olmadı",
        ph: "Nevır keerd for vat dey du",
      },
      {
        t: "2.14",
        en: "Never cared for what they know",
        tr: "Ne bildikleri hiç umurumda olmadı",
        ph: "Nevır keerd for vat dey no",
      },
      { t: "2.19", en: "But I know", tr: "Ama ben biliyorum", ph: "Bat ay no" },

      {
        t: "2.25",
        en: "So close, no matter how far",
        tr: "Ne kadar uzak olsak da çok yakın",
        ph: "So klouz, no metır hav far",
      },
      {
        t: "2.31",
        en: "It couldn't be much more from the heart",
        tr: "Daha kalpten olamazdı",
        ph: "It kudınt bi maç mor from dı hart",
      },
      {
        t: "2.36",
        en: "Forever trusting who we are",
        tr: "Kim olduğumuza sonsuz güven",
        ph: "Forevır trasting hu vi ar",
      },
      {
        t: "2.40",
        en: "And nothing else matters",
        tr: "Ve başka hiçbir şey önemli değil",
        ph: "End nathing els metırz",
      },

      {
        t: "2.49",
        en: "Never cared for what they do",
        tr: "Ne yaptıkları hiç umurumda olmadı",
        ph: "Nevır keerd for vat dey du",
      },
      {
        t: "2.54",
        en: "Never cared for what they know",
        tr: "Ne bildikleri hiç umurumda olmadı",
        ph: "Nevır keerd for vat dey no",
      },
      { t: "2.58", en: "But I know", tr: "Ama ben biliyorum", ph: "Bat ay no" },

      {
        t: "3.45",
        en: "I never opened myself this way",
        tr: "Kendimi hiç böyle açmadım",
        ph: "Ay nevır opınd mayself dis vey",
      },
      {
        t: "3.50",
        en: "Life is ours, we live it our way",
        tr: "Hayat bizim, onu kendi yolumuzla yaşarız",
        ph: "Layf iz aorz, vi liv it aur vey",
      },
      {
        t: "3.55",
        en: "All these words, I don't just say",
        tr: "Bu sözlerin hepsi, sadece söylemiyorum",
        ph: "Ol diz vördz, ay dont cast sey",
      },
      {
        t: "4.00",
        en: "And nothing else matters",
        tr: "Ve başka hiçbir şey önemli değil",
        ph: "End nathing els metırz",
      },

      {
        t: "4.08",
        en: "Trust I seek and I find in you",
        tr: "Güven ararım ve sende bulurum",
        ph: "Trast ay siik end ay faynd in yu",
      },
      {
        t: "4.13",
        en: "Every day for us something new",
        tr: "Bizim için her gün yeni bir şey",
        ph: "Evri dey for as samthing nyu",
      },
      {
        t: "4.18",
        en: "Open mind for a different view",
        tr: "Farklı bir bakış için açık bir zihin",
        ph: "Opın maynd for a difrınt vyu",
      },
      {
        t: "4.23",
        en: "And nothing else matters",
        tr: "Ve başka hiçbir şey önemli değil",
        ph: "End nathing els metırz",
      },

      {
        t: "4.31",
        en: "Never cared for what they say",
        tr: "Ne söyledikleri hiç umurumda olmadı",
        ph: "Nevır keerd for vat dey sey",
      },
      {
        t: "4.36",
        en: "Never cared for games they play",
        tr: "Oynadıkları oyunlar hiç umurumda olmadı",
        ph: "Nevır keerd for geymz dey pley",
      },
      {
        t: "4.41",
        en: "Never cared for what they do",
        tr: "Ne yaptıkları hiç umurumda olmadı",
        ph: "Nevır keerd for vat dey du",
      },
      {
        t: "4.46",
        en: "Never cared for what they know",
        tr: "Ne bildikleri hiç umurumda olmadı",
        ph: "Nevır keerd for vat dey no",
      },
      {
        t: "4.51",
        en: "And I know, yeah, yeah",
        tr: "Ve biliyorum, evet, evet",
        ph: "End ay no, yey yey",
      },

      {
        t: "5.25",
        en: "So close, no matter how far",
        tr: "Ne kadar uzak olsak da çok yakın",
        ph: "So klouz, no metır hav far",
      },
      {
        t: "5.30",
        en: "Couldn't be much more from the heart",
        tr: "Kalpten daha fazlası olamazdı",
        ph: "Kudınt bi maç mor from dı hart",
      },
      {
        t: "5.35",
        en: "Forever trusting who we are",
        tr: "Kim olduğumuza sonsuz güven",
        ph: "Forevır trasting hu vi ar",
      },
      {
        t: "5.39",
        en: "No, nothing else matters",
        tr: "Hayır, başka hiçbir şey önemli değil",
        ph: "No, nathing els metırz",
      },
    ],
    tags: ["rock", "classic"],
  },
  {
  slug: "back-to-black",
  title: "Back to Black",
  artist: "Amy Winehouse",
  youtubeId: "TJAfLE39ZZ8",
  lines: [
    { t: "0.00", en: "He left no time to regret", tr: "Pişmanlığa zaman bırakmadı", ph: "Hi left no taym tu rigret" },
    { t: "0.21", en: "Kept his dick wet with his same old safe bet", tr: "Aynı eski güvenli bahsiyle işini görmeye devam etti", ph: "Kept hiz dik wet wid hiz seym old seyf bet" },
    { t: "0.31", en: "Me and my head high", tr: "Ben ve dik başım", ph: "Mi end may hed hay" },
    { t: "0.36", en: "And my tears dry, get on without my guy", tr: "Ve gözyaşlarım kurur, adamım olmadan devam ederim", ph: "End may tiirs dray, get on widaout may gay" },
    { t: "0.46", en: "You went back to what you knew", tr: "Sen bildiğine geri döndün", ph: "Yu went bek tu wat yu nuu" },
    { t: "0.52", en: "So far removed from all that we went through", tr: "Geçirdiğimiz her şeyden çok uzakta", ph: "So far rimuvd from ol det wi went thruu" },
    { t: "1.02", en: "And I tread a troubled track", tr: "Ve sorunlu bir yolda yürüyorum", ph: "End ay tred a trabld trek" },
    { t: "1.08", en: "My odds are stacked, I'll go back to black", tr: "Şansım tükenmiş, geri dönerim karanlığa", ph: "May adz ar stekt, ay'l go bek tu blek" },

    { t: "1.18", en: "We only said goodbye with words", tr: "Sadece sözlerle veda ettik", ph: "Wi onli sed gudbay wid wördz" },
    { t: "1.22", en: "I died a hundred times", tr: "Yüzlerce kez öldüm", ph: "Ay dayd a handrəd taymz" },
    { t: "1.26", en: "You go back to her, and I go back to-", tr: "Sen ona geri dönersin, ben ise geri dönerim-", ph: "Yu go bek tu hör, end ay go bek tu" },
    { t: "1.33", en: "I go back to us", tr: "Bize geri dönerim", ph: "Ay go bek tu as" },

    { t: "1.39", en: "I love you much", tr: "Seni çok seviyorum", ph: "Ay lav yu maç" },
    { t: "1.43", en: "It's not enough, you love blow and I love puff", tr: "Ama bu yetmez, sen kokaini seversin ben ise esrarı", ph: "Its nat inaf, yu lav bloo end ay lav paf" },
    { t: "1.53", en: "And life is like a pipe", tr: "Ve hayat bir pipo gibi", ph: "End layf iz layk a payp" },
    { t: "1.58", en: "And I'm a tiny penny rollin' up the walls inside", tr: "Ve ben iç duvarlarda yuvarlanan küçücük bir madeni para", ph: "End ay'm a tayni peni rolin ap de wolz insayd" },

    { t: "2.09", en: "We only said goodbye with words", tr: "Sadece sözlerle veda ettik", ph: "Wi onli sed gudbay wid wördz" },
    { t: "2.13", en: "I died a hundred times", tr: "Yüzlerce kez öldüm", ph: "Ay dayd a handrəd taymz" },
    { t: "2.17", en: "You go back to her, and I go back to-", tr: "Sen ona geri dönersin, ben ise geri dönerim-", ph: "Yu go bek tu hör, end ay go bek tu" },

    { t: "2.24", en: "We only said goodbye with words", tr: "Sadece sözlerle veda ettik", ph: "Wi onli sed gudbay wid wördz" },
    { t: "2.28", en: "I died a hundred times", tr: "Yüzlerce kez öldüm", ph: "Ay dayd a handrəd taymz" },
    { t: "2.32", en: "You go back to her, and I go back to-", tr: "Sen ona geri dönersin, ben ise geri dönerim-", ph: "Yu go bek tu hör, end ay go bek tu" },

    { t: "2.44", en: "Black, black", tr: "Kara, kara", ph: "Blek, blek" },
    { t: "2.53", en: "Black, black", tr: "Kara, kara", ph: "Blek, blek" },
    { t: "3.01", en: "Black, black", tr: "Kara, kara", ph: "Blek, blek" },
    { t: "3.10", en: "Black", tr: "Kara", ph: "Blek" },

    { t: "3.14", en: "I go back to-", tr: "Geri dönerim-", ph: "Ay go bek tu" },
    { t: "3.18", en: "I go back to-", tr: "Geri dönerim-", ph: "Ay go bek tu" },

    { t: "3.22", en: "We only said goodbye with words", tr: "Sadece sözlerle veda ettik", ph: "Wi onli sed gudbay wid wördz" },
    { t: "3.26", en: "I died a hundred times", tr: "Yüzlerce kez öldüm", ph: "Ay dayd a handrəd taymz" },
    { t: "3.30", en: "You go back to her, and I go back to-", tr: "Sen ona geri dönersin, ben ise geri dönerim-", ph: "Yu go bek tu hör, end ay go bek tu" },

    { t: "3.38", en: "We only said goodbye with words", tr: "Sadece sözlerle veda ettik", ph: "Wi onli sed gudbay wid wördz" },
    { t: "3.42", en: "I died a hundred times", tr: "Yüzlerce kez öldüm", ph: "Ay dayd a handrəd taymz" },
    { t: "3.45", en: "You go back to her, and I go back to black", tr: "Sen ona geri dönersin, ben ise karanlığa geri dönerim", ph: "Yu go bek tu hör, end ay go bek tu blek" },
  ],
  tags: ["soul", "jazz", "pop"]
},


];
