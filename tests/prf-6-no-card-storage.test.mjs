/**
 * PRF-6 — le moyen de paiement conservé : jamais le numéro, seulement la fin.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { storePayment } from '../src/checkout.mjs';

const CARD = {
  number: '4242424242424242',
  expiry: '12/2030',
  holder: 'Camille Dev',
  brand: 'visa',
};
const NOW = new Date('2026-11-13T09:00:00.000Z');

test('card number is never persisted', () => {
  const stored = storePayment({ card: CARD, now: NOW });
  const serialized = JSON.stringify(stored);
  assert.equal(serialized.includes(CARD.number), false);
  assert.equal(serialized.includes('42424242'), false);
  assert.equal(Object.keys(stored).includes('number'), false);
  assert.equal(Object.keys(stored).includes('card'), false);
  assert.equal(
    Object.values(stored).some((value) => String(value).includes(CARD.number)),
    false,
  );
});

test('stored payment holds only the last four digits', () => {
  const stored = storePayment({ card: CARD, now: NOW });
  assert.equal(stored.last4, '4242');
  assert.equal(stored.last4.length, 4);
  assert.equal(stored.holder, 'C. D.');
  assert.equal(stored.brand, 'visa');
  for (const value of Object.values(stored)) {
    assert.equal(/\d{5,}/.test(String(value)), false);
  }
});
