'use client';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  priceLabel?: string;
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

type CatalogRow = {
  category: string;
  name: string;
  price: number;
  description: string;
  priceLabel?: string;
  badge?: string;
  imageKey: keyof typeof IMG;
};

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
  house: '/images/logopop.png',
};

const sectionMeta = [
  ["Productos Nuevos", {"id":"nuevos","title":"Productos Nuevos","emoji":"✨"}],
  ["Sushi clásico", {"id":"sushi-clasico","title":"Sushi Clásico","emoji":"🍣"}],
  ["Sushi empanizado", {"id":"sushi-empanizado","title":"Sushi Empanizado","emoji":"🔥"}],
  ["Sushi especial", {"id":"sushi-especial","title":"Sushi Especial","emoji":"⭐"}],
  ["Sushi exótico", {"id":"sushi-exotico","title":"Sushi Exótico","emoji":"🌺"}],
  ["Japón en tu mesa", {"id":"japon-en-tu-mesa","title":"Japón en tu Mesa","emoji":"🍜"}],
  ["ONIGIRIS.", {"id":"onigiris","title":"Onigiris","emoji":"🍙"}],
  ["Snacks", {"id":"snacks","title":"Snacks","emoji":"🍿"}],
  ["ALITAS", {"id":"alitas","title":"Alitas","emoji":"🍗"}],
  ["ALITAS GOURMET", {"id":"alitas-gourmet","title":"Alitas Gourmet","emoji":"🔥"}],
  ["BONELESS", {"id":"boneless","title":"Boneless","emoji":"🍖"}],
  ["POSTRES.", {"id":"postres","title":"Postres","emoji":"🍫"}],
  ["BEBIDAS.", {"id":"bebidas","title":"Bebidas","emoji":"🍹"}],
  ["MIXOLOGIA", {"id":"mixologia","title":"Mixología","emoji":"🍸"}],
  ["JUEGOS", {"id":"juegos","title":"Juegos","emoji":"🎯"}],
  ["MENÚ DEL BAR", {"id":"menu-bar","title":"Menú del Bar","emoji":"🍺"}],
  ["CHAROLAS", {"id":"charolas","title":"Charolas","emoji":"🍱"}],
] as const;

const catalogRows: CatalogRow[] = [
  {"category":"Productos Nuevos","name":"FRAPOP","price":75,"description":"475 ml. de un delicioso frappe elaborado con los mejores ingredientes y los mejores sabores frescos y cremosos. Pruébalo te encantará","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"MALTEADAS","price":60,"description":"Riquísimos batidos de helado preparados con leche fresca y los mejores sabores, Disfrútalos.","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"SMOTHIES (GRANIZADO DE FRUTA)","price":60,"description":"Refuerza tu día con nuestros deliciosos granizados de frutas. Escoge el sabor que mas te refresque.","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"CERVEZA IMPORTADA","price":100,"description":"Prueba las nuevas opciones que tenemos en POP de cervezas importadas. Te van a encantar.","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"ROCKSTAR BURGUER","price":140,"description":"Mezcla deliciosa de sabores que combinan a la perfección: un dorado pan, vegetales frescos, queso gratinado, aros de cebolla, pepinillos y coronada con nuestra exclusiva mermelada de tocino. Tu decides si la quieres sencilla o doble, y decide con que papas lo gustas acompañar","badge":"Nuevo","imageKey":"snack"},
  {"category":"Productos Nuevos","name":"RUEDA DE SABORES","price":240,"description":"Riquísima combinación de snacks; escoge 5 de nuestros deliciosos snacks y disfrútalos acompañados de aderezo ranch o blue shesse. SOLO EN RESTAURANTE.","badge":"Nuevo","imageKey":"snack"},
  {"category":"Productos Nuevos","name":"KILL TAMARIND (MARGARITA)","price":100,"description":"Delicioso coctel servido en copa escarchada con pulpa de tamarindo y, preparado con tequila y licor de naranja, adornado con cubos de mango natural","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"AGUA GASIFICADA","price":20,"description":"Deliciosa agua enlatada: 0 calorías, 0 sodio y 0 endulzante. Totalmente refrescante.","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"VOLCAN DE CHOCOLATE","price":60,"description":"Pastel irresistible relleno de chocolate oscuro fundido y coronado con frutos rojos frescos que añaden un toque de acidez que equilibra la dulzura, puede acompañarse con una bola de helado de vainilla, la cual resalta el sabor inigualable del chocolate.","badge":"Nuevo","imageKey":"postre"},
  {"category":"Productos Nuevos","name":"SODA ITALIANA","price":50,"description":"Deliciosa bebida refrescante de sabores frutales con agua mineralizada, y con un shot de perlas explosivas.","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"CAFE CAPUCCINNO","price":48,"description":"Delicioso café preparado en nuestra cafetera italiana","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Productos Nuevos","name":"CARAJILLO","price":95,"description":"deliciosa mezcla de café espresso con licor 43.","badge":"Nuevo","imageKey":"bebida"},
  {"category":"Sushi clásico","name":"CALIFORNIA MAKI","price":75,"description":"Surimi, pepino y aguacate por dentro, con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi1"},
  {"category":"Sushi clásico","name":"TAMPICO MAKI","price":75,"description":"Surimi y salsa tampico; con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi1"},
  {"category":"Sushi clásico","name":"HAWAIANO MAKI","price":75,"description":"Surimi, piña en almíbar y queso crema por dentro con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi1"},
  {"category":"Sushi clásico","name":"PHILADELPHIA MAKI","price":78,"description":"Surimi, queso crema, aguacate y pepino por dentro con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi1"},
  {"category":"Sushi empanizado","name":"KARA MAKI EMPANIZADO","price":92,"description":"Camarón, chipotle y queso gouda por dentro; empanizado por fuera. Acompañado con un aderezo de salsa tonkatsu y un toque de salsa tártara.","badge":"Picante","imageKey":"sushi2"},
  {"category":"Sushi empanizado","name":"ARRACHERA ROLL","price":95,"description":"Arrachera, queso gouda y chipotle por dentro; empanizado por fuera. Acompañado con un aderezo de salsa tonkatsu y toque de tártara.","badge":"Picante","imageKey":"sushi2"},
  {"category":"Sushi empanizado","name":"SUSHI FLAMIN'HOT","price":100,"description":"Un extravagante rollo relleno de surimi, queso crema, aguacate, pepino y arrachera empanizado con flamin`hot y coronado con un delicioso aderezo de chipotle. Acompañado de un aderezo de soya y sus hachis.","imageKey":"sushi2"},
  {"category":"Sushi empanizado","name":"NIKUMAKI","price":98,"description":"Queso manchego, chorizo, tocino, arrachera y chipotle por dentro; empanizado por fuera y bañado con salsa bbq. Acompañado de un aderezo de salsa de soya.","badge":"Picante","imageKey":"sushi2"},
  {"category":"Sushi empanizado","name":"COCO MAKI","price":95,"description":"Camarón, piña y queso crema por dentro, empanizado con panko y coco rallado por fuera, acompañado con un aderezo de salsa tonkatsu.","imageKey":"sushi2"},
  {"category":"Sushi empanizado","name":"CHORIZO ROLL","price":90,"description":"Chorizo, queso crema, chipotle y aguacate por dentro y empanizado por fuera con panko. Acompañado con un aderezo de salsa tonkatsu.","badge":"Picante","imageKey":"sushi2"},
  {"category":"Sushi empanizado","name":"PHILADELPHIA EMPANIZADO","price":95,"description":"Salmón fresco con queso crema, pepino y aguacate por dentro y empanizado por fuera; acompañado de un aderezo de salsa tonkatsu con un toque de salsa tártara.","badge":"Picante","imageKey":"sushi2"},
  {"category":"Sushi empanizado","name":"TRES QUESOS MAKI","price":100,"description":"Relleno de camarón, arrachera, chipotle y aguacate con queso crema, empanizado y por fuera queso manchego y queso americano gratinado, acompañado con un aderezo de salsa tonkatsu.","badge":"Picante","imageKey":"sushi2"},
  {"category":"Sushi especial","name":"CALIFORNIA ESPECIAL","price":80,"description":"Camarón, pepino y aguacate por dentro con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"CALIFORNIA ESPECIAL CON MASAGO POR FUERA","price":88,"description":"Camarón, pepino y aguacate por dentro con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"PHILADELPHIA ESPECIAL","price":80,"description":"Salmon fresco, queso crema, aguacate y pepino por dentro con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"PHILADELPHIA ESPECIAL CON MASAGO POR FUERA","price":88,"description":"Salmon fresco, queso crema, aguacate y pepino por dentro con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"FUTO MAKI","price":82,"description":"Pepino, aguacate, zanahoria, surimi y queso crema por dentro; alga marina por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"CHIRIMAKI","price":80,"description":"Salmón, queso crema y chipotle por dentro; con ajonjolí y bañado con salsa agridulce de anguila por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"ABBY KARAME","price":88,"description":"Camarón, aguacate y chipotle por dentro con queso crema y ajonjoli por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"EBI MAKI TEMPURA","price":90,"description":"Camarón empanizado, aguacate y queso crema por dentro; con ajonjolí; pasta tampico y un toque de masago por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"UMI MAKI","price":85,"description":"Camarón, salsa tampico, masago y queso crema por dentro con alga marina por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"SCRIMP ROLL","price":93,"description":"Aguacate, pepino, queso crema y salsa tampico por dentro maquizado con camarón por fuera y acompañado con un toque de salsa chiracha y acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"SUSHI ARCOIRIS","price":82,"description":"manzana, piña, pera y queso crema por dentro con mango y fresa por fuera, acompañado de un aderezo de salsa de soya.","badge":"Vegetariano","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"BANANA MAKI","price":75,"description":"Sushi relleno de queso crema y por fuera tiras de plátano macho frito acompañado de un aderezo de salsa de soya.","badge":"Vegetariano","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"HAWAIANO ESPECIAL","price":78,"description":"Salmón fresco, piña en almíbar y queso crema por dentro con ajonjolí por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi especial","name":"CHICARA","price":75,"description":"Camarón, pepino y salsa tampico por dentro; con surimi y aguacate por fuera, acompañado de un aderezo de salsa de soya.","imageKey":"sushi3"},
  {"category":"Sushi exótico","name":"KAPA MAKI","price":60,"description":"Sushi vegetariano con pepino, aguacate y zanahoria por dentro, con ajonjolí por fuera. (opcional queso crema), acompañado con un aderezo de salsa de soya.","badge":"Vegetariano","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"MANGO ROLL","price":82,"description":"surimi con aguacate, pepino u queso crema por dentro con mango por fuera, acompañado con un aderezo de salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"KIWI MAKI","price":78,"description":"Surimi, pepino y piña en almibar por dentro, con queso crema y kiwi por fuera, acompañado con un aderezo de salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"AVOCADO","price":78,"description":"Salmón fresco y queso crema por dentro, cubierto por fuera con aguacate y ajonjolí, acompañado con un aderezo de salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"PEROTE ROLL","price":88,"description":"Jamón serrano, queso crema y pera por dentro, con arroz por fuera y acompañado de un aderezo de salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"PEROTE GOURMET","price":98,"description":"Jamón serrano, queso crema y pera por dentro y por fuera maquizado con jamón serrano; acompañado con salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"CHICKEN ROLL","price":85,"description":"Pollo empanizado, aguacate y queso crema por dentro con arroz por fuera y acompañado de un aderezo de salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"SAKE ROLL","price":98,"description":"Aguacate, pepino y queso crema por dentro con salmón fresco por fuera, acompañado con un aderezo de salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"MASAGO MAKI","price":85,"description":"Salmón, aguacate y pepino por dentro con queso crema y masago por fuera, acompañado con un aderezo de salsa de soya.","imageKey":"sushi4"},
  {"category":"Sushi exótico","name":"CHEESE ROLL","price":130,"description":"Delicioso rollo relleno de arrachera, chorizo, aguacate y salsa habanera, por fuera con arroz y ajonjolí, servido sobre una cama de queso mozarella y completamente cubierto de queso mozarella derretido, aderezado con salsa de anguila y un toque de masago.","badge":"Picante","imageKey":"sushi4"},
  {"category":"Japón en tu mesa","name":"YAKIMESHI","price":75,"description":"Arroz frito estilo japonés, acompañado de arrachera, pollo, huevo y verduras (zanahoria, calabaza y cebolla); con un toque final de ajonjolí tostado.","imageKey":"ramen"},
  {"category":"Japón en tu mesa","name":"RAMEN TRADICIONAL","price":75,"description":"Deliciosa pasta tradicional japonesa cocinada y servida con caldo preparado de manera artesanal servido con verduras; huevo hervido; carnes y un toque de ajonjolí. acompañado con soya y salsa picante.","imageKey":"ramen"},
  {"category":"Japón en tu mesa","name":"NIGIRI-SUSHI","price":65,"description":"Pequeñas porciones de arroz moldeado a mano y cubierta con el ingrediente a elegir camarón, salmón con un toque de salsa picante shiracha y acompañado con salsa de soya (4 piezas).","priceLabel":"Desde $65","imageKey":"sushi5"},
  {"category":"Japón en tu mesa","name":"TEMAKI CONO","price":45,"description":"Cono de nori (alga marina tostada) relleno de queso philadelphia, aguacate, zanahoria y pepino.","priceLabel":"Desde $45","imageKey":"sushi5"},
  {"category":"Japón en tu mesa","name":"KUSHIAGE","price":70,"description":"Banderillas empanizadas con pan oriental, acompañadas con salsa tonkatsu y un toque de salsa tártara (4 piezas)","priceLabel":"Desde $70","imageKey":"snack"},
  {"category":"ONIGIRIS.","name":"POP PEROTE","price":82,"description":"Deliciosa bola de arroz, rellena aguacate, pepino, queso crema, masago, surimi y camarón, empanizado con panko y bañado en salsa de anguila con un toque de ajonjolí.","badge":"Picante","imageKey":"sushi2"},
  {"category":"ONIGIRIS.","name":"POP PEROTE VEGETARIANO","price":75,"description":"Bola de arroz rellena con pepino, aguacate, zanahoria y queso crema y empanizada por fuera.","badge":"Vegetariano","imageKey":"sushi2"},
  {"category":"ONIGIRIS.","name":"POP PEROTE GOURMET","price":90,"description":"Bola de arroz rellena de camarón empanizado, queso crema y habanero, empanizado por fuera y bañado con salsa de anguila.","imageKey":"sushi2"},
  {"category":"ONIGIRIS.","name":"POP PEROTE MEAT","price":95,"description":"Deliciosa bola de arroz rellena de arrachera, tocino, chorizo, queso manchego y rodajas de chile jalapeño, empanizado por fuera y bañado en salsa de anguila.","imageKey":"sushi2"},
  {"category":"Snacks","name":"AROS DE CEBOLLA RELLENOS","price":75,"description":"3 deliciosos aros de cebolla envueltos con tocino y rellenos de una mezcla de quesos y chile jalapeño, empanizados y acompadados con un aderezo ranch.","badge":"Picante","imageKey":"snack"},
  {"category":"Snacks","name":"PAPAS FRITAS","price":58,"description":"Las tradicionales y sabrosas papas fritas del Pop, sazonadas con sal y acompañadas de cátsup","imageKey":"snack"},
  {"category":"Snacks","name":"BACONBALLS","price":75,"description":"15 Exquisitas bolitas de papa con tocino, queso mozarella y chile serrano picado finamente, empanizado y acompañado con un aderezo ranch","badge":"Picante","imageKey":"snack"},
  {"category":"Snacks","name":"POPPERS JALAPEÑOS","price":75,"description":"5 chiles jalapeños rellenos de una combinación de queso crema y quesos rallados, empanizados y acompañados de un aderezo. ranch.","badge":"Picante","imageKey":"snack"},
  {"category":"Snacks","name":"DEDOS DE QUESO","price":75,"description":"Palitos de queso mozarella empanizados acompañados con un aderezo Blue chesse o ranch (8 piezas).","imageKey":"snack"},
  {"category":"Snacks","name":"CHICKEN SLICES","price":95,"description":"5 exquisitas tiras de pollo condimentadas con sal y pimienta empanizados y acompañados de cualquiera de nuestras salsas","imageKey":"boneless"},
  {"category":"Snacks","name":"BANDERILLAS","price":60,"description":"cuatro mini salchichas servidas con catsup mayonesa y mostaza.","imageKey":"snack"},
  {"category":"Snacks","name":"CREPA AMERICANA","price":53,"description":"Rellena de jamón con queso manchego.","imageKey":"crepa"},
  {"category":"Snacks","name":"CREPA ITALIANA","price":60,"description":"Rellena de jamón serrano y queso gouda, con un toque de oregano.","imageKey":"crepa"},
  {"category":"Snacks","name":"CREPA ESPAÑOLA","price":65,"description":"Deliciosa crepa rellena de queso mozarella y chistorra, acompañada con un toque de salsa chipotle.","imageKey":"crepa"},
  {"category":"Snacks","name":"PAPAS GAJO","price":65,"description":"Deliciosas y crujientes papas gajo.","imageKey":"snack"},
  {"category":"ALITAS","name":"FAMOUS WINGS","price":60,"description":"Nuestras famosas alitas fritas bañadas con la salsa de tu elección, incluye un aderezo.","priceLabel":"Desde $60","imageKey":"alitas"},
  {"category":"ALITAS","name":"FAMOUS CRUNCHY WINGS","price":70,"description":"Nuestras deliciosas y unicas alitas empanizadas y bañadas con la salsa de tu elección, incluye un aderezo.","priceLabel":"Desde $70","imageKey":"alitas"},
  {"category":"ALITAS GOURMET","name":"GARLIC PARMESAN WINGS","price":70,"description":"Alitas fritas en mantequilla condimentadas con ajo, perejil y queso parmesano y acompañadas con un aderezo ranch. (6 piezas)","imageKey":"alitas"},
  {"category":"ALITAS GOURMET","name":"LEMMON PEPPER WINGS","price":70,"description":"6 Deliciosas alitas fritas condimentadas con limón y pimienta y acompañadas con un aderezo ranch.","imageKey":"alitas"},
  {"category":"ALITAS GOURMET","name":"ALITAS GRATINADAS","price":150,"description":"15 deliciosas alitas fritas y horneadas cubiertas con queso mozzarela. servidas con un toque de salsa habanero y espolvoreadas con perejil, (incluye un aderezo)","badge":"Picante","imageKey":"alitas"},
  {"category":"ALITAS GOURMET","name":"ESPECIAL WINGS (sazonadas)","price":70,"description":"6 Deliciosas alitas fritas condimentadas con alguno de nuestros nuevos y deliciosos sazonadores y acompañadas con un aderezo ranch.","imageKey":"alitas"},
  {"category":"BONELESS","name":"BONELESS CLASICOS","price":90,"description":"Ricos trozos de pechuga empanizados y bañados con la salsa de su preferencia (15 piezas), incluye un aderezo.","imageKey":"boneless"},
  {"category":"BONELESS","name":"BONELESS GOURMET","price":90,"description":"15 trozos de pechuga empanizados y bañados con alguna de nuestras exquisitas salsas especiales, incluye un aderezo.","imageKey":"boneless"},
  {"category":"BONELESS","name":"GARLIC PARMESAN BONELESS","price":95,"description":"Nuestros deliciosos trozos de pechuga sazonados en mantequilla con ajo y queso parmesano, espolvoreado con perejil.","imageKey":"boneless"},
  {"category":"BONELESS","name":"BONELESS GRATINADOS","price":145,"description":"18 deliciosos boneless gratinados al horno con queso mozzarella y servidos con un toque de salsa habanera, espolvoreados con perejil.","badge":"Picante","imageKey":"boneless"},
  {"category":"BONELESS","name":"BONELESS LEMMON PEPPER","price":95,"description":"15 deliciosos trozos de pechuga sazonados en mantequilla con sazonador lemmon. Acompañado con un aderezo ranch","imageKey":"boneless"},
  {"category":"BONELESS","name":"BONELESS SAZONADOS","price":100,"description":"15 deliciosos trozos de pechuga empanizados y sazonados con mantequilla cubiertos de alguno de nuestros nuevos sazonadores","imageKey":"boneless"},
  {"category":"POSTRES.","name":"VOLCAN DE CHOCOLATE","price":60,"description":"Pastel irresistible relleno de chocolate oscuro fundido y coronado con frutos rojos frescos que añaden un toque de acidez que equilibra la dulzura, puede acompañarse con una bola de helado de vainilla, la cual resalta el sabor inigualable del chocolate.","imageKey":"postre"},
  {"category":"POSTRES.","name":"CREPA DULCE","price":50,"description":"Deliciosa crepa rellena con alguno de los ingredientes a su elección y bañada en chocolate liquido.","imageKey":"postre"},
  {"category":"POSTRES.","name":"DONAS KRISPY KREME","price":40,"description":"Dona rellena de la reconocida mundialmente empresa Krispy Kreme. (Pregunta disponibilidad de sabores.)","imageKey":"postre"},
  {"category":"POSTRES.","name":"POP APPLE PIE","price":38,"description":"Delicioso pay de manzana casero, servido en una cama de azucar glass y espolvoreado con azucar y canela.","imageKey":"postre"},
  {"category":"POSTRES.","name":"PASTEL DE QUESO CON FRAMBUESA","price":45,"description":"El tradicional pastel costco llega a Pop. Delicioso","imageKey":"postre"},
  {"category":"POSTRES.","name":"CHOCOFLAN","price":50,"description":"Riquísimo postre que te envuelve en su sabor dulce, acompañado de un pan esponjoso y coronado con durazno en almíbar. Te va a encantar.","imageKey":"postre"},
  {"category":"BEBIDAS.","name":"FRAPOP","price":75,"description":"475 ml. de un delicioso frappe elaborado con los mejores ingredientes y los mejores sabores frescos y cremosos. Pruébalo te encantará","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"MALTEADAS","price":60,"description":"Riquísimos batidos de helado preparados con leche fresca y los mejores sabores, Disfrútalos.","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"SMOTHIES (GRANIZADO DE FRUTA)","price":60,"description":"Refuerza tu día con nuestros deliciosos granizados de frutas. Escoge el sabor que mas te refresque.","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"AGUA GASIFICADA","price":20,"description":"Deliciosa agua enlatada: 0 calorías, 0 sodio y 0 endulzante. Totalmente refrescante.","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"SODA ITALIANA","price":50,"description":"Deliciosa bebida refrescante de sabores frutales con agua mineralizada y, con un shot de perlas explosivas.","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"COCA COLA de 500 ml. en botella de vidrio","price":30,"description":"(Solo venta en el local)","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"REFRESCO DE LATA DE 355 ML","price":30,"description":"PEPSI COLA, MIRINDA, 7 UP Y MANZANITA","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"TE HELADO","price":28,"description":"fuze tea o lipton (depende existencia)","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"REFILL DE COCA-COLA","price":45,"description":"Bebida coca cola servida en vaso y con refill de 2 vasos más. Venta solo en local.","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"COCA COLA DE LATA 355 ml. o COCA COLA 0 AZUCAR","price":40,"description":"","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"JUGO BOING","price":30,"description":"solo venta en local","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"AGUA EMBOTELLADA","price":20,"description":"","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"LIMONADA NATURAL","price":40,"description":"","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"LIMONADA MINERAL","price":50,"description":"","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"NARANJADA NATURAL","price":40,"description":"","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"NARANJADA MINERAL","price":50,"description":"","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"AGUA MARINA","price":50,"description":"Vaso escarchado con sal y servido con jugo de limón y una ampolleta de 355 ml. de agua mineral","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"CAFÉ AMERICANO","price":30,"description":"Rico café negro preparado con una exquisita mezcla de granos de café y recién molido,","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"CAFE CAPUCCINNO","price":48,"description":"Delicioso café preparado en nuestra cafetera italiana","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"AGUA PARA TÈ","price":30,"description":"Agua caliente acompañado de dos sobres de te de deliciosos sabores.","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"CARAJILLO","price":95,"description":"deliciosa mezcla de café espresso con licor 43.","imageKey":"bebida"},
  {"category":"BEBIDAS.","name":"CAFE LATTE","price":40,"description":"Deliciosa bebida de café de origen italiano elaborada con un shot de café expreso y leche al vapor mezclado y, con una pequeña capa de espuma de leche. Sabor opcional.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"TRUE BLOOD (Vampiro)","price":85,"description":"Coctel preparado con salsas, tequila Cuervo Tradicional, refresco de toronja y sangrita.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"MAC LAREN´S (Alfonso XVIII)","price":90,"description":"Cóctel preparado con Licor de cafe y leche.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"QUEEN MARGARITA","price":88,"description":"Delicioso cóctel preparado con tequila Cuervo tradicional y escarchado con sal, adornado con una rodaja de limón.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"QUEEN BLUE MARGARITA FROZEN","price":95,"description":"Cóctel servido en copa escarchada y preparado con tequila y curazao; Delicioso¡¡¡","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"TEQUILA SUN RISE","price":85,"description":"Cóctel preparado con tequila, jugo de naranja y granadina.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"MONTAUK (Piña Colada)","price":90,"description":"Cóctel preparado con la receta especial de Pop.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"PINK ROSE (Medias de seda)","price":90,"description":"Cóctel preparado con Ginebra, granadina y un toque de leche evaporada.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"CARIBE PERLA NEGRA","price":90,"description":"Cóctel preparado con jagger,bebida energetica e hielo.","imageKey":"bebida"},
  {"category":"MIXOLOGIA","name":"KILL TAMARIND (MARGARITA)","price":100,"description":"Delicioso coctel servido en copa escarchada con pulpa de tamarindo y, preparado con tequila y licor de naranja, adornado con cubos de mango natural","imageKey":"bebida"},
  {"category":"JUEGOS","name":"BILLAR","price":50,"description":"Uso de la mesa de billar, unicamente a clientes con consumo de alimentos y restringido a una hora por mesa.","imageKey":"house"},
  {"category":"JUEGOS","name":"TIRO AL BLANCO","price":20,"description":"Uso del tiro al blanco, únicamente a clientes con consumo de alimentos. Una hora","imageKey":"house"},
  {"category":"JUEGOS","name":"JENGA","price":0,"description":"Pida el juego al mesero. Su uso es gratuito.","priceLabel":"Gratis","badge":"Gratis","imageKey":"house"},
  {"category":"JUEGOS","name":"CONECTA-4","price":0,"description":"Juega con tus acompañantes y gánales, en una gran batalla. Pídelo a tu mesero. ES GRATUITO","priceLabel":"Gratis","badge":"Gratis","imageKey":"house"},
  {"category":"JUEGOS","name":"CARTAS \"UNO\"","price":0,"description":"Pídelo a tu mesero. ES GRATIS!!!","priceLabel":"Gratis","badge":"Gratis","imageKey":"house"},
  {"category":"JUEGOS","name":"DOMINO","price":0,"description":"Su uso es gratuito. Pídeselo a tu mesero","priceLabel":"Gratis","badge":"Gratis","imageKey":"house"},
  {"category":"JUEGOS","name":"JUEGO DE CARTAS POKER","price":0,"description":"Pida las cartas a su mesero. Su uso es gratuito.","priceLabel":"Gratis","badge":"Gratis","imageKey":"house"},
  {"category":"JUEGOS","name":"JUEGO DE CARTAS ESPAÑOLAS","price":0,"description":"Pídelas a tu mesero. Su uso es gratuito.","priceLabel":"Gratis","badge":"Gratis","imageKey":"house"},
  {"category":"JUEGOS","name":"PALILLOS CHINOS","price":0,"description":"Diviértete con este clásico. Es GRATIS","priceLabel":"Gratis","badge":"Gratis","imageKey":"house"},
  {"category":"MENÚ DEL BAR","name":"CLERICOT GOURMET","price":300,"description":"Exquisito clericot servido con botella de vino tinto afrutado y servido en su mesa.(Jarra de litro y medio)","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"CERVEZA IMPORTADA","price":100,"description":"Prueba las nuevas opciones que tenemos en POP de cervezas importadas. Te van a encantar.","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"CLERICOT DE LA CASA","price":65,"description":"Delicioso clericot, preparado con vino tinto de la casa y acompañado de frutas.","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"CERVEZA NACIONAL EN BOTELLA DE VIDRIO (355 ML.)","price":40,"description":"Tecate roja, XX lagger y ambar, Indio, XX ultra, Heineken Cero alcohol. ( Solo venta en local).","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"CERVEZA NACIONAL ESPECIAL","price":45,"description":"NOCHE BUENA (solo por tiempo limitado), Negra Modelo, Bohemia Cristal, Bohemia oscura, Amstel Ultra.","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"WHISKY","price":65,"description":"","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"BRANDY","price":65,"description":"","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"RON","price":50,"description":"","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"VODKA","price":55,"description":"","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"TEQUILA","price":50,"description":"tequila a elección acompañado de un mezclador e hielo.","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"GINEBRA","price":80,"description":"","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"MEZCAL","price":60,"description":"caballito de mezcal o en copa con un mezclador.","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"DIGESTIVOS","price":40,"description":"Se toman al final de la comida para facilitar la digestión y se pueden acompañar con uno de nuestros deliciosos postres.","imageKey":"bebida"},
  {"category":"MENÚ DEL BAR","name":"APERITIVOS","price":35,"description":"Son de sabor amargo y se consumen antes de los alimentos, para abrir el apetito.","imageKey":"bebida"},
  {"category":"CHAROLAS","name":"CHAROLA MEDIANA","price":450,"description":"Incluye: un rollo frío; un rollo caliente ( en rollos seleccionados); una orden de papas (gajo o fritas); dedos de queso; baconballs y 12 alitas fritas o crunchy (en cualquiera de nuestras especialidades).","badge":"Para compartir","imageKey":"snack"},
  {"category":"CHAROLAS","name":"CHAROLA POP","price":650,"description":"Incluye: dos rollos fríos; dos rollos calientes (en rollos seleccionados); papas gajo y fritas; dedos de queso; baconballs; 18 alitas fritas o crunchy (en cualquiera de nuestras especialidades) y una orden de kushiages de platano macho.","badge":"Para compartir","imageKey":"snack"},
  {"category":"CHAROLAS","name":"MIX AND MATCH (individual)","price":190,"description":"un rollo a su elección, papas a elección; 6 alas fritas o crunchy con cualquiera de nuestras salsas y un refresco de lata.","badge":"Para compartir","imageKey":"snack"},
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const menuSections: MenuSection[] = sectionMeta.map(([sourceCategory, meta]) => ({
  id: meta.id,
  title: meta.title,
  emoji: meta.emoji,
  items: catalogRows
    .filter((row) => row.category === sourceCategory)
    .map((row) => ({
      id: `${meta.id}-${slugify(row.name)}`,
      name: row.name,
      price: row.price,
      priceLabel: row.priceLabel,
      category: meta.title,
      description: row.description,
      image: IMG[row.imageKey],
      badge: row.badge,
      rating: row.badge === 'Nuevo' || row.badge === 'Para compartir' ? 5 : 4,
    })),
}));

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
