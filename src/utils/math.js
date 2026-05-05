export const calcItem = (food, grams) => {
  const f = grams / 100;
  return {
    foodId: food.id,
    foodName: food.nombre,
    grams,
    kcal: +(food.energia_kcal * f).toFixed(1),
    proteinas_g: +(food.proteinas_g * f).toFixed(2),
    lipidos_g: +(food.lipidos_g * f).toFixed(2),
    hidratos_g: +(food.hidratos_g * f).toFixed(2),
    fibra_g: +(food.fibra_g * f).toFixed(2),
    calcio_mg: +(food.calcio_mg * f).toFixed(1),
    hierro_mg: +(food.hierro_mg * f).toFixed(2),
    sodio_mg: +(food.sodio_mg * f).toFixed(1),
  };
};

export const sumItems = (items) =>
  items.reduce(
    (a, i) => ({
      kcal: a.kcal + i.kcal,
      proteinas_g: a.proteinas_g + i.proteinas_g,
      lipidos_g: a.lipidos_g + i.lipidos_g,
      hidratos_g: a.hidratos_g + i.hidratos_g,
      fibra_g: a.fibra_g + i.fibra_g,
      calcio_mg: a.calcio_mg + (i.calcio_mg || 0),
      hierro_mg: a.hierro_mg + (i.hierro_mg || 0),
      sodio_mg: a.sodio_mg + (i.sodio_mg || 0),
    }),
    {
      kcal: 0,
      proteinas_g: 0,
      lipidos_g: 0,
      hidratos_g: 0,
      fibra_g: 0,
      calcio_mg: 0,
      hierro_mg: 0,
      sodio_mg: 0,
    }
  );

export const calcDist = (p, l, h) => {
  const kp = p * 4,
    kl = l * 9,
    kh = h * 4,
    vct = kp + kl + kh;
  return {
    VCT: +vct.toFixed(1),
    pctP: vct > 0 ? +(kp / vct * 100).toFixed(1) : 0,
    pctL: vct > 0 ? +(kl / vct * 100).toFixed(1) : 0,
    pctH: vct > 0 ? +(kh / vct * 100).toFixed(1) : 0,
  };
};

export const getAge = (bd) => {
  const t = new Date(),
    b = new Date(bd);
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
};

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const calcIMC = (w, h) => {
  const hm = h / 100,
    i = w / (hm * hm);
  let cat, col;
  if (i < 18.5) {
    cat = 'Bajo peso';
    col = '#3b82f6';
  } else if (i < 25) {
    cat = 'Normal';
    col = '#22c55e';
  } else if (i < 30) {
    cat = 'Sobrepeso';
    col = '#f59e0b';
  } else if (i < 35) {
    cat = 'Obesidad I';
    col = '#ef4444';
  } else if (i < 40) {
    cat = 'Obesidad II';
    col = '#dc2626';
  } else {
    cat = 'Obesidad III';
    col = '#991b1b';
  }
  return { imc: +i.toFixed(1), cat, col };
};

export const ACTIVITY_LABELS = {
  SEDENTARIO: 'Sedentario',
  LIGERO: 'Ligero',
  MODERADO: 'Moderado',
  INTENSO: 'Intenso',
  MUY_INTENSO: 'Muy intenso',
};
