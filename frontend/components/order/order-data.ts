export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  badge?: string;
  rating: number;
};

export type MenuSection = {
  id: string;
  title: string;
  emoji: string;
  items: MenuItem[];
};

// ─── Imágenes compartidas por categoría (Google/Stitch CDN) ──────────────────
const IMG = {
  sushi1:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD9kTHDsuiCabDHLAfJabzfToXl0cT3kjxv6nQEX_-4emjl_Kux7cXp8cLkrZFnUMtOEhe0G8ka-ZzS2hLukUzIv6PBjS5q866TQAQjoEGB9c2c4lDsi2RLCy46svcotEjwaEPVRrUYs_O3u3pqE1GPLZxSXxkhI67_VrWLVDzgUE4bho9aPUzM-jcOiqfTcHJp_GnTLfnlpcQ8lgnr87LZPx_D33ug3FUpYoUB7yn3jKRFnzaqQRIrMOMi3w6Mn-atgDSWBb7AVdY0',
  sushi2:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBc929czbNNYOepQ756qcdeBycJUw-E_Lb0bWspcp4i58z1b2aoeP00MAsrwHZioWgROABNrO3edkzxWAKQE4PfkjlWBUtGz6BBICvlkYA_CuJ6aaKDfH6YlSXQxSK-o2uV1XjJTlD9Q2U01ihFqKjEcyRxc-gQR_Pdg2IHCpLKgiAocx8sEvxukbgvwwCh-Odi8BRnAxXtB_PgNPvPqYsxYimXBmxLyIJ3Bnm--rbdJqe5o0Tnt-bcq_6IOCPBbrUcBPitgdgFjJYU',
  sushi3:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAw99bPGjenPMgJE54EGOTsqB0kHQp7M0KNhDsaQzzOqrqgdksUdKIIr7_RfYxlY5Li8hq6G8OIqy_48yIyus8yVtoNIjoSoocy0cmN1UWmIqyt6_U_UU0BeBLdcTdLbXbbmDk3jHWpUbkqo1E9nG8JrDSvuJ3XVAWCe4Q9rwaV5Et1MSi1DgLr6l2mPHE-iY9C1mntdARE7SdKTjspOR35r37bVqPmUivPehtdmeP4HtIC-iq-B1nP_oH3gft_fLO6NwTOOwNXv3yi',
  sushi4:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCj-M-WflJSH5JzNa11ftmutnSrmcxC5LG0FatztkCD6yS4D1cf8CeKTH01Nzqlv4q3e3ALTT-EauL18I4L3CnyQdTNxxaX9BkqTbEDIXyzACanONrDDlozOexg9W8TmVVTLpfG50Uo1trhEi680sIMqXg25StDsrme6YyxuH-25FcrggDbH94FMhZ9I19aqs8bVUaAJ6vYGeCd7K35tMZZo3zhtsUv0Nh-xFo-d_1R5A5jGR2B1OpeKX0FuE0-ArSL33xwwu-elUsY',
  sushi5:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBqbhb59WqUoZCO4TEijkEk2wx5EysV23-ZYdS9JeR1jjJKZhHxO3M436eKRmKMmTwkJky5YxOcFdoT5X7Elo8WrcN_4p7iHQHrzwiepBeAhGqIP1P4qODfDyGQomBSZdYG9l51cBSx2NgmnFLecGyB6VE8E1nuG-kSSbx1_Ucuf1EB4JocR99276GMBxShw8WY1jhGKvzXIfpTyl0-nYuJ9ZER9OY15nlvPuken5BzWnV7ZLFm1LBYnrSkAXMnQUb3lvoz79Av7Zxt',
  alitas:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAmphbDn-VT8VJNw_NPHrq7A3Mzru80oPQhvGoPpdqOuXHx4daVcENbnRr4unk1Yva7rOy8nYgQs0K1k5cSdIndhdDrHlUZJRVNpi50vwledv5qtYAmF3kcimqsK82UMvkp9-uUhb_IY5gbSIxUGYNZnUKZHPzFOzyb7pGHOgxvjfEiY7XV-zo1vj88d7g113O3X0Tk2z-CRy5hWnuaG5fBnmO3kuXkKvQtTy4mlhbPUEkD-gii-uS-VHTJ33AhZZzPmGhks7vRdwTT',
  boneless:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA6pmnnEyH_-sg9my2JV8Q1Irm2H-v8kJXmEk5v0SXTx5D11Mz3eVhu5ZhgPJ5_g5fcc-hVvkSpsDGDw9yFSgs0dtp0O5_JV1LeR0x5-l4pNTYJsif15JkrAyGIPI8vPCISf75wQh47q9YT6LvoSVUfePkuk3yicSph-7rOb78Coj4Re1J85HG5QbmYACkivpX5r8ihTH8Z67ZP28blo7PCuTyUt4v9xev1fhv5BolsBS6NEpdHmNFM8GtZQ6JlOaj4egzOHrhI0co8',
  crepa:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAeJVETMzeX-9hOA-VDkzF8FOz7Hboj2-tY-vK2y9GaDY0_EB4dnwMJUGrMo6_Y3B9806TrqAx22FMN02BAGx5bbw2-_ag4KpuqBxWRGom9CYXECMzk9BSv9c9YpMBVSh4bXZ3JpXZ1ZbQYyNrW-fbTXN257VpNVHRObxY5ndmzYiQ4shaJDZjLhKPrEgVqKGhJiziCjrJlyloIfn_35wivdjygDOujHaec01868RI8QIBo0Kqv1D-pdfjqW8DEcGum_QYg5j2SPs2f',
  bebida:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDhB15iQu03HIIqavgiNf-9AJv6EThSEyo_x7ctcEr7GuGU6qYABqtCnv5QOnr0MtG0ZjxCd5oImdefRYszY_OdKjfyj2_uSriKpe8V7a1mgYTO0nBZ-ALmwKxf83IJmFslkaRWKNN6K2U6_l8eGgbXMlULCjL5CoFTN5xn-LRB_f3tm3Lt6amoKoeWN_2JW2byO8Z6koivqzUuw5pXjWu99k61LyA_za_i7rStW_qFL8oX2GJkMdBekuJbhY5xzPBv40ozfr1TIsG2',
  snack:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCczlIB9qBBqo6f4pv2oprZrObXWF1SjYO8ucdsCJAk_UHGSAZm76b3BIGT2PDLPvZT8O9YntXBNUNL9mWtGBOGRbTuJnNjC6fWlAjnNugoBZim2BfjJRp58NSe4YcL4PscvoFwBHRCgPLz65q7GlwNd1-aaC7fdGDm9OfCDkwpBHhft9zzhBkaWsoAQNFV1z7B3Y9mz7rAvRcAVSZ4BYNLCMc0m2B71yx-ecAHV54nr6BNNC4SjI70kR7ylGA3cvv1tCSinL5G9roK',
  postre:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBc6nI0OS5XX5sTvv7yr7Tn9PXzA_8moLQ4gD52so-5uHLIKCTtSccKBJvSwRzZaHC-OFvkxzwYUuz9KsVR7S_iti0SF6OouH7iIQr-Oz4ETpnCUaEJZ9lKjdaqURYwMZFTwS4dNKF3UeG0VRX625CJ0VlHx35JIgy0YpeXhUxzp_BAN3ZlUWsxll2R7AOwTbgARbxoYjiiueBtBSh7YZfIhobwLQdEdVMLnM4qbRU4ghJWM0EReUG8jTADcxgULx4LQ1ifv55AVZzE',
  ramen:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2hmeimk38LN89FIqqBtxoAgiBvqUhE9sgEQE_CaEurxuIp6NipabWfwvGA1BOMiBrzQlU1WvnkAGzPkV7JBBYwT1_Y2lbhswGFiBr_V5L9AXxdKaRHFTQLCZSVSox8qltaQ3tDjQGQ1EO-kJ6wPb33fq14JhZzWtJFkFKTfIMa4oapD2mB5JRNj9S8eMPARWNmHRK5hFAxs50u_qmlH-zpm8TMCEFCnD1OQEiF3WLlxMFKKDbBI5RYLCtH5_nF_BH4QLC5_3iKLqc',
};

export const menuSections: MenuSection[] = [
  // ── 1. PRODUCTOS NUEVOS ────────────────────────────────────────────────────
  {
    id: 'nuevos',
    title: 'Productos Nuevos',
    emoji: '✨',
    items: [
      {
        id: 'frapop',
        name: 'FRAPOP',
        price: 75,
        category: 'Nuevos',
        description: '475 ml. de un delicioso frappe elaborado con los mejores ingredientes y sabores.',
        image: IMG.bebida,
        badge: 'Nuevo',
        rating: 5,
      },
      {
        id: 'malteadas',
        name: 'MALTEADAS',
        price: 60,
        category: 'Nuevos',
        description: 'Riquísimos batidos de helado con leche fresca.',
        image: IMG.bebida,
        badge: 'Nuevo',
        rating: 4,
      },
      {
        id: 'smothies',
        name: 'SMOTHIES',
        price: 60,
        category: 'Nuevos',
        description: 'Granizados de fruta refrescantes.',
        image: IMG.bebida,
        badge: 'Nuevo',
        rating: 4,
      },
      {
        id: 'rockstar-burguer',
        name: 'ROCKSTAR BURGUER',
        price: 140,
        category: 'Nuevos',
        description: 'Pan dorado, vegetales frescos, queso gratinado, aros de cebolla, pepinillos y mermelada de tocino.',
        image: IMG.snack,
        badge: 'Nuevo',
        rating: 5,
      },
      {
        id: 'rueda-de-sabores',
        name: 'RUEDA DE SABORES',
        price: 240,
        category: 'Nuevos',
        description: 'Combinación de snacks premium para compartir.',
        image: IMG.snack,
        badge: 'Nuevo',
        rating: 5,
      },
      {
        id: 'kill-tamarind',
        name: 'KILL TAMARIND (MARGARITA)',
        price: 100,
        category: 'Nuevos',
        description: 'Cóctel de la casa con tamarindo y chile — uno de nuestros favoritos.',
        image: IMG.bebida,
        badge: 'Nuevo',
        rating: 5,
      },
    ],
  },

  // ── 2. SUSHI CLÁSICO ───────────────────────────────────────────────────────
  {
    id: 'sushi-clasico',
    title: 'Sushi Clásico',
    emoji: '🍣',
    items: [
      {
        id: 'california-maki',
        name: 'CALIFORNIA MAKI',
        price: 75,
        category: 'Sushi Clásico',
        description: 'Surimi, pepino y aguacate por dentro; ajonjolí por fuera.',
        image: IMG.sushi1,
        rating: 5,
      },
      {
        id: 'tampico-maki',
        name: 'TAMPICO MAKI',
        price: 75,
        category: 'Sushi Clásico',
        description: 'Surimi y salsa tampico — un sabor que sorprende.',
        image: IMG.sushi2,
        rating: 4,
      },
      {
        id: 'philadelphia-maki',
        name: 'PHILADELPHIA MAKI',
        price: 78,
        category: 'Sushi Clásico',
        description: 'Surimi, queso crema, aguacate y pepino.',
        image: IMG.sushi3,
        rating: 5,
      },
      {
        id: 'salmon-maki',
        name: 'SALMON MAKI',
        price: 115,
        category: 'Sushi Clásico',
        description: 'Salmón fresco, queso crema y aguacate.',
        image: IMG.sushi4,
        badge: 'Mas vendido',
        rating: 5,
      },
    ],
  },

  // ── 3. SUSHI EMPANIZADO ────────────────────────────────────────────────────
  {
    id: 'sushi-empanizado',
    title: 'Sushi Empanizado',
    emoji: '🔥',
    items: [
      {
        id: 'kara-maki',
        name: 'KARA MAKI EMPANIZADO',
        price: 92,
        category: 'Sushi Empanizado',
        description: 'Camarón, chipotle y queso gouda — crujiente por fuera, explosivo por dentro.',
        image: IMG.sushi1,
        badge: 'Picante',
        rating: 5,
      },
      {
        id: 'arrachera-roll',
        name: 'ARRACHERA ROLL',
        price: 95,
        category: 'Sushi Empanizado',
        description: 'Arrachera, queso gouda y chipotle — fusión tex-mex en cada bocado.',
        image: IMG.sushi2,
        badge: 'Picante',
        rating: 5,
      },
      {
        id: 'sushi-flamin-hot',
        name: 'SUSHI FLAMIN\'HOT',
        price: 100,
        category: 'Sushi Empanizado',
        description: 'Rollo empanizado cubierto de frituras picantes. Para los valientes.',
        image: IMG.sushi3,
        badge: 'Picante',
        rating: 5,
      },
      {
        id: 'nikumaki',
        name: 'NIKUMAKI',
        price: 98,
        category: 'Sushi Empanizado',
        description: 'Queso manchego y chiles toreados — intenso y adictivo.',
        image: IMG.sushi5,
        badge: 'Picante',
        rating: 4,
      },
    ],
  },

  // ── 4. SUSHI ESPECIAL ──────────────────────────────────────────────────────
  {
    id: 'sushi-especial',
    title: 'Sushi Especial (De la Casa)',
    emoji: '⭐',
    items: [
      {
        id: 'california-especial',
        name: 'CALIFORNIA ESPECIAL',
        price: 80,
        category: 'Sushi Especial',
        description: 'Camarón por dentro — nuestra versión premium del clásico californiano.',
        image: IMG.sushi1,
        rating: 5,
      },
      {
        id: 'umi-maki',
        name: 'UMI MAKI',
        price: 85,
        category: 'Sushi Especial',
        description: 'Camarón y salsa tampico por fuera — el sabor del mar en cada rollo.',
        image: IMG.sushi2,
        badge: 'Mas vendido',
        rating: 5,
      },
      {
        id: 'sushi-arcoiris',
        name: 'SUSHI ARCOIRIS',
        price: 82,
        category: 'Sushi Especial',
        description: 'Manzana, piña, mango o kiwi según temporada — fresco y colorido.',
        image: IMG.sushi3,
        badge: 'Vegetariano',
        rating: 4,
      },
      {
        id: 'ebi-maki-tempura',
        name: 'EBI MAKI TEMPURA',
        price: 105,
        category: 'Sushi Especial',
        description: 'Camarón tempura y salsa dulce — crujiente y suave a la vez.',
        image: IMG.sushi4,
        rating: 5,
      },
    ],
  },

  // ── 5. SUSHI EXÓTICO ───────────────────────────────────────────────────────
  {
    id: 'sushi-exotico',
    title: 'Sushi Exótico',
    emoji: '🌺',
    items: [
      {
        id: 'mango-roll',
        name: 'MANGO ROLL',
        price: 80,
        category: 'Sushi Exótico',
        description: 'Cubierto de mango y salsa de anguila — tropical y elegante.',
        image: IMG.sushi5,
        rating: 4,
      },
      {
        id: 'avocado-roll',
        name: 'AVOCADO',
        price: 82,
        category: 'Sushi Exótico',
        description: 'Cubierto de aguacate cremoso — pura frescura en cada pieza.',
        image: IMG.sushi1,
        rating: 4,
      },
      {
        id: 'sake-roll',
        name: 'SAKE ROLL',
        price: 120,
        category: 'Sushi Exótico',
        description: 'Cubierto de salmón fresco — el favorito de los conocedores.',
        image: IMG.sushi4,
        badge: 'Mas vendido',
        rating: 5,
      },
    ],
  },

  // ── 6. JAPÓN EN TU MESA ────────────────────────────────────────────────────
  {
    id: 'japon-en-tu-mesa',
    title: 'Japón en tu Mesa',
    emoji: '🍜',
    items: [
      {
        id: 'yakimeshi',
        name: 'YAKIMESHI',
        price: 50,
        category: 'Japón en tu Mesa',
        description: 'Arroz frito con verduras al estilo japonés — acompañamiento perfecto.',
        image: IMG.ramen,
        rating: 4,
      },
      {
        id: 'ramen-tradicional',
        name: 'RAMEN TRADICIONAL',
        price: 115,
        category: 'Japón en tu Mesa',
        description: 'Caldo rico y aromático con fideos, cerdo y verduras frescas.',
        image: IMG.ramen,
        badge: 'Mas vendido',
        rating: 5,
      },
      {
        id: 'kushiage',
        name: 'KUSHIAGE',
        price: 45,
        category: 'Japón en tu Mesa',
        description: 'Brochetas empanizadas de queso, plátano o camarón — perfectas para compartir.',
        image: IMG.snack,
        rating: 4,
      },
    ],
  },

  // ── 7. ONIGIRIS ────────────────────────────────────────────────────────────
  {
    id: 'onigiris',
    title: 'Onigiris',
    emoji: '🍙',
    items: [
      {
        id: 'onigiri-pop',
        name: 'POP PEROTE',
        price: 55,
        category: 'Onigiris',
        description: 'Triángulo de arroz relleno de surimi — snack japonés auténtico.',
        image: IMG.sushi2,
        rating: 4,
      },
      {
        id: 'onigiri-gourmet',
        name: 'POP PEROTE GOURMET',
        price: 65,
        category: 'Onigiris',
        description: 'Relleno de salmón o camarón — versión premium del onigiri.',
        image: IMG.sushi4,
        badge: 'Nuevo',
        rating: 5,
      },
    ],
  },

  // ── 8. ALITAS & BONELESS ───────────────────────────────────────────────────
  {
    id: 'alitas',
    title: 'Alitas & Boneless',
    emoji: '🍗',
    items: [
      {
        id: 'famous-wings-6',
        name: 'FAMOUS WINGS (6 pzas)',
        price: 70,
        category: 'Alitas',
        description: 'BBQ, Mango Habanero, Buffalo o Tamarindo — elige tu salsa favorita.',
        image: IMG.alitas,
        badge: 'Mas vendido',
        rating: 5,
      },
      {
        id: 'boneless-gourmet',
        name: 'BONELESS GOURMET',
        price: 70,
        category: 'Boneless',
        description: 'Trozos de pechuga de pollo empanizados y jugosos — irresistibles.',
        image: IMG.boneless,
        badge: 'Mas vendido',
        rating: 5,
      },
    ],
  },

  // ── 9. SNACKS & SNACK BOX ──────────────────────────────────────────────────
  {
    id: 'snacks',
    title: 'Snacks & Snack Box',
    emoji: '🍿',
    items: [
      {
        id: 'papas-fritas',
        name: 'PAPAS FRITAS',
        price: 40,
        category: 'Snacks',
        description: 'Papas crujientes al estilo clásico — el acompañamiento ideal.',
        image: IMG.snack,
        rating: 4,
      },
      {
        id: 'baconballs',
        name: 'BACONBALLS',
        price: 80,
        category: 'Snacks',
        description: 'Bolitas de queso envueltas en tocino crujiente — adictivas.',
        image: IMG.snack,
        badge: 'Mas vendido',
        rating: 5,
      },
      {
        id: 'dedos-de-queso',
        name: 'DEDOS DE QUESO',
        price: 85,
        category: 'Snacks',
        description: 'Bastones de queso empanizados — derretidos por dentro, crujientes por fuera.',
        image: IMG.snack,
        rating: 5,
      },
      {
        id: 'papas-gajo',
        name: 'PAPAS GAJO',
        price: 55,
        category: 'Snacks',
        description: 'Gajos de papa sazonados y horneados a la perfección.',
        image: IMG.snack,
        rating: 4,
      },
      {
        id: 'rueda-sabores-snack',
        name: 'RUEDA DE SABORES',
        price: 240,
        category: 'Snacks',
        description: 'Combinación de snacks variados perfecta para grupos y celebraciones.',
        image: IMG.snack,
        badge: 'Para compartir',
        rating: 5,
      },
    ],
  },

  // ── 10. CREPAS ─────────────────────────────────────────────────────────────
  {
    id: 'crepas',
    title: 'Crepas',
    emoji: '🥞',
    items: [
      {
        id: 'crepa-dulce',
        name: 'CREPA DULCE',
        price: 50,
        category: 'Crepas',
        description: 'Ingrediente a elegir con chocolate líquido — dulce y delicada.',
        image: IMG.crepa,
        badge: 'Mas vendido',
        rating: 5,
      },
    ],
  },

  // ── 11. BEBIDAS ────────────────────────────────────────────────────────────
  {
    id: 'bebidas',
    title: 'Bebidas',
    emoji: '🍹',
    items: [
      {
        id: 'frapop-bebida',
        name: 'FRAPOP',
        price: 75,
        category: 'Bebidas',
        description: '475 ml. de frappe helado elaborado con los mejores sabores.',
        image: IMG.bebida,
        badge: 'Nuevo',
        rating: 5,
      },
      {
        id: 'malteadas-bebida',
        name: 'MALTEADAS',
        price: 60,
        category: 'Bebidas',
        description: 'Batidos de helado con leche fresca — cremosos e irresistibles.',
        image: IMG.bebida,
        rating: 4,
      },
      {
        id: 'smothies-bebida',
        name: 'SMOTHIES',
        price: 60,
        category: 'Bebidas',
        description: 'Granizados de fruta naturales — refrescantes y llenos de sabor.',
        image: IMG.bebida,
        rating: 4,
      },
      {
        id: 'soda-italiana',
        name: 'SODA ITALIANA',
        price: 50,
        category: 'Bebidas',
        description: 'Frutal con perlas explosivas — una experiencia en cada sorbo.',
        image: IMG.bebida,
        rating: 5,
      },
      {
        id: 'carajillo',
        name: 'CARAJILLO',
        price: 95,
        category: 'Bebidas',
        description: 'Mezcla de café y licor — el broche de oro para tu experiencia.',
        image: IMG.bebida,
        rating: 5,
      },
      {
        id: 'kill-tamarind-bebida',
        name: 'KILL TAMARIND (MARGARITA)',
        price: 100,
        category: 'Bebidas',
        description: 'Cóctel de la casa con tamarindo y chile — intenso y adictivo.',
        image: IMG.bebida,
        badge: 'Nuevo',
        rating: 5,
      },
      {
        id: 'naranjada-limonada',
        name: 'NARANJADA / LIMONADA NATURAL',
        price: 40,
        category: 'Bebidas',
        description: 'Jugo natural de naranja o limón — fresco y sin conservadores.',
        image: IMG.bebida,
        rating: 4,
      },
    ],
  },

  // ── 12. POSTRES ────────────────────────────────────────────────────────────
  {
    id: 'postres',
    title: 'Postres',
    emoji: '🍫',
    items: [
      {
        id: 'volcan-de-chocolate',
        name: 'VOLCÁN DE CHOCOLATE',
        price: 60,
        category: 'Postres',
        description: 'Pastel tibio relleno de chocolate fundido — el final perfecto.',
        image: IMG.postre,
        badge: 'Mas vendido',
        rating: 5,
      },
      {
        id: 'chocoflan',
        name: 'CHOCOFLAN',
        price: 50,
        category: 'Postres',
        description: 'La combinación perfecta de chocolate y flan — clásico irresistible.',
        image: IMG.postre,
        rating: 4,
      },
      {
        id: 'donas-krispy-kreme',
        name: 'DONAS KRISPY KREME',
        price: 40,
        category: 'Postres',
        description: 'Las icónicas donas glaseadas de Krispy Kreme — dulzura garantizada.',
        image: IMG.postre,
        rating: 5,
      },
    ],
  },
];

export const orderMoments = [
  'Entrega estimada de 35 a 45 min dentro de Perote.',
  'Recoger en sucursal suele tomar 20 min.',
  'Acumulas 1 punto POP por cada $10 MXN.',
];

export const suggestedPairings = [
  'Agrega una orden de alitas para compartir.',
  'Combina tu rollo con una bebida premium y suma más puntos.',
  'Pregunta por la promo activa del día al finalizar tu pedido.',
];
