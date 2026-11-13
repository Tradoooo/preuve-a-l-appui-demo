/**
 * Le mini-domaine « checkout » de la démonstration.
 *
 * Ce dépôt n'est pas une application : c'est la surface que les tests cités par
 * les preuves de « Fait, preuve à l'appui » exercent réellement. Chaque règle
 * vérifiée par un test correspond à un critère d'acceptation d'un ticket de
 * démonstration (voir le README pour la table test ↔ ticket).
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */

/** Les motifs de refus que le tunnel sait produire. */
export const REFUSAL_REASONS = Object.freeze({
  EXPIRED_CARD: 'card_expired',
  LIMIT_EXCEEDED: 'limit_exceeded',
  SUSPECTED_FRAUD: 'suspected_fraud',
});

/** La limite de refus par défaut, en centimes. */
export const DEFAULT_REFUSAL_THRESHOLD = 50000;

/**
 * La limite courante. Elle est relue à chaque décision — jamais au
 * chargement du module — donc un administrateur peut la changer à chaud.
 */
let refusalThreshold = DEFAULT_REFUSAL_THRESHOLD;

/** Lit la limite de refus courante. */
export function getRefusalThreshold() {
  return refusalThreshold;
}

/** Fixe la limite de refus (en centimes) et la renvoie. */
export function setRefusalThreshold(amount) {
  const value = Math.trunc(Number(amount));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('la limite de refus doit être un montant positif');
  }
  refusalThreshold = value;
  return refusalThreshold;
}

/** Remet la limite par défaut : utilisé entre deux tests. */
export function resetRefusalThreshold() {
  refusalThreshold = DEFAULT_REFUSAL_THRESHOLD;
  return refusalThreshold;
}

/** Les quatre derniers chiffres d'un numéro de carte. */
export function lastFourDigits(cardNumber) {
  const digits = String(cardNumber ?? '').replace(/\D/g, '');
  if (digits.length < 13) {
    throw new Error('numéro de carte illisible');
  }
  return digits.slice(-4);
}

/** Une carte est expirée à partir du premier jour du mois suivant son expiration. */
export function isExpiredCard(card, now = new Date()) {
  const expiry = String(card?.expiry ?? '');
  const parts = expiry.split('/');
  if (parts.length !== 2) return false;
  const month = Number(parts[0]);
  const year = Number(parts[1]);
  if (!Number.isFinite(month) || !Number.isFinite(year)) return false;
  if (month < 1 || month > 12) return false;
  const fullYear = year < 100 ? 2000 + year : year;
  const expiresAfter = Date.UTC(fullYear, month, 1);
  return now.getTime() >= expiresAfter;
}

/** Masque le nom du titulaire : « Camille Dev » devient « C. D. ». */
export function maskHolder(holder) {
  return String(holder ?? '')
    .split(/\s+/)
    .filter((part) => part !== '')
    .map((part) => `${part[0].toUpperCase()}.`)
    .join(' ');
}

/** La marche à suivre communiquée au client pour chaque motif. */
export const NEXT_STEPS = Object.freeze({
  card_expired: 'mettre à jour la date d expiration ou utiliser une autre carte',
  limit_exceeded: 'baisser le montant ou payer en plusieurs fois',
  suspected_fraud: 'confirmer l identite aupres de la banque emettrice',
});

/** La décision de refus, avec le motif et la marche à suivre. */
function refuse(reason, amount, detail) {
  return {
    status: 'refused',
    reason,
    amount,
    detail,
    nextStep: NEXT_STEPS[reason] ?? 'contacter le support',
  };
}

/**
 * Décide d'un paiement : refus sur carte expirée, puis sur dépassement de
 * limite, sinon acceptation.
 */
export function decidePayment({ card, amount, now = new Date() }) {
  const value = Math.trunc(Number(amount));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('montant de paiement invalide');
  }
  if (isExpiredCard(card, now)) {
    return refuse(REFUSAL_REASONS.EXPIRED_CARD, value, 'carte expiree au-delà de son mois de validité');
  }
  const threshold = getRefusalThreshold();
  if (value > threshold) {
    return refuse(REFUSAL_REASONS.LIMIT_EXCEEDED, value, `montant supérieur à la limite ${threshold}`);
  }
  return { status: 'accepted', amount: value, receipt: `rcpt-${value}` };
}

/** Construit l'e-mail de refus : destination, motif et marche à suivre. */
export function buildRefusalEmail(refusal) {
  const to = String(refusal.customerEmail ?? '').trim();
  if (to === '' || !to.includes('@')) {
    throw new Error('adresse du client invalide');
  }
  return {
    to,
    subject: `Votre paiement de ${refusal.amount} centimes a été refusé`,
    reason: refusal.reason,
    body: [
      `Motif du refus : ${refusal.reason}.`,
      `Ce qu'il faut faire : ${refusal.nextStep}.`,
      `Le montant n'a pas été débité.`,
    ].join('\n'),
  };
}

/**
 * Envoie l'e-mail de refus, une seule fois par refus : le second appel est
 * ignoré (c'est la non-régression du critère « un seul message »).
 */
export class RefusalNotifier {
  constructor({ transport } = {}) {
    this.delivered = new Set();
    this.outbox = [];
    this.transport = transport ?? ((email) => email);
  }

  /** Notifie un refus ; renvoie `{ sent, email }`. */
  notify(refusal) {
    const key = String(refusal.refusalId ?? `${refusal.customerEmail}:${refusal.reason}`);
    if (this.delivered.has(key)) {
      const already = this.outbox.find((email) => email.key === key);
      return { sent: false, email: already ?? null };
    }
    const email = buildRefusalEmail(refusal);
    this.delivered.add(key);
    this.outbox.push({ ...email, key });
    this.transport(email);
    return { sent: true, email };
  }
}

/** Une ligne de journal de refus : horodatage, motif, décision — rien d'autre. */
export function writeAuditLine({ refusal, at = new Date() }) {
  const stamp = new Date(at).toISOString();
  return `${stamp} | refusal | reason=${refusal.reason} | amount=${refusal.amount} | decision=${refusal.status}`;
}

/** Ce qui est conservé d'un moyen de paiement : marque, titulaire masqué, quatre derniers chiffres. */
export function storePayment({ card, now = new Date() }) {
  return {
    brand: String(card?.brand ?? 'unknown'),
    holder: maskHolder(card?.holder),
    last4: lastFourDigits(card?.number),
    storedAt: new Date(now).toISOString(),
  };
}

/** Masque un identifiant de paiement : ne garde que les quatre derniers caractères. */
export function maskId(id) {
  const value = String(id ?? '');
  if (value.length <= 4) return '****';
  return `****${value.slice(-4)}`;
}

/**
 * La trace technique d'un refus. Elle nomme le motif et l'identifiant masqué :
 * jamais le corps de la requête, jamais l'identifiant complet.
 */
export function logRefusal({ reason, paymentId, at = new Date() }) {
  const stamp = new Date(at).toISOString();
  return `${stamp} | refusal | payment=${maskId(paymentId)} | reason=${reason}`;
}

/** Le percentile d'un échantillon de durées (méthode du voisin le plus proche). */
export function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) throw new Error('échantillon vide');
  const rank = Math.max(0, Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[rank];
}
