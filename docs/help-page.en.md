# Help: your payment was refused

English twin of [`docs/aide-refus.md`](./aide-refus.md). Published so that the
acceptance criterion « La page d'aide est aussi publiée en anglais » of demo
ticket **PRF-5** has a real page behind it. The test that checks this page is
`tests/prf-5-help-page.test.mjs` (`help page is published in english`).

## Refusal reasons

| Reason (code) | What it means | What to do |
| --- | --- | --- |
| `card_expired` | The card reached the end of its validity period. | Update the expiry date or use another card. |
| `limit_exceeded` | The amount is above the refusal limit set on the account. | Lower the amount or split the payment. |
| `suspected_fraud` | The issuing bank asked for an extra confirmation. | Confirm your identity with the issuing bank. |

## What to do

1. Update your card details.
2. Try again with another payment method.
3. Contact support quoting the refusal reason.

## Timing

A refund, if any, arrives within 5 business days.

## What this page never says

The card number, even partially, and the body of the refused request: neither is
stored nor logged (see demo tickets **PRF-6** and **PRF-9**).
