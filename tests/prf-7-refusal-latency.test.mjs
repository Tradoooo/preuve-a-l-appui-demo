/**
 * PRF-7 — la latence du refus : p95 sous 200 ms.
 *
 * C'est le test qui disparaît de `main` dans l'état « régressé » : la preuve
 * vivante du critère tombe, et l'app rouvre le ticket PRF-7.
 *
 * Règle : fichiers < 500 lignes, fonctions < 50 lignes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decidePayment, percentile } from '../src/checkout.mjs';

const NOW = new Date('2026-11-13T09:00:00.000Z');
const EXPIRED_CARD = {
  number: '4242424242424242',
  expiry: '10/2026',
  holder: 'Camille Dev',
  brand: 'visa',
};
const BUDGET_MS = 200;
const SAMPLES = 200;

test('refusal answers in under 200 ms at p95', () => {
  const durations = [];
  for (let index = 0; index < SAMPLES; index += 1) {
    const start = performance.now();
    const decision = decidePayment({ card: EXPIRED_CARD, amount: 1200, now: NOW });
    durations.push(performance.now() - start);
    assert.equal(decision.status, 'refused');
  }
  const p95 = percentile(durations, 95);
  assert.ok(p95 < BUDGET_MS, `p95 = ${p95.toFixed(3)} ms, budget = ${BUDGET_MS} ms`);
});
