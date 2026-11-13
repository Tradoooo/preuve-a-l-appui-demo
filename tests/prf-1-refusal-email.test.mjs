/**
 * PRF-1 — le ticket vedette : le refus lui-même et sa trace.
 *
 * Ces deux tests sont cités par les preuves de PRF-1, la vedette du site de
 * démonstration. Ils vivent aussi sur `main` : c'est ce qui permet à l'app de
 * surveiller la preuve vivante du ticket après sa livraison.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFUSAL_REASONS, decidePayment, writeAuditLine } from '../src/checkout.mjs';

const NOW = new Date('2026-11-13T09:00:00.000Z');
const EXPIRED_CARD = {
  number: '4242424242424242',
  expiry: '10/2026',
  holder: 'Camille Dev',
  brand: 'visa',
};

test('checkout refuses an expired card', () => {
  const decision = decidePayment({ card: EXPIRED_CARD, amount: 1200, now: NOW });
  assert.equal(decision.status, 'refused');
  assert.equal(decision.reason, REFUSAL_REASONS.EXPIRED_CARD);
  assert.ok(decision.nextStep.length > 0);
});

test('checkout logs the refusal reason', () => {
  const decision = decidePayment({ card: EXPIRED_CARD, amount: 1200, now: NOW });
  const line = writeAuditLine({ refusal: decision, at: NOW });
  assert.ok(line.includes(REFUSAL_REASONS.EXPIRED_CARD));
  assert.ok(line.includes(NOW.toISOString()));
  assert.ok(line.includes('| refusal |'));
});
