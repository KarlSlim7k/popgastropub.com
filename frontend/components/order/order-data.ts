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
  items: MenuItem[];
};

export const menuSections: MenuSection[] = [
  {
    id: 'sushi',
    title: 'Sushi Selection',
    items: [
      {
        id: 'dragon-roll-especial',
        name: 'Dragon Roll Especial',
        price: 185,
        category: 'Sushi',
        description: 'Combinacion perfecta de camaron tempura, queso crema y tope de aguacate fresco.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAw99bPGjenPMgJE54EGOTsqB0kHQp7M0KNhDsaQzzOqrqgdksUdKIIr7_RfYxlY5Li8hq6G8OIqy_48yIyus8yVtoNIjoSoocy0cmN1UWmIqyt6_U_UU0BeBLdcTdLbXbbmDk3jHWpUbkqo1E9nG8JrDSvuJ3XVAWCe4Q9rwaV5Et1MSi1DgLr6l2mPHE-iY9C1mntdARE7SdKTjspOR35r37bVqPmUivPehtdmeP4HtIC-iq-B1nP_oH3gft_fLO6NwTOOwNXv3yi',
        badge: 'Mas vendido',
        rating: 5,
      },
      {
        id: 'salmon-truffle',
        name: 'Salmon Truffle',
        price: 210,
        category: 'Sushi',
        description: 'Salmon fresco de grado sashimi con un toque de aceite de trufa blanca.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCj-M-WflJSH5JzNa11ftmutnSrmcxC5LG0FatztkCD6yS4D1cf8CeKTH01Nzqlv4q3e3ALTT-EauL18I4L3CnyQdTNxxaX9BkqTbEDIXyzACanONrDDlozOexg9W8TmVVTLpfG50Uo1trhEi680sIMqXg25StDsrme6YyxuH-25FcrggDbH94FMhZ9I19aqs8bVUaAJ6vYGeCd7K35tMZZo3zhtsUv0Nh-xFo-d_1R5A5jGR2B1OpeKX0FuE0-ArSL33xwwu-elUsY',
        badge: 'Nuevo',
        rating: 4,
      },
      {
        id: 'spicy-crunchy',
        name: 'Spicy Crunchy',
        price: 175,
        category: 'Sushi',
        description: 'Crunchy tempura shrimp mixed with spicy tuna and sriracha emulsion.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBc929czbNNYOepQ756qcdeBycJUw-E_Lb0bWspcp4i58z1b2aoeP00MAsrwHZioWgROABNrO3edkzxWAKQE4PfkjlWBUtGz6BBICvlkYA_CuJ6aaKDfH6YlSXQxSK-o2uV1XjJTlD9Q2U01ihFqKjEcyRxc-gQR_Pdg2IHCpLKgiAocx8sEvxukbgvwwCh-Odi8BRnAxXtB_PgNPvPqYsxYimXBmxLyIJ3Bnm--rbdJqe5o0Tnt-bcq_6IOCPBbrUcBPitgdgFjJYU',
        rating: 5,
      },
      {
        id: 'cali-premium',
        name: 'Cali Premium',
        price: 140,
        category: 'Sushi',
        description: 'Un clasico reinventado con cangrejo real, pepino y masago de alta calidad.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBqbhb59WqUoZCO4TEijkEk2wx5EysV23-ZYdS9JeR1jjJKZhHxO3M436eKRmKMmTwkJky5YxOcFdoT5X7Elo8WrcN_4p7iHQHrzwiepBeAhGqIP1P4qODfDyGQomBSZdYG9l51cBSx2NgmnFLecGyB6VE8E1nuG-kSSbx1_Ucuf1EB4JocR99276GMBxShw8WY1jhGKvzXIfpTyl0-nYuJ9ZER9OY15nlvPuken5BzWnV7ZLFm1LBYnrSkAXMnQUb3lvoz79Av7Zxt',
        rating: 4,
      },
    ],
  },
  {
    id: 'alitas',
    title: 'Wings & Flavors',
    items: [
      {
        id: 'atomic-habanero',
        name: 'Atomic Habanero',
        price: 165,
        category: 'Alitas',
        description: 'Nuestra salsa secreta extra picante con habanero tatemado y citricos.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCA1kt-acSuZCmGgwfSor7Mo9vbLzg1g1U67rBPysr6fC3APZABWcHDa9M5dtp5HPys2GpIXQUzbeJJkk5fRu4HZfouHPRnjqxeli9kl5_EE2IXyG6ggDozR3s-9T7ddY-OGnEq3MdtwfRx-dvlLLOL0axPGZZQLuCscHReByYXNp_Y5ZHmj9Xf2wEz3NZ1_iDMAXcq9z4-Ym-wonb2xxgtMe6pQcqXUf03WGwoCkG9z6B4A8H_4Qs-PB1fXZHmsdr6V2zYzAPHy6-x',
        badge: 'Picante',
        rating: 5,
      },
      {
        id: 'honey-roasted-garlic',
        name: 'Honey Roasted Garlic',
        price: 155,
        category: 'Alitas',
        description: 'Glaseado dulce de miel organica y ajo rostizado lentamente.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCHnHMU83s0anu5KcwhChuVo1l714z6sJCORBRiYBttW3CA_kJFtVZtNtFiiZS4rSTy6sQmpb3C1LlsdHakTV9wQ5zLSDyzmKWMPbDtFppbFAM7CgsSDhV5M-jLzkuz0B-pM9ho78tTiJR8f0IaOW0x9yoKreCdOrRJs-fqJezjTeilCTJPsJq7jT4w1uXeYWfaSbu4EsbOsAKvCDV6QM8ulVdDND-EEm9VTIZBcJoIYYEbZsnMLN2k4QNkwh7uxOtn4wHPeE93jtjh',
        rating: 4,
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
  'Agrega una orden de boneless para compartir.',
  'Combina tu rollo con una bebida premium y suma mas puntos.',
  'Pregunta por la promo activa del dia al finalizar tu pedido.',
];
