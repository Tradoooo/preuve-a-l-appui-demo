/**
 * La page d'aide sur le refus : les motifs, la marche à suivre, le délai.
 *
 * Elle est publiée en français et en anglais ; le test du ticket PRF-5 vérifie
 * que les deux versions listent bien tous les motifs de refus.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { REFUSAL_REASONS } from './checkout.mjs';

/** Un motif de refus, expliqué au client. */
function motif(reason, explanation) {
  return { reason, explanation };
}

/** La page d'aide française. */
export const HELP_PAGE_FR = Object.freeze({
  locale: 'fr',
  title: 'Votre paiement a été refusé : que faire ?',
  motifs: [
    motif(REFUSAL_REASONS.EXPIRED_CARD, 'La carte est arrivée à la fin de sa période de validité.'),
    motif(REFUSAL_REASONS.LIMIT_EXCEEDED, 'Le montant dépasse la limite de refus fixée pour votre compte.'),
    motif(REFUSAL_REASONS.SUSPECTED_FRAUD, 'Votre banque a demandé une confirmation supplémentaire.'),
  ],
  steps: [
    'Mettez à jour les informations de votre carte.',
    'Réessayez avec un autre moyen de paiement.',
    'Contactez le support en citant le motif du refus.',
  ],
  delay: 'Le remboursement, le cas échéant, arrive sous 5 jours ouvrés.',
});

/** La page d'aide anglaise : même contenu, même liste de motifs. */
export const HELP_PAGE_EN = Object.freeze({
  locale: 'en',
  title: 'Your payment was refused: what to do',
  motifs: [
    motif(REFUSAL_REASONS.EXPIRED_CARD, 'The card reached the end of its validity period.'),
    motif(REFUSAL_REASONS.LIMIT_EXCEEDED, 'The amount is above the refusal limit set on your account.'),
    motif(REFUSAL_REASONS.SUSPECTED_FRAUD, 'Your bank asked for an extra confirmation.'),
  ],
  steps: [
    'Update your card details.',
    'Try again with another payment method.',
    'Contact support quoting the refusal reason.',
  ],
  delay: 'A refund, if any, arrives within 5 business days.',
});

/** Les deux versions publiées, indexées par locale. */
export const HELP_PAGES = Object.freeze({ fr: HELP_PAGE_FR, en: HELP_PAGE_EN });
