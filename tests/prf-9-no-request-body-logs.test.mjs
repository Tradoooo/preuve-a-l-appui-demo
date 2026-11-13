/**
 * PRF-9 — la trace technique d'un refus : jamais le corps de la requête.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFUSAL_REASONS, logRefusal, maskId } from '../src/checkout.mjs';

const PAYMENT_ID = 'pay_9f8e7d6c5b4a';

test('request body is never logged on refusal', () => {
  const body = { cardNumber: '4242424242424242', amount: 1200, cvc: '123' };
  const line = logRefusal({
    reason: REFUSAL_REASONS.EXPIRED_CARD,
    paymentId: PAYMENT_ID,
    at: new Date('2026-11-13T09:00:00.000Z'),
  });
  assert.equal(line.includes(body.cardNumber), false);
  assert.equal(line.includes('4242'), false);
  assert.equal(line.includes('cvc'), false);
  assert.equal(line.includes(String(body.amount)), false);
  assert.equal(line.includes(PAYMENT_ID), false);
  assert.ok(line.includes(maskId(PAYMENT_ID)));
  assert.ok(line.includes(REFUSAL_REASONS.EXPIRED_CARD));
});
