/**
 * PRF-4 — le journal de refus : une ligne par refus, et rien de confidentiel.
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

test('every refusal writes an audit line', () => {
  const refusals = [
    decidePayment({ card: EXPIRED_CARD, amount: 1200, now: NOW }),
    decidePayment({ card: EXPIRED_CARD, amount: 999999, now: NOW }),
  ];
  assert.equal(refusals.length, 2);
  for (const refusal of refusals) {
    assert.equal(refusal.status, 'refused');
    const line = writeAuditLine({ refusal, at: NOW });
    assert.ok(line.includes('| refusal |'));
    assert.ok(line.includes(refusal.reason));
    assert.ok(line.includes(NOW.toISOString()));
  }
});

test('audit line holds no card number', () => {
  const refusal = decidePayment({ card: EXPIRED_CARD, amount: 1200, now: NOW });
  const line = writeAuditLine({ refusal, at: NOW });
  assert.equal(line.includes(EXPIRED_CARD.number), false);
  assert.equal(line.includes('4242'), false);
  assert.equal(line.includes('Camille'), false);
  assert.ok(line.includes(REFUSAL_REASONS.EXPIRED_CARD));
});
