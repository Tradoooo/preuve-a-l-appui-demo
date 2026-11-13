/**
 * PRF-2 — l'e-mail de refus : il part, et il ne part qu'une fois.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFUSAL_REASONS, RefusalNotifier } from '../src/checkout.mjs';

const REFUSAL = {
  refusalId: 'ref-0001',
  customerEmail: 'client@example.com',
  reason: REFUSAL_REASONS.LIMIT_EXCEEDED,
  amount: 60000,
  nextStep: 'baisser le montant ou payer en plusieurs fois',
};

test('refusal email reaches the customer', () => {
  const notifier = new RefusalNotifier();
  const { sent, email } = notifier.notify(REFUSAL);
  assert.equal(sent, true);
  assert.equal(email.to, 'client@example.com');
  assert.ok(email.body.includes(REFUSAL.reason));
  assert.ok(email.body.includes('baisser le montant'));
  assert.ok(email.subject.includes('refusé'));
});

test('refusal email is sent only once', () => {
  const notifier = new RefusalNotifier();
  notifier.notify(REFUSAL);
  const second = notifier.notify(REFUSAL);
  assert.equal(second.sent, false);
  assert.equal(notifier.outbox.length, 1);
});
