export type TxInput = {
  TransactionAmt: number;
  ProductCD: string;
  card1: number;
  card2: number;
  card3: number;
  card4: string;
  addr1: number;
  dist1: number;
  P_emaildomain: string;
  C1: number;
  C13: number;
  C14: number;
  DeviceType: string;
  hour: number;
  hasIdentity: boolean;
};

export type Preset = { id: string; label: string; blurb: string; tx: TxInput };

export const presets: Preset[] = [
  {
    id: "normal",
    label: "Normal Domestic Purchase",
    blurb: "Repeat customer, daytime, known debit card, low velocity.",
    tx: {
      TransactionAmt: 64.95,
      ProductCD: "W",
      card1: 13926,
      card2: 361,
      card3: 150,
      card4: "visa",
      addr1: 315,
      dist1: 12,
      P_emaildomain: "gmail.com",
      C1: 1,
      C13: 2,
      C14: 1,
      DeviceType: "desktop",
      hour: 14,
      hasIdentity: false,
    },
  },
  {
    id: "velocity",
    label: "High-Velocity Digital Product",
    blurb: "ProductCD = C with a burst of counts on one card.",
    tx: {
      TransactionAmt: 249.0,
      ProductCD: "C",
      card1: 9500,
      card2: 111,
      card3: 150,
      card4: "mastercard",
      addr1: 204,
      dist1: 0,
      P_emaildomain: "protonmail.com",
      C1: 28,
      C13: 41,
      C14: 22,
      DeviceType: "mobile",
      hour: 2,
      hasIdentity: true,
    },
  },
  {
    id: "foreign",
    label: "Suspicious Foreign IP / Unknown Card",
    blurb: "Large distance, unseen card BIN, anonymous email.",
    tx: {
      TransactionAmt: 780.0,
      ProductCD: "C",
      card1: 18333,
      card2: 512,
      card3: 185,
      card4: "discover",
      addr1: 487,
      dist1: 1940,
      P_emaildomain: "mail.com",
      C1: 9,
      C13: 14,
      C14: 7,
      DeviceType: "mobile",
      hour: 3,
      hasIdentity: true,
    },
  },
  {
    id: "wire",
    label: "Midnight Large Wire",
    blurb: "Very high amount at 00:40, credit card, new address.",
    tx: {
      TransactionAmt: 3250.0,
      ProductCD: "R",
      card1: 7440,
      card2: 225,
      card3: 150,
      card4: "mastercard",
      addr1: 299,
      dist1: 640,
      P_emaildomain: "outlook.com",
      C1: 4,
      C13: 6,
      C14: 3,
      DeviceType: "desktop",
      hour: 0,
      hasIdentity: true,
    },
  },
];

const riskyEmails = ["mail.com", "protonmail.com", "outlook.com", "aol.com"];

export type RiskFactor = { label: string; weight: number; detail: string };

export function scoreTransaction(tx: TxInput) {
  const factors: RiskFactor[] = [];
  let logit = -3.4;

  const amtTerm = Math.log1p(tx.TransactionAmt) * 0.42;
  logit += amtTerm;
  if (tx.TransactionAmt > 500)
    factors.push({
      label: "High transaction amount",
      weight: amtTerm,
      detail: "Fraud median is $126 vs $68.50 legitimate; tail risk rises above $500.",
    });

  const productWeights: Record<string, number> = { W: -0.35, C: 1.55, R: 0.25, H: 0.45, S: 0.6 };
  const p = productWeights[tx.ProductCD] ?? 0;
  logit += p;
  if (p > 0.4)
    factors.push({
      label: "ProductCD = " + tx.ProductCD,
      weight: p,
      detail: "ProductCD C carries an 11.7% fraud rate vs 2.0% for W.",
    });

  const velocity = (tx.C1 + tx.C13 + tx.C14) / 3;
  const vTerm = Math.min(1.9, velocity * 0.075);
  logit += vTerm;
  if (velocity > 8)
    factors.push({
      label: "Card/address velocity (C1, C13, C14)",
      weight: vTerm,
      detail: "Mean count " + velocity.toFixed(1) + " — repeated use of the same card or address.",
    });

  const dTerm = tx.dist1 > 500 ? 0.85 : tx.dist1 > 100 ? 0.35 : -0.15;
  logit += dTerm;
  if (dTerm > 0.3)
    factors.push({
      label: "Large billing/shipping distance",
      weight: dTerm,
      detail: "dist1 = " + tx.dist1 + " suggests a geography mismatch.",
    });

  const nightTerm = tx.hour <= 5 ? 0.75 : tx.hour >= 21 ? 0.25 : -0.1;
  logit += nightTerm;
  if (nightTerm > 0.2)
    factors.push({
      label: "Off-hours timing",
      weight: nightTerm,
      detail: "Hourly fraud rate peaks near 04:00 (5.5%) vs 2.1% midday.",
    });

  const idTerm = tx.hasIdentity ? 0.95 : -0.25;
  logit += idTerm;
  if (tx.hasIdentity)
    factors.push({
      label: "Identity record attached",
      weight: idTerm,
      detail: "has_identity = 1 rows show a 10.2% fraud rate vs 2.0% without.",
    });

  const emailTerm = riskyEmails.includes(tx.P_emaildomain) ? 0.55 : -0.1;
  logit += emailTerm;
  if (emailTerm > 0)
    factors.push({
      label: "Elevated-risk email domain",
      weight: emailTerm,
      detail: tx.P_emaildomain + " over-indexes in the fraud population.",
    });

  const cardTerm = tx.card4 === "discover" ? 0.5 : tx.card4 === "mastercard" ? 0.2 : 0.0;
  logit += cardTerm;

  const deviceTerm = tx.DeviceType === "mobile" ? 0.3 : 0;
  logit += deviceTerm;

  const probability = 1 / (1 + Math.exp(-logit));
  const tier = probability >= 0.6 ? "HIGH RISK" : probability >= 0.3 ? "SUSPICIOUS" : "LOW RISK";

  return {
    probability,
    tier: tier as "LOW RISK" | "SUSPICIOUS" | "HIGH RISK",
    factors: factors.sort((a, b) => b.weight - a.weight).slice(0, 5),
  };
}
