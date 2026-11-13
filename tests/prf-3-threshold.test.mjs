/**
 * PRF-3 — la limite de refus, réglable par un administrateur.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  REFUSAL_REASONS,
  decidePayment,
  getRefusalThreshold,
  resetRefusalThreshold,
  setRefusalThreshold,
} from '../src/checkout.mjs';

const VALID_CARD = {
  number: '4242424242424242',
  expiry: '12/2030',
  holder: 'Camille Dev',
  brand: 'visa',
};
const NOW = new Date('2026-11-13T09:00:00.000Z');

test('administrator sets the refusal threshold', () => {
  resetRefusalThreshold();
  try {
    setRefusalThreshold(100000);
    assert.equal(getRefusalThreshold(), 100000);
    const accepted = decidePayment({ card: VALID_CARD, amount: 90000, now: NOW });
    assert.equal(accepted.status, 'accepted');
    const refused = decidePayment({ card: VALID_CARD, amount: 120000, now: NOW });
    assert.equal(refused.status, 'refused');
    assert.equal(refused.reason, REFUSAL_REASONS.LIMIT_EXCEEDED);
  } finally {
    resetRefusalThreshold();
  }
});
